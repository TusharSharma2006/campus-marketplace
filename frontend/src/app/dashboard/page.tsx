'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, Settings, Bell, BookOpen, Trash2, Heart, 
  MapPin, Calendar, CheckCircle2, ShieldCheck, Mail, CreditCard, 
  Eye, Edit2 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProtectedRoute from '@/components/ProtectedRoute';

type TabType = 'listings' | 'wishlist' | 'notifications' | 'settings';

export default function UserDashboard() {
  const { 
    currentUser, 
    products, 
    wishlist, 
    notifications, 
    markNotificationsAsRead, 
    deleteProduct,
    toggleWishlist
  } = useApp();
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('listings');

  // Settings State
  const [campus, setCampus] = useState('');
  const [paymentHandle, setPaymentHandle] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCampus(currentUser.campus);
      setPaymentHandle('$alexrivera24'); // default mock payment tag
    }
  }, [currentUser]);

  // Auth Redirect if logged out
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent" />
      </div>
    );
  }

  // Filter listings owned by user
  const myListings = products.filter(p => p.sellerId === currentUser.id);

  // Filter wishlisted listings
  const myWishlist = products.filter(p => wishlist.includes(p.id));

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'listings', label: 'My Listings', count: myListings.length, icon: BookOpen },
    { id: 'wishlist', label: 'My Wishlist', count: myWishlist.length, icon: Heart },
    { id: 'notifications', label: 'Notifications', count: notifications.filter(n => !n.read).length, icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
        <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* User Profile Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-150 p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-blue/20"
            />
            <div className="space-y-3 flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
                  {currentUser.name}
                </h1>
                
                {currentUser.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-150 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Student
                  </span>
                )}
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {currentUser.campus}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {currentUser.joinedDate}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Rating: {currentUser.rating} ({currentUser.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-150 dark:border-gray-800 gap-1 overflow-x-auto pb-px mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  if (tab.id === 'notifications') markNotificationsAsRead();
                }}
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-black tracking-wider uppercase transition-colors shrink-0 ${
                  isActive
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 ? (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-100 px-1 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="min-h-96">
          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              {myListings.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl dark:border-gray-800 text-gray-500 text-xs">
                  <p>You haven't listed any items for sale or rent yet.</p>
                  <button
                    onClick={() => router.push('/sell')}
                    className="mt-4 rounded-full bg-black text-white hover:bg-gray-800 px-5 py-2.5 text-xs font-bold shadow-xs dark:bg-white dark:text-black"
                  >
                    Post Your First Listing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                  {myListings.map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard product={product} />
                      
                      {/* Delete Listing Button for Owner */}
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="absolute bottom-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 shadow-sm hover:bg-red-100 transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              {myWishlist.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl dark:border-gray-800 text-gray-500 text-xs">
                  <p>Your wishlist is empty. Add bookmarks from the marketplace to keep track of items.</p>
                  <button
                    onClick={() => router.push('/marketplace')}
                    className="mt-4 rounded-full bg-black text-white hover:bg-gray-800 px-5 py-2.5 text-xs font-bold shadow-xs dark:bg-white dark:text-black"
                  >
                    Explore Items
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                  {myWishlist.map((product) => (
                    <div key={product.id} className="relative">
                      <ProductCard product={product} />
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute bottom-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-650 hover:bg-red-100 transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
              {notifications.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl dark:border-gray-800 text-gray-500 text-xs">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-2xl border p-4 transition-all flex items-start gap-4 ${
                      notif.read 
                        ? 'border-gray-150 bg-white dark:border-gray-800 dark:bg-gray-900' 
                        : 'border-blue-100 bg-blue-50/20 dark:border-blue-900/40 dark:bg-blue-950/10'
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
                      <Bell className="h-4.5 w-4.5 text-brand-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-xs font-bold text-black dark:text-white truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 shrink-0">{notif.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {notif.description}
                      </p>
                      {notif.link && (
                        <button
                          onClick={() => router.push(notif.link!)}
                          className="mt-2 text-xs font-bold text-brand-blue hover:underline"
                        >
                          View Action
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto bg-white border border-gray-150 rounded-3xl p-6 dark:border-gray-800 dark:bg-gray-900 animate-fade-in">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">Account Settings</h3>
              
              {saveSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
                  Settings saved successfully!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Location Settings */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-650 dark:text-gray-300 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-brand-blue" />
                    Preferred Campus / Dorm Location
                  </label>
                  <input
                    type="text"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="e.g. North Campus Main"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
                  />
                </div>

                {/* Email Verification Mock read-only */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-650 dark:text-gray-300 flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-brand-purple" />
                    Verified Institution Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="flex-1 rounded-xl border border-gray-150 bg-gray-100 py-2.5 px-3 text-xs text-gray-500 outline-none dark:border-gray-800 dark:bg-gray-850"
                    />
                    <span className="rounded-xl border border-emerald-150 bg-emerald-50 text-emerald-700 font-bold px-3 py-2.5 text-[10px] dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Escrow payment settings */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-650 dark:text-gray-300 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    UPI / Venmo Payment Tag
                  </label>
                  <input
                    type="text"
                    value={paymentHandle}
                    onChange={(e) => setPaymentHandle(e.target.value)}
                    placeholder="e.g. @username"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-855"
                  />
                </div>

                {/* Email Alert Toggle */}
                <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 dark:border-gray-850">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">Email Notifications</p>
                    <p className="text-[10px] text-gray-400">Receive alerts when someone offers on your items</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="h-4.5 w-4.5 rounded text-brand-blue"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-bold py-3 text-xs shadow-xs transition-colors"
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}
        </div>

      </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
