import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalProperties, totalLeads, newLeads, totalSiteVisits, pendingSiteVisits, totalUsers] =
      await Promise.all([
        prisma.property.count(),
        prisma.lead.count(),
        prisma.lead.count({ where: { status: "NEW" } }),
        prisma.siteVisit.count(),
        prisma.siteVisit.count({ where: { status: "PENDING" } }),
        prisma.user.count(),
      ]);

    res.json({
      success: true,
      data: {
        totalProperties,
        totalLeads,
        newLeads,
        totalSiteVisits,
        pendingSiteVisits,
        totalUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export const getAllLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status as string;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["NEW", "CONTACTED", "IN_PROGRESS", "CLOSED"];
    if (!status || !validStatuses.includes(status)) {
      throw new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        400
      );
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// Site Visits
// ---------------------------------------------------------------------------

export const getAllSiteVisits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status as string;
    }

    const siteVisits = await prisma.siteVisit.findMany({
      where,
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: siteVisits });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      throw new AppError("Name, email, and password are required", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("A user with this email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || "BUYER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({ success: true, data: user, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("User not found", 404);
    }

    if (email && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        throw new AppError("Email is already taken by another user", 400);
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: user, message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      throw new AppError("Role is required", 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const authReq = req as AuthRequest;
    if (authReq.user?.id === id) {
      throw new AppError("You cannot delete your own account", 400);
    }

    await prisma.user.delete({ where: { id } });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// Site Content  (raw SQL – table may not exist in the Prisma schema yet)
// ---------------------------------------------------------------------------

/**
 * Ensures the `site_content` table exists. Called before every raw-SQL
 * operation so the controller works even before a migration adds the table.
 */
const ensureSiteContentTable = async () => {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS site_content (
        id INTEGER PRIMARY KEY,
        data TEXT,
        updated_at TEXT
      )
    `;
  } catch {
    // Table likely already exists – safe to ignore
  }
};

export const getSiteContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ensureSiteContentTable();

    const rows = await prisma.$queryRaw<
      { id: number; data: string; updated_at: string }[]
    >`SELECT * FROM site_content WHERE id = 1 LIMIT 1`;

    if (!rows.length) {
      return res.json({ success: true, data: null });
    }

    const parsed = rows[0].data ? JSON.parse(rows[0].data) : null;

    res.json({
      success: true,
      data: parsed,
      updatedAt: rows[0].updated_at,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSiteContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ensureSiteContentTable();

    const content = req.body;
    if (!content || Object.keys(content).length === 0) {
      throw new AppError("Content body is required", 400);
    }

    const jsonString = JSON.stringify(content);
    const now = new Date().toISOString();

    // Upsert: try UPDATE first, INSERT if no row exists yet
    const updated =
      await prisma.$executeRaw`UPDATE site_content SET data = ${jsonString}, updated_at = ${now} WHERE id = 1`;

    if (updated === 0) {
      await prisma.$executeRaw`INSERT INTO site_content (id, data, updated_at) VALUES (1, ${jsonString}, ${now})`;
    }

    res.json({ success: true, message: "Site content updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
