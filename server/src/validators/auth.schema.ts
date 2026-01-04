import { z } from "zod";

// Password validation regex patterns.
const passwordPatterns = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

// Sign-up validation schema.
export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordPatterns.uppercase,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      passwordPatterns.lowercase,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      passwordPatterns.number,
      "Password must contain at least one number"
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().length(2, "State must be exactly 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  dateOfBirth: z.string(),
  ssn: z.string().length(4, "SSN must be exactly 4 digits"),
  country: z.string().optional(),
});

// Sign-in validation schema.
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordPatterns.uppercase, "Must contain uppercase letter")
    .regex(passwordPatterns.lowercase, "Must contain lowercase letter")
    .regex(passwordPatterns.number, "Must contain number"),
});
