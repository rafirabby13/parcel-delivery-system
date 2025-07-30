import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validateRequest";
import { parcelZodSchema } from "./parcel.validation";

const router = Router()


router.post("/create-parcel", validateRequest(parcelZodSchema), checkAuth(Role.SENDER), ParcelController.createParcel)
router.get("/all-parcel",  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelController.getAllParcel)
router.get("/status",  checkAuth(...Object.values(Role)), ParcelController.getSingleParcelStatus)
router.post("/update/:parcelId",  checkAuth(Role.ADMIN, Role.SENDER, Role.SUPER_ADMIN), ParcelController.updateParcel)

export const ParcelRoutes = router