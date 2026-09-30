import { Router } from "express";
import {
  calculateMortgage,
  createValuationLead,
  listValuationLeads,
} from "../controllers/valuation.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";
import { leadFormLimiter, publicApiLimiter } from "../middleware/rateLimiter";
import { verifyBotProtection } from "../middleware/csrf";
import { mortgageCalculatorSchema } from "../schemas/calculator.schema";
import { createValuationLeadSchema } from "../schemas/valuation.schema";

const router = Router();

// Public calculation endpoint with rate limiting
router.post(
  "/calculator",
  publicApiLimiter,
  validate(mortgageCalculatorSchema),
  calculateMortgage
);

// Public seller lead submission with rate limiting and bot honeypot protection
router.post(
  "/valuation-leads",
  leadFormLimiter,
  verifyBotProtection,
  validate(createValuationLeadSchema),
  createValuationLead
);

// Protected agent & admin review
router.get(
  "/valuation-leads",
  authenticate,
  authorize("AGENT", "ADMIN"),
  listValuationLeads
);

export default router;
