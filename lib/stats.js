import conectToDB from "@/configs/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { groupByJalaliMonth } from "@/lib/jalali";

const MONTHS = 12;
// کمی بیشتر از ۱۲ ماه، تا ماه شمسی اول کامل بیاید
const since = () => new Date(Date.now() - 380 * 24 * 60 * 60 * 1000);

export async function getMonthlyUsers() {
  await conectToDB();
  const docs = await User.find({ createdAt: { $gte: since() } })
    .select("createdAt")
    .lean();
  return groupByJalaliMonth(docs, () => 1, MONTHS);
}

export async function getMonthlyOrders() {
  await conectToDB();
  const docs = await Order.find({ createdAt: { $gte: since() } })
    .select("createdAt")
    .lean();
  return groupByJalaliMonth(docs, () => 1, MONTHS);
}

// جمع مبلغ فروش در هر ماه شمسی
export async function getMonthlySales() {
  await conectToDB();
  const docs = await Order.find({ createdAt: { $gte: since() } })
    .select("createdAt totalPrice")
    .lean();
  return groupByJalaliMonth(docs, (o) => o.totalPrice || 0, MONTHS);
}