import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes"
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";

export const createUserToken=(user: Partial<IUser>)=>{
     const jwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }
    
        const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
        const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

        return {
            accessToken,
            refreshToken
        }
}

export const createNewAccessTokenAndRefreshToken =async (refreshToken: string)=>{
    const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload



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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    

    return accessToken
}