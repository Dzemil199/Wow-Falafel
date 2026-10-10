/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialRestaurantInfo, initialMenuItems } from './data/initialData.ts';
import {
  RestaurantInfo,
  MenuItem,
  CartItem,
  CartItemOption,
  VerifiedReview
} from './types/restaurant.ts';
import { api } from './services/api.ts';
import { Header } from './components/Header.tsx';
import { TemporaryClosureNotice } from './components/TemporaryClosureNotice.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { ItemCustomizeModal } from './components/ItemCustomizeModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { ContactLocationSection } from './components/ContactLocationSection.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { Footer } from './components/Footer.tsx';
import { LegalModals } from './components/LegalModals.tsx';

export default function App() {
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(initialRestaurantInfo);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [reviews, setReviews] = useState<VerifiedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wf_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartItems]);

  // Initial data loading from server
  const loadData = async () => {
    try {
      const [restData, menuData, revData] = await Promise.allSettled([
        api.getRestaurant(),
        api.getMenu(),
        api.getReviews()
      ]);

      if (restData.status === 'fulfilled') setRestaurant(restData.value);
      if (menuData.status === 'fulfilled') setMenuItems(menuData.value);
      if (revData.status === 'fulfilled') setReviews(revData.value);
    } catch (err) {
      console.error('Error fetching initial restaurant data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart Operations
  const handleAddToCart = (item: MenuItem, quantity: number, options: CartItemOption) => {
    const extrasCost = (options.selectedExtras || []).reduce((sum, e) => sum + e.price, 0);
    const unitPrice = item.price + extrasCost;
    const totalPrice = unitPrice * quantity;

    const extrasKey = (options.selectedExtras || [])
      .map(e => e.id)
      .sort()
      .join('-');
    const cartItemId = `${item.id}-${options.selectedSauce || 'none'}-${extrasKey}-${options.specialInstructions || ''}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(ci => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem: item,
            quantity,
            options,
            unitPrice,
            totalPrice
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleDirectAddToCart = (item: MenuItem) => {
    handleAddToCart(item, 1, {
      selectedSauce: item.sauceOptions?.[0],
      selectedExtras: []
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF7] text-[#162E20] antialiased selection:bg-[#1B432E] selection:text-white">
      
      {/* Top Banner for Temporary Closure Notice */}
      <TemporaryClosureNotice
        restaurant={restaurant}
        onOpenContact={() => scrollToSection('contact')}
        onExploreMenu={() => scrollToSection('menu')}
      />

      {/* Primary Navigation Header */}
      <Header
        restaurant={restaurant}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={scrollToSection}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          restaurant={restaurant}
          onExploreMenu={() => scrollToSection('menu')}
          onOrderOnline={() => {
            scrollToSection('menu');
            setIsCartOpen(true);
          }}
          onGetDirections={() => {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${restaurant.address}, ${restaurant.suite}, ${restaurant.city}, ${restaurant.state} ${restaurant.zip}`
            )}`;
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
        />

        {/* 2. Menu Section */}
        <MenuSection
          menuItems={menuItems}
          restaurant={restaurant}
          onSelectItem={(item) => setCustomizingItem(item)}
          onDirectAddToCart={handleDirectAddToCart}
        />

        {/* 3. About & Culinary Heritage Section */}
        <AboutSection
          restaurant={restaurant}
          onExploreMenu={() => scrollToSection('menu')}
        />

        {/* 4. Verified Customer Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          onReviewSubmitted={loadData}
        />

        {/* 5. Location, Working Call Button & Contact Form Section */}
        <ContactLocationSection
          restaurant={restaurant}
        />
      </main>

      {/* Footer */}
      <Footer
        restaurant={restaurant}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* Modals & Drawers */}
      <ItemCustomizeModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        restaurant={restaurant}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        restaurant={restaurant}
        onRestaurantUpdated={(updated) => setRestaurant(updated)}
        menuItems={menuItems}
        onMenuUpdated={loadData}
      />

      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        restaurant={restaurant}
      />

    </div>
  );
}
