/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum Cancel_Reason {
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  ADDRESS_ISSUE = 'ADDRESS_ISSUE',
  RECEIVER_REJECTED = 'RECEIVER_REJECTED',
  SENDER_REQUESTED = 'SENDER_REQUESTED',
  BUSINESS_POLICY = 'BUSINESS_POLICY',
}
export interface ReturnParcelPayload {
    returnReason: string;
    returnType: Cancel_Reason;
    requestedBy: string; // userId who requested return
    returnLocation?: string;
}
export enum Parcel_Status {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    BLOCKED = "BLOCKED",
    RETURNED = "RETURNED",
    RESCHEDULED = "RESCHEDULED"
}

export enum Parcel_Type {
    DOCUMENT = "DOCUMENT",
    PACKAGE = "PACKAGE",
    FRAGILE = "FRAGILE",
    LIQUID = "LIQUID",
    ELECTRONICS = "ELECTRONICS",
    FOOD = "FOOD"
}

export interface Parcel_Address {
    name: string,
    phone: string,
    division: string;
    district: string;
    city: string;
    area: string;
    detailAddress: string;
}

export interface Tracking_Event {
    updaterId: string;
    status: Parcel_Status;
    locaton?: string,
    note?: string

}

export interface Parcel_Fee {
    baseRate: number;
    weightCharge: number;
    distanceCharge: number;
    totalFee: number;
}

export enum Payment_Method {
    COD = "COD",
    PREPAID = "PREPAID"
}
export enum Payment_Status {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}


export interface IParcel {
    _id?: Types.ObjectId;
    trackingId?: string;

    senderId: Types.ObjectId;
    // receiverId?: Types.ObjectId;

    parcelType: Parcel_Type;
    weight: number;
    description?: string;

    senderInfo: Parcel_Address;
    receiverInfo: Parcel_Address;

    actualPickupDate?: Date;
    actualDeliveryDate?: Date;

    status?: Parcel_Status;
    trackingEvents: Tracking_Event[];

    assignedDeliveryPartner?: Types.ObjectId;

    parcelFee: Parcel_Fee;
    paymentMethod: Payment_Method;
    paymentStatus?: Payment_Status;
    paymentId?: Types.ObjectId,
    codAmount?: number;

    cancellationReason?: string;
    cancelledBy?: Types.ObjectId;
    image?: string[]

    // blockReason?: string;
    // blockedBy?: Types.ObjectId;

}