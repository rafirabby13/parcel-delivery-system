/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { PaymentServices } from "./payment.service"
import { envVars } from "../../config/env"
import { sendOTP } from "../twilioSmsVeryfy/twilio"
import { SSlService } from "../sslCommerz/sslCommerz.service"

const successPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req.query
    const result = await PaymentServices.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(envVars.SSL.SSL_SUCCESS_FRONTEND_URL)
    }

})
const failPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req.query
    const result = await PaymentServices.failPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(envVars.SSL.SSL_FAIL_FRONTEND_URL)
    }

})
const cancelPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const query = req.query
    const result = await PaymentServices.cancelPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(envVars.SSL.SSL_CANCEL_FRONTEND_URL)
    }

})
const cashOnDeliveryPaymentPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const paymentId = req.body.paymentId

    const response = await PaymentServices.cashOnDeliveryPaymentPayment(paymentId as string)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment status updated successfully",
        data: response
    })

    //    dfg

})
const validatePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const response = await SSlService.validatePayment(req.body)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment Validated successfully",
        data: response
    })

    //    dfg

})




export const PaymentControllers = {
    successPayment,
    failPayment,
    cancelPayment,
    cashOnDeliveryPaymentPayment,
    validatePayment
}