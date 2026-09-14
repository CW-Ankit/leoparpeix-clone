<template>
  <header class="navbar-block">
    <div class="navbar__left">
      <router-link to="/" class="navbar__title font-text">{{ siteData.global.title }}</router-link>
      <span class="navbar__subtitle font-text">{{ siteData.global.infos }}</span>
    </div>

    <nav class="navbar__right">
      <ul class="navbar__links">
        <li v-for="link in siteData.global.navbar.links" :key="link.path">
          <router-link :to="link.path" class="navbar__link font-text">
            {{ link.name }}
          </router-link>
        </li>
        <li>
          <a :href="siteData.global.navbar.lab.url" target="_blank" rel="noopener" class="navbar__link font-text">
            {{ siteData.global.navbar.lab.text }} ↗
          </a>
        </li>
      </ul>

      <button class="sound-toggle-btn font-text" @click="toggleSound" :aria-label="store.isSoundEnabled ? 'Mute audio' : 'Enable audio'">
        <div class="sound-bars" :class="{ 'is-active': store.isSoundEnabled }">
          <div class="sound-bar"></div>
          <div class="sound-bar"></div>
          <div class="sound-bar"></div>
        </div>
        <span>Sound</span>
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { SITE_DATA } from '@/data/siteContent';
import { useAppStore } from '@/stores/appState';
import { soundController } from '@/services/SoundController';

const siteData = SITE_DATA;
const store = useAppStore();

function toggleSound() {
  soundController.toggleSound();
}
</script>
