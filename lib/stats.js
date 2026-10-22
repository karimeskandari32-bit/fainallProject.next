
import conectToDB from "@/configs/db";
import User from "@/models/User"; 
import Order from "@/models/Order"

export async function getMonthlyUsers() {
  await conectToDB();

  const result = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return result.map((r) => ({
    name: `${r._id.year}/${String(r._id.month).padStart(2, "0")}`,
    value: r.count,
  }));
}

export async function getMonthlyOrders() {
  await conectToDB();

  const result = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return result.map((r) => ({
    name: `${r._id.year}/${String(r._id.month).padStart(2, "0")}`,
    value: r.count,
  }));
}

// جمع مبلغ فروش در هر ماه
export async function getMonthlySales() {
  await conectToDB();

  const result = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total: { $sum: "$totalPrice" }, 
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return result.map((r) => ({
    name: `${r._id.year}/${String(r._id.month).padStart(2, "0")}`,
    value: r.total,
  }));
}