"use client";

import dynamic from "next/dynamic";

const SalesRepAuthPage = dynamic(() => import("@/components/Auth/SDR/SalesRepAuthPage"), {
  ssr: false,
});

export default function SalesRepAuth() {
  return <SalesRepAuthPage />;
}
