"use client";

import { useCart } from "@/lib/CartContext";
import { formatPrice, createOrder, isValidPhoneNumber, isValidEmail, isValidPincode } from "@/lib/utils";
import { CustomerDetails, OrderItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader,
  MapPin,
  CheckCircle,
  Navigation,
  Search,
  Smartphone,
  ChevronLeft,
  Crosshair,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const { items, getTotal } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [utrNumber, setUtrNumber] = useState("");

  // Blinkit Style Full-Screen Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Selected Pin Coordinates & Display Info
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: 12.8687, // Default: Polacheri / Kolathur area
    lng: 80.1772,
  });
  const [detectedArea, setDetectedArea] = useState("Kolathur");
  const [detectedCity, setDetectedCity] = useState("Chennai, Polacheri");
  const [fullAddressText, setFullAddressText] = useState("");

  // உங்கள் கடை UPI ID
  const STORE_UPI_ID = "gangaarunachalam1998@okicici";
  const STORE_NAME = "M Fresh Dairy";

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: "",
    mobileNumber: "",
    email: "",
    deliveryAddress: "",
    landmark: "",
    pincode: "",
  });

  // Reverse Geocoding: Coordinates -> Address Text
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.address) {
        const area =
          data.address.suburb ||
          data.address.neighbourhood ||
          data.address.village ||
          data.address.town ||
          data.address.city ||
          "Selected Location";
        const city =
          data.address.city ||
          data.address.state_district ||
          data.address.state ||
          "Tamil Nadu";

        setDetectedArea(area);
        setDetectedCity(`${city} ${data.address.postcode ? "- " + data.address.postcode : ""}`);
        setFullAddressText(data.display_name);

        if (data.address.postcode) {
          setFormData((prev) => ({ ...prev, pincode: data.address.postcode }));
        }
      }
    } catch (e) {
      console.error("Failed to reverse geocode:", e);
    }
  };

  // GPS Current Location Fetcher
  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedCoords({ lat: latitude, lng: longitude });
        fetchAddressFromCoords(latitude, longitude);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        alert("Please enable location access in your browser.");
      },
      { enableHighAccuracy: true }
    );
  };

  // Search Places / Street Names
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=5`
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (place: any) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setSelectedCoords({ lat, lng });
    fetchAddressFromCoords(lat, lng);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Confirm Location Button Clicked from Blinkit Screen
  const handleConfirmLocation = () => {
    setFormData((prev) => ({
      ...prev,
      deliveryAddress: fullAddressText || `${detectedArea}, ${detectedCity}`,
    }));
    setShowMapModal(false);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!isValidPhoneNumber(formData.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    if (!isValidEmail(formData.email)) newErrors.email = "Enter a valid email address";
    if (!formData.deliveryAddress.trim())
      newErrors.deliveryAddress = "Delivery address is required";
    if (!isValidPincode(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";
    if (paymentMethod === "upi" && !utrNumber.trim())
      newErrors.utrNumber = "Please enter the 12-digit UPI Reference / UTR Number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const total = getTotal();
  const upiPaymentUrl = `upi://pay?pa=${STORE_UPI_ID}&pn=${encodeURIComponent(
    STORE_NAME
  )}&am=${total}&cu=INR&tn=${encodeURIComponent("M Fresh Dairy Order")}`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiPaymentUrl
  )}`;

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

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

      const orderCustomerData: any = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        deliveryAddress: formData.deliveryAddress,
        landmark: formData.landmark || "",
        pincode: formData.pincode,
        paymentMethod: paymentMethod,
        paymentStatus:
          paymentMethod === "cod" ? "Pay on Delivery" : "Paid Online (UPI)",
        utrNumber: paymentMethod === "upi" ? utrNumber : null,
        geoCoordinates: {
          latitude: selectedCoords.lat,
          longitude: selectedCoords.lng,
        },
      };

      const orderId = await createOrder(orderCustomerData, orderItems, total);
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-green-900 mb-1">
            Checkout
          </h1>
          <p className="text-gray-600 text-sm">Select location & delivery details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blinkit Style Delivery Location Banner */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={22} className="text-green-600" />
                  Delivery Location
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    handleFetchCurrentLocation();
                    setShowMapModal(true);
                  }}
                  className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-600 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Crosshair size={14} />
                  Change on Map
                </button>
              </div>

              {/* Location Display Card (Blinkit Style) */}
              <div
                onClick={() => {
                  handleFetchCurrentLocation();
                  setShowMapModal(true);
                }}
                className="cursor-pointer bg-gradient-to-r from-green-50/70 to-blue-50/50 p-4 rounded-2xl border-2 border-dashed border-green-300 hover:border-green-500 transition flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <MapPin size={20} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900 text-base">
                      {detectedArea || "Pin on Google Maps"}
                    </p>
                    <span className="text-xs font-bold text-green-700 underline">
                      Edit Pin ❯
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {formData.deliveryAddress ||
                      "Tap here to open interactive map and confirm your doorstep location"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Form Inputs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Customer Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:border-green-600 transition"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:border-green-600 transition"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:border-green-600 transition"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  House / Flat / Door Number & Street Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g. 1/94 Gangai Amman Kovil street, Kolathur"
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:border-green-600 transition"
                />
                {errors.deliveryAddress && (
                  <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Near Temple / School"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:border-green-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:border-green-600 transition"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Payment Method</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === "cod"
                        ? "border-green-600 bg-green-50/60"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymode"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 text-green-600"
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">💵 Cash on Delivery</p>
                      <p className="text-[11px] text-gray-500">Pay cash upon delivery</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === "upi"
                        ? "border-green-600 bg-green-50/60"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymode"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="w-4 h-4 text-green-600"
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">📱 Online UPI / GPay</p>
                      <p className="text-[11px] text-gray-500">Instant UPI QR / Apps</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === "upi" && (
                  <div className="mt-4 p-5 bg-gradient-to-b from-green-50 to-white border-2 border-green-500 rounded-2xl text-center">
                    <h4 className="font-bold text-green-800 text-base mb-1">
                      Pay ₹{total} via UPI
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      GPay, PhonePe, Paytm or scan QR
                    </p>

                    <a
                      href={upiPaymentUrl}
                      className="w-full mb-3 inline-flex items-center justify-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition text-sm"
                    >
                      <Smartphone size={18} />
                      Tap to Pay with GPay / PhonePe
                    </a>

                    <div className="flex flex-col items-center justify-center p-2 bg-white border rounded-xl shadow-inner max-w-[180px] mx-auto mb-3">
                      <img
                        src={upiQrCodeUrl}
                        alt="QR"
                        className="w-36 h-36 object-contain"
                      />
                      <p className="text-[10px] text-gray-600 font-bold mt-1">
                        {STORE_UPI_ID}
                      </p>
                    </div>

                    <div className="text-left max-w-sm mx-auto">
                      <label className="block text-gray-700 text-xs font-bold mb-1">
                        UPI Reference / UTR Number (12 Digits) *
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 423456789012"
                        className="w-full px-4 py-2 bg-white border-2 rounded-xl text-sm"
                      />
                      {errors.utrNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.utrNumber}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-400 text-red-700 text-xs rounded-xl font-bold">
                  {errors.submit}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3 max-h-52 overflow-y-auto divide-y">
                {items.map((cartItem) => (
                  <div key={cartItem.product.id} className="pt-2 flex justify-between">
                    <div>
                      <p className="font-bold text-gray-800 text-xs">
                        {cartItem.product.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {cartItem.quantity} × {formatPrice(cartItem.product.price)}
                      </p>
                    </div>
                    <p className="font-bold text-green-800 text-xs">
                      {formatPrice(cartItem.product.price * cartItem.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-green-800">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order ({paymentMethod === "cod" ? "COD" : "UPI"})
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 EXACT BLINKIT / ZEPTO STYLE FULL-SCREEN INTERACTIVE MAP PIN SCREEN */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            {/* Top Navigation Bar */}
            <div className="px-4 py-3 bg-white flex items-center justify-between border-b shadow-sm z-20">
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition"
              >
                <ChevronLeft size={24} />
              </button>
              <h3 className="text-base font-extrabold text-gray-800">
                Confirm map pin location
              </h3>
              <div className="w-10" />
            </div>

            {/* Search Address Floating Input Bar */}
            <div className="absolute top-16 left-4 right-4 z-20">
              <div className="relative">
                <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 px-4 py-3">
                  <Search size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchLocation()}
                    placeholder="Search for area, street name..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-800 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleSearchLocation}
                      className="text-xs font-bold text-green-700 px-2 py-1 bg-green-50 rounded-full"
                    >
                      {searching ? "..." : "Search"}
                    </button>
                  )}
                </div>

                {/* Search Autocomplete Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto divide-y">
                    {searchResults.map((res, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectSearchResult(res)}
                        className="p-3 text-xs text-gray-800 hover:bg-green-50 cursor-pointer flex items-start gap-2.5"
                      >
                        <MapPin size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{res.display_name.split(",")[0]}</p>
                          <p className="text-gray-500 text-[11px] line-clamp-1">
                            {res.display_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Map Area */}
            <div className="relative flex-grow w-full h-full bg-blue-50 overflow-hidden">
              <iframe
                title="Interactive Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCoords.lng - 0.005}%2C${selectedCoords.lat - 0.005}%2C${selectedCoords.lng + 0.005}%2C${selectedCoords.lat + 0.005}&layer=mapnik&marker=${selectedCoords.lat}%2C${selectedCoords.lng}`}
                className="w-full h-full pointer-events-auto"
              />

              {/* Exact Center Floating Pin with Blinkit Tooltip */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center pb-12 z-10">
                <div className="relative flex flex-col items-center">
                  {/* Tooltip Bubble */}
                  <div className="bg-gray-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl mb-1 text-center max-w-[200px] border border-gray-700 animate-bounce">
                    Your order will be delivered here
                    <p className="text-[9px] font-normal text-gray-300">
                      Move pin to your exact location
                    </p>
                  </div>

                  {/* Pin Center Marker */}
                  <div className="relative">
                    <MapPin size={46} className="text-slate-900 fill-slate-800 drop-shadow-2xl" />
                    <div className="absolute top-3 left-[15px] w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                  </div>
                  <div className="w-4 h-1.5 bg-black/30 rounded-full blur-[1px] mt-0.5" />
                </div>
              </div>

              {/* Go to Current Location Floating Button */}
              <button
                type="button"
                onClick={handleFetchCurrentLocation}
                disabled={locating}
                className="absolute bottom-40 right-4 z-20 bg-white/95 backdrop-blur-md border border-green-600 text-green-800 px-4 py-2.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 active:scale-95 transition"
              >
                <Crosshair size={16} className={`text-green-600 ${locating ? "animate-spin" : ""}`} />
                {locating ? "Locating..." : "Go to current location"}
              </button>
            </div>

            {/* Bottom Card (Delivering your order to) */}
            <div className="bg-white/95 backdrop-blur-xl border-t p-5 shadow-2xl z-20 rounded-t-3xl">
              <p className="text-xs font-extrabold text-gray-600 mb-2">
                Delivering your order to
              </p>

              <div className="flex items-center justify-between bg-gray-50 p-3.5 rounded-2xl border border-gray-200 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm">
                      {detectedArea}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{detectedCity}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFetchCurrentLocation}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Change
                </button>
              </div>

              {/* Confirm Location Button */}
              <button
                type="button"
                onClick={handleConfirmLocation}
                className="w-full py-4 bg-[#1B8036] hover:bg-green-800 text-white font-black text-base rounded-2xl shadow-xl transition flex items-center justify-center gap-2 active:scale-98"
              >
                Confirm location ❯
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}