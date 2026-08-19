"use client";

import { useEffect, useState } from "react";
import {
  subscribeToOrders,
  updateOrderStatus,
  calculateDashboardStats,
  DashboardStats,
  AdminOrder,
  formatTimestamp,
} from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  Navigation,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "New Order",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_FLOW: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todaySales: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      async (updatedOrders) => {
        setOrders(updatedOrders);
        const newStats = await calculateDashboardStats(updatedOrders);
        setStats(newStats);
        setLoading(false);
      },
      (error) => {
        console.error("Error in orders subscription:", error);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleStatusUpdate = async (
    order: AdminOrder,
    newStatus: AdminOrder["orderStatus"]
  ) => {
    if (!order.docId) return;

    setUpdatingStatus((prev) => new Set([...prev, order.docId!]));

    try {
      await updateOrderStatus(order.docId, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingStatus((prev) => {
        const newSet = new Set(prev);
        newSet.delete(order.docId!);
        return newSet;
      });
    }
  };

  const handleWhatsApp = (order: AdminOrder) => {
    const message = `Hi ${order.customerDetails.fullName}, your order ${order.id} status is: ${STATUS_LABELS[order.orderStatus]}`;
    window.open(
      `https://wa.me/91${order.customerDetails.mobileNumber}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-6 text-center py-20">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full" />
          </div>
          <p className="text-gray-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Order Management Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and track all customer orders in real-time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            icon={<ShoppingCart size={24} />}
            label="Today's Orders"
            value={stats.todayOrders}
            color="bg-blue-600"
          />
          <StatCard
            icon={<DollarSign size={24} />}
            label="Today's Sales"
            value={formatPrice(stats.todaySales).replace("₹", "")}
            color="bg-green-600"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Pending Orders"
            value={stats.pendingOrders}
            color="bg-yellow-600"
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            label="Delivered Today"
            value={stats.deliveredOrders}
            color="bg-purple-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <AlertCircle
                size={48}
                className="mx-auto text-gray-400 mb-4"
              />
              <p className="text-gray-600 text-lg">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const orderData = order as any;
                return (
                  <motion.div
                    key={order.docId || order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden border border-gray-100"
                  >
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() =>
                        setExpandedOrderId(
                          expandedOrderId === order.docId
                            ? null
                            : order.docId || null
                        )
                      }
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-green-800">
                              Order #{order.id}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                STATUS_COLORS[order.orderStatus]
                              }`}
                            >
                              {STATUS_LABELS[order.orderStatus]}
                            </span>

                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                              {orderData.paymentMethod === "cod"
                                ? "💵 COD"
                                : "📱 Online UPI"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone size={16} />
                              {order.customerDetails.mobileNumber}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign size={16} />
                              {formatPrice(order.total)}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Package size={16} />
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={16} />
                              {formatTimestamp(order.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <svg
                            className={`w-6 h-6 text-gray-500 transition transform ${
                              expandedOrderId === order.docId
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {expandedOrderId === order.docId && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="border-t-2 border-gray-100 p-6 bg-gray-50/70"
                      >
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                            <MapPin size={18} />
                            Customer & Delivery Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                              <p className="font-semibold text-gray-800">
                                {order.customerDetails.fullName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Email</p>
                              <p className="font-semibold text-gray-800 break-all">
                                {order.customerDetails.email}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-600 mb-1">
                                Delivery Address
                              </p>
                              <div className="flex gap-2">
                                <MapPin size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {order.customerDetails.deliveryAddress}
                                  </p>
                                  {order.customerDetails.landmark && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      Landmark: {order.customerDetails.landmark}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4">
                                {(order.customerDetails as any)?.geoCoordinates ? (
                                  <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${(order.customerDetails as any).geoCoordinates.latitude},${(order.customerDetails as any).geoCoordinates.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition text-sm"
                                  >
                                    <Navigation size={18} />
                                    📍 Start Delivery Navigation (Google Maps)
                                  </a>
                                ) : (
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                      order.customerDetails.deliveryAddress + " " + order.customerDetails.pincode
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl shadow transition text-sm"
                                  >
                                    <MapPin size={18} />
                                    🔍 Search Address on Maps
                                  </a>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Pincode</p>
                              <p className="font-semibold text-gray-800">
                                {order.customerDetails.pincode}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                            <Package size={18} />
                            Items Ordered
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.productId}
                                className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                              >
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {item.productName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {item.quantity} × {formatPrice(item.price)}
                                  </p>
                                </div>
                                <p className="font-bold text-green-800">
                                  {formatPrice(item.subtotal)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-200 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold">
                              {formatPrice(order.subtotal)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-semibold">
                              {formatPrice(order.tax)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Payment Mode</span>
                            <span className="font-bold text-gray-800">
                              {orderData.paymentMethod === "cod" ? "💵 Cash on Delivery" : "📱 Online UPI"}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Payment Status</span>
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                              {order.paymentStatus}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-3 mt-2">
                            <span className="font-bold text-green-800 text-lg">Total</span>
                            <span className="text-xl font-bold text-green-800">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {STATUS_FLOW[order.orderStatus]?.map((nextStatus) => (
                            <button
                              key={nextStatus}
                              onClick={() =>
                                handleStatusUpdate(order, nextStatus as AdminOrder["orderStatus"])
                              }
                              disabled={updatingStatus.has(order.docId!)}
                              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition shadow-sm text-sm"
                            >
                              {updatingStatus.has(order.docId!)
                                ? "Updating..."
                                : nextStatus === "confirmed"
                                ? "✓ Confirm Order"
                                : nextStatus === "preparing"
                                ? "🔨 Start Preparing"
                                : nextStatus === "out_for_delivery"
                                ? "🚚 Out for Delivery"
                                : nextStatus === "delivered"
                                ? "✓ Mark Delivered"
                                : "Cancel"}
                            </button>
                          ))}

                          <button
                            onClick={() => handleWhatsApp(order)}
                            className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition shadow-sm text-sm"
                          >
                            💬 WhatsApp Customer
                          </button>

                          <Link
                            href={`/order-confirmation/${order.id}`}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-sm text-sm text-center"
                            target="_blank"
                          >
                            👁 View Customer Page
                          </Link>

                          {order.orderStatus !== "cancelled" &&
                            order.orderStatus !== "delivered" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order, "cancelled")
                                }
                                disabled={updatingStatus.has(order.docId!)}
                                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition shadow-sm text-sm"
                              >
                                {updatingStatus.has(order.docId!)
                                  ? "Updating..."
                                  : "❌ Cancel Order"}
                              </button>
                            )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100"
    >
      <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4 shadow`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
}