
import { useCallback, useEffect } from 'react';

export function useScrollAnimation() {
  const initScrollAnimations = useCallback(() => {
    const animateOnScroll = () => {
      const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
      );

      animatedElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = elementTop < window.innerHeight - 50 && elementBottom > 0;

        if (isVisible) {
          element.classList.add('animate');
        }
      });
    };

    // Add animation classes to CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Base styles for animations */
      .fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in {
        opacity: 0;
        transition: transform 0.6s ease-out, opacity 0.6s ease-out;
      }
      
      /* Animation variants */
      .fade-in-up {
        transform: translateY(20px);
      }
      
      .fade-in-left {
        transform: translateX(-20px);
      }
      
      .fade-in-right {
        transform: translateX(20px);
      }
      
      .scale-in {
        transform: scale(0.95);
      }
      
      /* Animated state */
      .animate {
        opacity: 1;
        transform: translate(0) scale(1);
      }
      
      /* Delay classes */
      .delay-100 {
        transition-delay: 100ms;
      }
      
      .delay-200 {
        transition-delay: 200ms;
      }
      
      .delay-300 {
        transition-delay: 300ms;
      }
      
      .delay-400 {
        transition-delay: 400ms;
      }
      
      .delay-500 {
        transition-delay: 500ms;
      }
    `;
    
    // Remove existing style if it exists to prevent duplication
    const existingStyle = document.getElementById('scroll-animation-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.id = 'scroll-animation-styles';
    document.head.appendChild(style);

    // Run once to animate elements already in viewport
    animateOnScroll();

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll, { passive: true });
    
    // Clean up function
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  useEffect(() => {
    const cleanup = initScrollAnimations();
    return cleanup;
  }, [initScrollAnimations]);

  return { initScrollAnimations };
}
