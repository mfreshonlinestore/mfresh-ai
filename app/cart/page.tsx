"use client";

import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some delicious fresh dairy products to your cart
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition"
            >
              <ArrowRight size={20} />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-green-800 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {items.map((cartItem) => (
                <motion.div
                  key={cartItem.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={cartItem.product.image}
                        alt={cartItem.product.name}
                        width={120}
                        height={150}
                        className="object-contain w-32 h-40"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-green-800 mb-2">
                        {cartItem.product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {cartItem.product.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {cartItem.product.unit}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-gray-700">Quantity:</span>
                        <div className="flex items-center gap-3 bg-gray-100 rounded-full p-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                cartItem.product.id,
                                cartItem.quantity - 1
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded-full transition"
                          >
                            <Minus size={16} className="text-green-700" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                cartItem.product.id,
                                cartItem.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded-full transition"
                          >
                            <Plus size={16} className="text-green-700" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Unit Price: {formatPrice(cartItem.product.price)}
                          </p>
                          <p className="text-2xl font-bold text-green-800">
                            Subtotal:{" "}
                            {formatPrice(
                              cartItem.product.price * cartItem.quantity
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(cartItem.product.id)}
                          className="p-3 hover:bg-red-50 rounded-full transition text-red-500"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-8"
              >
                ← Continue Shopping
              </Link>
            </motion.div>
          </div>

          {/* Order Summary */}
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

              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
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
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="text-xl font-bold text-green-800">Total</span>
                <span className="text-2xl font-bold text-green-800">
                  {formatPrice(total)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition mb-4"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </Link>

              <button
                onClick={() => clearCart()}
                className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-full font-semibold transition"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
