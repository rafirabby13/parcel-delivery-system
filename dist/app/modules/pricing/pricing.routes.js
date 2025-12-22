"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const pricing_controller_1 = require("./pricing.controller");
const pricing_validation_1 = require("./pricing.validation");
const validateRequest_1 = require("../../utils/validateRequest");
const router = express_1.default.Router();
// Public Routes
router.get("/tiers", pricing_controller_1.PricingController.getTiers);
router.post("/calculate", (0, validateRequest_1.validateRequest)(pricing_validation_1.PricingValidation.calculatePriceSchema), pricing_controller_1.PricingController.calculateDelivery);
// Admin Routes
router.post("/create-tier", (0, validateRequest_1.validateRequest)(pricing_validation_1.PricingValidation.createPricingTierSchema), pricing_controller_1.PricingController.createTier);
router.patch("/update-tier", (0, validateRequest_1.validateRequest)(pricing_validation_1.PricingValidation.updatePricingTierSchema), pricing_controller_1.PricingController.updateTier);
exports.PricingRoutes = router;
