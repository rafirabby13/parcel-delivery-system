import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()


router.post("/init-payment/:parcelId", PaymentControllers.initPayment)
router.post("/success", PaymentControllers.successPayment)
router.post("/fail", PaymentControllers.failPayment)
router.post("/cancel", PaymentControllers.cancelPayment)
router.post("/cash-on-delivery",checkAuth(Role.DELIVERY_PERSON, Role.ADMIN) ,PaymentControllers.cashOnDeliveryPaymentPayment)
router.post("/validate-payment", PaymentControllers.validatePayment)


export const PaymentRoutes = router