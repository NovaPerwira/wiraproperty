import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { usePage } from '@inertiajs/react';
import { PropertyCard, PropertyItem } from '@/components/PropertyCard';

const FALLBACK_IMAGES = [
    '/img/rumah.png',
];

const DEMO_ITEMS: PropertyItem[] = [
    { id: 1, name: 'Rumah Mewah Pererenan', location: 'Pererenan, Bali', price: 'Rp 4.200.000.000', beds: 4, baths: 3, size: '350m²', rating: 4.9, tag: 'Premium' },
    { id: 2, name: 'Rumah Modern Canggu', location: 'Canggu, Bali', price: 'Rp 3.500.000.000', beds: 3, baths: 2, size: '280m²', rating: 4.7, tag: 'Populer' },
    { id: 3, name: 'Rumah Tropis Seminyak', location: 'Seminyak, Bali', price: 'Rp 5.800.000.000', beds: 5, baths: 4, size: '480m²', rating: 4.8, tag: 'Eksklusif' },
    { id: 4, name: 'Rumah Garden Berawa', location: 'Berawa, Bali', price: 'Rp 2.900.000.000', beds: 3, baths: 2, size: '240m²', rating: 4.6, tag: 'Baru' },
];

export default function PropertyRumah() {
    const { settings, properties } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const items: PropertyItem[] = properties?.length > 0 ? properties : DEMO_ITEMS;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };
    const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    const heroImage    = get('hero_image', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2400&q=90');
    const heroLabel    = get('hero_label', 'Property · Rumah');
    const heroTitle    = get('hero_title', 'Rumah Impian Anda');
    const heroSubtitle = get('hero_subtitle', 'Koleksi rumah pilihan terbaik di lokasi premium. Dari rumah mewah modern hingga villa tropis yang asri.');
    const sectionTitle = get('section_title', 'Daftar Rumah Dijual');
    const sectionSub   = get('section_subtitle', 'Temukan rumah sempurna sesuai kebutuhan dan anggaran Anda.');

    return (
        <PublicLayout title="Property Rumah">
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="Property Rumah" className="h-full w-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/80" />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-400/15 blur-[130px]" />
                </div>
                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-[0.3em] text-blue-300/80 uppercase">{heroLabel}</motion.p>
                        <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {heroTitle.split(' ').slice(0, 2).join(' ')}{' '}
                            <span className="italic text-white/75">{heroTitle.split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">{heroSubtitle}</motion.p>
                        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <a href="#listings" className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:scale-105">Lihat Properti</a>
                            <a href="/about" className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10">Tentang Kami</a>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
                </motion.div>
            </div>

            <div id="listings" className="bg-[#fafafa] py-24">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-normal tracking-tight text-[#1a1a1a] md:text-[40px]">{sectionTitle}</h2>
                        <p className="mx-auto max-w-xl text-base text-[#6b6b6b]">{sectionSub}</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {items.map((item, idx) => (
                            <PropertyCard key={item.id} item={item} idx={idx} fallbackImages={FALLBACK_IMAGES} accentColor="blue" showType="property" fadeUp={fadeUp} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
