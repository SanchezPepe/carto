/**
 * State Navigation Utilities
 *
 * Functions to calculate bounding boxes and view states
 * for navigating to Mexican states on the map.
 */

import { FlyToInterpolator } from '@deck.gl/core';

/**
 * Default view state for Mexico (national view)
 */
export const DEFAULT_VIEW_STATE = {
  longitude: -102.5528,
  latitude: 23.6345,
  zoom: 4.5,
  pitch: 0,
  bearing: 0
};

/**
 * Calculate the bounding box of a state from GeoJSON
 * @param {Object} geojson - The GeoJSON FeatureCollection
 * @param {string} stateId - The state ID to find
 * @returns {Object|null} Bounding box { minLng, maxLng, minLat, maxLat } or null
 */
export function getStateBoundingBox(geojson, stateId) {
  if (!geojson || !geojson.features) return null;

  const feature = geojson.features.find(f => f.properties.id === stateId);
  if (!feature) return null;

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const processCoordinates = (coords) => {
    if (typeof coords[0] === 'number') {
      // It's a point [lng, lat]
      minLng = Math.min(minLng, coords[0]);
      maxLng = Math.max(maxLng, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else {
      // It's an array of coordinates
      coords.forEach(processCoordinates);
    }
  };

  processCoordinates(feature.geometry.coordinates);

  return { minLng, maxLng, minLat, maxLat };
}

/**
 * Calculate view state to fit a bounding box
 * @param {Object} bounds - Bounding box { minLng, maxLng, minLat, maxLat }
 * @param {Object} options - Additional options
 * @returns {Object} View state for deck.gl
 */
export function calculateViewStateForBounds(bounds, options = {}) {
  if (!bounds) return DEFAULT_VIEW_STATE;

  const { minLng, maxLng, minLat, maxLat } = bounds;
  const { padding = 0.5 } = options;

  // Calculate center
  const longitude = (minLng + maxLng) / 2;
  const latitude = (minLat + maxLat) / 2;

  // Calculate zoom based on bounds size
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  // Approximate zoom level calculation
  // Smaller area = higher zoom
  let zoom;
  if (maxDiff < 1) zoom = 8;
  else if (maxDiff < 2) zoom = 7;
  else if (maxDiff < 4) zoom = 6;
  else if (maxDiff < 6) zoom = 5.5;
  else if (maxDiff < 8) zoom = 5;
  else zoom = 4.5;

  return {
    longitude,
    latitude,
    zoom,
    pitch: 0,
    bearing: 0,
    transitionDuration: 1500,
    transitionInterpolator: new FlyToInterpolator()
  };
}

/**
 * Get view state for a specific state
 * @param {Object} geojson - The GeoJSON FeatureCollection
 * @param {string} stateId - The state ID
 * @returns {Object} View state for deck.gl
 */
export function getViewStateForState(geojson, stateId) {
  const bounds = getStateBoundingBox(geojson, stateId);
  return calculateViewStateForBounds(bounds);
}

/**
 * Get the default (national) view state with transition
 * @returns {Object} View state for deck.gl
 */
export function getDefaultViewState() {
  return {
    ...DEFAULT_VIEW_STATE,
    transitionDuration: 1500,
    transitionInterpolator: new FlyToInterpolator()
  };
}
