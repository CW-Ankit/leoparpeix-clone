import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventBus, EVENTS } from './EventBus';

gsap.registerPlugin(ScrollTrigger);

class SmoothScrollService {
  public lenis: Lenis | null = null;
  private isStopped: boolean = false;

  init() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    this.lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      eventBus.emit(EVENTS.SCROLL, e);
    });

    gsap.ticker.add((time: number) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  stop() {
    this.isStopped = true;
    this.lenis?.stop();
  }

  start() {
    this.isStopped = false;
    this.lenis?.start();
  }

  scrollTo(target: any, options: any = {}) {
    this.lenis?.scrollTo(target, options);
  }

  resize() {
    this.lenis?.resize();
    ScrollTrigger.refresh();
  }
}

export const smoothScroll = new SmoothScrollService();
