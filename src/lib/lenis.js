import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap.js";

let lenis = null;

// Two independent signals, either one enough to opt out of Lenis: a coarse
// pointer (the reliable "this is a touchscreen" check on real devices) or a
// narrow viewport (a phone-width fallback in case pointer/hover media
// features aren't reported the way a given browser context expects).
const isTouchDevice = () =>
  window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
  window.matchMedia("(max-width: 640px)").matches;

/**
 * Creates the Lenis smooth-scroll instance and wires it into GSAP's ticker
 * so ScrollTrigger reads Lenis's virtual scroll position instead of the
 * raw (stepped) native scroll — this is what keeps scrubbed animations
 * perfectly in sync with the smoothed scroll feel.
 *
 * Skipped under prefers-reduced-motion (native scroll stays in control and
 * ScrollTrigger listens to it directly) and on touch devices — phones are
 * where a smooth-scroll library fighting the browser's own touch handling
 * is most likely to make scrolling feel unresponsive, so native wins there
 * every time rather than risking that for a polish effect.
 */
export function initSmoothScroll() {
  if (prefersReducedMotion() || isTouchDevice()) return null;

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

  // Keep Lenis's own scroll-limit calculations in sync whenever
  // ScrollTrigger recalculates (e.g. once a lazy-loaded image settles its
  // final size) — a stale Lenis limit vs. a fresh ScrollTrigger one is
  // another way pinned sections can end up jumping.
  ScrollTrigger.addEventListener("refresh", () => lenis?.resize());

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
