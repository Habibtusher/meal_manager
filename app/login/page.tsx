'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
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
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
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
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        error={errors.password}
                        placeholder="••••••••"
                        required
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        }
                    />

                    <div className="flex items-center justify-between text-sm">
                        <Link
                            href="/register"
                            className="text-primary hover:text-primary/80 font-medium"
                        >
                            Create an account
                        </Link>
                        <Link
                            href="/forgot-password"
                            className="text-muted-foreground hover:text-foreground transition-colors"
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
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 px-4 relative">
            <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-2 duration-700">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Meal Manager
                    </h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account</p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginContent />
                </Suspense>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Don&apos;t have an organization?{' '}
                    <Link
                        href="/register"
                        className="text-primary hover:text-primary/80 font-medium"
                    >
                        Register your mess/hostel
                    </Link>
                </p>
            </div>
        </div>
    );
}
