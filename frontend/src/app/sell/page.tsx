'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  PlusCircle, Sparkles, Upload, AlertCircle, Trash2, 
  HelpCircle, Check, ArrowRight, Eye 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockCategories, Product } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

// Quick Unsplash image templates to help students test publishing easily
const sampleImages = [
  { label: 'Books', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
  { label: 'Electronics', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400' },
  { label: 'Cycles', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400' },
  { label: 'Furniture', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400' },
  { label: 'Fashion', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
  { label: 'General', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' }
];

export default function SellProductPage() {
  const { addListing, currentUser } = useApp();
  const router = useRouter();

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('electronics');
  const [condition, setCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [type, setType] = useState<'Buy' | 'Rent' | 'Exchange'>('Buy');
  const [imageUrl, setImageUrl] = useState(sampleImages[0].url);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Brand', value: '' },
    { label: 'Usage Period', value: '' }
  ]);

  // UI States
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [customSpecLabel, setCustomSpecLabel] = useState('');
  const [customSpecValue, setCustomSpecValue] = useState('');

  const addCustomSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSpecLabel.trim() && customSpecValue.trim()) {
      setSpecs([...specs, { label: customSpecLabel.trim(), value: customSpecValue.trim() }]);
      setCustomSpecLabel('');
      setCustomSpecValue('');
    }
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', text: string) => {
    const updated = [...specs];
    updated[index][field] = text;
    setSpecs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auth Check
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Validation
    const validationErrors = [];
    if (title.trim().length < 5) validationErrors.push('Title must be at least 5 characters long.');
    if (description.trim().length < 10) validationErrors.push('Description must be at least 10 characters long.');
    if (price === '' || price < 0) validationErrors.push('Please enter a valid price (greater than or equal to 0).');
    if (!imageUrl.trim()) validationErrors.push('Please provide an image link.');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors([]);
    setSuccess(true);

    // Save specifications that have content
    const filteredSpecs = specs.filter(s => s.label.trim() && s.value.trim());

    // Submit Action
    addListing({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
      category,
      condition,
      type,
      images: [imageUrl.trim()],
      specifications: filteredSpecs
    });

    setTimeout(() => {
      router.push('/marketplace');
    }, 1500);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
        <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create Listing</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Fill in details to post your item to the verified campus catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            
            {/* Error notifications */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-800 space-y-1.5 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
                <p className="font-bold flex items-center gap-1.5 leading-none mb-1">
                  <AlertCircle className="h-4.5 w-4.5" />
                  Please resolve the following issues:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 font-medium">
                  {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              </div>
            )}

            {/* Success notification */}
            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
                <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  Listing published successfully! Redirecting you to the marketplace...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Image Input Panel */}
              <div className="border border-gray-150 rounded-2xl p-5 bg-white dark:border-gray-850 dark:bg-gray-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">1. Product Image</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs text-black placeholder-gray-400 outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850 dark:text-white"
                  />
                </div>

                {/* Sample selection picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    Or select a mock category photo:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sampleImages.map((samp, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImageUrl(samp.url)}
                        className={`rounded-full px-3.5 py-1.5 text-[10px] font-bold border transition-all ${
                          imageUrl === samp.url
                            ? 'bg-brand-blue border-brand-blue text-white'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {samp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* General details */}
              <div className="border border-gray-150 rounded-2xl p-5 bg-white dark:border-gray-855 dark:bg-gray-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">2. Item Details</h3>
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">Product Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Psychology (Book bundle)"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs text-black placeholder-gray-400 outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe condition, specifications, and where you want to meet up on campus..."
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs text-black placeholder-gray-400 outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850 dark:text-white"
                  />
                </div>

                {/* Category & Condition Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs outline-none cursor-pointer focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
                    >
                      {mockCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-655 dark:text-gray-300">Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs outline-none cursor-pointer focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price & Transaction */}
              <div className="border border-gray-150 rounded-2xl p-5 bg-white dark:border-gray-850 dark:bg-gray-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">3. Transaction Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Transaction Type */}
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">Deal Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs outline-none cursor-pointer focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-855"
                    >
                      <option value="Buy">Sell / Buy</option>
                      <option value="Rent">Rent Out</option>
                      <option value="Exchange">Exchange / Trade</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
                      {type === 'Rent' ? 'Weekly Rent ($)' : 'Price ($)'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value !== '' ? Number(e.target.value) : '')}
                      placeholder="e.g. 25"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs text-black placeholder-gray-400 outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850 dark:text-white"
                    />
                  </div>

                  {/* Original Price (Optional) */}
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-gray-650 dark:text-gray-300">
                      Original Price ($) <span className="text-[10px] text-gray-400 font-medium">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value !== '' ? Number(e.target.value) : '')}
                      placeholder="e.g. 59"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs text-black placeholder-gray-400 outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-855 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="border border-gray-150 rounded-2xl p-5 bg-white dark:border-gray-850 dark:bg-gray-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">4. Specifications (Keys/Values)</h3>
                
                <div className="space-y-3">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-2.5 items-center">
                      <input
                        type="text"
                        value={spec.label}
                        placeholder="Label (e.g. Brand)"
                        onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-xs outline-none focus:bg-white dark:border-gray-800 dark:bg-gray-850"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        placeholder="Value (e.g. Apple)"
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-xs outline-none focus:bg-white dark:border-gray-800 dark:bg-gray-850"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new spec line fields */}
                <div className="flex gap-2 items-center pt-2 border-t border-gray-100 dark:border-gray-850">
                  <input
                    type="text"
                    value={customSpecLabel}
                    onChange={(e) => setCustomSpecLabel(e.target.value)}
                    placeholder="New Label (e.g. ISBN)"
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs outline-none dark:border-gray-800 dark:bg-gray-850"
                  />
                  <input
                    type="text"
                    value={customSpecValue}
                    onChange={(e) => setCustomSpecValue(e.target.value)}
                    placeholder="New Value (e.g. 12345)"
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs outline-none dark:border-gray-800 dark:bg-gray-850"
                  />
                  <button
                    type="button"
                    onClick={addCustomSpec}
                    className="rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black px-4 py-2 text-xs font-bold shrink-0"
                  >
                    Add Row
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={success}
                className="w-full rounded-xl bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-extrabold py-3.5 text-xs shadow-md tracking-wider uppercase transition-colors"
              >
                Publish Listing
              </button>
            </form>
          </div>

          {/* Right Column: Live Card Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Eye className="h-4 w-4 text-brand-purple" />
              Live Card Preview
            </h3>

            {/* Mock Product Card */}
            <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-lg dark:border-gray-800 dark:bg-gray-900 max-w-sm mx-auto">
              <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-850 overflow-hidden">
                <img
                  src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'}
                  alt="preview"
                  className="h-full w-full object-cover object-center"
                />
                
                <span className="absolute top-3 left-3 z-10 rounded-full bg-black text-white px-2.5 py-1 text-[10px] font-bold uppercase">
                  {type}
                </span>

                <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  <Eye className="h-3 w-3" />
                  0
                </span>
              </div>

              <div className="p-4 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="rounded-full border border-blue-150 bg-blue-50/50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold dark:bg-blue-950/20 dark:text-blue-400">
                    {condition}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-black dark:text-white truncate">
                  {title || 'Untouched Title Preview'}
                </h3>

                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed dark:text-gray-400">
                  {description || 'This is the item description that will show on the feed.'}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between gap-2 dark:border-gray-850">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-black dark:text-white">
                      ${price || 0}
                      {type === 'Rent' && <span className="text-[10px] font-medium text-gray-400">/week</span>}
                    </span>
                    {originalPrice && (
                      <span className="text-xs text-gray-400 line-through font-semibold">
                        ${originalPrice}
                      </span>
                    )}
                  </div>

                  {currentUser && (
                    <div className="flex items-center gap-1">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      <span className="text-[10px] font-semibold text-gray-650 dark:text-gray-300">
                        {currentUser.name.split(' ')[0]}
                      </span>
                      <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-[10px] font-bold text-gray-400 text-center max-w-xs mx-auto leading-relaxed">
              * The live preview matches the layout of products in the search feed. Check spelling and specs carefully before publishing.
            </p>

          </div>

        </div>

      </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
