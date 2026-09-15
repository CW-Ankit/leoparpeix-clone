<template>
  <div class="page-container about-view">
    <!-- Header -->
    <section class="section-header font-text">
      <p class="section-header__desc">
        {{ siteData.about.header.description }}
      </p>
      <span class="section-header__scroll">
        {{ siteData.about.header.scrollIndication }} ↓
      </span>
    </section>

    <!-- Hero -->
    <section class="hero-section">
      <div class="hero__titles font-title">
        <div v-for="(title, idx) in siteData.about.hero.titles" :key="idx" class="hero__line">
          {{ title }}
        </div>
      </div>

      <div class="hero__bottom font-text">
        <div class="hero__hint">{{ siteData.about.hero.indication }}</div>
        <div class="hero__city">{{ siteData.about.hero.city }}</div>
      </div>
    </section>

    <!-- Intro & Philosophy -->
    <section class="intro-section">
      <div class="intro__big-text font-title">
        <p v-for="(text, idx) in siteData.about.intro.bigTexts" :key="idx">
          {{ text }}
        </p>
      </div>

      <div class="intro__right font-text">
        <p v-for="(text, idx) in siteData.about.intro.smallTexts" :key="idx" class="intro__small-text">
          {{ text }}
        </p>

        <div class="about__portrait">
          <img
            :src="siteData.about.intro.image"
            alt="Léo Parpeix portrait"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- Experience & Awards Section -->
    <section class="experience-section font-text">
      <div class="experience-block">
        <h3 class="font-title block-title">Experience</h3>
        <div class="table-list">
          <div v-for="exp in siteData.about.experience" :key="exp.company" class="table-row">
            <span class="font-title bold">{{ exp.role }}</span>
            <span>{{ exp.company }}</span>
            <span class="opacity-60">{{ exp.period }}</span>
          </div>
        </div>
      </div>

      <div class="awards-block">
        <h3 class="font-title block-title">Recognitions</h3>
        <ul class="awards-list">
          <li v-for="award in siteData.about.awards" :key="award" class="award-item">
            {{ award }}
          </li>
        </ul>
      </div>
    </section>

    <!-- Closing Visual Section -->
    <section class="about-content-section">
      <div class="about-content__image">
        <img
          :src="siteData.about.content.image"
          alt="Design research visual"
          loading="lazy"
        />
      </div>
      <p class="about-content__quote font-title">
        “{{ siteData.about.content.closingQuote }}”
      </p>
    </section>

    <!-- Green Footer -->
    <FooterBlock theme="green" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { SITE_DATA } from '@/data/siteContent';
import { useAppStore } from '@/stores/appState';
import { webglManager } from '@/webgl/WebGLManager';
import FooterBlock from '@/components/FooterBlock.vue';

const siteData = SITE_DATA;
const store = useAppStore();

onMounted(() => {
  webglManager.setRoute('about');
  store.setTheme('default');
});
</script>

<style scoped>
.about__portrait {
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;
}

.about__portrait img {
  width: 100%;
  height: auto;
  display: block;
}

.experience-section {
  padding: 120px 40px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 80px;
}

.block-title {
  font-size: 36px;
  margin-bottom: 30px;
}

.table-list {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  padding: 18px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
}

.bold {
  font-weight: 500;
}

.opacity-60 {
  opacity: 0.6;
}

.awards-list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.award-item {
  padding: 18px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
}

.about-content-section {
  padding: 100px 40px 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.about-content__image {
  width: 100%;
  max-width: 900px;
  border-radius: 8px;
  overflow: hidden;
}

.about-content__image img {
  width: 100%;
  height: auto;
  display: block;
}

.about-content__quote {
  font-size: clamp(24px, 3.5vw, 48px);
  text-align: center;
  max-width: 800px;
  line-height: 1.2;
}

@media (max-width: 900px) {
  .experience-section {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 60px 20px;
  }

  .about-content-section {
    padding: 60px 20px 80px;
    gap: 36px;
  }
}

@media (max-width: 640px) {
  .table-row {
    grid-template-columns: 1fr auto;
    gap: 4px 12px;
    padding: 14px 0;
  }

  .table-row span:nth-child(1) {
    grid-column: 1 / 2;
  }

  .table-row span:nth-child(2) {
    grid-column: 1 / 2;
    font-size: 13px;
    opacity: 0.8;
  }

  .table-row span:nth-child(3) {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    align-self: center;
    font-size: 13px;
  }

  .award-item {
    padding: 14px 0;
    font-size: 14px;
  }

  .block-title {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .about-content__quote {
    font-size: clamp(20px, 5.5vw, 32px);
    line-height: 1.3;
  }
}
</style>
