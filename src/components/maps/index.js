/**
 * Map Components Index
 *
 * Central export for all map visualization components in TerraVista.
 */

export { default as BaseMap, MAP_STYLES } from './BaseMap';
export { default as ChoroplethMap } from './ChoroplethMap';
export { default as MarkersMap } from './MarkersMap';
export { default as HeatmapMap } from './HeatmapMap';
export { default as HexagonMap } from './HexagonMap';
export { default as ArcMap } from './ArcMap';

/**
 * Map type configuration
 */
export const MAP_TYPES = {
  choropleth: {
    id: 'choropleth',
    name: 'Coroplético',
    description: 'Regiones coloreadas por valor',
    icon: '🗺️'
  },
  markers: {
    id: 'markers',
    name: 'Marcadores',
    description: 'Puntos de ciudades',
    icon: '📍'
  },
  heatmap: {
    id: 'heatmap',
    name: 'Mapa de Calor',
    description: 'Densidad de datos',
    icon: '🔥'
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexágonos 3D',
    description: 'Agregación hexagonal',
    icon: '⬡'
  },
  arc: {
    id: 'arc',
    name: 'Arcos',
    description: 'Conexiones entre ciudades',
    icon: '🌐'
  }
};
