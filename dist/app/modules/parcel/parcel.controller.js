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
    const parcel = yield parcel_service_1.ParcelServices.createParcel(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: parcel
    });
}));
const getAllParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const allParcel = yield parcel_service_1.ParcelServices.getAllParcel(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
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
    // console.log(parcelId)
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
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    // console.log(req.user)
    const updatedParcel = yield parcel_service_1.ParcelServices.updateParcelStatus(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    });
}));
exports.ParcelController = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel,
    assignParcelToDeliveryPerson,
    getAllParcelById,
    updateParcelStatus
};
