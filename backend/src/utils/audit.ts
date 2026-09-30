import { Request } from "express";
import { prisma } from "../config/db";

interface AuditLogParams {
  userId?: string | null;
  action: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any> | string;
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    const detailsString =
      typeof params.details === "object"
        ? JSON.stringify(params.details)
        : params.details || null;

    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        ip: params.ip || null,
        userAgent: params.userAgent || null,
        details: detailsString,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

export function getClientInfo(req: Request) {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    req.ip ||
    "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  return { ip, userAgent };
}
