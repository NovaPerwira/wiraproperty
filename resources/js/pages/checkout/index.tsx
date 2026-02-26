import React, { useRef } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface CheckoutProps {
    roomType: {
        id: number;
        name: string;
        base_price: string;
        capacity: number;
    };
    searchParams: {
        checkin: string;
        checkout: string;
        guests: number;
        room_type_id: string;
    };
}

export default function Checkout({ roomType, searchParams }: CheckoutProps) {
    const { errors: pageErrors } = usePage().props as unknown as { errors: Record<string, string> };

    const { data, setData, post, processing, errors } = useForm({
        room_type_id: roomType.id,
        checkin: searchParams.checkin,
        checkout: searchParams.checkout,
        guests: searchParams.guests,
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        guest_address: '',
        'g-recaptcha-response': '', // Will hold the invisible token
    });

    const recaptchaRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real integration, you would trigger window.grecaptcha.execute() here 
        // and await the token before calling `post`. For the sake of this prompt:
        post('/booking', {
            preserveScroll: true,
        });
    };

    // Calculate mock total
    const cin = new Date(searchParams.checkin);
    const cout = new Date(searchParams.checkout);
    const nights = Math.max(1, Math.round((cout.getTime() - cin.getTime()) / (1000 * 3600 * 24)));
    const total = parseFloat(roomType.base_price) * nights;

    return (
        <div className="bg-[#fcfbf9] min-h-screen font-sans text-gray-900 pb-20 md:pb-0">
            <Head title="Checkout - Stayli">
                {/* Mocking Invisible reCAPTCHA script load */}
                <script src="https://www.google.com/recaptcha/api.js?render=explicit" async defer></script>
            </Head>
            <Navbar />

            <div className="pt-32 pb-16 px-6 max-w-5xl mx-auto">
                <Link href={`/search-rooms?checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&guests=${searchParams.guests}`} className="flex items-center gap-2 text-gray-500 hover:text-black mb-10 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to results
                </Link>

                <h1 className="text-4xl md:text-5xl font-light text-[#1a2320] tracking-tight mb-8">
                    Secure your <span className="font-medium">Stay.</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left - Form */}
                    <div className="lg:w-2/3">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-medium mb-6">Guest Identity</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.guest_name}
                                        onChange={e => setData('guest_name', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#121212]"
                                        placeholder="John Doe"
                                    />
                                    {errors.guest_name && <span className="text-red-500 text-xs mt-1 block">{errors.guest_name}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.guest_email}
                                        onChange={e => setData('guest_email', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#121212]"
                                        placeholder="john@example.com"
                                    />
                                    {errors.guest_email && <span className="text-red-500 text-xs mt-1 block">{errors.guest_email}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={data.guest_phone}
                                        onChange={e => setData('guest_phone', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#121212]"
                                        placeholder="+62 812 3456 7890"
                                    />
                                    {errors.guest_phone && <span className="text-red-500 text-xs mt-1 block">{errors.guest_phone}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.guest_address}
                                        onChange={e => setData('guest_address', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#121212]"
                                        placeholder="123 Serenity Lane, Bali"
                                    />
                                    {errors.guest_address && <span className="text-red-500 text-xs mt-1 block">{errors.guest_address}</span>}
                                </div>
                            </div>

                            {/* Server-side availability error container */}
                            {pageErrors.availability && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex gap-2">
                                    <ShieldCheck className="shrink-0" size={18} />
                                    <span className="text-sm">{pageErrors.availability}</span>
                                </div>
                            )}

                            {/* Invisible ReCaptcha widget holder */}
                            <div ref={recaptchaRef} className="g-recaptcha" data-sitekey="dummy-site_key" data-size="invisible"></div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#121212] hover:bg-black text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Confirm Reservation'}
                                {!processing && <ShieldCheck size={18} className="text-green-400" />}
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                                Protected by Google reCAPTCHA. <a href="#" className="underline">Privacy</a> & <a href="#" className="underline">Terms</a>.
                            </p>
                        </form>
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#f0ece1] rounded-3xl p-8 sticky top-32">
                            <h3 className="text-xl font-medium mb-6">Reservation Details</h3>
                            <div className="space-y-4 mb-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Room Type</p>
                                    <p className="font-medium text-lg text-[#1a2320]">{roomType.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-300">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Check-in</p>
                                        <p className="font-medium">{searchParams.checkin}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Check-out</p>
                                        <p className="font-medium">{searchParams.checkout}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-300">
                                    <p className="text-sm text-gray-500 mb-1">Guests</p>
                                    <p className="font-medium">{searchParams.guests} Person(s)</p>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Rp {Number(roomType.base_price).toLocaleString('id-ID')} x {nights} nights</span>
                                    <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-xl mt-4 pt-4 border-t border-gray-300 text-[#1a2320]">
                                    <span>Total</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
