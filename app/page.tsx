'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
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
  X as CloseIcon
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar - Glassmorphism */}
      <header className="px-4 md:px-6 h-20 flex items-center border-b border-gray-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <Link className="flex items-center gap-2 md:gap-3 group" href="/">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            <Utensils className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              MealManager
            </span>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-blue-600 -mt-1">
              SaaS Edition
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden md:flex gap-8 items-center">
          <Link className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors" href="#how-it-works">
            How it Works
          </Link>
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <Link className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors" href="/login">
            Sign In
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm" className="rounded-full px-6 shadow-md shadow-blue-100">
              Get Started
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="ml-auto p-2 text-gray-600 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top duration-300 shadow-xl z-50">
            <Link
              className="text-lg font-bold text-gray-900"
              href="#features"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              className="text-lg font-bold text-gray-900"
              href="#how-it-works"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <hr className="border-gray-100" />
            <Link
              className="text-lg font-bold text-gray-900"
              href="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full rounded-2xl h-14 text-lg font-bold">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section - High Impact */}
        <section className="relative w-full py-12 md:py-20 lg:py-32 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-100/30 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
              <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs md:text-sm font-bold animate-fade-in mx-auto lg:mx-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Scale your business effortlessly
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gray-900">
                  Manage Meals with <br className="hidden sm:block" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Smart Precision.
                  </span>
                </h1>

                <p className="text-base md:text-xl text-gray-600 leading-relaxed font-medium">
                  The ultimate operating system for messes, hostels, and corporate cafeterias.
                  Streamline operations, eliminate waste, and delight your members.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full rounded-2xl h-14 px-8 text-lg font-bold shadow-xl shadow-blue-200">
                      Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 px-8 text-lg font-bold bg-white/50 backdrop-blur-sm border-2 border-gray-100 hover:bg-white hover:border-blue-200 transition-all">
                      Watch Demo
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-4 md:gap-6 pt-4 justify-center lg:justify-start">
                  <div className="flex -space-x-3 scale-90 md:scale-100">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] md:text-[10px] font-bold ${i === 4 ? 'bg-blue-600 text-white' : ''}`}>
                        {i === 4 ? '+50' : <Users className="h-3 w-3 md:h-4 md:w-4" />}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-gray-500">
                    Trusted by <span className="text-gray-900 font-bold">50+ Organizations</span>
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full max-w-xl lg:max-w-none lg:relative animate-float mt-8 lg:mt-0">
                <div className="relative z-10 p-2 md:p-4 bg-white/40 backdrop-blur-md border border-white/50 rounded-[24px] md:rounded-[40px] shadow-2xl">
                  <div className="bg-gray-900 rounded-[18px] md:rounded-[32px] overflow-hidden shadow-inner aspect-[4/3] flex items-center justify-center text-white font-mono text-xs md:text-sm group">
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                      <LayoutDashboard className="h-8 w-8 md:h-12 md:w-12 text-blue-400" />
                      <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] md:text-sm">Admin Dashboard Preview</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 h-24 w-24 md:h-40 md:w-40 bg-purple-400/20 rounded-full blur-2xl -z-10"></div>
                <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 h-24 w-24 md:h-40 md:w-40 bg-blue-400/20 rounded-full blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Modern Cards */}
        <section id="features" className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20 space-y-4">
              <h2 className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs md:text-sm">Features</h2>
              <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Everything you need to scale</p>
              <p className="text-base md:text-lg text-gray-500 font-medium px-4">Built with cutting-edge technology to handle thousands of transactions without breaking a sweat.</p>
            </div>

            <div className="grid gap-6 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-6 w-6 md:h-7 md:w-7" />}
                title="Lightning Fast"
                description="Mark attendance for hundreds of members in seconds. Real-time updates across all devices."
                color="blue"
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6 md:h-7 md:w-7" />}
                title="Strict Isolation"
                description="Every organization has its own secure workspace. Your data is encrypted and isolated."
                color="indigo"
              />
              <FeatureCard
                icon={<TrendingUp className="h-6 w-6 md:h-7 md:w-7" />}
                title="Financial Insights"
                description="Detailed reports on spending, meal costs, and wallet balances at your fingertips."
                color="green"
              />
              <FeatureCard
                icon={<ChefHat className="h-6 w-6 md:h-7 md:w-7" />}
                title="Menu Management"
                description="Plan your meals ahead of time. Notify members of upcoming menus automatically."
                color="orange"
              />
              <FeatureCard
                icon={<Wallet className="h-6 w-6 md:h-7 md:w-7" />}
                title="Smart Wallet"
                description="Members deposit funds, system deducts automatically. Zero-hassle manual collections."
                color="purple"
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6 md:h-7 md:w-7" />}
                title="Auto-Deduction"
                description="Schedule deductions to happen exactly when meals are served. No more manual entry errors."
                color="rose"
              />
            </div>
          </div>
        </section>

        {/* CTA Section - Gradient Mesh */}
        <section className="w-full py-16 md:py-24 relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-gray-900 to-indigo-900/50"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm border border-white/10 rounded-[24px] md:rounded-[48px] p-8 md:p-12 lg:p-24 text-center space-y-6 md:space-y-8 max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-6xl font-black text-white tracking-tight">
                Ready to transform your <br className="hidden md:block" /> cafeteria operations?
              </h2>
              <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Join forward-thinking managers who have improved efficiency by up to 80% with MealManager.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full rounded-2xl h-14 md:h-16 px-10 text-lg md:text-xl font-black bg-white text-blue-600 hover:bg-blue-50 transition-colors">
                    Join the waitlist
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 md:h-16 px-10 text-lg md:text-xl font-black text-white border-2 border-white/20 hover:bg-white/10 transition-colors">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Professional */}
      <footer className="bg-white border-t border-gray-100 py-12 md:py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12 md:mb-20">
            <div className="sm:col-span-2 space-y-4 md:space-y-6">
              <Link className="flex items-center gap-3" href="/">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">MealManager</span>
              </Link>
              <p className="text-gray-500 font-medium max-w-xs leading-relaxed text-sm md:text-base">
                The leading platform for modern meal management. Built for efficiency, designed for people.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-xs md:text-sm uppercase tracking-widest text-gray-900">Product</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li><Link href="#" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">Features</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-xs md:text-sm uppercase tracking-widest text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li><Link href="#" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-xs md:text-sm uppercase tracking-widest text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li><Link href="#" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-gray-500 font-medium hover:text-blue-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-400 font-bold text-xs md:text-sm">© 2025 MealManager SaaS. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Animations Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600',
    green: 'bg-green-50 text-green-600 border-green-100 group-hover:bg-green-600',
    orange: 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-600',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600',
  };

  return (
    <div className="group flex flex-col items-center lg:items-start space-y-4 md:space-y-6 p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-gray-100 bg-white hover:border-blue-100 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.05)] transition-all duration-500 hover:-translate-y-2">
      <div className={`p-3 md:p-4 rounded-2xl transition-all duration-300 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="space-y-2 md:space-y-3 text-center lg:text-left">
        <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
        <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>
      <div className="pt-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 lg:translate-x-4 group-hover:translate-x-0 duration-300">
        <Link href="/register" className="text-blue-600 font-black text-xs md:text-sm uppercase tracking-widest inline-flex items-center gap-2">
          Learn More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
