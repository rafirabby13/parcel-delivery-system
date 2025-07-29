/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { userServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";





const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body)
   
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: user,
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
    getAllUser
} 