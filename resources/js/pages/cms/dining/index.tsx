import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import React from 'react';

export default function DiningCms() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const { data, setData, patch, processing } = useForm({
        hero_title:             get('hero_title', 'Culinary Mastery'),
        hero_subtitle:          get('hero_subtitle', 'A celebration of authentic local ingredients fused with international techniques. Each dish is a journey, crafted to elevate your senses.'),
        hero_image:             get('hero_image', 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90'),
        restaurant_label:       get('restaurant_label', 'Signature Dining'),
        restaurant_title:       get('restaurant_title', 'Lumina Pavilion'),
        restaurant_description: get('restaurant_description', 'Open all day, Lumina Pavilion boasts panoramic views of the cascading valley. Our chefs transform fresh morning catches and farm-to-table organic produce into vibrant masterpieces.'),
        restaurant_image:       get('restaurant_image', 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'),
        restaurant_cta:         get('restaurant_cta', 'Reserve a Table'),
        bar_label:              get('bar_label', 'Evening Lounge'),
        bar_title:              get('bar_title', 'The Obsidian Bar'),
        bar_description:        get('bar_description', 'As dusk settles, retreat to The Obsidian Bar. Featuring rare vintages, artisanal spirits, and bespoke cocktails mixed by our award-winning mixologists in a moody, intimate atmosphere.'),
        bar_image:              get('bar_image', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'),
        bar_cta:                get('bar_cta', 'Discover the Spirits'),
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); patch('/admin/cms/dining'); };
    const inputCls = 'w-full border border-sidebar-border rounded p-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div><label className="block text-sm font-semibold mb-1">{label}</label>{children}</div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'Dining Page', href: '/admin/cms/dining' }]}>
            <Head title="Dining Page CMS" />
            <div className="p-6 max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Dining Page</h1>
                        <p className="text-sm text-muted-foreground mt-1">Edit all sections for the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/dining</code> page.</p>
                    </div>
                    <button onClick={submit} disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-60">
                        <Save size={18} /> Save Changes
                    </button>
                </div>

                <div className="flex flex-col gap-6">

                    {/* ── Hero ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🍽️ Hero Section</h2>
                        <div className="flex flex-col gap-4">
                            <Field label="Hero Title">
                                <input type="text" className={inputCls} value={data.hero_title} onChange={e => setData('hero_title', e.target.value)} />
                            </Field>
                            <Field label="Hero Subtitle">
                                <textarea rows={3} className={inputCls} value={data.hero_subtitle} onChange={e => setData('hero_subtitle', e.target.value)} />
                            </Field>
                            <Field label="Hero Background Image URL">
                                <input type="text" className={inputCls} value={data.hero_image} onChange={e => setData('hero_image', e.target.value)} />
                                {data.hero_image && (
                                    <div className="mt-2 relative overflow-hidden rounded-xl border border-sidebar-border" style={{ height: 200 }}>
                                        <img src={data.hero_image} alt="preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85 flex flex-col items-center justify-center text-white text-center px-4">
                                            <p className="text-lg font-semibold drop-shadow-lg">{data.hero_title || 'Hero Title'}</p>
                                            <p className="text-xs text-white/60 mt-1 line-clamp-2">{data.hero_subtitle}</p>
                                        </div>
                                    </div>
                                )}
                            </Field>
                        </div>
                    </section>

                    {/* ── Restaurant ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🌿 Restaurant Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Section Label (e.g. Signature Dining)">
                                <input type="text" className={inputCls} value={data.restaurant_label} onChange={e => setData('restaurant_label', e.target.value)} />
                            </Field>
                            <Field label="Restaurant Name">
                                <input type="text" className={inputCls} value={data.restaurant_title} onChange={e => setData('restaurant_title', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Description">
                                    <textarea rows={3} className={inputCls} value={data.restaurant_description} onChange={e => setData('restaurant_description', e.target.value)} />
                                </Field>
                            </div>
                            <Field label="CTA Button Text">
                                <input type="text" className={inputCls} value={data.restaurant_cta} onChange={e => setData('restaurant_cta', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Section Image URL">
                                    <input type="text" className={inputCls} value={data.restaurant_image} onChange={e => setData('restaurant_image', e.target.value)} />
                                </Field>
                                {data.restaurant_image && (
                                    <img src={data.restaurant_image} alt="Restaurant preview" className="mt-2 w-full h-40 object-cover rounded-lg border border-sidebar-border" />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ── Bar / Lounge ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🍸 Bar & Lounge Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Section Label (e.g. Evening Lounge)">
                                <input type="text" className={inputCls} value={data.bar_label} onChange={e => setData('bar_label', e.target.value)} />
                            </Field>
                            <Field label="Bar / Lounge Name">
                                <input type="text" className={inputCls} value={data.bar_title} onChange={e => setData('bar_title', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Description">
                                    <textarea rows={3} className={inputCls} value={data.bar_description} onChange={e => setData('bar_description', e.target.value)} />
                                </Field>
                            </div>
                            <Field label="CTA Button Text">
                                <input type="text" className={inputCls} value={data.bar_cta} onChange={e => setData('bar_cta', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Section Image URL">
                                    <input type="text" className={inputCls} value={data.bar_image} onChange={e => setData('bar_image', e.target.value)} />
                                </Field>
                                {data.bar_image && (
                                    <img src={data.bar_image} alt="Bar preview" className="mt-2 w-full h-40 object-cover rounded-lg border border-sidebar-border" />
                                )}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
