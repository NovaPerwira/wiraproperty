import React from 'react';
import { motion, Variants } from 'framer-motion';
import { BedDouble, Wifi, ArrowRight, CheckCircle2 } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

interface RoomType {
    id: number;
    name: string;
    base_price: number;
    capacity: number;
    amenities: string[];
}

interface Props {
    roomTypes: RoomType[];
}

// Fallback images based on room type index
const ROOM_IMAGES = [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
];

export default function Stays({ roomTypes }: Props) {
    const fadeUpVariant: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const formatRupiah = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <PublicLayout title="Our Stays">
            <div className="pt-32 pb-24 bg-[#0A0A0A] border-b border-white/10 min-h-[40vh] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                    <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-normal tracking-tight mb-6">
                        Exquisite <span className="italic text-white/70">Sanctuaries</span>
                    </motion.h1>
                    <motion.p variants={fadeUpVariant} className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
                        Discover your perfect getaway. Every room is designed to blend modern luxury with the breathtaking serenity of our surroundings, offering an unparalleled living experience.
                    </motion.p>
                </motion.div>
            </div>

            <div className="py-24 bg-[#fafafa]">
                <div className="max-w-[1200px] mx-auto px-8">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {roomTypes.map((room, idx) => (
                            <motion.div
                                key={room.id}
                                variants={fadeUpVariant}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                            >
                                <div className="h-[320px] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 z-10 transition-opacity group-hover:opacity-0" />
                                    <img
                                        src={ROOM_IMAGES[idx % ROOM_IMAGES.length]}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {idx === 0 && (
                                        <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg">
                                            Popular
                                        </div>
                                    )}
                                    {idx === 1 && (
                                        <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5">
                                            <CheckCircle2 size={14} className="text-green-600" /> Free Cancellation
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-semibold text-[#1a1a1a] group-hover:text-black transition-colors">{room.name}</h3>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#1a1a1a]">{formatRupiah(room.base_price)}</p>
                                            <p className="text-sm font-normal text-[#8c8c8c]">/ night</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-[#6b6b6b] text-sm mb-6 flex-wrap">
                                        <span className="flex items-center gap-1.5"><BedDouble size={16} /> Up to {room.capacity} Guests</span>
                                        {room.amenities && room.amenities.slice(0, 2).map((amenity, i) => (
                                            <span key={i} className="flex items-center gap-1.5"><Wifi size={16} /> {amenity}</span>
                                        ))}
                                    </div>
                                    <motion.a
                                        href="/checkout"
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-transparent border border-[#e0e0e0] text-[#1a1a1a] px-8 py-4 rounded-full text-sm font-medium transition-all group-hover:bg-[#121212] group-hover:border-[#121212] group-hover:text-white flex items-center justify-center gap-2"
                                    >
                                        Reserve {room.name} <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    </motion.a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
