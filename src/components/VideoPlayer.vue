<template>
  <div v-if="store.activeVideoUrl" class="video-modal" @click.self="close">
    <button class="video-modal__close font-text" @click="close">
      Close ✕
    </button>
    <div class="video-modal__container">
      <video
        :src="store.activeVideoUrl"
        controls
        autoplay
        playsinline
      ></video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appState';

const store = useAppStore();

function close() {
  store.closeVideo();
}
</script>
