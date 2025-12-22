import { Schema, model } from "mongoose";
import { ILocationCharge, IPricingTier, PRICING_TIER } from "./pricing.interface";

const PricingTierSchema = new Schema<IPricingTier>(
  {
    title: {
      type: String,
      enum: Object.values(PRICING_TIER),
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    pricePerKg: { type: Number, required: true, min: 0 },
    features: { type: [String], default: [] }, // New features array
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LocationChargeSchema = new Schema<ILocationCharge>(
  {
    fromDivision: { type: String, required: true, trim: true },
    toDivision: { type: String, required: true, trim: true },
    charge: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Composite index to ensure unique routes
LocationChargeSchema.index({ fromDivision: 1, toDivision: 1 }, { unique: true });

export const PricingTier = model<IPricingTier>("PricingTier", PricingTierSchema);
export const LocationCharge = model<ILocationCharge>("LocationCharge", LocationChargeSchema);