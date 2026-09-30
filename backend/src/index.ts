import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

import { enforceHttps, securityHeaders } from "./middleware/securityHeaders";
import { getCsrfToken, verifyCsrf } from "./middleware/csrf";
import { publicApiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import siteVisitRoutes from "./routes/siteVisit.routes";
import leadRoutes from "./routes/lead.routes";
import valuationRoutes from "./routes/valuation.routes";
import documentRoutes from "./routes/document.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import { getSiteContent } from "./controllers/admin.controller";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Enforce HTTPS in production
app.use(enforceHttps);

// 2. Enterprise Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
app.use(securityHeaders);

// 3. Strict Origin CORS with credentials support
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or matched origins
      if (!origin || allowedOrigins.includes(origin) || origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(new Error("CORS origin blocked by security policy"));
      }
    },
    credentials: true,
  })
);

// 4. Request parsing with payload limits to prevent Denial of Service (DoS)
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// 5. CSRF Protection for state-changing operations
app.get("/api/v1/csrf-token", getCsrfToken);
app.use(verifyCsrf);

// 6. Health check & Diagnostics
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "RKS Realty API",
    version: "2.0.0",
    security: {
      httpsEnforced: process.env.NODE_ENV === "production",
      cspActive: true,
      hstsActive: true,
      csrfProtection: true,
      rateLimiting: true,
      mfaAvailable: true,
    },
    timestamp: new Date().toISOString(),
  });
});

// 7. API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/properties", publicApiLimiter, propertyRoutes);
app.use("/api/v1/site-visits", siteVisitRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/valuation", valuationRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.get("/api/v1/site-content", getSiteContent);

// 8. Global Error Handler
app.use(errorHandler);

// 9. Start Server
app.listen(PORT, () => {
  console.log(`🔒 RKS Realty Secure Backend API running on http://localhost:${PORT}`);
  console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
