import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  Store,
  Clock,
  UtensilsCrossed,
  ShoppingBag,
  BarChart3,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import {
  RestaurantInfo,
  MenuItem,
  Order,
  SalesReport,
  ContactMessage,
  VerifiedReview,
  OrderStatus
} from '../types/restaurant.ts';
import { api } from '../services/api.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: RestaurantInfo;
  onRestaurantUpdated: (updated: RestaurantInfo) => void;
  menuItems: MenuItem[];
  onMenuUpdated: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onRestaurantUpdated,
  menuItems,
  onMenuUpdated
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('wf_admin_token'));
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'menu' | 'orders' | 'reports' | 'inbox'>('profile');

  // Form states
  const [restForm, setRestForm] = useState<RestaurantInfo>(restaurant);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Orders & reports state
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SalesReport | null>(null);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [allReviews, setAllReviews] = useState<VerifiedReview[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Menu editing state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [newItemForm, setNewItemForm] = useState<Partial<MenuItem>>({
    name: '',
    category: 'wraps',
    description: '',
    price: 10.99,
    image: '/src/assets/images/falafel_wrap_fresh_1791657580279.jpg',
    dietary: ['Vegetarian', 'Vegan'],
    isAvailable: true,
    sauceOptions: ['Tahini Sauce', 'Garlic Sauce', 'Spicy Shatta'],
    extras: []
  });

  useEffect(() => {
    setRestForm(restaurant);
  }, [restaurant]);

  useEffect(() => {
    if (token) {
      loadAdminData(token);
    }
  }, [token, activeTab]);

  const loadAdminData = async (authToken: string) => {
    setLoadingData(true);
    try {
      if (activeTab === 'orders' || activeTab === 'reports') {
        const ords = await api.getOrders(authToken);
        setOrders(ords);
        const st = await api.getStats(authToken);
        setStats(st);
      } else if (activeTab === 'inbox') {
        const msgs = await api.getContacts(authToken);
        setContacts(msgs);
        const revs = await api.getAllReviews(authToken);
        setAllReviews(revs);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await api.adminLogin(passwordInput);
      setToken(res.token);
      localStorage.setItem('wf_admin_token', res.token);
      setPasswordInput('');
      loadAdminData(res.token);
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect password');
    }
  };

  const handleLogout = () => {
    if (token) {
      api.adminLogout(token).catch(() => {});
    }
    setToken(null);
    localStorage.removeItem('wf_admin_token');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaveStatus('Saving changes...');
    try {
      const updated = await api.updateRestaurant(token, restForm);
      onRestaurantUpdated(updated);
      setSaveStatus('Settings successfully saved to database!');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err: any) {
      setSaveStatus(`Error: ${err.message}`);
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      await api.updateOrderStatus(token, orderId, newStatus);
      const updatedOrders = await api.getOrders(token);
      setOrders(updatedOrders);
      const st = await api.getStats(token);
      setStats(st);
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleToggleItemAvailability = async (item: MenuItem) => {
    if (!token) return;
    try {
      await api.updateMenuItem(token, item.id, { isAvailable: !item.isAvailable });
      onMenuUpdated();
    } catch (err: any) {
      alert(`Failed to update availability: ${err.message}`);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.deleteMenuItem(token, itemId);
      onMenuUpdated();
    } catch (err: any) {
      alert(`Failed to delete item: ${err.message}`);
    }
  };

  const handleSaveNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await api.addMenuItem(token, newItemForm);
      setIsAddingNewItem(false);
      onMenuUpdated();
      setNewItemForm({
        name: '',
        category: 'wraps',
        description: '',
        price: 10.99,
        image: '/src/assets/images/falafel_wrap_fresh_1791657580279.jpg',
        dietary: ['Vegetarian', 'Vegan'],
        isAvailable: true,
        sauceOptions: ['Tahini Sauce', 'Garlic Sauce']
      });
    } catch (err: any) {
      alert(`Error adding item: ${err.message}`);
    }
  };

  const handleSaveEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingItem) return;
    try {
      await api.updateMenuItem(token, editingItem.id, editingItem);
      setEditingItem(null);
      onMenuUpdated();
    } catch (err: any) {
      alert(`Error updating item: ${err.message}`);
    }
  };

  const handleVerifyReview = async (reviewId: string, isVerified: boolean) => {
    if (!token) return;
    try {
      await api.setReviewVerification(token, reviewId, isVerified);
      const revs = await api.getAllReviews(token);
      setAllReviews(revs);
    } catch (err: any) {
      alert(`Error updating review: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl border border-[#E7E2D6] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#FCFBF7] border-b border-[#E7E2D6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B432E] text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#162E20]">Wow Falafel Owner Dashboard</h2>
              <p className="text-xs text-[#5C6A5D]">Manage business status, menu, incoming orders, and verified reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close dashboard"
              className="p-1.5 rounded-lg text-[#556356] hover:bg-[#EFECE3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!token ? (
          /* LOGIN VIEW */
          <div className="flex-1 flex items-center justify-center p-6 bg-[#FAF8F2]">
            <div className="w-full max-w-md bg-white p-7 rounded-2xl border border-[#E7E2D6] shadow-sm space-y-5">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#1B432E] flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#162E20]">Restaurant Owner Login</h3>
                <p className="text-xs text-[#6C786D]">
                  Enter the management password to access the restaurant control center.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DDD7C8] text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#768477]">
                    Default owner password: <code className="bg-[#EFECE3] px-1 py-0.5 rounded font-mono font-bold text-[#162E20]">wowfalafel2026</code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white font-semibold transition-colors shadow-xs"
                >
                  Access Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN TABS */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-[#FAF8F2] border-r border-[#E7E2D6] p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-[#1B432E] text-white shadow-xs'
                    : 'text-[#4A554A] hover:bg-[#EFECE3]'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Status & Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('hours')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'hours'
                    ? 'bg-[#1B432E] text-white shadow-xs'
                    : 'text-[#4A554A] hover:bg-[#EFECE3]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Operating Hours</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'menu'
                    ? 'bg-[#1B432E] text-white shadow-xs'
                    : 'text-[#4A554A] hover:bg-[#EFECE3]'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Menu Manager ({menuItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#1B432E] text-white shadow-xs'
                    : 'text-[#4A554A] hover:bg-[#EFECE3]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders Queue ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-[#1B432E] text-white shadow-xs'
                    : 'text-[#4A554A] hover:bg-[#EFECE3]'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Sales Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                  activeTab === 'inbox'
                    ? 'bg-[#1B432E] text-white shadow-xs'
                    : 'text-[#4A554A] hover:bg-[#EFECE3]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages & Reviews</span>
              </button>
            </div>

            {/* Main Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              
              {/* TAB 1: RESTAURANT PROFILE & TEMPORARY CLOSURE STATUS */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#162E20]">Restaurant Profile & Operating Status</h3>
                    <p className="text-xs text-[#6C786D]">
                      Update business status, closure notice, telephone, and verified restaurant details.
                    </p>
                  </div>

                  {saveStatus && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{saveStatus}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                    
                    {/* CRITICAL: Temporary Closure Status Switch */}
                    <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm text-[#8C3A00] block">
                            Business Operational Status
                          </span>
                          <span className="text-amber-800 text-xs">
                            Current state: <strong>{restForm.isTemporarilyClosed ? 'Temporarily Closed' : 'Open for Business'}</strong>
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={restForm.isTemporarilyClosed}
                            onChange={(e) => setRestForm({ ...restForm, isTemporarilyClosed: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-amber-900 block mb-1">
                          Closure Announcement Banner Text:
                        </label>
                        <textarea
                          rows={2}
                          value={restForm.closureNotice}
                          onChange={(e) => setRestForm({ ...restForm, closureNotice: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-[#162E20] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="orderingEnabled"
                          checked={restForm.orderingEnabled}
                          onChange={(e) => setRestForm({ ...restForm, orderingEnabled: e.target.checked })}
                          className="rounded text-[#1B432E]"
                        />
                        <label htmlFor="orderingEnabled" className="text-amber-950 font-medium">
                          Allow live order submissions (Only check if kitchen is actively accepting orders)
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">Restaurant Name</label>
                        <input
                          type="text"
                          value={restForm.name}
                          onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={restForm.phone}
                          onChange={(e) => setRestForm({ ...restForm, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">Street Address</label>
                        <input
                          type="text"
                          value={restForm.address}
                          onChange={(e) => setRestForm({ ...restForm, address: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">Suite / Unit</label>
                        <input
                          type="text"
                          value={restForm.suite}
                          onChange={(e) => setRestForm({ ...restForm, suite: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">City</label>
                        <input
                          type="text"
                          value={restForm.city}
                          onChange={(e) => setRestForm({ ...restForm, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">State</label>
                        <input
                          type="text"
                          value={restForm.state}
                          onChange={(e) => setRestForm({ ...restForm, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">Zip</label>
                        <input
                          type="text"
                          value={restForm.zip}
                          onChange={(e) => setRestForm({ ...restForm, zip: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">Price Range</label>
                        <input
                          type="text"
                          value={restForm.priceRange}
                          onChange={(e) => setRestForm({ ...restForm, priceRange: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#162E20] block mb-1">California Sales Tax Rate (e.g. 0.0825)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={restForm.taxRate}
                          onChange={(e) => setRestForm({ ...restForm, taxRate: parseFloat(e.target.value) || 0.0825 })}
                          className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white font-semibold transition-colors"
                    >
                      Save Restaurant Settings
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: OPERATING HOURS */}
              {activeTab === 'hours' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#162E20]">Business Operating Hours</h3>
                    <p className="text-xs text-[#6C786D]">
                      Set custom daily hours or mark days as closed.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    {restForm.businessHours.map((bh, idx) => (
                      <div key={bh.day} className="p-3 rounded-lg border border-[#E7E2D6] flex items-center justify-between gap-4">
                        <span className="font-semibold text-[#162E20] w-24">{bh.day}</span>
                        <input
                          type="text"
                          disabled={bh.isClosed}
                          value={bh.hours}
                          onChange={(e) => {
                            const updatedHours = [...restForm.businessHours];
                            updatedHours[idx].hours = e.target.value;
                            setRestForm({ ...restForm, businessHours: updatedHours });
                          }}
                          className="flex-1 px-3 py-1.5 rounded border border-[#DDD7C8] disabled:bg-gray-100 disabled:text-gray-400 font-mono"
                        />
                        <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={bh.isClosed}
                            onChange={(e) => {
                              const updatedHours = [...restForm.businessHours];
                              updatedHours[idx].isClosed = e.target.checked;
                              setRestForm({ ...restForm, businessHours: updatedHours });
                            }}
                          />
                          <span className="text-[#556356]">Closed</span>
                        </label>
                      </div>
                    ))}

                    <button
                      onClick={handleSaveProfile}
                      className="px-5 py-2.5 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white font-semibold transition-colors mt-4"
                    >
                      Save Operating Hours
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: MENU MANAGEMENT */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#162E20]">Menu Item Manager</h3>
                      <p className="text-xs text-[#6C786D]">
                        Add, edit descriptions, adjust prices, or toggle item availability.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingNewItem(true)}
                      className="px-3.5 py-2 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Menu Item</span>
                    </button>
                  </div>

                  {/* Add New Item Form Drawer */}
                  {isAddingNewItem && (
                    <div className="p-5 rounded-xl border border-[#1B432E] bg-[#F7FAF8] space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-[#162E20]">Create New Dish</h4>
                        <button onClick={() => setIsAddingNewItem(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveNewItem} className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Item Name *</label>
                            <input
                              type="text"
                              required
                              value={newItemForm.name}
                              onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                              className="w-full px-3 py-1.5 rounded border border-[#DDD7C8] bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Category *</label>
                            <select
                              value={newItemForm.category}
                              onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value as any })}
                              className="w-full px-3 py-1.5 rounded border border-[#DDD7C8] bg-white"
                            >
                              <option value="wraps">Falafel Wraps</option>
                              <option value="plates">Falafel Plates</option>
                              <option value="sides">Hummus & Sides</option>
                              <option value="salads">Fresh Salads</option>
                              <option value="drinks">Drinks</option>
                              <option value="specials">Specials</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Price ($) *</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={newItemForm.price}
                              onChange={(e) => setNewItemForm({ ...newItemForm, price: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-1.5 rounded border border-[#DDD7C8] bg-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Image URL / Path</label>
                            <input
                              type="text"
                              value={newItemForm.image}
                              onChange={(e) => setNewItemForm({ ...newItemForm, image: e.target.value })}
                              className="w-full px-3 py-1.5 rounded border border-[#DDD7C8] bg-white font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={newItemForm.description}
                            onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                            className="w-full px-3 py-1.5 rounded border border-[#DDD7C8] bg-white"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#1B432E] text-white font-semibold rounded-md"
                          >
                            Save Item
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingNewItem(false)}
                            className="px-3 py-2 border rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Edit Item Form Drawer */}
                  {editingItem && (
                    <div className="p-5 rounded-xl border border-amber-400 bg-amber-50/60 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-[#162E20]">Edit: {editingItem.name}</h4>
                        <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveEditItem} className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Item Name</label>
                            <input
                              type="text"
                              required
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="w-full px-3 py-1.5 rounded border bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Price ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={editingItem.price}
                              onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-1.5 rounded border bg-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className="w-full px-3 py-1.5 rounded border bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">Photo Image URL</label>
                          <input
                            type="text"
                            value={editingItem.image}
                            onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                            className="w-full px-3 py-1.5 rounded border bg-white font-mono text-[11px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#1B432E] text-white font-semibold rounded-md"
                          >
                            Update Menu Item
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="px-3 py-2 border rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Items List Table */}
                  <div className="border border-[#E7E2D6] rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left divide-y divide-[#E7E2D6]">
                      <thead className="bg-[#FAF8F2] text-[#4A554A] font-semibold">
                        <tr>
                          <th className="p-3">Item</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Availability</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E2D6]">
                        {menuItems.map(item => (
                          <tr key={item.id} className="hover:bg-[#FAF8F2]/60">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-9 h-9 rounded object-cover border border-[#DDD7C8]"
                                />
                                <div>
                                  <div className="font-semibold text-[#162E20]">{item.name}</div>
                                  <div className="text-[11px] text-[#717E72] line-clamp-1">{item.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-[#556356] capitalize">{item.category}</td>
                            <td className="p-3 font-mono tabular-nums font-semibold text-[#1B432E]">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleItemAvailability(item)}
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  item.isAvailable
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {item.isAvailable ? 'In Stock' : 'Sold Out'}
                              </button>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1.5 rounded hover:bg-[#EFECE3] text-[#1B432E]"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 4: ORDERS QUEUE */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#162E20]">Live Kitchen Order Queue</h3>
                      <p className="text-xs text-[#6C786D]">
                        Incoming customer orders stored securely in the database.
                      </p>
                    </div>
                    <button
                      onClick={() => token && loadAdminData(token)}
                      className="px-3 py-1.5 rounded border border-[#DDD7C8] text-xs font-medium flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-12 text-center border border-[#E7E2D6] rounded-xl bg-[#FAF8F2] space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-[#8F9A90]" />
                      <p className="font-semibold text-sm text-[#162E20]">No orders submitted yet</p>
                      <p className="text-xs text-[#6C786D]">
                        When customers submit pickup orders (or test orders), they appear here instantly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div
                          key={order.id}
                          className="p-5 rounded-xl border border-[#E7E2D6] bg-white shadow-xs space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-sm text-[#1B432E]">
                                {order.orderNumber}
                              </span>
                              <span className="text-xs text-[#556356]">
                                {new Date(order.createdAt).toLocaleString()}
                              </span>
                              {order.isTestOrder && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                                  Test Order
                                </span>
                              )}
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#6E7B6F]">Status:</span>
                              <select
                                value={order.status}
                                onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded border capitalize ${
                                  order.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : order.status === 'cancelled'
                                    ? 'bg-red-50 text-red-800 border-red-300'
                                    : order.status === 'ready'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready for Pickup</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Customer info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-[#6E7B6F] block">Customer</span>
                              <span className="font-semibold text-[#162E20]">{order.customerName}</span>
                            </div>
                            <div>
                              <span className="text-[#6E7B6F] block">Phone Number</span>
                              <a href={`tel:${order.customerPhone}`} className="font-medium text-[#1B432E] hover:underline">
                                {order.customerPhone}
                              </a>
                            </div>
                            <div>
                              <span className="text-[#6E7B6F] block">Scheduled Pickup</span>
                              <span className="font-medium text-[#162E20]">{order.pickupTime}</span>
                            </div>
                          </div>

                          {/* Items Ordered */}
                          <div className="bg-[#FAF8F2] p-3 rounded-lg text-xs space-y-1.5">
                            <span className="font-semibold text-[#162E20] block text-[11px] uppercase tracking-wider">
                              Order Items:
                            </span>
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[#3D4B3E]">
                                <div>
                                  <span className="font-bold text-[#162E20]">{it.quantity}x</span> {it.name}
                                  {it.selectedSauce && <span className="text-[#717E72]"> ({it.selectedSauce})</span>}
                                </div>
                                <span className="font-mono tabular-nums font-semibold">${it.itemTotal.toFixed(2)}</span>
                              </div>
                            ))}
                            {order.orderNotes && (
                              <div className="pt-1.5 text-[#8C3A00] text-[11px] border-t border-[#E7E2D6] italic">
                                Note: {order.orderNotes}
                              </div>
                            )}
                          </div>

                          {/* Financials */}
                          <div className="flex justify-between items-center text-xs pt-1">
                            <span className="text-[#6E7B6F]">
                              Subtotal: ${order.subtotal.toFixed(2)} | Tax: ${order.tax.toFixed(2)}
                            </span>
                            <span className="text-sm font-bold text-[#162E20]">
                              Total: <span className="text-[#1B432E] font-mono tabular-nums">${order.total.toFixed(2)}</span>
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 5: SALES REPORTS & ANALYTICS */}
              {activeTab === 'reports' && stats && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#162E20]">Sales & Operations Performance</h3>
                    <p className="text-xs text-[#6C786D]">
                      Key indicators calculated from real customer orders in the database.
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E2D6] space-y-1">
                      <span className="text-xs text-[#6C786D] block font-medium">Gross Revenue</span>
                      <span className="text-2xl font-bold font-mono tabular-nums text-[#1B432E]">
                        ${stats.totalRevenue.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E2D6] space-y-1">
                      <span className="text-xs text-[#6C786D] block font-medium">Total Orders Placed</span>
                      <span className="text-2xl font-bold font-mono tabular-nums text-[#162E20]">
                        {stats.totalOrders}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E7E2D6] space-y-1">
                      <span className="text-xs text-[#6C786D] block font-medium">Average Order Value</span>
                      <span className="text-2xl font-bold font-mono tabular-nums text-[#162E20]">
                        ${stats.averageOrderValue.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Popular items breakdown */}
                  <div className="p-5 rounded-xl border border-[#E7E2D6] bg-white space-y-3">
                    <h4 className="font-bold text-sm text-[#162E20]">Top Selling Menu Items</h4>
                    {stats.popularItems.length === 0 ? (
                      <p className="text-xs text-[#6C786D]">No item sales data yet.</p>
                    ) : (
                      <div className="divide-y divide-[#E7E2D6] text-xs">
                        {stats.popularItems.map((pi, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between items-center">
                            <div>
                              <span className="font-semibold text-[#162E20]">{pi.name}</span>
                              <span className="text-[#6C786D] ml-2">({pi.count} units sold)</span>
                            </div>
                            <span className="font-mono tabular-nums font-bold text-[#1B432E]">
                              ${pi.revenue.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 6: INBOX & REVIEW VERIFICATION */}
              {activeTab === 'inbox' && (
                <div className="space-y-8">
                  
                  {/* Reviews Queue */}
                  <div className="space-y-4">
                    <div className="border-b border-[#E7E2D6] pb-2">
                      <h3 className="text-base font-bold text-[#162E20]">Customer Review Verification Queue</h3>
                      <p className="text-xs text-[#6C786D]">
                        Uphold review integrity: only approved verified reviews appear on the public website.
                      </p>
                    </div>

                    {allReviews.length === 0 ? (
                      <p className="text-xs text-[#6C786D]">No reviews submitted for verification yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {allReviews.map(rev => (
                          <div key={rev.id} className="p-4 rounded-xl border border-[#E7E2D6] bg-white space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-[#162E20]">{rev.authorName} ({rev.rating} Stars)</div>
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${rev.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {rev.isVerified ? 'Publicly Verified' : 'Pending Verification'}
                              </span>
                            </div>
                            <p className="text-[#4A554A]">"{rev.comment}"</p>
                            <div className="pt-2 flex gap-2">
                              {!rev.isVerified ? (
                                <button
                                  onClick={() => handleVerifyReview(rev.id, true)}
                                  className="px-3 py-1 bg-emerald-700 text-white font-semibold rounded text-[11px]"
                                >
                                  Approve & Publish
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleVerifyReview(rev.id, false)}
                                  className="px-3 py-1 bg-gray-200 text-gray-700 font-semibold rounded text-[11px]"
                                >
                                  Hide from Website
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact Inquiries */}
                  <div className="space-y-4">
                    <div className="border-b border-[#E7E2D6] pb-2">
                      <h3 className="text-base font-bold text-[#162E20]">Customer Contact Inquiries</h3>
                      <p className="text-xs text-[#6C786D]">
                        Messages sent through the website contact form.
                      </p>
                    </div>

                    {contacts.length === 0 ? (
                      <p className="text-xs text-[#6C786D]">No messages received yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {contacts.map(c => (
                          <div key={c.id} className="p-4 rounded-xl border border-[#E7E2D6] bg-white space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#162E20]">{c.name}</span>
                              <span className="text-[#717E72]">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-[#556356]">
                              {c.phone && <span>Phone: {c.phone} </span>}
                              {c.email && <span>Email: {c.email}</span>}
                            </div>
                            <p className="text-[#3D4B3E] pt-1 leading-relaxed">{c.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
