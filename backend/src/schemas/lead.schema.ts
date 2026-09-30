import { z } from "zod";

export const createLeadSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid().optional(),
    name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(8, "Phone number must be at least 8 digits")
      .max(20, "Phone number is too long")
      .regex(/^[+0-9\s\-()]+$/, "Phone number contains invalid characters"),
    message: z.string().trim().min(5, "Inquiry message must be at least 5 characters").max(2000),
    interestedIn: z.string().trim().max(100).optional(),
    budgetRange: z.string().trim().max(100).optional(),
    _hp: z.string().optional(), // Honeypot field (must be empty)
    _timestamp: z.union([z.number(), z.string()]).optional(),
  }),
});
