import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { MapPin, Map } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const defaultLocations = [
    { text: 'Kedungu Beach', dist: '10 Minutes Drive' },
    { text: 'Tanah Lot Temple', dist: '15 Minutes Drive' },
    { text: 'Canggu Area', dist: '30 Minutes Drive' },
    { text: 'Ngurah Rai Airport', dist: '1.5 Hours Drive' },
];

export default function About() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const locations = (() => {
        try { const r = settings?.locations?.value; if (r) return JSON.parse(r); } catch {}
        return defaultLocations;
    })();

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };
    const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    const heroImage = get('hero_image', 'https://images.unsplash.com/photo-1542314831-c6a4d1409360?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90');

    return (
        <PublicLayout title="Our Story">

            {/* ── HERO with parallax ── */}
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">

                {/* Parallax BG */}
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="About hero" className="h-full w-full object-cover" />
                </motion.div>

                {/* Gradient overlay — deeper at bottom for smooth transition */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/90" />

                {/* Glow blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-400/10 blur-[140px]" />
                    <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-300/10 blur-[100px]" />
                    <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] rounded-full bg-white/5 blur-[80px]" />
                </div>

                {/* Text content */}
                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase">
                            Our Story
                        </motion.p>
                        <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {get('hero_title', 'The Stayli Vision')}
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-white/65 md:text-2xl">
                            {get('hero_subtitle', 'Born from a desire to redefine luxury, Stayli bridges the gap between raw natural beauty and uncompromising modern comfort.')}
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                        className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent"
                    />
                </motion.div>
            </div>

            {/* ── PHILOSOPHY ── */}
            <div className="bg-white py-24">
                <div className="mx-auto max-w-[800px] space-y-8 px-8 text-center">
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-lg leading-loose text-[#6b6b6b]">
                        {get('philosophy_para1', 'Founded in 2020 by a collective of visionary architects and local artisans, Stayli was constructed with complete respect for the surrounding landscape.')}
                    </motion.p>
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-lg leading-loose text-[#6b6b6b]">
                        {get('philosophy_para2', 'We believe that true luxury lies in absolute peace—a sanctuary where time slows down, allowing you to reconnect with yourself, your loved ones, and the environment.')}
                    </motion.p>
                </div>
            </div>

            {/* ── LOCATION ── */}
            <div className="border-t border-gray-100 bg-[#fafafa] py-24">
                <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-16 px-8 md:flex-row">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="md:w-1/2">
                        <h2 className="mb-6 text-3xl font-normal tracking-tight text-gray-900 md:text-[40px]">
                            {get('location_title', 'Strategic Haven in Tabanan')}
                        </h2>
                        <p className="mb-10 text-lg leading-relaxed text-[#6b6b6b]">
                            {get('location_subtitle', 'Surrounded by the authentic natural grace of Bali, yet entirely accessible from major cultural and geographic landmarks.')}
                        </p>
                        <ul className="space-y-6">
                            {locations.map((loc: any, i: number) => (
                                <motion.li key={i} whileHover={{ x: 10 }} className="flex cursor-default items-center gap-4 text-[#1a1a1a]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <span className="block font-medium">{loc.text}</span>
                                        <span className="text-sm text-[#8c8c8c]">{loc.dist}</span>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="group relative h-[450px] w-full overflow-hidden rounded-[40px] bg-gray-200 shadow-lg md:w-1/2"
                    >
                        <img
                            src={get('location_image', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')}
                            alt="Bali Map View"
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-500 group-hover:bg-black/20">
                            <motion.a
                                href={get('location_map_url', '#')}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-black shadow-xl"
                            >
                                <Map size={18} /> Open in Google Maps
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
