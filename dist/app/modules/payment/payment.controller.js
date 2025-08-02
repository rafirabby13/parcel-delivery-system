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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const payment_service_1 = require("./payment.service");
const env_1 = require("../../config/env");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const successPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.PaymentServices.successPayment(query);
    if (result.success) {
        res.redirect(env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL);
    }
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.PaymentServices.failPayment(query);
    if (!result.success) {
        res.redirect(env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.PaymentServices.cancelPayment(query);
    if (!result.success) {
        res.redirect(env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL);
    }
}));
const cashOnDeliveryPaymentPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = req.body.paymentId;
    const response = yield payment_service_1.PaymentServices.cashOnDeliveryPaymentPayment(paymentId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Payment status updated successfully",
        data: response
    });
    //    dfg
}));
const validatePayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield sslCommerz_service_1.SSlService.validatePayment(req.body);
    console.log("response", response);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Payment Validated successfully",
        data: response
    });
    //    dfg
}));
exports.PaymentControllers = {
    successPayment,
    failPayment,
    cancelPayment,
    cashOnDeliveryPaymentPayment,
    validatePayment
};
