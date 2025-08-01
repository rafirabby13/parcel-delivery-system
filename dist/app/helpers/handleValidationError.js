"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlValidationError = void 0;
const handlValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((issue) => {
        errorSources.push({
            path: issue.path,
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    };
};
exports.handlValidationError = handlValidationError;
