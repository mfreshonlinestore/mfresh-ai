"use client";

import Link from "next/link";

import {
  MapPin,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram
} from "react-icons/fa";


export default function Footer() {

  return (

    <footer className="bg-green-900 text-white pt-16 pb-8">


      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">


        {/* Company */}

        <div>

          <h2 className="text-3xl font-bold">
            M Fresh Dairy
          </h2>


          <p className="mt-5 text-green-100 leading-7">
            Pure farm fresh cow milk, curd, paneer,
            butter and ghee delivered fresh to your
            doorstep every morning.
          </p>



          {/* Social Icons */}

          <div className="flex gap-5 mt-6">


            <FaFacebook
              size={28}
              className="cursor-pointer hover:text-green-300"
            />


            <FaInstagram
              size={28}
              className="cursor-pointer hover:text-green-300"
            />


            <MessageCircle
              size={28}
              className="cursor-pointer hover:text-green-300"
            />


          </div>


        </div>





        {/* Products */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Products
          </h3>


          <ul className="space-y-3 text-green-100">

            <li>Fresh Cow Milk</li>
            <li>Curd</li>
            <li>Paneer</li>
            <li>Butter</li>
            <li>Pure Cow Ghee</li>

          </ul>


        </div>





        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Quick Links
          </h3>


          <ul className="space-y-3 text-green-100">


            <li>
              <Link href="#home">
                Home
              </Link>
            </li>


            <li>
              <Link href="#about">
                About
              </Link>
            </li>


            <li>
              <Link href="#products">
                Products
              </Link>
            </li>


            <li>
              <Link href="#gallery">
                Gallery
              </Link>
            </li>


            <li>
              <Link href="#contact">
                Contact
              </Link>
            </li>


          </ul>


        </div>






        {/* Contact */}

        <div>


          <h3 className="text-xl font-semibold mb-5">
            Contact
          </h3>



          <p className="flex gap-3 text-green-100">

            <MapPin size={22}/>

            Chennai, Tamil Nadu

          </p>



          <p className="flex gap-3 mt-4 text-green-100">

            <Phone size={22}/>

            +91 91508 52830

          </p>



          <p className="flex gap-3 mt-4 text-green-100">

            <Mail size={22}/>

            info@mfreshdairy.com

          </p>



        </div>



      </div>





      {/* Bottom */}

      <div className="border-t border-green-700 mt-12 pt-6 text-center text-green-200">


        © 2026 M Fresh Dairy. All Rights Reserved.


      </div>



    </footer>

  );

}