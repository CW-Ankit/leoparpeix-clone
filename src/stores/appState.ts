import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoaded: false,
    loaderProgress: 0,
    isSoundEnabled: false,
    cursorText: '' as string | null,
    isCursorHovering: false,
    activeVideoUrl: null as string | null,
    currentTheme: 'default' as 'default' | 'dark' | 'yellow' | 'green',
  }),

  actions: {
    setLoaded(value: boolean) {
      this.isLoaded = value;
    },
    setProgress(val: number) {
      this.loaderProgress = Math.min(100, Math.max(0, val));
    },
    toggleSound() {
      this.isSoundEnabled = !this.isSoundEnabled;
    },
    setSound(val: boolean) {
      this.isSoundEnabled = val;
    },
    setCursorText(text: string | null) {
      this.cursorText = text;
      this.isCursorHovering = !!text;
    },
    openVideo(url: string) {
      this.activeVideoUrl = url;
    },
    closeVideo() {
      this.activeVideoUrl = null;
    },
    setTheme(theme: 'default' | 'dark' | 'yellow' | 'green') {
      this.currentTheme = theme;
      if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
    }
  }
});
