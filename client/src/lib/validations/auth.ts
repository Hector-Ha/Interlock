import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  address1: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  state: z.string().trim().length(2, "State must be 2 characters (e.g., NY)"),
  postalCode: z
    .string()
    .trim()
    .min(5, "Postal code must be at least 5 characters"),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs); // miliseconds from epoch
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 18;
  }, "You must be at least 18 years old"),
  ssn: z
    .string()
    .trim()
    .length(4, "Please provide the last 4 digits of your SSN"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
