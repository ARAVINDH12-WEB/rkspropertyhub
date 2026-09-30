import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request } from "express";
import { AppError } from "./errorHandler";

// Secure storage directory outside public webroot
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed MIME types whitelist
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Configure storage with UUID filenames to prevent path traversal & overwrites
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomUUID();
    cb(null, `${uniqueId}${ext}`);
  },
});

// Multer filter to validate MIME types
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type "${file.mimetype}". Allowed types: PDF, JPG, PNG, WEBP`,
        400
      )
    );
  }
};

export const documentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files per upload
  },
});
