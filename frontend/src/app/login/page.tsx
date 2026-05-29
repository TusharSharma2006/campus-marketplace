'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const { setCurrentUser } = useApp();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Explicit Form Validations
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!email.endsWith('.edu')) {
      setError('Please log in using a valid institutional .edu email.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.post('http://localhost:5000/api/login', {
        email: email.trim(),
        password
      });

      const data = response.data;

      // Save valid backend JSON Web Token securely to Local Storage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Update application session context with database row identifiers
      if (data.user) {
        setCurrentUser({
          id: data.user.id || `user_${Date.now()}`,
          name: data.user.name || 'Campus Student',
          email: data.user.email,
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          isVerified: true,
          rating: 5.0,
          reviewsCount: 0,
          joinedDate: 'May 2026',
          listingsCount: 0,
          campus: 'Main Campus'
        });
      }

      router.push('/dashboard');

    } catch (err: any) {
      console.error("Login Server Error:", err);
      const errMsg = err.response?.data?.error || err.message || 'Connecting to backend failed. Is your server running?';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-brand-dark text-black dark:text-white transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            Campus<span className="text-brand-blue">Mart</span>
          </span>
        </Link>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Trading within college student circles.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-bold mb-1.5 text-center">Welcome Back</h2>
        <p className="text-xs text-gray-500 text-center mb-6">Log in to buy, sell, or rent items today.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-800 flex items-center gap-2 dark:bg-red-955/20 dark:border-red-900/40 dark:text-red-400">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
              Campus Email (.edu)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@university.edu"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 dark:border-gray-800 dark:bg-gray-850"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
                Password
              </label>
              <a href="#" className="text-[10px] text-brand-blue font-bold hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 dark:border-gray-800 dark:bg-gray-850"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3 text-xs font-bold transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Verifying Account...' : 'Log In'}
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-6 text-center text-xs text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link href="/signup" className="text-brand-blue font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}