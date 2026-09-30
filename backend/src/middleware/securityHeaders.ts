import { Request, Response, NextFunction } from "express";
import helmet from "helmet";

/**
 * HTTPS Enforcement middleware.
 * In production, redirects any unencrypted HTTP traffic to HTTPS.
 */
export function enforceHttps(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === "production") {
    const proto = req.headers["x-forwarded-proto"];
    if (proto && proto !== "https") {
      return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    }
  }
  next();
}

/**
 * Enterprise Security Headers using Helmet with customized Content-Security-Policy (CSP),
 * HSTS, and frame protection.
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Needed for Vite development and dynamic client hydration
        "https://cdnjs.cloudflare.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // For Tailwind CSS and dynamic styles
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "data:",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:", // Allow verified image CDNs (Pexels, Unsplash, Cloudinary, AWS S3)
        "blob:",
      ],
      connectSrc: [
        "'self'",
        "http://localhost:*",
        "https://*.rksrealty.in",
        "https://api.stripe.com",
      ],
      frameSrc: [
        "'self'",
        "https://www.google.com/maps/",
        "https://js.stripe.com",
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: "sameorigin", // Prevent clickjacking
  },
  noSniff: true, // Prevent MIME type sniffing
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
  permittedCrossDomainPolicies: {
    permittedPolicies: "none",
  },
});
