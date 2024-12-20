"use client";

import { motion } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";
import { AuroraBackground } from "./components/ui/aurora-background";
const Home = () => {

  const router = useRouter();

  const navigateToStaking = () => {
    router.push("/staking");
  };
  return (
    <AuroraBackground>
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4"
    >
      <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Maximize Your Crypto Potential With Staking 
      </div>
     
      <button
        onClick={navigateToStaking}
      className=" dark:bg-white rounded-full w-fit text-white dark:text-black px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500">
        Stake now
      </button>
    </motion.div>
  </AuroraBackground>
  )
}

export default Home
