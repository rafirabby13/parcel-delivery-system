"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment_Status = exports.Payment_Method = exports.Parcel_Type = exports.Parcel_Status = exports.Cancel_Reason = void 0;
var Cancel_Reason;
(function (Cancel_Reason) {
    Cancel_Reason["DELIVERY_FAILED"] = "DELIVERY_FAILED";
    Cancel_Reason["ADDRESS_ISSUE"] = "ADDRESS_ISSUE";
    Cancel_Reason["RECEIVER_REJECTED"] = "RECEIVER_REJECTED";
    Cancel_Reason["SENDER_REQUESTED"] = "SENDER_REQUESTED";
    Cancel_Reason["BUSINESS_POLICY"] = "BUSINESS_POLICY";
})(Cancel_Reason || (exports.Cancel_Reason = Cancel_Reason = {}));
var Parcel_Status;
(function (Parcel_Status) {
    Parcel_Status["REQUESTED"] = "REQUESTED";
    Parcel_Status["APPROVED"] = "APPROVED";
    Parcel_Status["PICKED_UP"] = "PICKED_UP";
    Parcel_Status["IN_TRANSIT"] = "IN_TRANSIT";
    Parcel_Status["DELIVERED"] = "DELIVERED";
    Parcel_Status["CONFIRMED"] = "CONFIRMED";
    Parcel_Status["CANCELLED"] = "CANCELLED";
    Parcel_Status["BLOCKED"] = "BLOCKED";
    Parcel_Status["RETURNED"] = "RETURNED";
    Parcel_Status["RESCHEDULED"] = "RESCHEDULED";
})(Parcel_Status || (exports.Parcel_Status = Parcel_Status = {}));
var Parcel_Type;
(function (Parcel_Type) {
    Parcel_Type["DOCUMENT"] = "DOCUMENT";
    Parcel_Type["PACKAGE"] = "PACKAGE";
    Parcel_Type["FRAGILE"] = "FRAGILE";
    Parcel_Type["LIQUID"] = "LIQUID";
    Parcel_Type["ELECTRONICS"] = "ELECTRONICS";
    Parcel_Type["FOOD"] = "FOOD";
})(Parcel_Type || (exports.Parcel_Type = Parcel_Type = {}));
var Payment_Method;
(function (Payment_Method) {
    Payment_Method["COD"] = "COD";
    Payment_Method["PREPAID"] = "PREPAID";
})(Payment_Method || (exports.Payment_Method = Payment_Method = {}));
var Payment_Status;
(function (Payment_Status) {
    Payment_Status["PENDING"] = "PENDING";
    Payment_Status["PAID"] = "PAID";
    Payment_Status["FAILED"] = "FAILED";
    Payment_Status["CANCELLED"] = "CANCELLED";
    Payment_Status["REFUNDED"] = "REFUNDED";
})(Payment_Status || (exports.Payment_Status = Payment_Status = {}));
