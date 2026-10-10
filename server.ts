import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialRestaurantInfo, initialMenuItems, initialReviews } from './src/data/initialData.ts';
import {
  RestaurantInfo,
  MenuItem,
  Order,
  VerifiedReview,
  ContactMessage,
  SalesReport,
  OrderStatus
} from './src/types/restaurant.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StoreData {
  restaurant: RestaurantInfo;
  menu: MenuItem[];
  orders: Order[];
  reviews: VerifiedReview[];
  contacts: ContactMessage[];
  adminPassword: string;
}

const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Initialize database storage
function initStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(STORE_PATH)) {
    try {
      const content = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error parsing store.json, re-initializing:', err);
    }
  }

  const defaultStore: StoreData = {
    restaurant: initialRestaurantInfo,
    menu: initialMenuItems,
    orders: [],
    reviews: initialReviews,
    contacts: [],
    adminPassword: 'wowfalafel2026'
  };

  fs.writeFileSync(STORE_PATH, JSON.stringify(defaultStore, null, 2), 'utf-8');
  return defaultStore;
}

let store: StoreData = initStore();

function persistStore() {
  try {
    const tempPath = `${STORE_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(tempPath, STORE_PATH);
  } catch (err) {
    console.error('Failed to write to store.json:', err);
  }
}

// Simple session token for admin authentication
const activeAdminTokens = new Set<string>();

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // ----------------------------------------------------
  // API Routes
  // ----------------------------------------------------

  // Admin Auth
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (password === store.adminPassword) {
      const token = `wf-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      activeAdminTokens.add(token);
      return res.json({ success: true, token, role: 'owner' });
    }
    return res.status(401).json({ error: 'Invalid admin password' });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ authenticated: false });
    }
    const token = authHeader.split(' ')[1];
    if (activeAdminTokens.has(token)) {
      return res.json({ authenticated: true, role: 'owner' });
    }
    return res.status(401).json({ authenticated: false });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      activeAdminTokens.delete(token);
    }
    return res.json({ success: true });
  });

  // Restaurant Settings & Status
  app.get('/api/restaurant', (_req: Request, res: Response) => {
    res.json(store.restaurant);
  });

  app.put('/api/restaurant', adminAuthMiddleware, (req: Request, res: Response) => {
    const updates = req.body;
    store.restaurant = {
      ...store.restaurant,
      ...updates
    };
    persistStore();
    res.json({ success: true, restaurant: store.restaurant });
  });

  // Menu Endpoints
  app.get('/api/menu', (_req: Request, res: Response) => {
    res.json(store.menu);
  });

  app.post('/api/menu', adminAuthMiddleware, (req: Request, res: Response) => {
    const { name, category, description, price, image, dietary, isAvailable, extras, sauceOptions } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const newItem: MenuItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: String(name).trim(),
      category,
      description: String(description || '').trim(),
      price: Number(price),
      image: image || '/src/assets/images/falafel_combo_plate_1791657590617.jpg',
      dietary: Array.isArray(dietary) ? dietary : [],
      isAvailable: isAvailable !== false,
      extras: Array.isArray(extras) ? extras : [],
      sauceOptions: Array.isArray(sauceOptions) ? sauceOptions : ['Tahini Sauce', 'Garlic Sauce']
    };

    store.menu.push(newItem);
    persistStore();
    res.status(201).json(newItem);
  });

  app.put('/api/menu/:id', adminAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const index = store.menu.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    store.menu[index] = {
      ...store.menu[index],
      ...req.body,
      id // preserve original id
    };
    persistStore();
    res.json(store.menu[index]);
  });

  app.delete('/api/menu/:id', adminAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = store.menu.length;
    store.menu = store.menu.filter(m => m.id !== id);
    if (store.menu.length === initialLen) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    persistStore();
    res.json({ success: true, message: 'Item deleted' });
  });

  // Orders Endpoints
  app.get('/api/orders', adminAuthMiddleware, (_req: Request, res: Response) => {
    // Return newest orders first
    const sorted = [...store.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(sorted);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupTime,
      orderNotes,
      items,
      isTestOrder
    } = req.body;

    // Check restaurant status
    const isClosed = store.restaurant.isTemporarilyClosed;
    const orderingActive = store.restaurant.orderingEnabled;

    if (isClosed && !orderingActive && !isTestOrder) {
      return res.status(403).json({
        error: 'Online ordering is currently unavailable while Wow Falafel is temporarily closed.',
        isTemporarilyClosed: true
      });
    }

    if (!customerName || !String(customerName).trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    if (!customerPhone || !String(customerPhone).trim()) {
      return res.status(400).json({ error: 'Customer phone number is required' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Calculate real subtotal and tax
    let subtotal = 0;
    const orderItemsRecord = items.map((item: any) => {
      let itemPrice = Number(item.price) || 0;
      let extrasCost = 0;
      if (Array.isArray(item.selectedExtras)) {
        extrasCost = item.selectedExtras.reduce((sum: number, ex: any) => sum + (Number(ex.price) || 0), 0);
      }
      const unitCost = itemPrice + extrasCost;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const itemTotal = unitCost * quantity;
      subtotal += itemTotal;

      return {
        menuItemId: item.menuItemId || item.id,
        name: item.name,
        price: unitCost,
        quantity,
        selectedSauce: item.selectedSauce,
        selectedExtras: item.selectedExtras,
        itemTotal: Math.round(itemTotal * 100) / 100
      };
    });

    const taxRate = store.restaurant.taxRate || 0.0825;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const orderNumber = `WF-${1000 + store.orders.length + 1}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: customerEmail ? String(customerEmail).trim() : undefined,
      orderType: 'pickup',
      pickupTime: pickupTime || 'In 25-30 minutes',
      orderNotes: orderNotes ? String(orderNotes).trim() : undefined,
      items: orderItemsRecord,
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      total,
      status: 'pending',
      isTestOrder: Boolean(isTestOrder),
      paymentStatus: isTestOrder ? 'test_paid' : 'unpaid'
    };

    store.orders.push(newOrder);
    persistStore();

    res.status(201).json({
      success: true,
      order: newOrder,
      message: isTestOrder
        ? 'Test order registered in the restaurant system. No payment was charged.'
        : 'Order placed successfully. Pay at pickup.'
    });
  });

  app.patch('/api/orders/:id/status', adminAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = store.orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    persistStore();
    res.json({ success: true, order });
  });

  // Sales Stats
  app.get('/api/stats', adminAuthMiddleware, (_req: Request, res: Response) => {
    const orders = store.orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusBreakdown: Record<OrderStatus, number> = {
      pending: 0,
      accepted: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0
    };

    store.orders.forEach(o => {
      if (statusBreakdown[o.status] !== undefined) {
        statusBreakdown[o.status]++;
      }
    });

    const itemCounts: Record<string, { count: number; revenue: number }> = {};
    orders.forEach(o => {
      o.items.forEach(it => {
        if (!itemCounts[it.name]) {
          itemCounts[it.name] = { count: 0, revenue: 0 };
        }
        itemCounts[it.name].count += it.quantity;
        itemCounts[it.name].revenue += it.itemTotal;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: Math.round(data.revenue * 100) / 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const report: SalesReport = {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      statusBreakdown,
      popularItems
    };

    res.json(report);
  });

  // Contact Form with Honeypot spam defense
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, phone, email, message, botField } = req.body;

    // Honeypot check: if bot filled this hidden field, quietly accept without storing spam
    if (botField) {
      return res.json({ success: true, message: 'Message received' });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : '',
      email: email ? String(email).trim() : undefined,
      message: String(message).trim(),
      read: false
    };

    store.contacts.push(newMessage);
    persistStore();

    res.status(201).json({ success: true, message: 'Your message has been delivered to the Wow Falafel team.' });
  });

  app.get('/api/contact', adminAuthMiddleware, (_req: Request, res: Response) => {
    const sorted = [...store.contacts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(sorted);
  });

  app.patch('/api/contact/:id/read', adminAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const msg = store.contacts.find(m => m.id === id);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }
    msg.read = true;
    persistStore();
    res.json({ success: true, message: msg });
  });

  // Verified Reviews
  app.get('/api/reviews', (_req: Request, res: Response) => {
    const verified = store.reviews.filter(r => r.isVerified);
    res.json(verified);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { authorName, rating, comment, visitDate } = req.body;
    if (!authorName || !comment || !rating) {
      return res.status(400).json({ error: 'Name, rating, and feedback are required' });
    }

    const review: VerifiedReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: String(authorName).trim(),
      visitDate: visitDate || 'Recent Visit',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: String(comment).trim(),
      isVerified: false, // Must be verified by owner in admin panel!
      createdAt: new Date().toISOString()
    };

    store.reviews.push(review);
    persistStore();

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Once verified by our management, your review will be published.'
    });
  });

  app.get('/api/reviews/all', adminAuthMiddleware, (_req: Request, res: Response) => {
    res.json(store.reviews);
  });

  app.patch('/api/reviews/:id/verify', adminAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    const review = store.reviews.find(r => r.id === id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    review.isVerified = Boolean(isVerified);
    persistStore();
    res.json({ success: true, review });
  });

  // ----------------------------------------------------
  // Frontend Serving (Vite in dev, static dist in prod)
  // ----------------------------------------------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wow Falafel server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
