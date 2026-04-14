"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const smoothStep = (p: number) => p * p * (3 - 2 * p);

/**
 * Single pinned ScrollTrigger (6 viewport heights) — ALL phases run during pin.
 *
 *   0.00 – 0.18  enter: fall in from top, fanned out, scale up
 *   0.18 – 0.30  settle: y → 0, scale → 1
 *   0.30 – 0.45  converge + first flip (rotY 0 → 180, ingredients visible)
 *   0.45 – 0.60  dwell: ingredients readable
 *   0.60 – 0.72  flip back to SVG bottles (rotY 180 → 360)
 *   0.72 – 1.00  fan out + rotate + fall (hero-exit pattern → into Botanicals)
 */
export function useRitualDetailAnim(sectionRef: RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth <= 1000) return;

    const section = sectionRef.current;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".rd-card"));
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 6}px`,
        pin: true,
        pinSpacing: true,
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 6}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const headerProgress = gsap.utils.clamp(0, 1, progress / 0.35);
          const header = section.querySelector<HTMLElement>(".rd-header");
          if (header) {
            gsap.set(header, { y: gsap.utils.interpolate("300%", "0%", smoothStep(headerProgress)) });
          }

          cards.forEach((card, index) => {
            const delay = index * 0.3;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.04) / (0.96 - delay * 0.04));
            const innerCard = card.querySelector<HTMLElement>(".rd-card-inner");

            const fannedX = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
            const fannedRot = index === 0 ? -5 : index === 1 ? 0 : 5;

            let y: string;
            let scale: number;
            let opacity: number;
            let x: string;
            let rotate: number;
            let rotationY: number;

            if (cardProgress < 0.18) {
              const n = cardProgress / 0.18;
              y = gsap.utils.interpolate("-100%", "50%", smoothStep(n));
              scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(n));
              opacity = cardProgress < 0.09 ? smoothStep(cardProgress / 0.09) : 1;
              x = fannedX;
              rotate = fannedRot;
              rotationY = 0;
            } else if (cardProgress < 0.3) {
              const n = (cardProgress - 0.18) / 0.12;
              y = gsap.utils.interpolate("50%", "0%", smoothStep(n));
              scale = gsap.utils.interpolate(0.75, 1, smoothStep(n));
              opacity = 1;
              x = fannedX;
              rotate = fannedRot;
              rotationY = 0;
            } else if (cardProgress < 0.45) {
              const n = (cardProgress - 0.3) / 0.15;
              y = "0%";
              scale = 1;
              opacity = 1;
              x = gsap.utils.interpolate(fannedX, "0%", smoothStep(n));
              rotate = gsap.utils.interpolate(fannedRot, 0, smoothStep(n));
              rotationY = smoothStep(n) * 180;
            } else if (cardProgress < 0.6) {
              y = "0%";
              scale = 1;
              opacity = 1;
              x = "0%";
              rotate = 0;
              rotationY = 180;
            } else if (cardProgress < 0.72) {
              const n = (cardProgress - 0.6) / 0.12;
              y = "0%";
              scale = 1;
              opacity = 1;
              x = "0%";
              rotate = 0;
              rotationY = 180 + smoothStep(n) * 180;
            } else {
              const n = (cardProgress - 0.72) / 0.28;
              const t = smoothStep(n);
              y = gsap.utils.interpolate("0%", "400%", t);
              scale = gsap.utils.interpolate(1, 0.75, t);
              opacity = n < 0.7 ? 1 : gsap.utils.interpolate(1, 0, smoothStep((n - 0.7) / 0.3));
              if (index === 0) {
                x = gsap.utils.interpolate("0%", "90%", t);
                rotate = gsap.utils.interpolate(0, -15, t);
              } else if (index === 2) {
                x = gsap.utils.interpolate("0%", "-90%", t);
                rotate = gsap.utils.interpolate(0, 15, t);
              } else {
                x = "0%";
                rotate = 0;
              }
              rotationY = 360;
            }

            gsap.set(card, { opacity, y, x, rotate, scale });
            if (innerCard) gsap.set(innerCard, { rotationY });
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, ready]);
}
