<template>
  <div
    class="custom-cursor"
    :class="{ 'is-expanded': !!store.cursorText }"
    :style="{
      transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`
    }"
  >
    <div class="custom-cursor__dot">
      <span v-if="store.cursorText" class="custom-cursor__label font-text">
        {{ store.cursorText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/appState';

const store = useAppStore();

const targetPos = reactive({ x: -100, y: -100 });
const cursorPos = reactive({ x: -100, y: -100 });
let rafId: number;

function onMouseMove(e: MouseEvent) {
  targetPos.x = e.clientX;
  targetPos.y = e.clientY;
}

function render() {
  // Smooth cursor follow lerp
  cursorPos.x += (targetPos.x - cursorPos.x) * 0.18;
  cursorPos.y += (targetPos.y - cursorPos.y) * 0.18;
  rafId = requestAnimationFrame(render);
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  rafId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  cancelAnimationFrame(rafId);
});
</script>
