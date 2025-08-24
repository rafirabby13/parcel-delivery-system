/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError"
import {  IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { createNewAccessTokenAndRefreshToken, createUserToken } from "../../utils/userTokens"
// import { generateToken, verifyToken } from "../../utils/jwt"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"



const credentialsLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found , please register first")
    }
    
    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
    
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password not matched , please check your password")
    }
    if (!isUserExist.isVerified) {
        // console.log(isUserExist.isVerified)
        throw new AppError(httpStatus.BAD_REQUEST, "Not verified , please verify first")
    }

    const userToken = createUserToken(isUserExist)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }



}



const getNewAuthToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenAndRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }



}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)


    const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Old password doesn't matched")
    }


    user!.password =  await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save()



   



}



export const AuthServices = {
    credentialsLogin,
    getNewAuthToken,
    resetPassword
}