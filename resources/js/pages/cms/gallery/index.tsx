import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Gallery() {
    const { images, categories, filters, rooms } = usePage<any>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        images: [] as File[],
        category: 'general',
        room_id: '',
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cms/gallery', {
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const deleteImage = (id: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(`/admin/cms/gallery/${id}`, { preserveScroll: true });
        }
    };

    const filterCategory = (category: string) => {
        router.get(
            '/admin/cms/gallery',
            { category: category === 'all' ? '' : category },
            { preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'Gallery', href: '/admin/cms/gallery' },
            ]}
        >
            <Head title="Gallery | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gallery Management</h1>
                </div>

                {/* Upload Section */}
                <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                    <h2 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                        Upload Images
                    </h2>
                    <form
                        onSubmit={handleUpload}
                        className="flex flex-wrap items-end gap-4"
                    >
                        <div className="w-full min-w-[200px] flex-1 md:w-auto">
                            <label className="mb-1.5 block text-xs font-medium">
                                Select Files (Max 8MB each)
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) =>
                                    setData(
                                        'images',
                                        Array.from(e.target.files || []),
                                    )
                                }
                                className="block w-full rounded-lg border border-sidebar-border text-sm file:mr-4 file:rounded-l-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:bg-black/20 dark:file:bg-indigo-900/50 dark:file:text-indigo-300"
                            />
                            {errors.images && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.images}
                                </p>
                            )}
                        </div>
                        <div className="w-full md:w-48">
                            <label className="mb-1.5 block text-xs font-medium">
                                Category
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                className="w-full rounded-lg border border-sidebar-border px-3 py-2 text-sm dark:bg-black/20"
                            >
                                {categories.map((c: string) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {data.category === 'room' && (
                            <div className="w-full md:w-48">
                                <label className="mb-1.5 block text-xs font-medium">
                                    Link to Room
                                </label>
                                <select
                                    value={data.room_id}
                                    onChange={(e) =>
                                        setData('room_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-sidebar-border px-3 py-2 text-sm dark:bg-black/20"
                                >
                                    <option value="">None</option>
                                    {rooms.map((r: any) => (
                                        <option key={r.id} value={r.id}>
                                            Room #{r.room_number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={processing || data.images.length === 0}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                </div>

                {/* Filter & Grid */}
                <div className="flex gap-2 overflow-x-auto border-b border-sidebar-border pb-2">
                    <button
                        onClick={() => filterCategory('all')}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium ${!filters?.category ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-muted text-muted-foreground'}`}
                    >
                        All
                    </button>
                    {categories.map((c: string) => (
                        <button
                            key={c}
                            onClick={() => filterCategory(c)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${filters?.category === c ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-muted text-muted-foreground'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {images.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            No images found in this category.
                        </div>
                    ) : (
                        images.data.map((img: any) => (
                            <div
                                key={img.id}
                                className="group relative aspect-square overflow-hidden rounded-xl border border-sidebar-border bg-muted/20"
                            >
                                <img
                                    src={img.url}
                                    alt={img.title || 'Gallery image'}
                                    className="h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex items-start justify-between">
                                        <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white capitalize backdrop-blur-md">
                                            {img.category}
                                        </span>
                                        <button
                                            onClick={() => deleteImage(img.id)}
                                            className="rounded bg-red-500/80 p-1.5 text-white backdrop-blur-md hover:bg-red-500"
                                            title="Delete"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>

                                    {img.room && (
                                        <div className="text-xs font-medium text-white">
                                            Room #{img.room.room_number}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination placeholder if needed */}
                {images.last_page > 1 && (
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Page {images.current_page} of {images.last_page}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
