"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnParcelZodSchema = exports.parcelUpdateZodSchema = exports.trackingEventSchema = exports.assignDeliverySchema = exports.parcelZodSchema = exports.trackingEventZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
// Address validation schema
const addressZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(100, "Name too long"),
    phone: zod_1.z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number"),
    division: zod_1.z.string().min(1, "Division is required"),
    city: zod_1.z.string().min(1, "City is required"),
    area: zod_1.z.string().min(1, "Area is required"),
    detailAddress: zod_1.z.string().min(1, "Detail address is required").max(500, "Address too long")
});
// ✅ FIXED: Removed currency field to match interface
const parcelFeeZodSchema = zod_1.z.object({
    baseRate: zod_1.z.number().min(0, "Base rate cannot be negative"),
    weightCharge: zod_1.z.number().min(0, "Weight charge cannot be negative"),
    distanceCharge: zod_1.z.number().min(0, "Distance charge cannot be negative"),
    totalFee: zod_1.z.number().min(0, "Total fee cannot be negative")
});
// ✅ FIXED: Removed timestamp field to match interface
exports.trackingEventZodSchema = zod_1.z.object({
    updaterId: zod_1.z.string(),
    status: zod_1.z.enum(parcel_interface_1.Parcel_Status),
    location: zod_1.z.string().optional(),
    note: zod_1.z.string().optional()
});
// Main parcel validation schema
exports.parcelZodSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    trackingId: zod_1.z.string().optional(),
    senderId: zod_1.z.string().min(1, "Sender ID is required"),
    receiverId: zod_1.z.string().optional(),
    parcelType: zod_1.z.enum(parcel_interface_1.Parcel_Type),
    weight: zod_1.z.number()
        .min(0.1, "Weight must be at least 0.1 kg")
        .max(50, "Weight cannot exceed 50 kg"),
    description: zod_1.z.string() // ✅ FIXED: Made optional to match interface
        .max(500, "Description too long")
        .optional(),
    senderInfo: addressZodSchema,
    receiverInfo: addressZodSchema,
    actualPickupDate: zod_1.z.date().optional(),
    actualDeliveryDate: zod_1.z.date().optional(),
    status: zod_1.z.enum(parcel_interface_1.Parcel_Status).optional(), // ✅ FIXED: Made optional
    trackingEvents: zod_1.z.array(exports.trackingEventZodSchema).default([]),
    assignedDeliveryPartner: zod_1.z.string().optional(),
    parcelFee: parcelFeeZodSchema, // ✅ FIXED: Matches interface field name
    paymentMethod: zod_1.z.enum(parcel_interface_1.Payment_Method),
    paymentStatus: zod_1.z.enum(parcel_interface_1.Payment_Status).optional(),
    codAmount: zod_1.z.number().min(0, "COD amount cannot be negative").optional(),
    cancellationReason: zod_1.z.string().max(200, "Cancellation reason too long").optional(),
    cancelledBy: zod_1.z.string().optional(),
    // blockReason: z.string().max(200, "Block reason too long").optional(),
    // blockedBy: z.string().optional(),
});
exports.assignDeliverySchema = zod_1.z.object({
    updaterId: zod_1.z.string().length(24, { message: 'Invalid updaterId format' }),
    parcelId: zod_1.z.string().length(24, { message: 'Invalid parcelId format' }),
    deliveryPersonId: zod_1.z.string().length(24, { message: 'Invalid deliveryPersonId format' }),
});
exports.trackingEventSchema = zod_1.z.object({
    updaterId: zod_1.z.string().length(24, { message: 'Invalid updaterId format' }),
    status: parcel_interface_1.Parcel_Status,
    location: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
});
exports.parcelUpdateZodSchema = zod_1.z.object({
    //   _id: z.string().optional(),
    //   trackingId: z.string().optional(),
    //   senderId: z.string().optional(),
    //   receiverId: z.string().optional(),
    parcelType: zod_1.z.enum(parcel_interface_1.Parcel_Type).optional(),
    weight: zod_1.z.number()
        .min(0.1, "Weight must be at least 0.1 kg")
        .max(50, "Weight cannot exceed 50 kg")
        .optional(),
    description: zod_1.z.string().max(500, "Description too long").optional(),
    senderInfo: addressZodSchema.optional(),
    receiverInfo: addressZodSchema.optional(),
    //   actualPickupDate: z.date().optional(),
    //   actualDeliveryDate: z.date().optional(),
    //   status: z.enum(Parcel_Status).optional(),
    //   trackingEvents: z.array(trackingEventZodSchema).optional(),
    //   assignedDeliveryPartner: z.string().optional(),
    //   parcelFee: parcelFeeZodSchema.optional(),
    paymentMethod: zod_1.z.enum(parcel_interface_1.Payment_Method).optional(),
    //   paymentStatus: z.enum(Payment_Status).optional(),
    //   codAmount: z.number().min(0, "COD amount cannot be negative").optional(),
    //   cancellationReason: z.string().max(200, "Cancellation reason too long").optional(),
    //   cancelledBy: z.string().optional(),
    // blockReason: z.string().max(200, "Block reason too long").optional(),
    // blockedBy: z.string().optional(),
});
exports.returnParcelZodSchema = zod_1.z.object({
    returnReason: zod_1.z.string().min(1, "Return reason is required"),
    returnType: zod_1.z.enum(parcel_interface_1.Cancel_Reason),
    requestedBy: zod_1.z.string().min(1, "Requested by is required"),
    returnLocation: zod_1.z.string().optional()
});
