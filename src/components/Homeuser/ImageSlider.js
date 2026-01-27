import React from "react";
import { motion } from "framer-motion";
import Homecard from "./Homecard";

const ImageSlider = () => {
  const scrollSpeed = 30; // duration in seconds

  return (
    <div className="overflow-hidden w-full py-6">
      <motion.div
        className="flex gap-6"
        style={{ width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: scrollSpeed,
            ease: "linear",
          },
        }}
      >
        {/* Duplicate the cards for seamless looping */}
        <Homecard isSlider />
      </motion.div>
    </div>
  );
};

export default ImageSlider;
