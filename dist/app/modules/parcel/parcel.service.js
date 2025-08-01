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
exports.ParcelServices = void 0;
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
            throw new AppError_1.default(404, "Parcel is not found");
        }
        const payment = yield payment_model_1.Payment.create([{
                transactionId: transactionId,
                parcel: parcel[0]._id,
                amount: (_b = parcel[0].parcelFee) === null || _b === void 0 ? void 0 : _b.totalFee,
                paymentMethod: parcel[0].paymentMethod,
                paymentStatus: parcel[0].paymentStatus
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
            phone: user === null || user === void 0 ? void 0 : user.phone
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
    if (isDeliverPersonExist.role !== user_interface_1.Role.DELIVERY_PERSON) {
        throw new AppError_1.default(400, "Selected user is not a delivery person");
    }
    if (isPercelExist.status !== parcel_interface_1.Parcel_Status.REQUESTED) {
        throw new AppError_1.default(400, `Cannot assign parcel with status ${isPercelExist.status}. Only REQUESTED parcels can be assigned.`);
    }
    if (isUpdaterExist.role !== user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(400, `Cannot assign parcel with status ${isPercelExist.status}. Only ADMIN  can be APPROVE the parcel.`);
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
    parcel.status = nextStatus;
    parcel.trackingEvents.push(payload);
    yield parcel.save();
    return parcel;
});
exports.ParcelServices = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel,
    assignParcelToDeliveryPerson,
    getAllParcelById,
    updateParcelStatus
};
