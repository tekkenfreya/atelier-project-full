# Animation & Interaction Patterns
> Reference projects: beautyProject-webapp, polite-chaos, house-of-epochs, orbit-matter

## GSAP Usage (Next.js + React)

**Import & Registration — per component file:**
```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
```

**Preferred: useGSAP hook (from @gsap/react):**
```typescript
useGSAP(() => {
  // All GSAP code here — automatically scoped and cleaned up
  gsap.to(element, { opacity: 1, scrollTrigger: { trigger: element, start: "top 85%", once: true } });
  return () => { splitInstance?.revert(); }; // extra cleanup if needed
}, { scope: containerRef, dependencies: [] });
```

**Alternative: gsap.context (when useGSAP is not available):**
```typescript
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ }, containerRef);
  return () => ctx.revert();
}, []);
```

**ScrollTrigger rules:**
- Above-the-fold elements: animate immediately with NO ScrollTrigger, gated by a `reveal` state or delay
- Below-the-fold elements: create animation `paused: true`, attach `ScrollTrigger.create({ once: true })`
- NEVER set `opacity: 0` on visible-in-viewport elements with ScrollTrigger — they won't trigger
- Use `scrub: true` for scroll-linked animations (parallax, progress bars)
- Use `pin: true` for pinned sections
- Use `gsap.matchMedia()` for responsive animations — different animations at different breakpoints

**Text animations (SplitText):**
```typescript
const split = SplitText.create(element, { type: "lines", mask: "lines", linesClass: "line++" });
gsap.set(split.lines, { y: "100%" });
gsap.to(split.lines, { y: "0%", duration: 1, stagger: 0.1, ease: "power4.out" });
// ALWAYS revert in cleanup: split.revert()
```

**Stagger patterns:**
- Sequential: `stagger: 0.05`
- Random: `stagger: { each: 0.035, from: "random" }`
- Grid (for transitions): `stagger: { grid: [rows, cols], from: "center", each: 0.05 }`

**Standard eases:**
- `power4.out` — reveals, text entrance
- `power3.out` — moderate ease-out
- `expo.inOut` — dramatic page transitions
- `none` — linear (marquees, continuous loops)

**Cleanup — MANDATORY:**
- Kill ScrollTrigger instances
- Revert SplitText instances
- Kill timelines
- Cancel animation frames
- Revert matchMedia instances
- Remove event listeners

**DON'T:**
- Create animations outside `useGSAP` or `gsap.context()`
- Forget cleanup — ScrollTriggers leak and fire on wrong elements after navigation
- Set `opacity: 0` on above-the-fold content with ScrollTrigger
- Use `useLayoutEffect` — use `useEffect` or `useGSAP` in Next.js App Router

## Lenis (Smooth Scroll)

**Setup: ReactLenis provider in ClientLayout:**
```typescript
import { ReactLenis } from "lenis/react";

const EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
const MOBILE = { duration: 0.8, smoothTouch: true, touchMultiplier: 1.5, lerp: 0.09, easing: EASING, smoothWheel: true, syncTouch: true };
const DESKTOP = { duration: 1.2, smoothTouch: false, touchMultiplier: 2, lerp: 0.1, easing: EASING, smoothWheel: true, syncTouch: true };

<ReactLenis root options={isMobile ? MOBILE : DESKTOP}>{children}</ReactLenis>
```

**Access in components:** `const lenis = useLenis();`
**Pause/resume:** `lenis?.stop()` / `lenis?.start()` (use in menus, preloaders, modals)
**DO NOT** manually add `gsap.ticker` or `lenis.on("scroll", ScrollTrigger.update)` when using ReactLenis — it handles sync automatically

## Page Transitions (next-view-transitions)

**Architecture:** `ViewTransitions` wraps content inside a client layout component, NOT around `<html>`
```typescript
// ClientLayout.tsx
<ViewTransitions>
  <Navbar />
  {children}
</ViewTransitions>
```

**Transition hook:** use `useTransitionRouter` from `next-view-transitions`
**Scroll to top on route change:** handled in ClientLayout via `usePathname` + `window.scrollTo(0, 0)`

## CSS for Animations
- Use `will-change: transform` on animated elements (not on everything)
- Use `transform-style: preserve-3d` and `backface-visibility: hidden` for 3D text animations
- Use `clip-path: polygon()` for reveal animations
- Remove `will-change` after animation completes when possible

## Native Drag-and-Drop
- Use native HTML drag events (`onDragStart`, `onDragOver`, `onDrop`) — no external drag libraries
- Always provide keyboard fallback (ArrowUp/ArrowDown with `e.preventDefault()`) for accessibility

## Multi-Step Form Navigation
- Section transition screens display only on forward navigation — back navigation skips them and goes directly to the previous question
- Components that render with a default value (e.g., DragRank defaulting to options order) must call `onChange` on mount to sync parent state
