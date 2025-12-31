'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            We&apos;ll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                                <Button type="submit" isLoading={isLoading} className="w-full">
                                    Send Reset Link
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-gray-900 text-xl">Check your email</h3>
                                    <p className="text-gray-500 text-sm px-6">
                                        If an account exists for <span className="font-bold text-gray-900">{email}</span>, you will receive a password reset link shortly.
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
                                    Try another email
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
