import React from 'react';
import { AlertCircle, MapPin, Phone, Clock } from 'lucide-react';
import { RestaurantInfo } from '../types/restaurant.ts';

interface Props {
  restaurant: RestaurantInfo;
  onOpenContact: () => void;
  onExploreMenu: () => void;
}

export const TemporaryClosureNotice: React.FC<Props> = ({ restaurant, onOpenContact, onExploreMenu }) => {
  if (!restaurant.isTemporarilyClosed) return null;

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-3 text-amber-950">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              <span>Business Status: Temporarily Closed</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-medium">Notice</span>
            </div>
            <p className="text-amber-800/90 text-xs sm:text-sm mt-0.5 max-w-3xl">
              {restaurant.closureNotice || 'Wow Falafel is temporarily closed. Online ordering is currently paused until reopening. You can browse our menu and contact us directly.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <button
            onClick={onExploreMenu}
            className="px-3 py-1.5 rounded-md bg-white border border-amber-300 text-amber-900 font-medium hover:bg-amber-100/50 transition-colors"
          >
            Browse Menu
          </button>
          <a
            href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
            className="px-3 py-1.5 rounded-md bg-emerald-800 text-white font-medium hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3 h-3" />
            <span>Call Restaurant</span>
          </a>
        </div>
      </div>
    </div>
  );
};
