'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, MapPin, QrCode, Check, DollarSign, 
  HelpCircle, AlertTriangle 
} from 'lucide-react';
import { Product, mockUsers } from '@/data/mockData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function PaymentModal({ isOpen, onClose, product }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cash'>('qr');
  const [step, setStep] = useState<1 | 2>(1);
  const seller = mockUsers.find(u => u.id === product.sellerId);

  const handleConfirm = () => {
    setStep(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-black dark:text-white"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {step === 1 ? (
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-brand-blue" />
                  <h3 className="text-lg font-bold tracking-tight">Lock Deal & Secure Item</h3>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Campus Escrow Protection Active
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Locking the deal secures the item. Funds are kept in escrow and only released to {seller?.name.split(' ')[0]} once you inspect and approve the item in person.
                  </p>
                </div>

                {/* Product Summary */}
                <div className="flex gap-3 items-center border border-gray-100 rounded-xl p-3 bg-gray-50 dark:border-gray-800 dark:bg-gray-850 mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{product.title}</p>
                    <p className="text-sm font-extrabold text-brand-blue mt-0.5">${product.price}</p>
                  </div>
                </div>

                {/* Options Selection */}
                <div className="space-y-3 mb-6">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Select Escrow Hold Method
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('qr')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'qr'
                          ? 'border-brand-blue bg-blue-50/20 text-brand-blue font-bold ring-2 ring-brand-blue/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm">Scan QR Hold</span>
                      <span className="text-[10px] text-gray-550 dark:text-gray-400 font-medium mt-1">UPI/Card hold</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-brand-blue bg-blue-50/20 text-brand-blue font-bold ring-2 ring-brand-blue/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm">Cash Handshake</span>
                      <span className="text-[10px] text-gray-550 dark:text-gray-400 font-medium mt-1">Pay on inspection</span>
                    </button>
                  </div>
                </div>

                {/* Verification Checkboxes / Safety Rules */}
                <div className="space-y-2 mb-6 bg-gray-50 dark:bg-gray-850 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 text-xs">
                  <p className="font-bold flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-brand-purple" />
                    Recommended Meetup Spots:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-650 dark:text-gray-400">
                    <li>Student Center Lobby (Main Campus)</li>
                    <li>University Library Courtyard (Well-lit, CCTV)</li>
                    <li>Campus Security Plaza</li>
                  </ul>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3 text-xs font-extrabold shadow-md transition-colors"
                  >
                    Confirm Deal
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                {/* Step 2: Success Animation / QR code */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                
                <h3 className="text-lg font-bold">Deal Locked Successfully!</h3>
                <p className="text-xs text-gray-550 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                  The listing has been reserved for you. A chat thread has been created with {seller?.name.split(' ')[0]}.
                </p>

                {paymentMethod === 'qr' && (
                  <div className="my-6 mx-auto w-40 h-40 border-2 border-dashed border-gray-250 p-2.5 bg-white rounded-2xl flex flex-col items-center justify-center dark:bg-gray-800">
                    {/* Simulated beautiful QR */}
                    <div className="w-full h-full bg-slate-900 rounded-lg p-2.5 flex flex-col justify-between items-center text-white">
                      <div className="flex justify-between w-full">
                        <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-white" />
                        <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-white" />
                      </div>
                      <div className="text-[10px] font-mono tracking-widest text-gray-300 font-bold uppercase">
                        CAMPUSMART
                      </div>
                      <div className="text-[9px] text-gray-400 font-semibold leading-none">
                        SCAN TO HOLD ESCROW
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-white" />
                        <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-white" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 bg-gray-50 dark:bg-gray-850 p-3 rounded-xl text-left text-xs max-w-sm mx-auto space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Transaction Type:</span>
                    <span>{paymentMethod === 'qr' ? 'Escrow Hold' : 'Cash handshake'}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Listing Reserved:</span>
                    <span>24 Hours</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={onClose}
                    className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3 text-xs font-extrabold shadow-md transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
