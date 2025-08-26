/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})

export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|png|jpeg|gif|webp)/i;
        const match = url.match(regex)
        if (match && match[1]) {
            const publicId = match[1]

            await cloudinary.uploader.destroy(publicId)
            console.log(publicId)
        }
    } catch (error: any) {
        throw new AppError(404, "cloudinary image failed to delete", error.message)
    }
}


export const cloudinaryUpload = cloudinary

