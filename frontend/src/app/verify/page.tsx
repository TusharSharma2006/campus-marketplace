'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Mail, ArrowLeft, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

export default function VerifyPage() {
  const { currentUser, setCurrentUser, verifyUserToggle } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Set email from currentUser if logged in
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Countdown timer for OTP
  useEffect(() => {
    if (step !== 'otp' || timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('.edu')) {
      setError('Please enter a valid academic email address ending in .edu');
      return;
    }

    setIsSending(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      setTimer(59);
      // Autofocus first input
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Move focus to next input if filled
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pasteData)) return; // Only allow numeric paste

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    // Focus last or next active input
    const focusIndex = Math.min(pasteData.length, 3);
    inputRefs[focusIndex].current?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 4) {
      setError('Please enter the full 4-digit code.');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate verification check (valid code is 1234)
    setTimeout(() => {
      setIsVerifying(false);
      if (otpCode === '1234') {
        // Toggle verification in state
        if (currentUser) {
          if (!currentUser.isVerified) {
            verifyUserToggle(currentUser.id);
          }
        } else {
          // If guest, create/login mock user and verify them
          const { mockUsers } = require('@/data/mockData');
          const guestUser = { ...mockUsers[0], isVerified: true, email };
          setCurrentUser(guestUser);
        }
        setStep('success');
      } else {
        setError('Invalid verification code. Try "1234" for the demo.');
      }
    }, 1500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setIsSending(true);
    setError('');
    setTimeout(() => {
      setIsSending(false);
      setTimer(59);
      setOtp(['', '', '', '']);
      inputRefs[0].current?.focus();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-brand-dark text-black dark:text-white transition-colors duration-200">
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            Campus<span className="text-brand-blue">Mart</span>
          </span>
        </Link>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Dorm Room & Student Circle Trading
        </p>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden relative min-h-[380px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Enter .edu Email */}
          {step === 'email' && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold">Verify Student Status</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enter your university email address to confirm your campus identity and unlock student-only listing benefits.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-800 flex items-center gap-2 dark:bg-red-955/20 dark:border-red-900/40 dark:text-red-400">
                  <AlertCircle className="h-4 w-4.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
                    Institutional Email (.edu)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="alex.rivera@university.edu"
                      disabled={currentUser !== null}
                      className="w-full rounded-xl border border-gray-250 bg-gray-50 py-3 pl-10 pr-3 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 dark:border-gray-800 dark:bg-gray-850 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3.5 text-xs font-extrabold transition-all shadow-md disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sending OTP Code...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center pt-2">
                <span className="text-[10px] text-gray-400 font-bold bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-md">
                  DEMO TRICK: Works instantly with any .edu email
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Enter 4-Digit OTP */}
          {step === 'otp' && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold">Verification Code Sent</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We have sent a verification code to <span className="font-semibold text-black dark:text-white">{email}</span>. Please enter it below.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-800 flex items-center gap-2 dark:bg-red-955/20 dark:border-red-900/40 dark:text-red-400">
                  <AlertCircle className="h-4 w-4.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-4">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-12 h-14 text-center text-lg font-bold rounded-xl border border-gray-250 bg-gray-50 text-black dark:text-white outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 dark:border-gray-800 dark:bg-gray-850"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3.5 text-xs font-extrabold transition-all shadow-md"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Verifying code...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={() => setStep('email')}
                  className="text-gray-500 hover:text-black dark:hover:text-white font-bold"
                >
                  Change Email
                </button>

                <button
                  onClick={handleResend}
                  disabled={timer > 0 || isSending}
                  className={`font-bold flex items-center gap-1 ${
                    timer > 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-brand-blue hover:underline'
                  }`}
                >
                  {timer > 0 ? (
                    `Resend code in ${timer}s`
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3" />
                      Resend Code
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-gray-400 font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 px-2.5 py-1.5 rounded-md">
                  DEMO PASSCODE: Enter "1234" to succeed
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Success Screen */}
          {step === 'success' && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="text-center space-y-6 py-4"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                    className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center dark:bg-emerald-950/30"
                  >
                    <ShieldCheck className="h-9 w-9 text-emerald-500" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute -top-1 -right-1"
                  >
                    <CheckCircle2 className="h-5 w-5 fill-blue-500 text-white" />
                  </motion.div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold">Dorm Verification Successful!</h2>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                  Your university credentials have been verified. You now have a verification badge next to your listings and can trade safely inside the campus student circle.
                </p>
              </div>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3.5 text-xs font-extrabold transition-all shadow-md"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
