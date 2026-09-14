import { eventBus, EVENTS } from './EventBus';
import { useAppStore } from '../stores/appState';

export class SoundController {
  private ambientAudio: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = true;
  private initialized: boolean = false;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    eventBus.on(EVENTS.TOGGLE_SOUND, () => this.toggleSound());
    eventBus.on(EVENTS.PAGE_TRANSITION_SOUND, () => this.play('pageTransition'));
    eventBus.on(EVENTS.FEED_BEE, () => {
      const effect = Math.random() > 0.5 ? 'fruit1' : 'fruit2';
      this.play(effect);
    });
  }

  public init() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      // Ambient track
      this.ambientAudio = new Audio('/assets/sounds/compressed/ambient.aac');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.375;

      // Sound effects
      this.soundEffects.set('fruit1', new Audio('/assets/sounds/compressed/fruit1.aac'));
      this.soundEffects.set('fruit2', new Audio('/assets/sounds/compressed/fruit2.aac'));
      this.soundEffects.set('pageTransition', new Audio('/assets/sounds/compressed/pageTransition.aac'));

      this.soundEffects.forEach(audio => {
        audio.volume = 0.35;
      });
    } catch (e) {
      console.warn('Audio initialization warning:', e);
    }
  }

  public toggleSound() {
    this.init();
    this.isMuted = !this.isMuted;
    const store = useAppStore();
    store.setSound(!this.isMuted);

    if (this.isMuted) {
      this.ambientAudio?.pause();
    } else {
      this.ambientAudio?.play().catch(() => {});
    }
  }

  public enableSound() {
    this.init();
    this.isMuted = false;
    const store = useAppStore();
    store.setSound(true);
    this.ambientAudio?.play().catch(() => {});
  }

  public play(name: string) {
    if (this.isMuted) return;
    const audio = this.soundEffects.get(name);
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  }
}

export const soundController = new SoundController();
