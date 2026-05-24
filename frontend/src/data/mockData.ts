export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  joinedDate: string;
  listingsCount: number;
  campus: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  type: 'Buy' | 'Rent' | 'Exchange';
  images: string[];
  sellerId: string;
  dateAdded: string;
  views: number;
  wishlistedCount: number;
  specifications: { label: string; value: string }[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isDeal?: boolean;
  reviews: Review[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  messages: Message[];
  lastMessageTime: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'message' | 'price_drop' | 'offer' | 'system';
  date: string;
  read: boolean;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  count: number;
  color: string;
}

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    email: 'alex.rivera@university.edu',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 24,
    joinedDate: 'Sep 2024',
    listingsCount: 8,
    campus: 'North Campus Main'
  },
  {
    id: 'user_2',
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    email: 'emma.w@university.edu',
    isVerified: true,
    rating: 4.7,
    reviewsCount: 15,
    joinedDate: 'Jan 2025',
    listingsCount: 3,
    campus: 'South Campus Quad'
  },
  {
    id: 'user_3',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    email: 'd.chen@university.edu',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 38,
    joinedDate: 'Oct 2023',
    listingsCount: 12,
    campus: 'North Campus Main'
  },
  {
    id: 'user_admin',
    name: 'CampusMart Moderator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    email: 'admin@campusmart.edu',
    isVerified: true,
    rating: 5.0,
    reviewsCount: 120,
    joinedDate: 'Aug 2023',
    listingsCount: 0,
    campus: 'Administration Center'
  }
];

export const mockCategories: Category[] = [
  { id: 'electronics', name: 'Electronics', iconName: 'Laptop', count: 42, color: 'from-blue-500 to-indigo-600' },
  { id: 'books', name: 'Books & Textbooks', iconName: 'BookOpen', count: 87, color: 'from-emerald-500 to-teal-600' },
  { id: 'cycles', name: 'Cycles & Transport', iconName: 'Bike', count: 18, color: 'from-amber-500 to-orange-600' },
  { id: 'furniture', name: 'Furniture & Decor', iconName: 'Armchair', count: 29, color: 'from-purple-500 to-fuchsia-600' },
  { id: 'fashion', name: 'Fashion & Apparel', iconName: 'Shirt', count: 35, color: 'from-pink-500 to-rose-600' },
  { id: 'notes', name: 'Notes & Study Guides', iconName: 'FileText', count: 54, color: 'from-violet-500 to-purple-600' },
  { id: 'hostel', name: 'Hostel Essentials', iconName: 'Home', count: 23, color: 'from-cyan-500 to-blue-600' },
  { id: 'gaming', name: 'Gaming & Console', iconName: 'Gamepad2', count: 19, color: 'from-red-500 to-rose-600' },
  { id: 'gigs', name: 'Gigs & Gigs/Internships', iconName: 'Briefcase', count: 11, color: 'from-sky-500 to-indigo-600' }
];

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    title: 'Sony PlayStation 5 (Disc Edition) - Pristine Condition',
    description: 'Selling my PS5 Disc edition as I need to focus on my upcoming finals and don\'t play much anymore. It is in immaculate condition, cleaned regularly, and operates whisper-quiet. Comes with the original box, power cable, HDMI 2.1 cable, and two DualSense Wireless Controllers. I am also throwing in a physical copy of Elden Ring and Spider-Man 2.',
    price: 360,
    originalPrice: 499,
    category: 'gaming',
    condition: 'Like New',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_1',
    dateAdded: '2026-05-20',
    views: 142,
    wishlistedCount: 18,
    isFeatured: true,
    isTrending: true,
    specifications: [
      { label: 'Storage', value: '825GB Custom SSD' },
      { label: 'Includes', value: '2 Controllers, 2 Games, HDMI, Power Cord' },
      { label: 'Purchased', value: 'November 2024' },
      { label: 'Warranty', value: 'Expired' }
    ],
    reviews: [
      {
        id: 'rev_1',
        reviewerName: 'Ethan Hunt',
        reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
        rating: 5,
        comment: 'Great seller! Alex was prompt and the item was exactly as described.',
        date: '2026-05-10'
      }
    ]
  },
  {
    id: 'prod_2',
    title: 'CLRS Introduction to Algorithms - 4th Edition',
    description: 'Essential textbook for Computer Science CS301 / Data Structures class. Book is in great condition, no dog ears. I highlighted about 3 chapters in the middle, but otherwise clean. Retail price is $95. Get it here at a fraction of the cost!',
    price: 45,
    originalPrice: 95,
    category: 'books',
    condition: 'Good',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_2',
    dateAdded: '2026-05-21',
    views: 89,
    wishlistedCount: 22,
    isTrending: true,
    specifications: [
      { label: 'Author', value: 'Thomas H. Cormen, et al.' },
      { label: 'Publisher', value: 'MIT Press' },
      { label: 'ISBN-13', value: '978-0262046305' },
      { label: 'Binding', value: 'Hardcover' }
    ],
    reviews: []
  },
  {
    id: 'prod_3',
    title: 'Schwinn Commuter Bicycle (6-speed) with Lock',
    description: 'Selling my faithful commuter bicycle. Extremely smooth ride, perfect for getting from the South Campus Quad to North Science Labs in under 8 minutes. Includes front headlight (USB rechargeable), rear reflector, a kickstand, and a heavy-duty Kryptonite U-Lock (keys included). Tires are in excellent shape, brake pads recently replaced.',
    price: 110,
    originalPrice: 240,
    category: 'cycles',
    condition: 'Good',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_3',
    dateAdded: '2026-05-18',
    views: 231,
    wishlistedCount: 31,
    isFeatured: true,
    isDeal: true,
    specifications: [
      { label: 'Frame Size', value: 'Medium (18")' },
      { label: 'Wheel Size', value: '26 inches' },
      { label: 'Gears', value: 'Shimano 6-Speed Tourney' },
      { label: 'Weight', value: '31 lbs' }
    ],
    reviews: [
      {
        id: 'rev_2',
        reviewerName: 'Marcus Aurelius',
        reviewerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
        rating: 5,
        comment: 'David was super nice, adjusted the seat for me to test ride.',
        date: '2026-04-20'
      }
    ]
  },
  {
    id: 'prod_4',
    title: 'IKEA Linnmon Study Desk - White',
    description: 'Simple, sturdy study desk from IKEA. Fits perfectly in standard dorm rooms. Has some light coffee cup stains and minor scratches on the top right, but overall very sturdy. Legs can be unscrewed easily for transport. I can help load it into your car if needed!',
    price: 20,
    originalPrice: 49,
    category: 'furniture',
    condition: 'Fair',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_1',
    dateAdded: '2026-05-19',
    views: 74,
    wishlistedCount: 8,
    specifications: [
      { label: 'Dimensions', value: '39 3/8" x 23 5/8" x 29 1/8"' },
      { label: 'Color', value: 'White table top, Silver legs' },
      { label: 'Material', value: 'Fiberboard, Acrylic paint' }
    ],
    reviews: []
  },
  {
    id: 'prod_5',
    title: 'Galanz 3.1 Cu. Ft. Dorm Mini Fridge with Freezer',
    description: 'Perfect mini fridge for a dorm room or shared apartment. Has a separate freezer compartment which is super convenient for ice cream and frozen dinners. Adjustable thermostat control. It runs quietly. Cleaned, sanitized, defrosted, and ready to go. Used for 1 school year.',
    price: 80,
    originalPrice: 169,
    category: 'hostel',
    condition: 'Good',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1571175432244-5f29d062804c?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_3',
    dateAdded: '2026-05-22',
    views: 52,
    wishlistedCount: 15,
    isFeatured: true,
    specifications: [
      { label: 'Capacity', value: '3.1 Cubic Feet' },
      { label: 'Dimensions', value: '19.1" x 21.1" x 32.8"' },
      { label: 'Energy Star', value: 'Yes' },
      { label: 'Door Hinges', value: 'Reversible' }
    ],
    reviews: []
  },
  {
    id: 'prod_6',
    title: 'University Varsity Hoodie - Navy Blue (Size M)',
    description: 'Official university bookstore hoodie. Extremely thick and comfortable cotton. Worn only 3 times, looks and feels brand new. No fading, no lint. Selling because I bought a size too small. Paid $65 original plus tax. Get it cheap!',
    price: 30,
    originalPrice: 65,
    category: 'fashion',
    condition: 'Like New',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_2',
    dateAdded: '2026-05-22',
    views: 45,
    wishlistedCount: 9,
    isDeal: true,
    specifications: [
      { label: 'Brand', value: 'Champion (Bookstore Ed.)' },
      { label: 'Size', value: 'Medium (Unisex)' },
      { label: 'Color', value: 'Navy Blue / Golden Logo' },
      { label: 'Material', value: '80% Cotton, 20% Polyester' }
    ],
    reviews: []
  },
  {
    id: 'prod_7',
    title: 'Organic Chemistry II A+ Study Notes & Midterm Prep',
    description: 'Complete handwritten, highly structured, colored study guides and reaction mechanism maps for Organic Chemistry II (CHEM-220). Compiled by an A+ pre-med student. Includes synthesis workflows, stereochemistry cheat sheets, and solved practice exams with explanations. Will email you a high-res PDF copy immediately upon payment, or give you the physical binder.',
    price: 12,
    category: 'notes',
    condition: 'Like New',
    type: 'Exchange',
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_1',
    dateAdded: '2026-05-21',
    views: 110,
    wishlistedCount: 42,
    isFeatured: true,
    isTrending: true,
    specifications: [
      { label: 'Course Code', value: 'CHEM-220 (Prof. Smith)' },
      { label: 'Format', value: 'Digital (PDF) + Binder' },
      { label: 'Pages', value: '64 pages of core content' },
      { label: 'Last Updated', value: 'Spring Semester 2026' }
    ],
    reviews: []
  },
  {
    id: 'prod_8',
    title: 'Need React/Next.js help for Dorm startup',
    description: 'Looking for a fellow developer to help optimize a Next.js landing page and set up Firebase auth for a new student-delivery startup. Should take about 4-5 hours. Will pay cash, or buy you lunch/coffee. Let\'s collaborate! Meet up at campus library or student center.',
    price: 25,
    category: 'gigs',
    condition: 'New',
    type: 'Rent',
    images: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_3',
    dateAdded: '2026-05-22',
    views: 31,
    wishlistedCount: 4,
    specifications: [
      { label: 'Gig Type', value: 'Software Development' },
      { label: 'Duration', value: 'approx. 4 Hours' },
      { label: 'Payment', value: '$25/hour or Trade' },
      { label: 'Location', value: 'Campus Library / Remote' }
    ],
    reviews: []
  },
  {
    id: 'prod_9',
    title: 'Dell 27-inch 4K Monitor (S2721QS) - IPS Panel',
    description: 'Incredible monitor for research writing, coding, and Netflix. IPS panel with 99% sRGB color gamut, AMD FreeSync, and dual built-in 3W speakers. Heights adjustable stand that also pivots 90 degrees. No dead pixels, looks perfect. Upgraded to a larger ultrawide.',
    price: 190,
    originalPrice: 299,
    category: 'electronics',
    condition: 'Like New',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_1',
    dateAdded: '2026-05-15',
    views: 180,
    wishlistedCount: 14,
    isTrending: true,
    specifications: [
      { label: 'Screen Size', value: '27 Inches' },
      { label: 'Resolution', value: '3840 x 2160 (4K UHD)' },
      { label: 'Refresh Rate', value: '60 Hz' },
      { label: 'Ports', value: '2x HDMI 2.0, 1x DisplayPort 1.2' }
    ],
    reviews: []
  },
  {
    id: 'prod_10',
    title: 'Apple AirPods Pro (2nd Generation) - MagSafe',
    description: 'Active Noise Cancellation and Transparency mode. Bought these last semester. Used them mostly for studying in the library. They have been thoroughly cleaned with isopropyl alcohol, and come with three sizes of fresh, unused silicone ear tips. Original USB-C charging cable and MagSafe Case included.',
    price: 130,
    originalPrice: 249,
    category: 'electronics',
    condition: 'Like New',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_2',
    dateAdded: '2026-05-22',
    views: 70,
    wishlistedCount: 20,
    isTrending: true,
    isDeal: true,
    specifications: [
      { label: 'Model', value: 'AirPods Pro 2 (USB-C)' },
      { label: 'Battery Life', value: 'Up to 6 hours active' },
      { label: 'Chip', value: 'Apple H2' },
      { label: 'Sweat/Water Proof', value: 'IP54' }
    ],
    reviews: []
  },
  {
    id: 'prod_11',
    title: 'Cozy Accent Chair - Mustard Yellow',
    description: 'Super comfortable reading chair that adds a pop of color to any dull college dorm room. Wooden legs are solid, fabric is clean with no stains or tears. Very lightweight and easy to carry. Selling because I\'m moving back home for the summer and can\'t fit it in the car.',
    price: 55,
    originalPrice: 120,
    category: 'furniture',
    condition: 'Good',
    type: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_3',
    dateAdded: '2026-05-17',
    views: 104,
    wishlistedCount: 12,
    specifications: [
      { label: 'Color', value: 'Mustard Yellow' },
      { label: 'Material', value: 'Velvet-feel Polyester, Wood' },
      { label: 'Weight Limit', value: '250 lbs' }
    ],
    reviews: []
  },
  {
    id: 'prod_12',
    title: 'Rent: TI-84 Plus CE Graphing Calculator',
    description: 'Renting out my TI-84 Plus CE graphing calculator for the upcoming Calculus/Physics final exam week. Has a color screen, slim design, and rechargeable battery. Comes with a charging cable. Rental is $5/day or $15 for the whole week. Security deposit required but fully refundable upon return.',
    price: 15,
    category: 'electronics',
    condition: 'Like New',
    type: 'Rent',
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 'user_1',
    dateAdded: '2026-05-21',
    views: 45,
    wishlistedCount: 6,
    isDeal: true,
    specifications: [
      { label: 'Model', value: 'TI-84 Plus CE' },
      { label: 'Battery', value: 'Rechargeable Lithium-Ion' },
      { label: 'Screen', value: 'Color Backlit' },
      { label: 'Approved For', value: 'SAT, ACT, AP, IB exams' }
    ],
    reviews: []
  }
];

export const mockChats: Chat[] = [
  {
    id: 'chat_1',
    productId: 'prod_1',
    buyerId: 'user_2',
    sellerId: 'user_1',
    lastMessageTime: '2026-05-22T14:30:00Z',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'user_2', text: 'Hi Alex! Is the PS5 still available?', timestamp: '2026-05-22T14:15:00Z' },
      { id: 'm2', senderId: 'user_1', text: 'Hey Emma, yes it is! Quite a few people have messaged, but no one has locked it in yet.', timestamp: '2026-05-22T14:20:00Z' },
      { id: 'm3', senderId: 'user_2', text: 'Awesome! Would you take $340 for it? I can meet you at the library today.', timestamp: '2026-05-22T14:28:00Z' },
      { id: 'm4', senderId: 'user_1', text: 'How about $350? I can meet you in the Student Center at 5 PM. It is cleaner and has security.', timestamp: '2026-05-22T14:30:00Z' }
    ]
  },
  {
    id: 'chat_2',
    productId: 'prod_2',
    buyerId: 'user_1',
    sellerId: 'user_2',
    lastMessageTime: '2026-05-21T18:45:00Z',
    unreadCount: 0,
    messages: [
      { id: 'm5', senderId: 'user_1', text: 'Hi Emma, I\'m interested in the CLRS textbook. Can we meet tomorrow?', timestamp: '2026-05-21T18:30:00Z' },
      { id: 'm6', senderId: 'user_2', text: 'Sure! I\'m free after 2 PM near South Campus. Does that work?', timestamp: '2026-05-21T18:40:00Z' },
      { id: 'm7', senderId: 'user_1', text: 'Yes, let\'s meet at the Starbucks near South Campus at 2:30. See you there!', timestamp: '2026-05-21T18:45:00Z' }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'not_1',
    title: 'New Offer Received',
    description: 'Emma Watson offered $340 for your PlayStation 5.',
    type: 'offer',
    date: '2 hours ago',
    read: false,
    link: '/chat?id=chat_1'
  },
  {
    id: 'not_2',
    title: 'Price Drop Alert',
    description: 'An item in your wishlist "Schwinn Commuter Bicycle" dropped from $120 to $110.',
    type: 'price_drop',
    date: '1 day ago',
    read: true,
    link: '/marketplace/prod_3'
  },
  {
    id: 'not_3',
    title: 'Verified Student Badge Active',
    description: 'Your campus email alex.rivera@university.edu has been successfully verified.',
    type: 'system',
    date: '3 days ago',
    read: true,
    link: '/dashboard'
  }
];
