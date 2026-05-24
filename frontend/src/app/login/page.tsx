'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { mockUsers } from '@/data/mockData';
import { KeyRound, Mail, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { setCurrentUser } = useApp();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('.edu')) {
      setError('Please log in using a valid institutional .edu email.');
      return;
    }

    // Success Mock Login: Match email or just log in Alex Rivera
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
    setCurrentUser(foundUser);
    router.push('/dashboard');
  };

  const handleGoogleLogin = () => {
    setCurrentUser(mockUsers[0]);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-brand-dark text-black dark:text-white transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white font-bold shadow-sm">
            C
          </span>
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
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@university.edu"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3 text-xs font-bold transition-all shadow-md"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-150 dark:border-gray-800" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:bg-gray-900">
            Or continue with
          </span>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-650 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-350 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#ea4335"
              d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.76 14.94 1 12 1 7.35 1 3.4 3.63 1.5 7.46l3.75 2.9C6.12 7.42 8.84 5.04 12 5.04z"
            />
            <path
              fill="#4285f4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.94 3.73-8.6z"
            />
            <path
              fill="#fbbc05"
              d="M5.25 10.36c-.23-.69-.37-1.44-.37-2.22s.14-1.53.37-2.22L1.5 3.02C.54 4.93 0 7.08 0 9.36s.54 4.43 1.5 6.34l3.75-2.9-1.05-1.44z"
            />
            <path
              fill="#34a853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.16 0-5.88-2.38-6.84-5.32L1.4 15.9C3.3 19.73 7.25 23 12 23z"
            />
          </svg>
          Google Workspace
        </button>

        {/* Redirect */}
        <p className="mt-6 text-center text-xs text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link href="/signup" className="text-brand-blue font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <p className="mt-8 text-[10px] text-gray-400 font-medium">
        * Direct login works for any mock user, e.g. `alex.rivera@university.edu` or `admin@campusmart.edu`.
      </p>
    </div>
  );
}
