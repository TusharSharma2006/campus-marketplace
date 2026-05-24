'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full border-t border-gray-100 bg-gray-50 text-black dark:border-gray-800 dark:bg-brand-dark dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                Campus<span className="text-brand-blue">Mart</span>
              </span>
            </Link>
            <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
              The trusted student marketplace. Buy, sell, rent, and exchange textbook bundles, mini-fridges, study notes, and cycles with verified campus peers.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Verified .edu Users Only</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brand-blue" />
                <span>100% Student Run</span>
              </div>
            </div>
          </div>

          {/* Categories links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Categories</h4>
            <ul className="space-y-2 text-xs font-medium text-gray-650 dark:text-gray-400">
              <li><Link href="/marketplace?category=books" className="hover:text-brand-blue">Books & Textbooks</Link></li>
              <li><Link href="/marketplace?category=electronics" className="hover:text-brand-blue">Electronics</Link></li>
              <li><Link href="/marketplace?category=cycles" className="hover:text-brand-blue">Cycles & Transport</Link></li>
              <li><Link href="/marketplace?category=hostel" className="hover:text-brand-blue">Hostel Essentials</Link></li>
              <li><Link href="/marketplace?category=notes" className="hover:text-brand-blue">Study Guides & Notes</Link></li>
            </ul>
          </div>

          {/* Safety & Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Trust & Safety</h4>
            <ul className="space-y-2 text-xs font-medium text-gray-650 dark:text-gray-400">
              <li><Link href="/verify" className="hover:text-brand-blue">Campus Verification</Link></li>
              <li><Link href="#" className="hover:text-brand-blue">Safe Meeting Spots</Link></li>
              <li><Link href="#" className="hover:text-brand-blue">Community Guidelines</Link></li>
              <li><Link href="#" className="hover:text-brand-blue">Reporting Fraud</Link></li>
              <li><Link href="/admin" className="hover:text-brand-blue">Moderation Queue</Link></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Campus Alerts</h4>
            <p className="text-xs text-gray-550 dark:text-gray-400">
              Subscribe to get notified about fresh listings, flash student deals, and textbook trade-ins.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your .edu email"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-xs text-black placeholder-gray-400 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-blue"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                  Thanks for subscribing! Check your inbox soon.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 dark:border-gray-800">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} CampusMart. Built for Hackathons & Portfolios.
          </p>
          <p className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
            Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> on campus.
          </p>
        </div>
      </div>
    </footer>
  );
}
