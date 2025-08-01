"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
// twilio.js
const twilio_1 = __importDefault(require("twilio"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const client = (0, twilio_1.default)(env_1.envVars.TWILIO_SID, env_1.envVars.TWILIO_AUTH_TOKEN);
// const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID!;
const sendOTP = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.messages
            .create({
            body: 'Hello from twilio-node',
            to: env_1.envVars.TWILIO_NUMBER, // Text your number
            from: '+12025551234', // From a valid Twilio number
        });
        console.log(response);
    }
    catch (error) {
        throw new AppError_1.default(404, error.message);
    }
});
exports.sendOTP = sendOTP;
// export const verifyOTP = async (phone: string, code: string) => {
//     return client.verify.v2.services(verifySid)
//         .verificationChecks
//         .create({ to: phone, code });
// };
