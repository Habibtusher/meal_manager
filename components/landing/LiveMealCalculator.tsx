'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calculator, Sparkles, ArrowRight, Utensils, Users, Receipt, TrendingUp, CheckCircle } from 'lucide-react';

export function LiveMealCalculator() {
    const [bazarExpense, setBazarExpense] = useState(18000);
    const [totalMeals, setTotalMeals] = useState(300);
    const [sharedCosts, setSharedCosts] = useState(4500);
    const [membersCount, setMembersCount] = useState(6);
    const [sampleMemberMeals, setSampleMemberMeals] = useState(45);

    // Calculations
    const mealRate = useMemo(() => {
        if (totalMeals <= 0) return 0;
        return Number((bazarExpense / totalMeals).toFixed(2));
    }, [bazarExpense, totalMeals]);

    const sharedPerMember = useMemo(() => {
        if (membersCount <= 0) return 0;
        return Math.round(sharedCosts / membersCount);
    }, [sharedCosts, membersCount]);

    const sampleTotalCost = useMemo(() => {
        return Math.round(sampleMemberMeals * mealRate + sharedPerMember);
    }, [sampleMemberMeals, mealRate, sharedPerMember]);

    return (
        <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/50 p-6 md:p-10 border border-emerald-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                        <Calculator className="w-3.5 h-3.5" />
                        লাইভ মেস মিল রেট ক্যালকুলেটর
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        নিজের মেসের হিসাব যাচাই করে দেখুন
                    </h3>
                    <p className="text-sm text-slate-400">
                        স্লাইডার টেনে আপনার মেসের খরচ ও মিল পরিবর্তন করুন। কোনো খাতা বা ক্যালকুলেটরের প্রয়োজন নেই!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Controls */}
                    <div className="lg:col-span-7 space-y-5 bg-slate-900/70 p-5 md:p-6 rounded-2xl border border-slate-800">
                        {/* Bazar Expense */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Receipt className="w-4 h-4 text-emerald-400" />
                                    মোট বাজার খরচ (Bazar):
                                </label>
                                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-lg border border-emerald-800/40 text-sm">
                                    ৳ {bazarExpense.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <input
                                type="range"
                                min={2000}
                                max={80000}
                                step={500}
                                value={bazarExpense}
                                onChange={(e) => setBazarExpense(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Total Meals */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Utensils className="w-4 h-4 text-blue-400" />
                                    মোট খাওয়া মিলের সংখ্যা (Total Meals):
                                </label>
                                <span className="font-mono font-bold text-blue-400 bg-blue-950/50 px-2.5 py-0.5 rounded-lg border border-blue-800/40 text-sm">
                                    {totalMeals} টি
                                </span>
                            </div>
                            <input
                                type="range"
                                min={50}
                                max={1500}
                                step={10}
                                value={totalMeals}
                                onChange={(e) => setTotalMeals(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Shared / Khala / Gas Bills */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    শেয়ার্ড খরচ (বুয়া, গ্যাস, কারেন্ট, ওয়াইফাই):
                                </label>
                                <span className="font-mono font-bold text-amber-400 bg-amber-950/50 px-2.5 py-0.5 rounded-lg border border-amber-800/40 text-sm">
                                    ৳ {sharedCosts.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={30000}
                                step={200}
                                value={sharedCosts}
                                onChange={(e) => setSharedCosts(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>

                        {/* Members & Sample Member */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    মেসের মোট মেম্বার:
                                </label>
                                <input
                                    type="number"
                                    min={2}
                                    max={50}
                                    value={membersCount}
                                    onChange={(e) => setMembersCount(Math.max(1, Number(e.target.value)))}
                                    className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    একজন সদস্যের মিল:
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={120}
                                    value={sampleMemberMeals}
                                    onChange={(e) => setSampleMemberMeals(Math.max(1, Number(e.target.value)))}
                                    className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live Result Card */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-emerald-900/50 to-slate-900/90 p-6 md:p-8 rounded-2xl border border-emerald-500/30 text-white space-y-6 shadow-xl relative">
                        <div className="space-y-1">
                            <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
                                অটোমেটেড মিল রেট
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tight">
                                    ৳ {mealRate}
                                </span>
                                <span className="text-xs text-slate-300 font-medium">/ প্রতি মিল</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                ফর্মুলা: মোট বাজার (৳{bazarExpense}) ÷ মোট মিল ({totalMeals})
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-3 border-t border-emerald-500/20 text-xs">
                            <div className="flex justify-between items-center text-slate-300">
                                <span>শেয়ার্ড খরচ (প্রতি জন):</span>
                                <span className="font-mono font-bold text-white">৳ {sharedPerMember}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span>{sampleMemberMeals}টি মিলের খরচ:</span>
                                <span className="font-mono font-bold text-white">
                                    ৳ {Math.round(sampleMemberMeals * mealRate)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-700/60 font-bold text-sm text-emerald-300">
                                <span>সদস্যের মোট চলতি খরচ:</span>
                                <span className="text-base text-emerald-400 font-mono">
                                    ৳ {sampleTotalCost.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link
                                href="/register"
                                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                            >
                                নিজের মেসের জন্য ফ্রিতে শুরু করুন
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" />
                                কোনো ক্রেডিট কার্ড বা পেমেন্ট ছাড়াই ইনস্ট্যান্ট সেটআপ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
