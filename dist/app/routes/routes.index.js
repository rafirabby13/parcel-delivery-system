"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const parcel_routes_1 = require("../modules/parcel/parcel.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const otp_routes_1 = require("../modules/OTP/otp.routes");
const stats_routes_1 = require("../modules/stats/stats.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRouter
    },
    {
        path: "/parcel",
        route: parcel_routes_1.ParcelRoutes
    },
    {
        path: "/payment",
        route: payment_routes_1.PaymentRoutes
    },
    {
        path: "/otp",
        route: otp_routes_1.OTPRoutes
    },
    {
        path: "/stats",
        route: stats_routes_1.StatsRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
