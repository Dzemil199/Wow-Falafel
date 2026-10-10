import { RestaurantInfo, MenuItem, VerifiedReview } from '../types/restaurant.ts';

export const initialRestaurantInfo: RestaurantInfo = {
  name: "Wow Falafel",
  tagline: "Fresh Mediterranean Flavor. Every Bite.",
  description: "Discover delicious falafel, fresh ingredients, and Mediterranean-inspired favorites in California City.",
  address: "8056 California City Blvd",
  suite: "Suite A",
  city: "California City",
  state: "CA",
  zip: "93505",
  country: "USA",
  phone: "+1 442-247-7111",
  priceRange: "$10–$20 per person",
  isTemporarilyClosed: true,
  closureNotice: "Wow Falafel is currently temporarily closed. Online ordering and payments are paused until our official reopening. You can browse our menu, preview checkout in test mode, or reach out with any inquiries.",
  orderingEnabled: false,
  testModeOrdering: true,
  taxRate: 0.0825,
  pickupEstimateMinutes: 25,
  paymentNotice: "Payment processing integration ready with Stripe test mode. Live credit card processing will activate once owner connects their merchant account and business reopens.",
  businessHours: [
    { day: "Monday", hours: "11:00 AM – 8:00 PM", isClosed: false },
    { day: "Tuesday", hours: "11:00 AM – 8:00 PM", isClosed: false },
    { day: "Wednesday", hours: "11:00 AM – 8:00 PM", isClosed: false },
    { day: "Thursday", hours: "11:00 AM – 8:00 PM", isClosed: false },
    { day: "Friday", hours: "11:00 AM – 9:00 PM", isClosed: false },
    { day: "Saturday", hours: "11:00 AM – 9:00 PM", isClosed: false },
    { day: "Sunday", hours: "12:00 PM – 7:00 PM", isClosed: false },
  ]
};

export const initialMenuItems: MenuItem[] = [
  // Falafel Wraps
  {
    id: "item-wrap-classic",
    name: "Classic Falafel Pita Wrap",
    category: "wraps",
    description: "Crispy freshly fried herb falafel wrapped in warm Lebanese pita, layered with fresh tomatoes, diced cucumbers, pickled pink turnips, fresh parsley, and creamy sesame tahini.",
    price: 10.99,
    image: "/src/assets/images/falafel_wrap_fresh_1791657580279.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: true,
    sauceOptions: ["Tahini Sauce", "Garlic Sauce", "Spicy Shatta Chili", "None"],
    extras: [
      { id: "extra-falafel-2", name: "Add 2 Extra Falafels", price: 2.00 },
      { id: "extra-hummus-spread", name: "Add Hummus Spread", price: 1.50 },
      { id: "extra-pickles", name: "Extra Pickled Turnips", price: 0.75 }
    ]
  },
  {
    id: "item-wrap-spicy",
    name: "Spicy California Falafel Wrap",
    category: "wraps",
    description: "Our signature falafel with house-made fiery red shatta chili, pickled jalapeños, cooling Persian cucumber, crisp romaine, and garlic tahini in warm flatbread.",
    price: 11.99,
    image: "/src/assets/images/falafel_wrap_fresh_1791657580279.jpg",
    dietary: ["Vegetarian", "Vegan", "Spicy"],
    isAvailable: true,
    isFeatured: false,
    sauceOptions: ["Extra Spicy Shatta", "Tahini Sauce", "Garlic Sauce", "Mild"],
    extras: [
      { id: "extra-falafel-2", name: "Add 2 Extra Falafels", price: 2.00 },
      { id: "extra-jalapeno", name: "Extra Jalapeños", price: 0.75 }
    ]
  },
  {
    id: "item-wrap-deluxe",
    name: "Hummus & Falafel Deluxe Wrap",
    category: "wraps",
    description: "Thick spread of velvety chickpea hummus inside toasted pita, packed with crunchy falafels, fresh mint leaves, chopped salad, and lemon sumac dressing.",
    price: 12.49,
    image: "/src/assets/images/falafel_wrap_fresh_1791657580279.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: false,
    sauceOptions: ["Tahini Sauce", "Garlic Sauce", "Olive Oil & Lemon"],
    extras: [
      { id: "extra-falafel-2", name: "Add 2 Extra Falafels", price: 2.00 },
      { id: "extra-olives", name: "Kalamata Olives", price: 1.25 }
    ]
  },

  // Falafel Plates
  {
    id: "item-plate-feast",
    name: "Signature Falafel Feast Plate",
    category: "plates",
    description: "Five golden crunchy falafels served with velvety hummus swirled with olive oil, fresh herb tabbouleh, pickled turnip wedges, warm pita bread, and sesame tahini dip.",
    price: 15.99,
    image: "/src/assets/images/falafel_combo_plate_1791657590617.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: true,
    sauceOptions: ["Tahini & Garlic", "Tahini & Spicy Shatta", "Tahini Only"],
    extras: [
      { id: "extra-pita", name: "Extra Warm Pita Bread", price: 1.50 },
      { id: "extra-falafel-3", name: "Add 3 Extra Falafels", price: 3.00 },
      { id: "extra-hummus-cup", name: "Extra Hummus Side (4 oz)", price: 2.50 }
    ]
  },
  {
    id: "item-plate-combo",
    name: "Wow Mediterranean Combo Platter",
    category: "plates",
    description: "Six falafels, generous scoop of creamy hummus topped with toasted pine nuts, smoked baba ganoush, garden fattoush salad, and two fresh pita breads.",
    price: 17.99,
    image: "/src/assets/images/falafel_combo_plate_1791657590617.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: true,
    sauceOptions: ["All Three Sauces", "Tahini Only", "Spicy Only"],
    extras: [
      { id: "extra-pita-2", name: "2 Extra Pitas", price: 2.75 },
      { id: "extra-dolmas", name: "3 Stuffed Grape Leaves", price: 3.50 }
    ]
  },
  {
    id: "item-plate-bowl",
    name: "California City Falafel Bowl",
    category: "plates",
    description: "Crispy falafel balls atop organic Mediterranean quinoa, diced cucumbers, heirloom tomatoes, kalamata olives, wild arugula, and lemon-herb tahini drizzle.",
    price: 14.50,
    image: "/src/assets/images/falafel_combo_plate_1791657590617.jpg",
    dietary: ["Vegetarian", "Gluten-Free"],
    isAvailable: true,
    isFeatured: false,
    sauceOptions: ["Lemon Herb Tahini", "Garlic Dressing", "Hot Shatta"],
    extras: [
      { id: "extra-falafel-2", name: "Add 2 Extra Falafels", price: 2.00 },
      { id: "extra-avocado", name: "Fresh Sliced Avocado", price: 2.50 }
    ]
  },

  // Hummus and Sides
  {
    id: "item-side-hummus",
    name: "Traditional Handcrafted Hummus & Pita",
    category: "sides",
    description: "Ultra-velvety hummus made from slow-simmered chickpeas and pure sesame tahini, swirled with California extra virgin olive oil, whole chickpeas, and paprika. Served with warm pita.",
    price: 7.99,
    image: "/src/assets/images/hummus_sides_dips_1791657600339.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: true,
    sauceOptions: ["Extra Virgin Olive Oil", "Spicy Shatta Drizzle", "Plain"],
    extras: [
      { id: "extra-pita", name: "Extra Warm Pita Bread", price: 1.50 },
      { id: "extra-pine-nuts", name: "Toasted Pine Nuts", price: 1.75 }
    ]
  },
  {
    id: "item-side-falafel-4",
    name: "Crispy Falafel Balls (4 Pieces)",
    category: "sides",
    description: "Four freshly prepared crunchy falafel pieces seasoned with coriander, cumin, fresh parsley, and garlic. Served with a side of house tahini.",
    price: 5.49,
    image: "/src/assets/images/hero_falafel_feast_1791657566017.jpg",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    isAvailable: true,
    isFeatured: false,
    sauceOptions: ["Tahini Sauce", "Spicy Shatta Sauce", "Garlic Whip"]
  },
  {
    id: "item-side-dolmas",
    name: "Stuffed Grape Leaves (Dolmas - 5 Pcs)",
    category: "sides",
    description: "Tender vine grape leaves filled with fragrant seasoned rice, Mediterranean herbs, and extra virgin olive oil. Served chilled with fresh lemon wedges.",
    price: 6.99,
    image: "/src/assets/images/hummus_sides_dips_1791657600339.jpg",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    isAvailable: true,
    isFeatured: false
  },
  {
    id: "item-side-fries",
    name: "Za'atar & Sumac Spiced Fries",
    category: "sides",
    description: "Crisp potato fries tossed with fragrant wild za'atar herbs, tangy sumac, and sea salt. Served with garlic dip.",
    price: 4.99,
    image: "/src/assets/images/falafel_wrap_fresh_1791657580279.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: false,
    sauceOptions: ["Garlic Dip", "Tahini Dip", "Spicy Ketchup"]
  },

  // Fresh Salads
  {
    id: "item-salad-chopped",
    name: "Fresh Mediterranean Chopped Salad",
    category: "salads",
    description: "Crisp diced Persian cucumbers, vine tomatoes, red onion, and fresh mint tossed in freshly squeezed lemon juice and extra virgin olive oil.",
    price: 8.99,
    image: "/src/assets/images/falafel_combo_plate_1791657590617.jpg",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    isAvailable: true,
    isFeatured: false,
    extras: [
      { id: "extra-falafel-3", name: "Top with 3 Falafels", price: 3.00 },
      { id: "extra-olives", name: "Kalamata Olives", price: 1.25 }
    ]
  },
  {
    id: "item-salad-tabbouleh",
    name: "Traditional Tabbouleh Salad",
    category: "salads",
    description: "Generous mound of hand-chopped fresh curly parsley, bulgur wheat, diced tomatoes, sweet onion, fresh mint, seasoned with cold-pressed olive oil and lemon juice.",
    price: 8.49,
    image: "/src/assets/images/falafel_combo_plate_1791657590617.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: false
  },

  // Drinks
  {
    id: "item-drink-lemonade",
    name: "Fresh Mint Lemonade",
    category: "drinks",
    description: "Freshly squeezed lemon juice muddled with garden mint and raw cane sugar over crushed ice. Incredibly refreshing.",
    price: 4.25,
    image: "/src/assets/images/hero_falafel_feast_1791657566017.jpg",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    isAvailable: true,
    isFeatured: false
  },
  {
    id: "item-drink-tea",
    name: "Cardamom Spiced Iced Tea",
    category: "drinks",
    description: "Slow-brewed black tea infused with cracked cardamom pods and fresh orange zest.",
    price: 3.50,
    image: "/src/assets/images/hero_falafel_feast_1791657566017.jpg",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    isAvailable: true,
    isFeatured: false
  },
  {
    id: "item-drink-sparkling",
    name: "Sparkling Mineral Water",
    category: "drinks",
    description: "Chilled effervescent sparkling water served with a fresh lemon wedge.",
    price: 3.00,
    image: "/src/assets/images/hero_falafel_feast_1791657566017.jpg",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    isAvailable: true,
    isFeatured: false
  },

  // Specials
  {
    id: "item-special-family",
    name: "Family Falafel Feast (Feeds 4–5)",
    category: "specials",
    description: "16 golden falafel balls, large hummus bowl, large Mediterranean salad, 6 warm pita breads, pickled turnips, tahini, and spicy shatta. Perfect for sharing.",
    price: 39.99,
    image: "/src/assets/images/hero_falafel_feast_1791657566017.jpg",
    dietary: ["Vegetarian", "Vegan"],
    isAvailable: true,
    isFeatured: true,
    sauceOptions: ["Full Sauce Set Included"],
    extras: [
      { id: "extra-fries-family", name: "Add Large Fries", price: 4.50 },
      { id: "extra-pita-4", name: "4 Extra Pitas", price: 4.00 }
    ]
  }
];

export const initialReviews: VerifiedReview[] = [
  // User Prompt: "Customer reviews, using only genuine verified reviews. Do not invent testimonials."
  // "Do not use fake reviews, fake business hours, fake payment confirmations, or fake order confirmations."
  // Hence we start with empty verified testimonials and provide a real submission form so verified diners can leave reviews,
  // which the owner can approve in the Admin Dashboard!
];
