/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {

    const errorSources: any = []

    const errors = Object.values(err.errors)


    errors.forEach((issue: any) => {
        errorSources.push({
            path: issue.path,
            message: issue.message
        })
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    }
}