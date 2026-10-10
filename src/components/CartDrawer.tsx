import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { CartItem, RestaurantInfo, Order } from '../types/restaurant.ts';
import { api } from '../services/api.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  restaurant: RestaurantInfo;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  restaurant,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupTime, setPickupTime] = useState('In 25-30 minutes');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxRate = restaurant.taxRate || 0.0825;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name for order pickup.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Please enter a valid phone number for pickup notifications.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map cart items for backend
      const itemsPayload = cartItems.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        selectedSauce: item.options.selectedSauce,
        selectedExtras: item.options.selectedExtras,
        specialInstructions: item.options.specialInstructions
      }));

      // If restaurant is temporarily closed, send isTestOrder flag to allow flow simulation
      const isTestOrder = restaurant.isTemporarilyClosed;

      const result = await api.submitOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        pickupTime,
        orderNotes: orderNotes.trim() || undefined,
        items: itemsPayload,
        isTestOrder
      });

      if (result.success && result.order) {
        setConfirmedOrder(result.order);
        setStep('confirmation');
        onClearCart();
      } else {
        setErrorMessage('Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while submitting your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (step === 'confirmation') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E7E2D6] animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#E7E2D6] bg-[#FCFBF7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1B432E]" />
            <h2 className="font-bold text-base text-[#162E20]">
              {step === 'cart' && 'Your Mediterranean Order'}
              {step === 'checkout' && 'Pickup & Contact Details'}
              {step === 'confirmation' && 'Order Received'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="p-1.5 rounded-lg text-[#5B675C] hover:bg-[#EFECE3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          
          {/* STEP 1: CART LIST */}
          {step === 'cart' && (
            <div className="space-y-5">
              
              {/* Temporarily Closed Notice */}
              {restaurant.isTemporarilyClosed && (
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Restaurant Temporarily Closed</span>
                  </div>
                  <p className="text-amber-800/90 leading-relaxed">
                    Live payments and orders are paused until our reopening. You can preview our checkout experience in <strong>System Test Mode</strong>. No payment will be charged.
                  </p>
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F3EFE6] text-[#717E72] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-[#162E20]">Your cart is empty</p>
                  <p className="text-xs text-[#6C786D] max-w-xs mx-auto">
                    Add crispy falafel wraps, platters, fresh salads, and hummus from our menu.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#EFECE3]">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="py-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm text-[#162E20]">
                            {item.menuItem.name}
                          </div>
                          {item.options.selectedSauce && (
                            <div className="text-xs text-[#526053]">
                              Sauce: <span className="font-medium">{item.options.selectedSauce}</span>
                            </div>
                          )}
                          {item.options.selectedExtras && item.options.selectedExtras.length > 0 && (
                            <div className="text-xs text-[#526053]">
                              Extras: {item.options.selectedExtras.map(e => e.name).join(', ')}
                            </div>
                          )}
                          {item.options.specialInstructions && (
                            <div className="text-xs text-[#7B887C] italic">
                              "{item.options.specialInstructions}"
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-bold font-mono tabular-nums text-[#1B432E] shrink-0">
                          ${item.totalPrice.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-[#DDD7C8] rounded-md bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 text-[#4A554A] hover:bg-[#F2EFE7]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 text-[#4A554A] hover:bg-[#F2EFE7]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              {/* Pickup Service Details (No delivery invented!) */}
              <div className="p-3.5 rounded-lg bg-[#F6F4ED] border border-[#DDD7C8] text-xs space-y-2">
                <div className="font-semibold text-[#162E20] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1B432E]" />
                  <span>Order Type: Customer Pickup</span>
                </div>
                <div className="text-[#556356]">
                  {restaurant.address}, {restaurant.suite}, {restaurant.city}, CA {restaurant.zip}
                </div>
                <div className="text-[#6E7B6F]">
                  Note: Delivery service is not currently offered. Orders are prepared fresh for in-store pickup.
                </div>
              </div>

              {/* Status Test Badge */}
              {restaurant.isTemporarilyClosed && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Interactive Test Mode</span>
                    <span>
                      Order will be submitted to the kitchen queue for testing. No real card will be charged.
                    </span>
                  </div>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Alex Johnson"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Phone Number * (for pickup confirmation)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., (661) 555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., alex@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Requested Pickup Time
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  >
                    <option value="In 25-30 minutes">In 25–30 minutes (Standard)</option>
                    <option value="In 45 minutes">In 45 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                    <option value="In 2 hours">In 2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Special Preparation Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any allergy alerts, extra napkins, or arrival details..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Info Note */}
              <div className="p-3 rounded-lg border border-[#DDD7C8] bg-[#FAF8F2] text-xs text-[#526053] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#162E20]">
                  <CreditCard className="w-3.5 h-3.5 text-[#1B432E]" />
                  <span>Payment Information</span>
                </div>
                <p>
                  {restaurant.isTemporarilyClosed
                    ? 'Payment processor is running in Test Mode. Real payments will be activated once business officially reopens.'
                    : 'Pay upon pickup in restaurant with Cash, Visa, MasterCard, or Apple Pay.'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

            </form>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="space-y-5 text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#162E20]">Order Registered!</h3>
                <p className="text-xs text-[#526053]">
                  Your order has been recorded into the Wow Falafel kitchen system.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-xl border border-[#DDD7C8] bg-[#FAF8F2] text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-[#E7E2D6]">
                  <span className="text-[#6E7B6F]">Order Number</span>
                  <span className="font-mono font-bold text-sm text-[#1B432E]">{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6E7B6F]">Customer</span>
                  <span className="font-semibold text-[#162E20]">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6E7B6F]">Contact Phone</span>
                  <span className="font-medium text-[#162E20]">{confirmedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6E7B6F]">Scheduled Pickup</span>
                  <span className="font-medium text-[#162E20]">{confirmedOrder.pickupTime}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E7E2D6] font-bold text-sm">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-[#1B432E]">${confirmedOrder.total.toFixed(2)}</span>
                </div>

                {confirmedOrder.isTestOrder && (
                  <div className="mt-2 p-2 bg-amber-100/60 rounded text-[11px] text-amber-900 text-center font-medium">
                    This order was logged in System Test Mode while the restaurant is temporarily closed.
                  </div>
                )}
              </div>

              {/* Location details */}
              <div className="p-3 rounded-lg bg-white border border-[#DDD7C8] text-xs text-[#556356] space-y-1">
                <div className="font-semibold text-[#162E20]">Pickup Location</div>
                <div>{restaurant.address}, {restaurant.suite}</div>
                <div>{restaurant.city}, CA {restaurant.zip}</div>
                <div className="font-medium text-[#1B432E]">Tel: {restaurant.phone}</div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#1B432E] hover:bg-[#143424] rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer Calculations & Action Buttons */}
        {step !== 'confirmation' && cartItems.length > 0 && (
          <div className="p-5 border-t border-[#E7E2D6] bg-[#FCFBF7] space-y-3">
            <div className="space-y-1 text-xs text-[#4A554A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8.25% CA)</span>
                <span className="font-mono tabular-nums font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E7E2D6] text-sm font-bold text-[#162E20]">
                <span>Total</span>
                <span className="font-mono tabular-nums text-[#1B432E] text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <span className="font-mono tabular-nums font-bold">(${total.toFixed(2)})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-lg border border-[#DDD7C8] text-[#162E20] hover:bg-[#EFECE3] text-xs font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <span>
                      {restaurant.isTemporarilyClosed ? 'Submit Test Order' : 'Place Pickup Order'}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
