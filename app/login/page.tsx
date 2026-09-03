'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const isRegistered = searchParams.get('registered') === 'true';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!formData.email.trim() || !formData.password) {
      setGeneralError('অনুগ্রহ করে আপনার ইমেইল এবং পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setGeneralError('ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setGeneralError('লগইন করার সময় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground border border-border shadow-2xl shadow-emerald-500/5 rounded-3xl p-6 sm:p-8 md:p-10 relative">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>নিরাপদ লগইন</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          অ্যাকাউন্টে সাইন ইন করুন
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          আপনার রেজিস্টার্ড ইমেইল ও পাসওয়ার্ড দিয়ে ড্যাশবোর্ডে প্রবেশ করুন।
        </p>
      </div>

      {/* Registration Success Banner */}
      {isRegistered && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" />
          <div>
            <p className="font-bold">রেজিস্ট্রেশন সফল হয়েছে!</p>
            <p className="text-xs opacity-90 mt-0.5">
              আপনার মেস অ্যাকাউন্ট তৈরি সম্পন্ন। এবার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।
            </p>
          </div>
        </div>
      )}

      {/* General Error Display */}
      {generalError && (
        <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-destructive" />
          <span className="leading-tight">{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Input
            label="ইমেইল অ্যাড্রেস"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="admin@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <Input
            label="পাসওয়ার্ড"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground focus:outline-none p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-bold hover:underline"
          >
            নতুন মেস রেজিস্টার করুন
          </Link>
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-13 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
        >
          <span>সাইন ইন করুন</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* Bottom info */}
      <div className="mt-8 pt-6 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          এখনো আপনার মেস বা হোস্টেলের অ্যাকাউন্ট নেই?{' '}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            ফ্রি মেস খুলুন
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-500 selection:text-black transition-colors duration-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

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
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Branding Showcase */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>বাংলাদেশের #১ ক্লাউড মেস প্ল্যাটফর্ম</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-black text-foreground tracking-tight leading-tight">
                স্মার্ট মেস সিস্টেমে{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  আপনাকে স্বাগতম
                </span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                আপনার মেস বা হোস্টেলের মিল শিডিউল, দৈনিক বাজার ও মেম্বারদের ব্যালেন্স রিয়েল-টাইমে ম্যানেজ করুন।
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
                    মোট বাজার ও খাওয়ার অনুপাতে লাইভ গড় মিল রেট।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">যেকোনো ডিভাইস থেকে অ্যাক্সেস</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    মোবাইল, ট্যাবলেট বা কম্পিউটার — সবসময় আপনার হাতের নাগালে।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">নিরাপদ ও নির্ভরযোগ্য ক্লাউড</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    হিসাব হারানোর কোনো ভয় নেই, ১০০% সুরক্ষিত ও স্বচ্ছ।
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/50 border border-border text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>সুপার অ্যাডমিন, মেস ম্যানেজার ও সাধারণ সদস্য — সবার জন্য আলাদা লগইন।</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Card */}
          <div className="lg:col-span-7 max-w-lg mx-auto w-full">
            <Suspense fallback={
              <div className="bg-card p-10 rounded-3xl border border-border text-center text-muted-foreground animate-pulse">
                লোড হচ্ছে...
              </div>
            }>
              <LoginContent />
            </Suspense>
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
