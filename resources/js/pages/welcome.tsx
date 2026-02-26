'use client'
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import {
  ChevronDown, MapPin, Calendar, Search,
  Wifi, Coffee, ShieldCheck, Map, Image as ImageIcon,
  CheckCircle2, Users, BedDouble, ArrowRight
} from 'lucide-react';
import { useForm, Head } from '@inertiajs/react';
import Navbar from '@/components/navbar';
// import ImpactSection from '@/components/impact';
import GallerySection from '@/components/galery';

// --- TYPES & INTERFACES ---

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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mr-2 ${props.className || ''}`} {...props}>
    <path d="M4 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H4V4Z" fill="white" />
    <path d="M8 8H12C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16H8V8Z" fill="#1a1a1a" />
  </svg>
);

// Data
const navItems: NavItem[] = [
  { name: 'Home', href: '#' },
  { name: 'Listings', href: '#' },
  { name: 'About Us', href: '#' },
  { name: 'Blog Posts', href: '#' },
  { name: 'Contact', href: '#' }
];

const facilitiesData: Facility[] = [
  { icon: <Wifi size={32} />, title: "Wi-Fi Berkecepatan Tinggi", desc: "Gratis di seluruh area" },
  { icon: <Map size={32} />, title: "Infinity Pool", desc: "Pemandangan menakjubkan" },
  { icon: <Coffee size={32} />, title: "Restoran & Bar", desc: "Sajian lokal & internasional" },
  { icon: <ShieldCheck size={32} />, title: "Keamanan 24/7", desc: "Ketenangan pikiran Anda" }
];

const roomsData: RoomStay[] = [
  {
    id: "stay-1",
    title: "Desert Modern Villa",
    price: "Rp 4.5M",
    beds: 2,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    tag: "Popular",
    tagColor: "bg-white/90 text-[#1a1a1a]"
  },
  {
    id: "stay-2",
    title: "Lakehouse Retreat",
    price: "Rp 3.2M",
    beds: 1,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    tag: "Free cancellation",
    tagColor: "bg-white/90 text-[#1a1a1a]",
    tagIcon: <CheckCircle2 size={14} className="text-green-600" />
  }
];

export default function App() {
  // State dengan tipe eksplisit
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMobileCTA, setShowMobileCTA] = useState<boolean>(false);

  // Efek Splashscreen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const hoverCardVariant: Variants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.01,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
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
    <>
      <Head title="Welcome | Stayli" />
      {/* Splash Screen Asli */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1a1a] text-white"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center text-4xl font-medium tracking-tight mb-8"
            >
              <Logo /> Stayli
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      <div ref={containerRef} className="bg-white min-h-screen font-sans text-gray-900 overflow-x-hidden relative pb-20 md:pb-0">

        {/* <LuxuryHero /> */}
        {/* Hero Section Asli dengan Parallax */}
        <div className="relative h-[125vh] w-full overflow-hidden flex flex-col items-center justify-start pt-[25vh]">
          <motion.div style={{ y: yParallax }} className="absolute inset-0 w-full h-[120vh] z-0 origin-top">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={!isLoading ? { scale: 1 } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"
              alt="Modern vacation home"
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay tipis */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 mix-blend-multiply" />

          </motion.div>

          <motion.div
            style={{ opacity: opacityText, y: yText }}
            className="relative z-10 text-center text-white px-6 w-full max-w-5xl mt-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-5xl md:text-7xl lg:text-[90px] font-normal tracking-tight leading-[1.05] mb-6 drop-shadow-lg"
            >
              Sanctuary of <br className="hidden md:block" />
              <span className="italic font-light">Elegance.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg font-light text-white/80 mb-12 max-w-md mx-auto leading-relaxed tracking-wide"
            >
              Curated spaces for the discerning traveler.
              Find your perfect escape.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium tracking-wide hover:bg-white hover:text-black transition-all duration-500 ease-out flex items-center justify-center gap-2 group">
                Book Your Stay
              </button>

              <button className="w-full sm:w-auto px-8 py-4 rounded-full text-white/80 font-medium tracking-wide hover:text-white transition-all duration-500 ease-out flex items-center justify-center gap-2 group">
                Explore Rooms
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>


          {/* Gradien putih halus yang asli */}
          <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />
        </div>

        {/* Integrasi Booking Form bergaya Minimalis */}
        <div className="relative z-30 max-w-[1000px] mx-auto px-6 -mt-32 md:-mt-24 mb-16">
          <form
            onSubmit={submitForm}
            className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-3 md:p-4 flex flex-col md:flex-row items-center gap-3 border border-gray-100 relative"
          >

            {/* Input Tanggal Interaktif */}
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "#f0f0f0" }}
              className="flex-1 w-full flex items-center gap-4 px-6 py-3 bg-[#f9f9f9] transition-colors rounded-2xl"
            >
              <Calendar className="text-[#5a5a4a]" size={22} />
              <div className="flex flex-col w-full relative">
                <span className="text-[11px] font-medium text-[#8c8c8c] uppercase tracking-wider">checkin</span>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={data.checkin}
                  onChange={e => setData('checkin', e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 text-[15px] font-medium text-[#1a1a1a] w-full outline-none"
                />
                {errors.checkin && <span className="absolute top-12 left-0 text-red-500 text-xs">{errors.checkin}</span>}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "#f0f0f0" }}
              className="flex-1 w-full flex items-center gap-4 px-6 py-3 bg-[#f9f9f9] transition-colors rounded-2xl"
            >
              <Calendar className="text-[#5a5a4a]" size={22} />
              <div className="flex flex-col w-full relative">
                <span className="text-[11px] font-medium text-[#8c8c8c] uppercase tracking-wider">checkout</span>
                <input
                  type="date"
                  required
                  min={data.checkin || new Date().toISOString().split('T')[0]}
                  value={data.checkout}
                  onChange={e => setData('checkout', e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 text-[15px] font-medium text-[#1a1a1a] w-full outline-none"
                />
                {errors.checkout && <span className="absolute top-12 left-0 text-red-500 text-xs">{errors.checkout}</span>}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "#f0f0f0" }}
              className="flex-1 w-full flex items-center gap-4 px-6 py-3 bg-[#f9f9f9] transition-colors rounded-2xl"
            >
              <Users className="text-[#5a5a4a]" size={22} />
              <div className="flex flex-col w-full relative">
                <span className="text-[11px] font-medium text-[#8c8c8c] uppercase tracking-wider">Guest</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={data.guests}
                  onChange={e => setData('guests', parseInt(e.target.value) || 1)}
                  className="bg-transparent border-none p-0 focus:ring-0 text-[15px] font-medium text-[#1a1a1a] w-full outline-none"
                />
                {errors.guests && <span className="absolute top-12 left-0 text-red-500 text-xs">{errors.guests}</span>}
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={processing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto bg-[#121212] hover:bg-black text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              <Search size={20} />
              <span className="font-medium">Cari</span>
            </motion.button>
          </form>
        </div>

        {/* Bagian Tentang & Fitur */}
        <div className="relative z-20 bg-[#f6f5ef] w-full flex justify-center">


          <div className="w-full bg-white max-w-[1440px] mx-auto px-8 lg:px-16  flex flex-col md:flex-row md:items-end justify-between gap-12 lg:gap-24">

            {/* Kolom Kiri: Judul dan Tombol */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              className="md:w-[55%]"
            >
              <h2 className="text-4xl md:text-5xl lg:text-[64px] leading-[1.1] font-light text-[#2c2c2c] tracking-tight mb-8">
                Where every corner tells <br />
                <span className="font-extrabold text-[#1a2320]">a story</span>
              </h2>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#1c2421] hover:bg-black text-white px-8 py-3.5 rounded-full text-[15px] font-medium transition-colors flex items-center gap-3"
              >
                See more projects

              </motion.button>
            </motion.div>

            {/* Kolom Kanan: Teks Paragraf */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              className="md:w-[45%] flex md:justify-end pb-2 md:pb-6"
            >
              <p className="text-[#3a3a3a] text-base md:text-lg lg:text-[20px] leading-relaxed max-w-[500px]">
                Explore Nuanu's living journey — where art, nature, and human spirit move together in endless creation.
              </p>
            </motion.div>

          </div>

        </div>
        <div className="w-full max-w-[1440px] mx-auto p-8 lg:px-16">

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col lg:flex-row gap-6"
          >
            {/* Bagian Kiri: Gambar Besar */}
            <motion.div
              variants={fadeUpVariant}
              className="lg:w-[55%] h-[400px] lg:h-[600px] rounded-[32px] overflow-hidden relative"
            >
              {/* Ganti src ini dengan gambar aslimu */}
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                alt="Nuanu landscape view"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </motion.div>

            {/* Bagian Kanan: Grid Statistik */}
            <div className="lg:w-[45%] grid grid-cols-2 grid-rows-2 gap-4 lg:gap-6 h-[400px] lg:h-[600px]">

              {/* Card 1: IDR 5.6 Billion (Memanjang ke bawah / 2 Baris) */}
              <motion.div
                variants={fadeUpVariant}
                className="col-span-1 row-span-2 bg-[#f6f4ed] rounded-[32px] p-6 lg:p-10 flex flex-col justify-between relative group hover:bg-[#efede5] transition-colors duration-300"
              >
                {/* Titik hitam di pojok kanan atas */}
                <div className="absolute top-8 right-8 w-2 h-2 bg-[#1a2320] rounded-full opacity-80" />

                <div className="mt-auto">
                  <h3 className="text-4xl lg:text-[56px] font-extrabold text-[#1a2320] leading-[1.1] tracking-tight mb-3">
                    IDR 5.6<br />Billion
                  </h3>
                  <p className="text-[#5a605e] text-base lg:text-lg">Distribute to impact</p>
                </div>
              </motion.div>

              {/* Card 2: 94.8% (Kanan Atas) */}
              <motion.div
                variants={fadeUpVariant}
                className="col-span-1 row-span-1 bg-[#f6f4ed] rounded-[32px] p-6 lg:p-10 flex flex-col justify-between relative group hover:bg-[#efede5] transition-colors duration-300"
              >
                <div className="absolute top-8 right-8 w-2 h-2 bg-[#1a2320] rounded-full opacity-80" />
                <div className="mt-auto">
                  <h3 className="text-4xl lg:text-5xl font-extrabold text-[#1a2320] leading-tight mb-2">
                    94.8%
                  </h3>
                  <p className="text-[#5a605e] text-base lg:text-lg">Waste recycling rate</p>
                </div>
              </motion.div>

              {/* Card 3: 14,000+ (Kanan Bawah) */}
              <motion.div
                variants={fadeUpVariant}
                className="col-span-1 row-span-1 bg-[#f6f4ed] rounded-[32px] p-6 lg:p-10 flex flex-col justify-between relative group hover:bg-[#efede5] transition-colors duration-300"
              >
                <div className="absolute top-8 right-8 w-2 h-2 bg-[#1a2320] rounded-full opacity-80" />
                <div className="mt-auto">
                  <h3 className="text-4xl lg:text-5xl font-extrabold text-[#1a2320] leading-tight mb-2">
                    14,000+
                  </h3>
                  <p className="text-[#5a605e] text-base lg:text-lg">Cultural Audiences</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Tombol Lihat Selengkapnya */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex justify-center lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1c2421] hover:bg-black text-white px-8 py-4 rounded-full text-[15px] font-medium transition-colors flex items-center gap-3 group"
            >
              Lihat selengkapnya
              <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

        </div>

        <GallerySection />
        {/* Desain Kartu Original (Rounded-t-40px) dipadukan dengan fitur konversi booking */}
        <div className="bg-white pb-32">
          <div className="max-w-[1200px] mx-auto px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="mb-12">
              <h2 className="text-3xl md:text-[40px] font-normal tracking-tight text-[#1a1a1a] mb-4">Featured stays</h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {roomsData.map((room) => (
                <motion.div
                  key={room.id}
                  variants={hoverCardVariant}
                  initial="rest"
                  whileHover="hover"
                  className="flex flex-col group cursor-pointer relative"
                >
                  <div className="h-[400px] rounded-[40px] overflow-hidden relative mb-6 shadow-sm">
                    <motion.img
                      variants={{ hover: { scale: 1.08 } }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={room.image}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

                    {room.tag && (
                      <div className={`absolute top-6 left-6 backdrop-blur-md px-4 py-2 rounded-full text-[13px] font-medium flex items-center gap-2 ${room.tagColor}`}>
                        {room.tagIcon} {room.tag}
                      </div>
                    )}
                  </div>

                  <div className="px-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-normal text-[#1a1a1a]">{room.title}</h3>
                      <p className="text-xl font-medium text-[#1a1a1a]">{room.price} <span className="text-sm font-normal text-[#8c8c8c]">/ night</span></p>
                    </div>
                    <div className="flex items-center gap-4 text-[#6b6b6b] text-sm mb-6">
                      <span className="flex items-center gap-1.5"><BedDouble size={16} /> {room.beds} Bed{room.beds > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1.5"><Wifi size={16} /> Fast Wi-Fi</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-transparent border border-[#e0e0e0] text-[#1a1a1a] px-8 py-4 rounded-full text-sm font-medium transition-all group-hover:bg-[#121212] group-hover:border-[#121212] group-hover:text-white flex items-center justify-center gap-2"
                    >
                      Book this stay <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Fasilitas Section (Converted to map logic & typed) */}
        <div id="fasilitas" className="bg-[#fafafa] py-24 border-y border-gray-100">
          <div className="max-w-[1200px] mx-auto px-8">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-3xl md:text-[40px] font-normal tracking-tight text-[#1a1a1a] mb-16 text-center">
              Fasilitas Unggulan Kami
            </motion.h2>
            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              {facilitiesData.map((fac, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpVariant}
                  whileHover={{ y: -10, backgroundColor: "#ffffff", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)" }}
                  className="flex flex-col items-center p-8 bg-transparent rounded-3xl transition-all cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-[#1a1a1a] mb-6 p-4 bg-white rounded-2xl shadow-sm"
                  >
                    {fac.icon}
                  </motion.div>
                  <h4 className="font-medium text-gray-900 mb-3">{fac.title}</h4>
                  <p className="text-sm text-gray-500">{fac.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Gallery Experience dengan Animasi Skala Dinamis */}
        <div id="galeri" className="py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="flex items-end justify-between mb-12">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-3xl md:text-[40px] font-normal tracking-tight text-[#1a1a1a]">
                Galeri Resor
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 font-medium text-[#1a1a1a] border border-gray-200 px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ImageIcon size={18} /> Lihat Semua Foto
              </motion.button>
            </div>

            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.02, zIndex: 10 }} className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl cursor-zoom-in group shadow-sm">
                <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Resort View" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
              <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.05, zIndex: 10 }} className="h-[180px] md:h-[240px] relative overflow-hidden rounded-3xl cursor-zoom-in group shadow-sm">
                <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Bedroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
              <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.05, zIndex: 10 }} className="h-[180px] md:h-[240px] relative overflow-hidden rounded-3xl cursor-zoom-in group shadow-sm">
                <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Bathroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
              <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.05, zIndex: 10 }} className="h-[180px] md:h-[240px] relative overflow-hidden rounded-3xl cursor-zoom-in group shadow-sm">
                <img src="https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Restaurant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
              <motion.div variants={fadeUpVariant} whileHover={{ scale: 1.05, zIndex: 10 }} className="h-[180px] md:h-[240px] relative overflow-hidden rounded-3xl cursor-pointer group shadow-sm">
                <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Spa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-3xl flex items-center justify-center text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                  +15 Foto Lainnya
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Location Section */}
        <div id="lokasi" className="py-24 bg-[#fafafa] border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
              className="md:w-1/2"
            >
              <h2 className="text-3xl md:text-[40px] font-normal text-gray-900 mb-6 tracking-tight">Lokasi Strategis di Tabanan</h2>
              <p className="text-[#6b6b6b] mb-10 text-lg leading-relaxed">
                Dikelilingi oleh keindahan alam Bali yang otentik, namun tetap mudah dijangkau dari berbagai destinasi populer.
              </p>
              <ul className="space-y-6">
                {[
                  { text: "Pantai Kedungu", dist: "10 Menit Berkendara" },
                  { text: "Tanah Lot Temple", dist: "15 Menit Berkendara" },
                  { text: "Canggu Area", dist: "30 Menit Berkendara" },
                  { text: "Bandara Ngurah Rai", dist: "1.5 Jam Berkendara" }
                ].map((loc, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 text-[#1a1a1a] cursor-default"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="font-medium block">{loc.text}</span>
                      <span className="text-sm text-[#8c8c8c]">{loc.dist}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="md:w-1/2 w-full h-[450px] bg-gray-200 rounded-[40px] overflow-hidden relative shadow-lg group"
            >
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Bali Map View" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-500">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
                  className="bg-white text-black px-8 py-4 rounded-full font-medium shadow-xl flex items-center gap-2"
                >
                  <Map size={18} /> Buka di Google Maps
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Sederhana (Sesuai dengan estetika Minimalis) */}
        <footer className="bg-white py-12 text-[#6b6b6b] text-sm relative z-20">
          <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center font-medium text-[#1a1a1a] cursor-pointer">
              <Logo /> Stayli
            </motion.div>
            <div className="flex space-x-8">
              <motion.a whileHover={{ y: -2, color: "#1a1a1a" }} href="#" className="transition-colors">Privacy</motion.a>
              <motion.a whileHover={{ y: -2, color: "#1a1a1a" }} href="#" className="transition-colors">Terms</motion.a>
              <motion.a whileHover={{ y: -2, color: "#1a1a1a" }} href="#" className="transition-colors">Sitemap</motion.a>
            </div>
            <p>&copy; {new Date().getFullYear()} Stayli Inc.</p>
          </div>
        </footer>

        {/* Mobile First: Sticky CTA dengan Animasi Spring */}
        <AnimatePresence>
          {showMobileCTA && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between"
            >
              <div>
                <p className="text-[12px] text-[#8c8c8c] font-medium">Starts from</p>
                <p className="font-medium text-[#1a1a1a] text-lg leading-none mt-0.5">Rp 3.2M</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-[#121212] text-white px-8 py-3.5 rounded-full font-medium text-sm shadow-lg"
              >
                Book now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}