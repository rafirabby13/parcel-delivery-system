/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { Payment_Method, Payment_Status } from "../parcel/parcel.interface";

export interface IPayment{
    parcel: Types.ObjectId,
    transactionId: string,
    amount: number,
    paymentGatewayData?: any,
    paymentMethod: Payment_Method,
    invoiceUrl?: string,
    paymentStatus: Payment_Status
}