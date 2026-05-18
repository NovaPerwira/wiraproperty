import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { usePage } from '@inertiajs/react';
import { PropertyCard, PropertyItem } from '@/components/PropertyCard';

const FALLBACK_IMAGES = [
    '/img/tanah.png',
];

const DEMO_ITEMS: PropertyItem[] = [
    { id: 1, name: 'Tanah Tepi Pantai Kedungu', location: 'Kedungu, Tabanan', price: 'Rp 12.000.000 /m²', size: '2.500m²', zoning: 'Pariwisata', rating: 4.9, tag: 'Beachfront' },
    { id: 2, name: 'Tanah Sawah View Ubud', location: 'Ubud, Gianyar', price: 'Rp 8.500.000 /m²', size: '1.800m²', zoning: 'Perumahan', rating: 4.8, tag: 'Rice Field View' },
    { id: 3, name: 'Tanah Komersial Canggu', location: 'Canggu, Badung', price: 'Rp 18.000.000 /m²', size: '800m²', zoning: 'Komersial', rating: 4.7, tag: 'Prime Location' },
    { id: 4, name: 'Tanah Villa Tabanan', location: 'Tabanan, Bali', price: 'Rp 5.500.000 /m²', size: '4.200m²', zoning: 'Perumahan', rating: 4.6, tag: 'Investasi' },
];

export default function Tanah() {
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

    const heroImage    = get('hero_image', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=90');
    const heroLabel    = get('hero_label', 'Tanah');
    const heroTitle    = get('hero_title', 'Tanah Investasi Terbaik');
    const heroSubtitle = get('hero_subtitle', 'Pilihan kavling dan lahan terbaik di Bali dan sekitarnya. Lokasi strategis untuk investasi properti jangka panjang yang menguntungkan.');
    const sectionTitle = get('section_title', 'Daftar Tanah Dijual');
    const sectionSub   = get('section_subtitle', 'Kavling pilihan di lokasi premium dengan potensi kenaikan nilai yang tinggi.');

    return (
        <PublicLayout title="Tanah">
            {/* ── Hero ── */}
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="Tanah" className="h-full w-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/80" />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-green-400/15 blur-[130px]" />
                    <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[110px]" />
                </div>
                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-[0.3em] text-green-300/80 uppercase">{heroLabel}</motion.p>
                        <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {heroTitle.split(' ').slice(0, 2).join(' ')}{' '}
                            <span className="italic text-white/75">{heroTitle.split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">{heroSubtitle}</motion.p>
                        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <a href="#listings" className="rounded-full bg-green-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-green-600 hover:scale-105">Lihat Tanah</a>
                            <a href="/about" className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10">Tentang Kami</a>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
                </motion.div>
            </div>

            {/* ── Listings ── */}
            <div id="listings" className="bg-[#fafafa] py-24">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-normal tracking-tight text-[#1a1a1a] md:text-[40px]">{sectionTitle}</h2>
                        <p className="mx-auto max-w-xl text-base text-[#6b6b6b]">{sectionSub}</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {items.map((item, idx) => (
                            <PropertyCard key={item.id} item={item} idx={idx} fallbackImages={FALLBACK_IMAGES} accentColor="green" showType="tanah" fadeUp={fadeUp} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── Why Invest ── */}
            <div className="bg-[#0d1f0d] py-24 text-white">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-normal md:text-[40px]">Keunggulan <span className="italic text-green-400">Investasi Tanah</span></h2>
                        <p className="mx-auto max-w-xl text-white/60">Tanah adalah aset paling stabil — nilainya tidak pernah turun dan selalu meningkat seiring waktu.</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { icon: '🌿', title: 'Aset Abadi', desc: 'Tanah tidak bisa diproduksi ulang — suplai terbatas, permintaan terus naik.' },
                            { icon: '📜', title: 'Sertifikat Jelas', desc: 'Semua tanah kami dilengkapi sertifikat HGB/SHM yang legal dan aman.' },
                            { icon: '🚀', title: 'Capital Gain Tinggi', desc: 'Rata-rata kenaikan nilai tanah di Bali mencapai 15-25% per tahun.' },
                        ].map((item, i) => (
                            <motion.div key={i} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-colors hover:border-green-400/30">
                                <div className="mb-4 text-4xl">{item.icon}</div>
                                <h4 className="mb-2 text-lg font-semibold">{item.title}</h4>
                                <p className="text-sm leading-relaxed text-white/60">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
