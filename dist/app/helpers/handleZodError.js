"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlZodError = void 0;
const handlZodError = (err) => {
    var _a;
    const errorSources = [];
    (_a = err.issues) === null || _a === void 0 ? void 0 : _a.forEach((issue) => {
        errorSources.push({
            path: issue.path[0],
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    };
};
exports.handlZodError = handlZodError;
