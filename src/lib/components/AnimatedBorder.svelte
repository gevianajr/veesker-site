<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    speed = "3s",
    borderRadius = "14px",
    padding = "1.5px",
    innerBg = "var(--bg-soft)",
    class: className = "",
    innerClass = "",
    children,
  }: {
    speed?: string;
    borderRadius?: string;
    padding?: string;
    innerBg?: string;
    class?: string;
    innerClass?: string;
    children: Snippet;
  } = $props();
</script>

<div
  class="anim-border-wrap {className}"
  style="--speed:{speed};--radius:{borderRadius};--pad:{padding};"
>
  <div
    class="anim-border-inner {innerClass}"
    style="background:{innerBg};border-radius:calc(var(--radius) - var(--pad));"
  >
    {@render children()}
  </div>
</div>

<style>
  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  .anim-border-wrap {
    border-radius: var(--radius);
    padding: var(--pad);
    background: conic-gradient(
      from var(--angle),
      rgba(249, 115, 22, 0.85),
      rgba(138, 216, 251, 0.75),
      rgba(196, 92, 8, 0.65),
      rgba(249, 115, 22, 0.85)
    );
    animation: spin-border var(--speed) linear infinite;
  }

  @keyframes spin-border {
    to {
      --angle: 360deg;
    }
  }

  .anim-border-inner {
    height: 100%;
    width: 100%;
  }

  @supports not (background: conic-gradient(from 0deg, red, blue)) {
    .anim-border-wrap {
      background: none;
      border: 1px solid rgba(249, 115, 22, 0.4);
      padding: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .anim-border-wrap {
      animation: none;
      background: conic-gradient(
        from 45deg,
        rgba(249, 115, 22, 0.6),
        rgba(138, 216, 251, 0.5),
        rgba(196, 92, 8, 0.5),
        rgba(249, 115, 22, 0.6)
      );
    }
  }
</style>
