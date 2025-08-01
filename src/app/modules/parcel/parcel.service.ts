/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


import AppError from "../../errorHelpers/AppError"
import { generatetrackingId } from "../../utils/genrateTrackingId"
import { getTransactionId } from "../../utils/getTransactionId"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { Payment } from "../payment/payment.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSlService } from "../sslCommerz/sslCommerz.service"
import { IsActive, Role } from "../user/user.interface"
import { User } from "../user/user.model"
import { parcelSerachTable, VALID_STATUS_TRANSITIONS } from "./parcel.constants"
import { IParcel, Parcel_Status, Payment_Method, Payment_Status, ReturnParcelPayload, Tracking_Event } from "./parcel.interface"
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
            throw new AppError(404, "User is not found")
        }

        if (user.isActive == IsActive.BLOCKED) {
            throw new AppError(404, "BLOCKED Users can not create percel")
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




const getAllParcel = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Parcel.find({}), query)


    const allParcel = await queryBuilder
        .search(parcelSerachTable)
        .filter()
        .sort()
        .fields()
        .paginate()
    const [data, meta] = await Promise.all([
        allParcel.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }

}




const getSingleParcelStatus = async (trackingId: string) => {

    if (!trackingId) {
        throw new AppError(400, "Invalid tracking ID provided");
    }
    const selectedParcelStatus = await Parcel.findOne({ trackingId: trackingId })
    if (!selectedParcelStatus) {
        throw new AppError(404, "Parcel not found with the provided tracking ID");
    }


    return selectedParcelStatus.trackingEvents

}





const updateParcel = async (parcelId: string, payload: Partial<IParcel>) => {
    if (!parcelId) {
        throw new AppError(400, "Parcel ID is required");
    }

    const existingParcel = await Parcel.findById(parcelId)
    if (!existingParcel) {
        throw new AppError(404, "Parcel not found");
    }

    if (existingParcel.status == Parcel_Status.BLOCKED) {
         throw new AppError(404, "Blocked Parcel can not be Edited");
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
    if (isPercelExist.status === Parcel_Status.BLOCKED) {
        throw new AppError(400, `Cannot assign blocked parcel. Reason:  'Under investigation'`);
    }

    if (isDeliverPersonExist.role !== Role.DELIVERY_PERSON) {
        throw new AppError(400, "Selected user is not a delivery person");
    }
    if (isPercelExist.status !== Parcel_Status.REQUESTED) {
        throw new AppError(400, `Cannot assign parcel with status ${isPercelExist.status}. Only REQUESTED parcels can be assigned.`);
    }
    if (isUpdaterExist.role !== Role.ADMIN) {
        throw new AppError(400, `Cannot assign parcel with status ${isPercelExist.status}. Only ADMIN  can be APPROVE the parcel.`);
    }



    // 2. Check if delivery person is blocked
    if (isDeliverPersonExist.isActive === IsActive.BLOCKED) {
        throw new AppError(400, "Cannot assign parcel to blocked delivery person");
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
    if (user.isActive == IsActive.BLOCKED) {
        throw new AppError(403, "Access denied: You can cant view parcels")
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
    if (user.isActive === IsActive.BLOCKED) {
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
    if (nextStatus === Parcel_Status.APPROVED) {
        throw new AppError(403, "Parcels can only be approved via assignment, not direct update");
    }
    if (nextStatus === Parcel_Status.DELIVERED) {
        throw new AppError(403, "Only receivers can confirm delivery. Use receiver confirmation endpoint.");
    }

    parcel.status = nextStatus;
    parcel.trackingEvents.push(payload);

    await parcel.save();

    return parcel;

}


const getIncomingParcels = async (receiverPhone: string) => {
    if (!receiverPhone) {
        throw new AppError(400, "Receiver phone number is required");
    }

    const incomingParcels = await Parcel.find({ 'receiverInfo.phone': receiverPhone })

    return {
        parcels: incomingParcels,
        total: incomingParcels.length,
        receiverInfo: {
            phone: receiverPhone,
            name: incomingParcels[0]?.receiverInfo?.name || "Unknown"
        }
    };
};


const confirmDelivery = async (trackingId: string, receiverPhone: string) => {
    if (!trackingId || !receiverPhone) {
        throw new AppError(400, "Parcel ID and receiver phone are required");
    }
    const parcel = await Parcel.findOne({ trackingId: trackingId });
    // console.log({ parcel })
    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }

    // Verify this parcel belongs to the receiver

    if (parcel.receiverInfo.phone !== receiverPhone) {
        throw new AppError(403, "You are not authorized to confirm this delivery");
    }

    // Check if parcel is in deliverable state
    if (parcel.status !== Parcel_Status.IN_TRANSIT && parcel.status !== Parcel_Status.DELIVERED) {
        throw new AppError(400, `Cannot confirm delivery for parcel with status: ${parcel.status}`);
    }

    // Create confirmation tracking event
    const confirmationEvent: Tracking_Event = {
        updaterId: 'RECEIVER',
        status: Parcel_Status.DELIVERED,
        note: "Delivery confirmed by receiver",
    };


    // Update parcel with confirmation
    const updatedParcel = await Parcel.findOneAndUpdate(
        { trackingId },
        {
            status: Parcel_Status.DELIVERED,
            actualDeliveryDate: new Date(),
            $push: { trackingEvents: confirmationEvent }
        },
        { new: true, runValidators: true }
    ).populate('senderId', 'name email phone');



    return {
        parcel: updatedParcel
    };
};


const collectCODPayment = async (trackingId: string, deliveryPersonId: string) => {
    if (!trackingId || !deliveryPersonId) {
        throw new AppError(400, "Parcel ID and delivery person ID are required");
    }

    const [parcel, deliveryPerson] = await Promise.all([
        Parcel.findOne({ trackingId: trackingId }),
        User.findById(deliveryPersonId)
    ]);

    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }
    if (!deliveryPerson) {
        throw new AppError(404, "Delivery person not found");
    }

    // Validation checks
    if (deliveryPerson.role !== Role.DELIVERY_PERSON) {
        throw new AppError(403, "Only delivery persons can collect COD payments");
    }
    if (parcel.assignedDeliveryPartner?.toString() !== deliveryPersonId) {
        throw new AppError(403, "You are not assigned to this parcel");
    }
    if (parcel.paymentMethod !== Payment_Method.COD) {
        throw new AppError(400, "This parcel is not COD");
    }
    if (parcel.status !== Parcel_Status.DELIVERED) {
        throw new AppError(400, "Parcel must be delivered before collecting COD payment");
    }
    if (parcel.paymentStatus === Payment_Status.PAID) {
        throw new AppError(400, "COD payment already collected");
    }

    const session = await Parcel.startSession();
    session.startTransaction();

    try {
        // Update payment record
        await Payment.findOneAndUpdate(
            { parcel: parcel._id },
            {
                paymentStatus: Payment_Status.PAID
            },
            { session }
        );

        // Update parcel payment status
        const updatedParcel = await Parcel.findByIdAndUpdate(
            { _id: parcel._id },
            {
                paymentStatus: Payment_Status.PAID,
                $push: {
                    trackingEvents: {
                        updaterId: deliveryPersonId,
                        status: Parcel_Status.DELIVERED, // Status stays same
                        note: "COD payment collected successfully"
                    }
                }
            },
            { new: true, session }
        );

        await session.commitTransaction();

        return {
            success: true,
            message: "COD payment collected successfully",
            parcel: updatedParcel,
            amount: parcel.parcelFee.totalFee
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};


const blockParcel = async (parcelId: string, adminId: string) => {
    // Input validation
    if (!parcelId || !adminId) {
        throw new AppError(400, "Parcel ID, reason, and admin ID are required");
    }

    // Verify admin permissions (allow SYSTEM for auto-blocking)


    const admin = await User.findById(adminId);
    if (!admin || (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN)) {
        throw new AppError(403, "Only admins can block parcels");
    }


    // Get parcel to block
    const parcel = await Parcel.findById(parcelId)
    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }

    // Business logic validations
    if (parcel.status === Parcel_Status.BLOCKED) {
        throw new AppError(400, "Parcel is already blocked");
    }

    if (parcel.status === Parcel_Status.DELIVERED) {
        throw new AppError(400, "Cannot block delivered parcels");
    }

    if (parcel.status === Parcel_Status.CANCELLED) {
        throw new AppError(400, "Cannot block cancelled parcels");
    }

    // Start database transaction
    const session = await Parcel.startSession();
    session.startTransaction();

    try {
        // Create blocking tracking event
        const blockingEvent: Tracking_Event = {
            updaterId: adminId,
            status: Parcel_Status.BLOCKED,
            note: `Parcel blocked.`
        };

        // Update parcel with blocking information
        const blockedParcel = await Parcel.findByIdAndUpdate(
            parcelId,
            {
                status: Parcel_Status.BLOCKED,
                $push: { trackingEvents: blockingEvent }
            },
            { new: true, runValidators: true, session }
        ).populate('senderId', 'name email phone');

        await session.commitTransaction();



        return {
            parcel: blockedParcel,
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};
const unblockParcel = async (parcelId: string, adminId: string) => {
    // Input validation
    if (!parcelId || !adminId) {
        throw new AppError(400, "Parcel ID, reason, and admin ID are required");
    }

    // Verify admin permissions (allow SYSTEM for auto-blocking)


    const admin = await User.findById(adminId);
    if (!admin || (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN)) {
        throw new AppError(403, "Only admins can block parcels");
    }


    // Get parcel to block
    const parcel = await Parcel.findById(parcelId)
    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }

    if (parcel.status === Parcel_Status.CANCELLED) {
        throw new AppError(400, "Cannot block cancelled parcels");
    }

    // Business logic validations
    if (parcel.status !== Parcel_Status.BLOCKED) {
        throw new AppError(400, "Parcel is already Unblocked");
    }
    const trackingEvents = parcel.trackingEvents || [];
    let status: Parcel_Status = Parcel_Status.BLOCKED
    // Start from the most recent and work backwards
    for (let i = trackingEvents.length - 1; i >= 0; i--) {
        const event = trackingEvents[i];

        // Skip blocked status events
        if (event.status == Parcel_Status.BLOCKED) {
            status = trackingEvents[i-1].status
        }
    }

    // Start database transaction
    const session = await Parcel.startSession();
    session.startTransaction();

    try {
        // Create blocking tracking event
        const blockingEvent: Tracking_Event = {
            updaterId: adminId,
            status: status,
            note: `Parcel blocked.`
        };

        // Update parcel with blocking information
        const blockedParcel = await Parcel.findByIdAndUpdate(
            parcelId,
            {
                status: status,
                $push: { trackingEvents: blockingEvent }
            },
            { new: true, runValidators: true, session }
        ).populate('senderId', 'name email phone');

        await session.commitTransaction();



        return {
            parcel: blockedParcel,
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

const returnParcel = async (parcelId: string, payload: ReturnParcelPayload) => {
    if (!parcelId || !payload.returnReason || !payload.requestedBy) {
        throw new AppError(400, "Parcel ID, return reason, and requester are required");
    }

    const [parcel, requester] = await Promise.all([
        Parcel.findById(parcelId),
        User.findById(payload.requestedBy)
    ]);

    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }
    if (!requester) {
        throw new AppError(404, "Requester not found");
    }

    // 🚨 BUSINESS RULES FOR RETURN

    // Only certain statuses can be returned
    const returnableStatuses = [
        Parcel_Status.REQUESTED,
        Parcel_Status.APPROVED,
        Parcel_Status.PICKED_UP, 
        Parcel_Status.IN_TRANSIT
    ];
    const parcelStatus: Parcel_Status = parcel.status as Parcel_Status

    if (!returnableStatuses.includes(parcelStatus)) {
        throw new AppError(400, `Cannot return parcel with status ${parcel.status}`);
    }
    if (parcel.paymentMethod == Payment_Method.PREPAID) {
        throw new AppError(400, `Cannot return parcel with status `);
    }

    // Role-based return permissions
    const canReturn = (
        requester.role === Role.ADMIN || 
        requester.role === Role.SUPER_ADMIN ||
        (requester.role === Role.DELIVERY_PERSON && parcel.assignedDeliveryPartner?.toString() === payload.requestedBy) ||
        (requester.role === Role.SENDER && parcel.senderId.toString() === payload.requestedBy)
    );

    if (!canReturn) {
        throw new AppError(403, "You are not authorized to return this parcel");
    }

    const session = await Parcel.startSession();
    session.startTransaction();

    try {
        


            if (parcel.paymentMethod === Payment_Method.COD) {
                await Payment.findOneAndUpdate(
                    { parcel: parcelId },
                    {
                        paymentStatus: Payment_Status.CANCELLED,
                        cancelledAt: new Date(),
                        cancellationReason: `Return: ${payload.returnReason}`
                    },
                    { session }
                );
            }
        

        // Create return tracking event
        const returnEvent: Tracking_Event = {
            updaterId: payload.requestedBy,
            status: Parcel_Status.RETURNED,
            note: `Parcel returned. Type: ${payload.returnType}. Reason: ${payload.returnReason}`,
        };

        // Update parcel to RETURNED status
        const returnedParcel = await Parcel.findByIdAndUpdate(
            parcelId,
            {
                status: Parcel_Status.RETURNED,
                paymentStatus: Payment_Status.REFUNDED,
                $push: { trackingEvents: returnEvent }
            },
            { new: true, runValidators: true, session }
        ).populate('senderId', 'name email phone');

        await session.commitTransaction();


        return {
            parcel: returnedParcel,
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

export const ParcelServices = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel,
    assignParcelToDeliveryPerson,
    getAllParcelById,
    updateParcelStatus,
    getIncomingParcels,
    confirmDelivery,
    collectCODPayment,
    blockParcel,
    unblockParcel,
    returnParcel
}