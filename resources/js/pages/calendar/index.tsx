import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Calendar', href: '/admin/calendar' },
];

interface RoomData {
    id: number;
    room_number: string;
    floor: number;
    status: 'available' | 'maintenance';
    display_status: 'available' | 'occupied' | 'maintenance';
    room_type: string | null;
    base_price: number;
}

interface BookingData {
    id: number;
    room_id: number;
    guest_name: string;
    guest_email: string;
    check_in_date: string;    // 'YYYY-MM-DD'
    check_out_date: string;
    nights: number;
    status: string;
    booking_source: string;
    total_amount: number;
}

interface Props {
    rooms: RoomData[];
    bookings: BookingData[];
    year: number;
    month: number; // 1-12
}

const STATUS_COLORS: Record<string, { bar: string; text: string }> = {
    pending: { bar: 'bg-amber-400', text: 'text-amber-900' },
    confirmed: { bar: 'bg-blue-500', text: 'text-white' },
    checked_in: { bar: 'bg-emerald-500', text: 'text-white' },
    checked_out: { bar: 'bg-slate-400', text: 'text-white' },
    cancelled: { bar: 'bg-red-400 opacity-50 line-through', text: 'text-white' },
};

const SOURCE_LABELS: Record<string, string> = { direct: 'Direct', ota: 'OTA', walk_in: 'Walk-in' };

function fmt(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

// Month helpers
function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate(); // month is 1-based
}

function getDayOfWeek(year: number, month: number, day: number) {
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' });
}

export default function CalendarIndex({ rooms, bookings, year, month }: Props) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [tooltip, setTooltip] = useState<{
        booking: BookingData; x: number; y: number;
    } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const daysInMonth = getDaysInMonth(year, month);
    const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Navigate months
    const navigate = (dir: -1 | 1) => {
        let m = month + dir;
        let y = year;
        if (m < 1) { m = 12; y -= 1; }
        if (m > 12) { m = 1; y += 1; }
        router.get('/admin/calendar', { year: y, month: m }, { preserveState: false });
    };

    // Build a lookup: roomId → bookings[]
    const bookingsByRoom = new Map<number, BookingData[]>();
    for (const b of bookings) {
        if (!bookingsByRoom.has(b.room_id)) bookingsByRoom.set(b.room_id, []);
        bookingsByRoom.get(b.room_id)!.push(b);
    }

    // Group rooms by floor
    const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);

    // Helper: get the offset & span cols for a booking in this month view
    const getBookingSpan = (b: BookingData) => {
        const cin = new Date(b.check_in_date);
        const cout = new Date(b.check_out_date);
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0); // last day

        const start = cin < monthStart ? monthStart : cin;
        const end = cout > monthEnd ? new Date(year, month, 0) : cout; // clamp

        const startDay = start.getDate(); // 1-based
        const endDay = end.getDate();

        // span = how many full-day columns to occupy
        const span = endDay - startDay; // checkout day is NOT painted (standard hotel convention)
        if (span <= 0) return null;
        return { startDay, span };
    };

    const CELL_W = 36; // px per day column
    const ROW_H = 44; // px per room row

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Occupancy Calendar" />
            <div className="flex flex-col gap-4 p-6">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Occupancy Calendar</h1>
                        <p className="text-sm text-muted-foreground">Visual room booking layout — {bookings.length} bookings this month</p>
                    </div>
                    {/* Month navigation */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-muted text-lg">‹</button>
                        <span className="min-w-36 text-center font-semibold">{monthName}</span>
                        <button onClick={() => navigate(1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-muted text-lg">›</button>
                        <button onClick={() => router.get('/admin/calendar', { year: today.getFullYear(), month: today.getMonth() + 1 })}
                            className="rounded-lg border border-input px-3 py-1.5 text-sm hover:bg-muted">Today</button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3">
                    {Object.entries(STATUS_COLORS).map(([k, v]) => (
                        <span key={k} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold text-white ${v.bar.split(' ')[0]}`}>
                            {k.replace('_', ' ')}
                        </span>
                    ))}
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-red-200 px-3 py-1 text-xs font-semibold text-red-900">🔧 Maintenance</span>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div ref={containerRef} className="overflow-x-auto" style={{ cursor: 'default' }}>
                        <div style={{ minWidth: `${140 + CELL_W * daysInMonth}px` }}>

                            {/* Day headers */}
                            <div className="sticky top-0 z-20 flex border-b border-sidebar-border/50 bg-white dark:border-sidebar-border dark:bg-sidebar">
                                {/* Room label col */}
                                <div className="sticky left-0 z-30 flex w-36 shrink-0 items-center border-r border-sidebar-border/50 bg-white px-3 py-2 dark:border-sidebar-border dark:bg-sidebar">
                                    <span className="text-xs font-semibold uppercase text-muted-foreground">Room</span>
                                </div>
                                {/* Day columns */}
                                {Array.from({ length: daysInMonth }, (_, i) => {
                                    const day = i + 1;
                                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const isToday = dateStr === todayStr;
                                    const dow = getDayOfWeek(year, month, day);
                                    const isWeekend = dow === 'Sat' || dow === 'Sun';
                                    return (
                                        <div key={day} style={{ width: CELL_W, minWidth: CELL_W }}
                                            className={`relative flex flex-col items-center justify-center border-r border-sidebar-border/30 py-1.5 dark:border-sidebar-border
                                                ${isToday ? 'bg-primary/10' : isWeekend ? 'bg-muted/40' : ''}`}>
                                            <span className="text-xs font-bold" style={{ color: isToday ? 'hsl(var(--primary))' : '' }}>{day}</span>
                                            <span className="text-[10px] text-muted-foreground">{dow.slice(0, 1)}</span>
                                            {isToday && <div className="absolute bottom-0 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded bg-primary" />}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Room rows grouped by floor */}
                            {floors.map((floor) => {
                                const floorRooms = rooms.filter((r) => r.floor === floor);
                                return (
                                    <div key={floor}>
                                        {/* Floor separator */}
                                        <div className="flex border-b border-sidebar-border/50 bg-muted/20 dark:border-sidebar-border">
                                            <div className="sticky left-0 z-10 w-36 shrink-0 border-r border-sidebar-border/50 bg-muted/30 px-3 py-1.5 dark:border-sidebar-border dark:bg-muted/10">
                                                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Floor {floor}</span>
                                            </div>
                                            <div className="flex-1" />
                                        </div>

                                        {/* Each room row */}
                                        {floorRooms.map((room) => {
                                            const roomBookings = bookingsByRoom.get(room.id) ?? [];
                                            const isMaintenance = room.status === 'maintenance';

                                            return (
                                                <div key={room.id} className="group relative flex border-b border-sidebar-border/30 hover:bg-muted/20 dark:border-sidebar-border"
                                                    style={{ height: ROW_H }}>

                                                    {/* Room label */}
                                                    <div className="sticky left-0 z-10 flex w-36 shrink-0 flex-col justify-center border-r border-sidebar-border/50 bg-white px-3 group-hover:bg-muted/30 dark:border-sidebar-border dark:bg-sidebar dark:group-hover:bg-muted/10">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-bold text-sm">#{room.room_number}</span>
                                                            {room.display_status === 'maintenance' && <span className="text-[10px]">🔧</span>}
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground">{room.room_type}</span>
                                                    </div>

                                                    {/* Day cells */}
                                                    <div className="relative flex flex-1" style={{ minWidth: CELL_W * daysInMonth }}>
                                                        {/* Day column backgrounds */}
                                                        {Array.from({ length: daysInMonth }, (_, i) => {
                                                            const day = i + 1;
                                                            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                            const isToday = dateStr === todayStr;
                                                            const dow = getDayOfWeek(year, month, day);
                                                            const isWeekend = dow === 'Sat' || dow === 'Sun';
                                                            return (
                                                                <div key={day} style={{ width: CELL_W, minWidth: CELL_W }}
                                                                    className={`h-full border-r border-sidebar-border/20 dark:border-sidebar-border
                                                                        ${isToday ? 'bg-primary/5' : isWeekend ? 'bg-muted/30' : ''}`}
                                                                />
                                                            );
                                                        })}

                                                        {/* Maintenance overlay */}
                                                        {isMaintenance && (
                                                            <div className="absolute inset-0 z-10 flex items-center" style={{ left: 0 }}>
                                                                <div className="w-full h-6 bg-red-200/80 dark:bg-red-900/40 border-y border-red-300 dark:border-red-700 flex items-center px-2">
                                                                    <span className="text-[10px] font-semibold text-red-700 dark:text-red-300">🔧 Under Maintenance</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Booking blocks */}
                                                        {!isMaintenance && roomBookings.map((b) => {
                                                            const span = getBookingSpan(b);
                                                            if (!span) return null;
                                                            const { startDay, span: colSpan } = span;
                                                            const colors = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
                                                            const left = (startDay - 1) * CELL_W;
                                                            const width = colSpan * CELL_W - 2; // 2px gap
                                                            return (
                                                                <div
                                                                    key={b.id}
                                                                    className={`absolute z-20 flex cursor-pointer items-center overflow-hidden rounded-md px-2 text-[11px] font-semibold shadow-sm transition-all hover:z-30 hover:scale-[1.02] hover:shadow-md ${colors.bar} ${colors.text}`}
                                                                    style={{
                                                                        left: left + 1,
                                                                        width: Math.max(width, 20),
                                                                        height: 28,
                                                                        top: (ROW_H - 28) / 2,
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        const rect = containerRef.current?.getBoundingClientRect();
                                                                        setTooltip({
                                                                            booking: b,
                                                                            x: e.clientX - (rect?.left ?? 0),
                                                                            y: e.clientY - (rect?.top ?? 0),
                                                                        });
                                                                    }}
                                                                    onMouseLeave={() => setTooltip(null)}
                                                                    onClick={() => router.visit(`/admin/bookings?search=${encodeURIComponent(b.guest_name)}`)}
                                                                >
                                                                    <span className="truncate">{b.guest_name}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}

                            {rooms.length === 0 && (
                                <div className="px-6 py-12 text-center text-muted-foreground">No rooms configured yet. <a href="/admin/rooms" className="text-primary underline">Add rooms</a>.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tooltip */}
                {tooltip && (
                    <div
                        className="pointer-events-none fixed z-50 w-72 rounded-xl border border-sidebar-border/70 bg-white p-4 shadow-2xl dark:border-sidebar-border dark:bg-sidebar"
                        style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold text-white ${STATUS_COLORS[tooltip.booking.status]?.bar.split(' ')[0]}`}>
                                {tooltip.booking.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-muted-foreground">{SOURCE_LABELS[tooltip.booking.booking_source]}</span>
                        </div>
                        <p className="font-bold">{tooltip.booking.guest_name}</p>
                        <p className="text-xs text-muted-foreground">{tooltip.booking.guest_email}</p>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>
                                <span className="text-xs text-muted-foreground">Check-in</span>
                                <div className="font-medium">{tooltip.booking.check_in_date}</div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Check-out</span>
                                <div className="font-medium">{tooltip.booking.check_out_date}</div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Nights</span>
                                <div className="font-medium">{tooltip.booking.nights}N</div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Total</span>
                                <div className="font-semibold text-emerald-600">{fmt(tooltip.booking.total_amount)}</div>
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Click to open booking details</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
