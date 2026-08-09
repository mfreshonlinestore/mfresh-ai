"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";

const products = [
  {
    name: "Fresh Cow Milk",
    image: "/images/milk-bottle.png",
    description: "100% Pure Farm Fresh Cow Milk",
    price: "₹76 / Litre",
  },
  {
    name: "Fresh Curd",
    image: "/images/curd.png",
    description: "Thick & Natural Homemade Taste",
    price: "₹80 / Litre",
  },
  {
    name: "Premium Paneer",
    image: "/images/paneer.png",
    description: "Soft Premium Quality Paneer",
    price: "₹135 / 200g",
  },
  {
    name: "Fresh Butter",
    image: "/images/butter.png",
    description: "Fresh Creamy Butter",
    price: "₹200 / 250g",
  },
  {
    name: "Pure Cow Ghee",
    image: "/images/ghee.png",
    description: "Traditional Pure Cow Ghee",
    price: "₹500 / 500ml",
  },
];

function getOrderLink(productName: string) {
  const message = `Hello M Fresh Dairy, I would like to order ${productName}.`;
  return `https://wa.me/919150852830?text=${encodeURIComponent(message)}`;
}

export default function Products() {

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
              key={product.name}

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


              <p className="mt-4 text-center text-lg font-bold text-green-800">
                {product.price}
              </p>



              <a
                href={getOrderLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold"
              >

                <ShoppingCart size={20}/>

                Order Now

              </a>


            </motion.div>

          ))}


        </div>


      </div>

    </section>
  );
}
