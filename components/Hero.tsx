"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/55"></div>

      <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-green-700 font-semibold text-xl">
            🌿 M Fresh Dairy
          </p>

          <h1 className="mt-5 text-5xl md:text-7xl font-extrabold leading-tight text-green-900">
            Fresh Cow Milk
          </h1>

          <h2 className="mt-5 text-2xl md:text-3xl font-semibold text-gray-800">
            Pure Taste From Healthy Farms
          </h2>

          <p className="mt-7 text-lg md:text-xl text-gray-700 leading-8 max-w-xl">
            100% Pure • Natural • Fresh Every Morning.
            <br />
            Farm Fresh Cow Milk Delivered Directly To Your Doorstep.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold shadow-xl transition">
              Subscribe Now
            </button>

            <button className="border-2 border-green-600 bg-white hover:bg-green-50 text-green-700 px-8 py-4 rounded-full font-semibold shadow-lg transition">
              WhatsApp Order
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-14">

            <div>
              <h3 className="text-3xl font-bold text-green-700">
                100%
              </h3>

              <p className="text-gray-700 mt-2">
                Pure Milk
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-green-700">
                Fresh
              </h3>

              <p className="text-gray-700 mt-2">
                Every Morning
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-green-700">
                Farm
              </h3>

              <p className="text-gray-700 mt-2">
                Direct Supply
              </p>
            </div>

          </div>
        </motion.div>

        {/* RIGHT IMAGE */}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            y: [0, -18, 0],
          }}
          transition={{
            opacity: { duration: 1 },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="flex justify-center"
        >

          <div className="bg-white/35 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl border border-white/40">

            <Image
              src="/images/milk-bottle.png"
              alt="Fresh Cow Milk"
              width={500}
              height={700}
              priority
              className="w-[260px] md:w-[420px] h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] hover:scale-105 transition duration-500"
            />

          </div>

        </motion.div>

      </div>
    </section>
  );
}