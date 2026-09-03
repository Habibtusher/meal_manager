import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Script from 'next/script';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MealManager - বাংলাদেশের #১ মেস ও হোস্টেল মিল ম্যানেজমেন্ট সফটওয়্যার | Best Mess Management System BD",
  description: "মেসের খাতার হিসাব, দৈনিক বাজার, মিল রেট ও মেম্বারদের ব্যালেন্সের সেরা সফটওয়্যার। ঝামেলামুক্ত মেস পরিচালনার জন্য আজই ফ্রি ব্যবহার করুন। Calculate meal rates, track daily bazar, member deposits & monthly expenses effortlessly in Bangladesh.",
  keywords: [
    "মেস ম্যানেজমেন্ট সফটওয়্যার",
    "মেস হিসাব সফটওয়্যার",
    "mess management system bangladesh",
    "bachelor mess management",
    "meal rate calculator bd",
    "hostel meal tracker dhaka",
    "meal manager bd",
    "bazar hisab mess",
    "meal rate hisab bangla",
    "student hostel software"
  ],
  authors: [{ name: "MealManager BD" }],
  creator: "MealManager",
  publisher: "MealManager",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://mealmanager.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MealManager - বাংলাদেশের #১ মেস ও হোস্টেল মিল ম্যানেজমেন্ট সফটওয়্যার",
    description: "খাতার ঝামেলা বন্ধ করুন! মেসের মিল, বাজার খরচ ও মিল রেট হিসাব করুন মুহূর্তেই।",
    url: "/",
    siteName: "MealManager BD",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/assets/admin-dashboard.png",
        width: 1200,
        height: 630,
        alt: "MealManager Dashboard - Best Mess Management System in Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MealManager - মেস ম্যানেজমেন্ট সফটওয়্যার বাংলাদেশ",
    description: "খাতার ঝামেলা বন্ধ করুন! মেসের মিল, বাজার খরচ ও মিল রেট হিসাব করুন স্মার্টলি।",
    images: ["/assets/admin-dashboard.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MealManager",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};


import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NVRY9TN8LK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NVRY9TN8LK');
          `}
        </Script>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MealManager",
              "operatingSystem": "Web, Android, iOS",
              "applicationCategory": "BusinessApplication, Productivity",
              "description": "বাংলাদেশের সেরা মেস, হোস্টেল ও ব্যাচেলর মিল ম্যানেজমেন্ট এবং দৈনিক বাজার হিসাবের সফটওয়্যার।",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BDT",
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "128",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
