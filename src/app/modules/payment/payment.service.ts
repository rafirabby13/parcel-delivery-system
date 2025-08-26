/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError"
import { Payment_Method, Payment_Status } from "../parcel/parcel.interface"
import { Parcel } from "../parcel/parcel.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSlService } from "../sslCommerz/sslCommerz.service"
import { User } from "../user/user.model"
import { Payment } from "./payment.model"
import httpStatus from "http-status-codes"
const initPayment = async (bookingId: string) => {


      const payment = await Payment.findOne({ parcel: bookingId })

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }

    const parcel = await Parcel.findById(payment.parcel)
    const sender = await User.findById(parcel?.senderId) 

    const userAddress = (parcel?.senderInfo as any).detailAddress
    const userEmail = (sender?.email as any)
    const userPhoneNumber = (parcel?.senderInfo as any).phone
    const userName = (sender?.name as any)

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phone: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSlService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

}

const successPayment = async (query: Record<string, string>) => {


    const session = await Parcel.startSession()
    session.startTransaction()

    try {

        // const user = await User.findById(payload.senderId)



        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            paymentStatus: Payment_Status.PAID
        }, { new: true, runValidators: true, session: session })

        await Parcel.findOneAndUpdate(
            { _id: updatedPayment?.parcel },
            { paymentStatus: Payment_Status.PAID },
            { new: true, runValidators: true }
        )



        await session.commitTransaction()
        session.endSession()

        return {
            success: true,
            message: "Payment completed Successfully"
        }


    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }


}
const failPayment = async (query: Record<string, string>) => {


    const session = await Parcel.startSession()
    session.startTransaction()

    try {

        // const user = await User.findById(payload.senderId)



        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            paymentStatus: Payment_Status.FAILED
        }, { new: true, runValidators: true, session: session })

        await Parcel.findOneAndUpdate(
            { _id: updatedPayment?.parcel },
            { paymentStatus: Payment_Status.FAILED },
            { new: true, runValidators: true }
        )



        await session.commitTransaction()
        session.endSession()

        return {
            success: false,
            message: "Payment Failed"
        }


    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }


}
const cancelPayment = async (query: Record<string, string>) => {


    const session = await Parcel.startSession()
    session.startTransaction()

    try {



        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            paymentStatus: Payment_Status.CANCELLED
        }, { new: true, runValidators: true, session: session })

        await Parcel.findOneAndUpdate(
            { _id: updatedPayment?.parcel },
            { paymentStatus: Payment_Status.CANCELLED },
            { new: true, runValidators: true }
        )



        await session.commitTransaction()
        session.endSession()

        return {
            success: false,
            message: "Payment cancelled "
        }


    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }


}
const cashOnDeliveryPaymentPayment = async (paymentId: string) => {


    const session = await Parcel.startSession()
    session.startTransaction()

    try {
        if (!paymentId) {
            throw new AppError(404, "Transaction Id is not found")
        }

        const parcel = await Payment.findById(paymentId)

        if (parcel?.paymentMethod == Payment_Method.PREPAID && parcel?.paymentStatus == Payment_Status.PAID) {
            throw new AppError(404, "Payment is already Done")
        }
        if (parcel?.paymentStatus == Payment_Status.PAID) {
            throw new AppError(404, "Payment is already Done")
        }



        const updatedPayment = await Payment.findOneAndUpdate({ _id: paymentId }, {

            paymentStatus: Payment_Status.PAID
        }, { new: true, runValidators: true, session: session })

        await Parcel.findOneAndUpdate(
            { _id: updatedPayment?.parcel },
            { paymentStatus: Payment_Status.PAID },
            { new: true, runValidators: true }
        )



        await session.commitTransaction()
        session.endSession()

        return {
            success: true,
            message: "Payment completed Successfully "
        }


    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }


}



export const PaymentServices = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    cashOnDeliveryPaymentPayment
}