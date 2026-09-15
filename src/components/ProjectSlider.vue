<template>
  <div
    ref="containerRef"
    class="drag-slider-container"
    @pointerdown="onPointerDown"
    @mouseenter="store.setCursorText('Drag')"
    @mouseleave="store.setCursorText(null)"
    @wheel="onWheel"
  >
    <div
      ref="trackRef"
      class="drag-slider-track"
      :style="{
        transform: `translate3d(${currentX}px, 0, 0)`
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/appState';

const store = useAppStore();

const containerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

let isPointerDown = false;
let startX = 0;
let dragStartX = 0;
let lastMoveTime = 0;
let lastMoveX = 0;
let velocity = 0;

const currentX = ref(0);
let targetX = 0;
let minX = 0;
const maxX = 0;

let rafId: number;

function updateBounds() {
  if (!containerRef.value || !trackRef.value) return;
  const style = window.getComputedStyle(containerRef.value);
  const padLeft = parseFloat(style.paddingLeft) || 20;
  const padRight = parseFloat(style.paddingRight) || 20;
  const containerWidth = containerRef.value.clientWidth;
  const trackWidth = trackRef.value.scrollWidth;
  minX = Math.min(0, containerWidth - trackWidth - (padLeft + padRight));
  if (targetX < minX) targetX = minX;
  if (targetX > maxX) targetX = maxX;
}

function onPointerDown(e: PointerEvent) {
  if (!containerRef.value) return;

  isPointerDown = true;
  startX = e.clientX;
  dragStartX = targetX;
  lastMoveX = e.clientX;
  lastMoveTime = performance.now();
  velocity = 0;

  try {
    containerRef.value.setPointerCapture(e.pointerId);
  } catch {}

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(e: PointerEvent) {
  if (!isPointerDown) return;

  const dx = e.clientX - startX;
  const rawTarget = dragStartX + dx;

  // Elastic resistance at boundaries
  if (rawTarget > maxX) {
    targetX = maxX + (rawTarget - maxX) * 0.3;
  } else if (rawTarget < minX) {
    targetX = minX + (rawTarget - minX) * 0.3;
  } else {
    targetX = rawTarget;
  }

  // Calculate velocity for flick / inertia
  const now = performance.now();
  const dt = Math.max(1, now - lastMoveTime);
  const moveDx = e.clientX - lastMoveX;
  velocity = moveDx / dt;

  lastMoveX = e.clientX;
  lastMoveTime = now;
}

function onPointerUp(e: PointerEvent) {
  if (!isPointerDown) return;
  isPointerDown = false;

  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);

  if (containerRef.value) {
    try {
      containerRef.value.releasePointerCapture(e.pointerId);
    } catch {}
  }

  // Apply momentum flick
  targetX += velocity * 180;

  // Bound clamping
  if (targetX > maxX) {
    targetX = maxX;
  } else if (targetX < minX) {
    targetX = minX;
  }
}

function onWheel(e: WheelEvent) {
  // If trackpad horizontal swipe or shift+wheel
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
  if (delta !== 0) {
    e.preventDefault();
    targetX -= delta * 1.2;
    targetX = Math.max(minX, Math.min(maxX, targetX));
  }
}

function tick() {
  // Smooth spring lerp
  currentX.value += (targetX - currentX.value) * 0.12;
  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  updateBounds();
  window.addEventListener('resize', updateBounds);
  rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateBounds);
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.drag-slider-container {
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
  cursor: grab;
  padding: 20px 40px;
}

.drag-slider-container:active {
  cursor: grabbing;
}

.drag-slider-track {
  display: flex;
  gap: 24px;
  width: max-content;
  will-change: transform;
}

@media (max-width: 768px) {
  .drag-slider-container {
    padding: 16px 20px;
  }
  .drag-slider-track {
    gap: 16px;
  }
}
</style>
