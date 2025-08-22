import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRouter } from "../modules/auth/auth.routes";
import { ParcelRoutes } from "../modules/parcel/parcel.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { OTPRoutes } from "../modules/OTP/otp.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRouter
    },
    {
        path: "/parcel",
        route: ParcelRoutes
    },
    {
        path: "/payment",
        route: PaymentRoutes
    },
    {
        path: "/otp",
        route: OTPRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})