import { ScrollEffectsConfig } from './types.js';

export const defaultConfig: Required<ScrollEffectsConfig> = {
  duration: 700,
  threshold: 0.2,
  staggerDelay: 100,
  parallaxStrength: 50,
  speed: 0.5,
  smooth: true,
  useRAF: true,
  enableMouse: true
};

/** Linear interpolation for smooth animations */
export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

/** Parse arbitrary values like [120px] or [-50%] */
export const parseArbitraryValue = (value: string): string => {
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1);
  }
  return value;
};
