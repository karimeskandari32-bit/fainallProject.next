import MonthlyChart from "@/components/MonthlyChart";
import { getMonthlyUsers, getMonthlyOrders, getMonthlySales } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // هر سه کوئری همزمان اجرا می‌شن
  const [users, orders, sales] = await Promise.all([
    getMonthlyUsers(),
    getMonthlyOrders(),
    getMonthlySales(),
  ]);

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">داشبورد</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">ثبت‌نام کاربران</h2>
          <MonthlyChart data={users} type="bar" />
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">تعداد سفارش‌ها</h2>
          <MonthlyChart data={orders} type="bar" color="#16a34a" />
        </div>

        <div className="rounded-lg border p-4 md:col-span-2">
          <h2 className="mb-2 font-semibold">فروش ماهانه</h2>
          <MonthlyChart data={sales} type="line" color="#dc2626" />
        </div>
      </div>
    </main>
  );
}