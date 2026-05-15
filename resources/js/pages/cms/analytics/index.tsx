import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

export default function Analytics() {
    const { stats, topPages, deviceBreakdown, dailyTrend, topReferrers, days } =
        usePage<any>().props;

    const changeDays = (d: number) => {
        router.get(
            '/admin/cms/analytics',
            { days: d },
            { preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'Analytics', href: '/admin/cms/analytics' },
            ]}
        >
            <Head title="Analytics | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Traffic Analytics</h1>
                    <div className="flex rounded-lg bg-muted p-1">
                        {[7, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => changeDays(d)}
                                className={`rounded-md px-4 py-1 text-sm font-medium ${days === d ? 'bg-white text-foreground shadow dark:bg-sidebar' : 'text-muted-foreground'}`}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                            Total Page Views
                        </p>
                        <p className="text-3xl font-bold">
                            {stats.total_views.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                            Unique Sessions
                        </p>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {stats.unique_views.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                            Avg. Daily Views
                        </p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {stats.avg_daily.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                    <h2 className="mb-6 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                        Traffic Trend
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={dailyTrend}
                                margin={{
                                    top: 5,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorViews"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#6366f1"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#6366f1"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(v) =>
                                        v.split('-').slice(1).join('/')
                                    }
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    name="Page Views"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="unique_views"
                                    name="Unique"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="none"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Top Pages */}
                    <div className="overflow-hidden rounded-2xl border border-sidebar-border bg-white shadow-sm lg:col-span-2 dark:bg-sidebar">
                        <div className="border-b border-sidebar-border p-4">
                            <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                Top Pages
                            </h2>
                        </div>
                        <table className="w-full text-sm">
                            <tbody>
                                {topPages.map((p: any, i: number) => (
                                    <tr
                                        key={i}
                                        className="border-b border-sidebar-border/50 last:border-0 hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">
                                            /{p.path}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold">
                                            {p.views.toLocaleString()}{' '}
                                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                views
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {topPages.length === 0 && (
                                    <tr>
                                        <td className="p-4 text-center text-muted-foreground">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Devices & Referrers */}
                    <div className="flex flex-col gap-6">
                        <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                            <h2 className="mb-4 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                Devices
                            </h2>
                            <div className="h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={deviceBreakdown}
                                        layout="vertical"
                                        margin={{
                                            top: 0,
                                            right: 0,
                                            left: 10,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                        />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="device"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            className="text-xs font-medium capitalize"
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="count"
                                            fill="#10b981"
                                            radius={[0, 4, 4, 0]}
                                            barSize={24}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-sidebar-border bg-white shadow-sm dark:bg-sidebar">
                            <div className="border-b border-sidebar-border p-4">
                                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                    Top Referrers
                                </h2>
                            </div>
                            <div className="flex max-h-[200px] flex-col gap-3 overflow-y-auto p-4">
                                {topReferrers.map((r: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="max-w-[200px] truncate pr-4 text-sm">
                                            {r.referrer
                                                .replace('https://', '')
                                                .replace('http://', '')}
                                        </span>
                                        <span className="rounded bg-muted px-2 py-1 text-xs font-bold">
                                            {r.count}
                                        </span>
                                    </div>
                                ))}
                                {topReferrers.length === 0 && (
                                    <div className="py-4 text-center text-sm text-muted-foreground">
                                        Direct traffic only
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
