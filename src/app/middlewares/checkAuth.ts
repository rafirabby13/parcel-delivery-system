import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError"
import { verifyToken } from "../utils/jwt"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"

export const checkAuth = (...authRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(403, 'token not found')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload



        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, 'Unauthorize Access, You cant access all users')
        }

        req.user = verifiedToken



        next()

    } catch (error) {
        next(error)

    }
}