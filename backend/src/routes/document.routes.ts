import { Router } from "express";
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
} from "../controllers/document.controller";
import { authenticate } from "../middleware/auth";
import { documentUpload } from "../middleware/upload";

const router = Router();

// All document operations require authenticated session
router.use(authenticate);

router.post("/upload", documentUpload.single("file"), uploadDocument);
router.get("/", listDocuments);
router.get("/:id/download", downloadDocument);

export default router;
