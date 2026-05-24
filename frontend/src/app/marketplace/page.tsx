'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, ArrowUpDown, X, Grid, List, 
  HelpCircle, Sparkles, Filter, ChevronDown 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockCategories, Product } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

function MarketplaceContent() {
  const { products } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters State
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('recent');
  
  // UI States
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with URL parameters on mount/change
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const dealFilter = searchParams.get('filter');

    if (search) {
      setSearchVal(search);
    }
    if (category) {
      setSelectedCategory(category);
    }
    if (dealFilter === 'deals') {
      setSelectedTypes(['Buy']); // Deals are usually items to buy
      setPriceRange({ min: 0, max: 150 }); // Lower price range
    }
  }, [searchParams]);

  // Simulate loading on search/filter updates
  const triggerLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  };

  const handleConditionChange = (condition: string) => {
    triggerLoading();
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  const handleTypeChange = (type: string) => {
    triggerLoading();
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    triggerLoading();
    setSearchVal('');
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 1000 });
    setSelectedConditions([]);
    setSelectedTypes([]);
    setSortBy('recent');
    router.replace('/marketplace');
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    // Search query match
    if (searchVal.trim()) {
      const query = searchVal.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      const matchCat = product.category.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    // Category match
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Price range match
    if (product.price < priceRange.min || product.price > priceRange.max) {
      return false;
    }

    // Condition match
    if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition)) {
      return false;
    }

    // Type match (Buy/Rent/Exchange)
    if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'popular') {
      return b.views - a.views;
    }
    // 'recent' as default
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-brand-dark text-black dark:text-white transition-colors duration-200">
      
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-150 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Campus Catalog</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Browse through {products.length} active listings on your campus.
          </p>
        </div>

        {/* Sorting and Mobile Filter triggers */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsFilterSidebarOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          <div className="relative flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => { triggerLoading(); setSortBy(e.target.value); }}
              className="rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs font-bold outline-none cursor-pointer focus:border-brand-blue dark:border-gray-800 dark:bg-gray-900"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Popularity (Views)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category quick chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 scrollbar-none">
        <button
          onClick={() => { triggerLoading(); setSelectedCategory('all'); }}
          className={`rounded-full px-4.5 py-1.5 text-xs font-bold whitespace-nowrap border shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800'
          }`}
        >
          All Categories
        </button>
        {mockCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { triggerLoading(); setSelectedCategory(cat.id); }}
            className={`rounded-full px-4.5 py-1.5 text-xs font-bold whitespace-nowrap border shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 border border-gray-200 rounded-2xl dark:bg-gray-900 dark:border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-850">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4.5 w-4.5 text-brand-blue" />
              Filter Tools
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-gray-500 hover:text-brand-blue hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Search Query Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => { triggerLoading(); setSearchVal(e.target.value); }}
                placeholder="Search..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850 dark:text-white"
              />
            </div>
          </div>

          {/* Deal type check (Buy/Rent/Exchange) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction Type</label>
            <div className="space-y-2.5">
              {['Buy', 'Rent', 'Exchange'].map((type) => (
                <label key={type} className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Price (${priceRange.max})</label>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange.max}
              onChange={(e) => { triggerLoading(); setPriceRange({ ...priceRange, max: parseInt(e.target.value) }); }}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-brand-blue"
            />
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => { triggerLoading(); setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 }); }}
                className="w-full border border-gray-200 rounded-lg p-1.5 text-center text-xs dark:border-gray-800 dark:bg-gray-850"
                placeholder="Min"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => { triggerLoading(); setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 }); }}
                className="w-full border border-gray-200 rounded-lg p-1.5 text-center text-xs dark:border-gray-800 dark:bg-gray-850"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item Condition</label>
            <div className="space-y-2.5">
              {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
                <label key={cond} className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(cond)}
                    onChange={() => handleConditionChange(cond)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Smart recommendation notice */}
          <div className="p-3.5 bg-purple-50 border border-purple-100 rounded-2xl text-[11px] text-purple-800 dark:bg-purple-950/20 dark:border-purple-900/40 dark:text-purple-400 space-y-1">
            <p className="font-bold flex items-center gap-1 leading-none">
              <Sparkles className="h-3.5 w-3.5" />
              AI Recommendations
            </p>
            <p className="leading-relaxed">
              We customize listings according to your course syllabus, hostel location, and study group trends.
            </p>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {isLoading ? (
            /* Skeleton grid loader */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 h-96">
                  <div className="bg-gray-250 dark:bg-gray-800 aspect-square w-full" />
                  <div className="p-4 flex-1 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded-md" />
                      <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded-md" />
                    </div>
                    <div className="h-4 w-full bg-gray-250 dark:bg-gray-800 rounded-md" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md" />
                    <div className="h-5 w-1/3 bg-gray-250 dark:bg-gray-850 mt-auto rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-gray-900 p-8">
              <HelpCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold">No items found matching your filters</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 mb-6">
                Try widening your search keywords, adjusting the price range, or clearing some condition checkboxes.
              </p>
              <button
                onClick={clearFilters}
                className="rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-extrabold px-6 py-3 text-xs shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Main Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter slide drawer */}
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative z-10 w-full max-w-xs bg-white dark:bg-gray-900 p-6 flex flex-col overflow-y-auto h-full text-black dark:text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-gray-850 mb-6">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Filters</h3>
                <button
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6 flex-1">
                {/* Search query */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search Keyword</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => { triggerLoading(); setSearchVal(e.target.value); }}
                      placeholder="Search..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs dark:border-gray-800 dark:bg-gray-850"
                    />
                  </div>
                </div>

                {/* Deal type checks */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Type</label>
                  <div className="space-y-2.5">
                    {['Buy', 'Rent', 'Exchange'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Max Price (${priceRange.max})</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange.max}
                    onChange={(e) => { triggerLoading(); setPriceRange({ ...priceRange, max: parseInt(e.target.value) }); }}
                    className="w-full accent-brand-blue"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => { triggerLoading(); setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 }); }}
                      className="w-full border border-gray-200 rounded-lg p-1 text-center text-xs dark:border-gray-800 dark:bg-gray-850"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => { triggerLoading(); setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 }); }}
                      className="w-full border border-gray-200 rounded-lg p-1 text-center text-xs dark:border-gray-800 dark:bg-gray-850"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item Condition</label>
                  <div className="space-y-2.5">
                    {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
                      <label key={cond} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedConditions.includes(cond)}
                          onChange={() => handleConditionChange(cond)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span>{cond}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-gray-100 pt-4 mt-6 dark:border-gray-850 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 dark:border-gray-800"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-black text-white text-xs font-bold dark:bg-white dark:text-black"
                >
                  View Listings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center h-96">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent dark:border-white" />
        </div>
      }>
        <MarketplaceContent />
      </Suspense>
      <Footer />
    </div>
  );
}
