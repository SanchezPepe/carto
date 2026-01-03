import { useState, useEffect } from 'react';

/**
 * useMediaQuery - Hook to detect screen size
 * @param {string} query - Media query string
 * @returns {boolean} - Whether the query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

/**
 * useIsMobile - Hook to detect mobile devices
 * @returns {boolean} - Whether device is mobile (<768px)
 */
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 767px)');
};

/**
 * useIsTablet - Hook to detect tablet devices
 * @returns {boolean} - Whether device is tablet (768px - 1023px)
 */
export const useIsTablet = () => {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
};

/**
 * useIsDesktop - Hook to detect desktop devices
 * @returns {boolean} - Whether device is desktop (>=1024px)
 */
export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1024px)');
};
