import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  where,
  Timestamp,
} from "firebase/firestore";

export interface AdminOrder {
  docId?: string;
  id: string;
  customerDetails: {
    fullName: string;
    mobileNumber: string;
    email: string;
    deliveryAddress: string;
    landmark?: string;
    pincode: string;
    paymentMethod?: "cod" | "upi";
    paymentStatus?: string;
    utrNumber?: string | null;
    geoCoordinates?: {
      latitude: number;
      longitude: number;
    } | null;
  };
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
  paymentMethod?: "cod" | "upi";
  paymentStatus: string;
  utrNumber?: string | null;
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  createdAt: any;
  updatedAt?: any;
}

export interface DashboardStats {
  todayOrders: number;
  todaySales: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export function subscribeToOrders(
  onUpdate: (orders: AdminOrder[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const orders: AdminOrder[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            docId: docSnap.id,
            id: data.id || docSnap.id,
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
            items: data.items || [],
            subtotal: data.subtotal || 0,
            tax: data.tax || 0,
            total: data.total || 0,
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
            orderStatus: data.orderStatus || "pending",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        onUpdate(orders);
      },
      (error) => {
        console.error("Orders listener error:", error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error("Failed to subscribe to orders:", error);
    if (onError && error instanceof Error) onError(error);
    return () => {};
  }
}

export async function updateOrderStatus(
  docId: string,
  newStatus: AdminOrder["orderStatus"]
): Promise<void> {
  const orderRef = doc(db, "orders", docId);
  await updateDoc(orderRef, {
    orderStatus: newStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function calculateDashboardStats(
  orders: AdminOrder[]
): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayOrders = 0;
  let todaySales = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;

  orders.forEach((order) => {
    const createdAt = formatTimestamp(order.createdAt);
    const isToday = createdAt >= today;

    if (isToday) {
      todayOrders += 1;
      if (order.orderStatus !== "cancelled") {
        todaySales += order.total;
      }
    }

    if (order.orderStatus === "pending") {
      pendingOrders += 1;
    }

    if (order.orderStatus === "delivered" && isToday) {
      deliveredOrders += 1;
    }
  });

  return {
    todayOrders,
    todaySales,
    pendingOrders,
    deliveredOrders,
  };
}

export function formatTimestamp(timestamp: any): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp.toDate === "function") return timestamp.toDate();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  return new Date(timestamp);
}