/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import { handleDupliacteError } from "../helpers/handleDuplicateError";
import { handlCastError } from "../helpers/handlCastError";
import { handlZodError } from "../helpers/handleZodError";
import { handlValidationError } from "../helpers/handleValidationError";
import { TErorSources } from "../interfaces/error.types";








export const globalErrorhandlers = (err: any, req: Request, res: Response, next: NextFunction) => {
    // console.log(err)
    let statusCode = 500
    let message = "Something went wrong!!";
    let errorSources: TErorSources[] = []
    if (err.code == 11000) {
        const simplyFiedError = handleDupliacteError(err)
        statusCode = simplyFiedError.statusCode
        message = simplyFiedError.message
    }
    else if (err.name == "CastError") {
        const simplyFiedError = handlCastError(err)
        statusCode = simplyFiedError.statusCode
        message = simplyFiedError.message
    }
    else if (err.name == "ZodError") {
        const simplyFiedError = handlZodError(err)
        statusCode = simplyFiedError.statusCode
        message = simplyFiedError.message
        errorSources = simplyFiedError.errorSources as TErorSources[]
    }
    else if (err.name == "ValidationError") {
        const simplyFiedError = handlValidationError(err)
        statusCode = simplyFiedError.statusCode
        message = simplyFiedError.message
        errorSources = simplyFiedError.errorSources as TErorSources[]
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }
    else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }
    res.status(500).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV =="development" ? err : "",
        stack: envVars.NODE_ENV == "development" ? err.stack : null
    })
}