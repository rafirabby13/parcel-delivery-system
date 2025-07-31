import { z } from "zod";
import { Parcel_Status, Parcel_Type, Payment_Method, Payment_Status } from "./parcel.interface";

// Address validation schema
const addressZodSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number"),
    division: z.string().min(1, "Division is required"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    detailAddress: z.string().min(1, "Detail address is required").max(500, "Address too long")
});

// ✅ FIXED: Removed currency field to match interface
const parcelFeeZodSchema = z.object({
    baseRate: z.number().min(0, "Base rate cannot be negative"),
    weightCharge: z.number().min(0, "Weight charge cannot be negative"),
    distanceCharge: z.number().min(0, "Distance charge cannot be negative"),
    totalFee: z.number().min(0, "Total fee cannot be negative")
});

// ✅ FIXED: Removed timestamp field to match interface
export const trackingEventZodSchema = z.object({
    updaterId: z.string(),
    status: z.enum(Parcel_Status),
    location: z.string().optional(),
    note: z.string().optional()
});

// Main parcel validation schema
export const parcelZodSchema = z.object({
    _id: z.string().optional(),
    trackingId: z.string().optional(),

    senderId: z.string().min(1, "Sender ID is required"),
    receiverId: z.string().optional(),

    parcelType: z.enum(Parcel_Type),
    weight: z.number()
        .min(0.1, "Weight must be at least 0.1 kg")
        .max(50, "Weight cannot exceed 50 kg"),
    description: z.string() // ✅ FIXED: Made optional to match interface
        .max(500, "Description too long")
        .optional(),

    senderInfo: addressZodSchema,
    receiverInfo: addressZodSchema,


    actualPickupDate: z.date().optional(),
    actualDeliveryDate: z.date().optional(),

    status: z.enum(Parcel_Status).optional(), // ✅ FIXED: Made optional
    trackingEvents: z.array(trackingEventZodSchema).default([]),

    assignedDeliveryPartner: z.string().optional(),

    parcelFee: parcelFeeZodSchema, // ✅ FIXED: Matches interface field name
    paymentMethod: z.enum(Payment_Method),
    paymentStatus: z.enum(Payment_Status).optional(),
    codAmount: z.number().min(0, "COD amount cannot be negative").optional(),

    cancellationReason: z.string().max(200, "Cancellation reason too long").optional(),
    cancelledBy: z.string().optional(),


    // blockReason: z.string().max(200, "Block reason too long").optional(),
    // blockedBy: z.string().optional(),

});



