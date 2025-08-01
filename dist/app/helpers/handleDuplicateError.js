"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDupliacteError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleDupliacteError = (err) => {
    const duplicate = err.message.match(/"([^*]*)"/);
    return {
        statusCode: 400,
        message: `Duplicate error at ${duplicate[1]} || ${err.message}`
    };
};
exports.handleDupliacteError = handleDupliacteError;
