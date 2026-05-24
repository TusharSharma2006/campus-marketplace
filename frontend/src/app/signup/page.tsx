'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail, User, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('.edu')) {
      setError('Please sign up using your official institutional .edu email.');
      return;
    }
    
    // Redirect to simulated OTP verification page
    router.push(`/verify?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-55 dark:bg-brand-dark text-black dark:text-white transition-colors duration-200">
      
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

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-bold mb-1.5 text-center">Create Student Account</h2>
        <p className="text-xs text-gray-500 text-center mb-6">Enter details to request campus catalog verification.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-800 flex items-center gap-2 dark:bg-red-955/20 dark:border-red-900/40 dark:text-red-400">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-655 dark:text-gray-300">
              Institution Email (.edu)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="alex.rivera@university.edu"
                className="w-full rounded-xl border border-gray-255 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
              />
            </div>
          </div>

          {/* Terms Agreement check */}
          <div className="flex items-start gap-2 py-1">
            <input
              type="checkbox"
              required
              className="h-4 w-4 rounded text-brand-blue border-gray-350 focus:ring-brand-blue mt-0.5"
            />
            <span className="text-[10px] text-gray-500 font-semibold leading-normal">
              I agree to use campus meetups, verify student IDs in person, and follow community safety rules.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3 text-xs font-bold transition-all shadow-md"
          >
            Create Account
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-6 text-center text-xs text-gray-500 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-blue font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
