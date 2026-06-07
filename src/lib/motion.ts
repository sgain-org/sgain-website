import { animate, inView, stagger } from "motion";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** `Layout.astro` sets `motion-ready` on <html>, skipping it for reduced motion. */
function motionEnabled(): boolean {
  return document.documentElement.classList.contains("motion-ready");
}

/** Fades `[data-reveal]` elements up as they scroll into view. */
export function revealOnScroll(selector = "[data-reveal]"): void {
  if (!motionEnabled()) return;

  inView(selector, (element) => {
    animate(element, { opacity: 1, y: [12, 0] }, { duration: 0.5, ease: EASE_OUT });
  });
}

/** Fades a group of elements up together, one shortly after the other. */
export function enterStaggered(selector: string): void {
  if (!motionEnabled()) return;

  const elements = document.querySelectorAll<HTMLElement>(selector);
  if (elements.length === 0) return;

  animate(
    elements,
    { opacity: 1, y: [14, 0] },
    { duration: 0.55, delay: stagger(0.07), ease: EASE_OUT },
  );
}

/** Counts each element up from zero to the number in its `data-count-to` attribute. */
export function countUp(selector: string): void {
  if (!motionEnabled()) return;

  for (const element of document.querySelectorAll<HTMLElement>(selector)) {
    const target = Number(element.dataset.countTo);
    if (!Number.isFinite(target)) continue;

    animate(0, target, {
      duration: 1.1,
      ease: EASE_OUT,
      onUpdate: (value) => {
        element.textContent = Math.round(value).toLocaleString("en-GB");
      },
    });
  }
}
