import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/db";
import { config } from "@/config";
import { encrypt } from "@/utils/encryption";
import { z } from "zod";
import { authSchema } from "@/validators/auth.schema";

type SignUpInput = z.infer<typeof authSchema>;

export const authService = {
  async signUp(data: SignUpInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const addressString = JSON.stringify({
      address1: data.address,
      state: data.state,
      postalCode: data.postalCode,
      city: "US",
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
      expiresIn: "1d",
    });

    return { user: newUser, token };
  },

  async signIn(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "1d",
    });

    return { user, token };
  },

  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
  },
};
