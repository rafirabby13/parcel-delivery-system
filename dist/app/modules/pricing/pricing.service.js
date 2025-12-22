"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pricing_model_1 = require("./pricing.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const pricing_lib_1 = require("./pricing.lib");
// 1. Calculate Delivery Price
const calculatePrice = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderDivision, receiverDivision, weight, tier } = payload;
    // A. Fetch Tier Rates
    const pricingTier = yield pricing_model_1.PricingTier.findOne({ title: tier, isActive: true });
    if (!pricingTier) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Selected pricing tier is not active or found");
    }
    // B. Determine Route Type & Charge
    const routeType = (0, pricing_lib_1.resolveRouteType)(senderDivision, receiverDivision);
    // Check for admin override in DB for specific route
    const overrideCharge = yield pricing_model_1.LocationCharge.findOne({
        fromDivision: senderDivision,
        toDivision: receiverDivision,
    });
    const distanceCharge = overrideCharge ? overrideCharge.charge : pricing_lib_1.DEFAULT_DISTANCE_CHARGE[routeType];
    // C. Calculate Totals
    const weightCharge = weight * pricingTier.pricePerKg;
    const totalFee = pricingTier.basePrice + weightCharge + distanceCharge;
    return {
        basePrice: pricingTier.basePrice,
        weightCharge: Math.ceil(weightCharge),
        distanceCharge,
        routeType,
        totalFee: Math.ceil(totalFee),
        currency: "BDT",
    };
});
const createPricingTier = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield pricing_model_1.PricingTier.findOne({ title: payload.title });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Pricing tier with this title already exists");
    }
    const result = yield pricing_model_1.PricingTier.create(payload);
    return result;
});
const updatePricingTier = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // We find by title because that is the unique identifier in your frontend logic
    const result = yield pricing_model_1.PricingTier.findOneAndUpdate({ _id: payload._id }, payload, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Pricing tier not found");
    }
    return result;
});
// 3. Create/Update Location Charge (Admin)
const configureLocationCharge = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pricing_model_1.LocationCharge.findOneAndUpdate({ fromDivision: payload.fromDivision, toDivision: payload.toDivision }, payload, { new: true, upsert: true, runValidators: true });
    return result;
});
// 4. Get All Tiers (Public)
const getAllTiers = () => __awaiter(void 0, void 0, void 0, function* () {
    // Return lean object for performance
    return yield pricing_model_1.PricingTier.find({ isActive: true })
        .select("-createdAt -updatedAt -__v")
        .lean();
});
exports.PricingServices = {
    calculatePrice,
    createPricingTier,
    updatePricingTier,
    configureLocationCharge,
    getAllTiers,
};
