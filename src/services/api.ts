import {
  RestaurantInfo,
  MenuItem,
  Order,
  VerifiedReview,
  ContactMessage,
  SalesReport,
  OrderStatus
} from '../types/restaurant.ts';

const API_BASE = '/api';

export const api = {
  // Public
  async getRestaurant(): Promise<RestaurantInfo> {
    const res = await fetch(`${API_BASE}/restaurant`);
    if (!res.ok) throw new Error('Failed to load restaurant information');
    return res.json();
  },

  async getMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) throw new Error('Failed to load menu');
    return res.json();
  },

  async getReviews(): Promise<VerifiedReview[]> {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to load verified reviews');
    return res.json();
  },

  async submitContact(data: { name: string; phone?: string; email?: string; message: string; botField?: string }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to send message');
    return result;
  },

  async submitReview(data: { authorName: string; rating: number; comment: string; visitDate?: string }) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit review');
    return result;
  },

  async submitOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    pickupTime: string;
    orderNotes?: string;
    items: any[];
    isTestOrder?: boolean;
  }): Promise<{ success: boolean; order: Order; message: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await res.json();
    if (!res.ok) {
      const err: any = new Error(result.error || 'Failed to place order');
      err.isTemporarilyClosed = result.isTemporarilyClosed;
      throw err;
    }
    return result;
  },

  // Admin Auth
  async adminLogin(password: string): Promise<{ token: string; role: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    return result;
  },

  async checkAdminAuth(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return Boolean(data.authenticated);
    } catch {
      return false;
    }
  },

  async adminLogout(token: string) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Admin Actions
  async updateRestaurant(token: string, updates: Partial<RestaurantInfo>): Promise<RestaurantInfo> {
    const res = await fetch(`${API_BASE}/restaurant`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update restaurant settings');
    return result.restaurant;
  },

  async addMenuItem(token: string, item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create menu item');
    return result;
  },

  async updateMenuItem(token: string, id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update menu item');
    return result;
  },

  async deleteMenuItem(token: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || 'Failed to delete item');
    }
  },

  async getOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async updateOrderStatus(token: string, orderId: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update order status');
    return result.order;
  },

  async getStats(token: string): Promise<SalesReport> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch sales statistics');
    return res.json();
  },

  async getContacts(token: string): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async markContactRead(token: string, id: string): Promise<void> {
    await fetch(`${API_BASE}/contact/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async getAllReviews(token: string): Promise<VerifiedReview[]> {
    const res = await fetch(`${API_BASE}/reviews/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch all reviews');
    return res.json();
  },

  async setReviewVerification(token: string, id: string, isVerified: boolean): Promise<VerifiedReview> {
    const res = await fetch(`${API_BASE}/reviews/${id}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isVerified })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update review');
    return result.review;
  }
};
