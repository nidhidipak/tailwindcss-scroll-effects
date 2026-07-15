import plugin from 'tailwindcss/plugin';
import { defaultConfig } from './utils.js';
const scrollEffectsPlugin = plugin.withOptions((options = {}) => {
    return ({ addUtilities, addBase, matchUtilities, theme, addVariant }) => {
        const config = { ...defaultConfig, ...options };
        const duration = `${config.duration}ms`;
        // -----------------------------------------------------
        // 1. ADD SNAP-ACTIVE VARIANT
        // -----------------------------------------------------
        addVariant('snap-active', '&.is-snap-active, .is-snap-active &');
        // Base utility for all scroll effects
        const scrollClasses = [
            '.scroll-reveal', '.scroll-fade', '.scroll-fade-up', '.scroll-fade-down',
            '.scroll-slide-left', '.scroll-slide-right', '.scroll-scale', '.scroll-rotate',
            '.scroll-flip', '.scroll-blur'
        ].join(', ');
        addUtilities({
            [scrollClasses]: {
                '--tw-scroll-duration': duration,
                '--tw-scroll-delay': '0ms',
                'transition': 'all var(--tw-scroll-duration) cubic-bezier(0.4, 0, 0.2, 1) var(--tw-scroll-delay)',
                'opacity': '0',
                'will-change': 'transform, opacity, filter',
            }
        });
        // Revealed state
        const revealedClasses = scrollClasses.split(', ').map(c => `${c}.is-revealed`).join(', ');
        addUtilities({
            [revealedClasses]: {
                'opacity': '1',
                'transform': 'translate3d(0, 0, 0) scale(1) rotate(0) rotateX(0) rotateY(0)',
                'filter': 'blur(0)',
            }
        });
        // Specific initial states
        addUtilities({
            '.scroll-fade-up': { 'transform': 'translate3d(0, 50px, 0)' },
            '.scroll-fade-down': { 'transform': 'translate3d(0, -50px, 0)' },
            '.scroll-slide-left': { 'transform': 'translate3d(-50px, 0, 0)' },
            '.scroll-slide-right': { 'transform': 'translate3d(50px, 0, 0)' },
            '.scroll-scale': { 'transform': 'scale(0.8)' },
            '.scroll-rotate': { 'transform': 'rotate(-15deg)' },
            '.scroll-flip': { 'transform': 'rotateX(90deg)', 'perspective': '1000px' },
            '.scroll-blur': { 'filter': 'blur(10px)' },
        });
        // CSS Scroll-driven animations fallback / enhancement
        addUtilities({
            [scrollClasses]: {
                '@supports (animation-timeline: view())': {
                    'animation-name': 'tw-scroll-reveal',
                    'animation-fill-mode': 'both',
                    'animation-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
                    'animation-timeline': 'view()',
                    'animation-range': 'entry 25% cover 50%',
                    'transition': 'none',
                    'opacity': '1',
                }
            },
            '.scroll-fade-up': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-fade-up' } },
            '.scroll-fade-down': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-fade-down' } },
            '.scroll-slide-left': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-slide-left' } },
            '.scroll-slide-right': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-slide-right' } },
            '.scroll-scale': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-scale' } },
            '.scroll-rotate': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-rotate' } },
            '.scroll-flip': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-flip' } },
            '.scroll-blur': { '@supports (animation-timeline: view())': { 'animation-name': 'tw-scroll-blur' } },
            '.scroll-axis-x': { '@supports (animation-timeline: view())': { 'animation-timeline': 'view(inline) !important' } },
        });
        // Keyframes
        addBase({
            '@supports (animation-timeline: view())': {
                '@keyframes tw-scroll-reveal': {
                    'from': { 'opacity': '0' },
                    'to': { 'opacity': '1', 'transform': 'translate3d(0, 0, 0) scale(1) rotate(0) rotateX(0) rotateY(0)', 'filter': 'blur(0)' }
                },
                '@keyframes tw-scroll-fade-up': {
                    'from': { 'opacity': '0', 'transform': 'translate3d(0, 50px, 0)' },
                    'to': { 'opacity': '1', 'transform': 'translate3d(0, 0, 0)' }
                },
                '@keyframes tw-scroll-fade-down': {
                    'from': { 'opacity': '0', 'transform': 'translate3d(0, -50px, 0)' },
                    'to': { 'opacity': '1', 'transform': 'translate3d(0, 0, 0)' }
                },
                '@keyframes tw-scroll-slide-left': {
                    'from': { 'opacity': '0', 'transform': 'translate3d(-50px, 0, 0)' },
                    'to': { 'opacity': '1', 'transform': 'translate3d(0, 0, 0)' }
                },
                '@keyframes tw-scroll-slide-right': {
                    'from': { 'opacity': '0', 'transform': 'translate3d(50px, 0, 0)' },
                    'to': { 'opacity': '1', 'transform': 'translate3d(0, 0, 0)' }
                },
                '@keyframes tw-scroll-scale': {
                    'from': { 'opacity': '0', 'transform': 'scale(0.8)' },
                    'to': { 'opacity': '1', 'transform': 'scale(1)' }
                },
                '@keyframes tw-scroll-rotate': {
                    'from': { 'opacity': '0', 'transform': 'rotate(-15deg)' },
                    'to': { 'opacity': '1', 'transform': 'rotate(0)' }
                },
                '@keyframes tw-scroll-flip': {
                    'from': { 'opacity': '0', 'transform': 'rotateX(90deg)' },
                    'to': { 'opacity': '1', 'transform': 'rotateX(0)' }
                },
                '@keyframes tw-scroll-blur': {
                    'from': { 'opacity': '0', 'filter': 'blur(10px)' },
                    'to': { 'opacity': '1', 'filter': 'blur(0)' }
                }
            },
            '@supports (animation-timeline: scroll())': {
                '@keyframes tw-scroll-progress': {
                    'from': { 'transform': 'scaleX(0)' },
                    'to': { 'transform': 'scaleX(1)' }
                }
            }
        });
        // Advanced Parallax utilities
        matchUtilities({
            'scroll-parallax-y': (value) => ({
                '--tw-scroll-parallax-y': value,
                'will-change': 'transform',
            }),
            'scroll-parallax-x': (value) => ({
                '--tw-scroll-parallax-x': value,
                'will-change': 'transform',
            }),
            'scroll-parallax-z': (value) => ({
                '--tw-scroll-parallax-z': value,
                'will-change': 'transform',
            }),
        }, { values: theme('spacing') });
        matchUtilities({
            'scroll-parallax-scale': (value) => ({
                '--tw-scroll-parallax-scale': value,
                'will-change': 'transform',
            }),
        }, { values: theme('scale') });
        matchUtilities({
            'scroll-parallax-rotate': (value) => ({
                '--tw-scroll-parallax-rotate': value,
                'will-change': 'transform',
            }),
            'scroll-parallax-rotate-x': (value) => ({
                '--tw-scroll-parallax-rotate-x': value,
                'will-change': 'transform',
            }),
            'scroll-parallax-rotate-y': (value) => ({
                '--tw-scroll-parallax-rotate-y': value,
                'will-change': 'transform',
            }),
        }, { values: theme('rotate') });
        // Scroll Speed Custom
        matchUtilities({
            'scroll-speed': (value) => ({
                '--tw-scroll-speed': value,
            }),
            'scroll-range-start': (value) => ({
                '--tw-scroll-range-start': value,
            }),
            'scroll-range-end': (value) => ({
                '--tw-scroll-range-end': value,
            }),
        }, { values: { '10': '10', '20': '20', '30': '30', '50': '50', '80': '80', '100': '100' } });
        // Extra utility flags
        addUtilities({
            '.scroll-parallax-3d': {
                'transform-style': 'preserve-3d',
            },
            '.scroll-perspective': {
                'perspective': '1000px',
            },
            '.parallax-container': {
                'position': 'relative',
                'overflow': 'hidden',
                'display': 'block'
            },
            '.parallax-item': {
                'display': 'block',
                'will-change': 'transform'
            },
            '.scroll-sticky-parallax': {
                'position': 'sticky',
                'top': '0',
                'height': '100vh',
                'overflow': 'hidden'
            },
            '.scroll-parallax-tilt': {
                'will-change': 'transform'
            },
            '.scroll-parallax-blur': {
                'will-change': 'filter'
            },
            '.scroll-parallax-opacity': {
                'will-change': 'opacity'
            },
            '.scroll-parallax-mouse': {
                'will-change': 'transform'
            },
            '.scroll-parallax-clip-circle': { 'will-change': 'clip-path' },
            '.scroll-parallax-clip-reveal': { 'will-change': 'clip-path' },
            '.scroll-parallax-clip-wave': { 'will-change': 'clip-path' },
            // Preset layer speeds
            '.parallax-layer-back': { 'will-change': 'transform', 'z-index': '0' },
            '.parallax-layer-middle': { 'will-change': 'transform', 'z-index': '10' },
            '.parallax-layer-front': { 'will-change': 'transform', 'z-index': '20' },
            '.scroll-parallax-slow': {},
            '.scroll-parallax-medium': {},
            '.scroll-parallax-fast': {},
        });
        // Duration match utility
        matchUtilities({
            'scroll-duration': (value) => ({
                '--tw-scroll-duration': value,
            }),
        }, { values: theme('transitionDuration') });
        // Stagger
        addUtilities({
            '.scroll-stagger': {
                '--tw-scroll-stagger': `${config.staggerDelay}ms`,
            },
            // Disable CSS Scroll Timeline for staggered children to allow time-based JS delays
            '.scroll-stagger [class*="scroll-"], .scroll-x-container [class*="scroll-"]': {
                'animation-timeline': 'none !important',
                'animation-name': 'none !important',
                'transition': 'all var(--tw-scroll-duration) cubic-bezier(0.4, 0, 0.2, 1) var(--tw-scroll-delay, 0ms) !important',
            }
        });
        // Image Reveals (Extended)
        addUtilities({
            '.scroll-image-reveal': {
                'position': 'relative',
                'overflow': 'hidden',
            },
            '.scroll-image-reveal::after': {
                'content': '""',
                'position': 'absolute',
                'inset': '0',
                'background-color': 'currentColor',
                'transition': `all var(--tw-scroll-duration, ${duration}) cubic-bezier(0.4, 0, 0.2, 1)`,
                'z-index': '10',
            },
            '.image-reveal-left::after': { 'transform-origin': 'right', 'transform': 'scaleX(1)' },
            '.image-reveal-right::after': { 'transform-origin': 'left', 'transform': 'scaleX(1)' },
            '.image-reveal-top::after': { 'transform-origin': 'bottom', 'transform': 'scaleY(1)' },
            '.image-reveal-bottom::after': { 'transform-origin': 'top', 'transform': 'scaleY(1)' },
            '.image-reveal-circle::after': { 'clip-path': 'circle(100% at 50% 50%)' },
            '.image-reveal-curtain::after': { 'transform-origin': 'center', 'transform': 'scaleX(1)' },
            '.image-reveal-left.is-revealed::after, .image-reveal-right.is-revealed::after': { 'transform': 'scaleX(0)' },
            '.image-reveal-top.is-revealed::after, .image-reveal-bottom.is-revealed::after': { 'transform': 'scaleY(0)' },
            '.image-reveal-circle.is-revealed::after': { 'clip-path': 'circle(0% at 50% 50%)' },
            '.image-reveal-curtain.is-revealed::after': { 'transform': 'scaleX(0)' },
        });
        // Progress utilities (Extended)
        addUtilities({
            '.scroll-progress-top': {
                'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%', 'height': '4px',
                'background': 'currentColor', 'transform-origin': '0% 50%', 'transform': 'scaleX(0)',
                'z-index': '9999', 'will-change': 'transform',
                '@supports (animation-timeline: scroll())': { 'animation': 'tw-scroll-progress auto linear', 'animation-timeline': 'scroll(root)' }
            },
            '.scroll-progress-bottom': {
                'position': 'fixed', 'bottom': '0', 'left': '0', 'width': '100%', 'height': '4px',
                'background': 'currentColor', 'transform-origin': '0% 50%', 'transform': 'scaleX(0)',
                'z-index': '9999', 'will-change': 'transform',
                '@supports (animation-timeline: scroll())': { 'animation': 'tw-scroll-progress auto linear', 'animation-timeline': 'scroll(root)' }
            },
            '.scroll-progress-circle': {
                'position': 'fixed', 'bottom': '2rem', 'right': '2rem', 'width': '3rem', 'height': '3rem',
                'border-radius': '9999px',
                'background': 'conic-gradient(currentColor var(--tw-scroll-progress-percent, 0%), transparent 0)',
                'z-index': '9999'
            },
            '.scroll-progress-circle::after': {
                'content': '""',
                'position': 'absolute', 'inset': '4px', 'background-color': 'var(--tw-scroll-bg, white)', 'border-radius': '9999px'
            },
            '.scroll-progress-bar': {
                '@apply scroll-progress-top': {} // Alias
            }
        });
        // Text Utilities
        addUtilities({
            '.scroll-text-reveal': {
                'background': 'linear-gradient(90deg, var(--tw-scroll-text-color, white) 50%, transparent 50%)',
                'background-size': '200% 100%',
                'background-position': '100% 0',
                'background-clip': 'text',
                '-webkit-background-clip': 'text',
                'color': 'transparent',
                'transition': `background-position var(--tw-scroll-duration, ${duration}) ease`,
            },
            '.scroll-text-reveal.is-revealed': {
                'background-position': '0 0',
            },
            '.scroll-text-gradient-reveal': {
                'background-size': '200% 100%',
                'background-position': '100% 0',
                'background-clip': 'text',
                '-webkit-background-clip': 'text',
                'color': 'transparent',
                'transition': `background-position var(--tw-scroll-duration, ${duration}) ease`,
            },
            '.scroll-text-gradient-reveal.is-revealed': {
                'background-position': '0 0',
            },
            '.scroll-text-blur': {
                'filter': 'blur(10px)',
                'opacity': '0',
                'transition': `all var(--tw-scroll-duration, ${duration}) ease`,
            },
            '.scroll-text-blur.is-revealed': {
                'filter': 'blur(0)',
                'opacity': '1',
            },
            // Text Splitting
            '.text-split-chars .tw-split-char, .text-split-words .tw-split-word': {
                'opacity': '0',
                'transform': 'translateY(1em) scale(0.8)',
                'filter': 'blur(10px)',
                'transition': `all var(--tw-scroll-duration, ${duration}) cubic-bezier(0.4, 0, 0.2, 1) calc(var(--tw-split-index, 0) * var(--tw-split-stagger, 30ms))`,
                'will-change': 'transform, opacity, filter',
            },
            '.text-split-chars.is-revealed .tw-split-char, .text-split-words.is-revealed .tw-split-word': {
                'opacity': '1',
                'transform': 'translateY(0) scale(1)',
                'filter': 'blur(0)',
            },
            // Variations for Text Splitting
            '.text-split-fade-up .tw-split-char, .text-split-fade-up .tw-split-word': {
                'opacity': '0',
                'transform': 'translateY(1.5em)',
                'filter': 'none'
            },
            '.text-split-blur .tw-split-char, .text-split-blur .tw-split-word': {
                'opacity': '0',
                'transform': 'none',
                'filter': 'blur(12px)'
            }
        });
        matchUtilities({
            'text-stagger': (value) => ({
                '--tw-split-stagger': value,
            }),
        }, { values: { '10': '10ms', '20': '20ms', '30': '30ms', '50': '50ms', '100': '100ms' } });
        // Ready-made combo utility classes
        addUtilities({
            '.hero-scroll': {
                '@apply scroll-fade-up scroll-blur scroll-duration-1000': {}
            },
            '.card-scroll': {
                '@apply scroll-fade-up scroll-scale': {}
            },
            '.image-scroll': {
                '@apply scroll-image-reveal image-reveal-left': {}
            },
            '.section-scroll': {
                '@apply scroll-fade scroll-duration-700': {}
            }
        });
    };
}, () => ({
    theme: {
        extend: {},
    },
}));
export default scrollEffectsPlugin;
