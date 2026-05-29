'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail, User, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useApp } from '@/context/AppContext';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Explicit Form Validations
    if (!name.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!email.endsWith('.edu')) {
      setError('Please sign up using your official institutional .edu email.');
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

      const response = await axios.post('http://localhost:5000/api/register', {
        name: name.trim(),
        email: email.trim(),
        password
      });

      const data = response.data;

      // Save token if returned by backend
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Automatically log the user in
      if (data.user) {
        setCurrentUser({
          id: data.user.id || `user_${Date.now()}`,
          name: data.user.name || name.trim(),
          email: data.user.email || email.trim(),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          isVerified: true,
          rating: 5.0,
          reviewsCount: 0,
          joinedDate: 'May 2026',
          listingsCount: 0,
          campus: 'Main Campus'
        });
      }

      alert('Account created successfully! Redirecting to dashboard.');
      router.push('/dashboard');

    } catch (err: any) {
      console.error("Signup Server Error:", err);
      const errMsg = err.response?.data?.error || err.message || 'Could not reach backend database server.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-55 dark:bg-brand-dark text-black dark:text-white transition-colors duration-200">
      
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
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 dark:border-gray-800 dark:bg-gray-850"
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
                disabled={isLoading}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="alex.rivera@university.edu"
                className="w-full rounded-xl border border-gray-255 bg-gray-50 py-2.5 pl-9 pr-3 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 dark:border-gray-800 dark:bg-gray-850"
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
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-gray-250 bg-gray-50 py-2.5 pl-9 pr-3 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 dark:border-gray-800 dark:bg-gray-850"
              />
            </div>
          </div>

          {/* Terms Agreement check */}
          <div className="flex items-start gap-2 py-1">
            <input
              type="checkbox"
              required
              disabled={isLoading}
              className="h-4 w-4 rounded text-brand-blue border-gray-350 focus:ring-brand-blue mt-0.5"
            />
            <span className="text-[10px] text-gray-500 font-semibold leading-normal">
              I agree to use campus meetups, verify student IDs in person, and follow community safety rules.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3 text-xs font-bold transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
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