/**
 * Performance Monitoring Utility
 * Tracks key performance metrics for the application
 */

// Only enable in production for real user monitoring
const ENABLE_MONITORING = import.meta.env.PROD;

/**
 * Log Core Web Vitals
 */
export const logWebVitals = () => {
  if (!ENABLE_MONITORING || typeof window === 'undefined') return;

  try {
    // Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    // Silently fail if Performance Observer is not supported
    if (import.meta.env.DEV) {
      console.warn('Performance monitoring not supported:', error);
    }
  }
};

/**
 * Measure component render time
 */
export const measureRender = (componentName, callback) => {
  if (!ENABLE_MONITORING) {
    return callback();
  }

  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();

  if (import.meta.env.DEV) {
    console.log(`${componentName} render time:`, `${(endTime - startTime).toFixed(2)}ms`);
  }

  return result;
};

/**
 * Report page load metrics
 */
export const reportPageMetrics = () => {
  if (!ENABLE_MONITORING || typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];

      if (perfData && import.meta.env.DEV) {
        console.log('Performance Metrics:', {
          'DNS Lookup': `${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms`,
          'TCP Connection': `${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms`,
          'Request Time': `${(perfData.responseStart - perfData.requestStart).toFixed(2)}ms`,
          'Response Time': `${(perfData.responseEnd - perfData.responseStart).toFixed(2)}ms`,
          'DOM Processing': `${(perfData.domComplete - perfData.domInteractive).toFixed(2)}ms`,
          'Total Load Time': `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`
        });
      }
    }, 0);
  });
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy load images
 */
export const lazyLoadImage = (imageElement) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    imageObserver.observe(imageElement);
  } else {
    // Fallback for browsers without IntersectionObserver
    imageElement.src = imageElement.dataset.src;
  }
};

export default {
  logWebVitals,
  measureRender,
  reportPageMetrics,
  debounce,
  throttle,
  lazyLoadImage
};
