import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { usePage } from '@inertiajs/react';

export default function Dining() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };
    const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    const heroImage = get('hero_image', 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90');

    return (
        <PublicLayout title="Culinary Dining">

            {/* ── HERO with parallax ── */}
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">

                {/* Parallax BG */}
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="Dining hero" className="h-full w-full object-cover" />
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85" />

                {/* Glow blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-orange-400/15 blur-[130px]" />
                    <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[110px]" />
                    <div className="absolute top-1/2 left-0 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-amber-300/10 blur-[90px]" />
                </div>

                {/* Text content */}
                <motion.div style={{ y: textY, opacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase">
                            Culinary Arts
                        </motion.p>
                        <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {get('hero_title', 'Culinary')}{' '}
                            <span className="italic text-white/75">
                                {get('hero_title', 'Culinary Mastery').split(' ').slice(1).join(' ') || 'Mastery'}
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">
                            {get('hero_subtitle', 'A celebration of authentic local ingredients fused with international techniques.')}
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                        className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent"
                    />
                </motion.div>
            </div>

            {/* ── ALTERNATING SECTIONS ── */}
            <div className="bg-[#fafafa] py-24">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-32 px-8">

                    {/* Restaurant */}
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-[550px] overflow-hidden rounded-3xl shadow-2xl"
                        >
                            <img src={get('restaurant_image', 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')} alt="Main Restaurant" className="h-full w-full object-cover" />
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:pl-8">
                            <span className="mb-4 block text-sm font-semibold tracking-widest text-gray-400 uppercase">
                                {get('restaurant_label', 'Signature Dining')}
                            </span>
                            <h2 className="mb-6 text-3xl font-normal text-[#1a1a1a] md:text-4xl">
                                {get('restaurant_title', 'Lumina Pavilion')}
                            </h2>
                            <p className="mb-8 text-lg leading-relaxed text-[#6b6b6b]">
                                {get('restaurant_description', 'Open all day, Lumina Pavilion boasts panoramic views of the cascading valley.')}
                            </p>
                            <div className="flex gap-4">
                                <button className="rounded-full bg-[#121212] px-8 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-black">
                                    {get('restaurant_cta', 'Reserve a Table')}
                                </button>
                                <button className="rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-gray-50">
                                    View Menu
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bar / Lounge */}
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="order-2 lg:order-1 lg:pr-8">
                            <span className="mb-4 block text-sm font-semibold tracking-widest text-gray-400 uppercase">
                                {get('bar_label', 'Evening Lounge')}
                            </span>
                            <h2 className="mb-6 text-3xl font-normal text-[#1a1a1a] md:text-4xl">
                                {get('bar_title', 'The Obsidian Bar')}
                            </h2>
                            <p className="mb-8 text-lg leading-relaxed text-[#6b6b6b]">
                                {get('bar_description', 'As dusk settles, retreat to The Obsidian Bar.')}
                            </p>
                            <button className="rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-gray-50">
                                {get('bar_cta', 'Discover the Spirits')}
                            </button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 h-[550px] overflow-hidden rounded-3xl shadow-2xl lg:order-2"
                        >
                            <img src={get('bar_image', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')} alt="Obsidian Bar" className="h-full w-full object-cover" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
