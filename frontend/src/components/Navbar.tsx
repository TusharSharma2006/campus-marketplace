'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Search, Bell, MessageSquare, PlusCircle, User as UserIcon, 
  CheckCircle2, Menu, X, Sun, Moon, LogOut, ShieldAlert,
  Compass, History
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    notifications, 
    markNotificationsAsRead, 
    setCurrentUser,
    chats
  } = useApp();
  
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from local preference (default: light)
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchVal.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const totalUnreadChats = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  // Close menus when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/marketplace', label: 'Explore', icon: Compass },
    { href: '/chat', label: 'Chats', icon: MessageSquare, badge: totalUnreadChats },
    { href: '/sell', label: 'Sell Item', icon: PlusCircle },
    { href: '/dashboard', label: 'Dashboard', icon: UserIcon },
  ];

  // Quick user switcher for demo purposes
  const switchUser = (role: 'student' | 'admin') => {
    const { mockUsers } = require('../data/mockData');
    if (role === 'admin') {
      setCurrentUser(mockUsers[3]); // Moderator
    } else {
      setCurrentUser(mockUsers[0]); // Alex Rivera
    }
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md dark:border-gray-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">
                Campus<span className="text-brand-blue dark:text-brand-purple">Mart</span>
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search text books, electronics, hostel beds..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 outline-none ring-brand-blue/20 transition-all focus:border-brand-blue focus:bg-white focus:ring-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:bg-brand-dark"
              />
            </form>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{link.label}</span>
                  {link.badge && link.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-brand-dark animate-pulse">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}

            {/* Admin shortcut badge */}
            {currentUser?.id === 'user_admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                  if (!isNotifOpen) markNotificationsAsRead();
                }}
                className={`relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all`}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-brand-blue" />
                )}
              </button>

              {/* Notif Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                    <h3 className="font-bold text-black dark:text-white">Notifications</h3>
                    <span className="text-xs text-gray-500">
                      {notifications.length} notifications
                    </span>
                  </div>
                  <div className="mt-2 max-h-60 overflow-y-auto space-y-3">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-gray-400">No new notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`rounded-lg p-2 transition-all ${
                            notif.read ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-800/40'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-xs font-semibold text-black dark:text-white">
                              {notif.title}
                            </span>
                            <span className="text-[9px] text-gray-400 shrink-0">{notif.date}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                            {notif.description}
                          </p>
                          {notif.link && (
                            <Link
                              href={notif.link}
                              onClick={() => setIsNotifOpen(false)}
                              className="text-[10px] text-brand-blue font-semibold mt-1 inline-block hover:underline"
                            >
                              View details
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-blue/30 hover:ring-brand-blue transition-all"
                  />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all shadow-sm"
                >
                  Join CampusMart
                </Link>
              )}

              {isProfileOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-sm font-bold text-black dark:text-white">
                          {currentUser.name}
                        </p>
                        {currentUser.isVerified && (
                          <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-white shrink-0" />
                        )}
                      </div>
                      <p className="truncate text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>My Profile & Listings</span>
                    </Link>

                    {/* Developer Mock Switchers */}
                    <div className="border-t border-b border-gray-100 my-2 py-2 space-y-1 dark:border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 px-2 uppercase tracking-wide">
                        Simulate Role
                      </p>
                      <button
                        onClick={() => switchUser('student')}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs text-left ${
                          currentUser.id === 'user_1'
                            ? 'text-brand-blue font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Student View</span>
                      </button>
                      <button
                        onClick={() => switchUser('admin')}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs text-left ${
                          currentUser.id === 'user_admin'
                            ? 'text-brand-blue font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Admin Moderator View</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentUser(null);
                        setIsProfileOpen(false);
                        router.push('/');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsNotifOpen(false);
                setIsProfileOpen(false);
              }}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 dark:border-gray-800 dark:bg-brand-dark animate-fade-in shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search marketplace..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </form>

          {/* Mobile Links */}
          <div className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && link.badge > 0 ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}

            {currentUser?.id === 'user_admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400"
              >
                <ShieldAlert className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Status/Logout */}
          <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-black dark:text-white">{currentUser.name}</p>
                      {currentUser.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-white" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
                
                {/* Switcher in Mobile menu */}
                <div className="bg-gray-50 dark:bg-gray-850 p-2.5 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    Simulate Role
                  </p>
                  <button
                    onClick={() => switchUser('student')}
                    className="w-full text-left text-xs font-semibold py-1 text-gray-700 dark:text-gray-300"
                  >
                    Student View
                  </button>
                  <button
                    onClick={() => switchUser('admin')}
                    className="w-full text-left text-xs font-semibold py-1 text-gray-700 dark:text-gray-300"
                  >
                    Admin Moderator View
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setIsMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl bg-black py-3 text-sm font-bold text-white hover:bg-gray-900 dark:bg-white dark:text-black"
              >
                Join CampusMart
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
