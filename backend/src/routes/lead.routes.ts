import { Router } from "express";
import { createLead, getLeads } from "../controllers/lead.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";
import { createLeadSchema } from "../schemas/lead.schema";

const router = Router();

router.post("/", validate(createLeadSchema), createLead);
router.get("/", authenticate, authorize("AGENT", "ADMIN"), getLeads);

export default router;
