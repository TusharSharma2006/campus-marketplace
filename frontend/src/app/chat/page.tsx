'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { mockUsers, mockProducts, User, Product, Chat } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import { 
  Send, Search, MessageSquare, ShieldCheck, ChevronLeft, 
  ExternalLink, Lock, AlertTriangle, CheckCircle2, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ChatContent() {
  const { 
    currentUser, 
    chats, 
    products, 
    activeChatId, 
    setActiveChatId, 
    sendMessage 
  } = useApp();

  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check URL query parameters for chat initialization
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && chats.some(c => c.id === idParam)) {
      setActiveChatId(idParam);
    }
  }, [searchParams, chats, setActiveChatId]);

  // Scroll to bottom when messages or active chat changes
  const activeChat = chats.find(c => c.id === activeChatId);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, activeChatId]);

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center text-brand-blue mb-4">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2">Join the Conversation</h2>
          <p className="text-xs text-gray-550 mb-6 leading-relaxed">
            You must be logged in to chat with other students, negotiate offers, and arrange meetups on campus.
          </p>
          <Link
            href="/login"
            className="w-full py-3 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-xs font-bold transition-all shadow-md"
          >
            Log In to Your Account
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Find recipient user details for a chat thread
  const getRecipientInfo = (chat: Chat): { name: string; avatar: string; isVerified: boolean; id: string } => {
    const recipientId = chat.sellerId === currentUser.id ? chat.buyerId : chat.sellerId;
    const user = mockUsers.find(u => u.id === recipientId);
    return {
      id: recipientId,
      name: user?.name || 'Campus Student',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      isVerified: user?.isVerified || false
    };
  };

  // Find product details for a chat thread
  const getProductInfo = (chat: Chat): Product | undefined => {
    return products.find(p => p.id === chat.productId) || mockProducts.find(p => p.id === chat.productId);
  };

  // Filter chats based on recipient name or product title
  const filteredChats = chats.filter(chat => {
    const recipient = getRecipientInfo(chat);
    const product = getProductInfo(chat);
    const query = searchQuery.toLowerCase();
    return (
      recipient.name.toLowerCase().includes(query) ||
      (product?.title || '').toLowerCase().includes(query)
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    sendMessage(activeChatId, inputText.trim());
    setInputText('');
  };

  // Determine if other user is typing based on last message from current user
  const isOtherUserTyping = activeChat && activeChat.messages.length > 0 && 
    activeChat.messages[activeChat.messages.length - 1].senderId === currentUser.id;

  const activeProduct = activeChat ? getProductInfo(activeChat) : undefined;
  const activeRecipient = activeChat ? getRecipientInfo(activeChat) : undefined;

  return (
    <div className="flex flex-col h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-0 sm:p-4 md:p-6">
        
        {/* main container card */}
        <div className="flex-1 bg-white border-0 sm:border border-gray-150 sm:rounded-3xl shadow-xl dark:border-gray-800 dark:bg-gray-900 flex overflow-hidden">
          
          {/* Side pane (List of conversations) */}
          <div className={`w-full md:w-80 flex-col border-r border-gray-150 dark:border-gray-850 shrink-0 ${
            activeChatId ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-gray-100 dark:border-gray-855">
              <h2 className="text-md font-bold tracking-tight mb-3 flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-brand-blue" />
                Dorm Messenger
              </h2>
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats or listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-55 outline-none focus:bg-white dark:border-gray-800 dark:bg-gray-850"
                />
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-850">
              {filteredChats.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No active conversations.
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const recipient = getRecipientInfo(chat);
                  const product = getProductInfo(chat);
                  const isActive = chat.id === activeChatId;
                  const lastMessage = chat.messages[chat.messages.length - 1];

                  return (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full p-4 flex gap-3 text-left transition-all ${
                        isActive 
                          ? 'bg-blue-50/20 border-l-4 border-brand-blue dark:bg-gray-855/50' 
                          : 'hover:bg-gray-55/50 dark:hover:bg-gray-855/20'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={recipient.avatar}
                          alt={recipient.name}
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-800"
                        />
                        {chat.unreadCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 border border-white dark:border-gray-900 rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-xs font-bold text-black dark:text-white truncate flex items-center gap-1">
                            {recipient.name}
                            {recipient.isVerified && (
                              <CheckCircle2 className="h-3 w-3 fill-blue-500 text-white" />
                            )}
                          </span>
                          <span className="text-[9px] text-gray-450 shrink-0">
                            {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-brand-blue truncate">
                          {product?.title || 'Unknown Product'}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-405 truncate mt-0.5">
                          {lastMessage ? (
                            lastMessage.senderId === currentUser.id ? `You: ${lastMessage.text}` : lastMessage.text
                          ) : (
                            'System message'
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active chat pane */}
          <div className={`flex-1 flex flex-col overflow-hidden bg-gray-50/40 dark:bg-brand-dark/10 ${
            !activeChatId ? 'hidden md:flex' : 'flex'
          }`}>
            {activeChat && activeRecipient ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-150 bg-white dark:border-gray-850 dark:bg-gray-900 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => setActiveChatId(null)}
                      className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-black dark:hover:text-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <img
                      src={activeRecipient.avatar}
                      alt={activeRecipient.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-black dark:text-white flex items-center gap-1 leading-tight">
                        {activeRecipient.name}
                        {activeRecipient.isVerified && (
                          <CheckCircle2 className="h-3 w-3 fill-blue-500 text-white" />
                        )}
                      </h3>
                      <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-450 hover:text-black dark:hover:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-855 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-Header / Product Offer Lock bar */}
                {activeProduct && (
                  <div className="px-4 py-3 bg-gray-55 border-b border-gray-150 dark:bg-gray-900/50 dark:border-gray-850 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={activeProduct.images[0]}
                        alt={activeProduct.title}
                        className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link 
                          href={`/marketplace/${activeProduct.id}`}
                          className="text-xs font-bold text-black dark:text-white truncate hover:underline flex items-center gap-1"
                        >
                          {activeProduct.title}
                          <ExternalLink className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        </Link>
                        <p className="text-[11px] font-extrabold text-brand-blue">${activeProduct.price}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPaymentOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all shrink-0"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Secure Buy
                    </button>
                  </div>
                )}

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeChat.messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    const isSystem = message.senderId === 'system';

                    if (isSystem) {
                      return (
                        <div key={message.id} className="flex justify-center">
                          <div className="max-w-md bg-amber-50/70 border border-amber-100 rounded-2xl p-3 flex items-start gap-2.5 dark:bg-amber-955/10 dark:border-amber-900/20 text-left">
                            <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-[11px] text-amber-900 dark:text-amber-400 leading-relaxed font-semibold">
                              {message.text}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                            isCurrentUser
                              ? 'bg-black text-white rounded-tr-xs dark:bg-white dark:text-black font-medium'
                              : 'bg-white text-black border border-gray-150 rounded-tl-xs dark:bg-gray-900 dark:border-gray-800 dark:text-white font-medium'
                          }`}
                        >
                          <p>{message.text}</p>
                          <span className={`block text-[9px] mt-1 text-right font-semibold ${
                            isCurrentUser ? 'text-gray-300 dark:text-gray-500' : 'text-gray-400'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isOtherUserTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-150 dark:bg-gray-900 dark:border-gray-800 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-500">
                          {activeRecipient.name.split(' ')[0]} is typing
                        </span>
                        <span className="flex gap-1 items-center">
                          <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message input bar */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-gray-150 bg-white dark:border-gray-850 dark:bg-gray-900 flex gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeRecipient.name.split(' ')[0]}...`}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-250 bg-gray-55 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-gray-800 dark:bg-gray-850"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="h-10 w-10 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 flex items-center justify-center shrink-0 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="h-14 w-14 bg-gray-55 dark:bg-gray-850 rounded-full flex items-center justify-center text-gray-400 mb-3 border border-gray-100 dark:border-gray-800">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xs font-bold text-black dark:text-white">No Active Conversation</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Select a student from your sidebar list to view details, arrange swaps, or negotiate prices.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {activeProduct && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          product={activeProduct}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white text-black dark:bg-brand-dark dark:text-white transition-colors duration-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin dark:border-white mb-3" />
          <p className="text-xs font-bold text-gray-550">Loading messenger...</p>
        </div>
        <Footer />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
