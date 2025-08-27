"use strict";
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
exports.ParcelController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("payload .............",{
    //         body: req.body,
    //         file: req.file
    //     })
    const payload = Object.assign(Object.assign({}, req.body), { image: req.file.path });
    // console.log("payload .............",{
    //     payload
    // })
    const parcel = yield parcel_service_1.ParcelServices.createParcel(payload);
    console.log(parcel);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        // data: {}
        data: parcel
    });
}));
const getAllParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const user = req.user;
    const allParcel = yield parcel_service_1.ParcelServices.getAllParcel(query, user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Parcel fetched successfully",
        data: allParcel
    });
}));
const getSingleParcelStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = req.query.trackingId;
    const singleParcelTrackingEvent = yield parcel_service_1.ParcelServices.getSingleParcelStatus(trackingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel retrieved successfully",
        data: singleParcelTrackingEvent
    });
}));
const updateParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.parcelId;
    const updateData = req.body;
    console.log(".........", parcelId, updateData);
    const updatedParcel = yield parcel_service_1.ParcelServices.updateParcel(parcelId, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel updated successfully",
        data: updatedParcel
    });
}));
const assignParcelToDeliveryPerson = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const parcelId = req.params.parcelId
    const { parcelId, deliveryPersonId, updaterId } = req.body;
    // console.log(req.user)
    const updatedParcel = yield parcel_service_1.ParcelServices.assignParcelToDeliveryPerson(parcelId, deliveryPersonId, updaterId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel assigned successfully",
        data: updatedParcel
    });
}));
const getAllParcelById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = req.user;
    console.log(id, user);
    const updatedParcel = yield parcel_service_1.ParcelServices.getAllParcelById(id, user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel retireved  successfully",
        data: updatedParcel
    });
}));
const incomingParcelForReceiver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.query.phone;
    const user = req.user;
    console.log(phone, user);
    const incomngParcel = yield parcel_service_1.ParcelServices.incomingParcelForReceiver(phone, user);
    console.log(incomngParcel);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel retireved  successfully",
        data: incomngParcel
    });
}));
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    console.log("id......", id, payload);
    const updatedParcel = yield parcel_service_1.ParcelServices.updateParcelStatus(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    });
}));
const getIncomingParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const receiversPhoneNumber = req.query.phone;
    // const payload = req.body
    // console.log(req.user)
    const updatedParcel = yield parcel_service_1.ParcelServices.getIncomingParcels(receiversPhoneNumber);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    });
}));
const confirmDelivery = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, trackingId } = req.query;
    // console.log(phone, trackingId )
    const updatedParcel = yield parcel_service_1.ParcelServices.confirmDelivery(trackingId, phone);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    });
}));
const collectCODPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { deliveryPersonId, trackingId } = req.query;
    // const payload = req.body
    const updatedParcel = yield parcel_service_1.ParcelServices.collectCODPayment(trackingId, deliveryPersonId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    });
}));
const blockParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcelId = req.params.id;
    const admin = req.user;
    console.log(parcelId, admin);
    const updatedParcel = yield parcel_service_1.ParcelServices.blockParcel(parcelId, admin);
    console.log("updateParcel", updatedParcel);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: ((_a = updatedParcel === null || updatedParcel === void 0 ? void 0 : updatedParcel.parcel) === null || _a === void 0 ? void 0 : _a.status) == "BLOCKED" ? "Parcel Blocked successfully" : "Parcel UnBlocked successfully",
        // message:  "Parcel Blocked successfullyParcel UnBlocked successfully",
        data: updatedParcel
    });
}));
const unblockParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const adminId = req.body.adminId;
    // console.log(parcelId, adminId)
    const updatedParcel = yield parcel_service_1.ParcelServices.unblockParcel(parcelId, adminId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel UnBlocked successfully",
        data: updatedParcel
    });
}));
const returnParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const returnData = req.body;
    // console.log(parcelId, returnData)
    const updatedParcel = yield parcel_service_1.ParcelServices.returnParcel(parcelId, returnData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel returned successfully",
        // data: updatedParcel
        data: {}
    });
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { parcelId, updaterId } = req.body;
    // const returnData: ReturnParcelPayload = req.body
    console.log(parcelId, updaterId);
    yield parcel_service_1.ParcelServices.cancelParcel(parcelId, updaterId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel cancelled successfully",
        // data: updatedParcel
        data: {}
    });
}));
const trackParcelByTrackingIdPublic = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = req.query.trackingId;
    const trackParcelStatus = yield parcel_service_1.ParcelServices.trackParcelByTrackingIdPublic(trackingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Status Retieved successfully",
        data: trackParcelStatus
    });
}));
exports.ParcelController = {
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
    incomingParcelForReceiver,
    cancelParcel,
    trackParcelByTrackingIdPublic
};
