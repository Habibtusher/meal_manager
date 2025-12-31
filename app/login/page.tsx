'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setGeneralError('Invalid email or password');
            } else if (result?.ok) {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            setGeneralError('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Meal Manager
                    </h1>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {generalError && (
                                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                                    {generalError}
                                </div>
                            )}

                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                error={errors.email}
                                placeholder="you@example.com"
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                error={errors.password}
                                placeholder="••••••••"
                                required
                            />

                            <div className="flex items-center justify-between text-sm">
                                <Link
                                    href="/register"
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Create an account
                                </Link>
                                <Link
                                    href="/forgot-password"
                                    className="text-gray-600 hover:text-gray-700"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" isLoading={isLoading} className="w-full">
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don&apos;t have an organization?{' '}
                    <Link
                        href="/register"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Register your mess/hostel
                    </Link>
                </p>
            </div>
        </div>
    );
}
