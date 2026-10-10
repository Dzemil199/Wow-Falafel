import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, MenuItemExtra, CartItemOption } from '../types/restaurant.ts';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, options: CartItemOption) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSauce, setSelectedSauce] = useState<string>(
    item.sauceOptions && item.sauceOptions.length > 0 ? item.sauceOptions[0] : ''
  );
  const [selectedExtras, setSelectedExtras] = useState<MenuItemExtra[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleExtra = (extra: MenuItemExtra) => {
    if (selectedExtras.some(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = item.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(item, quantity, {
      selectedSauce,
      selectedExtras,
      specialInstructions: specialInstructions.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E7E2D6] overflow-hidden">
        
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 bg-[#EFECE3] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 bg-black/60 backdrop-blur-xs p-3 rounded-lg text-white">
            <h3 className="font-bold text-base sm:text-lg leading-tight">{item.name}</h3>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Sauce Options */}
          {item.sauceOptions && item.sauceOptions.length > 0 && (
            <div className="space-y-2.5">
              <label className="font-semibold text-[#162E20] block text-xs uppercase tracking-wider">
                Select Your Sauce Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.sauceOptions.map(sauce => {
                  const isChecked = selectedSauce === sauce;
                  return (
                    <button
                      key={sauce}
                      type="button"
                      onClick={() => setSelectedSauce(sauce)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'border-[#1B432E] bg-emerald-50 text-[#1B432E] font-semibold'
                          : 'border-[#DDD7C8] hover:border-[#B3AC9B] text-[#3D4B3E]'
                      }`}
                    >
                      <span>{sauce}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#1B432E]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Extras */}
          {item.extras && item.extras.length > 0 && (
            <div className="space-y-2.5">
              <label className="font-semibold text-[#162E20] block text-xs uppercase tracking-wider">
                Add-ons & Extras
              </label>
              <div className="space-y-2">
                {item.extras.map(extra => {
                  const isChecked = selectedExtras.some(e => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'border-[#1B432E] bg-emerald-50 text-[#1B432E] font-semibold'
                          : 'border-[#DDD7C8] hover:border-[#B3AC9B] text-[#3D4B3E]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[#1B432E] border-[#1B432E] text-white' : 'border-[#9FA9A0]'}`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{extra.name}</span>
                      </div>
                      <span className="font-mono tabular-nums font-semibold">+${extra.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#162E20] block text-xs uppercase tracking-wider">
              Special Notes / Dietary Adjustments
            </label>
            <input
              type="text"
              placeholder="e.g., Dressing on the side, extra crunchy falafel..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#DDD7C8] text-[#162E20] focus:outline-none focus:ring-2 focus:ring-[#1B432E]"
            />
          </div>

        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 bg-[#FAF8F2] border-t border-[#E7E2D6] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#DDD7C8] rounded-lg bg-white overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-2 text-[#4A554A] hover:bg-[#F2EFE7] disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold font-mono tabular-nums text-[#162E20]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-[#4A554A] hover:bg-[#F2EFE7]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white font-semibold text-xs transition-colors flex items-center justify-between shadow-xs"
          >
            <span>Add to Order</span>
            <span className="font-mono tabular-nums font-bold">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
