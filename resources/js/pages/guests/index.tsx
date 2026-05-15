import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from 'react-i18next';

interface Guest {
    id: number;
    name: string;
    email: string;
    phone: string;
    nationality: string;
    preferences: Record<string, string> | null;
    is_blacklisted: boolean;
    total_bookings: number;
    total_spend: number;
    created_at: string;
}

interface Stats {
    total: number;
    blacklisted: number;
    high_spend: number;
}

interface PageProps {
    guests: {
        data: Guest[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: Stats;
    filters: Record<string, string>;
    flash?: { success?: string };
    [key: string]: unknown;
}

const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(n);

export default function GuestsIndex() {
    const { t } = useTranslation();
    const { guests, stats, filters, flash } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [blacklisted, setBlacklisted] = useState(filters.blacklisted ?? '');

    const applyFilters = () => {
        router.get(
            '/admin/guests',
            { search, blacklisted },
            { preserveState: true, replace: true },
        );
    };

    const handleSort = (col: string) => {
        const newDir =
            filters.sort === col && filters.dir === 'asc' ? 'desc' : 'asc';
        router.get(
            '/admin/guests',
            { ...filters, sort: col, dir: newDir },
            { preserveState: true, replace: true },
        );
    };

    const SortIcon = ({ col }: { col: string }) => {
        if (filters.sort !== col)
            return <span className="ml-1 opacity-30">↕</span>;
        return (
            <span className="ml-1 text-indigo-400">
                {filters.dir === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Guest Database', href: '/guests' }]}>
            <Head title="Guest Database" />

            <div className="space-y-6 p-6">
                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {t('guests.title')}
                        </h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            Profil tamu, riwayat menginap & preferensi
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: 'Total Tamu',
                            value: stats.total,
                            icon: '👥',
                            color: 'from-indigo-600 to-indigo-800',
                        },
                        {
                            label: 'High Spender (≥5 Jt)',
                            value: stats.high_spend,
                            icon: '💎',
                            color: 'from-amber-500 to-amber-700',
                        },
                        {
                            label: 'Blacklisted',
                            value: stats.blacklisted,
                            icon: '🚫',
                            color: 'from-rose-600 to-rose-800',
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className={`rounded-2xl bg-gradient-to-br ${s.color} flex items-center gap-4 p-4 shadow-lg`}
                        >
                            <span className="text-3xl">{s.icon}</span>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {s.value}
                                </div>
                                <div className="text-sm text-white/70">
                                    {s.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Cari nama, email, telp, ID..."
                        className="min-w-[220px] flex-1 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <select
                        value={blacklisted}
                        onChange={(e) => {
                            setBlacklisted(e.target.value);
                            router.get(
                                '/admin/guests',
                                {
                                    ...filters,
                                    blacklisted: e.target.value,
                                    search,
                                },
                                { preserveState: true, replace: true },
                            );
                        }}
                        className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="">Semua Status</option>
                        <option value="0">Aktif</option>
                        <option value="1">Blacklisted</option>
                    </select>
                    <button
                        onClick={applyFilters}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                        Cari
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left text-neutral-400">
                                    {[
                                        ['name', t('guests.name')],
                                        ['email', t('guests.email')],
                                        [
                                            'total_bookings',
                                            t('guests.bookings'),
                                        ],
                                        ['total_spend', 'Total Spend'],
                                    ].map(([col, label]) => (
                                        <th
                                            key={col}
                                            onClick={() => handleSort(col)}
                                            className="cursor-pointer px-4 py-3 font-medium transition-colors hover:text-white"
                                        >
                                            {label as string}
                                            <SortIcon col={col} />
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 font-medium">
                                        Nacionalitas
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('common.status')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('common.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-12 text-center text-neutral-500"
                                        >
                                            Tidak ada tamu ditemukan.
                                        </td>
                                    </tr>
                                )}
                                {guests.data.map((g) => (
                                    <tr
                                        key={g.id}
                                        className="border-b border-neutral-800/50 transition-colors hover:bg-neutral-800/40"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                                    {g.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {g.name}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        {g.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-400">
                                            {g.email}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="rounded-full bg-indigo-900/50 px-2 py-0.5 text-xs font-medium text-indigo-300">
                                                {g.total_bookings}x
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-emerald-400">
                                            {formatIDR(g.total_spend)}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-neutral-400">
                                            {g.nationality}
                                        </td>
                                        <td className="px-4 py-3">
                                            {g.is_blacklisted ? (
                                                <span className="rounded-full bg-rose-900/50 px-2 py-0.5 text-xs font-medium text-rose-300">
                                                    🚫 Blacklisted
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-emerald-900/50 px-2 py-0.5 text-xs font-medium text-emerald-300">
                                                    ✓ Aktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/guests/${g.id}`}
                                                className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                                            >
                                                Lihat Profil →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {guests.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-3">
                            <span className="text-xs text-neutral-500">
                                {guests.from}–{guests.to} dari {guests.total}{' '}
                                tamu
                            </span>
                            <div className="flex gap-1">
                                {guests.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                  ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                                                  : 'cursor-not-allowed text-neutral-600'
                                        }`}
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
