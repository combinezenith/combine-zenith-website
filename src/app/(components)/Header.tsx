'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { BiUser } from 'react-icons/bi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo on the left */}
<Link href="/" className="flex items-center">
  <div className="relative w-40 h-12">
    <Image
      src="/logo-white.png"
      fill
      className="object-contain"
      alt="COMBINE ZENITH LOGO"
      priority
      sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 160px"
    />
  </div>
</Link>

          {/* Navigation links in the middle - hidden on mobile */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-purple-300 transition-colors duration-200">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-purple-300 transition-colors duration-200">
                About
              </Link>
              <Link href="/services" className="text-white hover:text-purple-300 transition-colors duration-200">
                Services
              </Link>
              <Link href="/team" className="text-white hover:text-purple-300 transition-colors duration-200">
                Team
              </Link>
              <Link href="/portfolio" className="text-white hover:text-purple-300 transition-colors duration-200">
                Portfolio
              </Link>
              <Link href="/blog" className="text-white hover:text-purple-300 transition-colors duration-200">
                Blog
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-300 transition-colors duration-200">
                Contact
              </Link>
            </div>
          </div>

          {/* Get Started button with icon on the right */}
          <div className="hidden lg:flex items-center">
            <button className="flex items-center space-x-2 p-2 bg-white text-purple-900 rounded-lg hover:bg-purple-100 transition-colors duration-200 font-semibold">
              <BiUser/>
              <span>Get Started</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-purple-700 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-white hover:text-purple-300 transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-purple-300 transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/services" 
                className="text-white hover:text-purple-300 transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/team" 
                className="text-white hover:text-purple-300 transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
              <Link 
                href="/portfolio" 
                className="text-white hover:text-purple-300 transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link 
                href="/blog" 
                className="text-white hover:text-purple-300 transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className="text-white hover:text-purple-300 transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <button className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-white text-purple-900 rounded-lg hover:bg-purple-100 transition-colors duration-200 font-semibold mt-4">
                <span>Get Started</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

