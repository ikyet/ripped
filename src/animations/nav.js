import { gsap } from "../lib/gsap.js";

export function initNav() {
  const nav = document.getElementById("nav");
  const navLogo = document.getElementById("nav-logo");
  if (!nav) return;

  // The nav logo stays invisible until the hero morph (see hero.js) hands
  // off to it — starting it hidden here keeps that module the single
  // source of truth for when the swap happens.
  gsap.set(navLogo, { opacity: 0 });

  gsap.from(".nav-right", {
    opacity: 0,
    y: -12,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.3,
  });
}
