"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";


export default function FloatingWhatsApp() {

  return (

    <motion.a

      href="https://wa.me/919150852830"

      target="_blank"

      initial={{
        scale:0
      }}

      animate={{
        scale:1
      }}

      transition={{
        duration:0.5
      }}


      className="
      fixed
      bottom-6
      right-6
      z-50
      bg-green-600
      hover:bg-green-700
      text-white
      w-16
      h-16
      rounded-full
      flex
      items-center
      justify-center
      shadow-2xl
      "

    >


      <motion.div

        animate={{
          scale:[1,1.15,1]
        }}

        transition={{
          duration:2,
          repeat:Infinity
        }}

      >

        <MessageCircle size={32}/>

      </motion.div>



    </motion.a>

  );

}