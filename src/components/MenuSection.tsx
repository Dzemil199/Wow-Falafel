import React, { useState, useMemo } from 'react';
import { Plus, Search, Check, Sparkles, AlertCircle } from 'lucide-react';
import { MenuItem, RestaurantInfo } from '../types/restaurant.ts';

interface MenuSectionProps {
  menuItems: MenuItem[];
  restaurant: RestaurantInfo;
  onSelectItem: (item: MenuItem) => void;
  onDirectAddToCart: (item: MenuItem) => void;
}

const CATEGORIES: { key: MenuItem['category'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All Items' },
  { key: 'wraps', label: 'Falafel Wraps' },
  { key: 'plates', label: 'Falafel Plates' },
  { key: 'sides', label: 'Hummus & Sides' },
  { key: 'salads', label: 'Fresh Salads' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'specials', label: 'Specials' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  restaurant,
  onSelectItem,
  onDirectAddToCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuItem['category'] | 'all'>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (selectedDietary !== 'all') {
        if (!item.dietary || !item.dietary.includes(selectedDietary)) {
          return false;
        }
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, selectedDietary, searchQuery]);

  return (
    <section id="menu" className="py-16 lg:py-24 bg-[#FAF8F2] border-b border-[#E7E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold tracking-wider text-[#1B432E] uppercase mb-2">
            Authentic Mediterranean Kitchen
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#162E20] tracking-tight [text-wrap:balance]">
            Our Digital Menu
          </h2>
          <p className="mt-3 text-base text-[#475448] leading-relaxed">
            Every dish is prepared fresh using California ingredients, authentic Middle Eastern spices, and time-honored falafel craftsmanship.
          </p>

          {/* Ordering notice during temporary closure */}
          {restaurant.isTemporarilyClosed && (
            <div className="mt-4 p-3.5 rounded-lg bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <span className="font-semibold block">Browsing Mode Active</span>
                <span>
                  The menu is currently available for browsing. Online ordering and payments are paused until Wow Falafel officially reopens. You can add items to your cart to preview order details in Test Mode.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Bar: Category Segmented Bar + Dietary + Search */}
        <div className="space-y-4 mb-10">
          
          {/* Categories Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1B432E] text-white shadow-xs'
                      : 'bg-[#EDE9DE] text-[#4A554A] hover:bg-[#E3DFD4] hover:text-[#162E20]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters: Dietary + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-[#6C786D] font-medium whitespace-nowrap">Filter:</span>
              {['all', 'Vegetarian', 'Vegan', 'Gluten-Free'].map(diet => {
                const isSelected = selectedDietary === diet;
                return (
                  <button
                    key={diet}
                    onClick={() => setSelectedDietary(diet)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-50 border-[#1B432E] text-[#1B432E] font-semibold'
                        : 'bg-white border-[#DDD7C8] text-[#556356] hover:border-[#1B432E]'
                    }`}
                  >
                    {diet === 'all' ? 'All Diets' : diet}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7F8B80]" />
              <input
                type="text"
                placeholder="Search falafel, wraps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] placeholder-[#8F9A90] focus:outline-none focus:ring-2 focus:ring-[#1B432E]"
              />
            </div>
          </div>
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E7E2D6] space-y-2">
            <p className="text-sm font-semibold text-[#162E20]">No menu items found</p>
            <p className="text-xs text-[#6C786D]">Try selecting a different category or clearing your search term.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDietary('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-semibold text-[#1B432E] underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map(item => {
              const hasExtras = (item.extras && item.extras.length > 0) || (item.sauceOptions && item.sauceOptions.length > 0);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E4DFD2] overflow-hidden flex flex-col hover:border-[#B5C2B6] transition-all hover:shadow-xs group"
                >
                  {/* Item Image with Fallback */}
                  <div className="relative aspect-[4/3] bg-[#EFECE3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
                        Sold Out Today
                      </div>
                    )}
                  </div>

                  {/* Item Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Dietary Metadata: unboxed clean text with separators */}
                      {item.dietary && item.dietary.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-[#607062] font-medium">
                          {item.dietary.map((d, i) => (
                            <React.Fragment key={d}>
                              <span>{d}</span>
                              {i < item.dietary.length - 1 && <span aria-hidden="true">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {/* Item Name */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-[#162E20] leading-snug">
                          {item.name}
                        </h3>
                        {/* Tabular Price */}
                        <div className="text-base font-bold text-[#1B432E] font-mono tabular-nums shrink-0">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#526053] leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-2 flex items-center justify-between border-t border-[#F0ECE1]">
                      {hasExtras ? (
                        <button
                          onClick={() => onSelectItem(item)}
                          disabled={!item.isAvailable}
                          className="w-full py-2.5 px-3 rounded-lg bg-[#EFECE3] hover:bg-[#E2DDD0] text-[#162E20] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Customize & Add</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onDirectAddToCart(item)}
                          disabled={!item.isAvailable}
                          className="w-full py-2.5 px-3 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart (${item.price.toFixed(2)})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
