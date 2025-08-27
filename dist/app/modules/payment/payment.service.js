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
exports.PaymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const parcel_interface_1 = require("../parcel/parcel.interface");
const parcel_model_1 = require("../parcel/parcel.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const user_model_1 = require("../user/user.model");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ parcel: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    }
    const parcel = yield parcel_model_1.Parcel.findById(payment.parcel);
    const sender = yield user_model_1.User.findById(parcel === null || parcel === void 0 ? void 0 : parcel.senderId);
    const userAddress = (parcel === null || parcel === void 0 ? void 0 : parcel.senderInfo).detailAddress;
    const userEmail = sender === null || sender === void 0 ? void 0 : sender.email;
    const userPhoneNumber = (parcel === null || parcel === void 0 ? void 0 : parcel.senderInfo).phone;
    const userName = sender === null || sender === void 0 ? void 0 : sender.name;
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        phone: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };
    const sslPayment = yield sslCommerz_service_1.SSlService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        // const user = await User.findById(payload.senderId)
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            paymentStatus: parcel_interface_1.Payment_Status.PAID
        }, { new: true, runValidators: true, session: session });
        yield parcel_model_1.Parcel.findOneAndUpdate({ _id: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.parcel }, { paymentStatus: parcel_interface_1.Payment_Status.PAID }, { new: true, runValidators: true });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment completed Successfully"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        // const user = await User.findById(payload.senderId)
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            paymentStatus: parcel_interface_1.Payment_Status.FAILED
        }, { new: true, runValidators: true, session: session });
        yield parcel_model_1.Parcel.findOneAndUpdate({ _id: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.parcel }, { paymentStatus: parcel_interface_1.Payment_Status.FAILED }, { new: true, runValidators: true });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Failed"
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            paymentStatus: parcel_interface_1.Payment_Status.CANCELLED
        }, { new: true, runValidators: true, session: session });
        yield parcel_model_1.Parcel.findOneAndUpdate({ _id: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.parcel }, { paymentStatus: parcel_interface_1.Payment_Status.CANCELLED }, { new: true, runValidators: true });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment cancelled "
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashOnDeliveryPaymentPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        if (!paymentId) {
            throw new AppError_1.default(404, "Transaction Id is not found");
        }
        const parcel = yield payment_model_1.Payment.findById(paymentId);
        if ((parcel === null || parcel === void 0 ? void 0 : parcel.paymentMethod) == parcel_interface_1.Payment_Method.PREPAID && (parcel === null || parcel === void 0 ? void 0 : parcel.paymentStatus) == parcel_interface_1.Payment_Status.PAID) {
            throw new AppError_1.default(404, "Payment is already Done");
        }
        if ((parcel === null || parcel === void 0 ? void 0 : parcel.paymentStatus) == parcel_interface_1.Payment_Status.PAID) {
            throw new AppError_1.default(404, "Payment is already Done");
        }
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ _id: paymentId }, {
            paymentStatus: parcel_interface_1.Payment_Status.PAID
        }, { new: true, runValidators: true, session: session });
        yield parcel_model_1.Parcel.findOneAndUpdate({ _id: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.parcel }, { paymentStatus: parcel_interface_1.Payment_Status.PAID }, { new: true, runValidators: true });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment completed Successfully "
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.PaymentServices = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    cashOnDeliveryPaymentPayment
};
