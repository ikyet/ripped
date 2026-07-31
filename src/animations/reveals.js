import { gsap, ScrollTrigger, SplitText, BREAKPOINTS } from "../lib/gsap.js";

/** Any heading/line copy marked data-split="lines" rises from a masked
 * baseline as it enters view — used for the statement, moment names, and
 * the gallery head. */
function initLineReveals() {
  gsap.utils.toArray('[data-split="lines"]').forEach((el) => {
    const split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
    gsap.set(split.lines, { yPercent: 110 });
    gsap.to(split.lines, {
      yPercent: 0,
      duration: 1,
      stagger: 0.09,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

function initFooterReveal() {
  const els = gsap.utils.toArray('[data-reveal="footer"]');
  if (!els.length) return;
  gsap.set(els, { y: 20 });
  gsap.to(els, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.08,
    ease: "power3.out",
    scrollTrigger: { trigger: els[0], start: "top 90%", once: true },
  });
}

export function initReveals() {
  const mm = gsap.matchMedia();

  mm.add(BREAKPOINTS.motionReduced, () => {
    gsap.set('[data-split="lines"], [data-reveal="footer"]', { clearProps: "all", opacity: 1 });
  });

  mm.add(BREAKPOINTS.motionOK, () => {
    initLineReveals();
    initFooterReveal();
  });
}
