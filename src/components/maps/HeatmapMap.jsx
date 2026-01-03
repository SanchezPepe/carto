/**
 * HeatmapMap Component
 *
 * Displays a heatmap visualization using deck.gl HeatmapLayer.
 * Perfect for showing density and concentration of data points.
 *
 * @component
 */

import { useState, useMemo } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

/**
 * HeatmapMap - Density heatmap visualization
 *
 * @param {Object} props
 * @param {Array} props.data - Array of data points with lng, lat, and weight
 * @param {number} props.radiusPixels - Radius of each point
 * @param {number} props.intensity - Heat intensity
 * @param {number} props.threshold - Minimum threshold
 * @param {Array} props.colorRange - Color range for heatmap
 * @param {boolean} props.isDarkMode - Dark mode flag
 */
const HeatmapMap = ({
  data = [],
  radiusPixels = 30,
  intensity = 1,
  threshold = 0.03,
  colorRange = null,
  isDarkMode = false
}) => {
  const [viewState, setViewState] = useState({
    longitude: -102.5528,
    latitude: 23.6345,
    zoom: 4.5,
    pitch: 0,
    bearing: 0
  });

  // Default color range
  const defaultColorRange = [
    [255, 255, 178],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38]
  ];

  // Create heatmap layer
  const layers = useMemo(() => {
    if (!data.length) return [];

    return [
      new HeatmapLayer({
        id: 'heatmap-layer',
        data,
        getPosition: d => [d.lng, d.lat],
        getWeight: d => d.weight || d.population || 1,
        radiusPixels,
        intensity,
        threshold,
        colorRange: colorRange || defaultColorRange,
        aggregation: 'SUM'
      })
    ];
  }, [data, radiusPixels, intensity, threshold, colorRange]);

  // Render legend
  const renderLegend = () => (
    <div className="absolute bottom-8 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40 border border-gray-200 dark:border-gray-700">
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Densidad
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">Baja</span>
        <div
          className="h-3 w-32 rounded"
          style={{
            background: `linear-gradient(to right,
              rgb(255, 255, 178),
              rgb(254, 178, 76),
              rgb(252, 78, 42),
              rgb(189, 0, 38),
              rgb(128, 0, 38))`
          }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">Alta</span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        getCursor={({ isDragging }) => isDragging ? 'grabbing' : 'grab'}
      >
        <Map
          mapStyle={isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light}
          attributionControl={true}
        />
      </DeckGL>
      {renderLegend()}
    </div>
  );
};

export default HeatmapMap;
