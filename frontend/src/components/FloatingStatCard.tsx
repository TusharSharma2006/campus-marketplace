'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FloatingStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  delay?: number;
  className?: string;
  floatSpeed?: 'slow' | 'medium' | 'fast';
}

export default function FloatingStatCard({
  title,
  value,
  icon: Icon,
  delay = 0,
  className = '',
  floatSpeed = 'medium'
}: FloatingStatCardProps) {
  
  const floatClasses = {
    slow: 'animate-float-slow',
    medium: 'animate-float-medium',
    fast: 'animate-float-fast'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 100, 
        damping: 15, 
        delay 
      }}
      className={`${floatClasses[floatSpeed]} glass-panel-heavy rounded-2xl p-4 flex items-center gap-3.5 shadow-lg max-w-[200px] border border-white/60 select-none ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="text-lg font-extrabold text-black dark:text-black tracking-tight mt-0.5">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
