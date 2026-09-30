import { z } from "zod";

export const createSiteVisitSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid("Property ID must be a valid UUID"),
    visitorName: z.string().min(2, "Name must be at least 2 characters"),
    visitorEmail: z.string().email("Invalid email address"),
    visitorPhone: z.string().min(8, "Phone number is required"),
    visitDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid visit date"),
    timeSlot: z.string().min(2, "Time slot is required (e.g. 10:00 AM - 12:00 PM)"),
    notes: z.string().optional(),
  }),
});

export const updateVisitStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  }),
});
