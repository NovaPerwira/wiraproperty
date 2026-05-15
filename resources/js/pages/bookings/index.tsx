import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
];

const STATUS_FLOW: Record<
    string,
    { label: string; next: string; nextLabel: string; btnClass: string }
> = {
    pending: {
        label: 'Pending',
        next: 'confirmed',
        nextLabel: 'Confirm',
        btnClass:
            'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200',
    },
    confirmed: {
        label: 'Confirmed',
        next: 'checked_in',
        nextLabel: 'Check-in',
        btnClass:
            'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200',
    },
    checked_in: {
        label: 'Checked-in',
        next: 'checked_out',
        nextLabel: 'Check-out',
        btnClass:
            'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200',
    },
    checked_out: {
        label: 'Checked-out',
        next: '',
        nextLabel: '',
        btnClass: '',
    },
    cancelled: { label: 'Cancelled', next: '', nextLabel: '', btnClass: '' },
};

const STATUS_BADGE: Record<string, string> = {
    pending:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    confirmed:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    checked_in:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    checked_out:
        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

const SOURCE_LABELS: Record<string, string> = {
    direct: 'Direct',
    ota: 'OTA',
    walk_in: 'Walk-in',
};

function fmt(n: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(n);
}

interface BookingRow {
    id: number;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    guest_address: string | null;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    status: string;
    booking_source: string;
    total_amount: number;
    special_requests: string | null;
    room: { id: number; room_number: string; room_type: string } | null;
}

interface Paginated {
    data: BookingRow[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    last_page: number;
}

interface Props {
    bookings: Paginated;
    filters: Record<string, string>;
}

export default function BookingsIndex({ bookings, filters }: Props) {
    const { t } = useTranslation();
    const [f, setF] = useState({
        search: filters.search ?? '',
        status: filters.status ?? '',
        source: filters.source ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });

    const applyFilters = (overrides?: Partial<typeof f>) => {
        const params = { ...f, ...overrides };
        setF(params as typeof f);
        router.get('/admin/bookings', params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        const empty = {
            search: '',
            status: '',
            source: '',
            date_from: '',
            date_to: '',
        };
        setF(empty);
        router.get('/admin/bookings', {}, { replace: true });
    };

    const advanceStatus = (id: number, next: string) => {
        router.patch(`/admin/bookings/${id}`, { status: next });
    };

    const cancelBooking = (id: number) => {
        if (!confirm('Cancel this booking?')) return;
        router.patch(`/admin/bookings/${id}`, { status: 'cancelled' });
    };

    const deleteBooking = (id: number, name: string) => {
        if (!confirm(`Delete booking for "${name}"?`)) return;
        router.delete(`/admin/bookings/${id}`);
    };

    const hasFilters = Object.values(f).some(Boolean);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings" />
            <div className="flex flex-col gap-5 p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('bookings.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {bookings.total} total booking
                            {bookings.total !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link
                        href="/admin/bookings/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        + {t('bookings.add_booking')}
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <input
                            type="text"
                            placeholder="Search guest name, email, phone…"
                            value={f.search}
                            onChange={(e) =>
                                setF((p) => ({ ...p, search: e.target.value }))
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' && applyFilters()
                            }
                            className="col-span-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring lg:col-span-2"
                        />
                        <select
                            value={f.status}
                            onChange={(e) =>
                                applyFilters({ status: e.target.value })
                            }
                            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                        >
                            <option value="">All statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked_in">Checked-in</option>
                            <option value="checked_out">Checked-out</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select
                            value={f.source}
                            onChange={(e) =>
                                applyFilters({ source: e.target.value })
                            }
                            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                        >
                            <option value="">All sources</option>
                            <option value="direct">Direct</option>
                            <option value="ota">OTA</option>
                            <option value="walk_in">Walk-in</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => applyFilters()}
                                className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                            >
                                Search
                            </button>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="rounded-lg border border-input px-3 py-2 text-sm hover:bg-muted"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <div className="flex flex-1 items-center gap-2">
                            <label className="text-xs font-medium whitespace-nowrap text-muted-foreground">
                                Check-in from
                            </label>
                            <input
                                type="date"
                                value={f.date_from}
                                onChange={(e) =>
                                    applyFilters({ date_from: e.target.value })
                                }
                                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="flex flex-1 items-center gap-2">
                            <label className="text-xs font-medium whitespace-nowrap text-muted-foreground">
                                to
                            </label>
                            <input
                                type="date"
                                value={f.date_to}
                                onChange={(e) =>
                                    applyFilters({ date_to: e.target.value })
                                }
                                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/50 text-left text-xs font-semibold text-muted-foreground uppercase">
                                    <th className="px-5 py-3">
                                        {t('bookings.guest')}
                                    </th>
                                    <th className="px-5 py-3">
                                        {t('common.rooms')}
                                    </th>
                                    <th className="px-5 py-3">
                                        {t('bookings.check_in')} / out
                                    </th>
                                    <th className="px-5 py-3">Nights</th>
                                    <th className="px-5 py-3">
                                        {t('bookings.amount')}
                                    </th>
                                    <th className="px-5 py-3">
                                        {t('bookings.source')}
                                    </th>
                                    <th className="px-5 py-3">
                                        {t('common.status')}
                                    </th>
                                    <th className="px-5 py-3 text-right">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.data.map((b) => {
                                    const sf = STATUS_FLOW[b.status];
                                    return (
                                        <tr
                                            key={b.id}
                                            className="border-b border-sidebar-border/30 transition-colors last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="font-medium">
                                                    {b.guest_name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {b.guest_email}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {b.guest_phone}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                {b.room ? (
                                                    <>
                                                        <div className="font-semibold">
                                                            #
                                                            {b.room.room_number}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {b.room.room_type}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div>{b.check_in_date}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {b.check_out_date}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-medium">
                                                {b.nights}N
                                            </td>
                                            <td className="px-5 py-3 font-semibold">
                                                {fmt(b.total_amount)}
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground">
                                                {SOURCE_LABELS[
                                                    b.booking_source
                                                ] ?? b.booking_source}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[b.status] ?? ''}`}
                                                >
                                                    {sf?.label ?? b.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {sf?.next && (
                                                        <button
                                                            onClick={() =>
                                                                advanceStatus(
                                                                    b.id,
                                                                    sf.next,
                                                                )
                                                            }
                                                            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${sf.btnClass}`}
                                                        >
                                                            {sf.nextLabel}
                                                        </button>
                                                    )}
                                                    {b.status !== 'cancelled' &&
                                                        b.status !==
                                                            'checked_out' && (
                                                            <button
                                                                onClick={() =>
                                                                    cancelBooking(
                                                                        b.id,
                                                                    )
                                                                }
                                                                className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    <button
                                                        onClick={() =>
                                                            deleteBooking(
                                                                b.id,
                                                                b.guest_name,
                                                            )
                                                        }
                                                        className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {bookings.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-12 text-center text-muted-foreground"
                                        >
                                            No bookings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-sidebar-border/50 px-5 py-3 dark:border-sidebar-border">
                            <p className="text-xs text-muted-foreground">
                                Showing {bookings.from}–{bookings.to} of{' '}
                                {bookings.total}
                            </p>
                            <div className="flex gap-1">
                                {bookings.links.map((l, i) => (
                                    <button
                                        key={i}
                                        disabled={!l.url}
                                        onClick={() =>
                                            l.url && router.get(l.url)
                                        }
                                        className={`rounded px-3 py-1 text-xs font-medium ${l.active ? 'bg-primary text-primary-foreground' : ''} ${!l.url ? 'cursor-not-allowed opacity-40' : 'hover:bg-muted'}`}
                                        dangerouslySetInnerHTML={{
                                            __html: l.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
