import { Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { createAuditLog, getClientInfo } from "../utils/audit";

export const uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    if (!req.file) {
      throw new AppError("No file uploaded or file rejected by security filter", 400);
    }

    const { docType = "OTHER", propertyId } = req.body;

    const doc = await prisma.documentUpload.create({
      data: {
        userId: req.user?.id || null,
        propertyId: propertyId || null,
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        docType,
        filePath: req.file.path,
      },
    });

    await createAuditLog({
      userId: req.user?.id,
      action: "DOCUMENT_UPLOADED",
      ip,
      userAgent,
      details: { docId: doc.id, docType, originalName: req.file.originalname, size: req.file.size },
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully and verified against security policy.",
      data: {
        id: doc.id,
        originalName: doc.originalName,
        docType: doc.docType,
        size: doc.size,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const where: any = {};
    if (req.user?.role === "BUYER") {
      where.userId = req.user.id;
    }

    const docs = await prisma.documentUpload.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        originalName: true,
        docType: true,
        mimeType: true,
        size: true,
        propertyId: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { ip, userAgent } = getClientInfo(req);
  try {
    const { id } = req.params;
    const doc = await prisma.documentUpload.findUnique({ where: { id } });

    if (!doc) throw new AppError("Document not found", 404);

    // Only Admin, Agent, or the owning user can download
    if (req.user?.role === "BUYER" && doc.userId !== req.user.id) {
      throw new AppError("Access denied. You do not have permission to download this document.", 403);
    }

    if (!fs.existsSync(doc.filePath)) {
      throw new AppError("File missing from secure storage", 404);
    }

    await createAuditLog({
      userId: req.user?.id,
      action: "DOCUMENT_DOWNLOADED",
      ip,
      userAgent,
      details: { docId: doc.id, originalName: doc.originalName },
    });

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(doc.originalName)}"`);
    res.setHeader("Content-Type", doc.mimeType);
    fs.createReadStream(doc.filePath).pipe(res);
  } catch (error) {
    next(error);
  }
};
