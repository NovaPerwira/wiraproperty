import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const fmtK = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface KPI { occupancy_rate: number; monthly_revenue: number; arr: number; revpar: number; }
interface Ops { total_rooms: number; available_rooms: number; occupied_today: number; maintenance: number; pending_bookings: number; }
interface TrendPoint { month: string; revenue: number; occupancy: number; }
interface SourceSplit { source: string; count: number; pct: number; }
interface RecentBooking {
    id: number; guest_name: string; guest_email: string;
    check_in_date: string; check_out_date: string; nights: number;
    status: string; total_amount: number; booking_source: string;
    room_number: string | null; room_type: string | null;
}

interface DashboardProps {
    [key: string]: unknown;
    kpi: KPI; ops: Ops;
    chartData: TrendPoint[];
    period: number;
    bookingSourceSplit: SourceSplit[];
    recentBookings: RecentBooking[];
}

// ─── Shared status styles ─────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    checked_in: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    checked_out: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{children}</h2>
            <div className="flex-1 h-px bg-sidebar-border/40" />
        </div>
    );
}

function KpiCard({ label, value, sub, icon, gradient }: {
    label: string; value: string; sub?: string; icon: string; gradient: string;
}) {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-5 shadow-md ${gradient}`}>
            {/* Background decorative circle */}
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
            <div className="absolute -right-1 -top-1 h-10 w-10 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
                    {sub && <p className="mt-0.5 text-xs text-white/60">{sub}</p>}
                </div>
                <span className="text-2xl">{icon}</span>
            </div>
        </div>
    );
}

function OpsCard({ label, value, icon, colorClass }: { label: string; value: number | string; icon: string; colorClass: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-white px-4 py-3 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl flex-shrink-0 ${colorClass}`}>{icon}</span>
            <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
}

// Source colors
const SOURCE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const { kpi, ops, chartData, period, bookingSourceSplit, recentBookings } = usePage<DashboardProps>().props;
    const [activePeriod, setActivePeriod] = useState(period ?? 6);
    const [activeChart, setActiveChart] = useState<'revenue' | 'occupancy'>('revenue');

    const changePeriod = (p: number) => {
        setActivePeriod(p);
        router.get('/dashboard', { period: p }, { preserveState: true, replace: true });
    };

    const totalSource = bookingSourceSplit?.reduce((s, r) => s + r.count, 0) ?? 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-8 p-6">

                {/* ══════════════════════════════════════════════════════════
                    SECTION 1 – Business Performance KPIs
                ══════════════════════════════════════════════════════════ */}
                <div>
                    <SectionTitle>📊 Business Performance — {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</SectionTitle>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <KpiCard
                            label="Occupancy Rate"
                            value={`${kpi?.occupancy_rate ?? 0}%`}
                            sub={`${ops?.occupied_today ?? 0} of ${ops?.total_rooms ?? 0} rooms`}
                            icon="📈"
                            gradient="bg-gradient-to-br from-indigo-600 to-violet-700"
                        />
                        <KpiCard
                            label="Monthly Revenue"
                            value={`Rp ${fmtK(kpi?.monthly_revenue ?? 0)}`}
                            sub={fmt(kpi?.monthly_revenue ?? 0)}
                            icon="💰"
                            gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
                        />
                        <KpiCard
                            label="ARR — Avg Room Rate"
                            value={`Rp ${fmtK(kpi?.arr ?? 0)}`}
                            sub="Revenue per sold room"
                            icon="🏷️"
                            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                        />
                        <KpiCard
                            label="RevPAR"
                            value={`Rp ${fmtK(kpi?.revpar ?? 0)}`}
                            sub="Revenue per available room"
                            icon="🎯"
                            gradient="bg-gradient-to-br from-rose-500 to-pink-700"
                        />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 2 – Operational Snapshot
                ══════════════════════════════════════════════════════════ */}
                <div>
                    <SectionTitle>🏨 Operational Snapshot — Today</SectionTitle>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        <OpsCard label="Total Rooms" value={ops?.total_rooms ?? 0} icon="🏨" colorClass="bg-indigo-100 dark:bg-indigo-900/40" />
                        <OpsCard label="Available" value={ops?.available_rooms ?? 0} icon="✨" colorClass="bg-emerald-100 dark:bg-emerald-900/40" />
                        <OpsCard label="Occupied Today" value={ops?.occupied_today ?? 0} icon="🔑" colorClass="bg-blue-100 dark:bg-blue-900/40" />
                        <OpsCard label="Maintenance" value={ops?.maintenance ?? 0} icon="🔧" colorClass="bg-red-100 dark:bg-red-900/40" />
                        <OpsCard label="Pending Bookings" value={ops?.pending_bookings ?? 0} icon="⏳" colorClass="bg-amber-100 dark:bg-amber-900/40" />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 3 – Trend Charts + Direct vs OTA (side by side)
                ══════════════════════════════════════════════════════════ */}
                <div className="grid gap-4 xl:grid-cols-3">

                    {/* Charts — 2/3 width */}
                    <div className="xl:col-span-2 rounded-2xl border border-sidebar-border/70 bg-white p-5 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        {/* Chart Controls */}
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex rounded-xl overflow-hidden border border-sidebar-border/60">
                                {(['revenue', 'occupancy'] as const).map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setActiveChart(c)}
                                        className={`px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${activeChart === c
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-muted-foreground hover:bg-muted/50'
                                            }`}
                                    >
                                        {c === 'revenue' ? '💰 Revenue' : '📈 Occupancy'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                {[3, 6, 12].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => changePeriod(p)}
                                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${activePeriod === p
                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                                : 'text-muted-foreground hover:bg-muted/50'
                                            }`}
                                    >
                                        {p}M
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm font-semibold mb-3">
                            {activeChart === 'revenue' ? 'Revenue Trend' : 'Occupancy Rate Trend'} — Last {activePeriod} Months
                        </p>

                        {activeChart === 'revenue' ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={chartData ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tickFormatter={(v) => `${fmtK(v)}`} tick={{ fontSize: 11 }} width={55} />
                                    <Tooltip formatter={(v: number) => fmt(v)} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Revenue"
                                        stroke="#6366f1"
                                        strokeWidth={2.5}
                                        fill="url(#revGrad)"
                                        dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={chartData ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} width={45} />
                                    <Tooltip formatter={(v: number) => `${v}%`} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="occupancy"
                                        name="Occupancy %"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Direct vs OTA — 1/3 width */}
                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        <p className="text-sm font-semibold mb-1">🔀 Booking Channel Split</p>
                        <p className="text-xs text-muted-foreground mb-4">Confirmed + Checked In/Out</p>

                        {/* Visual donut-style bar */}
                        <div className="mb-5 flex h-3 rounded-full overflow-hidden gap-0.5">
                            {(bookingSourceSplit ?? []).map((s, i) => (
                                s.pct > 0 && (
                                    <div
                                        key={s.source}
                                        style={{ width: `${s.pct}%`, backgroundColor: SOURCE_COLORS[i] }}
                                        title={`${s.source}: ${s.pct}%`}
                                        className="transition-all"
                                    />
                                )
                            ))}
                        </div>

                        {/* Legend rows */}
                        <div className="space-y-3">
                            {(bookingSourceSplit ?? []).map((s, i) => (
                                <div key={s.source} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: SOURCE_COLORS[i] }} />
                                        <span className="text-sm font-medium">{s.source}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold">{s.pct}%</span>
                                        <span className="ml-2 text-xs text-muted-foreground">({s.count})</span>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-3 border-t border-sidebar-border/40 pt-3 flex justify-between text-xs text-muted-foreground">
                                <span>Total bookings</span>
                                <span className="font-semibold text-foreground">{totalSource}</span>
                            </div>
                        </div>

                        {/* Insight callout */}
                        {(() => {
                            const ota = bookingSourceSplit?.find(s => s.source === 'OTA');
                            const direct = bookingSourceSplit?.find(s => s.source === 'Direct / Walk-in');
                            if (!ota || !direct) return null;
                            const isOtaHeavy = ota.pct > 60;
                            return (
                                <div className={`mt-4 rounded-xl p-3 text-xs ${isOtaHeavy ? 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'}`}>
                                    {isOtaHeavy
                                        ? `⚠️ OTA dependency is high (${ota.pct}%). Consider direct booking incentives to reduce commission costs.`
                                        : `✅ Healthy direct booking ratio (${direct.pct}%). Lower OTA commissions improve margins.`
                                    }
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    SECTION 4 – Recent Bookings
                ══════════════════════════════════════════════════════════ */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar overflow-hidden">
                    <div className="flex items-center justify-between border-b border-sidebar-border/50 px-6 py-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Bookings</h2>
                        <Link href="/bookings" className="text-sm font-medium text-primary hover:underline">View all →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/40 text-left text-xs font-semibold uppercase text-muted-foreground">
                                    <th className="px-6 py-3">Guest</th>
                                    <th className="px-6 py-3">Room</th>
                                    <th className="px-6 py-3">Check-in</th>
                                    <th className="px-6 py-3">Nights</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Source</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(recentBookings ?? []).map((b) => (
                                    <tr key={b.id} className="border-b border-sidebar-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="font-medium">{b.guest_name}</div>
                                            <div className="text-xs text-muted-foreground">{b.guest_email}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            {b.room_number
                                                ? <><div className="font-medium">#{b.room_number}</div><div className="text-xs text-muted-foreground">{b.room_type}</div></>
                                                : <span className="text-muted-foreground">—</span>
                                            }
                                        </td>
                                        <td className="px-6 py-3">{b.check_in_date}</td>
                                        <td className="px-6 py-3">{b.nights}N</td>
                                        <td className="px-6 py-3 font-medium">{fmt(b.total_amount)}</td>
                                        <td className="px-6 py-3 text-muted-foreground capitalize">{b.booking_source?.replace('_', ' ')}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[b.status] ?? ''}`}>
                                                {b.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(recentBookings ?? []).length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">No bookings yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
