"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";


export default function Contact() {

  return (

    <section
      id="contact"
      className="py-24 bg-green-50"
    >

      <div className="max-w-7xl mx-auto px-6">


        <div className="text-center">

          <p className="text-green-600 font-semibold uppercase">
            Contact Us
          </p>


          <h2 className="text-5xl font-bold text-green-800 mt-3">
            Get In Touch
          </h2>


          <p className="mt-5 text-gray-600">
            We are happy to help you with fresh dairy products.
          </p>

        </div>



        <div className="grid md:grid-cols-2 gap-10 mt-16">



          {/* Left Contact */}

          <motion.div
            initial={{
              opacity:0,
              x:-50
            }}

            whileInView={{
              opacity:1,
              x:0
            }}

            viewport={{
              once:true
            }}

            className="space-y-6"
          >


            <div className="bg-white rounded-3xl p-6 shadow-lg flex gap-5">

              <MapPin className="text-green-600" size={35}/>

              <div>
                <h3 className="text-xl font-bold text-green-700">
                  Address
                </h3>

                <p className="text-gray-600 mt-2">
                  M Fresh Dairy<br/>
                  Chennai, Tamil Nadu
                </p>
              </div>

            </div>



            <div className="bg-white rounded-3xl p-6 shadow-lg flex gap-5">

              <Phone className="text-green-600" size={35}/>

              <div>

                <h3 className="text-xl font-bold text-green-700">
                  Phone
                </h3>

                <p className="text-gray-600 mt-2">
                  +91 91508 52830
                </p>

              </div>

            </div>



            <div className="bg-white rounded-3xl p-6 shadow-lg flex gap-5">

              <Mail className="text-green-600" size={35}/>

              <div>

                <h3 className="text-xl font-bold text-green-700">
                  Email
                </h3>

                <p className="text-gray-600 mt-2">
                  info@mfreshdairy.com
                </p>

              </div>

            </div>



            <a
              href="https://wa.me/919150852830"
              target="_blank"
              className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold shadow-lg"
            >

              <MessageCircle />

              Order Through WhatsApp

            </a>


          </motion.div>





          {/* Form */}

          <motion.div

            initial={{
              opacity:0,
              x:50
            }}

            whileInView={{
              opacity:1,
              x:0
            }}

            viewport={{
              once:true
            }}

            className="bg-white rounded-3xl p-8 shadow-xl"

          >

            <input
              placeholder="Your Name"
              className="w-full p-4 border rounded-xl mb-4"
            />


            <input
              placeholder="Phone Number"
              className="w-full p-4 border rounded-xl mb-4"
            />


            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full p-4 border rounded-xl"
            />


            <button
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold"
            >
              Send Message
            </button>


          </motion.div>


        </div>


      </div>

    </section>

  );
}