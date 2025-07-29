/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service";
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 console.log("req.body", req.body)
    const result = await AuthServices.credentialsLogin(req.body)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged InSuccesssfully",
        data: result
    })

})



export const AuthController = {
    credentialsLogin
}