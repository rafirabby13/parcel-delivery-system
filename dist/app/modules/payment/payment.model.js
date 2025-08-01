"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("../parcel/parcel.interface");
const paymentSchema = new mongoose_1.Schema({
    parcel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parcel',
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentGatewayData: {
        type: mongoose_1.Schema.Types.Mixed, // Accepts any shape of object
    },
    paymentMethod: {
        type: String,
        enum: Object.values(parcel_interface_1.Payment_Method),
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.Payment_Status),
        required: true,
    },
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
