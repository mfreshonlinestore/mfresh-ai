"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Premium M Fresh Dairy hero section.
 *
 * Replace the two default image paths below with the paths to your own images
 * in /public, or pass them as props: <Hero backgroundImage="..." bottleImage="..." />.
 */
type HeroProps = {
  backgroundImage?: string;
  bottleImage?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({
  backgroundImage = "/images/mfresh-hero-bg.jpg",
  bottleImage = "/images/mfresh-milk-bottle.png",
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[#063f2c] text-white"
    >
      {/* Background image and contrast layers */}
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062b20]/95 via-[#073b2a]/80 to-[#073b2a]/35" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[40%] bg-gradient-to-t from-[#062b20]/75 to-transparent" />

      {/* Decorative light only; the bottle itself is never wrapped in a card or box. */}
      <div className="pointer-events-none absolute -right-28 top-12 -z-10 h-80 w-80 rounded-full bg-[#dff8bf]/20 blur-3xl sm:right-8 sm:h-[28rem] sm:w-[28rem]" />
      <div className="pointer-events-none absolute left-[43%] top-0 -z-10 hidden h-full w-px bg-white/10 lg:block" />

      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-8 px-5 pb-10 pt-28 sm:min-h-[760px] sm:px-8 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-12 lg:pb-14">
        <motion.div
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-2xl"
        >
          <motion.div
            variants={fadeUp}
            custom={0.05}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#edffd8] backdrop-blur-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#b9ed6b] shadow-[0_0_0_5px_rgba(185,237,107,0.16)]" />
            Fresh from trusted farms
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={0.13}
            className="mb-4 font-semibold text-sm uppercase tracking-[0.25em] text-[#c9f68b] sm:text-base"
          >
            M Fresh Dairy
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={fadeUp}
            custom={0.2}
            className="max-w-xl font-serif text-5xl font-semibold leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Purity you can
            <span className="block text-[#d9faab]">taste every day.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={0.3}
            className="mt-7 max-w-lg text-base leading-7 text-white/80 sm:text-lg sm:leading-8"
          >
            Wholesome, delicious milk delivered with the care your family
            deserves. Naturally fresh, thoughtfully handled, always M Fresh.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.4}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/products"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#d3f58d] px-7 text-sm font-bold text-[#083b29] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0b4934]"
            >
              Explore our products
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/35 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0b4934]"
            >
              Our fresh promise
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={0.5}
            className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/20 pt-6 text-sm text-white/85"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d3f58d] text-[#073b2a]">✓</span>
              Farm fresh daily
            </div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d3f58d] text-[#073b2a]">✓</span>
              Quality checked
            </div>
          </motion.div>
        </motion.div>

        {/* No background, border, glass effect, or container is placed around this bottle. */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, x: 45, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex w-full max-w-[360px] items-end justify-center self-end pt-4 sm:max-w-[430px] lg:mx-0 lg:max-w-[520px] lg:justify-end lg:self-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, -1, 0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full"
          >
            <Image
              src={bottleImage}
              alt="M Fresh fresh milk bottle"
              width={900}
              height={1200}
              priority
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 430px, 520px"
              className="h-auto w-full object-contain drop-shadow-[0_28px_24px_rgba(0,0,0,0.3)]"
            />
          </motion.div>

          <div className="absolute bottom-[12%] left-0 rounded-full border border-white/30 bg-[#0a5139]/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm lg:-left-4">
            100% Fresh Milk
          </div>
        </motion.div>
      </div>
    </section>
  );
}
