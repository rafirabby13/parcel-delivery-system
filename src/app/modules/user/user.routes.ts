// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../utils/validateRequest";



const router = Router()

router.post("/register",validateRequest(createUserZodSchema), userController.createUser)
router.get("/", userController.getAllUser)


export const UserRoutes = router