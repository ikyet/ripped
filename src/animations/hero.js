import { gsap, ScrollTrigger, Flip, SplitText, BREAKPOINTS, prefersReducedMotion } from "../lib/gsap.js";

export function initHero() {
  const hero = document.querySelector(".hero");
  const wordmark = document.getElementById("hero-wordmark");
  const navLogo = document.getElementById("nav-logo");
  const kicker = document.querySelector(".hero-kicker");
  const figure = document.querySelector(".hero-figure");
  const scrollCue = document.querySelector(".hero-scroll");
  if (!hero || !wordmark) return;

  if (prefersReducedMotion()) {
    gsap.set([wordmark, kicker, figure], { opacity: 1 });
    gsap.set(navLogo, { opacity: 1 });
    return;
  }

  // Entrance: the wordmark builds in letter by letter — the one place a
  // character-level split earns its cost, since it's the brand's single
  // moment of introduction.
  const split = new SplitText(wordmark, { type: "chars" });
  gsap.set(wordmark, { opacity: 1 });
  gsap.set(split.chars, { yPercent: 130, opacity: 0 });
  gsap.set([kicker, figure, scrollCue], { opacity: 0, y: 14 });

  const intro = gsap.timeline({ delay: 0.2, defaults: { ease: "power4.out" } });
  intro
    .to(split.chars, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.045 })
    .to(kicker, { opacity: 1, y: 0, duration: 0.7 }, 0.15)
    .to(figure, { opacity: 1, y: 0, duration: 1 }, 0.35)
    .to(scrollCue, { opacity: 1, y: 0, duration: 0.6 }, 0.9)
    .call(() => split.revert());

  const mm = gsap.matchMedia();

  // Desktop/tablet: the wordmark visually shrinks and slides into the nav
  // logo's exact position as the hero pins and releases — a Flip-driven
  // transform, not two elements crossfading in place.
  mm.add(BREAKPOINTS.desktop, buildMorph);
  mm.add(BREAKPOINTS.tablet, buildMorph);

  function buildMorph() {
    const tl = gsap.timeline();
    const fit = Flip.fit(wordmark, navLogo, { scale: true, duration: 1, ease: "none" });
    fit.pause(0);

    // fromTo with explicit start values (not .to()'s implicit "current
    // value") so this renders correctly even if ScrollTrigger's first
    // render happens before the entrance timeline has run — e.g. a user
    // reloading mid-scroll, where the browser restores scroll position
    // ahead of the intro animation.
    tl.add(fit, 0)
      .fromTo([kicker, figure, scrollCue], { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: 1, ease: "none" }, 0)
      .fromTo(wordmark, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: "none" }, 0.8)
      .fromTo(navLogo, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, 0.8);

    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=65%",
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      animation: tl,
    });

    return () => st.kill();
  }

  // Mobile: no pin (pinning the full hero on small viewports fights the
  // scroll feel more than it pays off) — the wordmark simply scrolls off
  // while the nav logo fades in on a plain scroll trigger.
  mm.add(BREAKPOINTS.mobile, () => {
    gsap.set(wordmark, { opacity: 1 });
    const st = ScrollTrigger.create({
      trigger: hero,
      start: "bottom 85%",
      end: "bottom 40%",
      scrub: 0.6,
      onUpdate: (self) => gsap.set(navLogo, { opacity: self.progress }),
    });
    return () => st.kill();
  });
}
