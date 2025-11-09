import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export const useScrollAnimation = (
  animation: (element: HTMLElement) => gsap.core.Timeline | gsap.core.Tween,
  options: ScrollAnimationOptions = {}
) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      trigger = element,
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
      pin = false,
      markers = false,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
    } = options;

    const tl = animation(element);

    ScrollTrigger.create({
      trigger,
      start,
      end,
      scrub,
      pin,
      markers,
      animation: tl,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animation, options]);

  return elementRef;
};

export const fadeInUp = (element: HTMLElement, delay: number = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: "power2.out",
    }
  );
};

export const fadeInLeft = (element: HTMLElement, delay: number = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      x: -50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      delay,
      ease: "power2.out",
    }
  );
};

export const fadeInRight = (element: HTMLElement, delay: number = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      x: 50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      delay,
      ease: "power2.out",
    }
  );
};

export const staggerFadeInUp = (elements: HTMLElement[], stagger: number = 0.1) => {
  return gsap.fromTo(elements,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger,
      ease: "power2.out",
    }
  );
};

export const parallax = (element: HTMLElement, speed: number = 0.5) => {
  return gsap.fromTo(element,
    {
      y: 0,
    },
    {
      y: -100 * speed,
      ease: "none",
    }
  );
};

export const scaleIn = (element: HTMLElement, delay: number = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay,
      ease: "back.out(1.7)",
    }
  );
};
