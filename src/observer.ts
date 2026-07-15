import { ScrollEffectsConfig } from './types.js';

export const createParallaxObserver = (config: Required<ScrollEffectsConfig>, callback: (entries: IntersectionObserverEntry[]) => void) => {
  return new IntersectionObserver(callback, {
    threshold: config.threshold,
    rootMargin: '0px 0px -15% 0px'
  });
};
