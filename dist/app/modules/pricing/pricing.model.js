"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationCharge = exports.PricingTier = void 0;
const mongoose_1 = require("mongoose");
const pricing_interface_1 = require("./pricing.interface");
const PricingTierSchema = new mongoose_1.Schema({
    title: {
        type: String,
        enum: Object.values(pricing_interface_1.PRICING_TIER),
        required: true,
        unique: true,
    },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    pricePerKg: { type: Number, required: true, min: 0 },
    features: { type: [String], default: [] }, // New features array
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
const LocationChargeSchema = new mongoose_1.Schema({
    fromDivision: { type: String, required: true, trim: true },
    toDivision: { type: String, required: true, trim: true },
    charge: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
    versionKey: false,
});
// Composite index to ensure unique routes
LocationChargeSchema.index({ fromDivision: 1, toDivision: 1 }, { unique: true });
exports.PricingTier = (0, mongoose_1.model)("PricingTier", PricingTierSchema);
exports.LocationCharge = (0, mongoose_1.model)("LocationCharge", LocationChargeSchema);
