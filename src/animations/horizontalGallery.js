import { gsap, ScrollTrigger, BREAKPOINTS, prefersReducedMotion } from "../lib/gsap.js";

/**
 * Desktop/tablet: a vertical-scroll-driven horizontal rail, pinned for the
 * length of the track.
 *
 * Mobile got this too for a moment, but a pinned rail dragging six wide
 * items across a narrow viewport reads as stuck/laggy rather than smooth —
 * there just isn't enough screen width for the effect to pay off the way
 * it does on desktop. Mobile now falls back to a plain two-column grid
 * (see style.css) that flows with the page like the rest of the site,
 * with a quiet fade-in instead of the pin.
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

    return () => st?.kill();
  });

  mm.add(BREAKPOINTS.mobile, () => {
    const items = gsap.utils.toArray(".gallery-item", track);
    gsap.set(items, { opacity: 0, y: 24, scale: 1 });

    const triggers = ScrollTrigger.batch(items, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }),
    });

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(items, { clearProps: "all" });
    };
  });
}
