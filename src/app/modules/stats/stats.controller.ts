// controllers/stats.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";


const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});
const getParcelStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getParcelStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcel stats fetched successfully",
        data: stats,
    });
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getPaymentStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment stats fetched successfully",
        data: stats,
    });
});



// const getTourStats = catchAsync(async (req: Request, res: Response) => {
//     const stats = await StatsService.getTourStats();
//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "Tour stats fetched successfully",
//         data: stats,
//     });
// });

export const StatsController = {

    getUserStats,
    getParcelStats,
    getPaymentStats
};