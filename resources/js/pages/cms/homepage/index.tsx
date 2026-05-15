import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2, Save } from 'lucide-react';
import React from 'react';

export default function HomepageCms() {
    const { settings } = usePage<any>().props;

    const parseJson = (key: string, defaultVal: any) => {
        if (!settings[key] || !settings[key].value) return defaultVal;
        try {
            return JSON.parse(settings[key].value);
        } catch {
            return defaultVal;
        }
    };

    const defaultStats = parseJson('stats', [
        { value: 'IDR 5.6 Billion', label: 'Distribute to impact' },
        { value: '94.8%', label: 'Waste recycling rate' },
        { value: '14,000+', label: 'Cultural Audiences' },
    ]);

    const defaultStays = parseJson('featured_stays', [
        {
            title: 'Desert Modern Villa',
            price: 'Rp 4.5M',
            beds: 2,
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
            tag: 'Popular',
            tagColor: 'bg-white/90 text-[#1a1a1a]',
        },
        {
            title: 'Lakehouse Retreat',
            price: 'Rp 3.2M',
            beds: 1,
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
            tag: 'Free cancellation',
            tagColor: 'bg-white/90 text-[#1a1a1a]',
        },
    ]);

    const defaultLocations = parseJson('locations', [
        { text: 'Pantai Kedungu', dist: '10 Menit Berkendara' },
        { text: 'Tanah Lot Temple', dist: '15 Menit Berkendara' },
        { text: 'Canggu Area', dist: '30 Menit Berkendara' },
        { text: 'Bandara Ngurah Rai', dist: '1.5 Jam Berkendara' }
    ]);

    const { data, setData, patch, processing } = useForm({
        hero_title: settings?.hero_title?.value || 'Sanctuary of <br class="hidden md:block" /><span class="font-light italic">Elegance.</span>',
        hero_subtitle: settings?.hero_subtitle?.value || 'Curated spaces for the discerning traveler. Find your perfect escape.',
        hero_image: settings?.hero_image?.value || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        about_title: settings?.about_title?.value || 'Where every corner tells <br /> <span class="font-extrabold text-[#1a2320]">a story</span>',
        about_subtitle: settings?.about_subtitle?.value || "Explore Nuanu's living journey — where art, nature, and human spirit move together in endless creation.",
        about_image: settings?.about_image?.value || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        location_title: settings?.location_title?.value || 'Lokasi Strategis di Tabanan',
        location_subtitle: settings?.location_subtitle?.value || 'Dikelilingi oleh keindahan alam Bali yang otentik, namun tetap mudah dijangkau dari berbagai destinasi populer.',
        location_image: settings?.location_image?.value || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        stats: defaultStats,
        featured_stays: defaultStays,
        locations: defaultLocations,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/cms/homepage');
    };

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...data.stats];
        newStats[index][field] = value;
        setData('stats', newStats);
    };

    const updateStay = (index: number, field: string, value: string | number) => {
        const newStays = [...data.featured_stays];
        newStays[index][field] = value;
        setData('featured_stays', newStays);
    };

    const addStay = () => {
        setData('featured_stays', [
            ...data.featured_stays,
            { title: 'New Stay', price: 'Rp 0', beds: 1, image: '', tag: '', tagColor: 'bg-white/90 text-black' }
        ]);
    };

    const removeStay = (index: number) => {
        const newStays = [...data.featured_stays];
        newStays.splice(index, 1);
        setData('featured_stays', newStays);
    };

    const updateLocation = (index: number, field: string, value: string) => {
        const newLocs = [...data.locations];
        newLocs[index][field] = value;
        setData('locations', newLocs);
    };

    const addLocation = () => setData('locations', [...data.locations, { text: 'New Location', dist: '10 mins' }]);
    const removeLocation = (index: number) => {
        const newLocs = [...data.locations];
        newLocs.splice(index, 1);
        setData('locations', newLocs);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'Homepage Content', href: '/admin/cms/homepage' }]}>
            <Head title="Homepage CMS" />

            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Homepage Content</h1>
                    <button
                        onClick={submit}
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Hero Section */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">Hero Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-1">Hero Title (HTML Allowed)</label>
                                <textarea
                                    className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm"
                                    rows={2}
                                    value={data.hero_title}
                                    onChange={(e) => setData('hero_title', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-1">Hero Subtitle</label>
                                <textarea
                                    className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm"
                                    rows={2}
                                    value={data.hero_subtitle}
                                    onChange={(e) => setData('hero_subtitle', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-1">Hero Image URL</label>
                                <input
                                    type="text"
                                    className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm"
                                    value={data.hero_image}
                                    onChange={(e) => setData('hero_image', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">About Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-1">About Title (HTML Allowed)</label>
                                <textarea
                                    className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm"
                                    rows={3}
                                    value={data.about_title}
                                    onChange={(e) => setData('about_title', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-1">About Subtitle</label>
                                <textarea
                                    className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm"
                                    rows={2}
                                    value={data.about_subtitle}
                                    onChange={(e) => setData('about_subtitle', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-1">About Image URL</label>
                                <input
                                    type="text"
                                    className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm"
                                    value={data.about_image}
                                    onChange={(e) => setData('about_image', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">Statistics Grid</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.stats.map((stat: any, i: number) => (
                                <div key={i} className="border border-sidebar-border rounded-lg p-4 bg-gray-50 dark:bg-black/20">
                                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">Stat {i + 1} Value</label>
                                    <input
                                        type="text"
                                        className="w-full border border-sidebar-border rounded p-2 bg-white dark:bg-sidebar text-sm mb-3 font-bold"
                                        value={stat.value}
                                        onChange={(e) => updateStat(i, 'value', e.target.value)}
                                    />
                                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">Stat {i + 1} Label</label>
                                    <input
                                        type="text"
                                        className="w-full border border-sidebar-border rounded p-2 bg-white dark:bg-sidebar text-sm"
                                        value={stat.label}
                                        onChange={(e) => updateStat(i, 'label', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Featured Stays */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-sidebar-border pb-2">
                            <h2 className="text-lg font-bold">Featured Stays</h2>
                            <button
                                onClick={addStay}
                                className="text-sm bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Stay
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {data.featured_stays.map((stay: any, i: number) => (
                                <div key={i} className="border border-sidebar-border rounded-lg p-4 flex gap-4 items-start bg-gray-50 dark:bg-black/20 relative group">
                                    <button
                                        onClick={() => removeStay(i)}
                                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-sidebar rounded shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                        {stay.image ? (
                                            <img src={stay.image} alt="stay" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                        )}
                                    </div>

                                    <div className="flex-grow grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Title</label>
                                            <input type="text" className="w-full border rounded p-1.5 text-sm bg-white dark:bg-sidebar dark:border-sidebar-border" value={stay.title} onChange={e => updateStay(i, 'title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Price (e.g. Rp 4.5M)</label>
                                            <input type="text" className="w-full border rounded p-1.5 text-sm bg-white dark:bg-sidebar dark:border-sidebar-border" value={stay.price} onChange={e => updateStay(i, 'price', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Beds</label>
                                            <input type="number" className="w-full border rounded p-1.5 text-sm bg-white dark:bg-sidebar dark:border-sidebar-border" value={stay.beds} onChange={e => updateStay(i, 'beds', parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Image URL</label>
                                            <input type="text" className="w-full border rounded p-1.5 text-sm bg-white dark:bg-sidebar dark:border-sidebar-border" value={stay.image} onChange={e => updateStay(i, 'image', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1">Tag (Optional)</label>
                                            <input type="text" className="w-full border rounded p-1.5 text-sm bg-white dark:bg-sidebar dark:border-sidebar-border" value={stay.tag} onChange={e => updateStay(i, 'tag', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Location Section */}
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-sidebar-border pb-2">
                            <h2 className="text-lg font-bold">Location Section</h2>
                            <button
                                onClick={addLocation}
                                className="text-sm bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Location
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold mb-1">Title</label>
                                <input type="text" className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm" value={data.location_title} onChange={e => setData('location_title', e.target.value)} />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold mb-1">Map Image URL</label>
                                <input type="text" className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm" value={data.location_image} onChange={e => setData('location_image', e.target.value)} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-1">Subtitle</label>
                                <textarea className="w-full border border-sidebar-border rounded p-2 bg-transparent text-sm" rows={2} value={data.location_subtitle} onChange={e => setData('location_subtitle', e.target.value)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {data.locations.map((loc: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <input type="text" placeholder="Place Name" className="flex-1 border rounded p-2 text-sm bg-white dark:bg-sidebar" value={loc.text} onChange={e => updateLocation(i, 'text', e.target.value)} />
                                    <input type="text" placeholder="Distance" className="flex-1 border rounded p-2 text-sm bg-white dark:bg-sidebar" value={loc.dist} onChange={e => updateLocation(i, 'dist', e.target.value)} />
                                    <button onClick={() => removeLocation(i)} className="text-red-500 p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
