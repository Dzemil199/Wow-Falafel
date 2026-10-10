import React from 'react';
import { ArrowRight, MapPin, Phone, Clock, DollarSign } from 'lucide-react';
import { RestaurantInfo } from '../types/restaurant.ts';

interface HeroSectionProps {
  restaurant: RestaurantInfo;
  onExploreMenu: () => void;
  onOrderOnline: () => void;
  onGetDirections: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  restaurant,
  onExploreMenu,
  onOrderOnline,
  onGetDirections
}) => {
  return (
    <section id="home" className="relative overflow-hidden bg-[#FCFBF7] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E7E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Story & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Clean Unboxed Metadata (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-[#5C6A5D]">
              <span className="text-[#1B432E] uppercase">California City, CA</span>
              <span aria-hidden="true">·</span>
              <span>Authentic Mediterranean Street Food</span>
              <span aria-hidden="true">·</span>
              <span>{restaurant.priceRange}</span>
            </div>

            {/* Main Headline with balanced wrapping */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#162E20] leading-[1.08] [text-wrap:balance]">
              Fresh Mediterranean Flavor. Every Bite.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#3D4B3E] font-normal leading-relaxed max-w-2xl">
              Discover delicious falafel, fresh ingredients, and Mediterranean-inspired favorites handcrafted right here in California City.
            </p>

            {/* Status Callout Card */}
            {restaurant.isTemporarilyClosed && (
              <div className="p-4 rounded-xl bg-[#F6F4ED] border border-[#DDD7C8] text-sm text-[#445044] space-y-1">
                <div className="flex items-center gap-2 font-semibold text-[#8C3A00]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Current Business Status: Temporarily Closed</span>
                </div>
                <p className="text-xs text-[#5C6A5D]">
                  {restaurant.closureNotice}
                </p>
              </div>
            )}

            {/* Three Mandatory Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#1B432E] hover:bg-[#143424] rounded-lg shadow-sm transition-all flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#1B432E]"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOrderOnline}
                className="px-6 py-3.5 text-sm font-semibold text-[#162E20] bg-[#EFECE3] hover:bg-[#E3DFD4] rounded-lg border border-[#D5CFBF] transition-all focus-visible:outline-2 focus-visible:outline-[#1B432E]"
              >
                Order Online
              </button>

              <button
                onClick={onGetDirections}
                className="px-5 py-3.5 text-sm font-semibold text-[#1B432E] hover:text-[#143424] hover:bg-[#EFECE3] rounded-lg transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#1B432E]"
              >
                <MapPin className="w-4 h-4" />
                <span>Get Directions</span>
              </button>
            </div>

            {/* Verified Quick Contact & Address Line */}
            <div className="pt-4 border-t border-[#E7E2D6] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#526053]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1B432E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#162E20] block">Address</span>
                  <span>{restaurant.address}, {restaurant.suite}</span>
                  <span className="block">{restaurant.city}, {restaurant.state} {restaurant.zip}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#1B432E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#162E20] block">Phone</span>
                  <a
                    href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
                    className="hover:underline font-medium text-[#162E20]"
                  >
                    {restaurant.phone}
                  </a>
                  <span className="block text-[#6E7B6F]">Call for inquiries</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero High-Fidelity Food Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E0DACB] bg-[#EAE6DB] aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="/src/assets/images/hero_falafel_feast_1791657566017.jpg"
                alt="Appetizing Mediterranean feast with golden falafels, hummus, and fresh pitas at Wow Falafel"
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-lg bg-black/40 backdrop-blur-xs text-xs">
                <div className="font-semibold text-sm">Crispy Golden Falafel & Homemade Hummus</div>
                <div className="text-white/80">Made fresh daily with 100% natural herbs & cold-pressed olive oil</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
