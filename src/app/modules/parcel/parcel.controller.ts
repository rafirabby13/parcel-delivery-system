/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { ParcelServices } from "./parcel.service";

const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const parcel = await ParcelServices.createParcel(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        data: parcel
    })

})
const getAllParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const allParcel = await ParcelServices.getAllParcel()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        data: allParcel
    })

})
const getSingleParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const trackingId = req.query.trackingId


    const singleParcelStatus = await ParcelServices.getSingleParcelStatus(trackingId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel retrieved successfully",
        data: singleParcelStatus
    })

})
const updateParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const parcelId = req.params.parcelId
    const updateData = req.body
    // console.log(parcelId)


    const updatedParcel = await ParcelServices.updateParcel(parcelId as string, updateData)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel updated successfully",
        data: updatedParcel
    })

})



export const ParcelController = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel
}