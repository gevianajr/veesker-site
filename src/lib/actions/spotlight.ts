import type { Action } from "svelte/action";

interface SpotlightOptions {
  color?: "accent" | "cloud";
  radius?: string;
}

export const spotlight: Action<HTMLElement, SpotlightOptions | undefined> = (
  node,
  options
) => {
  const { color = "accent", radius = "220px" } = options ?? {};

  const gradientColor =
    color === "cloud"
      ? "rgba(138, 216, 251, 0.15)"
      : "rgba(249, 115, 22, 0.13)";

  node.style.setProperty("--spotlight-color", gradientColor);
  node.style.setProperty("--spotlight-radius", radius);
  node.classList.add("spotlight-target");

  function onMouseMove(e: MouseEvent) {
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    node.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  node.addEventListener("mousemove", onMouseMove);
  return {
    destroy() {
      node.removeEventListener("mousemove", onMouseMove);
      node.classList.remove("spotlight-target");
    },
  };
};
