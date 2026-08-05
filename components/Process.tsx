"use client";

import { motion } from "framer-motion";
import { 
  Leaf,
  Milk,
  PackageCheck,
  Truck
} from "lucide-react";


const steps = [
  {
    title: "Healthy Farms",
    text: "Milk sourced from healthy cows at trusted farms.",
    icon: Leaf,
  },
  {
    title: "Milk Collection",
    text: "Fresh milk collected with proper hygiene standards.",
    icon: Milk,
  },
  {
    title: "Safe Packing",
    text: "Packed safely to maintain freshness and quality.",
    icon: PackageCheck,
  },
  {
    title: "Morning Delivery",
    text: "Delivered fresh to your doorstep every morning.",
    icon: Truck,
  },
];


export default function Process() {

  return (
    <section
      id="process"
      className="py-24 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6">


        <div className="text-center">

          <p className="text-green-600 font-semibold uppercase">
            Our Process
          </p>


          <h2 className="text-5xl font-bold text-green-800 mt-3">
            From Farm To Your Home
          </h2>


          <p className="mt-5 text-gray-600">
            Every step is handled with care to deliver pure fresh milk.
          </p>

        </div>



        <div className="grid md:grid-cols-4 gap-8 mt-16">


          {steps.map((step,index)=>{

            const Icon = step.icon;

            return (

              <motion.div

                key={step.title}

                initial={{
                  opacity:0,
                  y:50
                }}

                whileInView={{
                  opacity:1,
                  y:0
                }}

                transition={{
                  delay:index*0.15
                }}

                viewport={{
                  once:true
                }}

                className="bg-green-50 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"

              >


                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-600 text-white">

                  <Icon size={40}/>

                </div>



                <h3 className="mt-6 text-2xl font-bold text-green-700">
                  {step.title}
                </h3>


                <p className="mt-4 text-gray-600 leading-7">
                  {step.text}
                </p>


              </motion.div>

            );

          })}


        </div>


      </div>

    </section>
  );
}