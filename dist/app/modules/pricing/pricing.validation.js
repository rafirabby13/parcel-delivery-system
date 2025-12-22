"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingValidation = void 0;
const zod_1 = require("zod");
const pricing_interface_1 = require("./pricing.interface");
const createPricingTierSchema = zod_1.z.object({
    title: zod_1.z.nativeEnum(pricing_interface_1.PRICING_TIER),
    description: zod_1.z.string().min(5),
    basePrice: zod_1.z.number().min(0),
    pricePerKg: zod_1.z.number().min(0),
    features: zod_1.z.array(zod_1.z.string()).min(1),
});
const updatePricingTierSchema = zod_1.z.object({
    _id: zod_1.z.string({ message: "Pricing tier ID is required" }),
    title: zod_1.z.nativeEnum(pricing_interface_1.PRICING_TIER).optional(),
    description: zod_1.z.string().min(5).optional(),
    basePrice: zod_1.z.number().min(0).optional(),
    pricePerKg: zod_1.z.number().min(0).optional(),
    features: zod_1.z.array(zod_1.z.string()).min(1).optional(),
    isActive: zod_1.z.boolean().optional(),
});
const calculatePriceSchema = zod_1.z.object({
    body: zod_1.z.object({
        senderDivision: zod_1.z.string({ message: "Sender division is required" }),
        receiverDivision: zod_1.z.string({ message: "Receiver division is required" }),
        weight: zod_1.z.number().positive(),
        tier: zod_1.z.nativeEnum(pricing_interface_1.PRICING_TIER),
    }),
});
exports.PricingValidation = {
    createPricingTierSchema,
    calculatePriceSchema,
    updatePricingTierSchema
};
