import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
  state: z.string().length(2),
  postalCode: z.string().min(5),
  dateOfBirth: z.string(),
  ssn: z.string().length(4),
  country: z.string().optional(),
});
