import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'User Management', href: '/users' },
];

const ROLE_COLORS: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    staff: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

interface User {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'staff';
    created_at: string;
}

interface UsersIndexProps {
    users: User[];
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const { auth } = usePage<{ auth: { user: { id: number; role: string } } }>().props;
    const [showCreate, setShowCreate] = useState(false);

    // Create user form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'staff' as 'admin' | 'staff',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                reset();
                setShowCreate(false);
            },
        });
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        router.patch(`/users/${userId}`, { role: newRole });
    };

    const handleDelete = (userId: number, name: string) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        router.delete(`/users/${userId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <p className="text-sm text-muted-foreground">Manage admins and staff members</p>
                    </div>
                    <button
                        onClick={() => setShowCreate((v) => !v)}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        {showCreate ? 'Cancel' : '+ Add User'}
                    </button>
                </div>

                {/* Create User Form */}
                {showCreate && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                        <h2 className="mb-4 text-base font-semibold">New User</h2>
                        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Full Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Full name"
                                    className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.name ? 'border-red-500' : 'border-input'}`}
                                />
                                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Email Address *</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="user@example.com"
                                    className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.email ? 'border-red-500' : 'border-input'}`}
                                />
                                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Password *</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min 8 characters"
                                    className={`rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${errors.password ? 'border-red-500' : 'border-input'}`}
                                />
                                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Confirm Password *</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Repeat password"
                                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Role *</label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value as 'admin' | 'staff')}
                                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                                >
                                    {processing ? 'Creating…' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/50 text-left text-xs font-semibold uppercase text-muted-foreground">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Joined</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-b border-sidebar-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-5 py-3 font-medium">{u.name}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_COLORS[u.role] ?? ''}`}>
                                                {u.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3">
                                            {!u.role.includes('super_admin') && u.id !== auth.user.id && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <select
                                                        defaultValue={u.role}
                                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                                                    >
                                                        <option value="staff">Staff</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleDelete(u.id, u.name)}
                                                        className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                            {(u.role === 'super_admin' || u.id === auth.user.id) && (
                                                <span className="block text-right text-xs text-muted-foreground italic">
                                                    {u.id === auth.user.id ? 'You' : 'Protected'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
