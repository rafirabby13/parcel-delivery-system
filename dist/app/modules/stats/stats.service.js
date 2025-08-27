"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const parcel_interface_1 = require("../parcel/parcel.interface");
const parcel_model_1 = require("../parcel/parcel.model");
const payment_model_1 = require("../payment/payment.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.BLOCKED });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    };
});
const getParcelStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalParcelsPromise = parcel_model_1.Parcel.countDocuments();
    const parcelsByStatusPromise = parcel_model_1.Parcel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const parcelsPerSenderPromise = parcel_model_1.Parcel.aggregate([
        { $group: { _id: "$senderId", parcelCount: { $sum: 1 } } },
        { $sort: { parcelCount: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "sender"
            }
        },
        { $unwind: "$sender" },
        { $project: { parcelCount: 1, "sender.name": 1, "sender.phone": 1 } }
    ]);
    const avgWeightPromise = parcel_model_1.Parcel.aggregate([
        { $group: { _id: null, avgWeight: { $avg: "$weight" } } }
    ]);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const parcelsLast7DaysPromise = parcel_model_1.Parcel.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const parcelsLast30DaysPromise = parcel_model_1.Parcel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const uniqueSendersPromise = parcel_model_1.Parcel.distinct("senderId").then(u => u.length);
    const [totalParcels, parcelsByStatus, parcelsPerSender, avgWeight, parcelsLast7Days, parcelsLast30Days, uniqueSenders] = yield Promise.all([
        totalParcelsPromise,
        parcelsByStatusPromise,
        parcelsPerSenderPromise,
        avgWeightPromise,
        parcelsLast7DaysPromise,
        parcelsLast30DaysPromise,
        uniqueSendersPromise
    ]);
    return {
        totalParcels,
        parcelsByStatus,
        parcelsPerSender,
        avgWeight: ((_a = avgWeight[0]) === null || _a === void 0 ? void 0 : _a.avgWeight) || 0,
        parcelsLast7Days,
        parcelsLast30Days,
        uniqueSenders
    };
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$paymentStatus",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        //stage1 match stage
        {
            $match: { status: parcel_interface_1.Payment_Status.PAID }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" }
            }
        }
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = yield Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise
    ]);
    return { totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData };
});
/**
 * await Tour.updateMany(
        {
            // Only update where tourType or division is stored as a string
            $or: [
                { tourType: { $type: "string" } },
                { division: { $type: "string" } }
            ]
        },
        [
            {
                $set: {
                    tourType: { $toObjectId: "$tourType" },
                    division: { $toObjectId: "$division" }
                }
            }
        ]
    );
 */
exports.StatsService = {
    getUserStats,
    getParcelStats,
    getPaymentStats
};
