import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      city,
      bedrooms,
      isTitleVerified,
      search,
      featured,
      page = "1",
      limit = "10",
      sortBy = "newest",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (city) {
      where.city = { contains: city as string };
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms as string, 10);
    }

    if (isTitleVerified !== undefined) {
      where.isTitleVerified = isTitleVerified === "true";
    }

    if (featured !== undefined) {
      where.featured = featured === "true";
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { location: { contains: search as string } },
        { city: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    if (sortBy === "price_desc") orderBy = { price: "desc" };

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          agent: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      }),
    ]);

    // Parse JSON string fields for images & amenities
    const formattedProperties = properties.map((prop) => ({
      ...prop,
      images: JSON.parse(prop.images || "[]"),
      amenities: JSON.parse(prop.amenities || "[]"),
    }));

    res.status(200).json({
      success: true,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      data: formattedProperties,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    const formattedProperty = {
      ...property,
      images: JSON.parse(property.images || "[]"),
      amenities: JSON.parse(property.amenities || "[]"),
    };

    res.status(200).json({
      success: true,
      data: formattedProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description,
      type,
      price,
      pricePerSqFt,
      areaSqFt,
      location,
      city,
      state,
      pincode,
      address,
      bedrooms,
      bathrooms,
      isTitleVerified,
      verificationDoc,
      heroImage,
      images,
      amenities,
      facing,
      ownershipType,
      gatedCommunity,
      featured,
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        description,
        type,
        price,
        pricePerSqFt,
        areaSqFt,
        location,
        city,
        state,
        pincode,
        address,
        bedrooms,
        bathrooms,
        isTitleVerified: isTitleVerified ?? true,
        verificationDoc,
        heroImage,
        images: JSON.stringify(images || []),
        amenities: JSON.stringify(amenities || []),
        facing,
        ownershipType: ownershipType || "Freehold",
        gatedCommunity: gatedCommunity ?? true,
        featured: featured ?? false,
        agentId: req.user?.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Property listing created successfully",
      data: {
        ...property,
        images: JSON.parse(property.images),
        amenities: JSON.parse(property.amenities),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Property not found", 404);
    }

    const updateData: any = { ...body };
    if (body.images) updateData.images = JSON.stringify(body.images);
    if (body.amenities) updateData.amenities = JSON.stringify(body.amenities);

    const updated = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: {
        ...updated,
        images: JSON.parse(updated.images),
        amenities: JSON.parse(updated.amenities),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Property not found", 404);
    }

    await prisma.property.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
