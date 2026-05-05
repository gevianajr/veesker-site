<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    maxTilt = 8,
    perspective = 800,
    class: className = "",
    children,
  }: {
    maxTilt?: number;
    perspective?: number;
    class?: string;
    children: Snippet;
  } = $props();

  let el: HTMLDivElement;

  function onMouseMove(e: MouseEvent) {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.transition = "none";
    el.style.transform = `perspective(${perspective}px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
  }

  function onMouseEnter() {
    el.style.willChange = "transform";
  }

  function onMouseLeave() {
    el.style.willChange = "auto";
    el.style.transition = `transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)`;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
  }
</script>

<div
  bind:this={el}
  class="tilt-card {className}"
  onmousemove={onMouseMove}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
>
  {@render children()}
</div>

<style>
  .tilt-card {
    transform-style: preserve-3d;
  }
  @media (prefers-reduced-motion: reduce) {
    .tilt-card {
      transform: none !important;
      transition: none !important;
    }
  }
</style>
