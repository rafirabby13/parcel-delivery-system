/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError"
import { Payment_Method, Payment_Status } from "../parcel/parcel.interface"
import { Parcel } from "../parcel/parcel.model"
import { Payment } from "./payment.model"

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
    successPayment,
    failPayment,
    cancelPayment,
    cashOnDeliveryPaymentPayment
}