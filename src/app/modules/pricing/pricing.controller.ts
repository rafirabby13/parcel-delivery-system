import { Request, Response } from "express";
import httpStatus from "http-status";
import { PricingServices } from "./pricing.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createTier = catchAsync(async (req: Request, res: Response) => {
    console.log("Request body in createTier:", req.body);
  const result = await PricingServices.createPricingTier(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pricing tier configured successfully",
    data: result,
    // data: req.body,
  });
});

const updateTier = catchAsync(async (req: Request, res: Response) => {
  const result = await PricingServices.updatePricingTier(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pricing tier updated successfully",
    data: result,
  });
});

const getTiers = catchAsync(async (req: Request, res: Response) => {
  const result = await PricingServices.getAllTiers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pricing tiers retrieved successfully",
    data: result,
  });
});

const calculateDelivery = catchAsync(async (req: Request, res: Response) => {
  const result = await PricingServices.calculatePrice(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Price calculated successfully",
    data: result,
  });
});

export const PricingController = {
  createTier,
  getTiers,
  calculateDelivery,
  updateTier,
};