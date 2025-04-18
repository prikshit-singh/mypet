'use client';
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize scroll animations
  const { initScrollAnimations } = useScrollAnimation();
  
  useEffect(() => {
    // Initialize animations when layout mounts
    initScrollAnimations();
    
    // Scroll to top when layout mounts (page change)
    window.scrollTo(0, 0);
    
    // Reinitialize animations when children change (route changes)
    return () => {
      // Small timeout to ensure DOM is ready for animations on route change
      setTimeout(() => initScrollAnimations(), 100);
    };
  }, [initScrollAnimations, children]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
