import { model, Schema } from "mongoose";
import { IParcel, Parcel_Status, Parcel_Type, Payment_Method, Payment_Status } from "./parcel.interface";


const ParcelAddressSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^01[3-9]\d{8}$/, 'Please enter a valid Bangladesh phone number']
    },
    division: {
        type: String,
        required: [true, 'Division is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    area: {
        type: String,
        required: [true, 'Area is required'],
        trim: true
    },
    detailAddress: {
        type: String,
        required: [true, 'Detail address is required'],
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters']
    }
}, { _id: false, versionKey: false });

const TrackingEventSchema = new Schema({
    updaterId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Parcel_Status),
        required: [true, 'Status is required']
    },
    location: {
        type: String
    },
    note: {
        type: String
    }
}, { _id: false, timestamps: true });

const ParcelFeeSchema = new Schema({
    baseRate: {
        type: Number,
        required: [true, 'Base rate is required'],
        min: [0, 'Base rate cannot be negative']
    },
    weightCharge: {
        type: Number,
        required: [true, 'Weight charge is required'],
        min: [0, 'Weight charge cannot be negative']
    },
    distanceCharge: {
        type: Number,
        required: [true, 'Distance charge is required'],
        min: [0, 'Distance charge cannot be negative']
    },
    totalFee: {
        type: Number,
        required: [true, 'Total fee is required'],
        min: [0, 'Total fee cannot be negative']
    }
}, { _id: false, versionKey: false });




export const parcelSchema = new Schema<IParcel>({
    trackingId: {
        type: String,
        default: null
    },


    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender ID is required']
    },
    // receiverId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     default: null
    // },
    parcelType: {
        type: String,
        enum: Object.values(Parcel_Type),
        required: [true, 'Parcel type is required']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0.1, 'Weight must be at least 0.1 kg'],
        max: [50, 'Weight cannot exceed 50 kg']
    },
    description: {
        type: String,

        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    senderInfo: {
        type: ParcelAddressSchema,
        required: [true, 'Sender information is required']
    },

    receiverInfo: {
        type: ParcelAddressSchema,
        required: [true, 'Receiver information is required']
    },
    status: {
        type: String,
        enum: Object.values(Parcel_Status),
        default: Parcel_Status.REQUESTED
    },
    trackingEvents: {
        type: [TrackingEventSchema],
        default: []
    },
    parcelFee: {
        type: ParcelFeeSchema,
        required: [true, 'Fee information is required']
    },
    paymentMethod: {
        type: String,
        enum: Object.values(Payment_Method),
        required: [true, 'Payment method is required']
    },
    paymentStatus: {
        type: String,
        enum: Object.values(Payment_Status),
        required: [true, 'Payment status is required'],
        default: Payment_Status.PENDING
    },
    cancellationReason: {
        type: String,
        trim: true,
        maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
    },
    cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    assignedDeliveryPartner: {
        type: Schema.Types.ObjectId,
        ref: "Delivery",
        default: null
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        default: null
    }

}, {
    timestamps: true,
    versionKey: false
})

export const Parcel = model<IParcel>("Parcel", parcelSchema)