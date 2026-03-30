"use client";

import { useTransitionRouter } from "next-view-transitions";

const DURATION = 1200;
const EASE = "cubic-bezier(0.87, 0, 0.13, 1)";

function runPageSwap() {
  document.documentElement.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0.2, transform: "translateY(-25%)" },
    ],
    {
      duration: DURATION,
      easing: EASE,
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );
  document.documentElement.animate(
    [
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        transform: "translateY(15%)",
      },
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        transform: "translateY(0%)",
      },
    ],
    {
      duration: DURATION,
      easing: EASE,
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

export function usePageTransition() {
  const router = useTransitionRouter();

  function go(href: string) {
    if (typeof window !== "undefined" && window.location.pathname === href) return;
    router.push(href, { onTransitionReady: runPageSwap });
  }

  return { go, router };
}
