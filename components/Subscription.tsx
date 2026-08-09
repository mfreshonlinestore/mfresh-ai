"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    title: "Daily Milk",
    quantity: "500 ML",
    price: "₹38 / Day",
    features: [
      "Fresh Cow Milk",
      "Morning Delivery",
      "No Preservatives",
    ],
  },

  {
    title: "Family Pack",
    quantity: "1 Litre",
    price: "₹76 / Day",
    features: [
      "Pure Farm Milk",
      "Daily Door Delivery",
      "Best For Family",
    ],
  },

  {
    title: "Premium Plan",
    quantity: "2 Litres",
    price: "₹152 / Day",
    features: [
      "Priority Delivery",
      "Fresh Every Morning",
      "Premium Quality",
    ],
  },
];

const whatsappNumber = "919150852830";

function getSubscriptionLink(planTitle: string) {
  const message = `Hello M Fresh Dairy, I would like to subscribe to the ${planTitle} plan.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function Subscription() {

  return (
    <section
      id="subscription"
      className="py-24 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6">


        <div className="text-center">

          <p className="text-green-600 font-semibold uppercase">
            Subscription
          </p>

          <h2 className="text-5xl font-bold text-green-800 mt-3">
            Choose Your Milk Plan
          </h2>

          <p className="mt-5 text-gray-600">
            Fresh cow milk delivered to your doorstep every morning.
          </p>

        </div>



        <div className="grid md:grid-cols-3 gap-8 mt-16">


          {plans.map((plan,index)=>(

            <motion.div

              key={plan.title}

              initial={{
                opacity:0,
                y:50
              }}

              whileInView={{
                opacity:1,
                y:0
              }}

              transition={{
                delay:index*0.2
              }}

              viewport={{
                once:true
              }}

              className="bg-green-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
            >


              <h3 className="text-3xl font-bold text-green-700">
                {plan.title}
              </h3>


              <p className="mt-4 text-2xl font-bold text-gray-800">
                {plan.quantity}
              </p>


              <p className="mt-3 text-green-700 text-xl font-semibold">
                {plan.price}
              </p>



              <div className="mt-6 space-y-3">

                {plan.features.map((item)=>(

                  <div
                    key={item}
                    className="flex gap-3 items-center text-gray-700"
                  >

                    <CheckCircle
                      className="text-green-600"
                    />

                    {item}

                  </div>

                ))}

              </div>



              <a
                href={getSubscriptionLink(plan.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold"
              >
                Subscribe on WhatsApp
              </a>


            </motion.div>

          ))}


        </div>


      </div>

    </section>
  );
}
