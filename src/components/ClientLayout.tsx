"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ViewTransitions } from "next-view-transitions";
import Navbar from "@/components/Navbar";

const SETTLE_DELAY = 1400;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const firstLoad = useRef(true);
  const route = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    const id = setTimeout(() => {
      window.dispatchEvent(new Event("viewTransitionComplete"));
    }, SETTLE_DELAY);

    return () => clearTimeout(id);
  }, [route]);

  return (
    <ViewTransitions>
      <Navbar />
      {children}
    </ViewTransitions>
  );
}
