/**
 * Advanced Text Splitting Engine
 * Supports nested HTML tags and Emojis via Array.from() which respects surrogate pairs.
 */
export declare const splitTextNode: (node: Text, splitType: "chars" | "words") => DocumentFragment;
export declare const recursiveSplit: (element: HTMLElement, splitType: "chars" | "words") => void;
export declare const initTextSplitting: () => void;
