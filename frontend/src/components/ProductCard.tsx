'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Eye, CheckCircle2, ShoppingCart, RefreshCw, Clock } from 'lucide-react';
import { Product, mockUsers } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  
  // Find seller info
  const seller = mockUsers.find((u) => u.id === product.sellerId);

  // Condition Badge colors
  const conditionStyles = {
    'New': 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900',
    'Like New': 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900',
    'Good': 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
    'Fair': 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900',
  };

  // Transaction type badge
  const typeIcons = {
    'Buy': <ShoppingCart className="h-3 w-3 mr-1" />,
    'Rent': <Clock className="h-3 w-3 mr-1" />,
    'Exchange': <RefreshCw className="h-3 w-3 mr-1" />
  };

  const typeStyles = {
    'Buy': 'bg-black text-white dark:bg-white dark:text-black',
    'Rent': 'bg-brand-purple text-white',
    'Exchange': 'bg-brand-blue text-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900 transition-shadow duration-200"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden dark:bg-gray-850">
        <Link href={`/marketplace/${product.id}`} className="block h-full w-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Transaction Type Tag */}
        <span className={`absolute top-3 left-3 z-10 flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm uppercase ${typeStyles[product.type]}`}>
          {typeIcons[product.type]}
          {product.type}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm border border-gray-100 text-gray-500 hover:text-red-500 hover:scale-110 active:scale-95 transition-all dark:bg-gray-900/90 dark:border-gray-800"
          aria-label="Add to wishlist"
        >
          <Heart 
            className={`h-4.5 w-4.5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
            }`} 
          />
        </button>

        {/* Views counter quick tag */}
        <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
          <Eye className="h-3 w-3" />
          {product.views}
        </span>
      </div>

      {/* Details Panel */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Condition Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {product.category}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${conditionStyles[product.condition]}`}>
            {product.condition}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-bold text-black line-clamp-1 group-hover:text-brand-blue dark:text-white transition-colors duration-200">
          <Link href={`/marketplace/${product.id}`}>
            {product.title}
          </Link>
        </h3>

        {/* Description Snippet */}
        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed dark:text-gray-400">
          {product.description}
        </p>

        {/* Price & Rating Spacer */}
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-black dark:text-white">
              ${product.price}
              {product.type === 'Rent' && <span className="text-[10px] font-medium text-gray-400">/week</span>}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-semibold">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Seller micro tag */}
          {seller && (
            <div className="flex items-center gap-1">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="h-5 w-5 rounded-full object-cover border border-gray-150 dark:border-gray-800"
              />
              <span className="text-[10px] font-semibold text-gray-650 max-w-[60px] truncate dark:text-gray-300">
                {seller.name.split(' ')[0]}
              </span>
              {seller.isVerified && (
                <CheckCircle2 className="h-3 w-3 fill-blue-500 text-white shrink-0" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
