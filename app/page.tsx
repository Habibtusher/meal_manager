'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { LiveMealCalculator } from '@/components/landing/LiveMealCalculator';
import {
  Utensils,
  Shield,
  Zap,
  TrendingUp,
  Users,
  ArrowRight,
  ChefHat,
  Wallet,
  Clock,
  LayoutDashboard,
  Menu,
  X as CloseIcon,
  CheckCircle2,
  XCircle,
  Receipt,
  FileSpreadsheet,
  Building2,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Star,
  MapPin,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'মেস তৈরি করতে কি কোনো ফি দিতে হবে?',
      a: 'না! আপনি সম্পূর্ণ বিনামূল্যে মেস বা হোস্টেল রেজিস্টার করতে পারবেন এবং সাথে সাথেই মেম্বার যুক্ত করে মিল ও বাজার হিসাব শুরু করতে পারবেন।'
    },
    {
      q: 'মেম্বাররা কি তাদের নিজস্ব হিসাব ও মিল হিস্ট্রি দেখতে পারবে?',
      a: 'হ্যাঁ, প্রতিটি মেম্বারের জন্য আলাদা ড্যাশবোর্ড রয়েছে। মেম্বাররা নিজেদের লগইন থেকে পুরো মাসের মিল হিস্ট্রি, প্রতিদিনের মিল সংখ্যা, বর্তমান মিল রেট এবং তাদের চলতি ব্যালেন্স দেখতে পারে।'
    },
    {
      q: 'বুয়া, গ্যাস, ওয়াইফাই ও রুম ভাড়ার মতো শেয়ার্ড খরচ কিভাবে হিসাব হয়?',
      a: 'MealManager-এ বিশেষ শেয়ার্ড কস্ট ফিচার রয়েছে। এখানে গ্যাস, বুয়া বা ওয়াইফাই বিল এন্ট্রি করলে তা স্বয়ংক্রিয়ভাবে সব মেম্বারদের মাঝে সমানভাবে বন্টন হয়ে যায়।'
    },
    {
      q: 'মেম্বারদের অগ্রিম জমার হিসাব কিভাবে রাখা হয়?',
      a: 'মেম্বাররা মেস ম্যানেজারকে যে টাকা অগ্রিম দেয়, ম্যানেজার তা মেম্বারের ওয়ালেটে ডিপোজিট হিসেবে এন্ট্রি করে রাখেন। মিল খাওয়া ও খরচের সাথে সাথে সেই ব্যালেন্স স্বয়ংক্রিয়ভাবে সমন্বয় হয়।'
    },
    {
      q: 'মাস শেষে কি মেসের ফুল স্টেটমেন্ট ডাউনলোড বা প্রিন্ট করা যাবে?',
      a: 'অবশ্যই! এক ক্লিকেই পুরো মাসের মেম্বার সামারি, মিল সংখ্যা, মিল খরচ, শেয়ার্ড খরচ এবং ফাইনাল ব্যালেন্সের পূর্ণাঙ্গ রিপোর্ট পাওয়া যায়।'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500 selection:text-black">
      {/* Top Banner for Bangladesh */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs md:text-sm font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
        <span>🇧🇩</span>
        <span>বাংলাদেশের সেরা মেস ও হোস্টেল মিল ম্যানেজমেন্ট সফটওয়্যার — খাতার হিসাবের দিন শেষ!</span>
        <Link href="/register" className="underline font-bold hover:text-emerald-100 hidden sm:inline ml-1">
          আজই ফ্রি শুরু করুন ➔
        </Link>
      </div>

      {/* Navbar - Glassmorphism */}
      <header className="px-4 md:px-8 h-20 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center gap-3 group" href="/">
          <div className="relative h-10 w-10 md:h-11 md:w-11 group-hover:scale-105 transition-transform">
            <Image
              src="/icons/icon-512x512.png"
              alt="MealManager Logo"
              width={48}
              height={48}
              className="rounded-xl shadow-lg shadow-emerald-500/20"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl md:text-2xl tracking-tight text-white flex items-center gap-1.5">
              MealManager
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                BD
              </span>
            </span>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-400 -mt-1">
              মেস ম্যানেজমেন্ট সফটওয়্যার
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden lg:flex gap-7 items-center">
          <Link className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors" href="#calculator">
            মিল রেট ক্যালকুলেটর
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors" href="#comparison">
            কেন সেরা?
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors" href="#features">
            ফিচারসমূহ
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors" href="#testimonials">
            ব্যবহারকারীদের মতামত
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors" href="#faq">
            প্রশ্নোত্তর
          </Link>
          <Link className="text-sm font-semibold text-slate-300 hover:text-white transition-colors" href="/login">
            লগইন (Sign In)
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm" className="rounded-full px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 border-0">
              ফ্রি রেজিস্টার করুন
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            className="p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-slate-950 border-b border-slate-800 p-6 flex flex-col gap-5 lg:hidden animate-in slide-in-from-top duration-300 shadow-2xl z-50">
            <Link className="text-base font-semibold text-slate-200" href="#calculator" onClick={() => setIsMenuOpen(false)}>
              মিল রেট ক্যালকুলেটর
            </Link>
            <Link className="text-base font-semibold text-slate-200" href="#comparison" onClick={() => setIsMenuOpen(false)}>
              কেন সেরা?
            </Link>
            <Link className="text-base font-semibold text-slate-200" href="#features" onClick={() => setIsMenuOpen(false)}>
              ফিচারসমূহ
            </Link>
            <Link className="text-base font-semibold text-slate-200" href="#testimonials" onClick={() => setIsMenuOpen(false)}>
              ব্যবহারকারীদের মতামত
            </Link>
            <Link className="text-base font-semibold text-slate-200" href="#faq" onClick={() => setIsMenuOpen(false)}>
              প্রশ্নোত্তর
            </Link>
            <hr className="border-slate-800" />
            <Link className="text-base font-bold text-slate-200" href="/login" onClick={() => setIsMenuOpen(false)}>
              লগইন করুন (Sign In)
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full rounded-xl bg-emerald-500 text-slate-950 font-bold">
                ফ্রি রেজিস্টার করুন ➔
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 right-1/4 w-[400px] md:w-[700px] h-[400px] md:h-[600px] bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[300px] md:w-[600px] h-[300px] md:h-[500px] bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="container px-4 md:px-8 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14">

              {/* Left Column: Copy & CTAs */}
              <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl mx-auto lg:mx-0">
                {/* Localized Tag Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-bold shadow-sm mx-auto lg:mx-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>খাতার দিন শেষ — ব্যাচেলর মেস ম্যানেজমেন্ট এখন স্মার্ট</span>
                </div>

                {/* Primary Bengali Headline */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white">
                  মেসের মিল, বাজার ও <br className="hidden sm:block" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                    মিল রেট হিসাব করুন
                  </span>{' '}
                  ১ ক্লিকে!
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-slate-300 leading-relaxed font-normal">
                  বাংলাদেশের ব্যাচেলর মেস, ছাত্রাবাস ও হোস্টেলের জন্য অল-ইন-ওয়ান ক্লাউড সফটওয়্যার।
                  দৈনিক বাজার, মিল শিডিউল এবং মাস শেষে নিখুঁত মিল রেট হিসাব এখন কাটাকাটি ছাড়া সবার কাছে স্বচ্ছ!
                </p>

                {/* Feature Highlights Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs md:text-sm text-slate-300 font-medium">
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>অটোমেটিক মিল রেট</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>দৈনিক বাজার হিসাব</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>অগ্রিম ডিপোজিট ট্র্যাকিং</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>বুয়া ও গ্যাস বিল ভাগ</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>মেম্বার মিল হিস্ট্রি</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>মাস শেষে ফুল রিপোর্ট</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full rounded-2xl h-14 px-8 text-base md:text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-xl shadow-emerald-500/20 border-0 flex items-center justify-center gap-2">
                      ফ্রি মেস রেজিস্টার করুন <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <a href="#calculator" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 px-8 text-base md:text-lg font-bold bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                      লাইভ মিল রেট ক্যালকুলেটর
                    </Button>
                  </a>
                </div>

                {/* Trust Proof */}
                <div className="flex items-center gap-4 pt-3 justify-center lg:justify-start text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>
                    ঢাকা, চট্টগ্রাম ও বিভিন্ন বিশ্ববিদ্যালয়ের <strong className="text-white">৫০০+ মেস ও হোস্টেল</strong> পরিচালনায় বিশ্বস্ত।
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Visual Showcase */}
              <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                <div className="relative p-2 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-[28px] shadow-2xl overflow-hidden group">
                  <div className="relative rounded-[22px] overflow-hidden aspect-[16/10] bg-slate-950">
                    <Image
                      src="/assets/admin-dashboard.png"
                      alt="MealManager Bengali Mess Dashboard"
                      className="object-cover object-top w-full h-full transform transition-transform duration-700 group-hover:scale-105 opacity-90"
                      width={1200}
                      height={750}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Floating Stat Badge 1: Meal Rate */}
                  <div className="absolute top-6 -left-4 bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-1000">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ৳
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">আজকের মিল রেট</p>
                      <p className="text-base font-black text-emerald-400 font-mono">৳ ৫২.৫০</p>
                    </div>
                  </div>

                  {/* Floating Stat Badge 2: Member Deposit */}
                  <div className="absolute bottom-8 -right-4 bg-slate-900/90 border border-blue-500/40 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">অগ্রিম মেম্বার জমা</p>
                      <p className="text-sm font-bold text-white">৳ ৩,৫০০ (তানভীর আহমেদ)</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 h-36 w-36 bg-emerald-500/20 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-6 -left-6 h-36 w-36 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE LIVE MEAL CALCULATOR */}
        <section id="calculator" className="w-full py-16 md:py-24 bg-slate-900/60 border-y border-slate-800/80 relative">
          <div className="container px-4 md:px-8 mx-auto">
            <LiveMealCalculator />
          </div>
        </section>

        {/* SECTION: MANUAL KHATA VS MEALMANAGER COMPARISON */}
        <section id="comparison" className="w-full py-16 md:py-24 bg-slate-950 relative">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-14 md:mb-18 space-y-3">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">
                কেন আপনি MealManager বেছে নেবেন?
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                পুরনো খাতা বনাম ডিজিটাল MealManager
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
                মাসের শেষে খাতা নিয়ে ঘণ্টার পর ঘণ্টা তর্কাতর্কি আর হিসাব না মেলার দিন এখন অতীত।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Old Traditional Khata Way */}
              <div className="bg-red-950/15 border border-red-500/20 rounded-3xl p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">প্রচলিত কাগজের খাতার হিসাব</h3>
                    <p className="text-xs text-red-300">ঝামেলা, ভুল ও সম্পর্কের অবনতি</p>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>খাতার পাতা হারিয়ে যাওয়া বা নষ্ট হয়ে যাওয়ার ঝুঁকি।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>কে কখন মিল কেটেছে বা বাড়িয়েছে তা নিয়ে মাস শেষে বিতর্ক।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>বুয়া, গ্যাস ও ওয়াইফাই বিল কে দিল আর কে বাকি রাখল মনে থাকে না।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>মাসের শেষ দিনে ক্যালকুলেটর নিয়ে হিসাব মেলাতে ঘণ্টার পর ঘণ্টা অপচয়।</span>
                  </li>
                </ul>
              </div>

              {/* MealManager Smart Way */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">MealManager স্মার্ট সমাধান</h3>
                    <p className="text-xs text-emerald-400">১০০% স্বচ্ছ, স্বয়ংক্রিয় ও নিখুঁত</p>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>ক্লাউডে নিরাপদ ডেটা — মোবাইল নষ্ট হলেও সব হিসাব অক্ষত থাকবে।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>অ্যাডমিন কর্তৃক দৈনিক সকাল, দুপুর ও রাতের মিল শিডিউল ও নির্ভুল কাউন্টিং।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>মেম্বারদের অগ্রিম ডিপোজিট জমা ও লো-ব্যালেন্স অ্যালার্টের স্বচ্ছ ব্যবস্থা।</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>এক ক্লিকেই অটোমেটিক মিল রেট ও পুরো মেসের মান্থলি শিট ডাউনলোড।</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: POWERFUL FEATURES */}
        <section id="features" className="w-full py-16 md:py-24 bg-slate-900/40 border-t border-slate-800">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20 space-y-3">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">ফিচারসমূহ</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                মেস পরিচালনার পূর্ণাঙ্গ ডিজিটাল সিস্টেম
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
                একটি আদর্শ ব্যাচেলর মেস ও হোস্টেল পরিচালনা করতে যা যা প্রয়োজন, সবকিছুই এক সফটওয়্যারে।
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <BanglaFeatureCard
                icon={<Utensils className="h-6 w-6 text-emerald-400" />}
                title="দৈনিক মিল শিডিউল ও এন্ট্রি"
                description="অ্যাডমিন খুব সহজে প্রতিদিনের মেনু ও মেম্বারদের মিল সংখ্যা সংরক্ষণ করতে পারেন। কোনো কাটাকাটি বা হিসাব হারানোর ভয় নেই।"
              />
              <BanglaFeatureCard
                icon={<Receipt className="h-6 w-6 text-blue-400" />}
                title="বাজার খরচ ও ভাউচার হিস্ট্রি"
                description="কে কত টাকার বাজার করল তার ক্যাটাগরি ও তারিখভিত্তিক নিখুঁত লগ। কাটাকাটির কোনো সুযোগ নেই।"
              />
              <BanglaFeatureCard
                icon={<TrendingUp className="h-6 w-6 text-amber-400" />}
                title="রিয়েল-টাইম অটো মিল রেট"
                description="মোট বাজার খরচকে মোট খাওয়া মিল দিয়ে ভাগ করে স্বয়ংক্রিয়ভাবে লাইভ মিল রেট বের করে।"
              />
              <BanglaFeatureCard
                icon={<Wallet className="h-6 w-6 text-purple-400" />}
                title="অগ্রিম ডিপোজিট ও ওয়ালেট ট্র্যাকিং"
                description="মেম্বারদের দেওয়া অগ্রিম জমার নিখুঁত হিসাব রাখুন। মিল খাওয়া ও অন্যান্য খরচের সাথে সাথে ব্যালেন্স স্বয়ংক্রিয়ভাবে সমন্বয় হয়।"
              />
              <BanglaFeatureCard
                icon={<Building2 className="h-6 w-6 text-rose-400" />}
                title="শেয়ার্ড ইউটিলিটি খরচ বন্টন"
                description="বুয়া বিল, গ্যাস, কারেন্ট ও ওয়াইফাই বিলের মতো স্থায়ী খরচ সব মেম্বারদের মাঝে সমানভাগে বন্টন।"
              />
              <BanglaFeatureCard
                icon={<FileSpreadsheet className="h-6 w-6 text-teal-400" />}
                title="মান্থলি সামারি ও রিপোর্ট শিট"
                description="মাস শেষে কোন মেম্বার কত টাকা পাবে বা দেবে, তার পরিষ্কার স্টেটমেন্ট পেয়ে যাবেন নিমিষেই।"
              />
            </div>
          </div>
        </section>

        {/* SECTION: COVERAGE ACROSS BANGLADESH */}
        <section className="w-full py-12 md:py-16 bg-slate-950 border-t border-slate-800">
          <div className="container px-4 md:px-8 mx-auto text-center space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              সারা বাংলাদেশের মেস হাবগুলোতে সক্রিয়
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto text-xs font-semibold text-slate-300">
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">ফার্মগেট, ঢাকা</span>
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">মিরপুর ১-১৪, ঢাকা</span>
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">ধানমন্ডি ও পান্থপথ</span>
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">মোহাম্মদপুর ও আদাবর</span>
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">আজিমপুর ও নীলক্ষেত</span>
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">চট্টগ্রাম চকবাজার ও জিইসি</span>
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">রাজশাহী বিশ্ববিদ্যালয় মেস</span>
              <span className="bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">সিলেট ও খুলনা ছাত্রাবাস</span>
            </div>
          </div>
        </section>

        {/* SECTION: AUTHENTIC BANGLADESHI TESTIMONIALS */}
        <section id="testimonials" className="w-full py-16 md:py-24 bg-slate-900/50 border-t border-slate-800">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">মতামত</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                মেস ম্যানেজাররা কী বলছেন?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <TestimonialCard
                quote="ফার্মগেটের মেসে আগে প্রতি মাসের শেষ ৩ দিন খাতা আর ভাউচার মেলাতে মেলাতে মাথা নষ্ট হতো। MealManager নেওয়ার পর এখন ১ ক্লিকেই সবার মিল রেট ও বকেয়া চোখের সামনে চলে আসে।"
                name="তানভীর আহমেদ"
                role="মেস ম্যানেজার, ইন্দিরা রোড, ফার্মগেট"
              />
              <TestimonialCard
                quote="আমাদের ১০ জনের ব্যাচেলর মেসে বাজার ও বুয়ার বিল নিয়ে প্রায়ই কথা কাটাকাটি হতো। এখন অগ্রিম টাকা জমা দিলে ম্যানেজার ওয়ালেটে অ্যাড করে দেয় এবং মাস শেষে সবার পরিষ্কার হিসাব পাওয়া যায়।"
                name="রাকিবুল হাসান"
                role="ব্যাচেলর মেম্বার, মিরপুর-১০"
              />
              <TestimonialCard
                quote="ছাত্রাবাসে অনেক ছাত্রের খাবারের মিল ট্র্যাকিং করা কঠিন ছিল। এই সফটওয়্যারে দৈনিক মিল শিডিউল এবং গ্যাস-কারেন্ট ও বুয়ার বিলের ভাগ স্বয়ংক্রিয়ভাবে হয়ে যায়। দারুণ উদ্যোগ!"
                name="আব্দুর রহিম"
                role="হোস্টেল সুপার, রাজশাহী"
              />
            </div>
          </div>
        </section>

        {/* SECTION: FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section id="faq" className="w-full py-16 md:py-24 bg-slate-950 border-t border-slate-800">
          <div className="container px-4 md:px-8 mx-auto max-w-4xl">
            <div className="text-center mb-14 space-y-3">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">সাধারণ জিজ্ঞাসা</span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <span className="text-base md:text-lg">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-emerald-400' : ''
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA FINAL SECTION */}
        <section className="w-full py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950 border-t border-slate-800">
          <div className="container px-4 md:px-8 mx-auto relative z-10 text-center space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              আজই ডিজিটালাইজ করুন আপনার মেস
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              খাতার হিসাব বন্ধ করে <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                স্মার্ট মেস পরিচালনা শুরু করুন
              </span>
            </h2>

            <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              কোনো জটিলতা নেই। মাত্র ২ মিনিটে আপনার মেসের অ্যাকাউন্ট খুলুন এবং মেম্বারদের ইনভাইট করুন।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full rounded-2xl h-14 md:h-16 px-10 text-lg font-black bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 border-0">
                  ফ্রি শুরু করুন (Start Free) ➔
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 md:h-16 px-10 text-lg font-bold bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 transition-colors">
                  মেস ম্যানেজারে লগইন করুন
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 md:py-16 text-slate-400 text-sm">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="sm:col-span-2 space-y-4">
              <Link className="flex items-center gap-3" href="/">
                <Image
                  src="/icons/icon-512x512.png"
                  alt="MealManager Logo"
                  width={36}
                  height={36}
                  className="rounded-xl shadow-md"
                />
                <span className="font-bold text-xl tracking-tight text-white">MealManager BD</span>
              </Link>
              <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                বাংলাদেশের মেস, হোস্টেল ও ব্যাচেলরদের জন্য আধুনিক মিল ও বাজার হিসাবের সেরা সফটওয়্যার।
              </p>
              <p className="text-xs text-slate-500">
                মুদ্রা: ৳ (BDT) • ভাষা: বাংলা ও ইংরেজি
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">সফটওয়্যার</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">মিল রেট ক্যালকুলেটর</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">ফিচারসমূহ</a></li>
                <li><a href="#comparison" className="hover:text-emerald-400 transition-colors">খাতা বনাম সফটওয়্যার</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">ন্যাভিগেশন</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link href="/login" className="hover:text-emerald-400 transition-colors">মেস লগইন</Link></li>
                <li><Link href="/register" className="hover:text-emerald-400 transition-colors">নতুন মেস তৈরি</Link></li>
                <li><a href="#faq" className="hover:text-emerald-400 transition-colors">প্রশ্নোত্তর</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">লিগ্যাল</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><span className="text-slate-500">গোপনীয়তা নীতি (Privacy)</span></li>
                <li><span className="text-slate-500">ব্যবহারের শর্তাবলী (Terms)</span></li>
                <li><span className="text-slate-500">সহায়তা: support@mealmanager.app</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center sm:text-left">
            <p>© {new Date().getFullYear()} MealManager BD. সর্বস্বত্ব সংরক্ষিত।</p>
            <p>Made with ❤️ for Bangladeshi bachelor messes & hostels.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BanglaFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 space-y-4 group">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/80 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex gap-1 text-amber-400">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed italic">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
      <div className="pt-3 border-t border-slate-800/80">
        <p className="font-bold text-white text-sm">{name}</p>
        <p className="text-xs text-emerald-400">{role}</p>
      </div>
    </div>
  );
}
