type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(...args);
        } catch (e) {
          console.error(`Error in event handler for ${event}:`, e);
        }
      });
    }
  }
}

export const eventBus = new EventBus();

// Standard event keys
export const EVENTS = {
  APP_LOADED: 'APP_LOADED',
  LOADER_REVEAL_COMPLETE: 'LOADER_REVEAL_COMPLETE',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  CURSOR_INDICATION_CHANGE: 'CURSOR_INDICATION_CHANGE',
  CURSOR_SOUND_INDICATION_SUPPRESS: 'CURSOR_SOUND_INDICATION_SUPPRESS',
  PAGE_TRANSITION_SOUND: 'PAGE_TRANSITION_SOUND',
  FEED_BEE: 'FEED_BEE',
  RESIZE: 'RESIZE',
  SCROLL: 'SCROLL',
  OPEN_VIDEO: 'OPEN_VIDEO',
  CLOSE_VIDEO: 'CLOSE_VIDEO'
};
