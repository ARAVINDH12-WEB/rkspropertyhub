export type PropertyType = "PLOT" | "VILLA" | "APARTMENT" | "COMMERCIAL";

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  price: number;
  pricePerSqFt: number;
  areaSqFt: number;
  location: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  isTitleVerified: boolean;
  verificationDoc?: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  featured: boolean;
  heroImage: string;
  images: string[];
  amenities: string[];
  facing?: string;
  ownershipType?: string;
  gatedCommunity: boolean;
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "BUYER" | "AGENT" | "ADMIN";
}

export interface PropertyFilter {
  type?: PropertyType | "";
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  isTitleVerified?: boolean;
}
