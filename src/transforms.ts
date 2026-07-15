/**
 * Builds the combined CSS transform string based on extracted CSS variables
 */
export const buildTransform = (el: HTMLElement, normalizedPercentage: number, scrollY: number, mouseX: number, mouseY: number, speed: number): string => {
  const computed = getComputedStyle(el);
  
  const yValue = computed.getPropertyValue('--tw-scroll-parallax-y').trim();
  const xValue = computed.getPropertyValue('--tw-scroll-parallax-x').trim();
  const zValue = computed.getPropertyValue('--tw-scroll-parallax-z').trim();
  const scaleValue = computed.getPropertyValue('--tw-scroll-parallax-scale').trim();
  const rotateValue = computed.getPropertyValue('--tw-scroll-parallax-rotate').trim();
  const rotateXValue = computed.getPropertyValue('--tw-scroll-parallax-rotate-x').trim();
  const rotateYValue = computed.getPropertyValue('--tw-scroll-parallax-rotate-y').trim();
  
  let transform = '';
  // Maps 0->1 to 1->-1, and multiply by speed
  const multiplier = (1 - (2 * normalizedPercentage)) * (speed * 2);
  
  if (zValue) {
    transform += `translateZ(calc(${zValue} * ${multiplier})) `;
  }
  if (yValue) {
    transform += `translateY(calc(${yValue} * ${multiplier})) `;
  }
  if (xValue) {
    transform += `translateX(calc(${xValue} * ${multiplier})) `;
  }
  if (scaleValue) {
    const targetScale = parseFloat(scaleValue) || 1.1;
    const currentScale = 1 + ((targetScale - 1) * normalizedPercentage);
    transform += `scale(${currentScale}) `;
  }
  if (rotateValue) {
    const targetRotate = parseFloat(rotateValue) || 15;
    const currentRotate = targetRotate * normalizedPercentage;
    transform += `rotate(${currentRotate}deg) `;
  }
  if (rotateXValue) {
    const targetRotateX = parseFloat(rotateXValue) || 15;
    transform += `rotateX(${targetRotateX * normalizedPercentage}deg) `;
  }
  if (rotateYValue) {
    const targetRotateY = parseFloat(rotateYValue) || 15;
    transform += `rotateY(${targetRotateY * normalizedPercentage}deg) `;
  }

  // Mouse hybrid
  if (el.classList.contains('scroll-parallax-mouse')) {
    const mouseStrength = 0.05;
    transform += `translate3d(${mouseX * mouseStrength}px, ${mouseY * mouseStrength}px, 0) `;
  }

  // Tilt
  if (el.classList.contains('scroll-parallax-tilt')) {
    transform += `rotateX(${mouseY * 0.02}deg) rotateY(${mouseX * 0.02}deg) `;
  }

  return transform.trim();
};
