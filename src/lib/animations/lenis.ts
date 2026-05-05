import Lenis from "lenis";

let instance: Lenis | null = null;

export function initLenis(): Lenis {
  if (instance) return instance;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  instance = new Lenis({
    duration: prefersReduced ? 0 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0,
  });

  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function destroyLenis(): void {
  instance?.destroy();
  instance = null;
}
