<script lang="ts">
  import { onMount } from "svelte";

  let {
    count = 8,
    minWidth = 60,
    maxWidth = 140,
    opacity = 0.65,
  }: {
    count?: number;
    minWidth?: number;
    maxWidth?: number;
    opacity?: number;
  } = $props();

  interface Meteor {
    top: number;
    left: number;
    width: number;
    delay: number;
    duration: number;
    opacity: number;
  }

  let meteors = $state<Meteor[]>([]);

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    meteors = Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      width: minWidth + Math.random() * (maxWidth - minWidth),
      delay: Math.random() * 4,
      duration: 1.5 + Math.random() * 1.5,
      opacity,
    }));
  });
</script>

<div class="meteors-wrap" aria-hidden="true">
  {#each meteors as m}
    <span
      class="meteor"
      style="top:{m.top}%;left:{m.left}%;width:{m.width}px;animation-delay:{m.delay}s;animation-duration:{m.duration}s;--op:{m.opacity}"
    ></span>
  {/each}
</div>

<style>
  .meteors-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }
  .meteor {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, rgba(245, 241, 232, var(--op, 0.65)), transparent);
    border-radius: 100px;
    animation: meteor-fall linear infinite;
    opacity: 0;
  }
  @keyframes meteor-fall {
    0% {
      opacity: 0;
      transform: translateX(0) translateY(0) rotate(-30deg);
    }
    10% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(180px) translateY(90px) rotate(-30deg);
    }
  }
</style>
