<template>
  <div
    v-if="store.activeVideoUrl"
    class="video-modal"
    :class="{ 'is-active': isRevealed }"
    @click.self="close"
  >
    <!-- Background Backdrop with blur -->
    <div class="video-modal__backdrop" @click="close"></div>

    <!-- Header / Close button -->
    <div class="video-modal__header">
      <span class="video-modal__label font-text">Showcase Video</span>
      <button class="video-modal__close font-text" @click="close">
        Close ✕
      </button>
    </div>

    <!-- Video Container with scale entrance -->
    <div class="video-modal__content">
      <video
        ref="videoRef"
        class="video-modal__video"
        :src="store.activeVideoUrl"
        autoplay
        playsinline
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @click="togglePlay"
        @ended="onEnded"
      ></video>

      <!-- Center Play/Pause indicator -->
      <div
        v-if="!isPlaying"
        class="video-modal__center-play"
        @click="togglePlay"
      >
        <span class="center-play__icon">▶</span>
      </div>

      <!-- Bottom Control Bar -->
      <div class="video-modal__controls font-text">
        <button class="controls__play-btn" @click="togglePlay">
          {{ isPlaying ? '❚❚' : '▶' }}
        </button>

        <div class="controls__time">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>

        <div class="controls__progress-track" @click="onSeek">
          <div
            class="controls__progress-fill"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/appState';
import { soundController } from '@/services/SoundController';

const store = useAppStore();

const videoRef = ref<HTMLVideoElement | null>(null);
const isRevealed = ref(false);
const isPlaying = ref(true);
const currentTime = ref(0);
const duration = ref(0);
const progressPercent = ref(0);

watch(
  () => store.activeVideoUrl,
  (url) => {
    if (url) {
      isRevealed.value = false;
      setTimeout(() => {
        isRevealed.value = true;
      }, 50);

      // Play video with audio enabled
      setTimeout(() => {
        if (videoRef.value) {
          videoRef.value.muted = false;
          videoRef.value.play().catch(() => {
            // If browser blocks unmuted autoplay, mute and play
            if (videoRef.value) {
              videoRef.value.muted = true;
              videoRef.value.play();
            }
          });
          isPlaying.value = true;
        }
      }, 100);
    } else {
      isRevealed.value = false;
    }
  }
);

function togglePlay() {
  if (!videoRef.value) return;
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
}

function onTimeUpdate() {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;
  progressPercent.value = (currentTime.value / (duration.value || 1)) * 100;
}

function onLoadedMetadata() {
  if (!videoRef.value) return;
  duration.value = videoRef.value.duration;
}

function onSeek(e: MouseEvent) {
  if (!videoRef.value || !duration.value) return;
  const track = e.currentTarget as HTMLElement;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  videoRef.value.currentTime = ratio * duration.value;
}

function onEnded() {
  isPlaying.value = false;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function close() {
  isRevealed.value = false;
  if (videoRef.value) {
    videoRef.value.pause();
  }
  setTimeout(() => {
    store.closeVideo();
  }, 350);
}

function onKeyDown(e: KeyboardEvent) {
  if (!store.activeVideoUrl) return;
  if (e.key === 'Escape') {
    close();
  } else if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped>
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease-out-expo);
}

.video-modal.is-active {
  opacity: 1;
  pointer-events: auto;
}

.video-modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 32, 22, 0.94);
  backdrop-filter: blur(20px);
}

.video-modal__header {
  position: absolute;
  top: 30px;
  left: 40px;
  right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  z-index: 10;
}

.video-modal__label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.video-modal__close {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  opacity: 0.8;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.25);
  transition: opacity 0.2s, background-color 0.2s;
}

.video-modal__close:hover {
  opacity: 1;
  background-color: rgba(255,255,255,0.1);
}

.video-modal__content {
  position: relative;
  width: min(1200px, 88vw);
  max-height: 78vh;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  transform: scale(0.92);
  transition: transform 0.5s var(--ease-out-expo);
  background: #000;
}

.video-modal.is-active .video-modal__content {
  transform: scale(1);
}

.video-modal__video {
  width: 100%;
  height: auto;
  max-height: 78vh;
  display: block;
  cursor: pointer;
}

.video-modal__center-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(8, 61, 42, 0.8);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.center-play__icon {
  font-size: 24px;
  margin-left: 4px;
}

.video-modal__controls {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
}

.controls__play-btn {
  font-size: 14px;
  color: #fff;
  width: 28px;
}

.controls__time {
  font-size: 12px;
  opacity: 0.8;
  font-variant-numeric: tabular-nums;
}

.controls__progress-track {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.25);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: height 0.2s;
}

.controls__progress-track:hover {
  height: 6px;
}

.controls__progress-fill {
  height: 100%;
  background: var(--color-yellow);
  border-radius: 2px;
  transition: width 0.1s linear;
}
</style>
