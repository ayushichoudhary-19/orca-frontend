"use client";

import styles from "@/styles/loader.module.css";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className={styles.globalloader}>
        <label className="mb-2 block text-gray-600 text-sm">Please wait...</label>
        <div className={styles.globalloading}></div>
      </div>
    </div>
  );
}
