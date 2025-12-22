

// Enum for Tier Names
export const PRICING_TIER = {
  STANDARD: "Standard",
  EXPRESS: "Express",
  PREMIUM: "Premium",
} as const;

export type PricingTierType = (typeof PRICING_TIER)[keyof typeof PRICING_TIER];

export interface IPricingTier {
  _id?: string;
  title: PricingTierType;  // Changed from 'name' to 'title'
  description: string;
  basePrice: number;       // Changed from 'baseRate'
  pricePerKg: number;      // Changed from 'weightRate'
  features: string[];      // New field
  isActive: boolean;
}

export interface ILocationCharge {
  fromDivision: string;
  toDivision: string;
  charge: number;
}

export interface ICalculatePricePayload {
  senderDivision: string;
  receiverDivision: string;
  weight: number;
  tier: PricingTierType;
}

export interface IPriceBreakdown {
  basePrice: number;
  weightCharge: number;
  distanceCharge: number;
  routeType: string;
  totalFee: number;
  currency: "BDT";
}