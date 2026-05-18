import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
    ArrowRight,
    MapPin,
    Star,
    BedDouble,
    Bath,
    Maximize2,
    TreePine,
    Building2,
    TrendingUp,
    MessageCircle,
} from 'lucide-react';

const WA_NUMBER = '6285739493437';

export interface PropertyItem {
    id: number;
    name: string;
    category?: string;
    location?: string;
    price_formatted?: string;
    price?: string; // fallback for hardcoded data
    size?: string;
    beds?: number | null;
    baths?: number | null;
    zoning?: string;
    rating?: number;
    tag?: string;
    main_image?: string;
    is_active?: boolean;
}

interface PropertyCardProps {
    item: PropertyItem;
    idx: number;
    fallbackImages: string[];
    accentColor?: string; // tailwind color class base, e.g. 'amber', 'blue', 'green'
    showType?: 'villa' | 'property' | 'tanah' | 'ruko';
    fadeUp: Variants;
}

export function PropertyCard({
    item,
    idx,
    fallbackImages,
    accentColor = 'amber',
    showType = 'villa',
    fadeUp,
}: PropertyCardProps) {
    const image = item.main_image || fallbackImages[idx % fallbackImages.length];
    const price = item.price_formatted || item.price;
    const isTanah = showType === 'tanah';
    const isRuko = showType === 'ruko';

    const colorMap: Record<string, { badge: string; star: string; btn: string; loc: string }> = {
        amber: {
            badge: 'bg-amber-500',
            star: 'fill-amber-400 text-amber-400',
            btn: 'group-hover:border-amber-500 group-hover:bg-amber-500',
            loc: 'text-amber-500',
        },
        blue: {
            badge: 'bg-blue-600',
            star: 'fill-blue-500 text-blue-500',
            btn: 'group-hover:border-blue-600 group-hover:bg-blue-600',
            loc: 'text-blue-500',
        },
        green: {
            badge: 'bg-green-700',
            star: 'fill-green-600 text-green-600',
            btn: 'group-hover:border-green-700 group-hover:bg-green-700',
            loc: 'text-green-600',
        },
        rose: {
            badge: 'bg-rose-600',
            star: 'fill-rose-500 text-rose-500',
            btn: 'group-hover:border-rose-600 group-hover:bg-rose-600',
            loc: 'text-rose-500',
        },
        violet: {
            badge: 'bg-violet-600',
            star: 'fill-violet-500 text-violet-500',
            btn: 'group-hover:border-violet-600 group-hover:bg-violet-600',
            loc: 'text-violet-500',
        },
    };

    const c = colorMap[accentColor] ?? colorMap.amber;

    return (
        <motion.div
            key={item.id}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
        >
            {/* Image */}
            <div className="relative h-[280px] overflow-hidden">
                <div className="absolute inset-0 z-10 bg-black/20 transition-opacity group-hover:opacity-0" />
                <img
                    src={image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => {
                        const el = e.currentTarget;
                        el.src = fallbackImages[idx % fallbackImages.length];
                    }}
                />
                {/* Tag badge */}
                {item.tag && (
                    <div className={`absolute top-4 left-4 z-20 rounded-full ${c.badge} px-3 py-1 text-xs font-semibold text-white shadow-md`}>
                        {item.tag}
                    </div>
                )}
                {/* Rating badge */}
                {item.rating != null && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1a1a1a] shadow backdrop-blur-sm">
                        <Star size={12} className={c.star} />
                        {item.rating}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Name & Price */}
                <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold text-[#1a1a1a] leading-tight">{item.name}</h3>
                    {price && (
                        <p className="shrink-0 text-base font-bold text-[#1a1a1a]">
                            {price}
                        </p>
                    )}
                </div>

                {/* Location */}
                {item.location && (
                    <p className="mb-4 flex items-center gap-1.5 text-sm text-[#6b6b6b]">
                        <MapPin size={14} className={c.loc} />
                        {item.location}
                    </p>
                )}

                {/* Stats row */}
                <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-[#6b6b6b]">
                    {!isTanah && !isRuko && item.beds != null && (
                        <span className="flex items-center gap-1.5">
                            <BedDouble size={15} /> {item.beds} Kamar
                        </span>
                    )}
                    {!isTanah && !isRuko && item.baths != null && (
                        <span className="flex items-center gap-1.5">
                            <Bath size={15} /> {item.baths} KM
                        </span>
                    )}
                    {isTanah && item.zoning && (
                        <span className="flex items-center gap-1.5">
                            <TreePine size={15} className="text-green-600" />
                            {item.zoning}
                        </span>
                    )}
                    {isRuko && (
                        <span className="flex items-center gap-1.5">
                            <Building2 size={15} />
                            Komersial
                        </span>
                    )}
                    {item.size && (
                        <span className="flex items-center gap-1.5">
                            <Maximize2 size={15} /> {item.size}
                        </span>
                    )}
                    {isTanah && (
                        <span className="flex items-center gap-1.5">
                            <TrendingUp size={15} className="text-emerald-600" />
                            Potensial
                        </span>
                    )}
                </div>

                {/* CTA */}
                <motion.a
                    href={`https://wa.me/${WA_NUMBER}?text=Halo%20Wira%20Property%2C%20saya%20tertarik%20dengan%20properti%20*${encodeURIComponent(item.name)}*${item.location ? `%20di%20${encodeURIComponent(item.location)}` : ''}%2C%20bisa%20info%20lebih%20lanjut%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full items-center justify-center gap-2 rounded-full border border-[#e0e0e0] bg-transparent px-8 py-3.5 text-sm font-medium text-[#1a1a1a] transition-all group-hover:text-white ${c.btn}`}
                >
                    <MessageCircle size={15} className="shrink-0" />
                    Hubungi via WhatsApp
                    <ArrowRight
                        size={15}
                        className="-ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100"
                    />
                </motion.a>
            </div>
        </motion.div>
    );
}
