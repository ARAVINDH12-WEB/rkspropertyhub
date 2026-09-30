import { z } from "zod";

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.enum(["PLOT", "VILLA", "APARTMENT", "COMMERCIAL"]),
    price: z.number().positive("Price must be positive"),
    pricePerSqFt: z.number().positive("Price per SqFt must be positive"),
    areaSqFt: z.number().positive("Area SqFt must be positive"),
    location: z.string().min(2, "Location is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().min(4, "Pincode is required"),
    address: z.string().min(5, "Address is required"),
    bedrooms: z.number().int().optional(),
    bathrooms: z.number().int().optional(),
    isTitleVerified: z.boolean().optional().default(true),
    verificationDoc: z.string().optional(),
    heroImage: z.string().url("Hero image must be a valid URL"),
    images: z.array(z.string()).min(1, "At least 1 image is required"),
    amenities: z.array(z.string()).optional().default([]),
    facing: z.string().optional(),
    ownershipType: z.string().optional().default("Freehold"),
    gatedCommunity: z.boolean().optional().default(true),
    featured: z.boolean().optional().default(false),
  }),
});

export const propertyQuerySchema = z.object({
  query: z.object({
    type: z.enum(["PLOT", "VILLA", "APARTMENT", "COMMERCIAL"]).optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    city: z.string().optional(),
    bedrooms: z.string().optional(),
    isTitleVerified: z.string().optional(),
    search: z.string().optional(),
    featured: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(["price_asc", "price_desc", "newest"]).optional(),
  }),
});
