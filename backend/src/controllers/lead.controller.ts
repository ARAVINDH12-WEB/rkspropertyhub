import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { propertyId, name, email, phone, message, interestedIn, budgetRange } = req.body;

    const lead = await prisma.lead.create({
      data: {
        propertyId: propertyId || null,
        userId: req.user?.id || null,
        name,
        email,
        phone,
        message,
        interestedIn,
        budgetRange,
        status: "NEW",
      },
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Our real estate specialist will contact you shortly.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: { title: true, location: true, price: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};
