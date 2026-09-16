import { createRouter, createWebHistory } from 'vue-router';
import { eventBus, EVENTS } from '@/services/EventBus';
import { smoothScroll } from '@/services/SmoothScroll';

// Route-level code-splitting: separate bundle chunks for each page
const HomeView = () => import('@/views/HomeView.vue');
const AboutView = () => import('@/views/AboutView.vue');
const PlaygroundView = () => import('@/views/PlaygroundView.vue');

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
