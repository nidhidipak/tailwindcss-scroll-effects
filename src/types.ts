export interface ScrollEffectsConfig {
  duration?: number;
  threshold?: number;
  staggerDelay?: number;
  parallaxStrength?: number;
  
  // New configuration options requested by user
  speed?: number;
  smooth?: boolean;
  useRAF?: boolean;
  enableMouse?: boolean;
}
