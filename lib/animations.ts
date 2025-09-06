import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeIn = (element: Element | string, duration: number = 0.5, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
  );
};

// Fade out animation
export const fadeOut = (element: Element | string, duration: number = 0.5, delay: number = 0) => {
  return gsap.to(element, { opacity: 0, y: -20, duration, delay, ease: 'power2.in' });
};

// Scale in animation
export const scaleIn = (element: Element | string, duration: number = 0.5, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration, delay, ease: 'back.out(1.7)' }
  );
};

// Slide in from right
export const slideInRight = (element: Element | string, duration: number = 0.5, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
  );
};

// Slide in from left
export const slideInLeft = (element: Element | string, duration: number = 0.5, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
  );
};

// Slide in from bottom
export const slideInUp = (element: Element | string, duration: number = 0.5, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
  );
};

// Staggered animation for lists
export const staggerItems = (elements: Element[] | string, duration: number = 0.5, stagger: number = 0.1) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }
  );
};

// Pulse animation (for buttons or highlights)
export const pulse = (element: Element | string, duration: number = 0.5, scale: number = 1.05) => {
  return gsap.to(element, {
    scale: scale,
    duration: duration / 2,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 1
  });
};

// Create scroll trigger animation
export const createScrollAnimation = (
  trigger: Element | string,
  animation: gsap.core.Tween,
  start: string = 'top 80%',
  end: string = 'bottom 20%'
) => {
  return ScrollTrigger.create({
    trigger,
    start,
    end,
    animation,
    toggleActions: 'play none none reverse'
  });
};

// Animate page transition in
export const pageTransitionIn = () => {
  const tl = gsap.timeline();
  tl.fromTo(
    'main',
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: 'power2.out' }
  );
  return tl;
};

// Animate page transition out
export const pageTransitionOut = () => {
  const tl = gsap.timeline();
  tl.to('main', { opacity: 0, duration: 0.3, ease: 'power2.in' });
  return tl;
};

// Animate elements on page load
export const animateOnLoad = (selector: string, staggerTime: number = 0.1) => {
  if (typeof window === 'undefined') return;
  
  const elements = document.querySelectorAll(selector);
  gsap.set(elements, { opacity: 0, y: 20 });
  
  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: staggerTime,
    ease: 'power2.out',
    delay: 0.2
  });
};