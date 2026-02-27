import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: 'New Booking', href: '/bookings/create' },
];

interface RoomOption {
    id: number;
    room_number: string;
    floor: number;
    room_type: string;
    base_price: number;
}

interface FormData {
    room_id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    guest_address: string;
    check_in_date: string;
    check_out_date: string;
    booking_source: string;
    total_amount: string;
    special_requests: string;
}

function fmt(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

interface Props { rooms: RoomOption[] }

export default function BookingsCreate({ rooms }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        room_id: '',
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        guest_address: '',
        check_in_date: '',
        check_out_date: '',
        booking_source: 'direct',
        total_amount: '0',
        special_requests: '',
    });

    const [nights, setNights] = useState(0);
    const [pricePreview, setPricePreview] = useState(0);

    const selectedRoom = rooms.find((r) => r.id === Number(data.room_id));

    // Auto-calculate total when dates or room change
    useEffect(() => {
        if (data.check_in_date && data.check_out_date && data.check_in_date < data.check_out_date) {
            const cin = new Date(data.check_in_date);
            const cout = new Date(data.check_out_date);
            const n = Math.round((cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24));
            const price = selectedRoom ? selectedRoom.base_price * n : 0;
            setNights(n);
            setPricePreview(price);
            setData('total_amount', String(price));
        } else {
            setNights(0);
            setPricePreview(0);
        }
    }, [data.check_in_date, data.check_out_date, data.room_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/bookings', { onSuccess: () => reset() });
    };

    const Field = ({ label, name, children }: { label: string; name: keyof FormData; children: React.ReactNode }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {errors[name] && <p className="text-xs text-red-600 dark:text-red-400">{errors[name]}</p>}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Booking" />
            <div className="p-6">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        <div className="border-b border-sidebar-border/70 px-6 py-4 dark:border-sidebar-border">
                            <h1 className="text-xl font-bold">New Booking</h1>
                            <p className="text-sm text-muted-foreground">Fill in guest and room details below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Room selector */}
                            <div className="mb-6 rounded-lg border border-sidebar-border/50 bg-muted/30 p-4 dark:border-sidebar-border">
                                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Room Selection</h2>
                                <Field label="Room *" name="room_id">
                                    <select
                                        value={data.room_id}
                                        onChange={(e) => setData('room_id', e.target.value)}
                                        className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.room_id ? 'border-red-500' : 'border-input'}`}
                                    >
                                        <option value="">Select a room…</option>
                                        {rooms.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                #{r.room_number} — {r.room_type} (Floor {r.floor}) • {fmt(r.base_price)}/night
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {selectedRoom && (
                                    <div className="mt-3 flex flex-wrap gap-4">
                                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm dark:border-blue-800 dark:bg-blue-900/20">
                                            <span className="font-semibold text-blue-700 dark:text-blue-300">Type: </span>
                                            {selectedRoom.room_type}
                                        </div>
                                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm dark:border-emerald-800 dark:bg-emerald-900/20">
                                            <span className="font-semibold text-emerald-700 dark:text-emerald-300">Rate: </span>
                                            {fmt(selectedRoom.base_price)}/night
                                        </div>
                                        {nights > 0 && (
                                            <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm dark:border-indigo-800 dark:bg-indigo-900/20">
                                                <span className="font-semibold text-indigo-700 dark:text-indigo-300">{nights} night{nights !== 1 ? 's' : ''} → </span>
                                                <span className="font-bold">{fmt(pricePreview)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Stay Dates */}
                            <div className="mb-6 rounded-lg border border-sidebar-border/50 bg-muted/30 p-4 dark:border-sidebar-border">
                                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Stay Dates</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Check-in Date *" name="check_in_date">
                                        <input type="date" min={today} value={data.check_in_date}
                                            onChange={(e) => setData('check_in_date', e.target.value)}
                                            className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.check_in_date ? 'border-red-500' : 'border-input'}`} />
                                    </Field>
                                    <Field label="Check-out Date *" name="check_out_date">
                                        <input type="date" min={data.check_in_date || today} value={data.check_out_date}
                                            onChange={(e) => setData('check_out_date', e.target.value)}
                                            className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.check_out_date ? 'border-red-500' : 'border-input'}`} />
                                    </Field>
                                </div>
                            </div>

                            {/* Guest Details */}
                            <div className="mb-6 rounded-lg border border-sidebar-border/50 bg-muted/30 p-4 dark:border-sidebar-border">
                                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Guest Details</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Full Name *" name="guest_name">
                                        <input type="text" value={data.guest_name} onChange={(e) => setData('guest_name', e.target.value)} placeholder="Guest full name" maxLength={255}
                                            className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.guest_name ? 'border-red-500' : 'border-input'}`} />
                                    </Field>
                                    <Field label="Email *" name="guest_email">
                                        <input type="email" value={data.guest_email} onChange={(e) => setData('guest_email', e.target.value)} placeholder="guest@email.com"
                                            className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.guest_email ? 'border-red-500' : 'border-input'}`} />
                                    </Field>
                                    <Field label="Phone *" name="guest_phone">
                                        <input type="tel" value={data.guest_phone} onChange={(e) => setData('guest_phone', e.target.value)} placeholder="08xx-xxxx-xxxx"
                                            className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.guest_phone ? 'border-red-500' : 'border-input'}`} />
                                    </Field>
                                    <Field label="Address" name="guest_address">
                                        <input type="text" value={data.guest_address} onChange={(e) => setData('guest_address', e.target.value)} placeholder="Guest address (optional)"
                                            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                                    </Field>
                                </div>
                            </div>

                            {/* Booking Info */}
                            <div className="mb-6 rounded-lg border border-sidebar-border/50 bg-muted/30 p-4 dark:border-sidebar-border">
                                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Booking Info</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Booking Source *" name="booking_source">
                                        <select value={data.booking_source} onChange={(e) => setData('booking_source', e.target.value)}
                                            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                                            <option value="direct">Direct</option>
                                            <option value="ota">OTA (Online Travel Agent)</option>
                                            <option value="walk_in">Walk-in</option>
                                        </select>
                                    </Field>
                                    <Field label="Total Amount (IDR) *" name="total_amount">
                                        <input type="number" min={0} step={1000} value={data.total_amount} onChange={(e) => setData('total_amount', e.target.value)}
                                            className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.total_amount ? 'border-red-500' : 'border-input'}`} />
                                        <p className="text-xs text-muted-foreground">{nights > 0 && selectedRoom ? `Auto-calculated: ${fmt(pricePreview)} (editable)` : 'Select room and dates for auto-calculation'}</p>
                                    </Field>
                                    <div className="sm:col-span-2 flex flex-col gap-1">
                                        <label className="text-sm font-medium">Special Requests</label>
                                        <textarea value={data.special_requests} onChange={(e) => setData('special_requests', e.target.value)}
                                            rows={2} maxLength={1000} placeholder="Any special requests from the guest…"
                                            className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t border-sidebar-border/50 pt-4 dark:border-sidebar-border">
                                <button type="button" onClick={() => router.visit('/bookings')} className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                                <button type="submit" disabled={processing} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                                    {processing ? 'Creating…' : 'Create Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
