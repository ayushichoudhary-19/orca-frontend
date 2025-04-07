"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "@/styles/loader.module.css";

export function CountdownOverlay({
  seconds = 8,
  onComplete,
}: {
  seconds?: number;
  onComplete: () => void;
}) {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    if (countdown === 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 h-full flex items-center justify-center"
      style={{
        zIndex: 1000,
        width: "100%",
        backgroundColor: "#f9fcfe",
      }}
    >
      <motion.div
        className="text-center p-6 rounded-xl w-full h-full flex flex-col items-center justify-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
       <div className={styles.loader}>
    <span></span>
</div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: "#000000",
            fontWeight: "600",
            marginBottom: "2px",
            lineHeight: "24px",
          }}
          transition={{ delay: 0.3 }}
        >
          Finding your next best lead
        </motion.h3>
        
        <motion.p
          style={{
            color: "gray",
            fontWeight: "400",
            marginTop: "2px",
            fontSize: "14px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          This may take few seconds
        </motion.p>
      </motion.div>
    </motion.div>
  );
}