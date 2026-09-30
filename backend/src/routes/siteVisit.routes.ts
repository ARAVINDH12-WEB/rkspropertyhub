import { Router } from "express";
import { bookSiteVisit, getSiteVisits, updateSiteVisitStatus } from "../controllers/siteVisit.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";
import { createSiteVisitSchema, updateVisitStatusSchema } from "../schemas/siteVisit.schema";

const router = Router();

router.post("/", validate(createSiteVisitSchema), bookSiteVisit);
router.get("/", authenticate, getSiteVisits);
router.patch("/:id/status", authenticate, authorize("AGENT", "ADMIN"), validate(updateVisitStatusSchema), updateSiteVisitStatus);

export default router;
