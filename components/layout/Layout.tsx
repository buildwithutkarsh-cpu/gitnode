'use client';

import React from 'react';
import { Navbar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brutalist-bg text-brutalist-black">
      <Navbar />
      <main className="flex-grow mt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;