'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
    Variants,
} from 'framer-motion';
import {
    ChevronDown,
    MapPin,
    Calendar,
    Search,
    Wifi,
    Coffee,
    ShieldCheck,
    Map,
    Image as ImageIcon,
    CheckCircle2,
    Users,
    BedDouble,
    ArrowRight,
} from 'lucide-react';
import { useForm, Head, usePage } from '@inertiajs/react';
import Navbar from '@/components/navbar';
// import ImpactSection from '@/components/impact';
import GallerySection from '@/components/galery';

import GuestLayout from '@/layouts/guest-layout';

interface LogoProps extends React.SVGProps<SVGSVGElement> { }

interface NavItem {
    name: string;
    href: string;
}

interface Facility {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

interface RoomStay {
    id: string;
    title: string;
    price: string;
    beds: number;
    image: string;
    tag?: string;
    tagColor?: string;
    tagIcon?: React.ReactNode;
}

// --- COMPONENTS ---

// Logo SVG Component
const Logo: React.FC<LogoProps> = (props) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`mr-2 ${props.className || ''}`}
        {...props}
    >
        <path
            d="M4 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H4V4Z"
            fill="white"
        />
        <path
            d="M8 8H12C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16H8V8Z"
            fill="#1a1a1a"
        />
    </svg>
);

// Data
const navItems: NavItem[] = [
    { name: 'Home', href: '#' },
    { name: 'Listings', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Blog Posts', href: '#' },
    { name: 'Contact', href: '#' },
];

// Dynamic facilities will be fetched from database.

const roomsData: RoomStay[] = [
    {
        id: 'stay-1',
        title: 'Desert Modern Villa',
        price: 'Rp 4.5M',
        beds: 2,
        image: '/img/villa.png',
        tag: 'Popular',
        tagColor: 'bg-white/90 text-[#1a1a1a]',
    },
    {
        id: 'stay-2',
        title: 'Lakehouse Retreat',
        price: 'Rp 3.2M',
        beds: 1,
        image: '/img/rumah.png',
        tag: 'Free cancellation',
        tagColor: 'bg-white/90 text-[#1a1a1a]',
        tagIcon: <CheckCircle2 size={14} className="text-green-600" />,
    },
];

export default function App() {
    const { heroTitle, heroSubtitle, heroImage, aboutTitle, aboutSubtitle, aboutImage, stats, featuredStays, dbFacilities, locationTitle, locationSubtitle, locationImage, locations } = usePage<any>().props;

    const getIcon = (iconName: string) => {
        const iconProps = { size: 32 };
        switch (iconName?.toLowerCase()) {
            case 'wifi': return <Wifi {...iconProps} />;
            case 'coffee': return <Coffee {...iconProps} />;
            case 'shield': return <ShieldCheck {...iconProps} />;
            case 'map': return <Map {...iconProps} />;
            case 'bed': return <BedDouble {...iconProps} />;
            case 'users': return <Users {...iconProps} />;
            default: return <Sparkles {...iconProps} />; // Fallback icon
        }
    };
    // State dengan tipe eksplisit
    const containerRef = useRef<HTMLDivElement>(null);
    const [showMobileCTA, setShowMobileCTA] = useState<boolean>(false);

    // Logika Sticky CTA untuk Mobile
    useEffect(() => {
        const handleScroll = (): void => {
            if (window.scrollY > 600) setShowMobileCTA(true);
            else setShowMobileCTA(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Parallax Hooks
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 1100], [0, 250]);
    const opacityText = useTransform(scrollY, [0, 400], [1, 0]);
    const yText = useTransform(scrollY, [0, 400], [0, 80]);

    // Framer Motion Variants
    const fadeUpVariant: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const hoverCardVariant: Variants = {
        rest: { y: 0, scale: 1 },
        hover: {
            y: -8,
            scale: 1.01,
            transition: { type: 'spring', stiffness: 400, damping: 25 },
        },
    };

    const { data, setData, get, processing, errors } = useForm({
        checkin: '',
        checkout: '',
        guests: 1,
    });

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        get('/search-rooms', {
            preserveScroll: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Welcome | Kavushion" />
            <div
                ref={containerRef}
                className="relative min-h-screen overflow-x-hidden font-sans text-gray-900"
            >
                {/* <LuxuryHero /> */}
                {/* Hero Section Asli dengan Parallax */}
                <div className="relative flex h-[125vh] w-full flex-col items-center justify-start overflow-hidden pt-[25vh]">
                    <motion.div
                        style={{ y: yParallax }}
                        className="absolute inset-0 z-0 h-[120vh] w-full origin-top"
                    >
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            src={heroImage || "/img/villa.png"}
                            alt="Modern vacation home"
                            className="h-full w-full object-cover object-center"
                        />
                        {/* Overlay tipis */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 mix-blend-multiply" />
                    </motion.div>

                    <motion.div
                        style={{ opacity: opacityText, y: yText }}
                        className="relative z-10 mt-0 w-full max-w-5xl px-6 text-center text-white"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1.2,
                                delay: 0.2,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="font-playfair mb-6 text-5xl leading-[1.05] font-normal tracking-tight drop-shadow-lg md:text-7xl lg:text-[90px]"
                            dangerouslySetInnerHTML={{ __html: heroTitle || 'Sanctuary of <br class="hidden md:block" /><span class="font-light italic">Elegance.</span>' }}
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1.2,
                                delay: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="mx-auto mb-12 max-w-md text-base leading-relaxed font-light tracking-wide text-white/80 md:text-lg"
                        >
                            {heroSubtitle || 'Curated spaces for the discerning traveler. Find your perfect escape.'}
                        </motion.p>

                        {/* CTA Buttons */}
                        <div className="relative z-30 mx-auto max-w-[1000px] px-6">
                            <form
                                onSubmit={submitForm}
                                className="relative flex flex-col items-center gap-3 rounded-3xl p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] md:flex-row md:p-4"
                                style={{
                                    backgroundColor: 'rgba(25, 25, 25, 0.45)', // Liquid Glass Base
                                    backdropFilter: 'blur(40px) saturate(180%)',
                                    WebkitBackdropFilter:
                                        'blur(40px) saturate(180%)',
                                    boxShadow:
                                        'inset 0 1px 0 0 rgba(255,255,255,0.1)',
                                }}
                            >
                                {/* Input Tanggal Interaktif */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="flex w-full flex-1 items-center gap-4 rounded-2xl bg-[#f9f9f9] px-6 py-3 transition-colors"
                                >
                                    <Calendar
                                        className="text-[#5a5a4a]"
                                        size={22}
                                    />
                                    <div className="relative flex w-full flex-col">
                                        <span className="text-[11px] font-medium tracking-wider text-[#8c8c8c] uppercase">
                                            checkin
                                        </span>
                                        <input
                                            type="date"
                                            required
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0]
                                            }
                                            value={data.checkin}
                                            onChange={(e) =>
                                                setData(
                                                    'checkin',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border-none bg-transparent p-0 text-[15px] font-medium text-[#1a1a1a] outline-none focus:ring-0"
                                        />
                                        {errors.checkin && (
                                            <span className="absolute top-12 left-0 text-xs text-red-500">
                                                {errors.checkin}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{
                                        scale: 1.02,
                                        backgroundColor: '#f0f0f0',
                                    }}
                                    className="flex w-full flex-1 items-center gap-4 rounded-2xl bg-[#f9f9f9] px-6 py-3 transition-colors"
                                >
                                    <Calendar
                                        className="text-[#5a5a4a]"
                                        size={22}
                                    />
                                    <div className="relative flex w-full flex-col">
                                        <span className="text-[11px] font-medium tracking-wider text-[#8c8c8c] uppercase">
                                            checkout
                                        </span>
                                        <input
                                            type="date"
                                            required
                                            min={
                                                data.checkin ||
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0]
                                            }
                                            value={data.checkout}
                                            onChange={(e) =>
                                                setData(
                                                    'checkout',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border-none bg-transparent p-0 text-[15px] font-medium text-[#1a1a1a] outline-none focus:ring-0"
                                        />
                                        {errors.checkout && (
                                            <span className="absolute top-12 left-0 text-xs text-red-500">
                                                {errors.checkout}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{
                                        scale: 1.02,
                                        backgroundColor: '#f0f0f0',
                                    }}
                                    className="flex w-full flex-1 items-center gap-4 rounded-2xl bg-[#f9f9f9] px-6 py-3 transition-colors"
                                >
                                    <Users
                                        className="text-[#5a5a4a]"
                                        size={22}
                                    />
                                    <div className="relative flex w-full flex-col">
                                        <span className="text-[11px] font-medium tracking-wider text-[#8c8c8c] uppercase">
                                            Guest
                                        </span>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            required
                                            value={data.guests}
                                            onChange={(e) =>
                                                setData(
                                                    'guests',
                                                    parseInt(e.target.value) ||
                                                    1,
                                                )
                                            }
                                            className="w-full border-none bg-transparent p-0 text-[15px] font-medium text-[#1a1a1a] outline-none focus:ring-0"
                                        />
                                        {errors.guests && (
                                            <span className="absolute top-12 left-0 text-xs text-red-500">
                                                {errors.guests}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#121212] px-10 py-5 text-white shadow-md transition-colors hover:bg-black disabled:opacity-50 md:w-auto"
                                >
                                    <Search size={20} />
                                    <span className="font-medium">Cari</span>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Gradien putih halus yang asli */}
                    <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-[30vh] w-full bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>

                {/* Integrasi Booking Form bergaya Minimalis */}
                <div className="relative z-30 mx-auto -mt-32 mb-16 max-w-[1000px] px-6 md:-mt-24">
                    <form
                        onSubmit={submitForm}
                        className="relative flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] md:flex-row md:p-4"
                    >
                        {/* Input Tanggal Interaktif */}
                        <motion.div
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: '#f0f0f0',
                            }}
                            className="flex w-full flex-1 items-center gap-4 rounded-2xl bg-[#f9f9f9] px-6 py-3 transition-colors"
                        >
                            <Calendar className="text-[#5a5a4a]" size={22} />
                            <div className="relative flex w-full flex-col">
                                <span className="text-[11px] font-medium tracking-wider text-[#8c8c8c] uppercase">
                                    checkin
                                </span>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={data.checkin}
                                    onChange={(e) =>
                                        setData('checkin', e.target.value)
                                    }
                                    className="w-full border-none bg-transparent p-0 text-[15px] font-medium text-[#1a1a1a] outline-none focus:ring-0"
                                />
                                {errors.checkin && (
                                    <span className="absolute top-12 left-0 text-xs text-red-500">
                                        {errors.checkin}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: '#f0f0f0',
                            }}
                            className="flex w-full flex-1 items-center gap-4 rounded-2xl bg-[#f9f9f9] px-6 py-3 transition-colors"
                        >
                            <Calendar className="text-[#5a5a4a]" size={22} />
                            <div className="relative flex w-full flex-col">
                                <span className="text-[11px] font-medium tracking-wider text-[#8c8c8c] uppercase">
                                    checkout
                                </span>
                                <input
                                    type="date"
                                    required
                                    min={
                                        data.checkin ||
                                        new Date().toISOString().split('T')[0]
                                    }
                                    value={data.checkout}
                                    onChange={(e) =>
                                        setData('checkout', e.target.value)
                                    }
                                    className="w-full border-none bg-transparent p-0 text-[15px] font-medium text-[#1a1a1a] outline-none focus:ring-0"
                                />
                                {errors.checkout && (
                                    <span className="absolute top-12 left-0 text-xs text-red-500">
                                        {errors.checkout}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: '#f0f0f0',
                            }}
                            className="flex w-full flex-1 items-center gap-4 rounded-2xl bg-[#f9f9f9] px-6 py-3 transition-colors"
                        >
                            <Users className="text-[#5a5a4a]" size={22} />
                            <div className="relative flex w-full flex-col">
                                <span className="text-[11px] font-medium tracking-wider text-[#8c8c8c] uppercase">
                                    Guest
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    required
                                    value={data.guests}
                                    onChange={(e) =>
                                        setData(
                                            'guests',
                                            parseInt(e.target.value) || 1,
                                        )
                                    }
                                    className="w-full border-none bg-transparent p-0 text-[15px] font-medium text-[#1a1a1a] outline-none focus:ring-0"
                                />
                                {errors.guests && (
                                    <span className="absolute top-12 left-0 text-xs text-red-500">
                                        {errors.guests}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={processing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#121212] px-10 py-5 text-white shadow-md transition-colors hover:bg-black disabled:opacity-50 md:w-auto"
                        >
                            <Search size={20} />
                            <span className="font-medium">Cari</span>
                        </motion.button>
                    </form>
                </div>

                {/* Bagian Tentang & Fitur */}
                <div className="relative z-20 flex w-full justify-center bg-[#f6f5ef]">
                    <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-12 bg-white px-8 md:flex-row md:items-end lg:gap-24 lg:px-16">
                        {/* Kolom Kiri: Judul dan Tombol */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={fadeUpVariant}
                            className="md:w-[55%]"
                        >
                            <h2
                                className="mb-8 text-4xl leading-[1.1] font-light tracking-tight text-[#2c2c2c] md:text-5xl lg:text-[64px]"
                                dangerouslySetInnerHTML={{ __html: aboutTitle }}
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 rounded-full bg-[#1c2421] px-8 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-black"
                            >
                                See more projects
                            </motion.button>
                        </motion.div>

                        {/* Kolom Kanan: Teks Paragraf */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            variants={fadeUpVariant}
                            className="flex pb-2 md:w-[45%] md:justify-end md:pb-6"
                        >
                            <p className="max-w-[500px] text-base leading-relaxed text-[#3a3a3a] md:text-lg lg:text-[20px]">
                                {aboutSubtitle}
                            </p>
                        </motion.div>
                    </div>
                </div>
                <div className="mx-auto w-full max-w-[1440px] p-8 lg:px-16">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="flex flex-col gap-6 lg:flex-row"
                    >
                        {/* Bagian Kiri: Gambar Besar */}
                        <motion.div
                            variants={fadeUpVariant}
                            className="relative h-[400px] overflow-hidden rounded-[32px] lg:h-[600px] lg:w-[55%]"
                        >
                            <img
                                src={aboutImage}
                                alt="Nuanu landscape view"
                                className="h-full w-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                            />
                        </motion.div>

                        {/* Bagian Kanan: Grid Statistik */}
                        <div className="grid h-[400px] grid-cols-2 grid-rows-2 gap-4 lg:h-[600px] lg:w-[45%] lg:gap-6">
                            {/* Card 1: Memanjang ke bawah / 2 Baris */}
                            <motion.div
                                variants={fadeUpVariant}
                                className="group relative col-span-1 row-span-2 flex flex-col justify-between rounded-[32px] bg-[#f6f4ed] p-6 transition-colors duration-300 hover:bg-[#efede5] lg:p-10"
                            >
                                <div className="absolute top-8 right-8 h-2 w-2 rounded-full bg-[#1a2320] opacity-80" />
                                <div className="mt-auto">
                                    <h3 className="mb-3 text-4xl leading-[1.1] font-extrabold tracking-tight text-[#1a2320] lg:text-[56px]" dangerouslySetInnerHTML={{ __html: stats[0]?.value || '' }} />
                                    <p className="text-base text-[#5a605e] lg:text-lg">{stats[0]?.label}</p>
                                </div>
                            </motion.div>

                            {/* Card 2: Kanan Atas */}
                            <motion.div
                                variants={fadeUpVariant}
                                className="group relative col-span-1 row-span-1 flex flex-col justify-between rounded-[32px] bg-[#f6f4ed] p-6 transition-colors duration-300 hover:bg-[#efede5] lg:p-10"
                            >
                                <div className="absolute top-8 right-8 h-2 w-2 rounded-full bg-[#1a2320] opacity-80" />
                                <div className="mt-auto">
                                    <h3 className="mb-2 text-4xl leading-tight font-extrabold text-[#1a2320] lg:text-5xl" dangerouslySetInnerHTML={{ __html: stats[1]?.value || '' }} />
                                    <p className="text-base text-[#5a605e] lg:text-lg">{stats[1]?.label}</p>
                                </div>
                            </motion.div>

                            {/* Card 3: Kanan Bawah */}
                            <motion.div
                                variants={fadeUpVariant}
                                className="group relative col-span-1 row-span-1 flex flex-col justify-between rounded-[32px] bg-[#f6f4ed] p-6 transition-colors duration-300 hover:bg-[#efede5] lg:p-10"
                            >
                                <div className="absolute top-8 right-8 h-2 w-2 rounded-full bg-[#1a2320] opacity-80" />
                                <div className="mt-auto">
                                    <h3 className="mb-2 text-4xl leading-tight font-extrabold text-[#1a2320] lg:text-5xl" dangerouslySetInnerHTML={{ __html: stats[2]?.value || '' }} />
                                    <p className="text-base text-[#5a605e] lg:text-lg">{stats[2]?.label}</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Tombol Lihat Selengkapnya */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-12 flex justify-center lg:justify-start"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-3 rounded-full bg-[#1c2421] px-8 py-4 text-[15px] font-medium text-white transition-colors hover:bg-black"
                        >
                            Lihat selengkapnya
                            <ArrowRight
                                size={18}
                                className="text-white transition-transform group-hover:translate-x-1"
                            />
                        </motion.button>
                    </motion.div>
                </div>

                <GallerySection />
                {/* Desain Kartu Original (Rounded-t-40px) dipadukan dengan fitur konversi booking */}
                <div className="bg-white pb-32">
                    <div className="mx-auto max-w-[1200px] px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUpVariant}
                            className="mb-12"
                        >
                            <h2 className="mb-4 text-3xl font-normal tracking-tight text-[#1a1a1a] md:text-[40px]">
                                Featured stays
                            </h2>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                            className="grid grid-cols-1 gap-8 md:grid-cols-2"
                        >
                            {featuredStays?.map((room: any, idx: number) => (
                                <motion.div
                                    key={room.id || idx}
                                    variants={hoverCardVariant}
                                    initial="rest"
                                    whileHover="hover"
                                    className="group relative flex cursor-pointer flex-col"
                                >
                                    <div className="relative mb-6 h-[400px] overflow-hidden rounded-[40px] shadow-sm">
                                        <motion.img
                                            variants={{
                                                hover: { scale: 1.08 },
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: 'easeOut',
                                            }}
                                            src={room.image}
                                            alt={room.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-transparent" />

                                        {room.tag && (
                                            <div
                                                className={`absolute top-6 left-6 flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium backdrop-blur-md ${room.tagColor}`}
                                            >
                                                {room.tagIcon} {room.tag}
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-2">
                                        <div className="mb-2 flex items-start justify-between">
                                            <h3 className="text-2xl font-normal text-[#1a1a1a]">
                                                {room.title}
                                            </h3>
                                            <p className="text-xl font-medium text-[#1a1a1a]">
                                                {room.price}{' '}
                                                <span className="text-sm font-normal text-[#8c8c8c]">
                                                    / night
                                                </span>
                                            </p>
                                        </div>
                                        <div className="mb-6 flex items-center gap-4 text-sm text-[#6b6b6b]">
                                            <span className="flex items-center gap-1.5">
                                                <BedDouble size={16} />{' '}
                                                {room.beds} Bed
                                                {room.beds > 1 ? 's' : ''}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Wifi size={16} /> Fast Wi-Fi
                                            </span>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#e0e0e0] bg-transparent px-8 py-4 text-sm font-medium text-[#1a1a1a] transition-all group-hover:border-[#121212] group-hover:bg-[#121212] group-hover:text-white"
                                        >
                                            Book this stay{' '}
                                            <ArrowRight
                                                size={16}
                                                className="-ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100"
                                            />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Fasilitas Section (Converted to map logic & typed) */}
                <div
                    id="fasilitas"
                    className="border-y border-gray-100 bg-[#fafafa] py-24"
                >
                    <div className="mx-auto max-w-[1200px] px-8">
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUpVariant}
                            className="mb-16 text-center text-3xl font-normal tracking-tight text-[#1a1a1a] md:text-[40px]"
                        >
                            Fasilitas Unggulan Kami
                        </motion.h2>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-6 text-center md:grid-cols-4"
                        >
                            {dbFacilities?.map((fac: any, idx: number) => (
                                <motion.div
                                    key={fac.id || idx}
                                    variants={fadeUpVariant}
                                    whileHover={{
                                        y: -10,
                                        backgroundColor: '#ffffff',
                                        boxShadow:
                                            '0 20px 40px -15px rgba(0,0,0,0.05)',
                                    }}
                                    className="flex cursor-default flex-col items-center rounded-3xl bg-transparent p-8 transition-all"
                                >
                                    <motion.div
                                        whileHover={{
                                            rotate: [0, -10, 10, -5, 5, 0],
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className="mb-6 rounded-2xl bg-white p-4 text-[#1a1a1a] shadow-sm"
                                    >
                                        {getIcon(fac.icon)}
                                    </motion.div>
                                    <h4 className="mb-3 font-medium text-gray-900">
                                        {fac.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 text-center">
                                        {fac.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Location Section */}
                <div
                    id="lokasi"
                    className="border-t border-gray-100 bg-[#fafafa] py-24"
                >
                    <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-16 px-8 md:flex-row">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUpVariant}
                            className="md:w-1/2"
                        >
                            <h2 className="mb-6 text-3xl font-normal tracking-tight text-gray-900 md:text-[40px]">
                                {locationTitle}
                            </h2>
                            <p className="mb-10 text-lg leading-relaxed text-[#6b6b6b]">
                                {locationSubtitle}
                            </p>
                            <ul className="space-y-6">
                                {locations?.map((loc: any, i: number) => (
                                    <motion.li
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex cursor-default items-center gap-4 text-[#1a1a1a]"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <span className="block font-medium">
                                                {loc.text}
                                            </span>
                                            <span className="text-sm text-[#8c8c8c]">
                                                {loc.dist}
                                            </span>
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
                                src={locationImage}
                                alt="Bali Map View"
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-500 group-hover:bg-black/20">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-black shadow-xl"
                                >
                                    <Map size={18} /> Buka di Google Maps
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile First: Sticky CTA dengan Animasi Spring */}
                <AnimatePresence>
                    {showMobileCTA && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                            className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-gray-200 bg-white/90 px-6 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] backdrop-blur-md md:hidden"
                        >
                            <div>
                                <p className="text-[12px] font-medium text-[#8c8c8c]">
                                    Starts from
                                </p>
                                <p className="mt-0.5 text-lg leading-none font-medium text-[#1a1a1a]">
                                    Rp 3.2M
                                </p>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="rounded-full bg-[#121212] px-8 py-3.5 text-sm font-medium text-white shadow-lg"
                            >
                                Book now
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GuestLayout>
    );
}
