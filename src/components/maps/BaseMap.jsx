/**
 * BaseMap Component
 *
 * A reusable base map component using react-map-gl with MapLibre.
 * Provides the foundation for all map visualizations in TerraVista.
 *
 * @component
 */

import { useState, useCallback, useEffect } from 'react';
import Map, { NavigationControl, ScaleControl, FullscreenControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// Free map styles
const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  streets: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
};

/**
 * BaseMap - Foundation map component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components (layers, markers, etc.)
 * @param {Object} props.initialViewState - Initial map view (center, zoom)
 * @param {string} props.mapStyle - Map style key ('light', 'dark', 'streets')
 * @param {Function} props.onMove - Callback when map moves
 * @param {Function} props.onClick - Callback when map is clicked
 * @param {Function} props.onHover - Callback when hovering over map
 * @param {boolean} props.interactive - Whether map is interactive
 * @param {string} props.cursor - Cursor style
 */
const BaseMap = ({
  children,
  initialViewState = {
    longitude: -102.5528,
    latitude: 23.6345,
    zoom: 4.5
  },
  mapStyle = 'light',
  onMove,
  onClick,
  onHover,
  interactive = true,
  cursor = 'auto',
  className = ''
}) => {
  const [viewState, setViewState] = useState(initialViewState);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  // Observe dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
    onMove?.(evt);
  }, [onMove]);

  // Auto-select style based on dark mode if not explicitly set
  const activeStyle = mapStyle === 'auto'
    ? (isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light)
    : MAP_STYLES[mapStyle] || MAP_STYLES.light;

  return (
    <Map
      {...viewState}
      onMove={handleMove}
      onClick={onClick}
      onMouseMove={onHover}
      mapStyle={activeStyle}
      style={{ width: '100%', height: '100%' }}
      interactive={interactive}
      cursor={cursor}
      className={className}
      attributionControl={true}
    >
      {/* Navigation Controls */}
      <NavigationControl position="top-right" />
      <ScaleControl position="bottom-left" />
      <FullscreenControl position="top-right" />

      {/* Child components (layers, markers, popups) */}
      {children}
    </Map>
  );
};

export default BaseMap;
export { MAP_STYLES };
