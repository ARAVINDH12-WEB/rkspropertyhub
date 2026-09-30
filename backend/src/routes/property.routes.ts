import { Router } from "express";
import {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";
import { createPropertySchema, propertyQuerySchema } from "../schemas/property.schema";

const router = Router();

router.get("/", validate(propertyQuerySchema), getProperties);
router.get("/:slug", getPropertyBySlug);

// Protected routes (Agents and Admins only)
router.post("/", authenticate, authorize("AGENT", "ADMIN"), validate(createPropertySchema), createProperty);
router.put("/:id", authenticate, authorize("AGENT", "ADMIN"), updateProperty);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProperty);

export default router;
