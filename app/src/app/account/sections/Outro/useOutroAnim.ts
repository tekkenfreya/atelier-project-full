"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STRIP_SPEEDS = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

export function useOutroAnim(sectionRef: RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const words = Array.from(section.querySelectorAll<HTMLElement>(".ot-word"));
    const strips = Array.from(section.querySelectorAll<HTMLElement>(".ot-strip"));

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 3}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (words.length === 0) return;

          if (progress >= 0.25 && progress <= 0.75) {
            const textProgress = (progress - 0.25) / 0.5;
            words.forEach((word, index) => {
              const threshold = index / words.length;
              gsap.set(word, { opacity: textProgress >= threshold ? 1 : 0 });
            });
          } else if (progress < 0.25) {
            gsap.set(words, { opacity: 0 });
          } else {
            gsap.set(words, { opacity: 1 });
          }
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: `+=${window.innerHeight * 6}px`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          strips.forEach((strip, index) => {
            const speed = STRIP_SPEEDS[index];
            if (speed === undefined) return;
            const movement = progress * 100 * speed;
            gsap.set(strip, { x: `${movement}%` });
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, ready]);
}
