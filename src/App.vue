<template>
  <div id="app-wrapper">
    <NavbarComponent />
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <CursorIndication />
    <LoaderBlock />
    <VideoPlayer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import NavbarComponent from '@/components/NavbarComponent.vue';
import CursorIndication from '@/components/CursorIndication.vue';
import LoaderBlock from '@/components/LoaderBlock.vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import { webglManager } from '@/webgl/WebGLManager';
import { smoothScroll } from '@/services/SmoothScroll';
import { soundController } from '@/services/SoundController';

onMounted(() => {
  // Only enable custom cursor mode on fine-pointer devices (desktop mice/trackpads)
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isFinePointer) {
    document.body.classList.add('has-custom-cursor');
  }

  const mainCanvas = document.getElementById('canvas-app');
  const topCanvas = document.getElementById('canvas-top-app');

  if (mainCanvas && topCanvas) {
    webglManager.init(mainCanvas, topCanvas);
  }

  smoothScroll.init();
  soundController.init();
});
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s var(--ease-out-expo);
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
