import AppError from "../../errorHelpers/AppError";
import { IAuthProviders, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"


const createUser = async (payload: Partial<IUser>) => {



    const { email,password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist')
    }

    const hashedPassword = await bcryptjs.hash(password as string, 10)
    console.log(hashedPassword)

    const isPasswordMatched = await bcryptjs.compare( password as string,hashedPassword)
    console.log(isPasswordMatched)

    const authProvider: IAuthProviders = {
        provider: "credentials",
        providerId: email as string
    }
    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user
    // return {}
}

const getAllUser = async () => {
    const users = await User.find({})

    const total = await User.countDocuments()
    return {
        users,
        total
    }
}

export const userServices = {
    createUser,
    getAllUser
}