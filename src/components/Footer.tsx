import React from 'react';
import { MapPin, Phone, Lock, Heart } from 'lucide-react';
import { RestaurantInfo } from '../types/restaurant.ts';

interface FooterProps {
  restaurant: RestaurantInfo;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  restaurant,
  onNavigate,
  onOpenAdmin,
  onOpenPrivacy,
  onOpenTerms
}) => {
  return (
    <footer className="bg-[#142318] text-[#D8E2D9] pt-14 pb-12 border-t border-[#233829]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#243A2B]">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#275338] text-white flex items-center justify-center text-sm font-black">
                W
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                {restaurant.name}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#9CAD9E] leading-relaxed max-w-sm">
              Authentic Mediterranean street food and hand-crafted falafel in California City, California. Made fresh daily with 100% whole chickpeas, aromatic spices, and garden herbs.
            </p>

            {restaurant.isTemporarilyClosed && (
              <div className="inline-block text-xs px-2.5 py-1 rounded bg-amber-900/60 border border-amber-700/60 text-amber-200">
                Current Status: Temporarily Closed
              </div>
            )}
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors"
                >
                  Digital Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Us & Culinary Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('location')}
                  className="hover:text-white transition-colors"
                >
                  Hours & Map Location
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Contact Details (4 cols) */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Verified Restaurant Contact
            </div>
            
            <div className="space-y-2 text-[#9CAD9E]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Physical Address</span>
                  <span>{restaurant.address}, {restaurant.suite}</span>
                  <span className="block">{restaurant.city}, {restaurant.state} {restaurant.zip}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Phone Orders & Inquiries</span>
                  <a
                    href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-white font-mono text-sm font-semibold"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#243A2B] hover:bg-[#304B38] text-white text-[11px] font-medium transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Restaurant Management Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#809182]">
          <div>
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved. California City, CA.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
