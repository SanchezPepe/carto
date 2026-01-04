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
    icon: '🗺️',
    usesDataset: true // Can use any dataset
  },
  markers: {
    id: 'markers',
    name: 'Marcadores',
    description: 'Puntos de ciudades',
    icon: '📍',
    usesDataset: false // Uses city data
  },
  heatmap: {
    id: 'heatmap',
    name: 'Mapa de Calor',
    description: 'Densidad de datos',
    icon: '🔥',
    usesDataset: false // Uses city population
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexágonos 3D',
    description: 'Agregación hexagonal',
    icon: '⬡',
    usesDataset: false // Uses city data
  },
  arc: {
    id: 'arc',
    name: 'Arcos',
    description: 'Conexiones entre ciudades',
    icon: '🌐',
    usesDataset: false // Uses connection data
  },
  flights: {
    id: 'flights',
    name: 'Vuelos',
    description: 'Rutas aéreas entre aeropuertos',
    icon: '✈️',
    usesDataset: false // Uses flight data
  }
};
