/**
 * Extracts configuration values from the DOM element's classes or data attributes
 */
export const getElementParallaxSpeed = (el, defaultSpeed) => {
    if (el.classList.contains('scroll-parallax-slow'))
        return 0.2;
    if (el.classList.contains('scroll-parallax-medium'))
        return 0.5;
    if (el.classList.contains('scroll-parallax-fast'))
        return 1.0;
    // Check for layer-based speeds
    if (el.classList.contains('parallax-layer-back'))
        return 0.2;
    if (el.classList.contains('parallax-layer-middle'))
        return 0.5;
    if (el.classList.contains('parallax-layer-front'))
        return 0.8;
    // Custom arbitrary speed from CSS variable if passed
    const cssSpeed = getComputedStyle(el).getPropertyValue('--tw-scroll-speed').trim();
    if (cssSpeed) {
        const inlineSpeed = parseFloat(cssSpeed) / 100; // if scroll-speed-50 is used, it means 0.5
        if (!isNaN(inlineSpeed))
            return inlineSpeed;
    }
    return defaultSpeed;
};
