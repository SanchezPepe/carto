/**
 * MarkersMap Component
 *
 * Displays city markers on a map using deck.gl IconLayer.
 * Perfect for showing points of interest like cities, landmarks, etc.
 *
 * @component
 */

import { useState, useCallback, useMemo } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { IconLayer, TextLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CITY_TYPE_COLORS, CITY_TYPE_LABELS } from '../../data/mexico-cities';
import { formatNumber } from '../../utils/colorScale';

const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

// Icon atlas for markers
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
};

/**
 * MarkersMap - City markers visualization
 *
 * @param {Object} props
 * @param {Array} props.cities - Array of city objects
 * @param {Function} props.onCityClick - Click handler
 * @param {string} props.selectedCity - Selected city ID
 * @param {boolean} props.showLabels - Whether to show city labels
 * @param {boolean} props.isDarkMode - Dark mode flag
 */
const DEFAULT_VIEW_STATE = {
  longitude: -102.5528,
  latitude: 23.6345,
  zoom: 4.5,
  pitch: 0,
  bearing: 0
};

const MarkersMap = ({
  cities = [],
  onCityClick,
  selectedCity = null,
  showLabels = true,
  isDarkMode = false,
  viewState: externalViewState,
  onViewStateChange
}) => {
  const [internalViewState, setInternalViewState] = useState(DEFAULT_VIEW_STATE);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Use external viewState if provided, otherwise use internal
  const viewState = externalViewState || internalViewState;

  const handleViewStateChange = ({ viewState: newViewState }) => {
    if (onViewStateChange) {
      onViewStateChange(newViewState);
    } else {
      setInternalViewState(newViewState);
    }
  };

  // Convert hex color to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [200, 200, 200];
  };

  // Calculate marker size based on population
  const getMarkerSize = useCallback((city) => {
    const pop = city.population;
    if (pop > 5000000) return 50;
    if (pop > 1000000) return 40;
    if (pop > 500000) return 32;
    if (pop > 200000) return 24;
    return 18;
  }, []);

  // Get marker color based on city type
  const getMarkerColor = useCallback((city) => {
    const hex = CITY_TYPE_COLORS[city.type] || '#6b7280';
    const rgb = hexToRgb(hex);
    const isSelected = city.id === selectedCity;
    return [...rgb, isSelected ? 255 : 200];
  }, [selectedCity]);

  // Create layers
  const layers = useMemo(() => {
    if (!cities.length) return [];

    const iconLayer = new IconLayer({
      id: 'city-markers',
      data: cities,
      pickable: true,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getIcon: () => 'marker',
      getPosition: d => [d.lng, d.lat],
      getSize: getMarkerSize,
      getColor: getMarkerColor,
      sizeScale: 1,
      sizeMinPixels: 12,
      sizeMaxPixels: 60,
      updateTriggers: {
        getColor: [selectedCity]
      },
      onClick: (info) => {
        if (info.object && onCityClick) {
          onCityClick(info.object);
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
    });

    const layerArray = [iconLayer];

    // Add text labels if enabled and zoomed in enough
    if (showLabels && viewState.zoom > 5) {
      const textLayer = new TextLayer({
        id: 'city-labels',
        data: cities.filter(c => c.population > 300000 || viewState.zoom > 6),
        pickable: false,
        getPosition: d => [d.lng, d.lat],
        getText: d => d.name,
        getSize: 12,
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'top',
        getPixelOffset: [0, 20],
        getColor: isDarkMode ? [255, 255, 255, 200] : [0, 0, 0, 200],
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 600
      });
      layerArray.push(textLayer);
    }

    return layerArray;
  }, [cities, selectedCity, showLabels, viewState.zoom, isDarkMode, getMarkerSize, getMarkerColor, onCityClick]);

  // Render tooltip
  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { object, x, y } = hoverInfo;

    return (
      <div
        className="absolute pointer-events-none bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 z-50 border border-gray-200 dark:border-gray-700 min-w-48"
        style={{ left: x + 15, top: y + 15 }}
      >
        <div className="font-bold text-gray-900 dark:text-white text-lg">
          {object.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {object.state}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: CITY_TYPE_COLORS[object.type] }}
          />
          <span className="text-gray-600 dark:text-gray-300">
            {CITY_TYPE_LABELS[object.type]}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Población: {formatNumber(object.population, 'number')}
        </div>
      </div>
    );
  };

  // Render legend
  const renderLegend = () => (
    <div className="absolute bottom-8 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40 border border-gray-200 dark:border-gray-700">
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Tipo de Ciudad
      </div>
      <div className="space-y-1">
        {Object.entries(CITY_TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CITY_TYPE_COLORS[type] }}
            />
            <span className="text-gray-600 dark:text-gray-300">{label}</span>
          </div>
        ))}
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
      {renderLegend()}
    </div>
  );
};

export default MarkersMap;
