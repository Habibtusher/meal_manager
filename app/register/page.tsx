'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        organizationName: '',
        organizationType: 'mess' as 'mess' | 'hostel' | 'restaurant',
        organizationDescription: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.organizationName.length < 2) {
            newErrors.organizationName = 'Organization name must be at least 2 characters';
        }

        if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organizationName: formData.organizationName,
                    organizationType: formData.organizationType,
                    organizationDescription: formData.organizationDescription,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to login with success message
                router.push('/login?registered=true');
            } else {
                setGeneralError(data.error || 'Registration failed');
            }
        } catch (error) {
            setGeneralError('An error occurred during registration');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 px-4 py-12 relative">
            <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-2 duration-700">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Meal Manager
                    </h1>
                    <p className="text-muted-foreground mt-2">Create your organization account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Register Organization</CardTitle>
                        <CardDescription>
                            Set up your mess/hostel and create an admin account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {generalError && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                                    {generalError}
                                </div>
                            )}

                            {/* Organization Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Organization Details
                                </h3>

                                <Input
                                    label="Organization Name"
                                    value={formData.organizationName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, organizationName: e.target.value })
                                    }
                                    error={errors.organizationName}
                                    placeholder="My Mess"
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Organization Type
                                    </label>
                                    <select
                                        value={formData.organizationType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                organizationType: e.target.value as 'mess' | 'hostel' | 'restaurant',
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    >
                                        <option value="mess" className="bg-card">Mess</option>
                                        <option value="hostel" className="bg-card">Hostel</option>
                                        <option value="restaurant" className="bg-card">Restaurant</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={formData.organizationDescription}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                organizationDescription: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-input bg-background rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                        placeholder="Brief description of your organization"
                                    />
                                </div>
                            </div>

                            {/* Admin Details */}
                            <div className="space-y-4 pt-4 border-t border-border">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Admin Account
                                </h3>

                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    error={errors.name}
                                    placeholder="John Doe"
                                    required
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    error={errors.email}
                                    placeholder="admin@example.com"
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
                                    helperText="Minimum 6 characters"
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

                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    error={errors.confirmPassword}
                                    placeholder="••••••••"
                                    required
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    }
                                />
                            </div>

                            <Button type="submit" isLoading={isLoading} className="w-full">
                                Create Organization & Account
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-primary hover:text-primary/80 font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
