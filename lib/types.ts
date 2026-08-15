// Product Types
export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Types
export type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerDetails {
  fullName: string;
  mobileNumber: string;
  email: string;
  deliveryAddress: string;
  landmark?: string;
  pincode: string;
}

export interface Order {
  id: string;
  customerDetails: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
