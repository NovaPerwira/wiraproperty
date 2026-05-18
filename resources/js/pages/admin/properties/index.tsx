import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit2, Trash2, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegionOption {
    value: string;
    label: string;
}

interface Property {
    id: number;
    name: string;
    category: string;
    region: string | null;
    location: string;
    price_formatted: string;
    size: string;
    beds: number | null;
    baths: number | null;
    zoning: string;
    rating: number;
    tag: string;
    main_image: string;
    is_active: boolean;
}

interface Props {
    category: string;
    title: string;
    properties: Property[];
    regions: RegionOption[];
}

const REGION_LABELS: Record<string, string> = {
    bali: '🌴 Bali',
    lombok: '🏔️ Lombok / Luar Bali',
};

export default function PropertiesIndex({ category, title, properties, regions }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const isVilla = category === 'villa';
    const isTanah = category === 'tanah';
    const hasRegions = isVilla && regions.length > 0;

    const { data, setData, post, patch, reset, errors, processing } = useForm({
        name: '',
        category: category,
        region: '' as string,
        location: '',
        price_formatted: '',
        size: '',
        beds: '',
        baths: '',
        zoning: '',
        rating: 5.0 as number,
        tag: '',
        main_image: '',
        is_active: true,
    });

    const openCreateDialog = () => {
        reset();
        setData('category', category);
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (prop: Property) => {
        setData({
            name: prop.name || '',
            category: prop.category || category,
            region: prop.region || '',
            location: prop.location || '',
            price_formatted: prop.price_formatted || '',
            size: prop.size || '',
            beds: prop.beds?.toString() || '',
            baths: prop.baths?.toString() || '',
            zoning: prop.zoning || '',
            rating: prop.rating || 5.0,
            tag: prop.tag || '',
            main_image: prop.main_image || '',
            is_active: prop.is_active,
        });
        setEditingId(prop.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            patch(`/admin/properties/${editingId}`, {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            post(`/admin/properties`, {
                onSuccess: () => setIsDialogOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this property?')) {
            router.delete(`/admin/properties/${id}`);
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: `${title} Management`, href: `/admin/properties/${category}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${title} Management`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{title} Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage all {title.toLowerCase()} listings. Changes reflect on the public website immediately.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus size={16} /> Add {title}
                    </Button>
                </div>

                {/* Region info banner for villa */}
                {isVilla && (
                    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/20">
                        <Globe size={18} className="mt-0.5 shrink-0 text-amber-600" />
                        <div className="text-sm text-amber-800 dark:text-amber-300">
                            <span className="font-semibold">Villa Region:</span> Set each villa's region to control which page it appears on.{' '}
                            <span className="font-medium">🌴 Bali</span> → halaman <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">/villa/bali</code> ·{' '}
                            <span className="font-medium">🏔️ Lombok</span> → halaman <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">/villa/lombok</code>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/50 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-5 py-3">Name</th>
                                    {isVilla && <th className="px-5 py-3">Region / Page</th>}
                                    <th className="px-5 py-3">Location</th>
                                    <th className="px-5 py-3">Price</th>
                                    {isTanah ? (
                                        <th className="px-5 py-3">Zoning</th>
                                    ) : !isVilla ? (
                                        <th className="px-5 py-3">Beds / Baths</th>
                                    ) : (
                                        <th className="px-5 py-3">Beds / Baths</th>
                                    )}
                                    <th className="px-5 py-3">Size</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-12 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-3xl">🏠</span>
                                                <p>No {title.toLowerCase()} listings yet.</p>
                                                <button
                                                    onClick={openCreateDialog}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    + Add the first one
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    properties.map((prop) => (
                                        <tr
                                            key={prop.id}
                                            className="border-b border-sidebar-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-5 py-3 font-medium">
                                                {prop.name}
                                                {prop.tag && (
                                                    <span className="ml-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                                        {prop.tag}
                                                    </span>
                                                )}
                                            </td>
                                            {isVilla && (
                                                <td className="px-5 py-3">
                                                    {prop.region ? (
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            prop.region === 'bali'
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                : 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300'
                                                        }`}>
                                                            {REGION_LABELS[prop.region] ?? prop.region}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-red-500 font-medium">⚠ No region set</span>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin size={13} />
                                                    {prop.location || '—'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-emerald-700 dark:text-emerald-400">
                                                {prop.price_formatted || '—'}
                                            </td>
                                            {isTanah ? (
                                                <td className="px-5 py-3">{prop.zoning || '—'}</td>
                                            ) : (
                                                <td className="px-5 py-3">
                                                    {prop.beds != null ? `${prop.beds} 🛏` : '—'}{' '}
                                                    {prop.baths != null ? `/ ${prop.baths} 🚿` : ''}
                                                </td>
                                            )}
                                            <td className="px-5 py-3">{prop.size || '—'}</td>
                                            <td className="px-5 py-3">
                                                {prop.is_active ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(prop)}>
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(prop.id)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? `Edit ${title}` : `Add New ${title}`}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">

                        {/* Name */}
                        <div className="col-span-2 space-y-1.5">
                            <Label>Name / Title *</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Region — only for Villa */}
                        {hasRegions && (
                            <div className="col-span-2 space-y-1.5">
                                <Label>
                                    Region / Halaman *
                                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                                        (menentukan villa muncul di halaman mana)
                                    </span>
                                </Label>
                                <select
                                    value={data.region}
                                    onChange={(e) => setData('region', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    required
                                >
                                    <option value="">— Pilih Region —</option>
                                    {regions.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                {data.region && (
                                    <p className="text-xs text-muted-foreground">
                                        {data.region === 'bali'
                                            ? '✅ Villa ini akan tampil di halaman /villa/bali'
                                            : '✅ Villa ini akan tampil di halaman /villa/lombok'}
                                    </p>
                                )}
                                {errors.region && <p className="text-xs text-red-500">{errors.region}</p>}
                            </div>
                        )}

                        {/* Location */}
                        <div className="space-y-1.5">
                            <Label>Location</Label>
                            <Input
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="e.g. Canggu, Bali"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <Label>Price (Formatted)</Label>
                            <Input
                                value={data.price_formatted}
                                onChange={(e) => setData('price_formatted', e.target.value)}
                                placeholder="e.g. Rp 12.000.000 /malam"
                            />
                        </div>

                        {/* Size */}
                        <div className="space-y-1.5">
                            <Label>Size</Label>
                            <Input
                                value={data.size}
                                onChange={(e) => setData('size', e.target.value)}
                                placeholder="e.g. 500m²"
                            />
                        </div>

                        {/* Tag */}
                        <div className="space-y-1.5">
                            <Label>Tag / Badge</Label>
                            <Input
                                value={data.tag}
                                onChange={(e) => setData('tag', e.target.value)}
                                placeholder="e.g. Best Seller, Luxury"
                            />
                        </div>

                        {/* Beds & Baths (non-tanah) */}
                        {!isTanah && (
                            <>
                                <div className="space-y-1.5">
                                    <Label>Bedrooms</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={data.beds}
                                        onChange={(e) => setData('beds', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Bathrooms</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={data.baths}
                                        onChange={(e) => setData('baths', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {/* Zoning (tanah only) */}
                        {isTanah && (
                            <div className="space-y-1.5">
                                <Label>Zoning (Peruntukan)</Label>
                                <Input
                                    value={data.zoning}
                                    onChange={(e) => setData('zoning', e.target.value)}
                                    placeholder="e.g. Pariwisata, Perumahan, Komersial"
                                />
                            </div>
                        )}

                        {/* Rating */}
                        <div className="space-y-1.5">
                            <Label>Rating (0–5)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                max={5}
                                min={0}
                                value={data.rating}
                                onChange={(e) =>
                                    setData('rating', parseFloat(e.target.value) || 5)
                                }
                            />
                        </div>

                        {/* Main Image */}
                        <div className="col-span-2 space-y-1.5">
                            <Label>Main Image URL</Label>
                            <Input
                                value={data.main_image}
                                onChange={(e) => setData('main_image', e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                            />
                            {data.main_image && (
                                <img
                                    src={data.main_image}
                                    alt="Preview"
                                    className="mt-2 h-32 w-full rounded-lg object-cover"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            )}
                        </div>

                        {/* Active toggle */}
                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-primary shadow-sm"
                            />
                            <Label htmlFor="is_active">
                                Active — visible on public website
                            </Label>
                        </div>

                        <DialogFooter className="col-span-2 mt-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving…'
                                    : editingId
                                      ? 'Save Changes'
                                      : `Add ${title}`}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
