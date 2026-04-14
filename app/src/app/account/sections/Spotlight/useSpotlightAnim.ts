"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSpotlightAnim(sectionRef: RefObject<HTMLElement | null>, ready: boolean) {
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const images = section.querySelector<HTMLElement>(".sp-images");
    const mask = section.querySelector<HTMLElement>(".sp-mask");
    const maskImage = section.querySelector<HTMLElement>(".sp-mask-image");
    const words = Array.from(section.querySelectorAll<HTMLElement>(".sp-word"));

    if (!images || !mask || !maskImage) return;

    const imagesHeight = images.offsetHeight;
    const viewportHeight = window.innerHeight;
    const initialOffset = imagesHeight * 0.05;
    const totalMovement = imagesHeight + initialOffset + viewportHeight;

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 7}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress <= 0.5) {
            const animationProgress = progress / 0.5;
            const startY = 5;
            const endY = -(totalMovement / imagesHeight) * 100;
            const currentY = startY + (endY - startY) * animationProgress;
            gsap.set(images, { y: `${currentY}%` });
          }

          if (progress >= 0.25 && progress <= 0.75) {
            const maskProgress = (progress - 0.25) / 0.5;
            const maskSize = `${maskProgress * 475}%`;
            const imageScale = 1.25 - maskProgress * 0.25;
            mask.style.setProperty("-webkit-mask-size", maskSize);
            mask.style.setProperty("mask-size", maskSize);
            gsap.set(maskImage, { scale: imageScale });
          } else if (progress < 0.25) {
            mask.style.setProperty("-webkit-mask-size", "0%");
            mask.style.setProperty("mask-size", "0%");
            gsap.set(maskImage, { scale: 1.25 });
          } else if (progress > 0.75) {
            mask.style.setProperty("-webkit-mask-size", "475%");
            mask.style.setProperty("mask-size", "475%");
            gsap.set(maskImage, { scale: 1 });
          }

          if (words.length > 0) {
            if (progress >= 0.75 && progress <= 0.95) {
              const textProgress = (progress - 0.75) / 0.2;
              words.forEach((word, index) => {
                const threshold = index / words.length;
                gsap.set(word, { opacity: textProgress >= threshold ? 1 : 0 });
              });
            } else if (progress < 0.75) {
              gsap.set(words, { opacity: 0 });
            } else {
              gsap.set(words, { opacity: 1 });
            }
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef, ready]);
}
