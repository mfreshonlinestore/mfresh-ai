import { getDb } from "./firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  doc,
  updateDoc,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";

export interface CustomerDetails {
  fullName: string;
  mobileNumber: string;
  email: string;
  deliveryAddress: string;
  landmark?: string;
  pincode: string;
  paymentMethod?: "cod" | "upi" | string;
  paymentStatus?: string;
  utrNumber?: string | null;
  geoCoordinates?: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface AdminOrder {
  id: string;
  docId?: string; // Firestore document ID for updates
  customerDetails: CustomerDetails;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: "cod" | "upi" | string;
  paymentStatus: "pending" | "completed" | "failed" | "paid" | string;
  utrNumber?: string | null;
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  createdAt?: { toDate: () => Date } | { seconds: number } | any;
  updatedAt?: { toDate: () => Date } | { seconds: number } | any;
}

export interface DashboardStats {
  todayOrders: number;
  todaySales: number;
  pendingOrders: number;
  deliveredOrders: number;
}

// Format Firebase timestamp
export const formatTimestamp = (
  timestamp?: { toDate?: () => Date } | { seconds?: number } | any
): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (
    typeof timestamp === "object" &&
    "toDate" in timestamp &&
    typeof timestamp.toDate === "function"
  ) {
    return timestamp.toDate();
  }
  if (typeof timestamp === "object" && "seconds" in timestamp) {
    return new Date((timestamp.seconds || 0) * 1000);
  }
  return new Date(timestamp);
};

// Fetch all orders with real-time listener
export const subscribeToOrders = (
  callback: (orders: AdminOrder[]) => void,
  onError?: (error: Error) => void
): Unsubscribe | null => {
  try {
    const db = getDb();
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders: AdminOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          orders.push({
            ...data,
            docId: docSnap.id,
            customerDetails: {
              fullName: data.customerDetails?.fullName || "",
              mobileNumber: data.customerDetails?.mobileNumber || "",
              email: data.customerDetails?.email || "",
              deliveryAddress: data.customerDetails?.deliveryAddress || "",
              landmark: data.customerDetails?.landmark || "",
              pincode: data.customerDetails?.pincode || "",
              paymentMethod:
                data.customerDetails?.paymentMethod ||
                data.paymentMethod ||
                "cod",
              paymentStatus:
                data.customerDetails?.paymentStatus ||
                data.paymentStatus ||
                "pending",
              utrNumber:
                data.customerDetails?.utrNumber || data.utrNumber || null,
              geoCoordinates:
                data.customerDetails?.geoCoordinates ||
                data.geoCoordinates ||
                null,
            },
            paymentMethod:
              data.paymentMethod ||
              data.customerDetails?.paymentMethod ||
              "cod",
            paymentStatus:
              data.paymentStatus ||
              data.customerDetails?.paymentStatus ||
              "pending",
            utrNumber:
              data.utrNumber || data.customerDetails?.utrNumber || null,
          } as AdminOrder);
        });
        callback(orders);
      },
      (error) => {
        console.error("Error listening to orders:", error);
        if (onError) onError(error as Error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up orders listener:", error);
    if (onError) onError(error as Error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (
  docId: string,
  status: AdminOrder["orderStatus"]
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    const orderRef = doc(db, "orders", docId);
    await updateDoc(orderRef, {
      orderStatus: status,
      updatedAt: Timestamp.now(),
    });

    console.log(`Order ${docId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (
  docId: string,
  status: "pending" | "completed" | "failed" | string
): Promise<void> => {
  try {
    const db = getDb();
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    const orderRef = doc(db, "orders", docId);
    await updateDoc(orderRef, {
      paymentStatus: status,
      updatedAt: Timestamp.now(),
    });

    console.log(`Order ${docId} payment status updated to ${status}`);
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// Get today's orders
export const getTodayOrders = async (): Promise<AdminOrder[]> => {
  try {
    const db = getDb();
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(today)),
      where("createdAt", "<", Timestamp.fromDate(tomorrow)),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const orders: AdminOrder[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        ...data,
        docId: docSnap.id,
      } as AdminOrder);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    return [];
  }
};

// Calculate dashboard stats
export const calculateDashboardStats = async (
  orders: AdminOrder[]
): Promise<DashboardStats> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter((order) => {
    const orderDate = formatTimestamp(order.createdAt);
    const orderDateOnly = new Date(orderDate);
    orderDateOnly.setHours(0, 0, 0, 0);
    return orderDateOnly.getTime() === today.getTime();
  });

  const todaySales = todayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus === "pending" || order.orderStatus === "confirmed"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  return {
    todayOrders: todayOrders.length,
    todaySales,
    pendingOrders,
    deliveredOrders,
  };
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<AdminOrder | null> => {
  try {
    const db = getDb();
    if (!db) {
      throw new Error("Firebase is not initialized");
    }

    const q = query(collection(db, "orders"), where("id", "==", orderId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      ...data,
      docId: docSnap.id,
    } as AdminOrder;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};