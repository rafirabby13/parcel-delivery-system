"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPRoutes = void 0;
const express_1 = __importDefault(require("express"));
const otp_controllers_1 = require("./otp.controllers");
const router = express_1.default.Router();
router.post("/send", otp_controllers_1.OTPController.sendOTP);
router.post("/verify", otp_controllers_1.OTPController.verifyOTP);
exports.OTPRoutes = router;
