"use client";

import Image from "next/image";
import { motion } from "framer-motion";


const gallery = [
  {
    image: "/images/farm.png",
    title: "Farm",
  },
  {
    image: "/images/cow.png",
    title: "Fresh Cow Milk",
  },
  {
    image: "/images/milk-collection.png",
    title: "Milk Collection",
  },
  {
    image: "/images/packing.png",
    title: "Milk Packaging",
  },
  {
    image: "/images/delivery.png",
    title: "Milk Delivery",
  },
  {
    image: "/images/products.png",
    title: "M Fresh Dairy Products",
  },
];


export default function Gallery() {

  return (

    <section
      id="gallery"
      className="py-24 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6">


        {/* Heading */}

        <div className="text-center">

          <p className="text-green-600 font-semibold uppercase">
            Gallery
          </p>


          <h2 className="text-5xl font-bold text-green-800 mt-3">
            Our Dairy Journey
          </h2>


          <p className="mt-5 text-gray-600">
            From farm to your doorstep, freshness at every step.
          </p>

        </div>



        {/* Gallery Grid */}

        <div className="grid md:grid-cols-3 gap-8 mt-16">


          {gallery.map((item,index)=>(


            <motion.div

              key={item.title}

              initial={{
                opacity:0,
                y:40
              }}

              whileInView={{
                opacity:1,
                y:0
              }}

              transition={{
                delay:index*0.1
              }}

              viewport={{
                once:true
              }}

              className="group overflow-hidden rounded-3xl shadow-lg"

            >


              <div className="relative h-72">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />

              </div>



              <div className="bg-green-700 text-white p-5">

                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

              </div>



            </motion.div>


          ))}


        </div>


      </div>


    </section>

  );
}