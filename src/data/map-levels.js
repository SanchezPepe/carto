/**
 * Map Levels Configuration
 *
 * Defines available map levels and regional configurations.
 * Users can switch between national view and state-level views.
 */

import { CDMX_DATASETS, ALCALDIA_NAMES, CDMX_CONFIG } from './cdmx-datasets';
import { NL_DATASETS, NL_MUNICIPIO_NAMES, NL_CONFIG } from './nuevo-leon-datasets';
import { JAL_DATASETS, JAL_MUNICIPIO_NAMES, JAL_CONFIG } from './jalisco-datasets';
import { MEX_DATASETS, MEX_MUNICIPIO_NAMES, MEX_CONFIG } from './edomex-datasets';
import { YUC_DATASETS, YUC_MUNICIPIO_NAMES, YUC_CONFIG } from './yucatan-datasets';

/**
 * Available map levels
 */
export const MAP_LEVELS = {
  national: {
    id: 'national',
    name: 'Nacional',
    description: 'Vista de todos los estados de México',
    icon: '🇲🇽',
    center: { lng: -102.5528, lat: 23.6345 },
    zoom: 4.5,
    geojsonPath: null, // Loaded from Firebase
    idProperty: 'id',
    nameProperty: 'name'
  },
  CMX: {
    id: 'CMX',
    name: 'Ciudad de México',
    description: 'Vista por alcaldías de CDMX',
    icon: '🏙️',
    center: { lng: -99.1332, lat: 19.4326 },
    zoom: 10,
    geojsonPath: '/data/cdmx-alcaldias.geojson',
    idProperty: 'CVE_MUN',
    nameProperty: 'NOM_MUN',
    datasets: CDMX_DATASETS,
    regionNames: ALCALDIA_NAMES
  },
  NLE: {
    id: 'NLE',
    name: 'Nuevo León',
    description: 'Vista por municipios de Nuevo León',
    icon: '🏭',
    center: { lng: -99.9, lat: 25.67 },
    zoom: 7,
    geojsonPath: '/data/nuevo-leon-municipios.geojson',
    idProperty: 'NAME_2',
    nameProperty: 'NAME_2',
    datasets: NL_DATASETS,
    regionNames: NL_MUNICIPIO_NAMES
  },
  JAL: {
    id: 'JAL',
    name: 'Jalisco',
    description: 'Vista por municipios de Jalisco',
    icon: '🌵',
    center: { lng: -103.8, lat: 20.5 },
    zoom: 7,
    geojsonPath: '/data/jalisco-municipios.geojson',
    idProperty: 'NAME_2',
    nameProperty: 'NAME_2',
    datasets: JAL_DATASETS,
    regionNames: JAL_MUNICIPIO_NAMES
  },
  MEX: {
    id: 'MEX',
    name: 'Estado de México',
    description: 'Vista por municipios del Edomex',
    icon: '🏔️',
    center: { lng: -99.6, lat: 19.4 },
    zoom: 8,
    geojsonPath: '/data/edomex-municipios.geojson',
    idProperty: 'NAME_2',
    nameProperty: 'NAME_2',
    datasets: MEX_DATASETS,
    regionNames: MEX_MUNICIPIO_NAMES
  },
  YUC: {
    id: 'YUC',
    name: 'Yucatán',
    description: 'Vista por municipios de Yucatán',
    icon: '🏛️',
    center: { lng: -89.0, lat: 20.5 },
    zoom: 8,
    geojsonPath: '/data/yucatan-municipios.geojson',
    idProperty: 'NAME_2',
    nameProperty: 'NAME_2',
    datasets: YUC_DATASETS,
    regionNames: YUC_MUNICIPIO_NAMES
  }
};

/**
 * Get level configuration by ID
 */
export const getLevelConfig = (levelId) => {
  return MAP_LEVELS[levelId] || MAP_LEVELS.national;
};

/**
 * Get all available levels as array
 */
export const getAvailableLevels = () => {
  return Object.values(MAP_LEVELS);
};

/**
 * Check if a state has local data available
 */
export const hasLocalData = (stateId) => {
  return stateId in MAP_LEVELS && stateId !== 'national';
};

/**
 * States with available local maps
 */
export const STATES_WITH_LOCAL_MAPS = Object.keys(MAP_LEVELS).filter(k => k !== 'national');
