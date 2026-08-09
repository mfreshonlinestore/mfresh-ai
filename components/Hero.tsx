"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

type HeroProps = {
  backgroundImage?: string;
  bottleImage?: string;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero({
  backgroundImage = "/images/hero-bg.png",
  bottleImage = "/images/milk-bottle.png",
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[#063f2c] text-white"
    >
      {/* Hero background image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Background contrast overlays only */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062b20]/95 via-[#073b2a]/80 to-[#073b2a]/30" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[40%] bg-gradient-to-t from-[#062b20]/75 to-transparent" />

      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-8 px-5 pb-10 pt-28 sm:min-h-[760px] sm:px-8 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
        {/* Hero content */}
        <div className="max-w-2xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#dff8bf]"
          >
            Pure goodness, delivered fresh
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Fresh milk.
            <span className="block text-[#dff8bf]">Better mornings.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg"
          >
            M Fresh Dairy brings farm-fresh milk to your home with wholesome
            taste, trusted quality, and everyday nutrition.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              href="#products"
              className="rounded-full bg-[#dff8bf] px-6 py-3 text-sm font-bold text-[#063f2c] transition hover:bg-white"
            >
              Explore Products
            </Link>

            <Link
              href="#about"
              className="rounded-full border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              Discover M Fresh
            </Link>
          </motion.div>
        </div>

        {/* Bottle only — no card, glow, background layer, or drop shadow */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[440px] self-end lg:max-w-[510px]"
        >
          <Image
            src={bottleImage}
            alt="M Fresh Dairy milk bottle"
            width={700}
            height={900}
            priority
            className="h-auto w-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
