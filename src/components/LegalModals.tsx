import React from 'react';
import { X, Shield, FileText } from 'lucide-react';
import { RestaurantInfo } from '../types/restaurant.ts';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  restaurant: RestaurantInfo;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose, restaurant }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7E2D6] space-y-5 text-xs text-[#4A554A] leading-relaxed">
        
        <div className="flex items-center justify-between border-b border-[#E7E2D6] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#162E20]">
            {type === 'privacy' ? <Shield className="w-4 h-4 text-[#1B432E]" /> : <FileText className="w-4 h-4 text-[#1B432E]" />}
            <span>{type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close legal modal"
            className="p-1 rounded text-gray-500 hover:bg-[#EFECE3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-2">
            <p><strong>Effective Date:</strong> October 2026</p>
            <p>
              At <strong>{restaurant.name}</strong>, located at {restaurant.address}, {restaurant.suite}, {restaurant.city}, CA {restaurant.zip}, we respect your privacy and are committed to protecting the personal information you share with us.
            </p>
            <h4 className="font-bold text-[#162E20] text-sm pt-2">1. Information We Collect</h4>
            <p>
              When you place a pickup order or submit an inquiry, we collect your name, phone number, and any special preparation instructions you provide. This information is strictly used to fulfill your order and communicate pickup readiness.
            </p>
            <h4 className="font-bold text-[#162E20] text-sm pt-2">2. Payment Security</h4>
            <p>
              We do not store raw payment card data on our servers. When online payments are activated via Stripe, transactions are securely handled according to PCI-DSS Level 1 compliance standards.
            </p>
            <h4 className="font-bold text-[#162E20] text-sm pt-2">3. No Data Selling</h4>
            <p>
              We never sell, rent, or share your contact information with third-party advertisers or data brokers.
            </p>
            <h4 className="font-bold text-[#162E20] text-sm pt-2">4. Contact Us</h4>
            <p>
              For inquiries regarding your personal information, reach us at {restaurant.phone}.
            </p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-2">
            <p><strong>Effective Date:</strong> October 2026</p>
            <p>
              These Terms of Service govern your use of the <strong>{restaurant.name}</strong> website and ordering platform.
            </p>
            <h4 className="font-bold text-[#162E20] text-sm pt-2">1. Operating Status & Ordering Availability</h4>
            <p>
              {restaurant.name} is currently temporarily closed for kitchen and service upgrades. Live orders are not accepted until the restaurant confirms its reopening. Any checkout submissions made during closure are processed in Test Mode with no payment obligation.
            </p>
            <h4 className="font-bold text-[#162E20] text-sm pt-2">2. Pickup Service</h4>
            <p>
              When active, orders placed on this website are for customer in-store pickup at {restaurant.address}, {restaurant.suite}, California City, CA 93505. Delivery is only available if explicitly announced by the restaurant.
            </p>
            <h4 className="font-bold text-[#162E20] text-sm pt-2">3. Cancellations & Modifications</h4>
            <p>
              Please notify us immediately at {restaurant.phone} if you need to adjust or cancel an order.
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-[#E7E2D6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1B432E] text-white font-semibold text-xs hover:bg-[#143424]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
