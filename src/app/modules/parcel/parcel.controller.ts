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

    const query = req.query


    const allParcel = await ParcelServices.getAllParcel(query as Record<string, string>)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        data: allParcel
    })

})
const getSingleParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const trackingId = req.query.trackingId


    const singleParcelTrackingEvent = await ParcelServices.getSingleParcelStatus(trackingId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel retrieved successfully",
        data: singleParcelTrackingEvent
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
const assignParcelToDeliveryPerson = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const parcelId = req.params.parcelId
    const { parcelId, deliveryPersonId, updaterId } = req.body
    // console.log(req.user)


    const updatedParcel = await ParcelServices.assignParcelToDeliveryPerson(parcelId, deliveryPersonId, updaterId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel assigned successfully",
        data: updatedParcel
    })

})
const getAllParcelById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id
    const user = req.user

    console.log(id, user)
    const updatedParcel = await ParcelServices.getAllParcelById(id, user)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel retireved  successfully",
        data: updatedParcel
    })

})
const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id
    const payload = req.body
    // console.log(req.user)

    const updatedParcel = await ParcelServices.updateParcelStatus(id, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    })

})



export const ParcelController = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel,
    assignParcelToDeliveryPerson,
    getAllParcelById,
    updateParcelStatus
}