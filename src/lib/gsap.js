import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

// Mobile browsers fire resize events when the address bar shows/hides
// during scroll; without this, ScrollTrigger recalculates trigger
// positions on every one of those and can make the page feel like it's
// fighting the scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

// Signature ease of the brand's motion language — a patient, gliding
// ease-out. Used anywhere an element settles into place.
export const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";
export const EASE_SOFT = "power2.out";

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shared matchMedia breakpoints so every animation module reads the same
// three buckets instead of re-declaring ad-hoc widths.
export const BREAKPOINTS = {
  mobile: "(max-width: 640px)",
  tablet: "(min-width: 641px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px)",
  motionOK: "(prefers-reduced-motion: no-preference)",
  motionReduced: "(prefers-reduced-motion: reduce)",
};

export { gsap, ScrollTrigger, Flip, SplitText };
