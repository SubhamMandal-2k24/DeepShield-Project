import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

function Counter({ to, suffix = "", label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, to, {
        duration: 1.6,
        ease: "easeOut",
        onUpdate: (v) => setValue(Math.floor(v)),
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return (
    <motion.div
      ref={ref}
      className="stat-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="stat-number">
        {value}
        {suffix}
      </h2>
      <p className="stat-label">{label}</p>
    </motion.div>
  );
}

export default Counter;