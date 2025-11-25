// Lazy loading images
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[loading="lazy"]')
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.classList.add('loaded')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach((img) => imageObserver.observe(img))
  }
}

// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

// Web Vitals monitoring
export const reportWebVitals = (metric) => {
  if (import.meta.env.PROD) {
    // Send to analytics service
    console.log(metric)
  }
}
