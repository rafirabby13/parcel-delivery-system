import { Types } from "mongoose";

export interface User_Address {
    division: string,
    city: string,
    area: string,
    roadNo?: string,
    houseNo?: string,
    coordinates?: {
        lat: number,
        lng: number
    }
}
export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    SENDER = "SENDER",
    ADMIN = "ADMIN",
    RECEIVER = "RECEIVER",
    DELIVERY_PERSON = "DELIVERY_PERSON",
}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProviders {
    provider: "google" | "credentials"
    providerId: string
}
export interface IUser {
    _id?:string, 
    name: string,
    email: string,
    password?: string,
    phone: string,
    picture?: string,
    address: User_Address,
    isActive?: IsActive,
    isVerified?: boolean,
    isDeleted?: boolean,

    auths: IAuthProviders[],
    role: Role,
    sentParcels?: Types.ObjectId[],     // Parcels this user sent (for SENDER role)
    receivedParcels?: Types.ObjectId[],  // Parcels this user received (for RECEIVER role)




}