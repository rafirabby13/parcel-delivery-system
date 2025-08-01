"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const UserAddressSchema = new mongoose_1.Schema({
    division: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    roadNo: { type: String },
    houseNo: { type: String },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    }
}, { _id: false, versionKey: false });
const AuthProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, { _id: false, versionKey: false });
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    picture: { type: String },
    address: UserAddressSchema,
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        required: true
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE
    },
    auths: {
        type: [AuthProviderSchema],
        required: true,
        default: []
    },
    // sentParcels: [{ type: Schema.Types.ObjectId, ref: "Parcel" }],
    // receivedParcels: [{ type: Schema.Types.ObjectId, ref: "Parcel" }]
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)("User", userSchema);
