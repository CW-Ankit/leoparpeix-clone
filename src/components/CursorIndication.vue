<template>
  <!-- Only render if device has fine pointer / hover support -->
  <div
    v-if="isEnabled"
    class="cursor-indication"
    :class="{
      'is-active': !!store.cursorText,
      'is-hovering': isHoveringInteractive && !store.cursorText,
      'is-pressed': isMouseDown,
      'is-hidden': isOffscreen
    }"
    :style="{
      transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`
    }"
    aria-hidden="true"
  >
    <!-- Default / Interactive SVG Reticle (Dual-layer follower) -->
    <div v-if="!store.cursorText" class="cursor-svg-wrapper">
      <!-- Outer Spring Ring SVG -->
      <svg
        class="cursor-svg-ring"
        viewBox="0 0 44 44"
        width="44"
        height="44"
      >
        <circle
          class="ring-bg"
          cx="22"
          cy="22"
          r="16"
        />
        <circle
          class="ring-orbit"
          cx="22"
          cy="22"
          r="16"
        />
      </svg>

      <!-- Inner Precision Dot SVG (directly tracks pointer) -->
      <div
        class="cursor-svg-dot-wrapper"
        :style="{
          transform: `translate3d(${innerPos.x - cursorPos.x}px, ${innerPos.y - cursorPos.y}px, 0)`
        }"
      >
        <svg
          class="cursor-svg-dot"
          viewBox="0 0 12 12"
          width="12"
          height="12"
        >
          <circle cx="6" cy="6" r="3.2" />
        </svg>
      </div>
    </div>

    <!-- Authentic Pill Badge with Custom SVGs when hovering interactive zones -->
    <div
      v-else
      class="cursor-badge font-text"
      :class="{
        'badge--yellow': isYellowBadge,
        'badge--cream': !isYellowBadge
      }"
    >
      <!-- Drag Action SVG -->
      <svg
        v-if="actionType === 'drag'"
        class="badge__icon badge__icon--drag"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="7 15 4 12 7 9" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <polyline points="17 9 20 12 17 15" />
      </svg>

      <!-- Play Action SVG -->
      <svg
        v-else-if="actionType === 'play'"
        class="badge__icon badge__icon--play"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <polygon points="7 5 19 12 7 19 7 5" />
      </svg>

      <!-- View Action SVG -->
      <svg
        v-else-if="actionType === 'view'"
        class="badge__icon badge__icon--view"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>

      <!-- Feed Bee Action SVG -->
      <svg
        v-else-if="actionType === 'bee'"
        class="badge__icon badge__icon--bee"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </svg>

      <!-- Copy / Mail Action SVG -->
      <svg
        v-else-if="actionType === 'copy' || actionType === 'mail'"
        class="badge__icon badge__icon--mail"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>

      <!-- Default Link Arrow SVG -->
      <svg
        v-else
        class="badge__icon badge__icon--arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>

      <span class="badge__text">{{ store.cursorText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/appState';

const store = useAppStore();

const isEnabled = ref(false);
const targetPos = reactive({ x: -100, y: -100 });
const innerPos = reactive({ x: -100, y: -100 });
const cursorPos = reactive({ x: -100, y: -100 });
const isOffscreen = ref(true);
const isHoveringInteractive = ref(false);
const isMouseDown = ref(false);
let rafId: number;

const actionType = computed<'drag' | 'play' | 'view' | 'bee' | 'copy' | 'mail' | 'generic'>(() => {
  const text = store.cursorText?.toLowerCase() || '';
  if (text.includes('drag')) return 'drag';
  if (text.includes('play')) return 'play';
  if (text.includes('view')) return 'view';
  if (text.includes('bee') || text.includes('feed')) return 'bee';
  if (text.includes('copy')) return 'copy';
  if (text.includes('mail')) return 'mail';
  return 'generic';
});

const isYellowBadge = computed(() => {
  const text = store.cursorText?.toLowerCase() || '';
  return !text.includes('copy') && !text.includes('mail');
});

function onMouseMove(e: MouseEvent) {
  if (!isEnabled.value) return;
  isOffscreen.value = false;
  targetPos.x = e.clientX;
  targetPos.y = e.clientY;

  // Detect interactive element hovering
  const target = e.target as HTMLElement | null;
  if (target) {
    isHoveringInteractive.value = !!target.closest(
      'a, button, [role="button"], .archive-item, .hero__hint, .playground-card, .project-slide, .intro__reel-btn, input, textarea'
    );
  }
}

function onMouseDown() {
  isMouseDown.value = true;
}

function onMouseUp() {
  isMouseDown.value = false;
}

function onMouseLeave() {
  isOffscreen.value = true;
}

function onTouchStart() {
  // Mobile touch detected: immediately hide custom cursor
  isEnabled.value = false;
  isOffscreen.value = true;
  document.body.classList.remove('has-custom-cursor');
}

function render() {
  if (isEnabled.value) {
    // Inner precision reticle tracks rapidly with light lerp
    innerPos.x += (targetPos.x - innerPos.x) * 0.75;
    innerPos.y += (targetPos.y - innerPos.y) * 0.75;

    // Outer ring has silky spring inertia
    cursorPos.x += (targetPos.x - cursorPos.x) * 0.22;
    cursorPos.y += (targetPos.y - cursorPos.y) * 0.22;
  }
  rafId = requestAnimationFrame(render);
}

onMounted(() => {
  // Strict fine-pointer & hover check: only active on desktop mice/trackpads
  const mediaFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const isFinePointer = mediaFine.matches;

  if (isFinePointer && !('ontouchstart' in window)) {
    isEnabled.value = true;
  } else {
    isEnabled.value = false;
    document.body.classList.remove('has-custom-cursor');
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mousedown', onMouseDown, { passive: true });
  window.addEventListener('mouseup', onMouseUp, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);

  // Global touch listeners to immediately kill cursor if a touch is detected
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      onTouchStart();
    }
  }, { passive: true });

  rafId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('mouseleave', onMouseLeave);
  window.removeEventListener('touchstart', onTouchStart);
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.cursor-indication {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99999;
  will-change: transform;
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.cursor-indication.is-hidden {
  opacity: 0 !important;
}

/* Custom SVG Wrapper */
.cursor-svg-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Outer SVG Spring Ring */
.cursor-svg-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ring-bg {
  fill: none;
  stroke: var(--color-green);
  stroke-width: 1.2px;
  opacity: 0.35;
  transition: stroke 0.3s ease, opacity 0.3s ease, r 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ring-orbit {
  fill: none;
  stroke: var(--color-emerald);
  stroke-width: 1.2px;
  stroke-dasharray: 6 12;
  opacity: 0.4;
  transform-origin: center;
  animation: orbitRotate 9s linear infinite;
  transition: opacity 0.3s ease;
}

/* Inner SVG Precision Dot */
.cursor-svg-dot-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.cursor-svg-dot {
  transform: translate(-50%, -50%);
  fill: var(--color-green);
  transition: fill 0.3s ease, transform 0.2s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

/* Hovering on Interactive Elements */
.cursor-indication.is-hovering .cursor-svg-wrapper {
  transform: translate(-50%, -50%) scale(1.35);
}

.cursor-indication.is-hovering .ring-bg {
  opacity: 0.8;
  stroke: var(--color-emerald);
  stroke-width: 1.5px;
}

.cursor-indication.is-hovering .ring-orbit {
  opacity: 0.9;
  stroke-dasharray: 10 6;
  animation-duration: 4s;
}

.cursor-indication.is-hovering .cursor-svg-dot {
  transform: translate(-50%, -50%) scale(0.7);
  fill: var(--color-emerald);
}

/* Mouse Down Click State */
.cursor-indication.is-pressed .cursor-svg-wrapper {
  transform: translate(-50%, -50%) scale(0.85);
}

.cursor-indication.is-pressed .ring-bg {
  stroke-width: 2.2px;
}

/* Authentic Pill Badge */
.cursor-badge {
  transform: translate(-50%, -125%);
  padding: 8px 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.2);
  animation: badgePop 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

.badge__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.badge__icon--drag {
  animation: dragBounce 1.2s ease-in-out infinite;
}

.badge__icon--play {
  animation: playPulse 1.4s ease-in-out infinite;
}

.badge__icon--bee {
  animation: beeWiggle 0.8s ease-in-out infinite;
}

.badge__text {
  font-family: var(--font-text);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1;
}

@keyframes orbitRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes badgePop {
  0% {
    opacity: 0;
    transform: translate(-50%, -95%) scale(0.65);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -125%) scale(1);
  }
}

@keyframes dragBounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

@keyframes playPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@keyframes beeWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(8deg); }
}

/* ABSOLUTE MOBILE & TOUCH SUPPRESSION */
@media (hover: none), (pointer: coarse), (max-width: 900px) {
  .cursor-indication {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
}
</style>
