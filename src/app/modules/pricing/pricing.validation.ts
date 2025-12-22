import { z } from "zod";
import { PRICING_TIER } from "./pricing.interface";

const createPricingTierSchema = z.object({
  
    title: z.nativeEnum(PRICING_TIER),
    description: z.string().min(5),
    basePrice: z.number().min(0),
    pricePerKg: z.number().min(0),
    features: z.array(z.string()).min(1),

});
const updatePricingTierSchema = z.object({
  
    _id: z.string({ message: "Pricing tier ID is required" }),
    title: z.nativeEnum(PRICING_TIER).optional(),
    description: z.string().min(5).optional(),
    basePrice: z.number().min(0).optional(),
    pricePerKg: z.number().min(0).optional(),
    features: z.array(z.string()).min(1).optional(),
    isActive: z.boolean().optional(),

});

const calculatePriceSchema = z.object({
  body: z.object({
    senderDivision: z.string({ message: "Sender division is required" }),
    receiverDivision: z.string({ message: "Receiver division is required" }),
    weight: z.number().positive(),
    tier: z.nativeEnum(PRICING_TIER),
  }),
});

export const PricingValidation = {
  createPricingTierSchema,
  calculatePriceSchema,
  updatePricingTierSchema
};