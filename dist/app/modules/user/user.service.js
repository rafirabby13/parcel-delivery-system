"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User Already Exist');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // console.log("payload ", rest.role)
    if (rest.role == user_interface_1.Role.ADMIN || rest.role == user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Insufficient privileges to assign ADMIN or SUPER_ADMIN role.');
    }
    // const isPasswordMatched = await bcryptjs.compare(password as string, hashedPassword)
    // console.log(isPasswordMatched)
    const authProvider = {
        provider: "credentials",
        providerId: email
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    return user;
    // return {}
});
const UpdateUser = (userId, payload, decodedtoken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Invalid user id..');
    }
    // if (isUserExist.isDeleted || isUserExist.isActive == IsActive.BLOCKED ) {
    //     throw new AppError(httpStatus.FORBIDDEN, 'This user cant be updated .. ')
    // }
    if (payload.role) {
        if (decodedtoken.role === user_interface_1.Role.SENDER || decodedtoken.role == user_interface_1.Role.RECEIVER || decodedtoken.role == user_interface_1.Role.DELIVERY_PERSON) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorize access');
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedtoken.role == user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Unauthorize access');
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedtoken.role === user_interface_1.Role.SENDER || decodedtoken.role == user_interface_1.Role.RECEIVER || decodedtoken.role == user_interface_1.Role.DELIVERY_PERSON) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorize access');
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
    // return {}
});
const getAllUser = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const query = role ? { role } : {};
    // console.log(roleQuery)
    console.log("role", query);
    const users = yield user_model_1.User.find(query);
    const total = yield user_model_1.User.countDocuments();
    return {
        users,
        total
    };
});
const blockUser = (userId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !adminId) {
        throw new AppError_1.default(400, "User ID, reason, and admin ID are required");
    }
    // Verify admin permissions
    const admin = yield user_model_1.User.findById(adminId);
    if (!admin || (admin.role !== user_interface_1.Role.ADMIN && admin.role !== user_interface_1.Role.SUPER_ADMIN)) {
        throw new AppError_1.default(403, "Only admins can block users");
    }
    // Get user to block
    const userToBlock = yield user_model_1.User.findById(userId);
    if (!userToBlock) {
        throw new AppError_1.default(404, "User not found");
    }
    // Prevent blocking other admins (unless super admin)
    if ((userToBlock.role === user_interface_1.Role.ADMIN || userToBlock.role === user_interface_1.Role.SUPER_ADMIN) &&
        admin.role !== user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(403, "Cannot block admin users");
    }
    // Prevent self-blocking
    if (userId === adminId) {
        throw new AppError_1.default(400, "Cannot block yourself");
    }
    // Check if already blocked
    if (userToBlock.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(400, "User is already blocked");
    }
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        // Block the user
        const blockedUser = yield user_model_1.User.findByIdAndUpdate(userId, {
            isActive: user_interface_1.IsActive.BLOCKED,
        }, { new: true, session });
        // Create block log entry (optional - for audit trail)
        // You might want to create a separate BlockLog model for this
        yield session.commitTransaction();
        return {
            blockedUser
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const unblockUser = (userId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !adminId) {
        throw new AppError_1.default(400, "User ID, reason, and admin ID are required");
    }
    // Verify admin permissions
    const admin = yield user_model_1.User.findById(adminId);
    if (!admin || (admin.role !== user_interface_1.Role.ADMIN && admin.role !== user_interface_1.Role.SUPER_ADMIN)) {
        throw new AppError_1.default(403, "Only admins can block users");
    }
    // Get user to block
    const userToUnBlock = yield user_model_1.User.findById(userId);
    if (!userToUnBlock) {
        throw new AppError_1.default(404, "User not found");
    }
    // Prevent blocking other admins (unless super admin)
    if ((userToUnBlock.role === user_interface_1.Role.ADMIN || userToUnBlock.role === user_interface_1.Role.SUPER_ADMIN) &&
        admin.role !== user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(403, "Cannot unblock admin users");
    }
    // Prevent self-blocking
    if (userId === adminId) {
        throw new AppError_1.default(400, "Cannot unblock yourself");
    }
    // Check if already blocked
    if (userToUnBlock.isActive === user_interface_1.IsActive.ACTIVE) {
        throw new AppError_1.default(400, "User is already active");
    }
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        // Block the user
        const unblockedUser = yield user_model_1.User.findByIdAndUpdate(userId, {
            isActive: user_interface_1.IsActive.ACTIVE,
        }, { new: true, session });
        // Create block log entry (optional - for audit trail)
        // You might want to create a separate BlockLog model for this
        yield session.commitTransaction();
        return {
            unblockedUser
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
exports.userServices = {
    createUser,
    getAllUser,
    UpdateUser,
    blockUser,
    unblockUser
};
