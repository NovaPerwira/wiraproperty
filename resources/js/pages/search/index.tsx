import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import { motion } from 'framer-motion';
import { BedDouble, Users, Wifi, ArrowRight } from 'lucide-react';

interface RoomType {
    id: number;
    name: string;
    description: string;
    base_price: string;
    capacity: number;
    amenities: string[];
    available_rooms_count: number;
}

interface SearchProps {
    searchParams: {
        checkin: string;
        checkout: string;
        guests: number;
    };
    roomTypes: RoomType[];
}

export default function SearchResults({
    searchParams,
    roomTypes,
}: SearchProps) {
    return (
        <div className="min-h-screen bg-[#fcfbf9] pb-20 font-sans text-gray-900 md:pb-0">
            <Head title="Search Results - Stayli" />
            <Navbar />
            {/* Header */}
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between border-b border-gray-200 px-6 pt-32 pb-16 md:flex-row md:items-end">
                <div>
                    <h1 className="mb-4 text-4xl font-light tracking-tight text-[#1a2320] md:text-5xl">
                        Available{' '}
                        <span className="font-medium">Sanctuaries</span>
                    </h1>
                    <p className="text-lg text-gray-500">
                        {searchParams.checkin} &rarr; {searchParams.checkout}{' '}
                        &bull; {searchParams.guests} Guest(s)
                    </p>
                </div>
                <Link
                    href="/"
                    className="mt-6 text-gray-500 underline underline-offset-4 transition-colors hover:text-black md:mt-0"
                >
                    Modify Search
                </Link>
            </div>

            {/* Results Grid */}
            <div className="mx-auto max-w-6xl px-6 py-16">
                {roomTypes.length === 0 ? (
                    <div className="py-20 text-center">
                        <h3 className="mb-2 text-2xl font-medium">
                            No rooms available
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your dates or guest count.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {roomTypes.map((rt) => (
                            <motion.div
                                key={rt.id}
                                whileHover={{ y: -8 }}
                                className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                            >
                                <div className="relative mb-6 h-64 overflow-hidden rounded-2xl bg-gray-100">
                                    {/* Placeholder image, later can be connected to media library */}
                                    <img
                                        src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt={rt.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 shadow-sm backdrop-blur">
                                        {rt.available_rooms_count} left!
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <div className="mb-2 flex items-start justify-between">
                                            <h3 className="text-xl font-medium text-gray-900">
                                                {rt.name}
                                            </h3>
                                            <div className="ml-4 text-right whitespace-nowrap">
                                                <span className="text-lg font-medium">
                                                    Rp{' '}
                                                    {Number(
                                                        rt.base_price,
                                                    ).toLocaleString('id-ID')}
                                                </span>
                                                <span className="block text-xs text-gray-500">
                                                    / night
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mb-6 line-clamp-2 text-sm text-gray-500">
                                            {rt.description}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <Users size={16} /> Up to{' '}
                                                {rt.capacity}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Wifi size={16} /> Wi-Fi
                                            </span>
                                        </div>
                                        <Link
                                            href={`/checkout?room_type_id=${rt.id}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&guests=${searchParams.guests}`}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#121212] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
                                        >
                                            Book Now <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
