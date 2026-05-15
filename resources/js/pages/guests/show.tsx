import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface GuestDetail {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
    id_number: string | null;
    nationality: string;
    date_of_birth: string | null;
    preferences: Record<string, string>;
    notes: string | null;
    is_blacklisted: boolean;
    blacklist_reason: string | null;
    total_bookings: number;
    total_spend: number;
    created_at: string;
}

interface StayRecord {
    id: number;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    status: string;
    total_amount: number;
    room_number: string | null;
    room_type: string | null;
    special_requests: string | null;
}

interface PageProps {
    guest: GuestDetail;
    bookings: StayRecord[];
    flash?: { success?: string };
    [key: string]: unknown;
}

const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(n);

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-900/50 text-amber-300',
    confirmed: 'bg-blue-900/50 text-blue-300',
    checked_in: 'bg-emerald-900/50 text-emerald-300',
    checked_out: 'bg-neutral-700 text-neutral-300',
    cancelled: 'bg-rose-900/50 text-rose-300',
};

const PREF_ICONS: Record<string, string> = {
    non_smoking: '🚭 Non-smoking',
    honeymoon: '💑 Honeymoon Setup',
    extra_pillow: '🛏️ Extra Pillow',
    high_floor: '🏙️ High Floor',
    quiet_room: '🤫 Quiet Room',
    early_checkin: '⏰ Early Check-in',
    late_checkout: '🕐 Late Check-out',
    vegan_food: '🥗 Vegan Food',
    baby_crib: '👶 Baby Crib',
};

export default function GuestShow() {
    const { guest, bookings, flash } = usePage<PageProps>().props;
    const [notes, setNotes] = useState(guest.notes ?? '');
    const [noteSaved, setNoteSaved] = useState(false);
    const [showBlacklist, setShowBlacklist] = useState(false);
    const [blacklistReason, setBlacklistReason] = useState(
        guest.blacklist_reason ?? '',
    );

    const saveNotes = () => {
        router.patch(
            `/admin/guests/${guest.id}`,
            { notes },
            {
                preserveState: true,
                onSuccess: () => {
                    setNoteSaved(true);
                    setTimeout(() => setNoteSaved(false), 2000);
                },
            },
        );
    };

    const toggleBlacklist = () => {
        if (guest.is_blacklisted) {
            router.patch(
                `/admin/guests/${guest.id}`,
                { is_blacklisted: false, blacklist_reason: null },
                { preserveState: false },
            );
        } else {
            if (!blacklistReason.trim())
                return alert('Masukkan alasan blacklist');
            router.patch(
                `/admin/guests/${guest.id}`,
                { is_blacklisted: true, blacklist_reason: blacklistReason },
                { preserveState: false },
            );
        }
    };

    const totalNights = bookings.reduce((sum, b) => sum + b.nights, 0);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Guest Database', href: '/guests' },
                { title: guest.name, href: `/guests/${guest.id}` },
            ]}
        >
            <Head title={`Tamu — ${guest.name}`} />

            <div className="space-y-6 p-6">
                {flash?.success && (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Profile Header */}
                <div className="flex flex-col gap-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:flex-row">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white">
                        {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold text-white">
                                {guest.name}
                            </h1>
                            {guest.is_blacklisted && (
                                <span className="rounded-full bg-rose-900/60 px-3 py-0.5 text-xs font-semibold text-rose-300">
                                    🚫 Blacklisted
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-neutral-400">
                            {guest.nationality}{' '}
                            {guest.date_of_birth
                                ? `· DOB: ${guest.date_of_birth}`
                                : ''}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-neutral-300">
                            <span>📧 {guest.email}</span>
                            <span>📞 {guest.phone}</span>
                            {guest.address && <span>📍 {guest.address}</span>}
                            {guest.id_number && (
                                <span>🪪 {guest.id_number}</span>
                            )}
                        </div>
                    </div>
                    {/* KPI */}
                    <div className="flex shrink-0 gap-4">
                        {[
                            {
                                label: 'Total Menginap',
                                value: `${guest.total_bookings}× (${totalNights} malam)`,
                                color: 'text-indigo-400',
                            },
                            {
                                label: 'Total Spend',
                                value: formatIDR(guest.total_spend),
                                color: 'text-emerald-400',
                            },
                        ].map((k) => (
                            <div
                                key={k.label}
                                className="min-w-[130px] rounded-xl bg-neutral-800 px-4 py-3 text-center"
                            >
                                <div className={`text-lg font-bold ${k.color}`}>
                                    {k.value}
                                </div>
                                <div className="mt-0.5 text-xs text-neutral-500">
                                    {k.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: Preferences + Notes */}
                    <div className="space-y-4">
                        {/* Preferences */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                            <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
                                ✨ Preferensi
                            </h2>
                            {Object.keys(guest.preferences).length === 0 ? (
                                <p className="text-sm text-neutral-500 italic">
                                    Tidak ada preferensi.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(guest.preferences).map((k) => (
                                        <span
                                            key={k}
                                            className="rounded-full bg-indigo-900/50 px-3 py-1 text-xs font-medium text-indigo-300"
                                        >
                                            {PREF_ICONS[k] ??
                                                guest.preferences[k]}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Staff Notes */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                            <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
                                📝 Catatan Staff
                            </h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                                placeholder="Catatan internal tentang tamu ini..."
                            />
                            <button
                                onClick={saveNotes}
                                className="mt-2 w-full rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                            >
                                {noteSaved ? '✓ Tersimpan' : 'Simpan Catatan'}
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4">
                            <h2 className="mb-3 font-semibold text-rose-400">
                                ⚠️ Danger Zone
                            </h2>
                            {!guest.is_blacklisted ? (
                                <>
                                    <p className="mb-2 text-xs text-neutral-400">
                                        Blacklist tamu ini? Masukkan alasan:
                                    </p>
                                    <textarea
                                        value={blacklistReason}
                                        onChange={(e) =>
                                            setBlacklistReason(e.target.value)
                                        }
                                        rows={2}
                                        className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                                        placeholder="Alasan blacklist..."
                                    />
                                    <button
                                        onClick={toggleBlacklist}
                                        className="mt-2 w-full rounded-xl bg-rose-700 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-800"
                                    >
                                        🚫 Blacklist Tamu
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="mb-2 text-xs text-neutral-400">
                                        <strong>Alasan:</strong>{' '}
                                        {guest.blacklist_reason}
                                    </p>
                                    <button
                                        onClick={toggleBlacklist}
                                        className="w-full rounded-xl bg-neutral-700 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-600"
                                    >
                                        ✓ Hapus Blacklist
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Stay History */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 lg:col-span-2">
                        <div className="border-b border-neutral-800 px-4 py-3">
                            <h2 className="font-semibold text-white">
                                📅 Riwayat Menginap ({bookings.length})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-800 text-left text-neutral-400">
                                        <th className="px-4 py-3 font-medium">
                                            Check-in
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Check-out
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Kamar
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Malam
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-10 text-center text-neutral-500"
                                            >
                                                Belum ada riwayat menginap.
                                            </td>
                                        </tr>
                                    )}
                                    {bookings.map((b) => (
                                        <tr
                                            key={b.id}
                                            className="border-b border-neutral-800/50 transition-colors hover:bg-neutral-800/30"
                                        >
                                            <td className="px-4 py-3 text-neutral-300">
                                                {b.check_in_date}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-300">
                                                {b.check_out_date}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-white">
                                                    {b.room_number ?? '—'}
                                                </div>
                                                <div className="text-xs text-neutral-500">
                                                    {b.room_type}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-400">
                                                {b.nights}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-emerald-400">
                                                {formatIDR(b.total_amount)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[b.status] ?? 'bg-neutral-700 text-neutral-300'}`}
                                                >
                                                    {b.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
