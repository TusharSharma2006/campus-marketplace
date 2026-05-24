'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, MessageSquare, ShieldCheck, MapPin, Eye, Calendar, 
  ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Star, 
  Sparkles, ShieldAlert 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockUsers } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import RatingStars from '@/components/RatingStars';
import PaymentModal from '@/components/PaymentModal';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { 
    products, 
    wishlist, 
    toggleWishlist, 
    startChatWithSeller,
    currentUser
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  // Find product by ID
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      setReviewsList(product.reviews || []);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold">Product Not Found</h2>
          <p className="text-xs text-gray-550 mt-1 mb-6">
            The item may have been sold or removed by the moderator.
          </p>
          <Link
            href="/marketplace"
            className="rounded-full bg-black text-white px-6 py-3 text-xs font-bold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm"
          >
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const seller = mockUsers.find((u) => u.id === product.sellerId) || mockUsers[0];
  const isWishlisted = wishlist.includes(product.id);

  // Similar products in same category (excluding current)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleContactSeller = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    const chatId = startChatWithSeller(product.id, product.sellerId);
    router.push(`/chat?id=${chatId}`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewComment.trim()) {
      const review = {
        id: `rev_${Date.now()}`,
        reviewerName: currentUser?.name || 'Anonymous Student',
        reviewerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        date: 'Just now'
      };
      setReviewsList([review, ...reviewsList]);
      setNewReviewComment('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          href="/marketplace"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Listings
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square md:aspect-video lg:aspect-square w-full bg-gray-50 dark:bg-gray-855 rounded-3xl overflow-hidden border border-gray-150 dark:border-gray-800">
              <img
                src={product.images[activeImageIdx]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              
              {/* Carousel controls */}
              {product.images.length > 1 && (
                <div className="absolute inset-x-4 bottom-4 flex justify-between pointer-events-none">
                  <button
                    onClick={() => setActiveImageIdx(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm border border-gray-100 hover:bg-white active:scale-95 transition-all dark:bg-gray-900/90 dark:border-gray-800 dark:text-white"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm border border-gray-100 hover:bg-white active:scale-95 transition-all dark:bg-gray-900/90 dark:border-gray-800 dark:text-white"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 bg-gray-50 dark:bg-gray-850 transition-all ${
                      activeImageIdx === idx 
                        ? 'border-brand-blue scale-95 shadow-xs' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Detailed Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headers & Badges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {product.dateAdded}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-black dark:text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Status statistics */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {product.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  {product.wishlistedCount} bookmarks
                </span>
              </div>
            </div>

            {/* Price Card */}
            <div className="border border-gray-150 dark:border-gray-800 rounded-2xl p-5 bg-gray-50 dark:bg-gray-900 shadow-xs">
              <div className="flex justify-between items-baseline mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Price / Rate</p>
                  <p className="text-3xl font-black text-black dark:text-white tracking-tight">
                    ${product.price}
                    {product.type === 'Rent' && <span className="text-xs font-medium text-gray-550">/week</span>}
                  </p>
                </div>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through font-bold">
                    Original: ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-3.5 text-xs font-black shadow-md tracking-wider uppercase transition-colors"
                >
                  {product.type === 'Rent' ? 'Rent This Item' : 'Lock Deal / Buy Now'}
                </button>
                
                <div className="flex gap-2.5">
                  <button
                    onClick={handleContactSeller}
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-black hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Seller
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`rounded-xl border p-3 flex items-center justify-center transition-colors ${
                      isWishlisted 
                        ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-955/20 dark:border-red-900' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Seller profile card */}
            <div className="border border-gray-150 dark:border-gray-850 rounded-2xl p-4 flex items-center gap-4 bg-white dark:bg-gray-900">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-blue/20"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold truncate text-black dark:text-white">{seller.name}</h4>
                  {seller.isVerified && (
                    <CheckCircle2 className="h-4 w-4 fill-blue-500 text-white shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <RatingStars rating={seller.rating} size={11} />
                  <span className="text-[10px] text-gray-550 dark:text-gray-400 font-bold">
                    ({seller.reviewsCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-gray-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{seller.campus}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Seller Active</p>
                <p className="text-xs font-black text-black dark:text-white">{seller.listingsCount} items</p>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Specifications</h3>
                <div className="border border-gray-150 rounded-2xl overflow-hidden text-xs dark:border-gray-800 bg-white dark:bg-gray-900">
                  {product.specifications.map((spec, index) => (
                    <div 
                      key={index}
                      className={`flex justify-between p-3 ${
                        index % 2 === 0 ? 'bg-gray-55/50 dark:bg-gray-850/50' : 'bg-white dark:bg-gray-900'
                      } ${index !== product.specifications.length - 1 ? 'border-b border-gray-100 dark:border-gray-850' : ''}`}
                    >
                      <span className="text-gray-500 font-semibold">{spec.label}</span>
                      <span className="font-extrabold text-black dark:text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed description panel */}
        <section className="border-t border-gray-150 pt-10 mb-12 dark:border-gray-800">
          <h2 className="text-lg font-extrabold tracking-tight mb-4">Description</h2>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-705 dark:text-gray-300 leading-relaxed font-medium space-y-4">
            <p>{product.description}</p>
          </div>
        </section>

        {/* Ratings & reviews section */}
        <section className="border-t border-gray-150 pt-10 mb-16 dark:border-gray-800">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-lg font-extrabold tracking-tight">Student Feedback</h2>
            <span className="text-xs text-gray-500 font-semibold">
              {reviewsList.length} reviews left for this listing / seller
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left sidebar: review score summary & write feedback form */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 dark:border-gray-800 dark:bg-gray-900 text-center space-y-3">
                <h3 className="text-3xl font-black text-black dark:text-white">{seller.rating}</h3>
                <div className="flex justify-center">
                  <RatingStars rating={seller.rating} size={16} />
                </div>
                <p className="text-[11px] text-gray-550 font-semibold">
                  Overall rating verified by campus transcripts & sales logs.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAddReview} className="space-y-4 border border-gray-150 rounded-2xl p-5 dark:border-gray-800 bg-white dark:bg-gray-900">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Write a Review</h3>
                
                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="text-amber-400 hover:scale-110 active:scale-95 transition-all"
                      >
                        <Star 
                          className={`h-5 w-5 ${
                            star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Review Message</label>
                  <textarea
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe your meeting experience, condition accuracy, promptness..."
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-black placeholder-gray-400 outline-none focus:border-brand-blue focus:bg-white dark:border-gray-850 dark:bg-gray-855 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 py-2.5 text-xs font-bold transition-all shadow-xs"
                >
                  Submit Feedback
                </button>
              </form>
            </div>

            {/* Right sidebar: list of reviews */}
            <div className="md:col-span-8 space-y-4">
              {reviewsList.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl dark:border-gray-800 text-gray-400 text-xs">
                  No reviews posted yet. Be the first to trade and leave feedback!
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div 
                    key={rev.id}
                    className="border border-gray-150 rounded-2xl p-4 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-black dark:text-white">{rev.reviewerName}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <RatingStars rating={rev.rating} size={10} />
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                    <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-medium">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Similar items section */}
        {similarProducts.length > 0 && (
          <section className="border-t border-gray-150 pt-10 dark:border-gray-800">
            <h2 className="text-lg font-extrabold tracking-tight mb-6">Similar Items You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />

      {/* Payment simulation modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        product={product}
      />
    </div>
  );
}
