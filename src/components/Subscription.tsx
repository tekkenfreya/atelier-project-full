"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Subscription() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [labelRef.current, titleRef.current, descRef.current, ctaRef.current, noteRef.current];

      elements.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { y: 20 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="subscription" id="ritual" ref={sectionRef}>
      <p className="subscription-label" ref={labelRef}>
        Subscribe & Save
      </p>
      <h2 className="subscription-title" ref={titleRef}>
        Your Ritual, Delivered
      </h2>
      <p className="subscription-desc" ref={descRef}>
        Never run out. Receive your complete personalised routine every two
        months, with 20% off every order and free shipping. Pause or cancel
        anytime.
      </p>
      <button className="subscription-cta" ref={ctaRef}>
        Build Your Routine, Save 20%
      </button>
      <p className="subscription-note" ref={noteRef}>
        Full routine from €92/shipment · Free shipping · Cancel anytime
      </p>
    </section>
  );
}
