'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye,
  EyeOff,
  Building2,
  Home,
  UtensilsCrossed,
  User,
  Mail,
  Lock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

    if (formData.organizationName.trim().length < 2) {
      newErrors.organizationName = 'প্রতিষ্ঠানের নাম কমপক্ষে ২ অক্ষরের হতে হবে';
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = 'আপনার নাম কমপক্ষে ২ অক্ষরের হতে হবে';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'অনুগ্রহ করে একটি সঠিক ইমেইল অ্যাড্রেস লিখুন';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'পাসওয়ার্ড দুটি মিলছে না';
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
          organizationName: formData.organizationName.trim(),
          organizationType: formData.organizationType,
          organizationDescription: formData.organizationDescription.trim(),
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?registered=true');
      } else {
        setGeneralError(data.error || 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।');
      }
    } catch (error) {
      setGeneralError('রেজিস্ট্রেশন করার সময় ত্রুটি ঘটেছে। ইন্টারনেট সংযোগ চেক করুন।');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const orgTypes = [
    {
      id: 'mess' as const,
      title: 'মেস (Mess)',
      subtitle: 'ব্যাচেলর বা ফ্ল্যাট মেস',
      icon: Home,
    },
    {
      id: 'hostel' as const,
      title: 'হোস্টেল (Hostel)',
      subtitle: 'ছাত্রাবাস বা কর্মী হোস্টেল',
      icon: Building2,
    },
    {
      id: 'restaurant' as const,
      title: 'ডাইনিং (Dining)',
      subtitle: 'ক্যান্টিন বা ডাইনিং সার্ভিস',
      icon: UtensilsCrossed,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-500 selection:text-black transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Navigation */}
      <header className="w-full border-b border-border/60 backdrop-blur-md bg-background/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>হোমে ফিরে যান</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20">
              <Image
                src="/icons/icon-512x512.png"
                alt="MealManager Logo"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
              MealManager
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                BD
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-auto">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Visual Showcase */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block">
            {/* Free Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>১০০% ফ্রি রেজিস্ট্রেশন — কোনো ফি নেই</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-black text-foreground tracking-tight leading-tight">
                মেসের খাতার দিন শেষ,{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  স্মার্ট মেস ম্যানেজমেন্ট
                </span>{' '}
                শুরু করুন আজই!
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                মাস শেষে ক্যালকুলেটর নিয়ে কাটাকাটি আর হিসাবের গরমিলের ঝামেলা চিরতরে বন্ধ করুন।
                MealManager দিয়ে কয়েক সেকেন্ডেই আপনার মেস সম্পূর্ণ ক্লাউডে নিয়ে আসুন।
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">স্বয়ংক্রিয় মিল রেট হিসাব</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    মোট বাজার খরচকে খাওয়া মিল দিয়ে ভাগ করে নিখুঁত লাইভ মিল রেট বের হয়।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">দৈনিক বাজার ও খরচ ভাউচার</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    কে কত টাকার বাজার করল তার ক্যাটাগরি ও তারিখভিত্তিক স্বচ্ছ হিসাব।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">ইউটিলিটি ও শেয়ার্ড খরচ বন্টন</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    বুয়া, গ্যাস, কারেন্ট ও ওয়াইফাই বিল সব মেম্বারদের মাঝে সমানভাগে ভাগ।
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Quote Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-foreground italic leading-relaxed">
                &ldquo;ফার্মগেটের মেসে আগে প্রতি মাসের শেষ ৩ দিন খাতা মেলাতে মাথা নষ্ট হতো। MealManager নেওয়ার পর এখন ১ ক্লিকেই সবার হিসাব পানির মতো পরিষ্কার!&rdquo;
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  ত
                </div>
                <span className="text-xs font-semibold text-foreground">তানভীর আহমেদ</span>
                <span className="text-[10px] text-muted-foreground">• ইন্দিরা রোড, ফার্মগেট</span>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-7">
            <div className="bg-card text-card-foreground border border-border shadow-xl shadow-emerald-500/5 rounded-3xl p-6 sm:p-8 md:p-10 relative">
              
              {/* Card Header */}
              <div className="mb-6 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>অ্যাডমিন রেজিস্ট্রেশন</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  নতুন মেস / প্রতিষ্ঠান তৈরি করুন
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  আপনার মেসের নাম ও অ্যাডমিন অ্যাকাউন্ট দিয়ে কয়েক সেকেন্ডেই শুরু করুন।
                </p>
              </div>

              {/* General Error Display */}
              {generalError && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                  <span>{generalError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECTION 1: ORGANIZATION DETAILS */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      ১
                    </span>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      মেস বা প্রতিষ্ঠানের তথ্য
                    </h3>
                  </div>

                  {/* Organization Type Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      প্রতিষ্ঠানের ধরন নির্বাচন করুন
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {orgTypes.map((type) => {
                        const isSelected = formData.organizationType === type.id;
                        const IconComponent = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, organizationType: type.id })}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left relative ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-xs'
                                : 'border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <IconComponent className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="text-xs font-bold block">{type.title}</span>
                            <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
                              {type.subtitle}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-primary absolute top-2 right-2 hidden sm:block" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Organization Name */}
                  <div className="space-y-1">
                    <Input
                      label="মেস বা প্রতিষ্ঠানের নাম"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      error={errors.organizationName}
                      placeholder="যেমন: ধানমন্ডি ব্যাচেলর মেস"
                      required
                    />
                  </div>

                  {/* Description (Optional) */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      ঠিকানা বা বিবরণ (ঐচ্ছিক)
                    </label>
                    <textarea
                      value={formData.organizationDescription}
                      onChange={(e) => setFormData({ ...formData, organizationDescription: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-input bg-background rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm resize-none"
                      placeholder="যেমন: বাসা নং ১২, রোড ৪, সেক্টর ১০, উত্তরা, ঢাকা"
                    />
                  </div>
                </div>

                {/* SECTION 2: ADMIN ACCOUNT DETAILS */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-border/60">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      ২
                    </span>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      ম্যানেজার / অ্যাডমিন অ্যাকাউন্ট
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="আপনার পুরো নাম"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                      placeholder="যেমন: তানভীর আহমেদ"
                      required
                    />

                    <Input
                      label="ইমেইল অ্যাড্রেস"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                      placeholder="manager@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="পাসওয়ার্ড"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      error={errors.password}
                      placeholder="••••••••"
                      helperText="কমপক্ষে ৬ অক্ষর"
                      required
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground focus:outline-none p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />

                    <Input
                      label="পাসওয়ার্ড নিশ্চিত করুন"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      error={errors.confirmPassword}
                      placeholder="••••••••"
                      required
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-muted-foreground hover:text-foreground focus:outline-none p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 space-y-4">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full h-13 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <span>মেস অ্যাকাউন্ট তৈরি করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    আগে থেকেই মেস রেজিস্টার করা আছে?{' '}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary/80 font-bold hover:underline"
                    >
                      লগইন করুন
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} MealManager BD — বাংলাদেশের সেরা মেস ও হোস্টেল মিল ম্যানেজমেন্ট সিস্টেম
      </footer>
    </div>
  );
}
