"use client";

import { useCart } from "@/lib/CartContext";
import { formatPrice, createOrder, isValidPhoneNumber, isValidEmail, isValidPincode } from "@/lib/utils";
import { CustomerDetails, OrderItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader, MapPin, CheckCircle, Navigation } from "lucide-react";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, getTotal } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: "",
    mobileNumber: "",
    email: "",
    deliveryAddress: "",
    landmark: "",
    pincode: "",
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.display_name) {
            setFormData((prev) => ({
              ...prev,
              deliveryAddress: data.display_name,
              pincode: data.address?.postcode || prev.pincode,
            }));
            setLocationSuccess(true);
          }
        } catch (err) {
          console.error("Failed to fetch address", err);
          setLocationSuccess(true);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        alert("Please allow location access to auto-detect your delivery address.");
      },
      { enableHighAccuracy: true }
    );
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Checkout</h1>
          <p className="text-gray-600 mb-8">
            Your cart is empty. Add some products to checkout.
          </p>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            <ArrowRight size={20} />
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!isValidPhoneNumber(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required";
    }

    if (!isValidPincode(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      const orderItems: OrderItem[] = items.map((cartItem) => ({
        productId: cartItem.product.id,
        productName: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        subtotal: cartItem.product.price * cartItem.quantity,
      }));

      const total = getTotal();

      const orderCustomerData: any = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        deliveryAddress: formData.deliveryAddress,
        landmark: formData.landmark || "",
        pincode: formData.pincode,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "Pay on Delivery" : "Paid Online",
        geoCoordinates: locationCoords
          ? {
              latitude: locationCoords.lat,
              longitude: locationCoords.lng,
            }
          : null,
      };

      const orderId = await createOrder(orderCustomerData, orderItems, total);
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.";

      console.error("Checkout order submission failed:", error);
      setErrors({
        submit:
          message ||
          "Firebase order creation failed. Please check your Firebase config and Firestore rules.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const total = getTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-green-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order details</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-green-800">
                  Delivery Details
                </h2>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-50 hover:bg-green-100 border border-green-600 text-green-700 text-sm font-semibold rounded-xl transition shadow-sm"
                >
                  <Navigation
                    size={18}
                    className={`text-green-600 ${locating ? "animate-spin" : ""}`}
                  />
                  {locating ? "Fetching Location..." : "📍 Use Current Live Location"}
                </button>
              </div>

              {locationSuccess && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-800 text-sm font-medium">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  <span>Live GPS coordinates captured for accurate doorstep delivery!</span>
                </div>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-green-600 transition ${
                      errors.fullName
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-green-600 transition ${
                      errors.mobileNumber
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-green-600 transition ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-green-600 transition ${
                      errors.deliveryAddress
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Enter your complete delivery address"
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-green-600 transition"
                    placeholder="Nearby landmark or building name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-green-600 transition ${
                      errors.pincode
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="6-digit pincode"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                <div className="mb-6 pt-6 border-t-2 border-gray-100">
                  <label className="block text-gray-800 font-bold mb-4 text-lg">
                    Select Payment Method <span className="text-red-500">*</span>
                  </label>

                  <div className="space-y-3">
                    <label
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                        paymentMethod === "cod"
                          ? "border-green-600 bg-green-50/70"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💵</span>
                          <p className="font-bold text-gray-800">
                            Cash on Delivery (COD)
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Pay cash or UPI upon doorstep delivery
                        </p>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                        paymentMethod === "upi"
                          ? "border-green-600 bg-green-50/70"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📱</span>
                          <p className="font-bold text-gray-800">
                            Pay Online via UPI (GPay / PhonePe / Paytm)
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Instant payment via UPI Apps
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                    <p className="text-red-700 font-semibold">{errors.submit}</p>
                  </div>
                )}
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-8 hidden lg:block"
            >
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Order Items
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.product.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {cartItem.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {cartItem.quantity} × {formatPrice(cartItem.product.price)}
                      </p>
                    </div>
                    <p className="font-bold text-green-800">
                      {formatPrice(cartItem.product.price * cartItem.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 mt-4 pt-4 flex justify-between">
                <span className="text-xl font-bold text-green-800">Total</span>
                <span className="text-2xl font-bold text-green-800">
                  {formatPrice(total)}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pb-6 border-b-2 border-gray-200">
                {items.map((cartItem) => (
                  <div key={cartItem.product.id} className="flex gap-3">
                    <Image
                      src={cartItem.product.image}
                      alt={cartItem.product.name}
                      width={60}
                      height={80}
                      className="object-contain w-16 h-20"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 text-sm">
                        {cartItem.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {cartItem.quantity}
                      </p>
                      <p className="font-bold text-green-800 text-sm">
                        {formatPrice(cartItem.product.price * cartItem.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Mode</span>
                  <span className="font-semibold text-gray-800 uppercase text-xs bg-gray-100 px-2 py-1 rounded">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Online UPI"}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-green-800">Total</span>
                  <span className="text-2xl font-bold text-green-800">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order ({paymentMethod === "cod" ? "COD" : "UPI"})
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="w-full border-2 border-gray-300 text-gray-700 hover:border-gray-400 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition mt-4"
              >
                ← Back to Cart
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}