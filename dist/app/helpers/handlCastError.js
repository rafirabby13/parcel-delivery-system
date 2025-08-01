"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlCastError = void 0;
const handlCastError = (err) => {
    return {
        statusCode: 400,
        message: "Please provide a valid id"
    };
};
exports.handlCastError = handlCastError;
