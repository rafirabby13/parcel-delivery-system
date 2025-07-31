/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errorHelpers/AppError"
import { generatetrackingId } from "../../utils/genrateTrackingId"
import { getTransactionId } from "../../utils/getTransactionId"
import { Payment } from "../payment/payment.model"
import { Role } from "../user/user.interface"
import { User } from "../user/user.model"
import { IParcel, Parcel_Status, Tracking_Event } from "./parcel.interface"
import { Parcel } from "./parcel.model"


const createParcel = async (payload: Partial<IParcel>) => {

    const trackingId = generatetrackingId()

    const session = await Parcel.startSession()
    session.startTransaction()

    try {
        const parcel = await Parcel.create([{
            trackingId,
            ...payload
        }], { session })

        const payment = await Payment.create([{
            transactionId: getTransactionId(),
            parcel: parcel[0]._id,
            amount: parcel[0].parcelFee?.totalFee,
            paymentMethod: parcel[0].paymentMethod,
            paymentStatus: parcel[0].paymentStatus
        }], { session })

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


const assignParcelToDeliveryPerson = async (parcelId: string, deliveryPersonId: string, updaterId: string) => {


    // const parcel = await Parcel.findById(parcelId)
    const isDeliverPersonExist = await User.findById(deliveryPersonId)
    const isPercelExist = await Parcel.findById(parcelId)
    if (!isDeliverPersonExist || ! isPercelExist) {
        throw new AppError(404, "Try to update valid parcel")
    }

    const updatedTrackinEvents: Tracking_Event = {
        updaterId: updaterId,
        status: Parcel_Status.APPROVED,
        note: "your parcel is approved"
    }
    const updateDeliveryParson = {
        assignedDeliveryPartner: deliveryPersonId,
        status: updatedTrackinEvents.status
    }

    const updatedData = await Parcel.findOneAndUpdate({ _id: parcelId }, updateDeliveryParson, { new: true, sanitizeFilter: true })

    updatedData?.trackingEvents.push(updatedTrackinEvents)
    updatedData?.save()

    return updatedData

}
const getAllParcelById = async (id: string, user: any) => {

    if (id !== user.userId) {
        throw new AppError(403, "U cant get these data")
    }
    let query = {}

    if (user.role == Role.DELIVERY_PERSON) {
        query = { assignedDeliveryPartner: id }
    }
    if (user.role == Role.SENDER) {
        query = { senderId: id }
    }

    // const parcel = await Parcel.findById(parcelId)

    const updatedData = await Parcel.find(query)

    return updatedData

}


const updateParcelStatus = async (parcelId: string, payload: Tracking_Event) => {


    const parcel = await Parcel.findById(parcelId)
    if ((parcel?.assignedDeliveryPartner)?.toString() !== payload.updaterId) {
         throw new AppError(403, "You are not permitted to updated stasus")
    }

    

    const updatedData = await Parcel.findOneAndUpdate({ _id: parcelId }, {status: payload.status}, { new: true, sanitizeFilter: true })

    updatedData?.trackingEvents.push(payload)
    updatedData?.save()

    return updatedData

}

export const ParcelServices = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel,
    assignParcelToDeliveryPerson,
    getAllParcelById,
    updateParcelStatus
}