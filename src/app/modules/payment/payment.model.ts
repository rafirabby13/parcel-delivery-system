import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";
import { Payment_Method, Payment_Status } from "../parcel/parcel.interface";

const paymentSchema = new Schema<IPayment>(
    {
        parcel: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.Mixed, // Accepts any shape of object
            default: null
        },
        paymentMethod: {
            type: String,
            enum: Object.values(Payment_Method),
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(Payment_Status),
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = model<IPayment>("Payment", paymentSchema)