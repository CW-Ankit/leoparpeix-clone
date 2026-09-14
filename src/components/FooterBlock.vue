<template>
  <footer class="footer-block" :class="`theme-${theme}`">
    <div class="footer__headline font-title">
      <div v-for="(line, idx) in siteData.global.footer.titles" :key="idx">
        {{ line }}
      </div>
    </div>

    <div class="footer__bottom font-text">
      <div class="footer__copyright">
        {{ siteData.global.footer.copyright }} — {{ siteData.global.title }}
      </div>

      <div class="footer__links">
        <a
          v-for="net in siteData.global.footer.networks"
          :key="net.name"
          :href="net.url"
          target="_blank"
          rel="noopener"
        >
          {{ net.name }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SITE_DATA } from '@/data/siteContent';

defineProps<{
  theme?: 'default' | 'green' | 'yellow';
}>();

const siteData = SITE_DATA;
</script>

<style scoped>
.theme-green {
  background-color: var(--color-green);
  color: var(--color-cream);
}

.theme-yellow {
  background-color: var(--color-yellow);
  color: var(--color-green);
}
</style>
