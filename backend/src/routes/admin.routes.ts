import { Router } from "express";
import {
  getDashboardStats,
  getAllLeads,
  updateLeadStatus,
  getAllSiteVisits,
  getAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  getSiteContent,
  updateSiteContent,
  getAuditLogs,
} from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getDashboardStats);
router.get("/leads", getAllLeads);
router.patch("/leads/:id/status", updateLeadStatus);
router.get("/site-visits", getAllSiteVisits);
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.patch("/users/:id", updateUser);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/site-content", getSiteContent);
router.put("/site-content", updateSiteContent);
router.get("/audit-logs", getAuditLogs);

export default router;
