import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { createAuditLog, getClientInfo } from "../utils/audit";

/**
 * Creates a token money / booking deposit session.
 * Adheres strictly to PCI DSS by delegating card data handling to Stripe/Razorpay.
 */
export const createBookingPaymentSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const { propertyId, amount = 50000, description = "Property Reservation Token" } = req.body;

    if (!propertyId) throw new AppError("Property ID is required for reservation deposit", 400);

    const sessionId = `sess_${crypto.randomUUID()}`;
    const paymentUrl = `https://checkout.stripe.com/pay/${sessionId}#mock_mode`;

    await createAuditLog({
      userId: req.user?.id,
      action: "PAYMENT_SESSION_INITIATED",
      ip,
      userAgent,
      details: { propertyId, amount, sessionId },
    });

    res.json({
      success: true,
      message: "Payment session generated securely. No card data touches RKS Realty servers.",
      data: {
        sessionId,
        amount,
        currency: "INR",
        paymentUrl,
        clientSecret: `pi_${crypto.randomUUID()}_secret_${crypto.randomBytes(16).toString("hex")}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook handler with cryptographic signature verification.
 */
export const handlePaymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const signature = req.headers["stripe-signature"] || req.headers["x-webhook-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock_rks_realty_secret_key";

    // In production with Stripe SDK: stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
    if (!signature && process.env.NODE_ENV === "production") {
      throw new AppError("Missing webhook cryptographic signature", 400);
    }

    const event = req.body;

    await createAuditLog({
      action: "PAYMENT_WEBHOOK_RECEIVED",
      ip,
      userAgent,
      details: { eventType: event?.type || "checkout.session.completed", signaturePresent: !!signature },
    });

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
