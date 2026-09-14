<template>
  <div
    class="cursor-indication"
    :class="{
      'is-active': !!store.cursorText,
      'is-hidden': isOffscreen
    }"
    :style="{
      transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`
    }"
  >
    <!-- Default minimal trailing dot -->
    <div v-if="!store.cursorText" class="cursor-dot"></div>

    <!-- Authentic Pill Badge when hovering interactive zones -->
    <div
      v-else
      class="cursor-badge font-text"
      :class="{
        'badge--yellow': isYellowBadge,
        'badge--cream': !isYellowBadge
      }"
    >
      <span class="badge__text">{{ store.cursorText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/appState';

const store = useAppStore();

const targetPos = reactive({ x: -100, y: -100 });
const cursorPos = reactive({ x: -100, y: -100 });
const isOffscreen = ref(true);
let rafId: number;

const isYellowBadge = computed(() => {
  const text = store.cursorText?.toLowerCase() || '';
  return !text.includes('copy') && !text.includes('mail');
});

function onMouseMove(e: MouseEvent) {
  isOffscreen.value = false;
  targetPos.x = e.clientX;
  targetPos.y = e.clientY;
}

function onMouseLeave() {
  isOffscreen.value = true;
}

function render() {
  // Smooth spring lerp for cursor
  cursorPos.x += (targetPos.x - cursorPos.x) * 0.22;
  cursorPos.y += (targetPos.y - cursorPos.y) * 0.22;
  rafId = requestAnimationFrame(render);
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseleave', onMouseLeave);
  rafId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseleave', onMouseLeave);
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.cursor-indication {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
  transition: opacity 0.2s ease;
}

.cursor-indication.is-hidden {
  opacity: 0;
}

/* Minimalist default trailing dot */
.cursor-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-green);
  transform: translate(-50%, -50%);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.2s ease,
              width 0.2s ease,
              height 0.2s ease;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* Authentic Pill Badge */
.cursor-badge {
  transform: translate(-50%, -120%);
  padding: 6px 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  animation: badgePop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity;
}

.badge--yellow {
  background-color: #F6E016;
  color: #022016;
}

.badge--cream {
  background-color: #EED6C8;
  color: #083D2A;
}

.badge__text {
  font-family: var(--font-text);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}

@keyframes badgePop {
  0% {
    opacity: 0;
    transform: translate(-50%, -90%) scale(0.7);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -120%) scale(1);
  }
}
</style>
