import { z } from "zod";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+={}[\]:;"'<>,./~`|\\])[A-Za-z\d@$!%*?&#^()_\-+={}[\]:;"'<>,./~`|\\]{8,}$/;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        strongPasswordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    phone: z.string().trim().optional(),
    role: z.enum(["BUYER", "AGENT", "ADMIN"]).optional().default("BUYER"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    mfaToken: z.string().optional(), // 6-digit TOTP code if user has MFA enabled
  }),
});

export const mfaVerifySchema = z.object({
  body: z.object({
    token: z.string().length(6, "MFA code must be exactly 6 digits").regex(/^\d+$/, "MFA code must contain only numbers"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        strongPasswordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }),
});
