import { Payment_Status } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { Payment } from "../payment/payment.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";


const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments()

    const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE })
    const totalInActiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE })
    const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED })

    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const usersByRolePromise = User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role

        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])


    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ])
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    }
}


const getParcelStats = async () => {
  const totalParcelsPromise = Parcel.countDocuments();

  const parcelsByStatusPromise = Parcel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const parcelsPerSenderPromise = Parcel.aggregate([
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

  const avgWeightPromise = Parcel.aggregate([
    { $group: { _id: null, avgWeight: { $avg: "$weight" } } }
  ]);

  const sevenDaysAgo = new Date(Date.now() - 7*24*60*60*1000);
  const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);

  const parcelsLast7DaysPromise = Parcel.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  const parcelsLast30DaysPromise = Parcel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  const uniqueSendersPromise = Parcel.distinct("senderId").then(u => u.length);

  const [
    totalParcels,
    parcelsByStatus,
    parcelsPerSender,
    avgWeight,
    parcelsLast7Days,
    parcelsLast30Days,
    uniqueSenders
  ] = await Promise.all([
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
    avgWeight: avgWeight[0]?.avgWeight || 0,
    parcelsLast7Days,
    parcelsLast30Days,
    uniqueSenders
  };
};

const getPaymentStats = async () => {

    const totalPaymentPromise = Payment.countDocuments();

    const totalPaymentByStatusPromise = Payment.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$paymentStatus",
                count: { $sum: 1 }
            }
        }
    ])

    const totalRevenuePromise = Payment.aggregate([
        //stage1 match stage
        {
            $match: { status: Payment_Status.PAID }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ])

    const avgPaymentAmountPromise = Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" }
            }
        }
    ])

    const paymentGatewayDataPromise = Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ])



    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise

    ])
    return { totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData }
}


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



export const StatsService = {
  
    getUserStats,
    getParcelStats,
    getPaymentStats
}