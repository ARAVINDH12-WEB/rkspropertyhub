import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

export const bookSiteVisit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { propertyId, visitorName, visitorEmail, visitorPhone, visitDate, timeSlot, notes } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw new AppError("Property not found", 404);
    }

    const siteVisit = await prisma.siteVisit.create({
      data: {
        propertyId,
        visitorName,
        visitorEmail,
        visitorPhone,
        visitDate: new Date(visitDate),
        timeSlot,
        notes,
        userId: req.user?.id || null,
        status: "PENDING",
      },
      include: {
        property: {
          select: { title: true, location: true, city: true, heroImage: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Site visit booked successfully! Our agent will contact you to confirm.",
      data: siteVisit,
    });
  } catch (error) {
    next(error);
  }
};

export const getSiteVisits = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const where: any = {};
    if (req.user?.role === "BUYER") {
      where.userId = req.user.id;
    }

    const visits = await prisma.siteVisit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: { id: true, title: true, slug: true, location: true, heroImage: true, price: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: visits,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSiteVisitStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const visit = await prisma.siteVisit.findUnique({ where: { id } });
    if (!visit) {
      throw new AppError("Site visit record not found", 404);
    }

    const updated = await prisma.siteVisit.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Site visit status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
