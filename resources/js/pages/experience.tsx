import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { Map, Coffee, ShieldCheck, Wifi, Wind, Star, Leaf, Dumbbell, Car } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const ICON_MAP: Record<string, React.ReactNode> = {
    Wifi: <Wifi size={32} />,
    Map: <Map size={32} />,
    Coffee: <Coffee size={32} />,
    ShieldCheck: <ShieldCheck size={32} />,
    Wind: <Wind size={32} />,
    Star: <Star size={32} />,
    Leaf: <Leaf size={32} />,
    Dumbbell: <Dumbbell size={32} />,
    Car: <Car size={32} />,
};

const defaultFacilities = [
    { icon: 'Wifi', title: 'High-Speed Wi-Fi', desc: 'Complimentary across all grounds' },
    { icon: 'Map', title: 'Concierge Planning', desc: 'Customized local excursions' },
    { icon: 'Coffee', title: 'In-Room Dining', desc: '24/7 personalized service' },
    { icon: 'ShieldCheck', title: 'Private Security', desc: 'Uncompromised safety & peace of mind' },
];

export default function Experience() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const facilities = (() => {
        try { const r = settings?.facilities?.value; if (r) return JSON.parse(r); } catch {}
        return defaultFacilities;
    })();

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };
    const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    const heroImage = get('hero_image', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90');

    return (
        <PublicLayout title="The Experience">

            {/* ── HERO with parallax ── */}
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">

                {/* Parallax background image */}
                <motion.div
                    style={{ y: bgY }}
                    className="absolute inset-0 scale-[1.15]"
                >
                    <img
                        src={heroImage}
                        alt="Experience hero"
                        className="h-full w-full object-cover"
                    />
                </motion.div>

                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

                {/* Glow blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-rose-500/10 blur-[100px]" />
                    <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-sky-400/10 blur-[90px]" />
                </div>

                {/* Scrolling text content */}
                <motion.div
                    style={{ y: textY, opacity }}
                    className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        <motion.p
                            variants={fadeUp}
                            className="mb-4 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase"
                        >
                            The Experience
                        </motion.p>
                        <motion.h1
                            variants={fadeUp}
                            className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl"
                        >
                            {get('hero_title', 'Beyond') + ' '}
                            <span className="italic text-white/75">
                                {get('hero_title', 'Beyond Accommodation').split(' ').slice(1).join(' ') || 'Accommodation'}
                            </span>
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60"
                        >
                            {get('hero_subtitle', 'A curated collection of sensory moments crafted for your absolute well-being.')}
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
                >
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                        className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent"
                    />
                </motion.div>
            </div>

            {/* ── HIGHLIGHTS ── */}
            <div className="bg-[#fafafa] py-24">
                <div className="mx-auto max-w-[1200px] px-8">
                    {/* Pool */}
                    <div className="mb-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <h2 className="mb-6 text-3xl font-normal text-[#1a1a1a] md:text-4xl">{get('pool_title', 'The Infinity Pool')}</h2>
                            <p className="mb-8 text-lg leading-relaxed text-[#6b6b6b]">{get('pool_description', 'Suspended between the sky and the lush valley below, our infinity pool offers a breathtaking vantage point.')}</p>
                            <button className="border-b border-black pb-1 text-sm font-semibold tracking-wider text-[#1a1a1a] uppercase transition-colors hover:text-black">
                                {get('pool_cta', 'Explore Pool Access')}
                            </button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-[500px] overflow-hidden rounded-3xl shadow-2xl"
                        >
                            <img src={get('pool_image', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')} alt="Infinity Pool" className="h-full w-full object-cover" />
                        </motion.div>
                    </div>

                    {/* Spa */}
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-2 h-[500px] overflow-hidden rounded-3xl shadow-2xl lg:order-1"
                        >
                            <img src={get('spa_image', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')} alt="Wellness Spa" className="h-full w-full object-cover" />
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="order-1 lg:order-2">
                            <h2 className="mb-6 text-3xl font-normal text-[#1a1a1a] md:text-4xl">{get('spa_title', 'Holistic Wellness')}</h2>
                            <p className="mb-8 text-lg leading-relaxed text-[#6b6b6b]">{get('spa_description', 'Reconnect with your inner balance using organic, locally-sourced botanical ingredients.')}</p>
                            <button className="border-b border-black pb-1 text-sm font-semibold tracking-wider text-[#1a1a1a] uppercase transition-colors hover:text-black">
                                {get('spa_cta', 'View Spa Menu')}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── ICON FACILITIES ── */}
            <div className="border-t border-gray-100 bg-white py-24">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                        {facilities.map((fac: any, idx: number) => (
                            <motion.div key={idx} variants={fadeUp} className="group flex cursor-default flex-col items-center bg-transparent p-8 transition-all">
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-6 rounded-2xl bg-[#fafafa] p-5 text-black transition-colors group-hover:bg-[#f0f0f0]"
                                >
                                    {ICON_MAP[fac.icon] ?? <Wifi size={32} />}
                                </motion.div>
                                <h4 className="mb-2 font-semibold text-gray-900">{fac.title}</h4>
                                <p className="text-sm text-gray-500">{fac.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
