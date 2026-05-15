import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import React from 'react';

const ICON_OPTIONS = ['Wifi', 'Map', 'Coffee', 'ShieldCheck', 'Wind', 'Star', 'Leaf', 'Dumbbell', 'Car', 'Sun'];

const defaultFacilities = [
    { title: 'High-Speed Wi-Fi', desc: 'Complimentary across all grounds', icon: 'Wifi' },
    { title: 'Concierge Planning', desc: 'Customized local excursions', icon: 'Map' },
    { title: 'In-Room Dining', desc: '24/7 personalized service', icon: 'Coffee' },
    { title: 'Private Security', desc: 'Uncompromised safety & peace of mind', icon: 'ShieldCheck' },
];

export default function ExperienceCms() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const parseFacilities = () => {
        try {
            const raw = settings?.facilities?.value;
            if (raw) return JSON.parse(raw);
        } catch {}
        return defaultFacilities;
    };

    const { data, setData, patch, processing } = useForm({
        hero_title:       get('hero_title', 'Beyond Accommodation'),
        hero_subtitle:    get('hero_subtitle', 'A curated collection of sensory moments crafted for your absolute well-being.'),
        hero_image:       get('hero_image', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90'),
        pool_title:       get('pool_title', 'The Infinity Pool'),
        pool_description: get('pool_description', 'Suspended between the sky and the lush valley below, our infinity pool offers a breathtaking vantage point. Lose yourself in the horizon while enjoying handcrafted refreshments from the sunken bar.'),
        pool_image:       get('pool_image', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'),
        pool_cta:         get('pool_cta', 'Explore Pool Access'),
        spa_title:        get('spa_title', 'Holistic Wellness'),
        spa_description:  get('spa_description', 'Reconnect with your inner balance. Our spa treatments merge ancient traditional techniques with modern therapeutic practices, using organic, locally-sourced botanical ingredients.'),
        spa_image:        get('spa_image', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'),
        spa_cta:          get('spa_cta', 'View Spa Menu'),
        facilities:       parseFacilities(),
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); patch('/admin/cms/experience'); };

    const updateFac = (i: number, field: string, val: string) => {
        const next = [...data.facilities];
        next[i] = { ...next[i], [field]: val };
        setData('facilities', next);
    };
    const addFac = () => setData('facilities', [...data.facilities, { title: 'New Feature', desc: 'Description here', icon: 'Star' }]);
    const removeFac = (i: number) => { const next = [...data.facilities]; next.splice(i, 1); setData('facilities', next); };

    const inputCls = 'w-full border border-sidebar-border rounded p-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div><label className="block text-sm font-semibold mb-1">{label}</label>{children}</div>
    );

    const ImagePreview = ({ src, title, subtitle, gradient = 'from-black/60 via-black/40 to-black/80' }: { src: string; title: string; subtitle?: string; gradient?: string }) =>
        src ? (
            <div className="mt-2 relative overflow-hidden rounded-xl border border-sidebar-border" style={{ height: 200 }}>
                <img src={src} alt="preview" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-b ${gradient} flex flex-col items-center justify-center text-white text-center px-4`}>
                    <p className="text-lg font-semibold drop-shadow-lg">{title || '—'}</p>
                    {subtitle && <p className="text-xs text-white/60 mt-1 line-clamp-2">{subtitle}</p>}
                </div>
            </div>
        ) : null;

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'Experience Page', href: '/admin/cms/experience' }]}>
            <Head title="Experience Page CMS" />
            <div className="p-6 max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Experience Page</h1>
                        <p className="text-sm text-muted-foreground mt-1">Edit all sections for the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/experience</code> page.</p>
                    </div>
                    <button onClick={submit} disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-60">
                        <Save size={18} /> Save Changes
                    </button>
                </div>

                <div className="flex flex-col gap-6">

                    {/* ── Hero ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🎯 Hero Section</h2>
                        <div className="flex flex-col gap-4">
                            <Field label="Hero Title">
                                <input type="text" className={inputCls} value={data.hero_title} onChange={e => setData('hero_title', e.target.value)} />
                            </Field>
                            <Field label="Hero Subtitle">
                                <textarea rows={3} className={inputCls} value={data.hero_subtitle} onChange={e => setData('hero_subtitle', e.target.value)} />
                            </Field>
                            <Field label="Hero Background Image URL">
                                <input type="text" className={inputCls} value={data.hero_image} onChange={e => setData('hero_image', e.target.value)} />
                                <ImagePreview src={data.hero_image} title={data.hero_title} subtitle={data.hero_subtitle} />
                            </Field>
                        </div>
                    </section>

                    {/* ── Infinity Pool ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🏊 Infinity Pool Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Title">
                                <input type="text" className={inputCls} value={data.pool_title} onChange={e => setData('pool_title', e.target.value)} />
                            </Field>
                            <Field label="CTA Button Text">
                                <input type="text" className={inputCls} value={data.pool_cta} onChange={e => setData('pool_cta', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Description">
                                    <textarea rows={3} className={inputCls} value={data.pool_description} onChange={e => setData('pool_description', e.target.value)} />
                                </Field>
                            </div>
                            <div className="col-span-2">
                                <Field label="Section Image URL">
                                    <input type="text" className={inputCls} value={data.pool_image} onChange={e => setData('pool_image', e.target.value)} />
                                </Field>
                                {data.pool_image && (
                                    <img src={data.pool_image} alt="Pool preview" className="mt-2 w-full h-36 object-cover rounded-lg border border-sidebar-border" />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ── Wellness / Spa ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🧘 Wellness / Spa Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Title">
                                <input type="text" className={inputCls} value={data.spa_title} onChange={e => setData('spa_title', e.target.value)} />
                            </Field>
                            <Field label="CTA Button Text">
                                <input type="text" className={inputCls} value={data.spa_cta} onChange={e => setData('spa_cta', e.target.value)} />
                            </Field>
                            <div className="col-span-2">
                                <Field label="Description">
                                    <textarea rows={3} className={inputCls} value={data.spa_description} onChange={e => setData('spa_description', e.target.value)} />
                                </Field>
                            </div>
                            <div className="col-span-2">
                                <Field label="Section Image URL">
                                    <input type="text" className={inputCls} value={data.spa_image} onChange={e => setData('spa_image', e.target.value)} />
                                </Field>
                                {data.spa_image && (
                                    <img src={data.spa_image} alt="Spa preview" className="mt-2 w-full h-36 object-cover rounded-lg border border-sidebar-border" />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ── Icon Facilities ── */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-sidebar-border pb-2">
                            <h2 className="text-lg font-bold">✨ Icon Facilities Grid</h2>
                            <button onClick={addFac}
                                className="text-sm bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded flex items-center gap-1">
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.facilities.map((fac: any, i: number) => (
                                <div key={i} className="border border-sidebar-border rounded-lg p-4 bg-gray-50 dark:bg-black/20 relative group">
                                    <button onClick={() => removeFac(i)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold mb-1 text-muted-foreground">Title</label>
                                            <input type="text" className="w-full border border-sidebar-border rounded p-1.5 text-sm bg-white dark:bg-sidebar"
                                                value={fac.title} onChange={e => updateFac(i, 'title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1 text-muted-foreground">Icon</label>
                                            <select className="w-full border border-sidebar-border rounded p-1.5 text-sm bg-white dark:bg-sidebar"
                                                value={fac.icon} onChange={e => updateFac(i, 'icon', e.target.value)}>
                                                {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold mb-1 text-muted-foreground">Description</label>
                                            <input type="text" className="w-full border border-sidebar-border rounded p-1.5 text-sm bg-white dark:bg-sidebar"
                                                value={fac.desc} onChange={e => updateFac(i, 'desc', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
