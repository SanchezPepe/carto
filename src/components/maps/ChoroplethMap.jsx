/**
 * ChoroplethMap Component
 *
 * Displays a choropleth (colored region) map using deck.gl GeoJsonLayer.
 * Great for visualizing data by geographic regions.
 *
 * @component
 */

import { useState, useCallback, useMemo } from 'react';
import { Map, Popup } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getColor, getDataRange, formatNumber } from '../../utils/colorScale';

const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

/**
 * ChoroplethMap - Colored region map visualization
 *
 * @param {Object} props
 * @param {Object} props.geojson - GeoJSON FeatureCollection
 * @param {Object} props.data - Data object { regionId: value }
 * @param {Array} props.colorScale - Array of hex colors
 * @param {Function} props.onRegionClick - Click handler
 * @param {string} props.selectedRegion - Selected region ID
 * @param {string} props.dataUnit - Data unit type
 * @param {string} props.idProperty - GeoJSON ID property
 * @param {boolean} props.isDarkMode - Dark mode flag
 */
const ChoroplethMap = ({
  geojson,
  data,
  colorScale,
  onRegionClick,
  selectedRegion = null,
  dataUnit = 'number',
  idProperty = 'id',
  isDarkMode = false
}) => {
  const [viewState, setViewState] = useState({
    longitude: -102.5528,
    latitude: 23.6345,
    zoom: 4.5,
    pitch: 0,
    bearing: 0
  });

  const [hoverInfo, setHoverInfo] = useState(null);

  // Calculate data range
  const { min, max } = useMemo(() => getDataRange(data), [data]);

  // Convert hex color to RGB array
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [200, 200, 200];
  };

  // Get fill color for a feature
  const getFillColor = useCallback((feature) => {
    const regionId = feature.properties[idProperty];
    const value = data[regionId];
    const hexColor = getColor(value, min, max, colorScale);
    const rgb = hexToRgb(hexColor);
    const isSelected = regionId === selectedRegion;
    return [...rgb, isSelected ? 230 : 180];
  }, [data, min, max, colorScale, selectedRegion, idProperty]);

  // Get line color for a feature
  const getLineColor = useCallback((feature) => {
    const regionId = feature.properties[idProperty];
    const isSelected = regionId === selectedRegion;
    if (isSelected) {
      return [30, 64, 175, 255]; // Blue border for selected
    }
    return isDarkMode ? [100, 100, 100, 200] : [255, 255, 255, 200];
  }, [selectedRegion, idProperty, isDarkMode]);

  // Create GeoJSON layer
  const layers = useMemo(() => {
    if (!geojson) return [];

    return [
      new GeoJsonLayer({
        id: 'choropleth-layer',
        data: geojson,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        getFillColor,
        getLineColor,
        getLineWidth: (feature) =>
          feature.properties[idProperty] === selectedRegion ? 3 : 1,
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 4,
        updateTriggers: {
          getFillColor: [data, selectedRegion, colorScale],
          getLineColor: [selectedRegion, isDarkMode],
          getLineWidth: [selectedRegion]
        },
        onClick: (info) => {
          if (info.object && onRegionClick) {
            onRegionClick(info.object.properties[idProperty]);
          }
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
  }, [geojson, data, colorScale, selectedRegion, idProperty, isDarkMode, getFillColor, getLineColor, onRegionClick]);

  // Render tooltip
  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { object, x, y } = hoverInfo;
    const regionId = object.properties[idProperty];
    const regionName = object.properties.name || regionId;
    const value = data[regionId];
    const formattedValue = formatNumber(value, dataUnit);

    return (
      <div
        className="absolute pointer-events-none bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 z-50 border border-gray-200 dark:border-gray-700"
        style={{ left: x + 10, top: y + 10 }}
      >
        <div className="font-semibold text-gray-900 dark:text-white">
          {regionName}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {value != null ? formattedValue : 'Sin datos'}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        getCursor={({ isDragging, isHovering }) =>
          isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
        }
      >
        <Map
          mapStyle={isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light}
          attributionControl={true}
        />
      </DeckGL>
      {renderTooltip()}
    </div>
  );
};

export default ChoroplethMap;
