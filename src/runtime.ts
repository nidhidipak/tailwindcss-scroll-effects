import { ScrollEffectsConfig } from './types.js';
import { defaultConfig, lerp } from './utils.js';
import { buildTransform } from './transforms.js';
import { createParallaxObserver } from './observer.js';
import { getElementParallaxSpeed } from './parser.js';
import { initTextSplitting } from './text.js';

let isInitialized = false;
let observer: IntersectionObserver | null = null;
let parallaxElements: HTMLElement[] = [];
let progressElements: HTMLElement[] = [];
let requestAnimationFrameId: number | null = null;

let targetScrollY = 0;
let currentScrollY = 0;
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

const getOffsetTop = (el: HTMLElement) => {
  let top = 0;
  let current: HTMLElement | null = el;
  while(current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }
  return top;
};

const handleParallaxElement = (el: HTMLElement, scrollY: number, windowHeight: number, speed: number) => {
  const rectHeight = el.offsetHeight;
  const absoluteTop = getOffsetTop(el);
  const rectTop = absoluteTop - scrollY;
  
  // Only animate if in viewport or slightly outside (range check)
  const computed = getComputedStyle(el);
  const rangeStart = parseFloat(computed.getPropertyValue('--tw-scroll-range-start')) || 0;
  const rangeEnd = parseFloat(computed.getPropertyValue('--tw-scroll-range-end')) || 100;
  
  if (rectTop <= windowHeight && (rectTop + rectHeight) >= 0) {
    let scrollPercentage = (windowHeight - rectTop) / (windowHeight + rectHeight);
    let normalizedPercentage = Math.max(0, Math.min(1, scrollPercentage));
    
    // Apply range if specified
    if (rangeStart > 0 || rangeEnd < 100) {
      if (normalizedPercentage * 100 < rangeStart) normalizedPercentage = 0;
      else if (normalizedPercentage * 100 > rangeEnd) normalizedPercentage = 1;
      else {
        normalizedPercentage = (normalizedPercentage * 100 - rangeStart) / (rangeEnd - rangeStart);
      }
    }

    const transform = buildTransform(el, normalizedPercentage, scrollY, currentMouseX, currentMouseY, speed);

    if (transform) {
      el.style.transform = transform;
    }
    
    // Opacity parallax
    if (el.classList.contains('scroll-parallax-opacity')) {
      el.style.opacity = `${normalizedPercentage}`;
    }
    
    // Blur parallax
    if (el.classList.contains('scroll-parallax-blur')) {
      const maxBlur = 10;
      const currentBlur = maxBlur * (1 - normalizedPercentage);
      el.style.filter = `blur(${currentBlur}px)`;
    }

    // Clip Path Parallax
    if (el.classList.contains('scroll-parallax-clip-circle')) {
      // Use 150% to ensure corners of rectangular elements are fully covered
      el.style.clipPath = `circle(${normalizedPercentage * 150}% at 50% 50%)`;
    }
    if (el.classList.contains('scroll-parallax-clip-reveal')) {
      const inset = (1 - normalizedPercentage) * 100;
      el.style.clipPath = `inset(0 ${inset}% 0 0)`;
    }
    if (el.classList.contains('scroll-parallax-clip-wave')) {
      const depth = (1 - normalizedPercentage) * 25;
      const inverted = 100 - depth;
      // Removes calc() for better browser support and calculates the diagonal slant directly
      el.style.clipPath = `polygon(0 ${depth}%, 100% 0, 100% ${inverted}%, 0 100%)`;
    }

    //  Pinned Horizontal/Vertical Scroll
    if (el.classList.contains('scroll-parallax-track-container')) {
      const trackX = el.querySelector('.scroll-parallax-track-x') as HTMLElement;
      if (trackX) {
        let trackPercentage = -rectTop / (rectHeight - windowHeight);
        trackPercentage = Math.max(0, Math.min(1, trackPercentage));
        
        // Use the parent's actual width instead of window.innerWidth so it doesn't stop early on max-w containers
        const containerWidth = trackX.parentElement?.clientWidth || window.innerWidth;
        const trackWidth = trackX.scrollWidth - containerWidth;
        const moveX = trackWidth * trackPercentage;
        trackX.style.transform = `translate3d(-${moveX}px, 0, 0)`;
      }

      const trackY = el.querySelector('.scroll-parallax-track-y') as HTMLElement;
      if (trackY) {
        let trackPercentage = -rectTop / (rectHeight - windowHeight);
        trackPercentage = Math.max(0, Math.min(1, trackPercentage));
        
        const containerHeight = trackY.parentElement?.clientHeight || windowHeight;
        const trackTotalHeight = trackY.scrollHeight - containerHeight;
        const moveY = trackTotalHeight * trackPercentage;
        trackY.style.transform = `translate3d(0, -${moveY}px, 0)`;
      }
    }
  }
};

let currentMouseX = 0;
let currentMouseY = 0;

const renderLoop = (config: Required<ScrollEffectsConfig>) => {
  if (!config.useRAF) return;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  
  if (config.smooth) {
    currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);
  } else {
    currentScrollY = targetScrollY;
  }

  if (config.enableMouse) {
    currentMouseX = lerp(currentMouseX, targetMouseX, 0.1);
    currentMouseY = lerp(currentMouseY, targetMouseY, 0.1);
  }

  // Progress
  const progress = Math.max(0, Math.min(1, currentScrollY / documentHeight));
  document.documentElement.style.setProperty('--tw-scroll-progress-percent', `${progress * 100}%`);

  progressElements.forEach((el) => {
    if (!el.classList.contains('scroll-progress-circle')) {
      el.style.transform = `scaleX(${progress})`;
    }
  });

  // Parallax elements
  parallaxElements.forEach((el) => {
    const speed = getElementParallaxSpeed(el, config.speed);
    handleParallaxElement(el, currentScrollY, windowHeight, speed);
  });

  requestAnimationFrameId = requestAnimationFrame(() => renderLoop(config));
};

const onScroll = () => {
  targetScrollY = window.scrollY;
};

const onMouseMove = (e: MouseEvent) => {
  targetMouseX = e.clientX - window.innerWidth / 2;
  targetMouseY = e.clientY - window.innerHeight / 2;
};

const observeElements = (config: Required<ScrollEffectsConfig>) => {
  if (observer) observer.disconnect();

  observer = createParallaxObserver(config, (entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        // Handle stagger
        const parent = target.closest('.scroll-stagger');
        if (parent) {
          const children = Array.from(parent.querySelectorAll('[class*="scroll-"]'));
          const index = children.indexOf(target);
          if (index > -1) {
            const delay = config.staggerDelay * index;
            target.style.setProperty('--tw-scroll-delay', `${delay}ms`);
          }
        }
        target.classList.add('is-revealed');
      } else {
        target.classList.remove('is-revealed');
      }
    });
  });

  const revealElements = document.querySelectorAll(
    '[class*="scroll-reveal"], [class*="scroll-fade"], [class*="scroll-slide"], [class*="scroll-scale"], [class*="scroll-rotate"], [class*="scroll-flip"], [class*="scroll-blur"], [class*="scroll-text-"], [class*="scroll-image-"], [class*="-scroll"], [class*="text-split-"]'
  );
  
  revealElements.forEach((el) => {
    // Skip elements inside a horizontal container, they are handled separately
    if (!el.closest('.scroll-x-container')) {
      observer!.observe(el);
    }
  });

  // Dedicated observer for horizontal scroll containers
  const horizontalContainers = document.querySelectorAll('.scroll-x-container');
  horizontalContainers.forEach((container) => {
    const xObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.classList.add('is-revealed');
        }
      });
    }, {
      root: container,
      threshold: 0.15
    });

    const xChildren = container.querySelectorAll(
      '[class*="scroll-reveal"], [class*="scroll-fade"], [class*="scroll-slide"], [class*="scroll-scale"], [class*="scroll-rotate"], [class*="scroll-flip"], [class*="scroll-blur"], [class*="scroll-text-"]'
    );
    xChildren.forEach(child => xObserver.observe(child));
  });

  // Dedicated observer for snap containers (Active state and Indicators)
  const snapContainers = document.querySelectorAll('.snap-y, .snap-x');
  snapContainers.forEach((container) => {
    const hasIndicator = container.classList.contains('scroll-snap-indicator');
    const slides = Array.from(container.querySelectorAll('.snap-start')) as HTMLElement[];
    let indicatorWrapper: HTMLElement | null = null;
    
    if (hasIndicator && slides.length > 0) {
      // Create dot indicators automatically
      indicatorWrapper = document.createElement('div');
      // Use sticky wrapper that takes 0 space
      indicatorWrapper.className = 'sticky top-1/2 z-50 h-0 w-full pointer-events-none';
      
      const dotContainer = document.createElement('div');
      dotContainer.className = 'absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3';

      slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `w-2.5 h-2.5 shrink-0 rounded-full bg-white/20 transition-all duration-300 pointer-events-auto`;
        dotContainer.appendChild(dot);
      });
      
      indicatorWrapper.appendChild(dotContainer);
      // Prepend so it sits at the top and sticks as we scroll down
      container.prepend(indicatorWrapper);
    }

    const snapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          // Toggle active classes for custom tailwind variant
          slides.forEach(s => s.classList.remove('is-snap-active'));
          target.classList.add('is-snap-active');
          
          // Update indicators if they exist
          if (indicatorWrapper) {
            const index = slides.indexOf(target);
            // The dots are inside the first child (the absolute container)
            const dotContainer = indicatorWrapper.firstChild as HTMLElement;
            if (dotContainer) {
              const dots = Array.from(dotContainer.children) as HTMLElement[];
              dots.forEach((dot, i) => {
                if (i === index) {
                  dot.classList.add('bg-white', 'scale-125');
                  dot.classList.remove('bg-white/20');
                } else {
                  dot.classList.remove('bg-white', 'scale-125');
                  dot.classList.add('bg-white/20');
                }
              });
            }
          }
        }
      });
    }, {
      root: container,
      threshold: 0.5 // Trigger when a slide is at least 50% visible
    });

    slides.forEach(slide => snapObserver.observe(slide));

    // FIX SCROLL TRAP: Manually bubble wheel events when at the top/bottom boundary
    container.addEventListener('wheel', (e) => {
      const wheelEvent = e as WheelEvent;
      const isScrollingDown = wheelEvent.deltaY > 0;
      const isAtBottom = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;
      const isAtTop = container.scrollTop <= 0;

      if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
        window.scrollBy({ top: wheelEvent.deltaY, behavior: 'auto' });
      }
    }, { passive: true });
  });

  parallaxElements = Array.from(document.querySelectorAll('[class*="scroll-parallax"], [class*="parallax-layer"], .scroll-parallax-track-container')) as HTMLElement[];
  progressElements = Array.from(document.querySelectorAll('[class*="scroll-progress"]')) as HTMLElement[];
};

export const initScrollEffects = (options: ScrollEffectsConfig = {}) => {
  if (typeof window === 'undefined') return;
  
  const config = { ...defaultConfig, ...options };
  
  if (isInitialized) {
    cleanupScrollEffects();
  }
  
  targetScrollY = window.scrollY;
  currentScrollY = window.scrollY;

  // Initialize  text splitting
  initTextSplitting();

  observeElements(config);

  if (config.useRAF) {
    window.addEventListener('scroll', onScroll, { passive: true });
    if (config.enableMouse) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }
    requestAnimationFrameId = requestAnimationFrame(() => renderLoop(config));
  } else {
    // Basic fallback without RAF
    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
      currentScrollY = targetScrollY;
      const windowHeight = window.innerHeight;
      parallaxElements.forEach((el) => {
        handleParallaxElement(el, currentScrollY, windowHeight, config.speed);
      });
    }, { passive: true });
  }

  isInitialized = true;
};

export const cleanupScrollEffects = () => {
  if (typeof window === 'undefined') return;
  
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  if (requestAnimationFrameId !== null) {
    cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = null;
  }
  
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('mousemove', onMouseMove);
  
  isInitialized = false;
};
