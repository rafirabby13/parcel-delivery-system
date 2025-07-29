import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";


const UserAddressSchema = new Schema({
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



const AuthProviderSchema = new Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, { _id: false, versionKey: false });



const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String , required: true},
    picture: { type: String },
    address: UserAddressSchema,
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.SENDER
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
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
})

export const User = model<IUser>("User", userSchema)