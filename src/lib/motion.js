import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis = null;
const HEADER_OFFSET = -72;

/** Smooth scrolling driven by GSAP's ticker, so Lenis and ScrollTrigger share one clock. */
export function initSmoothScroll() {
  if (prefersReducedMotion || lenis) return null;

  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.3,
  });

  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time) => lenis && lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis && lenis.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (target !== 0 && !el) return;

  const { immediate = false, ...rest } = options;
  if (lenis) {
    lenis.scrollTo(target === 0 ? 0 : el, {
      offset: target === 0 ? 0 : HEADER_OFFSET,
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      immediate,
      force: immediate,
      ...rest,
    });
    return;
  }
  const behavior = immediate || prefersReducedMotion ? 'auto' : 'smooth';
  if (target === 0) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
  window.scrollTo({ top, behavior });
}

/** Jump to the top with no animation (used between pages, under the transition). */
export function scrollTopImmediate() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export const stopScroll = () => lenis && lenis.stop();
export const startScroll = () => lenis && lenis.start();

export { gsap, ScrollTrigger };
