import { getDb } from "./firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { CustomerDetails, OrderItem } from "./types";

// Generate a unique order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${randomStr}`;
};

// Create a new order in Firestore
export const createOrder = async (
  customerDetails: CustomerDetails,
  items: OrderItem[],
  total: number
): Promise<string> => {
  try {
    const db = getDb();
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    const orderId = generateOrderId();
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = 0; // Tax calculation can be added later

    const orderData = {
      id: orderId,
      customerDetails: {
        fullName: customerDetails.fullName,
        mobileNumber: customerDetails.mobileNumber,
        email: customerDetails.email,
        deliveryAddress: customerDetails.deliveryAddress,
        landmark: customerDetails.landmark || "",
        pincode: customerDetails.pincode,
      },
      items: items,
      subtotal: subtotal,
      tax: tax,
      total: total,
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(db, "orders"), orderData);
    console.log("Order created with ID:", orderId);
    return orderId;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get order details from Firestore (placeholder for future implementation)
export const getOrder = async (): Promise<null> => {
  try {
    // Note: In a real app, you'd query by orderId field
    // For now, we'll return a basic structure
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

// Validate phone number (Indian format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone.replace(/\D/g, ""));
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate pincode (Indian format)
export const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};
