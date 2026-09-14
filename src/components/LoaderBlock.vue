<template>
  <div class="loader-block" :class="{ 'is-loaded': isDismissed }">
    <div class="loader__title font-text">
      {{ siteData.global.title }} — {{ siteData.global.loader.progressText }}
    </div>

    <div class="loader__bottom">
      <div class="loader__progress font-title">
        {{ progress }}%
      </div>

      <button
        v-if="isReadyToEnter"
        class="loader__start-btn font-text"
        @click="enterExperience"
      >
        Click to enter & enable sound
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SITE_DATA } from '@/data/siteContent';
import { useAppStore } from '@/stores/appState';
import { soundController } from '@/services/SoundController';
import { eventBus, EVENTS } from '@/services/EventBus';

const siteData = SITE_DATA;
const store = useAppStore();

const progress = ref(0);
const isReadyToEnter = ref(false);
const isDismissed = ref(false);

onMounted(() => {
  // Simulate asset loading progression
  const interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 18) + 5;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(interval);
      isReadyToEnter.value = true;
    }
  }, 100);
});

function enterExperience() {
  soundController.enableSound();
  isDismissed.value = true;
  store.setLoaded(true);
  eventBus.emit(EVENTS.LOADER_REVEAL_COMPLETE);
}
</script>
