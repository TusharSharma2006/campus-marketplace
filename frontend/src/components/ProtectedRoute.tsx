'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    }
  }, [currentUser, router]);

  if (isChecking && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-black dark:border-white border-r-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
