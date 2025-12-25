/**
 * Map Helper Utilities
 *
 * Functions for working with geographic data and Leaflet maps.
 * These utilities help with dynamic script loading and data processing.
 *
 * @module mapHelpers
 */

/**
 * Dynamically loads Leaflet library
 * This approach avoids SSR issues and ensures Leaflet is loaded when needed
 *
 * @returns {Promise<void>} Promise that resolves when Leaflet is loaded
 *
 * @example
 * await loadLeaflet();
 * const map = L.map('map');
 */
export const loadLeaflet = () => {
  return new Promise((resolve, reject) => {
    // Check if Leaflet is already loaded
    if (window.L) {
      resolve();
      return;
    }

    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    cssLink.crossOrigin = '';
    document.head.appendChild(cssLink);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Leaflet'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Finds a feature in GeoJSON by its ID property
 *
 * @param {Object} geojson - GeoJSON FeatureCollection
 * @param {string} id - ID to search for
 * @param {string} idProperty - Property name that contains the ID (default: 'id')
 * @returns {Object|null} GeoJSON feature or null if not found
 *
 * @example
 * const feature = findFeatureById(geojson, 'CA', 'state_code');
 */
export const findFeatureById = (geojson, id, idProperty = 'id') => {
  if (!geojson || !geojson.features) {
    return null;
  }

  return geojson.features.find(
    feature => feature.properties[idProperty] === id
  ) || null;
};

/**
 * Extracts the center coordinates from a GeoJSON feature
 *
 * @param {Object} feature - GeoJSON feature
 * @returns {Array<number>|null} [lat, lng] or null if invalid
 *
 * @example
 * const center = getFeatureCenter(feature);
 * map.setView(center, 10);
 */
export const getFeatureCenter = (feature) => {
  if (!feature || !feature.geometry) {
    return null;
  }

  const { geometry } = feature;

  // For Point geometries
  if (geometry.type === 'Point') {
    return [geometry.coordinates[1], geometry.coordinates[0]];
  }

  // For Polygon/MultiPolygon, calculate bounds center
  if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    const coords = geometry.type === 'Polygon'
      ? geometry.coordinates[0]
      : geometry.coordinates[0][0];

    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);

    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2
    ];
  }

  return null;
};

/**
 * Creates a default Leaflet map style configuration
 *
 * @returns {Object} Style configuration object
 */
export const getDefaultMapStyle = () => ({
  fillColor: '#3b82f6',
  fillOpacity: 0.7,
  color: '#ffffff',
  weight: 2,
  opacity: 1
});

/**
 * Creates a highlight style for map features
 *
 * @returns {Object} Highlight style configuration
 */
export const getHighlightStyle = () => ({
  weight: 4,
  color: '#1e40af',
  fillOpacity: 0.9
});

/**
 * Validates if a GeoJSON object is properly formatted
 *
 * @param {Object} geojson - Object to validate
 * @returns {boolean} True if valid GeoJSON
 */
export const isValidGeoJSON = (geojson) => {
  if (!geojson || typeof geojson !== 'object') {
    return false;
  }

  if (geojson.type !== 'FeatureCollection' && geojson.type !== 'Feature') {
    return false;
  }

  if (geojson.type === 'FeatureCollection' && !Array.isArray(geojson.features)) {
    return false;
  }

  return true;
};

/**
 * Merges GeoJSON data with external dataset
 *
 * @param {Object} geojson - GeoJSON FeatureCollection
 * @param {Object} data - Data object with region IDs as keys
 * @param {string} idProperty - GeoJSON property to match with data keys
 * @returns {Object} New GeoJSON with merged data in properties
 *
 * @example
 * const merged = mergeGeoJSONWithData(geojson, { 'CA': 39538223 }, 'state_code');
 * // Each feature will have a 'value' property with the corresponding data
 */
export const mergeGeoJSONWithData = (geojson, data, idProperty = 'id') => {
  if (!isValidGeoJSON(geojson) || !data) {
    return geojson;
  }

  const merged = { ...geojson };
  merged.features = geojson.features.map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      value: data[feature.properties[idProperty]] || null
    }
  }));

  return merged;
};
