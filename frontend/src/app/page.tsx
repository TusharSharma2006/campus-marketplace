'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, ArrowRight, Laptop, BookOpen, Bike, Armchair, 
  Shirt, FileText, Home, Gamepad2, Briefcase, 
  TrendingUp, CheckCircle2, ShieldCheck, Sparkles, Star, Users, Flame 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockCategories } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const categoryIcons: Record<string, React.ComponentType<any>> = {
  Laptop,
  BookOpen,
  Bike,
  Armchair,
  Shirt,
  FileText,
  Home,
  Gamepad2,
  Briefcase
};

export default function LandingPage() {
  const { products } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Filter listings for trending / featured
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const dealProducts = products.filter(p => p.isDeal).slice(0, 4);
  const recentProducts = products.slice(0, 4); // Recently added

  // Simple testimonial list
  const testimonials = [
    {
      name: 'Ryan Cooper',
      role: 'Sophomore, Computer Science',
      content: 'CampusMart saved me over $200 on textbooks this semester alone. Meeting on campus at the library is so much safer than meeting strangers off Facebook.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
    },
    {
      name: 'Chloe Bennett',
      role: 'Senior, Business Admin',
      content: 'I listed my dorm mini-fridge and old study notes on CampusMart. They both sold within 24 hours! The chat UI and instant replies were incredibly helpful.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
    },
    {
      name: 'Marcus Vance',
      role: 'Freshman, Engineering',
      content: 'Rented a graphing calculator for my calculus exam week. The process was super easy, and the escrow hold feature made it completely risk-free.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[95vh] overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-[1.03]"
          >
            <source src="/remove_sound.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Parallax Overlay & Dark Blur for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-white dark:to-brand-dark backdrop-blur-[3px] transition-colors duration-300" />
        </div>

        {/* Hero Content Panel */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            {/* Promotion pill */}
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/20 select-none animate-pulse">
              <Sparkles className="h-4.5 w-4.5 text-yellow-300" />
              <span>Campus Verification Portal 2.0 Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white drop-shadow-sm">
              Buy, Sell & Rent <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Within Your Campus
              </span>
            </h1>

            {/* Sub-heading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium drop-shadow-xs max-w-xl mx-auto leading-relaxed">
              A highly secure, student-only marketplace for trading textbooks, room essentials, and accessories with verified peers.
            </p>

            {/* Hero Search Bar */}
            <form onSubmit={handleSearch} className="mx-auto max-w-lg mt-8 relative flex items-center p-1.5 rounded-full bg-white/95 border border-white/20 shadow-2xl backdrop-blur-md focus-within:ring-4 focus-within:ring-brand-blue/30 transition-all">
              <div className="flex-1 relative pl-3">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need today?"
                  className="w-full bg-transparent py-2 pl-9 pr-2 text-sm text-black placeholder-gray-450 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white rounded-full px-5 py-2.5 text-xs font-bold transition-all shrink-0 shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black hover:bg-gray-100 px-6 py-3.5 text-xs font-extrabold shadow-lg transition-all"
              >
                Explore Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3.5 text-xs font-extrabold backdrop-blur-md shadow-lg transition-all"
              >
                Sell an Item
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-20 bg-white dark:bg-brand-dark transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Browse by Campus Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
              Select a specialized category to find exactly what you need for this semester.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
            {mockCategories.map((cat, idx) => {
              const Icon = categoryIcons[cat.iconName] || Laptop;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer rounded-2xl border border-gray-150 p-4 flex flex-col items-center text-center shadow-xs hover:shadow-md dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-200"
                  onClick={() => router.push(`/marketplace?category=${cat.id}`)}
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-extrabold mt-3 text-black dark:text-white group-hover:text-brand-blue truncate w-full">
                    {cat.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-gray-450 mt-1 font-bold">
                    {cat.count} items
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Listings Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-850 transition-colors duration-200 border-t border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Trending on Campus
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
                The most viewed listings by your peers this week.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:underline"
            >
              See all listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Near You Section */}
      <section className="py-16 bg-white dark:bg-brand-dark transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Deals Near You
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
                Items with recent price reductions or highly discounted original prices.
              </p>
            </div>
            <Link
              href="/marketplace?filter=deals"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:underline"
            >
              Explore all deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Student Discount & Campus Promotion */}
      <section className="py-12 bg-white dark:bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-blue to-brand-purple text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
            <div className="max-w-xl space-y-4 relative z-10 text-center md:text-left">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Exclusively For Students
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Unlock 60% Off Textbooks & Study Materials
              </h2>
              <p className="text-xs sm:text-sm text-gray-150 leading-relaxed font-medium">
                Verify your institutional `.edu` email address today to unlock the full campus catalog, save items to your wishlist, negotiate with sellers in real time, and gain access to special dorm-essential giveaways.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link
                href="/verify"
                className="inline-flex items-center justify-center rounded-full bg-white text-black font-extrabold px-6 py-4 text-xs hover:bg-gray-100 transition-all shadow-md"
              >
                Verify .edu Email Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-850 border-t border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Recently Added
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
                Fresh listings uploaded by students today.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-brand-dark transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Loved by College Students
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
              Read how verified university students are trading and saving daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-gray-150 p-6 shadow-xs flex flex-col justify-between dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic dark:text-gray-300">
                    "{test.content}"
                  </p>
                </div>
                <div className="flex items-center gap-3.5 mt-6 border-t border-gray-100 pt-4 dark:border-gray-850">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-black dark:text-white">
                      {test.name}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {test.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
