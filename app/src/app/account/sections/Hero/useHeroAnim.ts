"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const smoothStep = (p: number) => p * p * (3 - 2 * p);

export function useHeroAnim(heroRef: RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    if (!ready || !heroRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = heroRef.current;
    const cards = Array.from(hero.querySelectorAll<HTMLElement>(".rh-deck .rh-card"));
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(hero, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });

      gsap.set(cards, { transformOrigin: "center center", scale: 0 });
      gsap.to(cards, {
        scale: 1,
        duration: 0.75,
        delay: 0.25,
        stagger: 0.1,
        ease: "power4.out",
        onComplete: () => {
          if (cards[0]) gsap.set(cards[0], { transformOrigin: "top right" });
          if (cards[2]) gsap.set(cards[2], { transformOrigin: "top left" });
        },
      });

      if (window.innerWidth > 1000) {
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "75% top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const deck = hero.querySelector<HTMLElement>(".rh-deck");
            if (deck) {
              gsap.set(deck, { opacity: gsap.utils.interpolate(1, 0.5, smoothStep(progress)) });
            }

            cards.forEach((card, index) => {
              const delay = index * 0.9;
              const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1));
              const y = gsap.utils.interpolate("0%", "400%", smoothStep(cardProgress));
              const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));

              let x = "0%";
              let rotation = 0;
              if (index === 0) {
                x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
                rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
              } else if (index === 2) {
                x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress));
                rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
              }

              gsap.set(card, { y, x, rotation, scale });
            });
          },
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [heroRef, ready]);
}
