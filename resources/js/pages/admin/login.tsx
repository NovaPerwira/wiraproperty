import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
    status?: string;
};

export default function AdminLogin({ status }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'superadmin@demo.com',
        password: 'password',
        remember: false as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Admin Login"
            description="Sign in to the admin dashboard"
        >
            <Head title="Admin Login" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="admin@example.com"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            id="remember"
                            type="checkbox"
                            tabIndex={3}
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Sign in
                    </Button>
                </div>

                <div className="mt-2 rounded-md border bg-muted/30 p-3 text-center text-xs text-muted-foreground">
                    <p className="mb-1 font-semibold">Demo Credentials:</p>
                    <p>superadmin@demo.com / admin@demo.com</p>
                    <p className="mt-0.5">Password: <strong>password</strong></p>
                </div>
            </form>
        </AuthLayout>
    );
}
