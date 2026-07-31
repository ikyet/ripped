import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap.js";

let lenis = null;

/**
 * Creates the Lenis smooth-scroll instance and wires it into GSAP's ticker
 * so ScrollTrigger reads Lenis's virtual scroll position instead of the
 * raw (stepped) native scroll — this is what keeps scrubbed animations
 * perfectly in sync with the smoothed scroll feel.
 *
 * Skipped entirely under prefers-reduced-motion: native scroll stays in
 * control and ScrollTrigger falls back to listening to it directly.
 */
export function initSmoothScroll() {
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    touchMultiplier: 1.2,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroySmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(lenis.raf);
  lenis.destroy();
  lenis = null;
}
