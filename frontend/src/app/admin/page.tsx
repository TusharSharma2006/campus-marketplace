'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { mockUsers, User, Product } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  ShieldCheck, AlertTriangle, Users, BookOpen, Ban, Check, Trash2, 
  TrendingUp, ArrowRight, ShieldAlert, BarChart3, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportedItem {
  id: string;
  productId: string;
  reason: string;
  reportedBy: string;
  date: string;
}

export default function AdminPage() {
  const { 
    currentUser, 
    setCurrentUser,
    products, 
    deleteProduct, 
    verifyUserToggle, 
    banUserToggle, 
    bannedUsers 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports'>('overview');
  
  // Local list of users initialized from mockUsers to track verification changes locally
  const [localUsers, setLocalUsers] = useState<User[]>(mockUsers);

  // Mock reported items list
  const [reports, setReports] = useState<ReportedItem[]>([
    { id: 'rep_1', productId: 'prod_4', reason: 'Coffee stains much worse than pictured', reportedBy: 'Emma Watson', date: '2026-05-22' },
    { id: 'rep_2', productId: 'prod_12', reason: 'Unfair calculator security deposit details', reportedBy: 'David Chen', date: '2026-05-21' },
  ]);

  // Handle Switch to Admin View
  const handleSwitchToAdmin = () => {
    setCurrentUser(mockUsers[3]); // Switch session to Moderator
  };

  // If not logged in as Admin, show access gate
  if (currentUser?.id !== 'user_admin') {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="h-16 w-16 bg-amber-50 dark:bg-amber-955/20 rounded-2xl flex items-center justify-center text-amber-500 mb-4 border border-amber-100 dark:border-amber-900/30">
            <ShieldAlert className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2">Access Restricted</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            You are currently viewing CampusMart with a student profile (<span className="font-semibold text-black dark:text-white">{currentUser?.name || 'Guest'}</span>). You need administrator privileges to view the moderation panel.
          </p>
          <div className="space-y-3 w-full">
            <button
              onClick={handleSwitchToAdmin}
              className="w-full py-3.5 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2"
            >
              Switch to Moderator Session
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/"
              className="block w-full py-3 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-850 transition-all text-gray-550 dark:text-gray-400"
            >
              Return to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Admin stats
  const totalVerifiedStudents = localUsers.filter(u => u.isVerified).length;
  const activeListingsCount = products.length;

  const kpis = [
    { label: 'Active Listings', value: activeListingsCount, icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Verified Students', value: `${totalVerifiedStudents}/${localUsers.length}`, icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Reported Listings', value: reports.length, icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-955/20 animate-pulse' },
    { label: 'Banned Accounts', value: bannedUsers.length, icon: Ban, color: 'text-red-500 bg-red-50 dark:bg-red-955/20' }
  ];

  // Toggle user verification state locally & in context
  const handleToggleVerify = (userId: string) => {
    verifyUserToggle(userId);
    setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
  };

  // Toggle user ban state in context
  const handleToggleBan = (userId: string) => {
    banUserToggle(userId);
  };

  // Resolve report (dismiss)
  const handleResolveReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  // Ban/Delete product and resolve report
  const handleDeleteReportedProduct = (productId: string, reportId: string) => {
    deleteProduct(productId);
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  // Find product by ID
  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
        <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 pb-6 dark:border-gray-800">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-brand-blue" />
              Campus Moderator Portal
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Verify student emails, manage flagged products, and review logs for CampusMart.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Toggle back to student view for testing ease
                setCurrentUser(mockUsers[0]);
              }}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-850 transition-colors text-gray-650 dark:text-gray-300"
            >
              Switch to Student View
            </button>
          </div>
        </div>

        {/* KPI Grids */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-xl font-extrabold mt-1">{kpi.value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-150 dark:border-gray-800 gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-extrabold border-b-2 transition-all ${
              activeTab === 'overview' 
                ? 'border-brand-blue text-black dark:text-white' 
                : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-xs font-extrabold border-b-2 transition-all ${
              activeTab === 'users' 
                ? 'border-brand-blue text-black dark:text-white' 
                : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            User Moderation
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 text-xs font-extrabold border-b-2 transition-all relative ${
              activeTab === 'reports' 
                ? 'border-brand-blue text-black dark:text-white' 
                : 'border-transparent text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Report Queue
            {reports.length > 0 && (
              <span className="absolute -top-1.5 -right-3 h-4 min-w-[16px] rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center px-1">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab View Contents */}
        <div className="min-h-[300px]">
          
          {/* TAB 1: System Metrics / Growth charts */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Listings Growth bar chart */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="h-4.5 w-4.5 text-brand-purple" />
                  Listings Growth (2026)
                </h3>
                
                <div className="h-48 flex items-end justify-between pt-6 px-4">
                  {[
                    { month: 'Jan', count: 120, height: 'h-[30%]' },
                    { month: 'Feb', count: 180, height: 'h-[45%]' },
                    { month: 'Mar', count: 240, height: 'h-[60%]' },
                    { month: 'Apr', count: 310, height: 'h-[78%]' },
                    { month: 'May', count: 400, height: 'h-[100%]' }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center w-12 group">
                      <div className="text-[10px] font-extrabold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {bar.count}
                      </div>
                      <div className={`w-6 bg-gradient-to-t from-brand-blue to-brand-purple rounded-t-md transition-all duration-500 hover:scale-x-110 ${bar.height}`} />
                      <span className="text-[10px] font-bold text-gray-400 mt-2">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Share listings */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-brand-blue" />
                  Popular Categories
                </h3>

                <div className="space-y-3.5 pt-2">
                  {[
                    { name: 'Books & Textbooks', count: 87, pct: 'w-[87%]', color: 'bg-emerald-500' },
                    { name: 'Notes & Study Guides', count: 54, pct: 'w-[54%]', color: 'bg-violet-500' },
                    { name: 'Electronics', count: 42, pct: 'w-[42%]', color: 'bg-blue-500' },
                    { name: 'Fashion & Apparel', count: 35, pct: 'w-[35%]', color: 'bg-pink-500' }
                  ].map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{cat.name}</span>
                        <span className="text-gray-400">{cat.count} listings</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full dark:bg-gray-800 overflow-hidden">
                        <div className={`h-full ${cat.color} ${cat.pct} rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: User Moderation table */}
          {activeTab === 'users' && (
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider dark:border-gray-800 dark:bg-gray-850">
                      <th className="p-4">Student</th>
                      <th className="p-4">joined</th>
                      <th className="p-4">listings</th>
                      <th className="p-4">rating</th>
                      <th className="p-4">status</th>
                      <th className="p-4 text-right">actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                    {localUsers.map((user) => {
                      const isBanned = bannedUsers.includes(user.id);
                      return (
                        <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/20">
                          {/* Profile */}
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-9 w-9 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold truncate text-black dark:text-white">{user.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                            </div>
                          </td>

                          <td className="p-4 text-gray-500 font-medium">{user.joinedDate}</td>
                          <td className="p-4 font-bold">{user.listingsCount} items</td>
                          <td className="p-4 text-amber-500 font-bold">★ {user.rating}</td>

                          {/* Status Pill */}
                          <td className="p-4">
                            {isBanned ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/20 dark:text-red-400">
                                Banned
                              </span>
                            ) : user.isVerified ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Action triggers */}
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleVerify(user.id)}
                              className={`p-1.5 rounded-lg border text-[10px] font-bold transition-colors ${
                                user.isVerified 
                                  ? 'border-gray-200 hover:bg-gray-50 text-gray-650 dark:border-gray-800 dark:hover:bg-gray-850 dark:text-gray-300' 
                                  : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/40 dark:text-blue-400'
                              }`}
                              title={user.isVerified ? 'Revoke Verification Badge' : 'Approve & Verify Student'}
                            >
                              {user.isVerified ? 'Unverify' : 'Verify'}
                            </button>
                            
                            {user.id !== 'user_admin' && (
                              <button
                                onClick={() => handleToggleBan(user.id)}
                                className={`p-1.5 rounded-lg border text-[10px] font-bold transition-colors ${
                                  isBanned 
                                    ? 'border-emerald-250 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400' 
                                    : 'border-red-250 bg-red-50 hover:bg-red-100 text-red-800 dark:bg-red-955/20 dark:border-red-900/40 dark:text-red-400'
                                }`}
                              >
                                {isBanned ? 'Lift Ban' : 'Ban User'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Flagged/Reported Products queue */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="bg-white border border-gray-150 dark:border-gray-800 dark:bg-gray-900 rounded-2xl p-8 text-center">
                  <div className="h-11 w-11 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold">All clean! Flag queue is empty.</p>
                  <p className="text-[10px] text-gray-400 mt-1">No products are currently reported by students.</p>
                </div>
              ) : (
                reports.map((report) => {
                  const product = getProductById(report.productId);
                  return (
                    <div 
                      key={report.id}
                      className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      {/* Left: Product & report reason details */}
                      <div className="flex gap-4 items-start min-w-0">
                        {product ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-14 w-14 rounded-xl object-cover border border-gray-150 dark:border-gray-800 shrink-0"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-xl bg-gray-150 dark:bg-gray-800 shrink-0 flex items-center justify-center text-gray-400">
                            <Trash2 className="h-6 w-6" />
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-red-700 bg-red-50 dark:bg-red-955/20 dark:text-red-400 px-2 py-0.5 rounded">
                              Reported
                            </span>
                            <span className="text-[10px] text-gray-450 font-bold">
                              Flagged on {report.date} by {report.reportedBy}
                            </span>
                          </div>
                          
                          <h4 className="text-xs font-bold text-black dark:text-white truncate">
                            {product ? product.title : 'Deleted Product listing'}
                          </h4>

                          <p className="text-[11px] text-gray-550 dark:text-gray-400 leading-relaxed font-semibold flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            Reason: "{report.reason}"
                          </p>
                        </div>
                      </div>

                      {/* Right: action buttons */}
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          className="flex-1 md:flex-none rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-850 px-4 py-2.5 text-xs font-bold transition-all text-gray-650 dark:text-gray-300 flex items-center justify-center gap-1"
                        >
                          <Check className="h-4 w-4 text-emerald-500" />
                          Dismiss Flag
                        </button>
                        
                        {product && (
                          <button
                            onClick={() => handleDeleteReportedProduct(product.id, report.id)}
                            className="flex-1 md:flex-none rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 dark:bg-red-955/15 dark:border-red-900/35 dark:text-red-400 px-4 py-2.5 text-xs font-extrabold text-red-700 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove Listing
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
