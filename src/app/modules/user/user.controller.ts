/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { userServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";





const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: user,
        success: true,
    })
})
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id

    // const token = req.headers.authorization

    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    // console.log(token, verifiedToken)
    const verifiedToken = req.user
    const payload = req.body
    const updatedUser = await userServices.UpdateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User Updated successfully",
        data: updatedUser,
        success: true,
    })
})

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUser()


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "All User fetched successfully",
        data: users,
        success: true,
    })
})

export const userController = {
    createUser,
    getAllUser,
    updateUser
} 