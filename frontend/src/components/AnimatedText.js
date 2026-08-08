import React from "react";
import { motion } from "framer-motion";

function AnimatedText({ children, as = "div", delay = 0, className = "" }) {
  const Tag = motion[as] || motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
}

export default AnimatedText;