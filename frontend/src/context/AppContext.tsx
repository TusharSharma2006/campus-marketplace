'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, Chat, Notification, Message, mockProducts, mockUsers, mockChats, mockNotifications } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  products: Product[];
  wishlist: string[];
  chats: Chat[];
  notifications: Notification[];
  activeChatId: string | null;
  setCurrentUser: (user: User | null) => void;
  toggleWishlist: (productId: string) => void;
  addListing: (product: Omit<Product, 'id' | 'sellerId' | 'dateAdded' | 'views' | 'wishlistedCount' | 'reviews'>) => void;
  sendMessage: (chatId: string, text: string) => void;
  startChatWithSeller: (productId: string, sellerId: string) => string;
  markNotificationsAsRead: () => void;
  setActiveChatId: (chatId: string | null) => void;
  deleteProduct: (productId: string) => void;
  verifyUserToggle: (userId: string) => void;
  banUserToggle: (userId: string) => void;
  bannedUsers: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Alex Rivera logged in by default
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [wishlist, setWishlist] = useState<string[]>(['prod_3', 'prod_7']); // Initial wishlisted items
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

  // Toggle Item in Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isExist = prev.includes(productId);
      if (isExist) {
        // Decrease count
        setProducts(prevProducts => prevProducts.map(p => 
          p.id === productId ? { ...p, wishlistedCount: Math.max(0, p.wishlistedCount - 1) } : p
        ));
        return prev.filter((id) => id !== productId);
      } else {
        // Increase count
        setProducts(prevProducts => prevProducts.map(p => 
          p.id === productId ? { ...p, wishlistedCount: p.wishlistedCount + 1 } : p
        ));
        return [...prev, productId];
      }
    });
  };

  // Add a new product listing (From Sell page)
  const addListing = (newProd: Omit<Product, 'id' | 'sellerId' | 'dateAdded' | 'views' | 'wishlistedCount' | 'reviews'>) => {
    if (!currentUser) return;
    const fullProduct: Product = {
      ...newProd,
      id: `prod_${Date.now()}`,
      sellerId: currentUser.id,
      dateAdded: new Date().toISOString().split('T')[0],
      views: 0,
      wishlistedCount: 0,
      reviews: []
    };

    setProducts((prev) => [fullProduct, ...prev]);

    // Update listings count for current user
    if (currentUser) {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, listingsCount: prevUser.listingsCount + 1 } : null);
    }

    // Add system notification
    const newNotif: Notification = {
      id: `not_${Date.now()}`,
      title: 'Listing Published Successfully',
      description: `Your listing "${newProd.title}" is now active in the Campus Marketplace.`,
      type: 'system',
      date: 'Just now',
      read: false,
      link: `/marketplace`
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Delete product (Admin or Seller action)
  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    
    // Add notification
    const newNotif: Notification = {
      id: `not_${Date.now()}`,
      title: 'Listing Removed',
      description: `The listing has been removed from the platform.`,
      type: 'system',
      date: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Admin user verification toggle
  const verifyUserToggle = (userId: string) => {
    // We would toggle isVerified in the users array
    // Here we can just simulate it or log it
    const updatedUsers = allUsers.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u);
    setAllUsers(updatedUsers);
    // If it's current user, update current user too
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, isVerified: !currentUser.isVerified });
    }
  };

  // Admin user ban toggle
  const banUserToggle = (userId: string) => {
    setBannedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Send message
  const sendMessage = (chatId: string, text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString()
    };

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0
          };
        }
        return chat;
      });
    });

    // Simulate mock seller/buyer reply after 2 seconds
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const recipientId = chat.sellerId === currentUser.id ? chat.buyerId : chat.sellerId;
    const recipientName = mockUsers.find(u => u.id === recipientId)?.name || 'Seller';

    setTimeout(() => {
      const responseText = getMockResponse(text, recipientName);
      const mockReply: Message = {
        id: `msg_${Date.now() + 1}`,
        senderId: recipientId,
        text: responseText,
        timestamp: new Date().toISOString()
      };

      setChats((prevChats) => {
        return prevChats.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              messages: [...c.messages, mockReply],
              lastMessageTime: new Date().toISOString(),
              unreadCount: activeChatId === chatId ? 0 : c.unreadCount + 1
            };
          }
          return c;
        });
      });

      // Show notification if chat is not open
      if (activeChatId !== chatId) {
        setNotifications((prev) => [
          {
            id: `not_${Date.now()}`,
            title: `Message from ${recipientName}`,
            description: responseText.length > 50 ? `${responseText.substring(0, 47)}...` : responseText,
            type: 'message',
            date: 'Just now',
            read: false,
            link: '/chat'
          },
          ...prev
        ]);
      }
    }, 2000);
  };

  // Start chat with seller from Product Details
  const startChatWithSeller = (productId: string, sellerId: string): string => {
    if (!currentUser) return '';

    // Check if chat already exists for this product and buyer
    const existingChat = chats.find(
      (c) => c.productId === productId && c.buyerId === currentUser.id
    );

    if (existingChat) {
      setActiveChatId(existingChat.id);
      return existingChat.id;
    }

    // Otherwise create a new chat
    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      productId,
      buyerId: currentUser.id,
      sellerId,
      unreadCount: 0,
      lastMessageTime: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: 'system',
          text: `You started a chat about "${products.find(p => p.id === productId)?.title || 'this item'}". Meet in public spaces and check items thoroughly before paying.`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
    return newChatId;
  };

  // Mark all notifications as read
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Simple mock response generator for the interactive feel
  const getMockResponse = (inputText: string, name: string): string => {
    const text = inputText.toLowerCase();
    if (text.includes('available') || text.includes('still have')) {
      return `Yes, the item is still available! Are you on campus today? I can meet near the library.`;
    }
    if (text.includes('price') || text.includes('discount') || text.includes('negotiable') || text.includes('offer')) {
      return `I think the price is already fair, but I could do a tiny bit lower if you can pick it up today. What is your offer?`;
    }
    if (text.includes('meet') || text.includes('where') || text.includes('time')) {
      return `I am free this afternoon after my lectures, around 4:30 PM. Does the Student Center works for you?`;
    }
    if (text.includes('condition') || text.includes('damage') || text.includes('scratches')) {
      return `It's in really good condition, just typical minor college use. I can show you more photos if you'd like.`;
    }
    return `Hey! Thanks for messaging. Let me check my schedule and get back to you in a bit. Can we meet on campus tomorrow?`;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        products,
        wishlist,
        chats,
        notifications,
        activeChatId,
        setCurrentUser,
        toggleWishlist,
        addListing,
        sendMessage,
        startChatWithSeller,
        markNotificationsAsRead,
        setActiveChatId,
        deleteProduct,
        verifyUserToggle,
        banUserToggle,
        bannedUsers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
