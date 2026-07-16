export const createParallaxObserver = (config, callback) => {
    return new IntersectionObserver(callback, {
        threshold: config.threshold,
        rootMargin: '0px 0px -15% 0px'
    });
};
