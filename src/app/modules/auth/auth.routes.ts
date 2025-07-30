import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()


router.post("/login", AuthController.credentialsLogin)
router.post("/refresh-token", AuthController.getNewAuthToken)
router.post("/logout", AuthController.logout)
router.post("/reset-password", checkAuth(...Object.values(Role)),AuthController.resetPassword)

export const AuthRouter = router