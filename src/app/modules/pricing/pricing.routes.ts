import express from "express";
import { PricingController } from "./pricing.controller";
import { PricingValidation } from "./pricing.validation";
import { validateRequest } from "../../utils/validateRequest";

const router = express.Router();

// Public Routes
router.get("/tiers", PricingController.getTiers);
router.post(
  "/calculate", 
  validateRequest(PricingValidation.calculatePriceSchema), 
  PricingController.calculateDelivery
);

// Admin Routes
router.post(
  "/create-tier",
  validateRequest(PricingValidation.createPricingTierSchema),
  PricingController.createTier
);

router.patch(
  "/update-tier",

  validateRequest(PricingValidation.updatePricingTierSchema),
  PricingController.updateTier
);

export const PricingRoutes = router;