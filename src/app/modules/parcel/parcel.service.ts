/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


import AppError from "../../errorHelpers/AppError"
import { generatetrackingId } from "../../utils/genrateTrackingId"
import { getTransactionId } from "../../utils/getTransactionId"
import { Payment } from "../payment/payment.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSlService } from "../sslCommerz/sslCommerz.service"
import { Role } from "../user/user.interface"
import { User } from "../user/user.model"
import { VALID_STATUS_TRANSITIONS } from "./parcel.constants"
import { IParcel, Parcel_Status, Payment_Method, Tracking_Event } from "./parcel.interface"
import { Parcel } from "./parcel.model"


const createParcel = async (payload: Partial<IParcel>) => {

    const transactionId = getTransactionId()

    if (!payload.senderId || !payload.parcelFee?.totalFee) {
        throw new AppError(400, "Missing required fields: senderId and parcelFee are required");
    }
    const trackingId: string = generatetrackingId()

    const session = await Parcel.startSession()
    session.startTransaction()

    try {
        const parcel = await Parcel.create([{
            trackingId,
            ...payload
        }], { session })

        const user = await User.findById(payload.senderId)

        if (!parcel) {
            throw new AppError(404, "Parcel is not created")
        }
        if (!user) {
            throw new AppError(404, "Parcel is not found")
        }

        const payment = await Payment.create([{
            transactionId: transactionId,
            parcel: parcel[0]._id,
            amount: parcel[0].parcelFee?.totalFee,
            paymentMethod: parcel[0].paymentMethod,
            paymentStatus: parcel[0].paymentStatus
        }], { session })

        const updatedParcel = await Parcel.findOneAndUpdate(
            { _id: parcel[0]._id },
            { paymentId: payment[0]._id },
            { new: true, runValidators: true, session })
            .populate("senderId", "email phone")
            .populate("paymentId", "_id transactionId")

        const address = (parcel[0].senderInfo as any).detailAddress

        const sslPayload: ISSLCommerz = {
            transactionId: (payment[0] as any).transactionId,
            address: address,
            amount: (payment[0] as any).amount,
            email: user?.email,
            name: user?.name,
            phone: user?.phone



        }

        // console.log("sslpayload", sslPayload)
        let sslPayment: any

        if (updatedParcel?.paymentMethod === Payment_Method.PREPAID) {

            sslPayment = await SSlService.sslPaymentInit(sslPayload)
        }


        // console.log(sslPayment)

        await session.commitTransaction()
        session.endSession()

        return {
            paymentURL: sslPayment?.GatewayPageURL,
            parcel: updatedParcel
        }


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

    if (!trackingId) {
        throw new AppError(400, "Invalid tracking ID provided");
    }
    const selectedParcelStatus = await Parcel.findOne({ trackingId: trackingId })
    if (!selectedParcelStatus) {
        throw new AppError(404, "Parcel not found with the provided tracking ID");
    }


    return selectedParcelStatus?.status

}





const updateParcel = async (parcelId: string, payload: Partial<IParcel>) => {
    if (!parcelId) {
        throw new AppError(400, "Parcel ID is required");
    }

    const existingParcel = await Parcel.findById(parcelId)
    if (!existingParcel) {
        throw new AppError(404, "Parcel not found");
    }

    // Add audit information
    const updateData = {
        ...payload,
        updatedAt: new Date()
    }

    const updatedParcel = await Parcel.findOneAndUpdate(
        { _id: parcelId },
        updateData,
        { new: true, runValidators: true }
    ).populate("senderId", "email phone name")

    return updatedParcel

}


const assignParcelToDeliveryPerson = async (parcelId: string, deliveryPersonId: string, updaterId: string) => {

    if (!parcelId || !deliveryPersonId || !updaterId) {
        throw new AppError(400, "All parameters (parcelId, deliveryPersonId, updaterId) are required");
    }
    // const parcel = await Parcel.findById(parcelId)
    const isDeliverPersonExist = await User.findById(deliveryPersonId)
    const isPercelExist = await Parcel.findById(parcelId)
    const isUpdaterExist = await User.findById(updaterId)
    if (!isDeliverPersonExist) {
        throw new AppError(404, "Delivery person not found");
    }
    if (!isPercelExist) {
        throw new AppError(404, "Parcel not found");
    }
    if (!isUpdaterExist) {
        throw new AppError(404, "Updater not found");
    }

    if (isDeliverPersonExist.role !== Role.DELIVERY_PERSON) {
        throw new AppError(400, "Selected user is not a delivery person");
    }
    if (isPercelExist.status !== Parcel_Status.REQUESTED) {
        throw new AppError(400, `Cannot assign parcel with status ${isPercelExist.status}. Only REQUESTED parcels can be assigned.`);
    }

    const updatedTrackinEvents: Tracking_Event = {
        updaterId: updaterId,
        status: Parcel_Status.APPROVED,
        note: "Parcel approved and assigned to delivery partner"
    }
    const updateDeliveryParson = {
        assignedDeliveryPartner: deliveryPersonId,
        status: updatedTrackinEvents.status
    }

    const updatedData = await Parcel.findOneAndUpdate({ _id: parcelId }, updateDeliveryParson, { new: true, runValidators: true })

    updatedData?.trackingEvents.push(updatedTrackinEvents)
    updatedData?.save()

    return updatedData

}



const getAllParcelById = async (id: string, user: any) => {

    if (id !== user.userId) {
        throw new AppError(403, "Access denied: You can only view your own parcels")
    }
    let query: any = {}

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
    if (!parcelId || !payload.updaterId || !payload.status) {
        throw new AppError(400, "Missing required fields: parcelId, updaterId, and status are required");
    }

    const user = await User.findById(payload.updaterId)
    const parcel = await Parcel.findById(parcelId)
    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }
    if (!user) {
        throw new AppError(404, "User not found");
    }
    if (user.role === Role.DELIVERY_PERSON && parcel.assignedDeliveryPartner?.toString() !== payload.updaterId) {
        throw new AppError(403, "You are not authorized to update this parcel's status");
    }
    const currentStatus = parcel.status;
    const nextStatus = payload.status;
    // console.log(currentStatus)
    if (!currentStatus) {
        throw new AppError(400, "Current parcel status is missing");
    }
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(nextStatus)) {
        throw new AppError(400, `Invalid status transition from ${currentStatus} to ${nextStatus}`);
    }
    if (nextStatus === Parcel_Status.CANCELLED) {
        if (user.role === Role.DELIVERY_PERSON) {
            throw new AppError(403, "Delivery persons cannot cancel parcels");
        }
        if (user.role === Role.SENDER && currentStatus !== Parcel_Status.REQUESTED) {
            throw new AppError(403, "Senders can only cancel parcels in REQUESTED status");
        }
    }

    parcel.status = nextStatus;
    parcel.trackingEvents.push(payload);

    await parcel.save();

    return parcel;

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