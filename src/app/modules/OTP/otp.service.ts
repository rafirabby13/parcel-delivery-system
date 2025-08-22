import crypto from "crypto"
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
const OTP_EXPIRATION = 2 * 60


const generateOTP = () => {
    //! 6 digit

    const otp = crypto.randomInt(10 ** 5, 10 ** 6).toString()
    return otp;


}
const sendOTP = async (email: string, name: string) => {

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(404, "user  does not exist..")

    }

    const otp = generateOTP()
    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code ",
        template: "otp",
        templateData: {
            name: name,
            otp
        }
    })



};
const verifyOTP = async (email: string, otp: string) => {


    const redisKey = `otp:${email}`

    const veryfiedOTP = await redisClient.get(redisKey)
    if (!veryfiedOTP) {
        throw new AppError(401, "INVALID OTP")
    }


    if (veryfiedOTP !== otp) {
        throw new AppError(403, "NOT correct OTP")
    }


    await Promise.all([

        User.updateOne(
            { email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ])





};


export const OTPService = {
    sendOTP,
    verifyOTP
};