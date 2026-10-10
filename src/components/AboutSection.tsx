import React from 'react';
import { Sparkles, Heart, UtensilsCrossed } from 'lucide-react';
import { RestaurantInfo } from '../types/restaurant.ts';

interface AboutSectionProps {
  restaurant: RestaurantInfo;
  onExploreMenu: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ restaurant, onExploreMenu }) => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-[#FCFBF7] border-b border-[#E7E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Images Grid Showcase */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-sm border border-[#E0DACB] aspect-square bg-[#EAE6DB]">
                <img
                  src="/src/assets/images/falafel_wrap_fresh_1791657580279.jpg"
                  alt="Fresh pita wrap at Wow Falafel"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 rounded-xl bg-[#F6F4ED] border border-[#DDD7C8] text-xs text-[#4A554A] space-y-1">
                <span className="font-bold text-[#162E20] block">Pure Chickpeas</span>
                <p>Never canned or processed. Soaked overnight and stone-ground with fresh herbs.</p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-xl bg-[#F6F4ED] border border-[#DDD7C8] text-xs text-[#4A554A] space-y-1">
                <span className="font-bold text-[#162E20] block">Cold-Pressed Oil</span>
                <p>Hand-crafted tahini and dressings seasoned with California extra virgin olive oil.</p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-sm border border-[#E0DACB] aspect-square bg-[#EAE6DB]">
                <img
                  src="/src/assets/images/hummus_sides_dips_1791657600339.jpg"
                  alt="Velvety hummus with olive oil at Wow Falafel"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Text Story Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="text-xs font-semibold tracking-wider text-[#1B432E] uppercase">
              Our Culinary Heritage
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#162E20] tracking-tight leading-tight [text-wrap:balance]">
              Artisanal Falafel Crafted the Way It Was Meant to Be
            </h2>

            <div className="space-y-4 text-base text-[#475448] leading-relaxed">
              <p>
                At <strong>{restaurant.name}</strong>, we believe honest Mediterranean food begins with genuine simplicity: whole chickpeas, fragrant bunches of fresh flat-leaf parsley and cilantro, garlic, roasted cumin, and coriander ground together in small daily batches.
              </p>
              <p>
                Each falafel is scooped by hand and fried to order, creating that legendary golden-brown, crispy exterior that cracks open to reveal a steaming, tender, vibrant-green center. Paired with our velvety tahini, slow-simmered hummus, and pickled turnips, it's a taste of time-honored Mediterranean street culture right here in California City.
              </p>
            </div>

            {/* Values Strips (Clean Unboxed Metadata Discipline) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E7E2D6] text-xs text-[#4A554A]">
              <div>
                <span className="font-bold text-[#162E20] block text-sm">100% Plant-Based Base</span>
                <span>Vegetarian & vegan friendly recipes with gluten-free options.</span>
              </div>
              <div>
                <span className="font-bold text-[#162E20] block text-sm">Fried Fresh to Order</span>
                <span>Never sitting under heat lamps. Crisp, piping hot texture in every bite.</span>
              </div>
              <div>
                <span className="font-bold text-[#162E20] block text-sm">Local Roots</span>
                <span>Proudly serving California City, Kern County residents and travelers.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3 text-xs font-semibold text-white bg-[#1B432E] hover:bg-[#143424] rounded-lg transition-colors shadow-xs"
              >
                Browse Our Complete Menu
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
