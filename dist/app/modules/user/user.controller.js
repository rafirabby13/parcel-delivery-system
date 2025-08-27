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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully",
        data: user,
        success: true,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    // console.log(token, verifiedToken)
    const verifiedToken = req.user;
    const payload = req.body;
    const updatedUser = yield user_service_1.userServices.UpdateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated successfully",
        data: updatedUser,
        success: true,
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const role = req.query.role || ""
    console.log(req.user);
    const query = req.query;
    const user = req.user;
    // const role = user.role as string
    // if (!user) {
    //     throw new AppError(401, "User not authenticated")
    // }
    const users = yield user_service_1.userServices.getAllUser(query, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "All User fetched successfully",
        // data: {},
        data: users,
        success: true,
    });
}));
const getAllUserByRole = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const role = req.query.role || ""
    // console.log(req.user)
    // const user = req.user as IUserToken
    // const role = user.role as string
    // if (!user) {
    //     throw new AppError(401, "User not authenticated")
    // }
    const users = yield user_model_1.User.find({ role: user_interface_1.Role.DELIVERY_PERSON });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "All DELIVERY_PERSON fetched successfully",
        // data: {},
        data: users,
        success: true,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log("user", user)
    const users = yield user_service_1.userServices.getMe(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: " User fetched successfully",
        data: users,
        success: true,
    });
}));
const blockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = req.user;
    const users = yield user_service_1.userServices.blockUser(userId, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "User blocked successfully",
        data: users,
        success: true,
    });
}));
const unblockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const adminId = req.body.adminId;
    const users = yield user_service_1.userServices.unblockUser(userId, adminId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "User Unblocked successfully",
        data: users,
        success: true,
    });
}));
exports.userController = {
    createUser,
    getAllUser,
    getMe,
    updateUser,
    blockUser,
    unblockUser,
    getAllUserByRole
};
