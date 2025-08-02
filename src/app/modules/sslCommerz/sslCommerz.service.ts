/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from "axios"
const sslPaymentInit = async (payload: ISSLCommerz) => {

    try {
        const data = {
            store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd: envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}`,
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}`,
            ipn_url: envVars.SSL.SSL_IPN_URL,
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "Dhaka",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phone,
            cus_fax: "01711111111",
            ship_name: "Customer Name",
            ship_add1: "Dhaka",
            ship_add2: "Dhaka",
            ship_city: "Dhaka",
            ship_state: "Dhaka",
            ship_postcode: "1000",
            ship_country: "Bangladesh",
            multi_card_name: "mastercard,visacard,amexcard",
            value_a: "ref001_A",
            value_b: "ref002_B",
            value_c: "ref003_C",
            value_d: "ref004_D",
        };
        const response = await axios({
            method: "POST",
            url: envVars.SSL.SSL_PAYMENT_API,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })



        return response.data
    } catch (error: any) {
        console.log(error)
        throw new AppError(404, error.message)
    }

}

const validatePayment = async (payload: any) => {

    try {
        const response = await axios({
            method: "GET",
            url: `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.SSL_STORE_ID}&store_passwd=${envVars.SSL.SSL_STORE_PASS}`,

        })

        await Payment.findOneAndUpdate(
            { transactionId: payload.transactionId },
            { paymentGatewayData: response.data },
            { runValidators: true }
        )
    } catch (error: any) {
        throw new AppError(401, `Payment validation Error ${error.message}`)
    }

}

export const SSlService = {
    sslPaymentInit,
    validatePayment
}