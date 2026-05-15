import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, Bed, Star } from 'lucide-react';
import React from 'react';

export default function StaysCms() {
    const { settings, roomTypes } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const { data, setData, patch, processing } = useForm({
        // Hero
        hero_title:       get('hero_title', 'Exquisite Sanctuaries'),
        hero_subtitle:    get('hero_subtitle', 'Discover your perfect getaway. Every room is designed to blend modern luxury with the breathtaking serenity of our surroundings.'),
        hero_image:       get('hero_image', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90'),
        hero_label:       get('hero_label', 'Our Stays'),
        // Rooms section
        rooms_section_title: get('rooms_section_title', 'Our Accommodations'),
        rooms_section_subtitle: get('rooms_section_subtitle', 'Each space is designed to blend Balinese artistry with modern comfort and breathtaking views.'),
        room_cta_label:   get('room_cta_label', 'Reserve'),
        room_per_night:   get('room_per_night', '/ night'),
        // Labels
        label_popular:    get('label_popular', 'Popular'),
        label_cancel:     get('label_cancel', 'Free Cancellation'),
        label_guests:     get('label_guests', 'Guests'),
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); patch('/admin/cms/stays'); };
    const inputCls = 'w-full border border-sidebar-border rounded p-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

    const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
        <div>
            <label className="block text-sm font-semibold mb-1">{label}</label>
            {hint && <p className="text-xs text-muted-foreground mb-1">{hint}</p>}
            {children}
        </div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'Stays Page', href: '/admin/cms/stays' }]}>
            <Head title="Stays Page CMS" />

            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Stays Page</h1>
                        <p className="text-sm text-muted-foreground mt-1">Edit all text & content for the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/stays</code> page.</p>
                    </div>
                    <button onClick={submit} disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-60">
                        <Save size={18} /> Save Changes
                    </button>
                </div>

                <div className="flex flex-col gap-6">

                    {/* ── Hero ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🏨 Hero Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Page Label (e.g. Our Stays)">
                                <input type="text" className={inputCls} value={data.hero_label} onChange={e => setData('hero_label', e.target.value)} />
                            </Field>
                            <Field label="Hero Title">
                                <input type="text" className={inputCls} value={data.hero_title} onChange={e => setData('hero_title', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Hero Subtitle">
                                    <textarea rows={2} className={inputCls} value={data.hero_subtitle} onChange={e => setData('hero_subtitle', e.target.value)} />
                                </Field>
                            </div>
                            <div className="col-span-2">
                                <Field label="Hero Background Image URL">
                                    <input type="text" className={inputCls} value={data.hero_image} onChange={e => setData('hero_image', e.target.value)} />
                                    {data.hero_image && (
                                        <div className="mt-2 relative overflow-hidden rounded-xl border border-sidebar-border" style={{ height: 200 }}>
                                            <img src={data.hero_image} alt="preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/85 flex flex-col items-center justify-center text-white text-center px-4">
                                                <p className="text-xs tracking-[0.3em] uppercase text-white/60 mb-1">{data.hero_label}</p>
                                                <p className="text-xl font-semibold drop-shadow-lg">{data.hero_title}</p>
                                                <p className="text-xs text-white/55 mt-1 line-clamp-2 max-w-xs">{data.hero_subtitle}</p>
                                            </div>
                                        </div>
                                    )}
                                </Field>
                            </div>
                        </div>
                    </section>

                    {/* ── Rooms Section Texts ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🛏 Rooms Section Text</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Section Title">
                                <input type="text" className={inputCls} value={data.rooms_section_title} onChange={e => setData('rooms_section_title', e.target.value)} />
                            </Field>
                            <Field label="Room CTA Button (prefix)" hint="Shows as 'Reserve {Room Name}'">
                                <input type="text" className={inputCls} value={data.room_cta_label} onChange={e => setData('room_cta_label', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Section Subtitle">
                                    <textarea rows={2} className={inputCls} value={data.rooms_section_subtitle} onChange={e => setData('rooms_section_subtitle', e.target.value)} />
                                </Field>
                            </div>
                            <Field label="Price Suffix" hint='Shown after price, e.g. "/ night"'>
                                <input type="text" className={inputCls} value={data.room_per_night} onChange={e => setData('room_per_night', e.target.value)} />
                            </Field>
                            <Field label="Guests Label" hint='Shown as "Up to X {Guests}"'>
                                <input type="text" className={inputCls} value={data.label_guests} onChange={e => setData('label_guests', e.target.value)} />
                            </Field>
                        </div>
                    </section>

                    {/* ── Badge Labels ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🏷 Room Card Badges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="'Popular' Badge Text">
                                <input type="text" className={inputCls} value={data.label_popular} onChange={e => setData('label_popular', e.target.value)} />
                            </Field>
                            <Field label="'Free Cancellation' Badge Text">
                                <input type="text" className={inputCls} value={data.label_cancel} onChange={e => setData('label_cancel', e.target.value)} />
                            </Field>
                        </div>
                    </section>

                    {/* ── Room Types reference ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4 border-b border-sidebar-border pb-2">
                            <h2 className="text-lg font-bold">🛏 Room Types (from Database)</h2>
                            <a href="/admin/rooms" className="text-sm text-indigo-600 hover:underline font-medium">
                                Manage Rooms →
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Room names, prices, and amenities are managed via the Rooms database. To add/edit/remove rooms, use the Rooms manager.
                        </p>
                        {roomTypes && roomTypes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roomTypes.map((rt: any) => (
                                    <div key={rt.id}
                                        className="border border-sidebar-border rounded-lg p-4 bg-gray-50 dark:bg-black/20 flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                                            <Bed size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm truncate">{rt.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{rt.description || 'No description'}</div>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs">
                                                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded px-2 py-0.5 font-medium">
                                                    Rp {Number(rt.base_price).toLocaleString('id-ID')} / night
                                                </span>
                                                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded px-2 py-0.5 font-medium">
                                                    Capacity: {rt.capacity} guests
                                                </span>
                                            </div>
                                            {rt.amenities && rt.amenities.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {(rt.amenities as string[]).slice(0, 4).map((a: string, i: number) => (
                                                        <span key={i} className="flex items-center gap-1 text-[11px] bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5">
                                                            <Star size={10} /> {a}
                                                        </span>
                                                    ))}
                                                    {rt.amenities.length > 4 && (
                                                        <span className="text-[11px] text-muted-foreground">+{rt.amenities.length - 4} more</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground text-sm">
                                No room types found. <a href="/admin/rooms" className="text-indigo-600 hover:underline">Add one here →</a>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
