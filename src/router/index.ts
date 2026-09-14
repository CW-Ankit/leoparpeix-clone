import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import PlaygroundView from '@/views/PlaygroundView.vue';
import { eventBus, EVENTS } from '@/services/EventBus';
import { smoothScroll } from '@/services/SmoothScroll';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/playground',
      name: 'playground',
      component: PlaygroundView,
    },
    {
      path: '/Playground',
      redirect: '/playground',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from) => {
  if (from.name) {
    eventBus.emit(EVENTS.PAGE_TRANSITION_SOUND);
    smoothScroll.scrollTo(0, { immediate: true });
  }
});

export default router;
