/**
 * ArcMap Component
 *
 * Displays arc connections between points using deck.gl ArcLayer.
 * Perfect for showing routes, migrations, or connections between locations.
 *
 * @component
 */

import { useState, useMemo, useCallback } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

/**
 * ArcMap - Arc connections visualization
 *
 * @param {Object} props
 * @param {Array} props.arcs - Array of arc objects { source, target, value }
 * @param {Array} props.nodes - Array of node objects { id, name, lng, lat }
 * @param {Function} props.onArcClick - Arc click handler
 * @param {boolean} props.showNodes - Whether to show node markers
 * @param {boolean} props.isDarkMode - Dark mode flag
 */
const ArcMap = ({
  arcs = [],
  nodes = [],
  onArcClick,
  showNodes = true,
  isDarkMode = false
}) => {
  const [viewState, setViewState] = useState({
    longitude: -102.5528,
    latitude: 23.6345,
    zoom: 4.5,
    pitch: 30,
    bearing: 0
  });

  const [hoverInfo, setHoverInfo] = useState(null);

  // Get node by ID
  const getNodeById = useCallback((id) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  // Create layers
  const layers = useMemo(() => {
    const layerArray = [];

    // Arc layer
    if (arcs.length > 0) {
      const arcLayer = new ArcLayer({
        id: 'arc-layer',
        data: arcs,
        pickable: true,
        getSourcePosition: d => {
          const source = getNodeById(d.source);
          return source ? [source.lng, source.lat] : [0, 0];
        },
        getTargetPosition: d => {
          const target = getNodeById(d.target);
          return target ? [target.lng, target.lat] : [0, 0];
        },
        getSourceColor: isDarkMode
          ? [0, 200, 255, 200]
          : [0, 128, 200, 200],
        getTargetColor: isDarkMode
          ? [255, 100, 100, 200]
          : [200, 0, 80, 200],
        getWidth: d => Math.max(1, Math.log(d.value || 1)),
        widthMinPixels: 1,
        widthMaxPixels: 8,
        getHeight: 0.5,
        greatCircle: true,
        onClick: (info) => {
          if (info.object && onArcClick) {
            onArcClick(info.object);
          }
        },
        onHover: (info) => {
          if (info.object) {
            setHoverInfo({
              x: info.x,
              y: info.y,
              type: 'arc',
              object: info.object
            });
          } else {
            setHoverInfo(null);
          }
        }
      });
      layerArray.push(arcLayer);
    }

    // Node markers
    if (showNodes && nodes.length > 0) {
      const nodeLayer = new ScatterplotLayer({
        id: 'node-layer',
        data: nodes,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 1,
        radiusMinPixels: 5,
        radiusMaxPixels: 25,
        lineWidthMinPixels: 2,
        getPosition: d => [d.lng, d.lat],
        getRadius: d => Math.sqrt(d.population || 100000) / 50,
        getFillColor: isDarkMode
          ? [100, 150, 200, 180]
          : [59, 130, 246, 180],
        getLineColor: isDarkMode
          ? [200, 200, 200, 255]
          : [255, 255, 255, 255],
        onHover: (info) => {
          if (info.object) {
            setHoverInfo({
              x: info.x,
              y: info.y,
              type: 'node',
              object: info.object
            });
          } else {
            setHoverInfo(null);
          }
        }
      });
      layerArray.push(nodeLayer);
    }

    return layerArray;
  }, [arcs, nodes, showNodes, isDarkMode, getNodeById, onArcClick]);

  // Render tooltip
  const renderTooltip = () => {
    if (!hoverInfo) return null;

    const { object, x, y, type } = hoverInfo;

    if (type === 'arc') {
      const source = getNodeById(object.source);
      const target = getNodeById(object.target);

      return (
        <div
          className="absolute pointer-events-none bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 z-50 border border-gray-200 dark:border-gray-700"
          style={{ left: x + 15, top: y + 15 }}
        >
          <div className="font-semibold text-gray-900 dark:text-white">
            {source?.name || object.source} → {target?.name || object.target}
          </div>
          {object.value && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Valor: {object.value.toLocaleString()}
            </div>
          )}
          {object.label && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {object.label}
            </div>
          )}
        </div>
      );
    }

    if (type === 'node') {
      return (
        <div
          className="absolute pointer-events-none bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 z-50 border border-gray-200 dark:border-gray-700"
          style={{ left: x + 15, top: y + 15 }}
        >
          <div className="font-semibold text-gray-900 dark:text-white">
            {object.name}
          </div>
          {object.population && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Población: {object.population.toLocaleString()}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Render legend
  const renderLegend = () => (
    <div className="absolute bottom-8 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40 border border-gray-200 dark:border-gray-700">
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Conexiones
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-8 h-1 rounded"
            style={{
              background: isDarkMode
                ? 'linear-gradient(to right, rgb(0, 200, 255), rgb(255, 100, 100))'
                : 'linear-gradient(to right, rgb(0, 128, 200), rgb(200, 0, 80))'
            }}
          />
          <span className="text-gray-600 dark:text-gray-300">
            Origen → Destino
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-full border-2"
            style={{
              backgroundColor: isDarkMode ? 'rgb(100, 150, 200)' : 'rgb(59, 130, 246)',
              borderColor: isDarkMode ? 'rgb(200, 200, 200)' : 'white'
            }}
          />
          <span className="text-gray-600 dark:text-gray-300">
            Ciudad (tamaño = población)
          </span>
        </div>
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

export default ArcMap;
