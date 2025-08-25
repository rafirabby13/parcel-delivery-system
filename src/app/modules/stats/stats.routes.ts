import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
    "/parcel",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getParcelStats
);
router.get(
    "/payment",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getPaymentStats
);
router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getUserStats
);
// router.get(
//     "/parcel",
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     StatsController.getTourStats
// );

export const StatsRoutes = router;