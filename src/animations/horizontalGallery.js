import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap.js";

/**
 * A vertical-scroll-driven horizontal rail, pinned for the length of the
 * track — runs on every breakpoint, including mobile. Pin used to be
 * desktop/tablet-only because a pinned section can jump when the mobile
 * browser's address bar shows/hides mid-scroll and triggers a recalculation;
 * `ScrollTrigger.config({ ignoreMobileResize: true })` (see lib/gsap.js)
 * neutralizes that specific trigger, which is what makes pinning safe to
 * run here on phones too.
 */
export function initHorizontalGallery() {
  const gallery = document.querySelector(".gallery");
  const track = document.getElementById("gallery-track");
  if (!gallery || !track) return;

  if (prefersReducedMotion()) return;

  let st;

  const build = () => {
    const distance = track.scrollWidth - gallery.clientWidth;
    if (distance <= 0) return;

    const tween = gsap.to(track, { x: -distance, ease: "none" });
    const items = gsap.utils.toArray(".gallery-item", track);

    st = ScrollTrigger.create({
      trigger: gallery,
      start: "top top",
      end: () => `+=${distance}`,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      animation: tween,
      invalidateOnRefresh: true,
      onUpdate: () => {
        const center = window.innerWidth / 2;
        items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.left + rect.width / 2;
          const proximity = 1 - Math.min(Math.abs(itemCenter - center) / center, 1);
          gsap.set(item, { scale: 0.94 + proximity * 0.06, opacity: 0.6 + proximity * 0.4 });
        });
      },
    });
  };

  build();
}
