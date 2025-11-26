import { ArchiveBoxIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';

export const features = [
  {
    icon: TruckIcon,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $50',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payment',
    description: '100% secure payment processing',
  },
  {
    icon: ArchiveBoxIcon,
    title: 'Fast Delivery',
    description: '2-day delivery on most items',
  },
];

export const categories = [
  {
    name: 'Electronics',
    image: '/categories/electronics.jpg',
    count: '1,234',
  },
  { name: 'Clothing', image: '/categories/clothing.jpg', count: '856' },
  { name: 'Books', image: '/categories/books.jpg', count: '2,341' },
  { name: 'Home & Garden', image: '/categories/home.jpg', count: '567' },
];

export const testimonials = [
  {
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    rating: 5,
    comment: 'Amazing products and fast shipping. Highly recommend!',
  },
  {
    name: 'Mike Chen',
    avatar: '/avatars/mike.jpg',
    rating: 5,
    comment: 'Great customer service and quality products.',
  },
  {
    name: 'Emily Davis',
    avatar: '/avatars/emily.jpg',
    rating: 5,
    comment: 'Love the variety and competitive prices.',
  },
];
