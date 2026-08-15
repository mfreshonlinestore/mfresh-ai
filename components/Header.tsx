"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/CartContext";


export default function Header() {

  const [open, setOpen] = useState(false);
  const { getItemCount } = useCart();
  const cartCount = getItemCount();


  const menuItems = [
    ["Home", "#home"],
    ["Products", "#products"],
    ["About", "#about"],
    ["Gallery", "#gallery"],
    ["Contact", "#contact"],
  ];


  return (

    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg shadow-md">


      <div className="max-w-7xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between">


        {/* Logo */}

        <Link href="#home" className="flex items-center gap-3">


          <Image
            src="/images/logo.png"
            alt="M Fresh Dairy"
            width={55}
            height={55}
            priority
            className="rounded-full object-cover"
          />


          <div>

            <h1 className="text-xl md:text-2xl font-bold text-green-800">
              M Fresh Dairy
            </h1>

            <p className="text-xs md:text-sm text-gray-500">
              Fresh Every Morning
            </p>

          </div>


        </Link>




        {/* Desktop Menu */}

        <nav className="hidden md:flex items-center gap-8">


          {menuItems.map(([name,link])=>(

            <Link
              key={name}
              href={link}
              className="text-gray-700 font-medium hover:text-green-600"
            >
              {name}
            </Link>

          ))}


        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 text-green-600 hover:bg-green-50 rounded-full transition"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="#subscription"
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile Button */}

        <button
          className="md:hidden flex items-center gap-4 text-green-700"
          onClick={()=>setOpen(!open)}
        >
          <Link href="/cart" className="relative p-2">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {open ? <X size={30}/> : <Menu size={30}/>}

        </button>


      </div>




      {/* Mobile Menu */}

      {open && (

        <div className="md:hidden bg-white shadow-lg px-6 py-5">


          {menuItems.map(([name,link])=>(

            <Link
              key={name}
              href={link}
              onClick={()=>setOpen(false)}
              className="block py-3 border-b text-gray-700"
            >
              {name}
            </Link>

          ))}

          <Link
            href="#subscription"
            className="block py-3 bg-green-600 text-white rounded-full font-semibold text-center mt-4"
            onClick={()=>setOpen(false)}
          >
            Subscribe
          </Link>

        </div>

      )}


    </header>

  );
}