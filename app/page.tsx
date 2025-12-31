import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Utensils, Shield, Zap, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">MealManager</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/login">
            Login
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Meal Management Made Effortless
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The complete SaaS solution for messes, hostels, and restaurants. Track meals, manage members, and automate billing with 100% precision.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg">Create Your Organization</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">View Demo</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Packed with Power</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Everything you need to run your food service efficiently, all in one place.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Real-time Tracking</h3>
                <p className="text-sm text-gray-500 text-center">
                  Instant meal participation marking with automated cost calculation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Multi-tenant Isolation</h3>
                <p className="text-sm text-gray-500 text-center">
                  Secure, private workspaces for every individual mess or organization.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Automated Billing</h3>
                <p className="text-sm text-gray-500 text-center">
                  Manual wallet deposits with automated per-meal deductions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to simplify your management?</h2>
              <p className="max-w-[600px] opacity-90 md:text-xl">
                Join hundreds of organizations transforming their daily operations.
              </p>
              <Link href="/register">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-medium text-gray-500 text-sm">
        <p>© 2025 MealManager SaaS. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

// Fixed Button component "asChild" support in the local context
// I will need to update the Button component to support asChild if I want to use it with Link properly.
// Or just wrap it. I'll just use Link inside the button for now.
