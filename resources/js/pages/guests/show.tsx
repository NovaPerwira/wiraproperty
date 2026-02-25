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
}

const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

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
    const [blacklistReason, setBlacklistReason] = useState(guest.blacklist_reason ?? '');

    const saveNotes = () => {
        router.patch(`/guests/${guest.id}`, { notes }, {
            preserveState: true,
            onSuccess: () => { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2000); },
        });
    };

    const toggleBlacklist = () => {
        if (guest.is_blacklisted) {
            router.patch(`/guests/${guest.id}`, { is_blacklisted: false, blacklist_reason: null }, { preserveState: false });
        } else {
            if (!blacklistReason.trim()) return alert('Masukkan alasan blacklist');
            router.patch(`/guests/${guest.id}`, { is_blacklisted: true, blacklist_reason: blacklistReason }, { preserveState: false });
        }
    };

    const totalNights = bookings.reduce((sum, b) => sum + b.nights, 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Guest Database', href: '/guests' },
            { title: guest.name, href: `/guests/${guest.id}` },
        ]}>
            <Head title={`Tamu — ${guest.name}`} />

            <div className="p-6 space-y-6">
                {flash?.success && (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Profile Header */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 flex flex-col sm:flex-row gap-5">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                        {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-white">{guest.name}</h1>
                            {guest.is_blacklisted && (
                                <span className="rounded-full bg-rose-900/60 text-rose-300 px-3 py-0.5 text-xs font-semibold">🚫 Blacklisted</span>
                            )}
                        </div>
                        <div className="text-sm text-neutral-400">{guest.nationality} {guest.date_of_birth ? `· DOB: ${guest.date_of_birth}` : ''}</div>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-neutral-300">
                            <span>📧 {guest.email}</span>
                            <span>📞 {guest.phone}</span>
                            {guest.address && <span>📍 {guest.address}</span>}
                            {guest.id_number && <span>🪪 {guest.id_number}</span>}
                        </div>
                    </div>
                    {/* KPI */}
                    <div className="flex gap-4 shrink-0">
                        {[
                            { label: 'Total Menginap', value: `${guest.total_bookings}× (${totalNights} malam)`, color: 'text-indigo-400' },
                            { label: 'Total Spend', value: formatIDR(guest.total_spend), color: 'text-emerald-400' },
                        ].map((k) => (
                            <div key={k.label} className="rounded-xl bg-neutral-800 px-4 py-3 text-center min-w-[130px]">
                                <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
                                <div className="text-xs text-neutral-500 mt-0.5">{k.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Preferences + Notes */}
                    <div className="space-y-4">
                        {/* Preferences */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">✨ Preferensi</h2>
                            {Object.keys(guest.preferences).length === 0 ? (
                                <p className="text-sm text-neutral-500 italic">Tidak ada preferensi.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(guest.preferences).map((k) => (
                                        <span key={k} className="rounded-full bg-indigo-900/50 text-indigo-300 px-3 py-1 text-xs font-medium">
                                            {PREF_ICONS[k] ?? guest.preferences[k]}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Staff Notes */}
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">📝 Catatan Staff</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none resize-none"
                                placeholder="Catatan internal tentang tamu ini..."
                            />
                            <button
                                onClick={saveNotes}
                                className="mt-2 w-full rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                            >
                                {noteSaved ? '✓ Tersimpan' : 'Simpan Catatan'}
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-4">
                            <h2 className="font-semibold text-rose-400 mb-3">⚠️ Danger Zone</h2>
                            {!guest.is_blacklisted ? (
                                <>
                                    <p className="text-xs text-neutral-400 mb-2">Blacklist tamu ini? Masukkan alasan:</p>
                                    <textarea
                                        value={blacklistReason}
                                        onChange={(e) => setBlacklistReason(e.target.value)}
                                        rows={2}
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none resize-none"
                                        placeholder="Alasan blacklist..."
                                    />
                                    <button onClick={toggleBlacklist} className="mt-2 w-full rounded-xl bg-rose-700 py-2 text-sm font-medium text-white hover:bg-rose-800 transition-colors">
                                        🚫 Blacklist Tamu
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs text-neutral-400 mb-2"><strong>Alasan:</strong> {guest.blacklist_reason}</p>
                                    <button onClick={toggleBlacklist} className="w-full rounded-xl bg-neutral-700 py-2 text-sm font-medium text-white hover:bg-neutral-600 transition-colors">
                                        ✓ Hapus Blacklist
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Stay History */}
                    <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                        <div className="border-b border-neutral-800 px-4 py-3">
                            <h2 className="font-semibold text-white">📅 Riwayat Menginap ({bookings.length})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-800 text-neutral-400 text-left">
                                        <th className="px-4 py-3 font-medium">Check-in</th>
                                        <th className="px-4 py-3 font-medium">Check-out</th>
                                        <th className="px-4 py-3 font-medium">Kamar</th>
                                        <th className="px-4 py-3 font-medium">Malam</th>
                                        <th className="px-4 py-3 font-medium">Total</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-neutral-500">Belum ada riwayat menginap.</td>
                                        </tr>
                                    )}
                                    {bookings.map((b) => (
                                        <tr key={b.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-4 py-3 text-neutral-300">{b.check_in_date}</td>
                                            <td className="px-4 py-3 text-neutral-300">{b.check_out_date}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-white">{b.room_number ?? '—'}</div>
                                                <div className="text-neutral-500 text-xs">{b.room_type}</div>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-400">{b.nights}</td>
                                            <td className="px-4 py-3 font-medium text-emerald-400">{formatIDR(b.total_amount)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[b.status] ?? 'bg-neutral-700 text-neutral-300'}`}>
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
