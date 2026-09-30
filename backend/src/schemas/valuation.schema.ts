import { z } from "zod";

export const createValuationLeadSchema = z.object({
  body: z.object({
    propertyType: z.enum(["PLOT", "VILLA", "APARTMENT", "COMMERCIAL"], {
      errorMap: () => ({ message: "Property type must be PLOT, VILLA, APARTMENT, or COMMERCIAL" }),
    }),
    address: z.string().trim().min(5, "Address must be at least 5 characters").max(255),
    city: z.string().trim().min(2, "City is required").max(100),
    sizeSqFt: z.number().positive("Property size must be greater than 0"),
    bedrooms: z.number().int().nonnegative().optional(),
    bathrooms: z.number().int().nonnegative().optional(),
    expectedPrice: z.number().positive().optional(),
    ownerName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
    ownerEmail: z.string().trim().toLowerCase().email("Please provide a valid email address"),
    ownerPhone: z
      .string()
      .trim()
      .min(8, "Phone number must be at least 8 digits")
      .max(20)
      .regex(/^[+0-9\s\-()]+$/, "Phone number contains invalid characters"),
    condition: z.enum(["EXCELLENT", "GOOD", "NEEDS_RENOVATION", "RAW_LAND"]).optional(),
    notes: z.string().trim().max(1000).optional(),
    _hp: z.string().optional(),
    _timestamp: z.union([z.number(), z.string()]).optional(),
  }),
});
