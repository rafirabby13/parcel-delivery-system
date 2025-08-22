import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from "./otp.service";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, name } = req.body
    await OTPService.sendOTP(email, name)

    sendResponse(res, {
        statusCode: 201,
        data: null,
        message: "OTP sent Done",
        success: true
    })
});
const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body

    await OTPService.verifyOTP(email, otp)

    sendResponse(res, {
        statusCode: 201,
        data: null,
        message: "Verified Done",
        success: true
    })
});

export const OTPController = {
    sendOTP,
    verifyOTP
};