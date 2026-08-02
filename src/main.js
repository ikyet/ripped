import "./style.css";

import { gsap, ScrollTrigger } from "./lib/gsap.js";
import { initSmoothScroll } from "./lib/lenis.js";
import { initNav } from "./animations/nav.js";
import { initHero } from "./animations/hero.js";
import { initReveals } from "./animations/reveals.js";
import { initGarments } from "./animations/garments.js";
import { initHorizontalGallery } from "./animations/horizontalGallery.js";
import { initShop } from "./animations/shop.js";

// The hero's entrance and its scroll-driven morph into the nav both assume
// they start from the top. `scrollRestoration` is already set to "manual"
// by an inline head script (before this deferred module even loads), but
// bfcache restores fire "pageshow" without a fresh script evaluation, so
// that path needs its own reset too.
window.scrollTo(0, 0);
window.addEventListener("pageshow", (e) => {
  if (e.persisted) window.scrollTo(0, 0);
});

// A single top-level context so the whole animation layer can be torn down
// and rebuilt with one call (e.g. from HMR during development) instead of
// leaking ScrollTriggers on every edit.
const app = gsap.context(() => {
  initSmoothScroll();
  initNav();
  initHero();
  initReveals();
  initGarments();
  initHorizontalGallery();
  initShop();
});

requestAnimationFrame(() => ScrollTrigger.refresh());
// Belt-and-suspenders: re-measure once everything (images included) has
// actually finished loading, in case any of that shifted a trigger's
// position before this first refresh had settled.
window.addEventListener("load", () => ScrollTrigger.refresh());

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    app.revert();
  });
}
