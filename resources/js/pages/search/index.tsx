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

export default function SearchResults({ searchParams, roomTypes }: SearchProps) {
    return (
        <div className="bg-[#fcfbf9] min-h-screen font-sans text-gray-900 pb-20 md:pb-0">
            <Head title="Search Results - Stayli" />
            <Navbar />
            {/* Header */}
            <div className="pt-32 pb-16 px-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200">
                <div>
                    <h1 className="text-4xl md:text-5xl font-light text-[#1a2320] tracking-tight mb-4">
                        Available <span className="font-medium">Sanctuaries</span>
                    </h1>
                    <p className="text-lg text-gray-500">
                        {searchParams.checkin} &rarr; {searchParams.checkout} &bull; {searchParams.guests} Guest(s)
                    </p>
                </div>
                <Link href="/" className="mt-6 md:mt-0 text-gray-500 hover:text-black transition-colors underline underline-offset-4">
                    Modify Search
                </Link>
            </div>

            {/* Results Grid */}
            <div className="py-16 px-6 max-w-6xl mx-auto">
                {roomTypes.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-medium mb-2">No rooms available</h3>
                        <p className="text-gray-500">Try adjusting your dates or guest count.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {roomTypes.map(rt => (
                            <motion.div key={rt.id} whileHover={{ y: -8 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col group">
                                <div className="h-64 bg-gray-100 rounded-2xl mb-6 overflow-hidden relative">
                                    {/* Placeholder image, later can be connected to media library */}
                                    <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt={rt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-medium px-3 py-1.5 rounded-full shadow-sm text-gray-900 border border-gray-200">
                                        {rt.available_rooms_count} left!
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-medium text-gray-900">{rt.name}</h3>
                                            <div className="text-right whitespace-nowrap ml-4">
                                                <span className="text-lg font-medium">Rp {Number(rt.base_price).toLocaleString('id-ID')}</span>
                                                <span className="text-xs text-gray-500 block">/ night</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6 line-clamp-2">{rt.description}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5"><Users size={16} /> Up to {rt.capacity}</span>
                                            <span className="flex items-center gap-1.5"><Wifi size={16} /> Wi-Fi</span>
                                        </div>
                                        <Link
                                            href={`/checkout?room_type_id=${rt.id}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&guests=${searchParams.guests}`}
                                            className="w-full bg-[#121212] hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
