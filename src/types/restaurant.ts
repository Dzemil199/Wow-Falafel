export interface BusinessHoursItem {
  day: string;
  hours: string;
  isClosed: boolean;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  priceRange: string;
  isTemporarilyClosed: boolean;
  closureNotice: string;
  orderingEnabled: boolean;
  testModeOrdering: boolean;
  taxRate: number;
  pickupEstimateMinutes: number;
  businessHours: BusinessHoursItem[];
  paymentNotice: string;
}

export interface MenuItemExtra {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'wraps' | 'plates' | 'sides' | 'salads' | 'drinks' | 'specials';
  description: string;
  price: number;
  image: string;
  dietary: string[];
  isAvailable: boolean;
  isFeatured?: boolean;
  sauceOptions?: string[];
  extras?: MenuItemExtra[];
}

export interface CartItemOption {
  selectedSauce?: string;
  selectedExtras?: MenuItemExtra[];
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  options: CartItemOption;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderItemRecord {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSauce?: string;
  selectedExtras?: { name: string; price: number }[];
  itemTotal: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'pickup';
  pickupTime: string;
  orderNotes?: string;
  items: OrderItemRecord[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  isTestOrder: boolean;
  paymentStatus: 'unpaid' | 'test_paid' | 'paid';
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  read: boolean;
}

export interface VerifiedReview {
  id: string;
  authorName: string;
  visitDate: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

export interface SalesReport {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderStatus, number>;
  popularItems: { name: string; count: number; revenue: number }[];
}
