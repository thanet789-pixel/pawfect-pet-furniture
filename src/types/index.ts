// TypeScript Type Declarations for Pawfect Pet Furniture

export interface Category {
  id: string;
  name: string;
  nameTh: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  nameTh: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  featured: boolean;
  images?: string[];
  materials?: string;
  dimensions?: string;
  weightLimit?: string;
  features?: string[];
  careInstructions?: string;
  warrantyInfo?: string;
  packageIncludes?: string;
}

export interface CartItem {
  id: string;
  nameTh: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
  date: string;
  slipImage?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}
