"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useFadeInSection(sectionRef: RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        section,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", paused: true },
      );
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        animation: anim,
        once: true,
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, ready]);
}
