import { Skeleton } from "@/ui";
import { Suspense, lazy } from "react";
import { token } from "styled-system/tokens";

function ChartSkeleton({
    width = "100%",
    height = 400
}: { width?: string | number; height?: number }) {
    return <Skeleton style={{ height, width }} />;
}

// Lazy load recharts with chart components
const RechartsBarChart = lazy(async () => {
    const { Bar, BarChart, CartesianGrid, XAxis, YAxis } = await import("recharts");

    const data = [
        { name: "Jan", value: 400 },
        { name: "Feb", value: 300 },
        { name: "Mar", value: 500 },
        { name: "Apr", value: 280 },
        { name: "May", value: 390 }
    ];

    return {
        default: function BarChartComponent() {
            return (
                <BarChart
                    data={data}
                    height={300}
                    width={500}
                >
                    <CartesianGrid
                        stroke={token("colors.border.muted")}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        axisLine={{ stroke: token("colors.border") }}
                        dataKey="name"
                        tick={{ fill: token("colors.fg.medium") }}
                    />
                    <YAxis
                        axisLine={{ stroke: token("colors.border") }}
                        tick={{ fill: token("colors.fg.medium") }}
                    />
                    <Bar
                        dataKey="value"
                        fill={token("colors.primary")}
                    />
                </BarChart>
            );
        }
    };
});

const RechartsLineChart = lazy(async () => {
    const { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } =
        await import("recharts");

    const data = [
        { month: "Jan", sales: 4000, revenue: 2400 },
        { month: "Feb", sales: 3000, revenue: 1398 },
        { month: "Mar", sales: 2000, revenue: 9800 },
        { month: "Apr", sales: 2780, revenue: 3908 },
        { month: "May", sales: 1890, revenue: 4800 },
        { month: "Jun", sales: 2390, revenue: 3800 }
    ];

    return {
        default: function LineChartComponent() {
            return (
                <ResponsiveContainer
                    height={400}
                    width="100%"
                >
                    <LineChart data={data}>
                        <CartesianGrid
                            stroke={token("colors.border.muted")}
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            axisLine={{ stroke: token("colors.border") }}
                            dataKey="month"
                            tick={{ fill: token("colors.fg.medium") }}
                        />
                        <YAxis
                            axisLine={{ stroke: token("colors.border") }}
                            tick={{ fill: token("colors.fg.medium") }}
                        />
                        <Legend wrapperStyle={{ color: token("colors.fg") }} />
                        <Line
                            dataKey="sales"
                            stroke={token("colors.primary")}
                            strokeWidth={2}
                            type="monotone"
                        />
                        <Line
                            dataKey="revenue"
                            stroke={token("colors.secondary")}
                            strokeWidth={2}
                            type="monotone"
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        }
    };
});

const RechartsPieChart = lazy(async () => {
    const { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } = await import("recharts");

    const data = [
        { name: "Desktop", value: 400 },
        { name: "Mobile", value: 300 },
        { name: "Tablet", value: 200 },
        { name: "Other", value: 100 }
    ];

    const COLORS = [
        token("colors.primary"),
        token("colors.secondary"),
        token("colors.success"),
        token("colors.info")
    ];

    return {
        default: function PieChartComponent() {
            return (
                <ResponsiveContainer
                    height={400}
                    width="100%"
                >
                    <PieChart>
                        <Pie
                            cx="50%"
                            cy="50%"
                            data={data}
                            dataKey="value"
                            fill={token("colors.primary")}
                            label={({ name, percent }) =>
                                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                            outerRadius={120}
                        >
                            {data.map((_entry, index) => (
                                <Cell
                                    fill={COLORS[index % COLORS.length]}
                                    key={`cell-${index}`}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: token("colors.bg"),
                                border: `1px solid ${token("colors.border")}`,
                                borderRadius: token("radii.md"),
                                color: token("colors.fg")
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            );
        }
    };
});

export function BarChartExample() {
    return (
        <Suspense
            fallback={
                <ChartSkeleton
                    height={300}
                    width={500}
                />
            }
        >
            <RechartsBarChart />
        </Suspense>
    );
}

export function LineChartExample() {
    return (
        <Suspense fallback={<ChartSkeleton />}>
            <RechartsLineChart />
        </Suspense>
    );
}

export function PieChartExample() {
    return (
        <Suspense fallback={<ChartSkeleton />}>
            <RechartsPieChart />
        </Suspense>
    );
}
