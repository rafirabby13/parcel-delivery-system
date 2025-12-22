import httpStatus from "http-status";
import { ICalculatePricePayload, IPriceBreakdown, IPricingTier } from "./pricing.interface";
import { LocationCharge, PricingTier } from "./pricing.model";
import AppError from "../../errorHelpers/AppError";
import { DEFAULT_DISTANCE_CHARGE, resolveRouteType } from "./pricing.lib";

// 1. Calculate Delivery Price
const calculatePrice = async (payload: ICalculatePricePayload): Promise<IPriceBreakdown> => {
  const { senderDivision, receiverDivision, weight, tier } = payload;

  // A. Fetch Tier Rates
  const pricingTier = await PricingTier.findOne({ title: tier, isActive: true });
  if (!pricingTier) {
    throw new AppError(httpStatus.NOT_FOUND, "Selected pricing tier is not active or found");
  }

  // B. Determine Route Type & Charge
  const routeType = resolveRouteType(senderDivision, receiverDivision);
  
  // Check for admin override in DB for specific route
  const overrideCharge = await LocationCharge.findOne({
    fromDivision: senderDivision,
    toDivision: receiverDivision,
  });

  const distanceCharge = overrideCharge ? overrideCharge.charge : DEFAULT_DISTANCE_CHARGE[routeType];

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
};

const createPricingTier = async (payload: IPricingTier) => {
  const isExist = await PricingTier.findOne({ title: payload.title });
  
  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "Pricing tier with this title already exists");
  }

  const result = await PricingTier.create(payload);
  return result;
};
const updatePricingTier = async (payload: Partial<IPricingTier>) => {
  // We find by title because that is the unique identifier in your frontend logic
  const result = await PricingTier.findOneAndUpdate(
    { _id: payload._id },
    payload,
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Pricing tier not found");
  }

  return result;
};
// 3. Create/Update Location Charge (Admin)
const configureLocationCharge = async (payload: { fromDivision: string; toDivision: string; charge: number }) => {
  const result = await LocationCharge.findOneAndUpdate(
    { fromDivision: payload.fromDivision, toDivision: payload.toDivision },
    payload,
    { new: true, upsert: true, runValidators: true }
  );
  return result;
};

// 4. Get All Tiers (Public)
const getAllTiers = async () => {
  // Return lean object for performance
  return await PricingTier.find({ isActive: true })
    .select("-createdAt -updatedAt -__v")
    .lean();
};

export const PricingServices = {
  calculatePrice,
  createPricingTier,
  updatePricingTier,
  configureLocationCharge,
  getAllTiers,
};