export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: string; // 'new', 'paid', 'delivered'
  total: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}