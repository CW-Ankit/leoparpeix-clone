<template>
  <div class="page-container playground-view">
    <!-- Hero -->
    <section class="playground-hero">
      <h1 class="playground-hero__title font-title">
        Playground
      </h1>
      <p class="playground-hero__desc font-text">
        {{ siteData.playground.hero.text }}
      </p>
    </section>

    <!-- Experiments Grid -->
    <section class="playground-grid">
      <div
        v-for="item in siteData.playground.items"
        :key="item.id"
        class="playground-card"
        @click="openMedia(item)"
        @mouseenter="store.setCursorText('View')"
        @mouseleave="store.setCursorText(null)"
      >
        <div class="playground-card__media">
          <video
            v-if="item.type === 'video'"
            :src="item.src"
            autoplay
            loop
            muted
            playsinline
          ></video>
          <img
            v-else
            :src="item.src"
            :alt="item.title"
            loading="lazy"
          />
        </div>
        <div class="playground-card__info font-text">
          <span class="playground-card__index">#0{{ item.id }}</span>
          <span class="playground-card__title">{{ item.title }}</span>
        </div>
      </div>
    </section>

    <!-- Yellow Footer -->
    <FooterBlock theme="yellow" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { SITE_DATA, PlaygroundItem } from '@/data/siteContent';
import { useAppStore } from '@/stores/appState';
import { webglManager } from '@/webgl/WebGLManager';
import FooterBlock from '@/components/FooterBlock.vue';

const siteData = SITE_DATA;
const store = useAppStore();

onMounted(() => {
  webglManager.setRoute('playground');
  store.setTheme('default');
});

function openMedia(item: PlaygroundItem) {
  if (item.type === 'video') {
    store.openVideo(item.src);
  }
}
</script>

<style scoped>
.playground-hero {
  padding: 180px 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.playground-hero__title {
  font-size: clamp(48px, 8vw, 120px);
  line-height: 0.9;
  letter-spacing: -0.02em;
}

.playground-hero__desc {
  max-width: 500px;
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.75;
}

.playground-grid {
  padding: 20px 40px 140px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 40px;
}

.playground-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.4s var(--ease-out-expo);
}

.playground-card:hover {
  transform: translateY(-6px);
}

.playground-card__media {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0,0,0,0.04);
}

.playground-card__media video,
.playground-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.playground-card__info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.playground-card__index {
  opacity: 0.5;
}

@media (max-width: 900px) {
  .playground-hero, .playground-grid {
    padding-left: 20px;
    padding-right: 20px;
  }
  .playground-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
