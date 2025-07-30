/* eslint-disable @typescript-eslint/no-explicit-any */

import { generatetrackingId } from "../../utils/genrateTrackingId"
import { getTransactionId } from "../../utils/getTransactionId"
import { Payment } from "../payment/payment.model"
import { IParcel } from "./parcel.interface"
import { Parcel } from "./parcel.model"


const createParcel = async (payload: Partial<IParcel>) => {

    const trackingId = generatetrackingId()

    const session = await Parcel.startSession()
    session.startTransaction()

    try {
        const parcel = await Parcel.create([{
            trackingId,
            ...payload
        }], {session})

        const payment = await Payment.create([{
            transactionId: getTransactionId(),
            parcel: parcel[0]._id,
            amount: parcel[0].parcelFee?.totalFee,
            paymentMethod: parcel[0].paymentMethod,
            paymentStatus: parcel[0].paymentStatus
        }], {session})

        const updatedParcel = await Parcel.findOneAndUpdate(
            parcel[0]._id,
            { paymentId: payment[0]._id },
            { new: true, runValidators: true, session })
            .populate("senderId", "email phone")
            .populate("paymentId", "_id transactionId")

            await session.commitTransaction()
            session.endSession()

        return updatedParcel


    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }

}
const getAllParcel = async () => {


    const allParcel = await Parcel.find({})

    return allParcel

}
const getSingleParcelStatus = async (trackingId: string) => {


    const selectedParcelStatus = await Parcel.findOne({ trackingId: trackingId })

    return selectedParcelStatus?.status

}
const updateParcel = async (parcelId: string, payload: Partial<IParcel>) => {


    const updatedParcel = await Parcel.findOneAndUpdate({ _id: parcelId }, payload, { new: true })

    return updatedParcel

}

export const ParcelServices = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel
}