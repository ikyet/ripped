import { gsap, BREAKPOINTS } from "../lib/gsap.js";

/** Every garment moment gets the same treatment — a directional fade/scale
 * entrance, plus (desktop/tablet only) a slow ambient Ken-Burns zoom and a
 * light parallax drift between image and caption while it's in view. */
function initStandardMoments(withParallax) {
  const moments = gsap.utils.toArray(".moment");

  moments.forEach((moment) => {
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

export function initGarments() {
  const mm = gsap.matchMedia();

  mm.add(BREAKPOINTS.motionReduced, () => {
    gsap.set(".moment-media, .moment-caption > *", { clearProps: "all", opacity: 1 });
  });

  mm.add({ motionOK: BREAKPOINTS.motionOK, notMobile: `not ${BREAKPOINTS.mobile}` }, (context) => {
    if (!context.conditions.motionOK) return;
    initStandardMoments(context.conditions.notMobile);
  });
}
