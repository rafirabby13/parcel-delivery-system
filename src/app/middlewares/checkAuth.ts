import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError"
import { verifyToken } from "../utils/jwt"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"
import { User } from "../modules/user/user.model"
import httpStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface"


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(403, 'token not found')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload



        const isUserExist = await User.findOne({ email: verifiedToken.email })
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User not found , please register first")
        }
        if (isUserExist.isActive === IsActive.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is blocked")
        }
        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, 'Unauthorize Access, You cant access all users')
        }

        req.user = verifiedToken



        next()

    } catch (error) {
        next(error)

    }
}