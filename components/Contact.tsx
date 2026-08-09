"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";


export default function Contact() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const whatsappMessage = `Hello M Fresh Dairy,\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/919150852830?text=${encodeURIComponent(whatsappMessage)}`;

    window.location.href = whatsappUrl;
  }

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
                  1/94 Gangai Amman Kovil Street, Kolathur<br/>
                  Chennai, Tamil Nadu - 600127
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

          <motion.form

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

            onSubmit={handleSubmit}

          >

            <input
              placeholder="Your Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full p-4 border rounded-xl mb-4"
            />


            <input
              placeholder="Phone Number"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              className="w-full p-4 border rounded-xl mb-4"
            />


            <textarea
              placeholder="Your Message"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              className="w-full p-4 border rounded-xl"
            />


            <button
              type="submit"
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold"
            >
              Send Message
            </button>


          </motion.form>


        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 overflow-hidden rounded-3xl bg-white p-3 shadow-xl"
        >
          <iframe
            title="M Fresh Dairy location"
            src="https://www.google.com/maps?q=1%2F94%20Gangai%20Amman%20Kovil%20Street%2C%20Kolathur%2C%20Chennai%2C%20Tamil%20Nadu%20600127&output=embed"
            className="h-[360px] w-full rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <a
            href="https://maps.app.goo.gl/24GMKXAUDjrMcchZA?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Get Directions
          </a>
        </motion.div>


      </div>

    </section>

  );
}
