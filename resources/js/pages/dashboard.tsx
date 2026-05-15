import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(n);
const fmtK = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
};
const fmtRp = (n: number) => `Rp ${fmtK(n)}`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface KpiMetric {
    value: number;
    prev: number;
    pct: number;
    dir: 'up' | 'down' | 'neutral';
}
interface KPI {
    occupancy_rate: KpiMetric;
    monthly_revenue: KpiMetric;
    arr: KpiMetric;
    revpar: KpiMetric;
}
interface Ops {
    total_rooms: number;
    available_rooms: number;
    occupied_today: number;
    maintenance: number;
    pending_bookings: number;
}
interface ChannelRow {
    source: string;
    revenue: number;
    count: number;
    rev_pct: number;
    cnt_pct: number;
    commission: number;
}
interface CommissionSummary {
    ota_revenue: number;
    commission_rate: number;
    ota_commission: number;
    net_revenue: number;
    gross_revenue: number;
}
interface CancellationData {
    total_bookings: number;
    total_cancelled: number;
    cancel_rate: number;
    by_channel: {
        source: string;
        total: number;
        cancelled: number;
        rate: number;
    }[];
    trend: {
        month: string;
        total: number;
        cancelled: number;
        cancel_rate: number;
    }[];
}
interface Insight {
    level: 'success' | 'warning' | 'error' | 'info';
    icon: string;
    title: string;
    message: string;
}
interface TrendPoint {
    week: string;
    revenue: number;
    occupancy: number;
    cancel_rate: number;
    bookings: number;
    cancelled: number;
}
interface RecentBooking {
    id: number;
    guest_name: string;
    guest_email: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    status: string;
    total_amount: number;
    booking_source: string;
    room_number: string | null;
    room_type: string | null;
}
interface Pagination {
    total: number;
    per_page: number;
    page: number;
    last_page: number;
}

interface PageProps {
    [key: string]: unknown;
    kpi: KPI;
    ops: Ops;
    channelData: ChannelRow[];
    commissionSummary: CommissionSummary;
    cancellationData: CancellationData;
    insights: Insight[];
    chartData: TrendPoint[];
    periodWeeks: number;
    recentBookings: RecentBooking[];
    pagination: Pagination;
}

const STATUS_STYLES: Record<string, string> = {
    pending:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    confirmed:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    checked_in:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    checked_out:
        'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

const INSIGHT_STYLES: Record<
    string,
    { bar: string; bg: string; title: string }
> = {
    success: {
        bar: 'bg-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        title: 'text-emerald-800 dark:text-emerald-300',
    },
    warning: {
        bar: 'bg-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        title: 'text-amber-800 dark:text-amber-300',
    },
    error: {
        bar: 'bg-red-500',
        bg: 'bg-red-50 dark:bg-red-900/20',
        title: 'text-red-800 dark:text-red-300',
    },
    info: {
        bar: 'bg-indigo-500',
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        title: 'text-indigo-800 dark:text-indigo-300',
    },
};

const CHANNEL_COLORS = ['#6366f1', '#10b981', '#f59e0b'];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionTitle({
    icon,
    children,
}: {
    icon: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-4 flex items-center gap-3">
            <span className="text-base">{icon}</span>
            <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {children}
            </h2>
            <div className="h-px flex-1 bg-sidebar-border/40" />
        </div>
    );
}

function DeltaBadge({
    metric,
    isPercent = false,
}: {
    metric: KpiMetric;
    isPercent?: boolean;
}) {
    const { t } = useTranslation();
    if (metric.dir === 'neutral')
        return <span className="text-xs text-white/60">—</span>;
    const up = metric.dir === 'up';
    return (
        <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold ${up ? 'text-emerald-300' : 'text-red-300'}`}
        >
            {up ? '▲' : '▼'} {metric.pct}
            {isPercent ? 'pp' : '%'}
            <span className="ml-0.5 font-normal opacity-75">
                {t('delta.vs_lm')}
            </span>
        </span>
    );
}

function KpiCard({
    label,
    metric,
    format,
    icon,
    gradient,
}: {
    label: string;
    metric: KpiMetric;
    format: (v: number) => string;
    icon: string;
    gradient: string;
}) {
    const { t } = useTranslation();
    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-5 shadow-md ${gradient}`}
        >
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
            <div className="absolute -top-1 -right-1 h-10 w-10 rounded-full bg-white/10" />
            <div className="relative z-10">
                <div className="mb-2 flex items-start justify-between">
                    <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                        {label}
                    </p>
                    <span className="text-2xl">{icon}</span>
                </div>
                <p className="text-2xl font-bold text-white">
                    {format(metric.value)}
                </p>
                <div className="mt-1 flex items-center justify-between">
                    <DeltaBadge
                        metric={metric}
                        isPercent={
                            label.toLowerCase().includes('occupancy') ||
                            label.toLowerCase().includes('hunian')
                        }
                    />
                    <span className="text-xs text-white/50">
                        {format(metric.prev)} {t('delta.vs_lm')}
                    </span>
                </div>
            </div>
        </div>
    );
}

function OpsCard({
    label,
    value,
    icon,
    colorClass,
}: {
    label: string;
    value: number | string;
    icon: string;
    colorClass: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-white px-4 py-3 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
            <span
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl ${colorClass}`}
            >
                {icon}
            </span>
            <div>
                <p className="text-xs font-medium text-muted-foreground">
                    {label}
                </p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const {
        kpi,
        ops,
        channelData,
        commissionSummary,
        cancellationData,
        insights,
        chartData,
        periodWeeks,
        recentBookings,
        pagination,
    } = usePage<PageProps>().props;

    const { t, i18n } = useTranslation();
    const [activePeriod, setActivePeriod] = useState(periodWeeks ?? 12);
    const [activeChart, setActiveChart] = useState<
        'revenue' | 'occupancy' | 'cancellation'
    >('revenue');

    const changePeriod = (p: number) => {
        setActivePeriod(p);
        router.get(
            '/admin/dashboard',
            { period: p },
            { preserveState: true, replace: true },
        );
    };

    const changePage = (p: number) => {
        router.get(
            '/admin/dashboard',
            { page: p, period: activePeriod },
            { preserveState: true, replace: true },
        );
    };

    const monthLabel = new Date().toLocaleString(
        i18n.language === 'id' ? 'id-ID' : 'en-US',
        { month: 'long', year: 'numeric' },
    );

    // Breadcrumbs translated
    const translatedBreadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.dashboard'), href: '/dashboard' },
    ];

    // Insight Message Parser (handles : params)
    const parseInsight = (msg: string) => {
        const [key, ...vals] = msg.split(':');
        const params: Record<string, any> = {};
        if (
            key === 'insight.occ_low_msg' ||
            key === 'insight.occ_high_msg' ||
            key === 'insight.rev_drop_msg' ||
            key === 'insight.rev_grow_msg' ||
            key === 'insight.cancel_high_msg' ||
            key === 'insight.cancel_mid_msg' ||
            key === 'insight.arr_drop_msg' ||
            key === 'insight.direct_msg'
        ) {
            params.v = vals[0];
        } else if (key === 'insight.ota_dep_msg') {
            params.v = vals[0];
            params.c = fmt(Number(vals[1]));
            params.a = fmt(Number(vals[2]));
        }
        return String(t(key, params));
    };

    return (
        <AppLayout breadcrumbs={translatedBreadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex flex-col gap-8 p-6">
                {/* ══ Header ══════════════════════════════════════════════ */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('dashboard.title')}
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {t('dashboard.data_for')}{' '}
                            <span className="font-semibold text-foreground">
                                {monthLabel}
                            </span>{' '}
                            · {t('dashboard.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-xl dark:bg-indigo-900/40">
                            🏨
                        </span>
                    </div>
                </div>

                {/* ══ SECTION 1 – Business Performance KPIs ═══════════ */}
                <div>
                    <SectionTitle icon="📊">
                        {t('section.business')} — {monthLabel}
                    </SectionTitle>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <KpiCard
                            label={t('kpi.occupancy')}
                            metric={kpi?.occupancy_rate}
                            format={(v) => `${v}%`}
                            icon="📈"
                            gradient="bg-gradient-to-br from-indigo-600 to-violet-700"
                        />
                        <KpiCard
                            label={t('kpi.revenue')}
                            metric={kpi?.monthly_revenue}
                            format={fmtRp}
                            icon="💰"
                            gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
                        />
                        <KpiCard
                            label={t('kpi.arr')}
                            metric={kpi?.arr}
                            format={fmtRp}
                            icon="🏷️"
                            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                        />
                        <KpiCard
                            label={t('kpi.revpar')}
                            metric={kpi?.revpar}
                            format={fmtRp}
                            icon="🎯"
                            gradient="bg-gradient-to-br from-rose-500 to-pink-700"
                        />
                    </div>
                </div>

                {/* ══ SECTION 2 – Operational Snapshot ════════════════ */}
                <div>
                    <SectionTitle icon="🏨">{t('section.ops')}</SectionTitle>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        <OpsCard
                            label={t('ops.total_rooms')}
                            value={ops?.total_rooms ?? 0}
                            icon="🏨"
                            colorClass="bg-indigo-100 dark:bg-indigo-900/40"
                        />
                        <OpsCard
                            label={t('ops.available')}
                            value={ops?.available_rooms ?? 0}
                            icon="✨"
                            colorClass="bg-emerald-100 dark:bg-emerald-900/40"
                        />
                        <OpsCard
                            label={t('ops.occupied')}
                            value={ops?.occupied_today ?? 0}
                            icon="🔑"
                            colorClass="bg-blue-100 dark:bg-blue-900/40"
                        />
                        <OpsCard
                            label={t('ops.maintenance')}
                            value={ops?.maintenance ?? 0}
                            icon="🔧"
                            colorClass="bg-red-100 dark:bg-red-900/40"
                        />
                        <OpsCard
                            label={t('ops.pending')}
                            value={ops?.pending_bookings ?? 0}
                            icon="⏳"
                            colorClass="bg-amber-100 dark:bg-amber-900/40"
                        />
                    </div>
                </div>

                {/* ══ SECTION 3 – Performance Insights (rule-based) ═══ */}
                <div>
                    <SectionTitle icon="🧠">
                        {t('section.insights')}
                    </SectionTitle>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {(insights ?? []).map((ins, i) => {
                            const s =
                                INSIGHT_STYLES[ins.level] ??
                                INSIGHT_STYLES.info;
                            return (
                                <div
                                    key={i}
                                    className={`flex gap-3 rounded-xl p-4 ${s.bg}`}
                                >
                                    <div
                                        className={`mt-0.5 w-1 flex-shrink-0 self-stretch rounded-full ${s.bar}`}
                                    />
                                    <div>
                                        <p
                                            className={`text-sm font-bold ${s.title}`}
                                        >
                                            {ins.icon} {String(t(ins.title))}
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                            {parseInsight(ins.message)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ══ SECTION 4 – Charts (All AreaCharts Weekly) ═══════ */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        {/* Chart type toggle */}
                        <div className="flex overflow-hidden rounded-xl border border-sidebar-border/60">
                            {(
                                [
                                    ['revenue', `💰 ${t('chart.revenue')}`],
                                    ['occupancy', `📈 ${t('chart.occupancy')}`],
                                    [
                                        'cancellation',
                                        `❌ ${t('chart.cancellation')}`,
                                    ],
                                ] as const
                            ).map(([c, label]) => (
                                <button
                                    key={c}
                                    onClick={() => setActiveChart(c)}
                                    className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                                        activeChart === c
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-muted-foreground hover:bg-muted/50'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* Period buttons (Weeks) */}
                        <div className="flex gap-1">
                            {[4, 8, 12, 26].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => changePeriod(p)}
                                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                                        activePeriod === p
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                            : 'text-muted-foreground hover:bg-muted/50'
                                    }`}
                                >
                                    {p}W
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-3 text-sm font-semibold">
                            {
                                (activeChart === 'revenue'
                                    ? t('chart.revenue_title')
                                    : activeChart === 'occupancy'
                                      ? t('chart.occ_title')
                                      : t('chart.cancel_title')) as string
                            }
                            {' — '}
                            {t('chart.weekly', { n: activePeriod }) as string}
                        </p>

                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart
                                data={chartData ?? []}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="areaGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={
                                                activeChart === 'revenue'
                                                    ? '#6366f1'
                                                    : activeChart ===
                                                        'occupancy'
                                                      ? '#10b981'
                                                      : '#f59e0b'
                                            }
                                            stopOpacity={0.25}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={
                                                activeChart === 'revenue'
                                                    ? '#6366f1'
                                                    : activeChart ===
                                                        'occupancy'
                                                      ? '#10b981'
                                                      : '#f59e0b'
                                            }
                                            stopOpacity={0.02}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="opacity-20"
                                />
                                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                                <YAxis
                                    yAxisId="val"
                                    tickFormatter={(v) =>
                                        activeChart === 'revenue'
                                            ? fmtK(v)
                                            : `${v}%`
                                    }
                                    tick={{ fontSize: 11 }}
                                    width={55}
                                />
                                <Tooltip
                                    formatter={(v?: number) =>
                                        activeChart === 'revenue'
                                            ? fmt(v ?? 0)
                                            : `${v ?? 0}%`
                                    }
                                />
                                <Area
                                    yAxisId="val"
                                    type="monotone"
                                    dataKey={
                                        activeChart === 'revenue'
                                            ? 'revenue'
                                            : activeChart === 'occupancy'
                                              ? 'occupancy'
                                              : 'cancel_rate'
                                    }
                                    name={
                                        (activeChart === 'revenue'
                                            ? t('chart.revenue')
                                            : activeChart === 'occupancy'
                                              ? t('kpi.occupancy')
                                              : t('cancel.rate')) as string
                                    }
                                    stroke={
                                        activeChart === 'revenue'
                                            ? '#6366f1'
                                            : activeChart === 'occupancy'
                                              ? '#10b981'
                                              : '#f59e0b'
                                    }
                                    strokeWidth={2.5}
                                    fill="url(#areaGrad)"
                                    dot={{
                                        r: 4,
                                        fill:
                                            activeChart === 'revenue'
                                                ? '#6366f1'
                                                : activeChart === 'occupancy'
                                                  ? '#10b981'
                                                  : '#f59e0b',
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ══ SECTION 5 – Revenue by Channel + Commission ════ */}
                <div className="grid gap-4 xl:grid-cols-3">
                    {/* Channel revenue table — 2/3 */}
                    <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white shadow-sm xl:col-span-2 dark:border-sidebar-border dark:bg-sidebar">
                        <div className="flex items-center justify-between border-b border-sidebar-border/50 px-6 py-4">
                            <div>
                                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                    {t('section.channel')}
                                </h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {monthLabel} · {t('channel.rate')}{' '}
                                    {commissionSummary?.commission_rate ?? 15}%
                                </p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-sidebar-border/40 text-left text-xs font-semibold text-muted-foreground uppercase">
                                        <th className="px-5 py-3">
                                            {t('channel.source')}
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            {t('channel.revenue')}
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            {t('channel.rev_pct')}
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            {t('channel.bookings')}
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            {t('channel.commission')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(channelData ?? []).map((ch, i) => (
                                        <tr
                                            key={ch.source}
                                            className="border-b border-sidebar-border/30 transition-colors last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                CHANNEL_COLORS[
                                                                    i
                                                                ],
                                                        }}
                                                    />
                                                    <span className="font-medium">
                                                        {ch.source}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right font-medium">
                                                {fmtRp(ch.revenue)}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                                                    {ch.rev_pct}%
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right text-muted-foreground">
                                                {ch.count} ({ch.cnt_pct}%)
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                {ch.commission > 0 ? (
                                                    <span className="font-medium text-red-600 dark:text-red-400">
                                                        −{fmtRp(ch.commission)}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-sidebar-border/60 bg-muted/20 text-sm font-semibold">
                                        <td className="px-5 py-3">
                                            {t('channel.net')}
                                        </td>
                                        <td className="px-5 py-3 text-right text-emerald-700 dark:text-emerald-400">
                                            {fmtRp(
                                                commissionSummary?.net_revenue ??
                                                    0,
                                            )}
                                        </td>
                                        <td className="px-5 py-3" colSpan={2} />
                                        <td className="px-5 py-3 text-right text-red-600 dark:text-red-400">
                                            −
                                            {fmtRp(
                                                commissionSummary?.ota_commission ??
                                                    0,
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Cancellation summary — 1/3 */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        <p className="mb-1 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                            ❌ {t('section.cancel')}
                        </p>
                        <p className="mb-4 text-xs text-muted-foreground">
                            {t('cancel.last6')}
                        </p>

                        {/* Big rate number */}
                        <div className="mb-4 text-center">
                            <p
                                className={`text-5xl font-extrabold ${
                                    (cancellationData?.cancel_rate ?? 0) > 20
                                        ? 'text-red-600'
                                        : (cancellationData?.cancel_rate ?? 0) >
                                            10
                                          ? 'text-amber-500'
                                          : 'text-emerald-600'
                                }`}
                            >
                                {cancellationData?.cancel_rate ?? 0}%
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {cancellationData?.total_cancelled ?? 0}{' '}
                                {t('cancel.of')}{' '}
                                {cancellationData?.total_bookings ?? 0}{' '}
                                {t('cancel.bookings')}
                            </p>
                        </div>

                        {/* By channel */}
                        <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                            {t('cancel.by_channel')}
                        </p>
                        <div className="space-y-2">
                            {(cancellationData?.by_channel ?? []).map((ch) => (
                                <div key={ch.source}>
                                    <div className="mb-0.5 flex justify-between text-xs">
                                        <span className="font-medium capitalize">
                                            {ch.source?.replace('_', ' ')}
                                        </span>
                                        <span
                                            className={`font-bold ${ch.rate > 20 ? 'text-red-600' : ch.rate > 10 ? 'text-amber-500' : 'text-emerald-600'}`}
                                        >
                                            {ch.rate}%
                                        </span>
                                    </div>
                                    <div
                                        className="h-1.5 overflow-hidden rounded-full bg-sidebar-border/40"
                                        title={`${ch.cancelled} / ${ch.total}`}
                                    >
                                        <div
                                            className={`h-full rounded-full transition-all ${ch.rate > 20 ? 'bg-red-500' : ch.rate > 10 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                                            style={{
                                                width: `${Math.min(ch.rate, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Insight */}
                        <div
                            className={`mt-4 rounded-xl p-3 text-xs ${
                                (cancellationData?.cancel_rate ?? 0) > 20
                                    ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    : (cancellationData?.cancel_rate ?? 0) > 10
                                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                                      : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                            }`}
                        >
                            {(cancellationData?.cancel_rate ?? 0) > 20
                                ? t('cancel.insight_high')
                                : (cancellationData?.cancel_rate ?? 0) > 10
                                  ? t('cancel.insight_mid')
                                  : t('cancel.insight_ok')}
                        </div>
                    </div>
                </div>

                {/* ══ SECTION 6 – Recent Bookings (with Pagination) ════ */}
                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="flex items-center justify-between border-b border-sidebar-border/50 px-6 py-4">
                        <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            {t('section.recent') as string}
                        </h2>
                        <Link
                            href="/admin/bookings"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            {t('table.view_all') as string}
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/40 text-left text-xs font-semibold text-muted-foreground uppercase">
                                    <th className="px-6 py-3">
                                        {t('table.guest')}
                                    </th>
                                    <th className="px-6 py-3">
                                        {t('table.room')}
                                    </th>
                                    <th className="px-6 py-3">
                                        {t('table.checkin')}
                                    </th>
                                    <th className="px-6 py-3">
                                        {t('table.nights')}
                                    </th>
                                    <th className="px-6 py-3">
                                        {t('table.amount')}
                                    </th>
                                    <th className="px-6 py-3">
                                        {t('table.source')}
                                    </th>
                                    <th className="px-6 py-3">
                                        {t('table.status')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(recentBookings ?? []).map((b) => (
                                    <tr
                                        key={b.id}
                                        className="border-b border-sidebar-border/30 transition-colors last:border-0 hover:bg-muted/30"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="font-medium">
                                                {b.guest_name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {b.guest_email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            {b.room_number ? (
                                                <>
                                                    <div className="font-medium">
                                                        #{b.room_number}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {b.room_type}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            {b.check_in_date}
                                        </td>
                                        <td className="px-6 py-3">
                                            {b.nights}
                                            {t('misc.night_abbr')}
                                        </td>
                                        <td className="px-6 py-3 font-medium">
                                            {fmt(b.total_amount)}
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground capitalize">
                                            {b.booking_source?.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[b.status] ?? ''}`}
                                            >
                                                {b.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(recentBookings ?? []).length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            {t('table.no_data')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-sidebar-border/50 bg-muted/10 px-6 py-3">
                            <p className="text-xs text-muted-foreground">
                                {t('table.page') as string}{' '}
                                <span className="font-semibold text-foreground">
                                    {pagination.page}
                                </span>{' '}
                                {t('table.of') as string}{' '}
                                <span className="font-semibold text-foreground">
                                    {pagination.last_page}
                                </span>{' '}
                                ({pagination.total}{' '}
                                {t('cancel.bookings') as string})
                            </p>
                            <div className="flex gap-2 text-xs">
                                <button
                                    disabled={pagination.page === 1}
                                    onClick={() =>
                                        changePage(pagination.page - 1)
                                    }
                                    className="rounded border border-sidebar-border/60 bg-white px-3 py-1 font-semibold disabled:opacity-40 dark:bg-sidebar"
                                >
                                    ←
                                </button>
                                <button
                                    disabled={
                                        pagination.page === pagination.last_page
                                    }
                                    onClick={() =>
                                        changePage(pagination.page + 1)
                                    }
                                    className="rounded border border-sidebar-border/60 bg-white px-3 py-1 font-semibold disabled:opacity-40 dark:bg-sidebar"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
