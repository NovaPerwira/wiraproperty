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
    const { errors: pageErrors } = usePage().props as unknown as {
        errors: Record<string, string>;
    };

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
    const nights = Math.max(
        1,
        Math.round((cout.getTime() - cin.getTime()) / (1000 * 3600 * 24)),
    );
    const total = parseFloat(roomType.base_price) * nights;

    return (
        <div className="min-h-screen bg-[#fcfbf9] pb-20 font-sans text-gray-900 md:pb-0">
            <Head title="Checkout - Stayli">
                {/* Mocking Invisible reCAPTCHA script load */}
                <script
                    src="https://www.google.com/recaptcha/api.js?render=explicit"
                    async
                    defer
                ></script>
            </Head>
            <Navbar />

            <div className="mx-auto max-w-5xl px-6 pt-32 pb-16">
                <Link
                    href={`/search-rooms?checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&guests=${searchParams.guests}`}
                    className="mb-10 flex w-fit items-center gap-2 text-gray-500 transition-colors hover:text-black"
                >
                    <ArrowLeft size={16} /> Back to results
                </Link>

                <h1 className="mb-8 text-4xl font-light tracking-tight text-[#1a2320] md:text-5xl">
                    Secure your <span className="font-medium">Stay.</span>
                </h1>

                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Left - Form */}
                    <div className="lg:w-2/3">
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
                        >
                            <h2 className="mb-6 text-2xl font-medium">
                                Guest Identity
                            </h2>

                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.guest_name}
                                        onChange={(e) =>
                                            setData(
                                                'guest_name',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-[#121212] focus:outline-none"
                                        placeholder="John Doe"
                                    />
                                    {errors.guest_name && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.guest_name}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.guest_email}
                                        onChange={(e) =>
                                            setData(
                                                'guest_email',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-[#121212] focus:outline-none"
                                        placeholder="john@example.com"
                                    />
                                    {errors.guest_email && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.guest_email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={data.guest_phone}
                                        onChange={(e) =>
                                            setData(
                                                'guest_phone',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-[#121212] focus:outline-none"
                                        placeholder="+62 812 3456 7890"
                                    />
                                    {errors.guest_phone && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.guest_phone}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Home Address
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.guest_address}
                                        onChange={(e) =>
                                            setData(
                                                'guest_address',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-[#121212] focus:outline-none"
                                        placeholder="123 Serenity Lane, Bali"
                                    />
                                    {errors.guest_address && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.guest_address}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Server-side availability error container */}
                            {pageErrors.availability && (
                                <div className="mb-6 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                    <ShieldCheck
                                        className="shrink-0"
                                        size={18}
                                    />
                                    <span className="text-sm">
                                        {pageErrors.availability}
                                    </span>
                                </div>
                            )}

                            {/* Invisible ReCaptcha widget holder */}
                            <div
                                ref={recaptchaRef}
                                className="g-recaptcha"
                                data-sitekey="dummy-site_key"
                                data-size="invisible"
                            ></div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#121212] px-8 py-4 text-lg font-medium text-white shadow-lg transition-colors hover:bg-black disabled:opacity-50"
                            >
                                {processing
                                    ? 'Processing...'
                                    : 'Confirm Reservation'}
                                {!processing && (
                                    <ShieldCheck
                                        size={18}
                                        className="text-green-400"
                                    />
                                )}
                            </button>
                            <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-gray-500">
                                Protected by Google reCAPTCHA.{' '}
                                <a href="#" className="underline">
                                    Privacy
                                </a>{' '}
                                &{' '}
                                <a href="#" className="underline">
                                    Terms
                                </a>
                                .
                            </p>
                        </form>
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32 rounded-3xl bg-[#f0ece1] p-8">
                            <h3 className="mb-6 text-xl font-medium">
                                Reservation Details
                            </h3>
                            <div className="mb-8 space-y-4">
                                <div>
                                    <p className="mb-1 text-sm text-gray-500">
                                        Room Type
                                    </p>
                                    <p className="text-lg font-medium text-[#1a2320]">
                                        {roomType.name}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-gray-300 pt-4">
                                    <div>
                                        <p className="mb-1 text-sm text-gray-500">
                                            Check-in
                                        </p>
                                        <p className="font-medium">
                                            {searchParams.checkin}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-sm text-gray-500">
                                            Check-out
                                        </p>
                                        <p className="font-medium">
                                            {searchParams.checkout}
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-300 pt-4">
                                    <p className="mb-1 text-sm text-gray-500">
                                        Guests
                                    </p>
                                    <p className="font-medium">
                                        {searchParams.guests} Person(s)
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white/50 p-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-gray-600">
                                        Rp{' '}
                                        {Number(
                                            roomType.base_price,
                                        ).toLocaleString('id-ID')}{' '}
                                        x {nights} nights
                                    </span>
                                    <span className="font-medium">
                                        Rp {total.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-gray-300 pt-4 text-xl font-bold text-[#1a2320]">
                                    <span>Total</span>
                                    <span>
                                        Rp {total.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
