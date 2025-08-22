import express from "express"
import { OTPController } from "./otp.controllers"

const router =  express.Router()


router.post("/send", OTPController.sendOTP)
router.post("/verify", OTPController.verifyOTP)


export const OTPRoutes = router