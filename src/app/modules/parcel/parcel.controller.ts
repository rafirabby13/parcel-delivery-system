/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { ParcelServices } from "./parcel.service";
import { IParcel, ReturnParcelPayload } from "./parcel.interface";
import { IUserToken } from "../user/user.interface";

const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
// console.log("payload .............",{
//         body: req.body,
//         file: req.file
//     })
 const payload: IParcel={
        ...req.body,
        image: (req.file as Express.Multer.File).path
    }
    // console.log("payload .............",{
    //     payload
    // })
    const parcel = await ParcelServices.createParcel(payload)
    console.log(
        parcel
    )
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        // data: {}
        data: parcel
    })

})
const getAllParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query
    const user = req.user as IUserToken


    const allParcel = await ParcelServices.getAllParcel(query as Record<string, string>, user)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Parcel fetched successfully",
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
    console.log(".........",parcelId,updateData)


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
const incomingParcelForReceiver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const phone = req.query.phone as string
    const user = req.user

    console.log(phone, user)
    const incomngParcel = await ParcelServices.incomingParcelForReceiver(phone, user)
    console.log(incomngParcel)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel retireved  successfully",
        data: incomngParcel
    })

})
const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id
    const payload = req.body
    console.log("id......",id, payload)

    const updatedParcel = await ParcelServices.updateParcelStatus(id, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    })

})
const getIncomingParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const receiversPhoneNumber = req.query.phone
    // const payload = req.body
    // console.log(req.user)

    const updatedParcel = await ParcelServices.getIncomingParcels(receiversPhoneNumber as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    })

})
const confirmDelivery = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { phone, trackingId } = req.query

// console.log(phone, trackingId )
    const updatedParcel = await ParcelServices.confirmDelivery(trackingId as string, phone as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    })

})
const collectCODPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { deliveryPersonId, trackingId } = req.query
    // const payload = req.body


    const updatedParcel = await ParcelServices.collectCODPayment(trackingId as string, deliveryPersonId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel status updated successfully",
        data: updatedParcel
    })

})
const blockParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const parcelId = req.params.id
    const admin = req.user as IUserToken
    console.log(parcelId, admin)

    const updatedParcel = await ParcelServices.blockParcel(parcelId as string, admin)
    console.log("updateParcel",updatedParcel)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: updatedParcel?.parcel?.status == "BLOCKED" ? "Parcel Blocked successfully" : "Parcel UnBlocked successfully",
        // message:  "Parcel Blocked successfullyParcel UnBlocked successfully",
        data: updatedParcel
    })

})
const unblockParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const parcelId = req.params.id
    const adminId = req.body.adminId
    // console.log(parcelId, adminId)

    const updatedParcel = await ParcelServices.unblockParcel(parcelId as string, adminId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel UnBlocked successfully",
        data: updatedParcel
    })

})
const returnParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const parcelId = req.params.id
    const returnData: ReturnParcelPayload = req.body
    // console.log(parcelId, returnData)

    const updatedParcel = await ParcelServices.returnParcel(parcelId as string, returnData)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel returned successfully",
        // data: updatedParcel
        data: {}
    })

})
const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { parcelId, updaterId } = req.body
    // const returnData: ReturnParcelPayload = req.body
    console.log(parcelId, updaterId)

    await ParcelServices.cancelParcel(parcelId, updaterId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel cancelled successfully",
        // data: updatedParcel
        data: {}
    })

})
const trackParcelByTrackingIdPublic = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const trackingId = req.query.trackingId

    const trackParcelStatus = await ParcelServices.trackParcelByTrackingIdPublic(trackingId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Status Retieved successfully",
        data: trackParcelStatus
    })

})



export const ParcelController = {
    createParcel,
    getAllParcel,
    getSingleParcelStatus,
    updateParcel,
    assignParcelToDeliveryPerson,
    getAllParcelById,
    updateParcelStatus,
    getIncomingParcels,
    confirmDelivery,
    collectCODPayment,
    blockParcel,
    unblockParcel,
    returnParcel,
    incomingParcelForReceiver,
    cancelParcel,
    trackParcelByTrackingIdPublic
}