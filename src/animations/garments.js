import { gsap, ScrollTrigger, BREAKPOINTS } from "../lib/gsap.js";

/** Standalone editorial moments (not the wide pinned one, not the gallery). */
function initStandardMoments(withParallax) {
  const moments = gsap.utils.toArray(".moment:not(.wide)");

  moments.forEach((moment, i) => {
    const media = moment.querySelector(".moment-media");
    // Either the abstract placeholder's .cloth div, or a real photo's img —
    // whichever this moment actually has gets the slow scroll-zoom.
    const cloth = moment.querySelector(".cloth, .figure.photo img");
    const captionItems = moment.querySelectorAll(
      ".moment-caption > *:not(.moment-name)"
    );
    const fromRight = moment.classList.contains("reverse");

    gsap.set(media, { autoAlpha: 0, scale: 1.1, x: fromRight ? 36 : -36 });
    gsap.set(captionItems, { autoAlpha: 0, y: 16 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: moment, start: "top 78%", once: true },
      defaults: { ease: "power4.out" },
    });
    tl.to(media, { autoAlpha: 1, scale: 1, x: 0, duration: 1.2 })
      .to(captionItems, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.25);

    if (withParallax) {
      // A slow, continuous zoom on the fabric study itself while the
      // moment passes through the viewport — the "camera never stops"
      // feel, kept subtle (1 → 1.12) so it reads as ambient, not showy.
      gsap.fromTo(
        cloth,
        { scale: 1 },
        {
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: moment, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      // Caption and media drift at slightly different rates for depth.
      gsap.fromTo(
        media,
        { yPercent: -4 },
        { yPercent: 4, ease: "none", scrollTrigger: { trigger: moment, start: "top bottom", end: "bottom top", scrub: true } }
      );
      gsap.fromTo(
        moment.querySelector(".moment-caption"),
        { yPercent: 3 },
        { yPercent: -3, ease: "none", scrollTrigger: { trigger: moment, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }
  });
}

/** The one "fixed section while content changes" moment: pins, zooms the
 * fabric study dramatically, and swaps in a second caption line mid-pin —
 * reserved for a single centerpiece so the technique still reads as a
 * deliberate beat, not wallpaper. Desktop/tablet only: mobile browsers
 * resize their viewport as chrome shows/hides while scrolling, which makes
 * pinned sections jump — not worth it for one section, so mobile gets the
 * simpler non-pinned treatment below instead. */
function initWideMomentPinned() {
  const moment = document.querySelector(".moment.wide");
  if (!moment) return;
  const cloth = moment.querySelector(".cloth, .figure.photo img");
  const meta = moment.querySelector(".moment-meta");

  gsap.set(meta, { autoAlpha: 0, y: 10 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: moment,
      start: "top top",
      end: "+=120%",
      // true — see hero.js for why a numeric scrub here (stacked on top of
      // Lenis's own smoothing) was causing the hard snap into the next
      // section right as this pin released.
      scrub: true,
      pin: true,
      anticipatePin: 1,
    },
  });

  tl.fromTo(cloth, { scale: 1 }, { scale: 1.35, ease: "none" }, 0).to(
    meta,
    { autoAlpha: 1, y: 0, duration: 0.2, ease: "none" },
    0.55
  );
}

function initWideMomentSimple() {
  const moment = document.querySelector(".moment.wide");
  if (!moment) return;
  const media = moment.querySelector(".moment-media");
  const meta = moment.querySelector(".moment-meta");

  gsap.set(media, { autoAlpha: 0, scale: 1.08 });
  gsap.set(meta, { autoAlpha: 0, y: 12 });

  gsap
    .timeline({ scrollTrigger: { trigger: moment, start: "top 78%", once: true }, defaults: { ease: "power4.out" } })
    .to(media, { autoAlpha: 1, scale: 1, duration: 1.1 })
    .to(meta, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.3);
}

export function initGarments() {
  const mm = gsap.matchMedia();

  mm.add(BREAKPOINTS.motionReduced, () => {
    gsap.set(".moment-media, .moment-caption > *", { clearProps: "all", opacity: 1 });
  });

  mm.add({ motionOK: BREAKPOINTS.motionOK, notMobile: `not ${BREAKPOINTS.mobile}` }, (context) => {
    if (!context.conditions.motionOK) return;
    initStandardMoments(context.conditions.notMobile);
    if (context.conditions.notMobile) {
      initWideMomentPinned();
    } else {
      initWideMomentSimple();
    }
  });
}
