import { gsap, ScrollTrigger, BREAKPOINTS, prefersReducedMotion } from "../lib/gsap.js";

/**
 * Desktop/tablet: a vertical-scroll-driven horizontal rail, pinned for the
 * length of the track. Mobile skips the pin entirely — see style.css,
 * where `.gallery-track` becomes a native swipeable snap-scroller there
 * instead of trying to fake horizontal scroll through vertical input on a
 * touch device.
 */
export function initHorizontalGallery() {
  const gallery = document.querySelector(".gallery");
  const track = document.getElementById("gallery-track");
  if (!gallery || !track) return;

  if (prefersReducedMotion()) return;

  const mm = gsap.matchMedia();

  mm.add({ notMobile: `not ${BREAKPOINTS.mobile}` }, (context) => {
    if (!context.conditions.notMobile) return;

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
        scrub: 0.6,
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

    return () => st?.kill();
  });

  // Mobile: a quiet entrance for the section head only — the strip itself
  // relies on native touch scrolling (see style.css).
  mm.add(BREAKPOINTS.mobile, () => {
    gsap.set(".gallery-item", { opacity: 1 });
  });
}
