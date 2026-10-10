import React, { useState } from 'react';
import { ShoppingBag, Lock, Menu, X, Phone } from 'lucide-react';
import { RestaurantInfo } from '../types/restaurant.ts';

interface HeaderProps {
  restaurant: RestaurantInfo;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  restaurant,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF7]/95 backdrop-blur-md border-b border-[#E7E2D6] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#162E20] whitespace-nowrap shrink-0 group"
          >
            <span className="w-8 h-8 rounded-full bg-[#1B432E] text-[#F3EFE6] flex items-center justify-center text-sm font-black shadow-xs group-hover:scale-105 transition-transform">
              W
            </span>
            <span>{restaurant.name || 'Wow Falafel'}</span>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A554A]">
            <button
              onClick={() => handleNavClick('home')}
              className="hover:text-[#162E20] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('menu')}
              className="hover:text-[#162E20] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Menu
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-[#162E20] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('location')}
              className="hover:text-[#162E20] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Hours & Location
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="hover:text-[#162E20] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Reviews
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-[#162E20] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1 primary action (+ functional bag count & admin lock) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Bag Icon Button with Badge */}
            <button
              onClick={onOpenCart}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative p-2.5 rounded-full text-[#162E20] hover:bg-[#EFECE3] transition-colors focus-visible:outline-2 focus-visible:outline-[#1B432E]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-[#C05621] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('menu')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#1B432E] hover:bg-[#143424] rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B432E]"
            >
              Order Online
            </button>

            {/* Admin Access Quick Icon */}
            <button
              onClick={onOpenAdmin}
              title="Restaurant Owner Dashboard"
              aria-label="Restaurant Owner Dashboard"
              className="p-2 rounded-lg text-[#6C786D] hover:text-[#162E20] hover:bg-[#EFECE3] transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg text-[#162E20] hover:bg-[#EFECE3] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E2D6] bg-[#FCFBF7] px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 rounded-md text-base font-medium text-[#162E20] hover:bg-[#EFECE3]"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full text-left py-2.5 px-3 rounded-md text-base font-medium text-[#162E20] hover:bg-[#EFECE3]"
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-2.5 px-3 rounded-md text-base font-medium text-[#162E20] hover:bg-[#EFECE3]"
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('location')}
            className="w-full text-left py-2.5 px-3 rounded-md text-base font-medium text-[#162E20] hover:bg-[#EFECE3]"
          >
            Hours & Location
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="w-full text-left py-2.5 px-3 rounded-md text-base font-medium text-[#162E20] hover:bg-[#EFECE3]"
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left py-2.5 px-3 rounded-md text-base font-medium text-[#162E20] hover:bg-[#EFECE3]"
          >
            Contact
          </button>

          <div className="pt-3 border-t border-[#E7E2D6] flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('menu')}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#1B432E] rounded-lg"
            >
              Order Online
            </button>
            <a
              href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-[#1B432E] border border-[#1B432E] rounded-lg bg-white"
            >
              <Phone className="w-4 h-4" />
              Call +1 442-247-7111
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
