import { z } from "zod";

export const mortgageCalculatorSchema = z.object({
  body: z.object({
    propertyPrice: z.number().positive("Property price must be greater than 0"),
    downPayment: z.number().min(0, "Down payment cannot be negative"),
    interestRateAnnual: z
      .number()
      .min(1, "Interest rate must be at least 1%")
      .max(30, "Interest rate cannot exceed 30%"),
    loanTenureYears: z
      .number()
      .int()
      .min(1, "Tenure must be at least 1 year")
      .max(40, "Tenure cannot exceed 40 years"),
    propertyTaxAnnual: z.number().min(0).optional().default(0),
    homeInsuranceAnnual: z.number().min(0).optional().default(0),
    monthlyMaintenance: z.number().min(0).optional().default(0),
  }),
});
