"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorhandlers = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handlCastError_1 = require("../helpers/handlCastError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleValidationError_1 = require("../helpers/handleValidationError");
const globalErrorhandlers = (err, req, res, next) => {
    // console.log(err)
    let statusCode = 500;
    let message = "Something went wrong!!";
    let errorSources = [];
    if (err.code == 11000) {
        const simplyFiedError = (0, handleDuplicateError_1.handleDupliacteError)(err);
        statusCode = simplyFiedError.statusCode;
        message = simplyFiedError.message;
    }
    else if (err.name == "CastError") {
        const simplyFiedError = (0, handlCastError_1.handlCastError)(err);
        statusCode = simplyFiedError.statusCode;
        message = simplyFiedError.message;
    }
    else if (err.name == "ZodError") {
        const simplyFiedError = (0, handleZodError_1.handlZodError)(err);
        statusCode = simplyFiedError.statusCode;
        message = simplyFiedError.message;
        errorSources = simplyFiedError.errorSources;
    }
    else if (err.name == "ValidationError") {
        const simplyFiedError = (0, handleValidationError_1.handlValidationError)(err);
        statusCode = simplyFiedError.statusCode;
        message = simplyFiedError.message;
        errorSources = simplyFiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(500).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV == "development" ? err : "",
        stack: env_1.envVars.NODE_ENV == "development" ? err.stack : null
    });
};
exports.globalErrorhandlers = globalErrorhandlers;
