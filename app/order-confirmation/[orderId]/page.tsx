"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ArrowRight, Copy } from "lucide-react";
import { getDb } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface OrderData {
  id: string;
  customerDetails: {
    fullName: string;
    mobileNumber: string;
    email: string;
    deliveryAddress: string;
    landmark?: string;
    pincode: string;
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
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt?: { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const db = getDb();
        if (!db) {
          throw new Error("Firebase is not initialized");
        }

        const q = query(
          collection(db, "orders"),
          where("id", "==", orderId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const orderData = querySnapshot.docs[0].data() as OrderData;
          setOrder(orderData);
        } else {
          console.log("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full" />
          </div>
          <p className="text-gray-600 font-semibold">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find your order. Please check the order ID.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle size={64} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-green-800 mb-4">
            Order Confirmed!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for your order. We&apos;ll prepare it and deliver it to your
            address.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Order ID Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-green-800">Order ID</h2>
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                >
                  <Copy size={18} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-3xl font-bold text-green-600 font-mono break-all">
                {orderId}
              </p>
              <p className="text-gray-600 mt-2 text-sm">
                Save this ID for your records and customer support
              </p>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.customerDetails.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.customerDetails.mobileNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.customerDetails.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Pincode</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.customerDetails.pincode}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
                <p className="text-gray-800 leading-relaxed">
                  {order.customerDetails.deliveryAddress}
                  {order.customerDetails.landmark && (
                    <>
                      <br />
                      <span className="text-sm text-gray-600">
                        Landmark: {order.customerDetails.landmark}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-bold text-green-800">
                      ₹{item.subtotal}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Order Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-green-600 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {order.createdAt && typeof order.createdAt === "object" && "toDate" in order.createdAt
                        ? order.createdAt.toDate?.().toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">Confirmed</p>
                    <p className="text-sm text-gray-600">
                      We&apos;re confirming your order
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">Preparing</p>
                    <p className="text-sm text-gray-600">
                      We&apos;re preparing your items
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">Delivering</p>
                    <p className="text-sm text-gray-600">
                      On the way to you
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">Delivered</p>
                    <p className="text-sm text-gray-600">
                      Enjoy your fresh dairy!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{order.tax}</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="text-xl font-bold text-green-800">Total</span>
                <span className="text-2xl font-bold text-green-800">
                  ₹{order.total}
                </span>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Payment Status:</span>{" "}
                  <span className="text-green-600 font-semibold">
                    {order.paymentStatus === "pending"
                      ? "Pending"
                      : "Completed"}
                  </span>
                </p>
              </div>

              {/* WhatsApp Support */}
              <a
                href={`https://wa.me/919150852830?text=Hello M Fresh Dairy, I have an order with ID: ${orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition mb-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.278.667-2.417 1.602-3.271 2.763-1.9 2.588-2.123 6.289-.561 9.262 2.694 4.979 8.232 7.068 13.082 5.192 4.572-1.795 7.588-6.144 7.15-11.046-.5-5.755-5.789-10.154-11.385-10.638-.27-.02-.54-.032-.811-.032z" />
                </svg>
                WhatsApp Support
              </a>

              <Link
                href="/"
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition"
              >
                Back to Home
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
