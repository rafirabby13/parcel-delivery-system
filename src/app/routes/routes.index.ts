import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRouter } from "../modules/auth/auth.routes";
import { ParcelRoutes } from "../modules/parcel/parcel.routes";

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
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})