# Tailwind CSS Scroll Effects

A powerful, zero-dependency Tailwind CSS v4 plugin that brings scroll animations, 3D parallax, pinned horizontal tracks, and advanced SplitText typography engines directly into your utility classes. 

This plugin features a **Hybrid Engine**: It utilizes ultra-fast CSS `animation-timeline` in supported modern browsers, while deploying a fully synchronized, 60fps JavaScript `requestAnimationFrame` fallback for older browsers and advanced effects (like 3D parallax and mouse hybrid tilts) that CSS alone cannot achieve.

---

## ⚡ Features

- **Scroll Reveals:** Fade, Slide, Scale, Rotate, Flip, Blur.
- **SplitText Engine:** Automatically splits nested HTML and emojis into perfectly staggered character or word animations.
- **Pinned Horizontal Tracking:** Scroll down vertically to slide a track horizontally .
- **Core Parallax Engine:** Deep 3D Parallax (X, Y, Z depth), Scale Parallax, and Rotate Parallax.
- **Mouse Hybrid Tracking:** Elements subtly tilt and shift based on the user's cursor position while scrolling.
- **Staggered Animations:** Easily create cascading entrance animations for grids, lists, and cards.
- **Clip-Path Masking:** Advanced revealing masks (Circle, Reveal, Wave).

---

## 📦 Installation

Install the plugin via npm:

```bash
npm install tailwindcss-scroll-effects
```

Add it to your Tailwind v4 project by importing it in your main CSS file (`input.css` / `global.css`):

```css
@import 'tailwindcss';
@plugin 'tailwindcss-scroll-effects';
```

---

## 🚀 Initialization (CRUCIAL)

Because advanced features (like Parallax, SplitText, and Safari fallback support) require measuring the DOM and reading bounding boxes, you **MUST** initialize the Javascript runtime engine in your client-side code.

### Vanilla HTML / JS
```html
<script type="module">
  import { initScrollEffects } from 'tailwindcss-scroll-effects';
  
  // Call this once your DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
  });
</script>
```

### React / Next.js (App Router)
Create a Client Component provider in your root layout:
```tsx
'use client';
import { useEffect } from 'react';
import { initScrollEffects } from 'tailwindcss-scroll-effects';

export default function ScrollProvider({ children }) {
  useEffect(() => {
    initScrollEffects();
  }, []);

  return <>{children}</>;
}
```

### Vue 3 / Nuxt
```vue
<script setup>
import { onMounted } from 'vue';
import { initScrollEffects } from 'tailwindcss-scroll-effects';

onMounted(() => {
  initScrollEffects();
});
</script>
```

---

## 📖 Usage Guide

### 1. Basic Scroll Reveals
Attach these to any element to animate them as they enter the screen.

```html
<div class="scroll-fade-up">Fades up on scroll</div>
<div class="scroll-slide-left">Slides in from the left</div>
<div class="scroll-scale">Scales up on scroll</div>
<div class="scroll-rotate">Rotates into view</div>
<div class="scroll-blur">Unblurs as it enters</div>
```

### 2. Staggered Lists (Cards & Grids)
If you have a grid of items, wrap them in a `.scroll-stagger` container to sequentially delay them!

```html
<div class="scroll-stagger grid grid-cols-3">
  <div class="scroll-fade-up">Card 1 (Reveals First)</div>
  <div class="scroll-fade-up">Card 2 (Reveals Second)</div>
  <div class="scroll-fade-up">Card 3 (Reveals Third)</div>
</div>
```

### 3. SplitText Engine (Typography)
Dynamically splits raw text into animated characters or words. **Perfectly supports nested HTML tags and emojis.**

* `.text-split-chars`: Wraps every letter in a span.
* `.text-split-words`: Wraps every word in a span.
* Combine with `.text-split-fade-up` or `.text-split-blur` to determine the animation style.
* `.text-stagger-[10-100]`: Controls the millisecond delay between each character/word.

```html
<h1 class="text-split-chars text-split-fade-up text-stagger-20">
  This will animate character by character! 🚀
</h1>
```

### 4. Pinned Horizontal Track
Scroll down vertically to slide a track horizontally. 
1. The parent container MUST have `.scroll-parallax-track-container` and a massive height (e.g., `h-[300vh]`).
2. Inside, use a `sticky` wrapper.
3. The horizontal sliding track MUST have `.scroll-parallax-track-x`.

```html
<!-- Parent Container (200vh gives you plenty of scroll time) -->
<div class="h-[200vh] w-full scroll-parallax-track-container">
  
  <!-- Sticky Viewport -->
  <div class="sticky top-[20vh] h-[60vh] overflow-hidden flex items-center">
    
    <!-- The Sliding Track -->
    <div class="scroll-parallax-track-x flex w-max gap-8 px-12 transition-transform duration-75">
      
      <!-- Your Slides (Must have rigid widths) -->
      <div class="w-[100vw] h-96 bg-red-500">Slide 1</div>
      <div class="w-[100vw] h-96 bg-blue-500">Slide 2</div>
      
    </div>
  </div>
</div>
```

### 5. Advanced Core Parallax
Elements translate relative to the scroll speed.
* `.scroll-parallax-y-[value]` (e.g. `scroll-parallax-y-50` or negative `scroll-parallax-y-[-100px]`)
* `.scroll-parallax-x-[value]`
* `.scroll-parallax-rotate-[value]` (e.g. `scroll-parallax-rotate-45`)
* `.scroll-parallax-scale` (Scales dynamically based on scroll depth)

**3D Parallax:** Add `.scroll-perspective` and `.scroll-parallax-3d` to a parent container, then use `.scroll-parallax-z-[value]` on children to create massive 3D depth effects!

```html
<div class="parallax-container scroll-perspective scroll-parallax-3d relative h-96">
   <div class="parallax-layer-back scroll-parallax-z-[-200px] absolute">Deep Background</div>
   <div class="parallax-layer-front scroll-parallax-z-[150px] scroll-parallax-y-[-50px] absolute">Foreground floating element</div>
</div>
```

**Customizing Parallax Configuration:**
* `.scroll-speed-[1-200]`: Controls how fast the parallax effect occurs.
* `.scroll-range-end-[50-100]`: Forces the animation to finish when the element reaches X% of the viewport (e.g., `.scroll-range-end-50` makes it finish by the time it reaches the middle of the screen).

### 6. Mouse Hybrid Tilt
Want your parallax elements to react to the user's cursor while scrolling? Add `.scroll-parallax-mouse`.

```html
<div class="parallax-container">
  <div class="scroll-parallax-mouse scroll-parallax-y-[-50px]">
    I react to scroll AND mouse movement!
  </div>
</div>
```

---

## 🛠️ Performance Architecture
Unlike other JS heavy libraries, this plugin minimizes layout thrashing:
- All transforms are merged efficiently into matrix strings.
- Intersection Observers cleanly disconnect out-of-viewport calculations.
- Read/Write cycles in the `requestAnimationFrame` loop are strictly batched.

## License
MIT
