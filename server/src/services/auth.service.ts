import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/db";
import { config } from "@/config";
import { encrypt } from "@/utils/encryption";
import { authSchema } from "@/validators/auth.schema";
import { emailService } from "./email.service";

type SignUpInput = z.infer<typeof authSchema>;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

// Creates a new user account with encrypted PII and generates an access token.
export const signUp = async (data: SignUpInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const addressString = JSON.stringify({
    address1: data.address,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
  });

  const encryptedAddress = encrypt(addressString);
  const encryptedDob = encrypt(data.dateOfBirth);
  const encryptedSsn = encrypt(data.ssn);

  const passwordHash = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      address: encryptedAddress,
      dateOfBirth: encryptedDob,
      identityDocumentId: encryptedSsn,
      country: data.country || "US",
    },
  });

  const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, {
    expiresIn: "15m", // Short-lived access token
  });

  return { user: newUser, token };
};

// Authenticates a user and generates an access token with account lockout.
export const signIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Use generic error to prevent email enumeration
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesRemaining = Math.ceil(
      (user.lockedUntil.getTime() - Date.now()) / (1000 * 60)
    );
    throw new Error(
      `Account is locked. Please try again in ${minutesRemaining} minutes.`
    );
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    // Increment failed attempts
    const failedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = failedAttempts >= MAX_FAILED_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: failedAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000)
          : null,
      },
    });

    if (shouldLock) {
      throw new Error(
        `Too many failed attempts. Account locked for ${LOCKOUT_DURATION_MINUTES} minutes.`
      );
    }

    throw new Error("Invalid credentials");
  }

  // Reset failed attempts on successful login
  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: "15m", // Short-lived access token
  });

  return { user, token };
};

// Retrieves a user by ID with basic profile information.
export const getUserById = async (
  userId: string
): Promise<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
} | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true },
  });
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

// Creates a new session with refresh token for a user.
export const createSession = async (
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> => {
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    },
  });

  return refreshToken;
};

// Validates a refresh token and returns the associated session .
export const validateRefreshToken = async (
  refreshToken: string
): Promise<
  | (Awaited<ReturnType<typeof prisma.session.findUnique>> & {
      user: Awaited<ReturnType<typeof prisma.user.findUnique>>;
    })
  | null
> => {
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    // Clean up expired session
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
};

// Rotates a refresh token by invalidating the old one and creating a new session.
export const rotateRefreshToken = async (
  oldRefreshToken: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string | null> => {
  const session = await validateRefreshToken(oldRefreshToken);

  if (!session) {
    return null;
  }

  await prisma.session.delete({ where: { id: session.id } });

  const newRefreshToken = await createSession(
    session.userId,
    userAgent,
    ipAddress
  );

  return newRefreshToken;
};

export const invalidateAllSessions = async (
  userId: string
): Promise<number> => {
  const result = await prisma.session.deleteMany({
    where: { userId },
  });

  return result.count;
};

// Changes a user's password after verifying the current password.
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!isValidPassword) {
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(12);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  // Force re-login by invalidating all sessions
  await invalidateAllSessions(userId);

  return true;
};

// Updates user profile information
export const updateProfile = async (
  userId: string,
  data: { firstName?: string; lastName?: string }
): Promise<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  return user;
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Fail silently to prevent enumeration
    return;
  }

  const token = jwt.sign(
    { userId: user.id, purpose: "password_reset" },
    config.jwtSecret,
    { expiresIn: "1h" }
  );

  await emailService.sendPasswordResetEmail(user.email, token);
};

export const resetPasswordWithToken = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      purpose: string;
    };

    if (decoded.purpose !== "password_reset") {
      throw new Error("Invalid token purpose");
    }

    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate sessions
    await invalidateAllSessions(decoded.userId);
  } catch (error) {
    throw new Error("Invalid or expired password reset token");
  }
};

export const sendVerification = async (userId: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign(
    { userId: user.id, purpose: "email_verification" },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  await emailService.sendVerificationEmail(user.email, token);
};

export const authService = {
  signUp,
  signIn,
  getUserById,
  generateRefreshToken,
  createSession,
  validateRefreshToken,
  rotateRefreshToken,
  invalidateAllSessions,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPasswordWithToken,
  sendVerification,
};
