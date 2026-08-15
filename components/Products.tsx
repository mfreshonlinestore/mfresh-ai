"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { Product } from "@/lib/types";

const products: Product[] = [
  {
    id: "milk",
    name: "Fresh Cow Milk",
    image: "/images/milk-bottle.png",
    description: "100% Pure Farm Fresh Cow Milk",
    price: 80,
    unit: "1 Litre",
  },
  {
    id: "curd",
    name: "Fresh Curd",
    image: "/images/curd.png",
    description: "Thick & Natural Homemade Taste",
    price: 50,
    unit: "500 ml",
  },
  {
    id: "paneer",
    name: "Premium Paneer",
    image: "/images/paneer.png",
    description: "Soft Premium Quality Paneer",
    price: 135,
    unit: "200g",
  },
  {
    id: "butter",
    name: "Fresh Butter",
    image: "/images/butter.png",
    description: "Fresh Creamy Butter",
    price: 200,
    unit: "250g",
  },
  {
    id: "ghee",
    name: "Pure Cow Ghee",
    image: "/images/ghee.png",
    description: "Traditional Pure Cow Ghee",
    price: 700,
    unit: "500 ml",
  },
];

export default function Products() {
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addItem(product, quantity);
    
    // Show feedback
    setAddedProducts((prev) => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);

    // Reset quantity
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));
  };

  return (
    <section
      id="products"
      className="py-24 bg-green-50"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}

        <div className="text-center">

          <p className="text-green-600 font-semibold uppercase">
            Our Products
          </p>

          <h2 className="text-5xl font-bold text-green-800 mt-3">
            Fresh Dairy Products
          </h2>

          <p className="mt-5 text-gray-600">
            Pure, Healthy and Fresh Products Delivered Every Morning
          </p>

        </div>



        {/* Product Cards */}

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 mt-16">


          {products.map((product, index) => (

            <motion.div
              key={product.id}

              initial={{
                opacity: 0,
                y: 50,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}

              viewport={{
                once: true,
              }}

              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition"
            >


              <div className="flex justify-center">

                <Image
                  src={product.image}
                  alt={product.name}
                  width={180}
                  height={220}
                  className="object-contain w-auto h-auto"
                />

              </div>



              <div className="flex justify-center gap-1 mt-5">

                {[1,2,3,4,5].map((star)=>(
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>



              <h3 className="mt-5 text-xl font-bold text-green-700 text-center">
                {product.name}
              </h3>


              <p className="mt-3 text-gray-600 text-center text-sm">
                {product.description}
              </p>

              <p className="mt-2 text-center text-sm text-gray-500">
                {product.unit}
              </p>


              <p className="mt-4 text-center text-lg font-bold text-green-800">
                ₹{product.price}
              </p>

              {/* Quantity Controls */}
              <div className="mt-5 flex items-center justify-center gap-3 bg-gray-100 rounded-full p-2 w-fit mx-auto">
                <button
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                >
                  <Minus size={16} className="text-green-700" />
                </button>
                <span className="w-8 text-center font-semibold">
                  {quantities[product.id] || 1}
                </span>
                <button
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                >
                  <Plus size={16} className="text-green-700" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className={`mt-5 w-full flex items-center justify-center gap-2 ${
                  addedProducts.has(product.id)
                    ? "bg-green-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white py-3 rounded-full font-semibold transition`}
              >

                <ShoppingCart size={20}/>

                {addedProducts.has(product.id) ? "Added!" : "Add to Cart"}

              </button>


            </motion.div>

          ))}


        </div>


      </div>

    </section>
  );
}
