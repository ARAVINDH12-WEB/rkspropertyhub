import { Router } from "express";
import {
  createBookingPaymentSession,
  handlePaymentWebhook,
} from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Create booking deposit checkout session (requires login)
router.post("/create-session", authenticate, createBookingPaymentSession);

// Webhook listener (receives payment provider events)
router.post("/webhook", handlePaymentWebhook);

export default router;
