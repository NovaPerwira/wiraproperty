import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Payment {
    id: number;
    booking_id: number;
    guest_name: string | null;
    guest_email: string | null;
    booking_total: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    paid_at: string | null;
    reference_number: string | null;
    notes: string | null;
    recorded_by: string | null;
}

interface DailyRevenue {
    date: string;
    total: number;
}

interface PageProps {
    [key: string]: unknown;
    payments: {
        data: Payment[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: Record<string, string>;
    todayRevenue: number;
    totalOutstanding: number;
    paidCount: number;
    dailyRevenue: DailyRevenue[];
    flash?: { success?: string };
}

const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-900/50 text-amber-300',
    paid: 'bg-emerald-900/50 text-emerald-300',
    partial: 'bg-blue-900/50 text-blue-300',
    refunded: 'bg-rose-900/50 text-rose-300',
};

const METHOD_LABELS: Record<string, string> = {
    cash: '💵 Cash',
    transfer: '🏦 Transfer',
    credit_card: '💳 Kartu Kredit',
    debit_card: '💳 Kartu Debit',
    ota: '🌐 OTA',
};

interface AddPaymentFormState {
    booking_id: string;
    amount: string;
    payment_method: string;
    payment_status: string;
    reference_number: string;
    notes: string;
}

export default function PaymentsIndex() {
    const { payments, filters, todayRevenue, totalOutstanding, paidCount, dailyRevenue, flash } = usePage<PageProps>().props;

    const [statusF, setStatusF] = useState(filters.status ?? '');
    const [methodF, setMethodF] = useState(filters.method ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [showAdd, setShowAdd] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [form, setForm] = useState<AddPaymentFormState>({
        booking_id: '', amount: '', payment_method: 'transfer',
        payment_status: 'paid', reference_number: '', notes: '',
    });

    const applyFilters = () => {
        router.get('/admin/payments', { status: statusF, method: methodF, date_from: dateFrom, date_to: dateTo }, { preserveState: true, replace: true });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/payments', form as unknown as Record<string, string>, {
            onSuccess: () => { setShowAdd(false); setForm({ booking_id: '', amount: '', payment_method: 'transfer', payment_status: 'paid', reference_number: '', notes: '' }); },
        });
    };

    const maxRevenue = Math.max(...dailyRevenue.map(d => d.total), 1);

    return (
        <AppLayout breadcrumbs={[{ title: 'Payment Tracking', href: '/payments' }]}>
            <Head title="Payment Tracking" />

            <div className="p-6 space-y-6">
                {flash?.success && (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Payment Tracking</h1>
                        <p className="text-sm text-neutral-400 mt-1">Status pembayaran, metode, dan laporan harian</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowChart(!showChart)} className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors">
                            📊 {showChart ? 'Tutup' : 'Laporan Harian'}
                        </button>
                        <button onClick={() => setShowAdd(!showAdd)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
                            + Catat Pembayaran
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Revenue Hari Ini', value: formatIDR(todayRevenue), icon: '💰', color: 'from-emerald-600 to-teal-700' },
                        { label: 'Outstanding', value: formatIDR(totalOutstanding), icon: '⏳', color: 'from-amber-500 to-orange-700' },
                        { label: 'Total Paid Records', value: paidCount.toString(), icon: '✅', color: 'from-indigo-600 to-blue-800' },
                    ].map((k) => (
                        <div key={k.label} className={`rounded-2xl bg-gradient-to-br ${k.color} p-4 flex items-center gap-4 shadow-lg`}>
                            <span className="text-3xl">{k.icon}</span>
                            <div>
                                <div className="text-xl font-bold text-white">{k.value}</div>
                                <div className="text-sm text-white/70">{k.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Daily Revenue Chart */}
                {showChart && (
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                        <h2 className="text-white font-semibold mb-4">📈 Laporan Revenue 30 Hari Terakhir</h2>
                        <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
                            {dailyRevenue.map((d) => (
                                <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-[24px]" title={`${d.date}: ${formatIDR(d.total)}`}>
                                    <div
                                        className="w-full rounded-t bg-emerald-500 hover:bg-emerald-400 transition-colors cursor-pointer"
                                        style={{ height: `${Math.max(4, (d.total / maxRevenue) * 130)}px` }}
                                    />
                                    <span className="text-[9px] text-neutral-500 rotate-45 origin-left whitespace-nowrap">{d.date.slice(5)}</span>
                                </div>
                            ))}
                            {dailyRevenue.length === 0 && (
                                <p className="text-neutral-500 text-sm w-full text-center">Belum ada data pembayaran.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Add Payment Modal */}
                {showAdd && (
                    <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-5">
                        <h2 className="text-white font-semibold mb-4">+ Catat Pembayaran Baru</h2>
                        <form onSubmit={submitPayment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: 'booking_id', label: 'Booking ID', type: 'number', placeholder: 'ID Booking' },
                                { key: 'amount', label: 'Jumlah (IDR)', type: 'number', placeholder: '500000' },
                                { key: 'reference_number', label: 'Referensi / No. Transfer', type: 'text', placeholder: 'TRF-1234AB' },
                            ].map(({ key, label, type, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-xs text-neutral-400 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        value={form[key as keyof AddPaymentFormState]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">Metode Bayar</label>
                                <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none">
                                    {['cash', 'transfer', 'credit_card', 'debit_card', 'ota'].map(m => (
                                        <option key={m} value={m}>{METHOD_LABELS[m] ?? m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-400 mb-1">Status</label>
                                <select value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })} className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none">
                                    {['pending', 'paid', 'partial', 'refunded'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-neutral-400 mb-1">Catatan</label>
                                <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Opsional..." className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                            </div>
                            <div className="sm:col-span-2 flex gap-3">
                                <button type="submit" className="flex-1 rounded-xl bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">Simpan Pembayaran</button>
                                <button type="button" onClick={() => setShowAdd(false)} className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800 transition-colors">Batal</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-end">
                    {[
                        { value: statusF, setter: setStatusF, options: [['', 'Semua Status'], ['paid', 'Paid'], ['pending', 'Pending'], ['partial', 'Partial'], ['refunded', 'Refunded']] },
                        { value: methodF, setter: setMethodF, options: [['', 'Semua Metode'], ['cash', '💵 Cash'], ['transfer', '🏦 Transfer'], ['credit_card', '💳 Kredit'], ['debit_card', '💳 Debit'], ['ota', '🌐 OTA']] },
                    ].map((f, i) => (
                        <select key={i} value={f.value} onChange={(e) => { f.setter(e.target.value); }} className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
                            {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                    ))}
                    <div className="flex gap-2 items-center">
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        <span className="text-neutral-500 text-sm">–</span>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <button onClick={applyFilters} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">Filter</button>
                </div>

                {/* Payments Table */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-neutral-400 text-left">
                                    <th className="px-4 py-3 font-medium">Tamu / Booking</th>
                                    <th className="px-4 py-3 font-medium">Jumlah</th>
                                    <th className="px-4 py-3 font-medium">Outstanding</th>
                                    <th className="px-4 py-3 font-medium">Metode</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Tanggal</th>
                                    <th className="px-4 py-3 font-medium">Referensi</th>
                                    <th className="px-4 py-3 font-medium">Dicatat Oleh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-10 text-center text-neutral-500">Tidak ada pembayaran ditemukan.</td>
                                    </tr>
                                )}
                                {payments.data.map((p) => {
                                    const outstanding = Math.max(0, p.booking_total - p.amount);
                                    return (
                                        <tr key={p.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-white">{p.guest_name ?? '—'}</div>
                                                <div className="text-neutral-500 text-xs">Booking #{p.booking_id}</div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-emerald-400">{formatIDR(p.amount)}</td>
                                            <td className="px-4 py-3">
                                                {outstanding > 0 ? (
                                                    <span className="text-amber-400 font-medium">{formatIDR(outstanding)}</span>
                                                ) : (
                                                    <span className="text-neutral-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-300 text-xs">{METHOD_LABELS[p.payment_method] ?? p.payment_method}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.payment_status] ?? 'bg-neutral-700 text-neutral-300'}`}>
                                                    {p.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-400 text-xs">{p.paid_at ?? '—'}</td>
                                            <td className="px-4 py-3 text-neutral-500 text-xs font-mono">{p.reference_number ?? '—'}</td>
                                            <td className="px-4 py-3 text-neutral-500 text-xs">{p.recorded_by ?? '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {payments.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-3">
                            <span className="text-xs text-neutral-500">{payments.from}–{payments.to} dari {payments.total}</span>
                            <div className="flex gap-1">
                                {payments.links.map((link, i) => (
                                    <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-3 py-1 text-xs transition-colors ${link.active ? 'bg-emerald-600 text-white' : link.url ? 'text-neutral-400 hover:bg-neutral-800' : 'cursor-not-allowed text-neutral-600'}`}
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
