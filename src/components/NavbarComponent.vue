<template>
  <header class="navbar-block">
    <div class="navbar__left">
      <router-link to="/" class="navbar__title font-text" @click="closeMenu">
        {{ siteData.global.title }}
      </router-link>
      <span class="navbar__subtitle font-text">{{ siteData.global.infos }}</span>
    </div>

    <!-- Desktop Navigation -->
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

      <!-- Sound Toggle (Desktop & Mobile header) -->
      <button
        class="sound-toggle-btn font-text"
        @click="toggleSound"
        :aria-label="store.isSoundEnabled ? 'Mute audio' : 'Enable audio'"
      >
        <div class="sound-bars" :class="{ 'is-active': store.isSoundEnabled }">
          <div class="sound-bar"></div>
          <div class="sound-bar"></div>
          <div class="sound-bar"></div>
        </div>
        <span>Sound</span>
      </button>

      <!-- Mobile Hamburger / Close Toggle Button -->
      <button
        class="mobile-menu-toggle font-text"
        :class="{ 'is-open': isMenuOpen }"
        @click="toggleMenu"
        :aria-label="isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'"
        :aria-expanded="isMenuOpen"
      >
        <span class="mobile-menu-toggle__label">{{ isMenuOpen ? 'Close' : 'Menu' }}</span>
        <div class="hamburger-icon">
          <span class="hamburger-line line--top"></span>
          <span class="hamburger-line line--bottom"></span>
        </div>
      </button>
    </nav>

    <!-- Mobile Fullscreen Navigation Overlay -->
    <teleport to="body">
      <transition name="mobile-menu-fade">
        <div
          v-if="isMenuOpen"
          class="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
        >
          <div class="mobile-nav__header">
            <div class="mobile-nav__brand font-text">
              <span class="brand__title">{{ siteData.global.title }}</span>
              <span class="brand__subtitle">{{ siteData.global.infos }}</span>
            </div>
            <button
              class="mobile-nav__close-btn font-text"
              @click="closeMenu"
              aria-label="Close navigation"
            >
              <span>Close</span>
              <span class="close-icon">✕</span>
            </button>
          </div>

          <nav class="mobile-nav__content">
            <ul class="mobile-nav__links font-title">
              <li class="mobile-nav__item">
                <router-link to="/" class="mobile-nav__link" @click="closeMenu">
                  <span class="nav-num font-text">01</span>
                  <span class="nav-text">Index</span>
                </router-link>
              </li>
              <li
                v-for="(link, idx) in siteData.global.navbar.links"
                :key="link.path"
                class="mobile-nav__item"
              >
                <router-link :to="link.path" class="mobile-nav__link" @click="closeMenu">
                  <span class="nav-num font-text">0{{ idx + 2 }}</span>
                  <span class="nav-text">{{ link.name }}</span>
                </router-link>
              </li>
              <li class="mobile-nav__item">
                <a
                  :href="siteData.global.navbar.lab.url"
                  target="_blank"
                  rel="noopener"
                  class="mobile-nav__link"
                  @click="closeMenu"
                >
                  <span class="nav-num font-text">0{{ siteData.global.navbar.links.length + 2 }}</span>
                  <span class="nav-text">{{ siteData.global.navbar.lab.text }} ↗</span>
                </a>
              </li>
            </ul>
          </nav>

          <div class="mobile-nav__footer font-text">
            <button
              class="mobile-sound-btn"
              @click="toggleSound"
              :aria-label="store.isSoundEnabled ? 'Mute audio' : 'Enable audio'"
            >
              <div class="sound-bars" :class="{ 'is-active': store.isSoundEnabled }">
                <div class="sound-bar"></div>
                <div class="sound-bar"></div>
                <div class="sound-bar"></div>
              </div>
              <span>Sound: {{ store.isSoundEnabled ? 'ON' : 'OFF' }}</span>
            </button>

            <div class="mobile-nav__networks">
              <a
                v-for="net in siteData.global.footer.networks"
                :key="net.name"
                :href="net.url"
                target="_blank"
                rel="noopener"
                class="network-link"
              >
                {{ net.name }}
              </a>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { SITE_DATA } from '@/data/siteContent';
import { useAppStore } from '@/stores/appState';
import { soundController } from '@/services/SoundController';

const siteData = SITE_DATA;
const store = useAppStore();

const isMenuOpen = ref(false);

function toggleSound() {
  soundController.toggleSound();
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Mobile Menu Toggle Button */
.mobile-menu-toggle {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  z-index: 120;
  transition: opacity 0.2s, background-color 0.2s;
}

.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 14px;
  height: 10px;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 1.5px;
  background-color: currentColor;
  border-radius: 1px;
  transition: transform 0.25s ease, opacity 0.25s ease;
  transform-origin: center;
}

.mobile-menu-toggle.is-open .line--top {
  transform: translateY(2.75px) rotate(45deg);
}

.mobile-menu-toggle.is-open .line--bottom {
  transform: translateY(-2.75px) rotate(-45deg);
}

/* Fullscreen Mobile Overlay */
.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background-color: var(--color-green);
  color: var(--color-cream);
  z-index: 99990;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(20px + env(safe-area-inset-top, 0px)) 24px calc(24px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.mobile-nav__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.mobile-nav__brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand__title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.brand__subtitle {
  font-size: 12px;
  opacity: 0.7;
}

.mobile-nav__close-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--color-cream);
  background: transparent;
  color: var(--color-cream);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
}

.close-icon {
  font-size: 14px;
  line-height: 1;
}

/* Content Links */
.mobile-nav__content {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 40px 0;
}

.mobile-nav__links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.mobile-nav__item {
  width: 100%;
}

.mobile-nav__link {
  display: flex;
  align-items: baseline;
  gap: 16px;
  font-size: clamp(38px, 10vw, 64px);
  line-height: 1.05;
  color: var(--color-cream);
  text-transform: uppercase;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.mobile-nav__link:hover,
.mobile-nav__link.router-link-exact-active {
  opacity: 0.7;
  transform: translateX(8px);
}

.nav-num {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.5;
  letter-spacing: 0.05em;
}

/* Footer info in mobile nav */
.mobile-nav__footer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(238, 214, 200, 0.2);
  font-size: 13px;
}

.mobile-sound-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--color-cream);
  background: transparent;
  color: var(--color-cream);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.mobile-nav__networks {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.network-link {
  color: var(--color-cream);
  opacity: 0.75;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.04em;
  transition: opacity 0.2s ease;
}

.network-link:hover {
  opacity: 1;
}

/* Transitions */
.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 900px) {
  .mobile-menu-toggle {
    display: inline-flex;
  }
}
</style>
