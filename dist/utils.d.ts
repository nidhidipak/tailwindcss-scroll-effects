import { ScrollEffectsConfig } from './types.js';
export declare const defaultConfig: Required<ScrollEffectsConfig>;
/** Linear interpolation for smooth animations */
export declare const lerp: (start: number, end: number, amt: number) => number;
/** Parse arbitrary values like [120px] or [-50%] */
export declare const parseArbitraryValue: (value: string) => string;
