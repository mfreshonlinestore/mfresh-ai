"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";


const reviews = [
  {
    name: "Ravi Kumar",
    place: "Chennai",
    review:
      "Very fresh milk quality. Delivery is always on time. Highly recommended.",
  },
  {
    name: "Priya",
    place: "Kolathur",
    review:
      "M Fresh Dairy milk tastes very natural. My family loves it.",
  },
  {
    name: "Arun",
    place: "Chennai",
    review:
      "Good packing and excellent service. Fresh milk every morning.",
  },
];


export default function Testimonials() {

  return (

    <section
      id="reviews"
      className="py-24 bg-green-50"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}

        <div className="text-center">

          <p className="text-green-600 font-semibold uppercase">
            Customer Reviews
          </p>


          <h2 className="text-5xl font-bold text-green-800 mt-3">
            What Our Customers Say
          </h2>


          <p className="mt-5 text-gray-600">
            Trusted by families who love fresh dairy products.
          </p>

        </div>



        {/* Reviews */}

        <div className="grid md:grid-cols-3 gap-8 mt-16">


          {reviews.map((item,index)=>(


            <motion.div

              key={item.name}

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

              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition"

            >


              <div className="flex gap-1">

                {[1,2,3,4,5].map((star)=>(

                  <Star
                    key={star}
                    size={20}
                    className="text-yellow-400 fill-yellow-400"
                  />

                ))}

              </div>



              <p className="mt-6 text-gray-600 leading-7">
                "{item.review}"
              </p>



              <h3 className="mt-6 text-xl font-bold text-green-700">
                {item.name}
              </h3>


              <p className="text-gray-500">
                {item.place}
              </p>



            </motion.div>


          ))}


        </div>


      </div>


    </section>

  );
}