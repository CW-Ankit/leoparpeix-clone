<template>
  <div class="page-container home-view">
    <!-- Header -->
    <section class="section-header font-text">
      <p class="section-header__desc">
        {{ siteData.home.header.description }}
      </p>
      <span class="section-header__scroll">
        {{ siteData.home.header.scrollIndication }} ↓
      </span>
    </section>

    <!-- Hero -->
    <section class="hero-section">
      <div class="hero__titles font-title">
        <div v-for="(title, idx) in siteData.home.hero.titles" :key="idx" class="hero__line">
          {{ title }}
        </div>
      </div>

      <div class="hero__bottom font-text">
        <div
          class="hero__hint"
          @click="feedBeeFromHint"
          @mouseenter="store.setCursorText('Feed Bee')"
          @mouseleave="store.setCursorText(null)"
        >
          {{ siteData.home.hero.indication }}
        </div>

        <div class="hero__city" v-html="siteData.home.hero.city"></div>

        <div class="hero__agency">
          <p v-for="(line, idx) in siteData.home.hero.textAgency" :key="idx">
            {{ line }}
          </p>
          <div class="hero__agency-links">
            <span class="opacity-60">{{ siteData.home.hero.textFormer }}</span>
            <a
              v-for="ag in siteData.home.hero.agencies"
              :key="ag.name"
              :href="ag.url"
              target="_blank"
              rel="noopener"
              class="agency-link"
            >
              {{ ag.name }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Intro -->
    <section class="intro-section">
      <div class="intro__big-text font-title">
        <p v-for="(text, idx) in siteData.home.intro.bigTexts" :key="idx">
          {{ text }}
        </p>
      </div>

      <div class="intro__right font-text">
        <p v-for="(text, idx) in siteData.home.intro.smallTexts" :key="idx" class="intro__small-text">
          {{ text }}
        </p>

        <button
          class="intro__reel-btn"
          @mouseenter="store.setCursorText('Play')"
          @mouseleave="store.setCursorText(null)"
          @click="openReel"
        >
          ▶ {{ siteData.home.intro.cursorIndication }}
        </button>
      </div>
    </section>

    <!-- Projects Part 1: Creandum, Veillance, Mechachain -->
    <template v-for="proj in firstProjects" :key="proj.name">
      <section class="project-section">
        <div class="project-section__header">
          <h2 class="project__name font-title">{{ proj.name }}</h2>
          <div class="project__meta font-text">
            <span>{{ proj.type }}</span>
            <span>{{ proj.date }}</span>
            <span v-if="proj.team">{{ proj.team.text }}</span>
          </div>
        </div>

        <!-- Draggable Carousel -->
        <ProjectSlider>
          <div
            v-for="imgIdx in getProjectImageCount(proj.projectKey!)"
            :key="imgIdx"
            class="project-slide"
          >
            <img
              :src="`/assets/medias/home/projects/${proj.projectKey}-webp/1024/${imgIdx}.webp`"
              :alt="`${proj.name} slide ${imgIdx}`"
              loading="lazy"
              draggable="false"
            />
          </div>
        </ProjectSlider>
      </section>
    </template>

    <!-- Mid-Page WebGL Break -->
    <section class="webgl-text-break font-title">
      <div v-for="(line, idx) in webglBreakText" :key="idx" class="webgl-text-break__line">
        {{ line }}
      </div>
    </section>

    <!-- Projects Part 2: Dulcedo, Dioriviera, Trebuchet -->
    <template v-for="proj in secondProjects" :key="proj.name">
      <section class="project-section">
        <div class="project-section__header">
          <h2 class="project__name font-title">{{ proj.name }}</h2>
          <div class="project__meta font-text">
            <span>{{ proj.type }}</span>
            <span>{{ proj.date }}</span>
            <span v-if="proj.team">{{ proj.team.text }}</span>
          </div>
        </div>

        <!-- Draggable Carousel -->
        <ProjectSlider>
          <div
            v-for="imgIdx in getProjectImageCount(proj.projectKey!)"
            :key="imgIdx"
            class="project-slide"
          >
            <img
              :src="`/assets/medias/home/projects/${proj.projectKey}-webp/1024/${imgIdx}.webp`"
              :alt="`${proj.name} slide ${imgIdx}`"
              loading="lazy"
              draggable="false"
            />
          </div>
        </ProjectSlider>
      </section>
    </template>

    <!-- Archives Section -->
    <section class="archives-section">
      <h2 class="archives__header font-title">
        {{ siteData.home.archives.title }}
      </h2>

      <div class="archives__list font-text">
        <div
          v-for="item in siteData.home.archives.items"
          :key="item.name"
          class="archive-item"
          @mouseenter="onHoverArchive(item)"
          @mouseleave="onLeaveArchive"
          @click="openArchiveMedia(item)"
        >
          <span class="archive-item__title font-title">{{ item.name }}</span>
          <span class="archive-item__type">{{ item.type }}</span>
          <span class="archive-item__roles">{{ item.roles }}</span>
          <span class="archive-item__date">{{ item.date }}</span>
        </div>
      </div>

      <!-- Floating Hover Preview for Archive Items -->
      <div
        v-if="hoveredArchive"
        class="archive-item__preview"
        :style="{
          transform: `translate3d(${previewPos.x + 30}px, ${previewPos.y - 120}px, 0)`
        }"
      >
        <video
          v-if="hoveredArchive.media.isVideo"
          :src="hoveredArchive.media.url2"
          autoplay
          loop
          muted
          playsinline
        ></video>
        <img
          v-else
          :src="hoveredArchive.media.url2"
          :alt="hoveredArchive.name"
        />
      </div>
    </section>

    <!-- Footer -->
    <FooterBlock theme="default" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { SITE_DATA, Project, ArchiveItem } from '@/data/siteContent';
import { useAppStore } from '@/stores/appState';
import { webglManager } from '@/webgl/WebGLManager';
import ProjectSlider from '@/components/ProjectSlider.vue';
import FooterBlock from '@/components/FooterBlock.vue';

const siteData = SITE_DATA;
const store = useAppStore();

onMounted(() => {
  webglManager.setRoute('home');
  store.setTheme('default');
});

const firstProjects = computed(() =>
  siteData.home.projects.filter(p => p.sectionType === 'slider' && (p.projectIndex ?? 0) <= 2)
);

const secondProjects = computed(() =>
  siteData.home.projects.filter(p => p.sectionType === 'slider' && (p.projectIndex ?? 0) >= 3)
);

const webglBreakText = computed(() => {
  const breakSection = siteData.home.projects.find(p => p.sectionType === 'webgl');
  return breakSection?.textLines || [];
});

const projectCounts: Record<string, number> = {
  project1: 12,
  project2: 12,
  project3: 11,
  project4: 9,
  project5: 10,
  project6: 11,
};

function getProjectImageCount(key: string): number {
  return projectCounts[key] || 10;
}

function feedBeeFromHint(e: MouseEvent) {
  const hintEl = e.currentTarget as HTMLElement;
  const rect = hintEl.getBoundingClientRect();
  // Trigger fruit drop in 3D scene
  webglManager['topScene']?.spawnFruitAt(rect.left + 50, rect.top);
}

function openReel() {
  store.openVideo(siteData.home.intro.urlReel);
}

// Archive Hover Preview
const hoveredArchive = ref<ArchiveItem | null>(null);
const previewPos = reactive({ x: 0, y: 0 });

function onHoverArchive(item: ArchiveItem) {
  hoveredArchive.value = item;
  store.setCursorText('View');
}

function onLeaveArchive() {
  hoveredArchive.value = null;
  store.setCursorText(null);
}

function openArchiveMedia(item: ArchiveItem) {
  if (item.media.isVideo) {
    store.openVideo(item.media.url2);
  }
}

window.addEventListener('mousemove', (e) => {
  if (hoveredArchive.value) {
    previewPos.x += (e.clientX - previewPos.x) * 0.25;
    previewPos.y += (e.clientY - previewPos.y) * 0.25;
  } else {
    previewPos.x = e.clientX;
    previewPos.y = e.clientY;
  }
});
</script>

<style scoped>
.hero__hint {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px dashed currentColor;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.hero__hint:hover {
  transform: scale(1.04);
  background-color: rgba(8, 61, 42, 0.06);
}

.agency-link {
  margin-left: 8px;
  text-decoration: underline;
}

.opacity-60 {
  opacity: 0.6;
}

.archive-item__preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 16px 40px rgba(0,0,0,0.22);
  transition: opacity 0.25s ease;
}

.archive-item__preview video,
.archive-item__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
