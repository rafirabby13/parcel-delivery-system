import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validateRequest";
import { assignDeliverySchema, parcelUpdateZodSchema, parcelZodSchema, trackingEventSchema, trackingEventZodSchema } from "./parcel.validation";

const router = Router()


router.post("/create-parcel", validateRequest(parcelZodSchema), checkAuth(Role.SENDER), ParcelController.createParcel)
router.get("/all-parcel", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelController.getAllParcel)
router.get("/status", checkAuth(...Object.values(Role)), ParcelController.getSingleParcelStatus)
router.patch("/assign-delivery", validateRequest(assignDeliverySchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelController.assignParcelToDeliveryPerson)
router.get("/all-parcel/:id", checkAuth(...Object.values(Role)), ParcelController.getAllParcelById)
router.post("/update/:parcelId", validateRequest(parcelUpdateZodSchema), checkAuth(Role.SENDER), ParcelController.updateParcel)
router.patch("/:id/update-status", validateRequest(trackingEventSchema), validateRequest(trackingEventZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_PERSON, Role.SENDER), ParcelController.updateParcelStatus)


export const ParcelRoutes = router