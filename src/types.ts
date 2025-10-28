

export interface Product {
  id: string;
  name: string;
  category: 'sneakers' | 'glow' | 'lamps';
  price: number;
  description: string;
  imageUrl: string;
  popularity: number;
  gallery: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    discountPercentage: number;
    endDate: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export interface ShippingDetails {
  name: string;
  phone: string;
  address: string;
}