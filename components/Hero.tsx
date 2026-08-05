"use client";

import Image from "next/image";
import { motion } from "framer-motion";


export default function Hero() {

  return (

    <section
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
      }}
    >


      {/* Background Overlay */}

      <div className="absolute inset-0 bg-white/50"></div>



      <div
        className="
        relative z-10 
        max-w-7xl 
        mx-auto 
        px-5 md:px-6
        pt-32 pb-16
        md:pt-36 md:pb-20
        grid md:grid-cols-2
        gap-10
        items-center
        min-h-screen
        "
      >



        {/* Left Glass Content */}


        <motion.div

          initial={{
            opacity:0,
            x:-60
          }}

          animate={{
            opacity:1,
            x:0
          }}

          transition={{
            duration:0.8
          }}


          className="
          bg-white/40
          backdrop-blur-lg
          rounded-3xl
          p-6 md:p-10
          shadow-2xl
          "

        >



          <p className="text-green-700 font-semibold text-lg md:text-xl">

            🌿 M Fresh Dairy

          </p>




          <h1
            className="
            mt-4
            text-4xl
            md:text-7xl
            font-extrabold
            text-green-900
            leading-tight
            "
          >

            Fresh Cow Milk

          </h1>




          <h2
            className="
            mt-5
            text-2xl
            md:text-3xl
            font-semibold
            text-gray-800
            "
          >

            Pure Taste From Healthy Farms

          </h2>




          <p
            className="
            mt-6
            text-lg
            md:text-xl
            text-gray-700
            max-w-lg
            "
          >

            100% Pure • Natural • Fresh Every Morning.

            <br />

            Farm Fresh Milk Delivered Directly To Your Doorstep.

          </p>





          {/* Buttons */}


          <div className="mt-8 flex flex-wrap gap-4">


            <button
              className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-8
              py-4
              rounded-full
              font-semibold
              shadow-lg
              transition
              "
            >

              Subscribe Now

            </button>




            <button
              className="
              bg-white
              border
              border-green-600
              text-green-700
              hover:bg-green-50
              px-8
              py-4
              rounded-full
              font-semibold
              shadow-lg
              transition
              "
            >

              WhatsApp Order

            </button>


          </div>





          {/* Highlights */}


          <div className="mt-10 flex gap-6 md:gap-8">


            <div>

              <h3 className="text-2xl md:text-3xl font-bold text-green-700">

                100%

              </h3>

              <p className="text-gray-700">

                Pure Milk

              </p>

            </div>




            <div>

              <h3 className="text-2xl md:text-3xl font-bold text-green-700">

                Fresh

              </h3>

              <p className="text-gray-700">

                Every Morning

              </p>

            </div>




            <div>

              <h3 className="text-2xl md:text-3xl font-bold text-green-700">

                Farm

              </h3>

              <p className="text-gray-700">

                Direct Supply

              </p>

            </div>


          </div>



        </motion.div>






        {/* Milk Bottle Animation */}



        <motion.div


          initial={{
            opacity:0,
            scale:0.8
          }}


          animate={{
            opacity:1,
            y:[0,-20,0]
          }}


          transition={{

            opacity:{
              duration:1
            },

            y:{
              duration:4,
              repeat:Infinity,
              ease:"easeInOut"
            }

          }}



          className="
          flex
          justify-center
          mt-10
          md:mt-0
          "


        >




          <Image

            src="/images/milk-bottle.png"

            alt="Fresh Cow Milk"

            width={420}

            height={700}

            priority


            className="
            drop-shadow-2xl
            hover:scale-105
            transition
            duration-500
            w-[280px]
            md:w-[420px]
            h-auto
            "

          />



        </motion.div>



      </div>


    </section>

  );

}