"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelSerachTable = exports.VALID_STATUS_TRANSITIONS = void 0;
const parcel_interface_1 = require("./parcel.interface");
exports.VALID_STATUS_TRANSITIONS = {
    [parcel_interface_1.Parcel_Status.REQUESTED]: [parcel_interface_1.Parcel_Status.APPROVED, parcel_interface_1.Parcel_Status.CANCELLED],
    [parcel_interface_1.Parcel_Status.APPROVED]: [parcel_interface_1.Parcel_Status.PICKED_UP, parcel_interface_1.Parcel_Status.CANCELLED],
    [parcel_interface_1.Parcel_Status.PICKED_UP]: [parcel_interface_1.Parcel_Status.IN_TRANSIT, parcel_interface_1.Parcel_Status.CANCELLED],
    [parcel_interface_1.Parcel_Status.IN_TRANSIT]: [
        parcel_interface_1.Parcel_Status.DELIVERED,
        parcel_interface_1.Parcel_Status.CANCELLED,
        parcel_interface_1.Parcel_Status.BLOCKED,
        parcel_interface_1.Parcel_Status.RETURNED,
        parcel_interface_1.Parcel_Status.RESCHEDULED
    ],
    [parcel_interface_1.Parcel_Status.RESCHEDULED]: [parcel_interface_1.Parcel_Status.IN_TRANSIT, parcel_interface_1.Parcel_Status.CANCELLED],
    [parcel_interface_1.Parcel_Status.CONFIRMED]: [],
    [parcel_interface_1.Parcel_Status.BLOCKED]: [parcel_interface_1.Parcel_Status.RESCHEDULED, parcel_interface_1.Parcel_Status.RETURNED],
    [parcel_interface_1.Parcel_Status.RETURNED]: [], // Terminal
    [parcel_interface_1.Parcel_Status.DELIVERED]: [parcel_interface_1.Parcel_Status.CONFIRMED], // Terminal
    [parcel_interface_1.Parcel_Status.CANCELLED]: [] // Terminal
};
exports.parcelSerachTable = ["status", "location"];
