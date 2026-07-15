import { ScrollEffectsConfig } from './types.js';
export declare const createParallaxObserver: (config: Required<ScrollEffectsConfig>, callback: (entries: IntersectionObserverEntry[]) => void) => IntersectionObserver;
