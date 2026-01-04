/**
 * HexagonMap Component
 *
 * Displays 3D hexagonal bins using deck.gl HexagonLayer.
 * Great for visualizing aggregated point data with elevation.
 *
 * @component
 */

import { useState, useMemo } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

/**
 * HexagonMap - 3D hexagonal aggregation visualization
 *
 * @param {Object} props
 * @param {Array} props.data - Array of data points with lng, lat
 * @param {number} props.radius - Hexagon radius in meters
 * @param {number} props.elevationScale - Scale factor for elevation
 * @param {boolean} props.extruded - Whether to extrude hexagons
 * @param {Array} props.colorRange - Color range for hexagons
 * @param {number} props.coverage - Hexagon coverage (0-1)
 * @param {boolean} props.isDarkMode - Dark mode flag
 */
const DEFAULT_VIEW_STATE = {
  longitude: -102.5528,
  latitude: 23.6345,
  zoom: 4.5,
  pitch: 45,
  bearing: -15
};

const HexagonMap = ({
  data = [],
  radius = 25000,
  elevationScale = 250,
  extruded = true,
  colorRange = null,
  coverage = 0.8,
  isDarkMode = false,
  viewState: externalViewState,
  onViewStateChange
}) => {
  const [internalViewState, setInternalViewState] = useState(DEFAULT_VIEW_STATE);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Use external viewState if provided (apply 3D defaults for hexagon), otherwise use internal
  const viewState = externalViewState
    ? { ...externalViewState, pitch: externalViewState.pitch || 45, bearing: externalViewState.bearing || -15 }
    : internalViewState;

  const handleViewStateChange = ({ viewState: newViewState }) => {
    if (onViewStateChange) {
      onViewStateChange(newViewState);
    } else {
      setInternalViewState(newViewState);
    }
  };

  // Default color range (blue to red)
  const defaultColorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ];

  // Create hexagon layer
  const layers = useMemo(() => {
    if (!data.length) return [];

    return [
      new HexagonLayer({
        id: 'hexagon-layer',
        data,
        pickable: true,
        extruded,
        radius,
        elevationScale,
        coverage,
        getPosition: d => [d.lng, d.lat],
        getElevationWeight: d => d.weight || d.population || 1,
        getColorWeight: d => d.weight || d.population || 1,
        colorRange: colorRange || defaultColorRange,
        elevationRange: [0, 3000],
        material: {
          ambient: 0.64,
          diffuse: 0.6,
          shininess: 32,
          specularColor: [51, 51, 51]
        },
        onHover: (info) => {
          if (info.object) {
            setHoverInfo({
              x: info.x,
              y: info.y,
              object: info.object
            });
          } else {
            setHoverInfo(null);
          }
        }
      })
    ];
  }, [data, radius, elevationScale, extruded, coverage, colorRange]);

  // Render tooltip
  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { object, x, y } = hoverInfo;
    const count = object.points?.length || 0;
    const totalPopulation = object.points?.reduce(
      (sum, p) => sum + (p.source?.population || 0), 0
    ) || 0;

    return (
      <div
        className="absolute pointer-events-none bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 z-50 border border-gray-200 dark:border-gray-700"
        style={{ left: x + 15, top: y + 15 }}
      >
        <div className="font-semibold text-gray-900 dark:text-white">
          {count} ciudades
        </div>
        {totalPopulation > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Población: {totalPopulation.toLocaleString()}
          </div>
        )}
      </div>
    );
  };

  // Render legend
  const renderLegend = () => (
    <div className="absolute bottom-8 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40 border border-gray-200 dark:border-gray-700">
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Concentración
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">Baja</span>
        <div
          className="h-3 w-32 rounded"
          style={{
            background: `linear-gradient(to right,
              rgb(1, 152, 189),
              rgb(73, 227, 206),
              rgb(254, 237, 177),
              rgb(254, 173, 84),
              rgb(209, 55, 78))`
          }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">Alta</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Altura = concentración de datos
      </div>
    </div>
  );

  // Render controls
  const renderControls = () => (
    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40 border border-gray-200 dark:border-gray-700">
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Vista 3D
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Arrastra para rotar
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Ctrl + Arrastra para inclinar
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={true}
        layers={layers}
        getCursor={({ isDragging }) => isDragging ? 'grabbing' : 'grab'}
      >
        <Map
          mapStyle={isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light}
          attributionControl={true}
        />
      </DeckGL>
      {renderTooltip()}
      {renderLegend()}
      {renderControls()}
    </div>
  );
};

export default HexagonMap;
