import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import React from 'react';

const defaultLocations = [
    { text: 'Kedungu Beach', dist: '10 Minutes Drive' },
    { text: 'Tanah Lot Temple', dist: '15 Minutes Drive' },
    { text: 'Canggu Area', dist: '30 Minutes Drive' },
    { text: 'Ngurah Rai Airport', dist: '1.5 Hours Drive' },
];

export default function AboutCms() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const parseLocations = () => {
        try {
            const raw = settings?.locations?.value;
            if (raw) return JSON.parse(raw);
        } catch {}
        return defaultLocations;
    };

    const { data, setData, patch, processing } = useForm({
        hero_title:        get('hero_title', 'The Stayli Vision'),
        hero_subtitle:     get('hero_subtitle', 'Born from a desire to redefine luxury, Stayli bridges the gap between raw natural beauty and uncompromising modern comfort.'),
        hero_image:        get('hero_image', 'https://images.unsplash.com/photo-1542314831-c6a4d1409360?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90'),
        philosophy_para1:  get('philosophy_para1', 'Founded in 2020 by a collective of visionary architects and local artisans, Stayli was constructed with complete respect for the surrounding landscape. Every stone laid, every fixture chosen, reflects our commitment to sustainable elegance.'),
        philosophy_para2:  get('philosophy_para2', 'We believe that true luxury lies in absolute peace—a sanctuary where time slows down, allowing you to reconnect with yourself, your loved ones, and the environment.'),
        location_title:    get('location_title', 'Strategic Haven in Tabanan'),
        location_subtitle: get('location_subtitle', 'Surrounded by the authentic natural grace of Bali, yet entirely accessible from major cultural and geographic landmarks.'),
        location_image:    get('location_image', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'),
        location_map_url:  get('location_map_url', 'https://goo.gl/maps/'),
        locations:         parseLocations(),
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); patch('/admin/cms/about'); };
    const inputCls = 'w-full border border-sidebar-border rounded p-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div><label className="block text-sm font-semibold mb-1">{label}</label>{children}</div>
    );

    const updateLoc = (i: number, field: string, val: string) => {
        const next = [...data.locations];
        next[i] = { ...next[i], [field]: val };
        setData('locations', next);
    };
    const addLoc = () => setData('locations', [...data.locations, { text: 'New Location', dist: '10 Minutes Drive' }]);
    const removeLoc = (i: number) => { const next = [...data.locations]; next.splice(i, 1); setData('locations', next); };

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'About Page', href: '/admin/cms/about' }]}>
            <Head title="About Page CMS" />
            <div className="p-6 max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">About Page</h1>
                        <p className="text-sm text-muted-foreground mt-1">Edit all sections for the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/about</code> page.</p>
                    </div>
                    <button onClick={submit} disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-60">
                        <Save size={18} /> Save Changes
                    </button>
                </div>

                <div className="flex flex-col gap-6">

                    {/* ── Hero ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🏛️ Hero Section</h2>
                        <div className="flex flex-col gap-4">
                            <Field label="Hero Title">
                                <input type="text" className={inputCls} value={data.hero_title} onChange={e => setData('hero_title', e.target.value)} />
                            </Field>
                            <Field label="Hero Subtitle / Tagline">
                                <textarea rows={3} className={inputCls} value={data.hero_subtitle} onChange={e => setData('hero_subtitle', e.target.value)} />
                            </Field>
                            <Field label="Hero Background Image URL">
                                <input type="text" className={inputCls} value={data.hero_image} onChange={e => setData('hero_image', e.target.value)} />
                                {data.hero_image && (
                                    <div className="mt-2 relative overflow-hidden rounded-xl border border-sidebar-border" style={{ height: 200 }}>
                                        <img src={data.hero_image} alt="preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/90 flex flex-col items-center justify-center text-white text-center px-4">
                                            <p className="text-lg font-semibold drop-shadow-lg">{data.hero_title || 'Hero Title'}</p>
                                            <p className="text-xs text-white/65 mt-1 line-clamp-2">{data.hero_subtitle}</p>
                                        </div>
                                    </div>
                                )}
                            </Field>
                        </div>
                    </section>

                    {/* ── Philosophy ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">📖 Philosophy Section</h2>
                        <div className="flex flex-col gap-4">
                            <Field label="Paragraph 1">
                                <textarea rows={4} className={inputCls} value={data.philosophy_para1} onChange={e => setData('philosophy_para1', e.target.value)} />
                            </Field>
                            <Field label="Paragraph 2">
                                <textarea rows={4} className={inputCls} value={data.philosophy_para2} onChange={e => setData('philosophy_para2', e.target.value)} />
                            </Field>
                        </div>
                    </section>

                    {/* ── Location ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">📍 Location Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Field label="Section Title">
                                <input type="text" className={inputCls} value={data.location_title} onChange={e => setData('location_title', e.target.value)} />
                            </Field>
                            <Field label="Google Maps URL">
                                <input type="text" className={inputCls} value={data.location_map_url} onChange={e => setData('location_map_url', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Section Subtitle">
                                    <textarea rows={2} className={inputCls} value={data.location_subtitle} onChange={e => setData('location_subtitle', e.target.value)} />
                                </Field>
                            </div>
                            <div className="col-span-2">
                                <Field label="Map / Location Image URL">
                                    <input type="text" className={inputCls} value={data.location_image} onChange={e => setData('location_image', e.target.value)} />
                                </Field>
                                {data.location_image && (
                                    <img src={data.location_image} alt="Map preview" className="mt-2 w-full h-36 object-cover rounded-lg border border-sidebar-border" />
                                )}
                            </div>
                        </div>

                        {/* Nearby places list */}
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-semibold">Nearby Places</p>
                            <button onClick={addLoc}
                                className="text-sm bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded flex items-center gap-1">
                                <Plus size={14} /> Add Place
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {data.locations.map((loc: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <input type="text" placeholder="Place Name"
                                        className="flex-1 border border-sidebar-border rounded p-2 text-sm bg-white dark:bg-sidebar"
                                        value={loc.text} onChange={e => updateLoc(i, 'text', e.target.value)} />
                                    <input type="text" placeholder="Distance"
                                        className="w-44 border border-sidebar-border rounded p-2 text-sm bg-white dark:bg-sidebar"
                                        value={loc.dist} onChange={e => updateLoc(i, 'dist', e.target.value)} />
                                    <button onClick={() => removeLoc(i)} className="text-red-400 hover:text-red-600 p-1.5">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
