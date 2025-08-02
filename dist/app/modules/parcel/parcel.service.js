"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.ParcelServices = exports.trackParcelByTrackingIdPublic = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const genrateTrackingId_1 = require("../../utils/genrateTrackingId");
const getTransactionId_1 = require("../../utils/getTransactionId");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const parcel_constants_1 = require("./parcel.constants");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const createParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    if (!payload.senderId || !((_a = payload.parcelFee) === null || _a === void 0 ? void 0 : _a.totalFee)) {
        throw new AppError_1.default(400, "Missing required fields: senderId and parcelFee are required");
    }
    const trackingId = (0, genrateTrackingId_1.generatetrackingId)();
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        const parcel = yield parcel_model_1.Parcel.create([Object.assign({ trackingId }, payload)], { session });
        const user = yield user_model_1.User.findById(payload.senderId);
        if (!parcel) {
            throw new AppError_1.default(404, "Parcel is not created");
        }
        if (!user) {
            throw new AppError_1.default(404, "User is not found");
        }
        if (user.isActive == user_interface_1.IsActive.BLOCKED) {
            throw new AppError_1.default(404, "BLOCKED Users can not create percel");
        }
        const payment = yield payment_model_1.Payment.create([{
                transactionId: transactionId,
                parcel: parcel[0]._id,
                amount: (_b = parcel[0].parcelFee) === null || _b === void 0 ? void 0 : _b.totalFee,
                paymentMethod: parcel[0].paymentMethod,
                paymentStatus: parcel[0].paymentStatus,
            }], { session });
        const updatedParcel = yield parcel_model_1.Parcel.findOneAndUpdate({ _id: parcel[0]._id }, { paymentId: payment[0]._id }, { new: true, runValidators: true, session })
            .populate("senderId", "email phone")
            .populate("paymentId", "_id transactionId");
        const address = parcel[0].senderInfo.detailAddress;
        const sslPayload = {
            transactionId: payment[0].transactionId,
            address: address,
            amount: payment[0].amount,
            email: user === null || user === void 0 ? void 0 : user.email,
            name: user === null || user === void 0 ? void 0 : user.name,
            phone: user === null || user === void 0 ? void 0 : user.phone,
        };
        // console.log("sslpayload", sslPayload)
        let sslPayment;
        if ((updatedParcel === null || updatedParcel === void 0 ? void 0 : updatedParcel.paymentMethod) === parcel_interface_1.Payment_Method.PREPAID) {
            sslPayment = yield sslCommerz_service_1.SSlService.sslPaymentInit(sslPayload);
        }
        // console.log(sslPayment)
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentURL: sslPayment === null || sslPayment === void 0 ? void 0 : sslPayment.GatewayPageURL,
            parcel: updatedParcel
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllParcel = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({}), query);
    const allParcel = yield queryBuilder
        .search(parcel_constants_1.parcelSerachTable)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        allParcel.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleParcelStatus = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!trackingId) {
        throw new AppError_1.default(400, "Invalid tracking ID provided");
    }
    const selectedParcelStatus = yield parcel_model_1.Parcel.findOne({ trackingId: trackingId });
    if (!selectedParcelStatus) {
        throw new AppError_1.default(404, "Parcel not found with the provided tracking ID");
    }
    return selectedParcelStatus.trackingEvents;
});
const updateParcel = (parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!parcelId) {
        throw new AppError_1.default(400, "Parcel ID is required");
    }
    const existingParcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!existingParcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (existingParcel.status == parcel_interface_1.Parcel_Status.BLOCKED) {
        throw new AppError_1.default(404, "Blocked Parcel can not be Edited");
    }
    // Add audit information
    const updateData = Object.assign(Object.assign({}, payload), { updatedAt: new Date() });
    const updatedParcel = yield parcel_model_1.Parcel.findOneAndUpdate({ _id: parcelId }, updateData, { new: true, runValidators: true }).populate("senderId", "email phone name");
    return updatedParcel;
});
const assignParcelToDeliveryPerson = (parcelId, deliveryPersonId, updaterId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!parcelId || !deliveryPersonId || !updaterId) {
        throw new AppError_1.default(400, "All parameters (parcelId, deliveryPersonId, updaterId) are required");
    }
    // const parcel = await Parcel.findById(parcelId)
    const isDeliverPersonExist = yield user_model_1.User.findById(deliveryPersonId);
    const isPercelExist = yield parcel_model_1.Parcel.findById(parcelId);
    const isUpdaterExist = yield user_model_1.User.findById(updaterId);
    if (!isDeliverPersonExist) {
        throw new AppError_1.default(404, "Delivery person not found");
    }
    if (!isPercelExist) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (!isUpdaterExist) {
        throw new AppError_1.default(404, "Updater not found");
    }
    if (isPercelExist.status === parcel_interface_1.Parcel_Status.BLOCKED) {
        throw new AppError_1.default(400, `Cannot assign blocked parcel. Reason:  'Under investigation'`);
    }
    if (isDeliverPersonExist.role !== user_interface_1.Role.DELIVERY_PERSON) {
        throw new AppError_1.default(400, "Selected user is not a delivery person");
    }
    if (isPercelExist.status !== parcel_interface_1.Parcel_Status.REQUESTED) {
        throw new AppError_1.default(400, `Cannot assign parcel with status ${isPercelExist.status}. Only REQUESTED parcels can be assigned.`);
    }
    if (isUpdaterExist.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(400, `Cannot assign parcel with status ${isPercelExist.status}. Only ADMIN  can be APPROVE the parcel.`);
    }
    // 2. Check if delivery person is blocked
    if (isDeliverPersonExist.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(400, "Cannot assign parcel to blocked delivery person");
    }
    const updatedTrackinEvents = {
        updaterId: updaterId,
        status: parcel_interface_1.Parcel_Status.APPROVED,
        note: "Parcel approved and assigned to delivery partner"
    };
    const updateDeliveryParson = {
        assignedDeliveryPartner: deliveryPersonId,
        status: updatedTrackinEvents.status
    };
    const updatedData = yield parcel_model_1.Parcel.findOneAndUpdate({ _id: parcelId }, updateDeliveryParson, { new: true, runValidators: true });
    updatedData === null || updatedData === void 0 ? void 0 : updatedData.trackingEvents.push(updatedTrackinEvents);
    updatedData === null || updatedData === void 0 ? void 0 : updatedData.save();
    return updatedData;
});
const getAllParcelById = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (id !== user.userId) {
        throw new AppError_1.default(403, "Access denied: You can only view your own parcels");
    }
    let query = {};
    if (user.role == user_interface_1.Role.DELIVERY_PERSON) {
        query = { assignedDeliveryPartner: id };
    }
    if (user.role == user_interface_1.Role.SENDER) {
        query = { senderId: id };
    }
    if (user.isActive == user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(403, "Access denied: You can cant view parcels");
    }
    // const parcel = await Parcel.findById(parcelId)
    const updatedData = yield parcel_model_1.Parcel.find(query);
    return updatedData;
});
const updateParcelStatus = (parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!parcelId || !payload.updaterId || !payload.status) {
        throw new AppError_1.default(400, "Missing required fields: parcelId, updaterId, and status are required");
    }
    const user = yield user_model_1.User.findById(payload.updaterId);
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.role === user_interface_1.Role.DELIVERY_PERSON && ((_a = parcel.assignedDeliveryPartner) === null || _a === void 0 ? void 0 : _a.toString()) !== payload.updaterId) {
        throw new AppError_1.default(403, "You are not authorized to update this parcel's status");
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(403, "You are not authorized to update this parcel's status");
    }
    const currentStatus = parcel.status;
    const nextStatus = payload.status;
    // console.log(currentStatus)
    if (!currentStatus) {
        throw new AppError_1.default(400, "Current parcel status is missing");
    }
    const allowedTransitions = parcel_constants_1.VALID_STATUS_TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(nextStatus)) {
        throw new AppError_1.default(400, `Invalid status transition from ${currentStatus} to ${nextStatus}`);
    }
    if (nextStatus === parcel_interface_1.Parcel_Status.CANCELLED) {
        if (user.role === user_interface_1.Role.DELIVERY_PERSON) {
            throw new AppError_1.default(403, "Delivery persons cannot cancel parcels");
        }
        if (user.role === user_interface_1.Role.SENDER && currentStatus !== parcel_interface_1.Parcel_Status.REQUESTED) {
            throw new AppError_1.default(403, "Senders can only cancel parcels in REQUESTED status");
        }
    }
    if (nextStatus === parcel_interface_1.Parcel_Status.APPROVED) {
        throw new AppError_1.default(403, "Parcels can only be approved via assignment, not direct update");
    }
    if (nextStatus === parcel_interface_1.Parcel_Status.DELIVERED) {
        throw new AppError_1.default(403, "Only receivers can confirm delivery. Use receiver confirmation endpoint.");
    }
    parcel.status = nextStatus;
    parcel.trackingEvents.push(payload);
    yield parcel.save();
    return parcel;
});
const getIncomingParcels = (receiverPhone) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!receiverPhone) {
        throw new AppError_1.default(400, "Receiver phone number is required");
    }
    const incomingParcels = yield parcel_model_1.Parcel.find({ 'receiverInfo.phone': receiverPhone });
    return {
        parcels: incomingParcels,
        total: incomingParcels.length,
        receiverInfo: {
            phone: receiverPhone,
            name: ((_b = (_a = incomingParcels[0]) === null || _a === void 0 ? void 0 : _a.receiverInfo) === null || _b === void 0 ? void 0 : _b.name) || "Unknown"
        }
    };
});
const confirmDelivery = (trackingId, receiverPhone) => __awaiter(void 0, void 0, void 0, function* () {
    if (!trackingId || !receiverPhone) {
        throw new AppError_1.default(400, "Parcel ID and receiver phone are required");
    }
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId: trackingId });
    // console.log({ parcel })
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    // Verify this parcel belongs to the receiver
    if (parcel.receiverInfo.phone !== receiverPhone) {
        throw new AppError_1.default(403, "You are not authorized to confirm this delivery");
    }
    // Check if parcel is in deliverable state
    if (parcel.status !== parcel_interface_1.Parcel_Status.IN_TRANSIT && parcel.status !== parcel_interface_1.Parcel_Status.DELIVERED) {
        throw new AppError_1.default(400, `Cannot confirm delivery for parcel with status: ${parcel.status}`);
    }
    // Create confirmation tracking event
    const confirmationEvent = {
        updaterId: 'RECEIVER',
        status: parcel_interface_1.Parcel_Status.DELIVERED,
        note: "Delivery confirmed by receiver",
    };
    // Update parcel with confirmation
    const updatedParcel = yield parcel_model_1.Parcel.findOneAndUpdate({ trackingId }, {
        status: parcel_interface_1.Parcel_Status.DELIVERED,
        actualDeliveryDate: new Date(),
        $push: { trackingEvents: confirmationEvent }
    }, { new: true, runValidators: true }).populate('senderId', 'name email phone');
    return {
        parcel: updatedParcel
    };
});
const collectCODPayment = (trackingId, deliveryPersonId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!trackingId || !deliveryPersonId) {
        throw new AppError_1.default(400, "Parcel ID and delivery person ID are required");
    }
    const [parcel, deliveryPerson] = yield Promise.all([
        parcel_model_1.Parcel.findOne({ trackingId: trackingId }),
        user_model_1.User.findById(deliveryPersonId)
    ]);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (!deliveryPerson) {
        throw new AppError_1.default(404, "Delivery person not found");
    }
    // Validation checks
    if (deliveryPerson.role !== user_interface_1.Role.DELIVERY_PERSON) {
        throw new AppError_1.default(403, "Only delivery persons can collect COD payments");
    }
    if (((_a = parcel.assignedDeliveryPartner) === null || _a === void 0 ? void 0 : _a.toString()) !== deliveryPersonId) {
        throw new AppError_1.default(403, "You are not assigned to this parcel");
    }
    if (parcel.paymentMethod !== parcel_interface_1.Payment_Method.COD) {
        throw new AppError_1.default(400, "This parcel is not COD");
    }
    if (parcel.status !== parcel_interface_1.Parcel_Status.DELIVERED) {
        throw new AppError_1.default(400, "Parcel must be delivered before collecting COD payment");
    }
    if (parcel.paymentStatus === parcel_interface_1.Payment_Status.PAID) {
        throw new AppError_1.default(400, "COD payment already collected");
    }
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        // Update payment record
        yield payment_model_1.Payment.findOneAndUpdate({ parcel: parcel._id }, {
            paymentStatus: parcel_interface_1.Payment_Status.PAID
        }, { session });
        // Update parcel payment status
        const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate({ _id: parcel._id }, {
            paymentStatus: parcel_interface_1.Payment_Status.PAID,
            $push: {
                trackingEvents: {
                    updaterId: deliveryPersonId,
                    status: parcel_interface_1.Parcel_Status.DELIVERED, // Status stays same
                    note: "COD payment collected successfully"
                }
            }
        }, { new: true, session });
        yield session.commitTransaction();
        return {
            success: true,
            message: "COD payment collected successfully",
            parcel: updatedParcel,
            amount: parcel.parcelFee.totalFee
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const blockParcel = (parcelId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    // Input validation
    if (!parcelId || !adminId) {
        throw new AppError_1.default(400, "Parcel ID, reason, and admin ID are required");
    }
    // Verify admin permissions (allow SYSTEM for auto-blocking)
    const admin = yield user_model_1.User.findById(adminId);
    if (!admin || (admin.role !== user_interface_1.Role.ADMIN && admin.role !== user_interface_1.Role.SUPER_ADMIN)) {
        throw new AppError_1.default(403, "Only admins can block parcels");
    }
    // Get parcel to block
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    // Business logic validations
    if (parcel.status === parcel_interface_1.Parcel_Status.BLOCKED) {
        throw new AppError_1.default(400, "Parcel is already blocked");
    }
    if (parcel.status === parcel_interface_1.Parcel_Status.DELIVERED) {
        throw new AppError_1.default(400, "Cannot block delivered parcels");
    }
    if (parcel.status === parcel_interface_1.Parcel_Status.CANCELLED) {
        throw new AppError_1.default(400, "Cannot block cancelled parcels");
    }
    // Start database transaction
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        // Create blocking tracking event
        const blockingEvent = {
            updaterId: adminId,
            status: parcel_interface_1.Parcel_Status.BLOCKED,
            note: `Parcel blocked.`
        };
        // Update parcel with blocking information
        const blockedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, {
            status: parcel_interface_1.Parcel_Status.BLOCKED,
            $push: { trackingEvents: blockingEvent }
        }, { new: true, runValidators: true, session }).populate('senderId', 'name email phone');
        yield session.commitTransaction();
        return {
            parcel: blockedParcel,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const unblockParcel = (parcelId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    // Input validation
    if (!parcelId || !adminId) {
        throw new AppError_1.default(400, "Parcel ID, reason, and admin ID are required");
    }
    // Verify admin permissions (allow SYSTEM for auto-blocking)
    const admin = yield user_model_1.User.findById(adminId);
    if (!admin || (admin.role !== user_interface_1.Role.ADMIN && admin.role !== user_interface_1.Role.SUPER_ADMIN)) {
        throw new AppError_1.default(403, "Only admins can block parcels");
    }
    // Get parcel to block
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (parcel.status === parcel_interface_1.Parcel_Status.CANCELLED) {
        throw new AppError_1.default(400, "Cannot block cancelled parcels");
    }
    // Business logic validations
    if (parcel.status !== parcel_interface_1.Parcel_Status.BLOCKED) {
        throw new AppError_1.default(400, "Parcel is already Unblocked");
    }
    const trackingEvents = parcel.trackingEvents || [];
    let status = parcel_interface_1.Parcel_Status.BLOCKED;
    // Start from the most recent and work backwards
    for (let i = trackingEvents.length - 1; i >= 0; i--) {
        const event = trackingEvents[i];
        // Skip blocked status events
        if (event.status == parcel_interface_1.Parcel_Status.BLOCKED) {
            status = trackingEvents[i - 1].status;
        }
    }
    // Start database transaction
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        // Create blocking tracking event
        const blockingEvent = {
            updaterId: adminId,
            status: status,
            note: `Parcel blocked.`
        };
        // Update parcel with blocking information
        const blockedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, {
            status: status,
            $push: { trackingEvents: blockingEvent }
        }, { new: true, runValidators: true, session }).populate('senderId', 'name email phone');
        yield session.commitTransaction();
        return {
            parcel: blockedParcel,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const returnParcel = (parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!parcelId || !payload.returnReason || !payload.requestedBy) {
        throw new AppError_1.default(400, "Parcel ID, return reason, and requester are required");
    }
    const [parcel, requester] = yield Promise.all([
        parcel_model_1.Parcel.findById(parcelId),
        user_model_1.User.findById(payload.requestedBy)
    ]);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (!requester) {
        throw new AppError_1.default(404, "Requester not found");
    }
    // 🚨 BUSINESS RULES FOR RETURN
    // Only certain statuses can be returned
    const returnableStatuses = [
        parcel_interface_1.Parcel_Status.REQUESTED,
        parcel_interface_1.Parcel_Status.APPROVED,
        parcel_interface_1.Parcel_Status.PICKED_UP,
        parcel_interface_1.Parcel_Status.IN_TRANSIT
    ];
    const parcelStatus = parcel.status;
    if (!returnableStatuses.includes(parcelStatus)) {
        throw new AppError_1.default(400, `Cannot return parcel with status ${parcel.status}`);
    }
    // if (parcel.paymentMethod == Payment_Method.PREPAID) {
    //     throw new AppError(400, `Cannot return parcel with status `);
    // }
    // Role-based return permissions
    const canReturn = (requester.role === user_interface_1.Role.ADMIN ||
        requester.role === user_interface_1.Role.SUPER_ADMIN ||
        (requester.role === user_interface_1.Role.DELIVERY_PERSON && ((_a = parcel.assignedDeliveryPartner) === null || _a === void 0 ? void 0 : _a.toString()) === payload.requestedBy) ||
        (requester.role === user_interface_1.Role.SENDER && parcel.senderId.toString() === payload.requestedBy));
    if (!canReturn) {
        throw new AppError_1.default(403, "You are not authorized to return this parcel");
    }
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        if (parcel.paymentMethod === parcel_interface_1.Payment_Method.PREPAID) {
            yield payment_model_1.Payment.findOneAndUpdate({ parcel: parcelId }, {
                paymentStatus: parcel_interface_1.Payment_Status.REFUNDED,
                refundedAt: new Date(),
                refundReason: `Return: ${payload.returnReason}`
            }, { session });
        }
        if (parcel.paymentMethod === parcel_interface_1.Payment_Method.COD) {
            yield payment_model_1.Payment.findOneAndUpdate({ parcel: parcelId }, {
                paymentStatus: parcel_interface_1.Payment_Status.CANCELLED,
                cancelledAt: new Date(),
                cancellationReason: `Return: ${payload.returnReason}`
            }, { session });
        }
        // Create return tracking event
        const returnEvent = {
            updaterId: payload.requestedBy,
            status: parcel_interface_1.Parcel_Status.RETURNED,
            note: `Parcel returned. Type: ${payload.returnType}. Reason: ${payload.returnReason}`,
        };
        // Update parcel to RETURNED status
        const returnedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, {
            status: parcel_interface_1.Parcel_Status.RETURNED,
            paymentStatus: parcel_interface_1.Payment_Status.REFUNDED,
            $push: { trackingEvents: returnEvent }
        }, { new: true, runValidators: true, session }).populate('senderId', 'name email phone');
        yield session.commitTransaction();
        return {
            parcel: returnedParcel,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
const trackParcelByTrackingIdPublic = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!trackingId) {
        throw new AppError_1.default(404, 'TrackingId is not found');
    }
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId });
    if (!parcel) {
        throw new AppError_1.default(404, 'Parcel not found');
    }
    const trackParcel = parcel.trackingEvents[parcel.trackingEvents.length - 1];
    // console.log(parcel.trackingEvents[parcel.trackingEvents.length-1])
    // console.log(parcel)
    const data = {
        TrackingId: trackingId,
        CurrentStatus: trackParcel.status,
        Sender: parcel.senderInfo.name,
        PaymentMethod: parcel.paymentMethod
    };
    return {
        parcelStatus: data
    };
});
exports.trackParcelByTrackingIdPublic = trackParcelByTrackingIdPublic;
exports.ParcelServices = {
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
    returnParcel,
    trackParcelByTrackingIdPublic: exports.trackParcelByTrackingIdPublic
};
