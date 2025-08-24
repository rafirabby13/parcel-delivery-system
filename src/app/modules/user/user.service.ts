import AppError from "../../errorHelpers/AppError";
import { IAuthProviders, IsActive, IUser, IUserToken, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";


const createUser = async (payload: Partial<IUser>) => {



    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist')
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    // console.log("payload ", rest.role)

    if (rest.role == Role.ADMIN || rest.role == Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient privileges to assign ADMIN or SUPER_ADMIN role.');
    }


    // const isPasswordMatched = await bcryptjs.compare(password as string, hashedPassword)
    // console.log(isPasswordMatched)

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

const UpdateUser = async (userId: string, payload: Partial<IUser>, decodedtoken: JwtPayload) => {
    const isUserExist = await User.findById(userId)
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id..')
    }


    // if (isUserExist.isDeleted || isUserExist.isActive == IsActive.BLOCKED ) {
    //     throw new AppError(httpStatus.FORBIDDEN, 'This user cant be updated .. ')
    // }


    if (payload.role) {
        if (decodedtoken.role === Role.SENDER || decodedtoken.role == Role.RECEIVER || decodedtoken.role == Role.DELIVERY_PERSON) {
            throw new AppError(httpStatus.FORBIDDEN, 'Unauthorize access')
        }

        if (payload.role === Role.SUPER_ADMIN && decodedtoken.role == Role.ADMIN) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Unauthorize access')

        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedtoken.role === Role.SENDER || decodedtoken.role == Role.RECEIVER || decodedtoken.role == Role.DELIVERY_PERSON) {
            throw new AppError(httpStatus.FORBIDDEN, 'Unauthorize access')
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })


    return newUpdatedUser
    // return {}
}


const getAllUser = async (query: Record<string, string>,role: string) => {

    // const query = role ? { role } : {};

    // console.log(roleQuery)
    // console.log("role", query)
    if (role !== Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "UnAuthorized Access")
    }

    const queryBuilder = new QueryBuilder(User.find({}), query)

    const allUsers = await queryBuilder
            .filter()
            .sort()
            .fields()
            .paginate()
  const [users, meta] = await Promise.all([
        allUsers.build(),
        queryBuilder.getMeta()
    ])
    return {
        users,
        meta
    }
}
const getAllUserByRole = async (role: string) => {

    const query = role ? { role } : {};

    // console.log(roleQuery)
    console.log("role", query)
    if (role !== Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "UnAuthorized Access")
    }


    const users = await User.find(query)

    const total = await User.countDocuments()
    return {
        users,
        total
    }
}
const getMe = async (userr: IUser) => {

    const query = userr ? { email: userr?.email } : {};

    // console.log(roleQuery)
    // console.log("role", query)


    const user = await User.findOne(query).select("-password")
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User dontt Exist')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const {password, ...rest} = sleecteduser

    return {
        user
    }
}


const blockUser = async (userId: string, user: IUserToken) => {
    if (!userId || !user) {
        throw new AppError(400, "User ID, and admin are required");
    }



    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
        throw new AppError(403, "Only admins can block users");
    }

    // Get user to block
    const userToBlock = await User.findById(userId);
    if (!userToBlock) {
        throw new AppError(404, "User not found");
    }

    // Prevent blocking other admins (unless super admin)
    if ((userToBlock.role === Role.ADMIN || userToBlock.role === Role.SUPER_ADMIN) &&
        user.role !== Role.SUPER_ADMIN) {
        throw new AppError(403, "Cannot block admin users");
    }

    // Prevent self-blocking
    if (userId === user.userId) {
        throw new AppError(400, "Cannot block yourself");
    }

    // Check if already blocked
    // if (userToBlock.isActive === IsActive.BLOCKED) {
    //     throw new AppError(400, "User is already blocked");
    // }

    const session = await User.startSession();
    session.startTransaction();

    try {
        // Block the user
        const blockedUser = await User.findByIdAndUpdate(
            userId,
            {
                isActive: userToBlock.isActive === IsActive.BLOCKED ? IsActive.ACTIVE : IsActive.BLOCKED,
            },
            { new: true, session }
        );

        // Create block log entry (optional - for audit trail)
        // You might want to create a separate BlockLog model for this

        await session.commitTransaction();

        return {
            blockedUser
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

const unblockUser = async (userId: string, adminId: string) => {
    if (!userId || !adminId) {
        throw new AppError(400, "User ID, reason, and admin ID are required");
    }

    // Verify admin permissions
    const admin = await User.findById(adminId);
    if (!admin || (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN)) {
        throw new AppError(403, "Only admins can block users");
    }

    // Get user to block
    const userToUnBlock = await User.findById(userId);
    if (!userToUnBlock) {
        throw new AppError(404, "User not found");
    }

    // Prevent blocking other admins (unless super admin)
    if ((userToUnBlock.role === Role.ADMIN || userToUnBlock.role === Role.SUPER_ADMIN) &&
        admin.role !== Role.SUPER_ADMIN) {
        throw new AppError(403, "Cannot unblock admin users");
    }

    // Prevent self-blocking
    if (userId === adminId) {
        throw new AppError(400, "Cannot unblock yourself");
    }

    // Check if already blocked
    if (userToUnBlock.isActive === IsActive.ACTIVE) {
        throw new AppError(400, "User is already active");
    }

    const session = await User.startSession();
    session.startTransaction();

    try {
        // Block the user
        const unblockedUser = await User.findByIdAndUpdate(
            userId,
            {
                isActive: IsActive.ACTIVE,
            },
            { new: true, session }
        );

        // Create block log entry (optional - for audit trail)
        // You might want to create a separate BlockLog model for this

        await session.commitTransaction();

        return {
            unblockedUser
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};
export const userServices = {
    createUser,
    getAllUser,
    getMe,
    UpdateUser,
    blockUser,
    unblockUser,
    getAllUserByRole
}