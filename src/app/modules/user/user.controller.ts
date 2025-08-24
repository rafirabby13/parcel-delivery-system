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
import { IUser, IUserToken, Role } from "./user.interface";
import { User } from "./user.model";





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
    const updatedUser = await userServices.UpdateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User Updated successfully",
        data: updatedUser,
        success: true,
    })
})

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const role = req.query.role || ""
    console.log(req.user)
    const query = req.query
    const user = req.user as IUserToken
    // const role = user.role as string
    // if (!user) {
    //     throw new AppError(401, "User not authenticated")
    // }

    const users = await userServices.getAllUser(query as Record<string, string>,user.role)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "All User fetched successfully",
        // data: {},
        data: users,
        success: true,
    })
})
const getAllUserByRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const role = req.query.role || ""
    // console.log(req.user)
    // const user = req.user as IUserToken
    // const role = user.role as string
    // if (!user) {
    //     throw new AppError(401, "User not authenticated")
    // }

    const users = await User.find({ role: Role.DELIVERY_PERSON })


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "All DELIVERY_PERSON fetched successfully",
        // data: {},
        data: users,
        success: true,
    })
})
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user as IUser
    // console.log("user", user)
    const users = await userServices.getMe(user)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: " User fetched successfully",
        data: users,
        success: true,
    })
})
const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id
    const user = req.user as IUserToken

    const users = await userServices.blockUser(userId, user)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "User blocked successfully",
        data: users,
        success: true,
    })
})
const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id
    const adminId = req.body.adminId

    const users = await userServices.unblockUser(userId, adminId)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "User Unblocked successfully",
        data: users,
        success: true,
    })
})

export const userController = {
    createUser,
    getAllUser,
    getMe,
    updateUser,
    blockUser,
    unblockUser,
    getAllUserByRole
} 