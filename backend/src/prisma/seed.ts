import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting RKS Realty database seed...");

  // 1. Clean existing records
  await prisma.siteVisit.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (Admin, Agent, Buyer)
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "RKS Admin",
      email: "admin@rksrealty.com",
      phone: "+91 9876543210",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "rajesh.agent@rksrealty.com",
      phone: "+91 9876543211",
      password: passwordHash,
      role: "AGENT",
    },
  });

  const buyer = await prisma.user.create({
    data: {
      name: "Ananya Sharma",
      email: "ananya@example.com",
      phone: "+91 9876543212",
      password: passwordHash,
      role: "BUYER",
    },
  });

  console.log("👤 Users seeded (Admin, Agent, Buyer). Default password: password123");

  // 3. Create Title-Verified Properties
  const properties = [
    {
      title: "Greenwood Enclave — Premium Villa Plots",
      slug: "greenwood-enclave-premium-villa-plots",
      description:
        "RERA approved & 100% title-clear villa plot enclave with underground cabling, wide asphalt roads, and 24/7 security perimeter. Ready for immediate construction.",
      type: "PLOT" as const,
      price: 6800000,
      pricePerSqFt: 4250,
      areaSqFt: 1600,
      location: "Devanahalli Extension",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "562110",
      address: "Survey No. 42/1, Devanahalli Main Road",
      isTitleVerified: true,
      verificationDoc: "RERA-PRM-KA-RERA-1251-308",
      heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Gated Perimeter",
        "Underground Drainage",
        "Street Lights",
        "Avenue Trees",
        "24/7 CCTV Surveillance",
        "Clubhouse Access",
      ]),
      facing: "East",
      ownershipType: "Freehold",
      gatedCommunity: true,
      featured: true,
      agentId: agent.id,
    },
    {
      title: "The Crestwood — Luxury 4BHK Independent Villa",
      slug: "the-crestwood-luxury-4bhk-independent-villa",
      description:
        "Architect-designed 4BHK duplex villa featuring private lap pool, rooftop terrace garden, smart home automation, and 100% clear legal title with bank loan pre-approvals.",
      type: "VILLA" as const,
      price: 24500000,
      pricePerSqFt: 7000,
      areaSqFt: 3500,
      location: "Sarjapur Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560035",
      address: "Plot 18, Crestwood Estate, Sarjapur Road",
      bedrooms: 4,
      bathrooms: 4,
      isTitleVerified: true,
      verificationDoc: "LEGAL-TITLE-CERT-2025-88",
      heroImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Private Lap Pool",
        "EV Charging Port",
        "Italian Marble Flooring",
        "Solar Power Backup",
        "Double Height Ceiling",
        "Private Garden",
      ]),
      facing: "North-East",
      ownershipType: "Freehold",
      gatedCommunity: true,
      featured: true,
      agentId: agent.id,
    },
    {
      title: "Skyline Heights — 3BHK Title-Clear Residence",
      slug: "skyline-heights-3bhk-title-clear-residence",
      description:
        "High-rise luxury 3BHK apartment overlooking green canopy with floor-to-ceiling windows, modular kitchen, and verified A-Katha clear titles.",
      type: "APARTMENT" as const,
      price: 13500000,
      pricePerSqFt: 7500,
      areaSqFt: 1800,
      location: "Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
      address: "Tower B, 14th Floor, Skyline Heights, Whitefield",
      bedrooms: 3,
      bathrooms: 3,
      isTitleVerified: true,
      verificationDoc: "AKATHA-VERIFIED-5542",
      heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Infinity Pool",
        "Gymnasium",
        "Tennis Court",
        "Multipurpose Hall",
        "Piped Gas",
        "Covered Parking",
      ]),
      facing: "East",
      ownershipType: "Freehold",
      gatedCommunity: true,
      featured: false,
      agentId: agent.id,
    },
    {
      title: "Oakwood Orchards — Eco Agricultural Plot",
      slug: "oakwood-orchards-eco-agricultural-plot",
      description:
        "Managed farmland with organic plantation, drip irrigation, electricity connection, and 30-year clear title search report.",
      type: "PLOT" as const,
      price: 3200000,
      pricePerSqFt: 800,
      areaSqFt: 4000,
      location: "Chikkaballapur Road",
      city: "Bengaluru Outer",
      state: "Karnataka",
      pincode: "562101",
      address: "Sector 3, Oakwood Orchards",
      isTitleVerified: true,
      verificationDoc: "TITLE-SEARCH-30YR-CLEAR",
      heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Drip Irrigation System",
        "Solar Fencing",
        "Farming Support",
        "Clubhouse & Cottages",
      ]),
      facing: "North",
      ownershipType: "Freehold",
      gatedCommunity: true,
      featured: false,
      agentId: agent.id,
    },
  ];

  for (const prop of properties) {
    await prisma.property.create({ data: prop });
  }

  console.log("🏡 4 Title-Verified Properties created successfully!");

  // 4. Create Sample Site Visit & Lead
  const firstProp = await prisma.property.findFirst();

  if (firstProp) {
    await prisma.siteVisit.create({
      data: {
        propertyId: firstProp.id,
        userId: buyer.id,
        visitorName: "Ananya Sharma",
        visitorEmail: "ananya@example.com",
        visitorPhone: "+91 9876543212",
        visitDate: new Date(Date.now() + 86400000 * 3), // 3 days in future
        timeSlot: "11:00 AM - 01:00 PM",
        notes: "Interested in plot dimensions and title deed documents review.",
        status: "CONFIRMED",
      },
    });

    await prisma.lead.create({
      data: {
        propertyId: firstProp.id,
        userId: buyer.id,
        name: "Ananya Sharma",
        email: "ananya@example.com",
        phone: "+91 9876543212",
        message: "Hi, please send me the RERA approval copy and payment schedule.",
        interestedIn: "PLOT",
        budgetRange: "₹50L - ₹75L",
        status: "NEW",
      },
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
