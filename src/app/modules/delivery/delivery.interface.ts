import { Types } from "mongoose";

export enum Vehicle_Type {
    BIKE = "BIKE",
    BICYCLE = "BICYCLE"
}

export enum Delivery_Status {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    BUSY = "BUSY"
}

// ===============================================
// CORE DELIVERY PERSON INTERFACE
// ===============================================

export interface IDeliveryPerson {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;  // Reference to User with role DELIVERY_PERSON
    
    // Vehicle Information
    vehicleType: Vehicle_Type;
    vehicleNumber?: string;
    
    // Availability Status
    deliveryStatus: Delivery_Status;
    
    // Current Location
    currentLocation?: {
        address?: string;
    };
    
    // Required Documents
    licenseNumber?: string;  // Optional for bicycle
    nidNumber: string;       // Required for all
    
    // Work Statistics
    totalDeliveries?: number;
    successfulDeliveries?: number;
    cancelledDeliveries?: number;
    rating?: number;  // Average rating from 1-5
    
    // Current Work
    assignedParcels: Types.ObjectId[];  // Currently assigned parcel IDs
            
}
