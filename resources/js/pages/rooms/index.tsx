import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
];

interface RoomType { id: number; name: string; base_price: number; capacity: number; amenities: string[] }
interface Room {
    id: number; room_number: string; floor: number;
    status: 'available' | 'maintenance';
    display_status: 'available' | 'occupied' | 'maintenance';
    notes: string | null;
    room_type: { id: number; name: string; base_price: number; capacity: number; amenities: string[] };
}

interface Props { rooms: Room[]; roomTypes: RoomType[] }

const DISPLAY_STATUS = {
    available: { label: 'Available', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' },
    occupied: { label: 'Occupied', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' },
    maintenance: { label: 'Maintenance', cls: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' },
};

function fmt(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function RoomsIndex({ rooms, roomTypes }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const { data, setData, post, processing, errors, reset } = useForm({
        room_type_id: '',
        room_number: '',
        floor: '1',
        status: 'available' as 'available' | 'maintenance',
        notes: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/rooms', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    const handleStatusChange = (roomId: number, status: string, notes: string) => {
        router.patch(`/rooms/${roomId}`, { status, notes });
    };

    const handleDelete = (roomId: number, num: string) => {
        if (!confirm(`Delete room #${num}?`)) return;
        router.delete(`/rooms/${roomId}`);
    };

    // Group rooms by floor
    const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Room Management" />
            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Room Management</h1>
                        <p className="text-sm text-muted-foreground">{rooms.length} rooms across {floors.length} floor{floors.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex rounded-lg border border-input overflow-hidden">
                            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>⊞ Grid</button>
                            <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 text-sm ${viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>≡ Table</button>
                        </div>
                        <button onClick={() => setShowCreate((v) => !v)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                            {showCreate ? 'Cancel' : '+ Add Room'}
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3">
                    {Object.entries(DISPLAY_STATUS).map(([k, v]) => (
                        <span key={k} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${v.cls}`}>
                            <span className="h-2 w-2 rounded-full bg-current" /> {v.label}
                        </span>
                    ))}
                </div>

                {/* Create Form */}
                {showCreate && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-5 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        <h2 className="mb-4 font-semibold">Add New Room</h2>
                        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Room Type *</label>
                                <select value={data.room_type_id} onChange={(e) => setData('room_type_id', e.target.value)}
                                    className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none ${errors.room_type_id ? 'border-red-500' : 'border-input'}`}>
                                    <option value="">Select type…</option>
                                    {roomTypes.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name} — {fmt(t.base_price)}/night</option>
                                    ))}
                                </select>
                                {errors.room_type_id && <p className="text-xs text-red-600">{errors.room_type_id}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Room Number *</label>
                                <input type="text" value={data.room_number} onChange={(e) => setData('room_number', e.target.value)} placeholder="e.g. 101"
                                    className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none ${errors.room_number ? 'border-red-500' : 'border-input'}`} />
                                {errors.room_number && <p className="text-xs text-red-600">{errors.room_number}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Floor *</label>
                                <input type="number" min={1} max={50} value={data.floor} onChange={(e) => setData('floor', e.target.value)}
                                    className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none ${errors.floor ? 'border-red-500' : 'border-input'}`} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Status *</label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value as 'available' | 'maintenance')}
                                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none">
                                    <option value="available">Available</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex items-end sm:col-span-2 lg:col-span-3">
                                <input type="text" value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Notes (optional)" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none" />
                            </div>
                            <div className="flex items-end">
                                <button type="submit" disabled={processing} className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                                    {processing ? 'Adding…' : 'Add Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && floors.map((floor) => {
                    const floorRooms = rooms.filter((r) => r.floor === floor);
                    return (
                        <div key={floor}>
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Floor {floor}</h2>
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {floorRooms.map((room) => {
                                    const ds = DISPLAY_STATUS[room.display_status];
                                    return (
                                        <div key={room.id} className="group rounded-xl border border-sidebar-border/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-sidebar-border dark:bg-sidebar">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-xl font-bold">#{room.room_number}</span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ds.cls}`}>{ds.label}</span>
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground">{room.room_type.name}</p>
                                            <p className="text-xs text-muted-foreground">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(room.room_type.base_price)}/night</p>
                                            {room.room_type.amenities?.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {room.room_type.amenities.slice(0, 3).map((a: string) => (
                                                        <span key={a} className="rounded bg-muted px-1.5 py-0.5 text-xs">{a}</span>
                                                    ))}
                                                    {room.room_type.amenities.length > 3 && (
                                                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs">+{room.room_type.amenities.length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                            {room.notes && <p className="mt-2 text-xs italic text-muted-foreground">{room.notes}</p>}
                                            <div className="mt-3 flex gap-1.5 border-t border-sidebar-border/40 pt-3 dark:border-sidebar-border">
                                                {room.status === 'available' ? (
                                                    <button onClick={() => handleStatusChange(room.id, 'maintenance', room.notes ?? '')}
                                                        className="flex-1 rounded-md bg-amber-100 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200">
                                                        → Maintenance
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleStatusChange(room.id, 'available', '')}
                                                        className="flex-1 rounded-md bg-emerald-100 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-200">
                                                        → Available
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(room.id, room.room_number)}
                                                    className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-200">
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Table View */}
                {viewMode === 'table' && (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-sidebar-border/50 text-left text-xs font-semibold uppercase text-muted-foreground">
                                        <th className="px-5 py-3">Room</th>
                                        <th className="px-5 py-3">Type</th>
                                        <th className="px-5 py-3">Floor</th>
                                        <th className="px-5 py-3">Rate/Night</th>
                                        <th className="px-5 py-3">Amenities</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => {
                                        const ds = DISPLAY_STATUS[room.display_status];
                                        return (
                                            <tr key={room.id} className="border-b border-sidebar-border/30 last:border-0 hover:bg-muted/30">
                                                <td className="px-5 py-3 font-bold">#{room.room_number}</td>
                                                <td className="px-5 py-3">{room.room_type.name}</td>
                                                <td className="px-5 py-3">{room.floor}</td>
                                                <td className="px-5 py-3">{fmt(room.room_type.base_price)}</td>
                                                <td className="px-5 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {room.room_type.amenities?.slice(0, 3).map((a: string) => (
                                                            <span key={a} className="rounded bg-muted px-1.5 py-0.5 text-xs">{a}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${ds.cls}`}>{ds.label}</span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {room.status === 'available' ? (
                                                            <button onClick={() => handleStatusChange(room.id, 'maintenance', room.notes ?? '')} className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200">Maintenance</button>
                                                        ) : (
                                                            <button onClick={() => handleStatusChange(room.id, 'available', '')} className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-200">Restore</button>
                                                        )}
                                                        <button onClick={() => handleDelete(room.id, room.room_number)} className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800 hover:bg-red-200">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
