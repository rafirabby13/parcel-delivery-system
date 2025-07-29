// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../utils/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";


const router = Router()



router.post("/register", validateRequest(createUserZodSchema), userController.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUser)
router.patch("/:id", checkAuth(...Object.values(Role)),userController.updateUser)


export const UserRoutes = router