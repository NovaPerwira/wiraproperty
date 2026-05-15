import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Availability() {
    const { rooms, bookings, blocks, month, year, roomId } =
        usePage<any>().props;
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        room_id: roomId || '',
        start_date: '',
        end_date: '',
        reason: '',
        type: 'block',
        notes: '',
    });

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/admin/cms/availability',
            { month, year, room_id: e.target.value },
            { preserveState: true },
        );
    };

    const handleMonthChange = (m: number, y: number) => {
        router.get(
            '/admin/cms/availability',
            { month: m, year: y, room_id: roomId },
            { preserveState: true },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cms/availability/blocks', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteBlock = (id: number) => {
        if (confirm('Remove this block/maintenance?')) {
            router.delete(`/admin/cms/availability/blocks/${id}`);
        }
    };

    const currentMonth = new Date(year, month - 1, 1);
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                {
                    title: 'Availability Blocks',
                    href: '/admin/cms/availability',
                },
            ]}
        >
            <Head title="Availability Blocks | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Room Block & Maintenance
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <path d="m9 16 2 2 4-4"></path>
                        </svg>
                        Add Block Date
                    </button>
                </div>

                <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-sidebar-border pb-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    handleMonthChange(
                                        month === 1 ? 12 : month - 1,
                                        month === 1 ? year - 1 : year,
                                    )
                                }
                                className="rounded border p-2 hover:bg-muted"
                            >
                                ←
                            </button>
                            <div className="flex items-center px-4 text-lg font-bold">
                                {monthName} {year}
                            </div>
                            <button
                                onClick={() =>
                                    handleMonthChange(
                                        month === 12 ? 1 : month + 1,
                                        month === 12 ? year + 1 : year,
                                    )
                                }
                                className="rounded border p-2 hover:bg-muted"
                            >
                                →
                            </button>
                        </div>

                        <div>
                            <select
                                value={roomId || ''}
                                onChange={handleFilter}
                                className="min-w-[200px] rounded border border-sidebar-border bg-transparent p-2 text-sm"
                            >
                                <option value="">All Rooms</option>
                                {rooms.map((r: any) => (
                                    <option key={r.id} value={r.id}>
                                        Room #{r.room_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Current Blocks List */}
                        <div>
                            <h2 className="mb-3 flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
                                🚧 Active Blocks & Maintenance
                            </h2>
                            <div className="flex flex-col gap-3">
                                {blocks.map((b: any) => (
                                    <div
                                        key={b.id}
                                        className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 font-bold">
                                                {b.room
                                                    ? `Room #${b.room.room_number}`
                                                    : 'All Rooms'}
                                                <span className="rounded bg-red-200 px-1.5 text-[10px] text-red-800 uppercase dark:bg-red-900 dark:text-red-200">
                                                    {b.type}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-sm text-red-800/80 dark:text-red-300/80">
                                                {b.start_date} to {b.end_date}
                                            </div>
                                            <div className="mt-0.5 text-xs text-red-800/60 dark:text-red-300/60">
                                                {b.reason ||
                                                    'No reason provided'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteBlock(b.id)}
                                            className="rounded-lg bg-white p-2 text-xs font-medium text-red-600 shadow-sm hover:text-red-800 dark:bg-black/20"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {blocks.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-sidebar-border p-6 text-center text-sm text-muted-foreground">
                                        No blocks this month.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Bookings context */}
                        <div>
                            <h2 className="mb-3 flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                                📅 Confirmed Bookings
                            </h2>
                            <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto pr-2">
                                {bookings.map((b: any) => (
                                    <div
                                        key={b.id}
                                        className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm dark:border-indigo-900/30 dark:bg-indigo-900/10"
                                    >
                                        <div className="flex justify-between font-bold">
                                            <span>
                                                Room #{b.room?.room_number}
                                            </span>
                                            <span className="text-indigo-600 dark:text-indigo-400">
                                                {b.status}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex justify-between text-indigo-900/70 dark:text-indigo-300/70">
                                            <span>
                                                {b.guest?.name || 'Guest'}
                                            </span>
                                            <span>
                                                {b.check_in_date} →{' '}
                                                {b.check_out_date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {bookings.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-sidebar-border p-6 text-center text-sm text-muted-foreground">
                                        No bookings this month.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-sidebar">
                        <div className="flex items-center justify-between border-b border-sidebar-border bg-red-50 p-5 dark:bg-red-900/20">
                            <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
                                Add Date Block
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                &times;
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 p-5"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-medium">
                                    Room to Block
                                </label>
                                <select
                                    value={data.room_id}
                                    onChange={(e) =>
                                        setData('room_id', e.target.value)
                                    }
                                    className="w-full rounded border bg-transparent p-2 text-sm"
                                >
                                    <option value="">
                                        All Rooms (Full Closure)
                                    </option>
                                    {rooms.map((r: any) => (
                                        <option key={r.id} value={r.id}>
                                            Room #{r.room_number}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Start Date
                                    </label>
                                    <input
                                        required
                                        type="date"
                                        value={data.start_date}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border bg-transparent p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        End Date
                                    </label>
                                    <input
                                        required
                                        type="date"
                                        value={data.end_date}
                                        min={
                                            data.start_date ||
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        onChange={(e) =>
                                            setData('end_date', e.target.value)
                                        }
                                        className="w-full rounded border bg-transparent p-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Type
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) =>
                                            setData('type', e.target.value)
                                        }
                                        className="w-full rounded border bg-transparent p-2 text-sm"
                                    >
                                        <option value="block">
                                            General Block
                                        </option>
                                        <option value="maintenance">
                                            Maintenance
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Reason (Short)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.reason}
                                        onChange={(e) =>
                                            setData('reason', e.target.value)
                                        }
                                        placeholder="e.g. Paint job"
                                        className="w-full rounded border bg-transparent p-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
                                ⚠️ <b>Warning:</b> Guests will not be able to
                                book the selected room(s) during these dates on
                                the public website.
                            </div>

                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded border px-4 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    Block Dates
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
