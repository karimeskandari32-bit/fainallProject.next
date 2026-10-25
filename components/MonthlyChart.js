"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fa = (n) => Number(n).toLocaleString("fa-IR");

export default function MonthlyChart({ data, type = "bar", color = "#2563eb" }) {
  if (!data || data.length === 0) {
    return <p>هنوز داده‌ای برای نمایش نیست.</p>;
  }

  const axisProps = {
    xAxis: { dataKey: "name", tick: { fontSize: 12 }, minTickGap: 8 },
    yAxis: { tick: { fontSize: 12 }, tickFormatter: fa, width: 70 },
  };

  return (
    <div style={{ width: "100%", height: 320 }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} />
            <Tooltip formatter={(v) => [fa(v), "مقدار"]} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...axisProps.xAxis} />
            <YAxis {...axisProps.yAxis} />
            <Tooltip formatter={(v) => [fa(v), "مقدار"]} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}