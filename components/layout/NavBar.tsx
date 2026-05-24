'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const navItems = [
    { label: 'EXPLORE', href: '/explore' },
    { label: 'REPOSITORIES', href: '/repositories' },
    { label: 'ISSUES', href: '/issues' },
    { label: 'DOCS', href: '/docs' },
    { label: 'PRICING', href: '/pricing' },
  ];

  return (
    <nav className="border-b-3 border-black bg-brutalist-bg fixed top-0 w-full z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group">
          <span className="text-2xl font-bold uppercase font-bold tracking-tighter hover:text-brutalist-yellow">
            GITNODE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-mono font-bold uppercase border-b-3 border-transparent hover:border-yellow-400 transition-brutal tracking-widest"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div
          className={`hidden lg:flex items-center border-2 border-black px-3 py-2 gap-2 transition-brutal ${
            searchFocus ? 'border-yellow-400' : ''
          }`}
        >
          <Search size={16} className="text-black" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-xs font-mono outline-none w-40"
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
        </div>

        {/* Auth Buttons */}
        <div className="hidden sm:flex gap-2">
          <BrutalistButton
            label="SIGN IN"
            variant="secondary"
            size="sm"
          />
          <BrutalistButton
            label="SIGN UP"
            variant="primary"
            size="sm"
            className="bg-yellow-400 text-black border-black hover:bg-black hover:text-yellow-400"
          />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 border-2 border-black hover:bg-black hover:text-white transition-brutal"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white">
          <div className="flex flex-col divide-y-2 divide-black">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-6 py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-brutal"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-6 py-3 flex gap-2">
              <BrutalistButton
                label="SIGN IN"
                variant="secondary"
                size="sm"
                className="flex-1"
              />
              <BrutalistButton
                label="SIGN UP"
                variant="primary"
                size="sm"
                className="flex-1 bg-yellow-400 text-black"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;