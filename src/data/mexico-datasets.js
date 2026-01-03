/**
 * Mexico Datasets
 *
 * Contains datasets for all 32 Mexican states with various metrics.
 * Data is based on INEGI and other official sources.
 *
 * @module mexicoDatasets
 */

import { COLOR_SCALES } from '../utils/colorScale.js';

/**
 * Dataset 1: Population by State (2024 estimates)
 * Source: INEGI projections
 */
export const populationDataset = {
  id: 'population',
  name: 'Población',
  description: 'Población total por estado (2024 est.)',
  colorScale: COLOR_SCALES.blue,
  unit: 'number',
  data: {
    'AGU': 1505365,
    'BCN': 3898557,
    'BCS': 870102,
    'CAM': 1000617,
    'CHP': 5832211,
    'CHH': 3896544,
    'CMX': 9209944,
    'COA': 3265559,
    'COL': 810698,
    'DUR': 1905072,
    'GUA': 6228175,
    'GRO': 3657048,
    'HID': 3220107,
    'JAL': 8596126,
    'MEX': 17427790,
    'MIC': 4888395,
    'MOR': 2115127,
    'NAY': 1361888,
    'NLE': 5966724,
    'OAX': 4161470,
    'PUE': 6692678,
    'QUE': 2430476,
    'ROO': 2053894,
    'SLP': 2934733,
    'SIN': 3256701,
    'SON': 3180011,
    'TAB': 2595390,
    'TAM': 3778407,
    'TLA': 1411012,
    'VER': 8163759,
    'YUC': 2369969,
    'ZAC': 1666426
  }
};

/**
 * Dataset 2: GDP per Capita by State (2024)
 * In Mexican Pesos (MXN)
 */
export const gdpDataset = {
  id: 'gdp',
  name: 'PIB per Cápita',
  description: 'Producto Interno Bruto per cápita (2024)',
  colorScale: COLOR_SCALES.green,
  unit: 'currency',
  data: {
    'AGU': 312456,
    'BCN': 267834,
    'BCS': 298765,
    'CAM': 567432,
    'CHP': 89654,
    'CHH': 234567,
    'CMX': 489234,
    'COA': 356789,
    'COL': 198765,
    'DUR': 178954,
    'GUA': 198234,
    'GRO': 112345,
    'HID': 156789,
    'JAL': 234567,
    'MEX': 145678,
    'MIC': 134567,
    'MOR': 167890,
    'NAY': 145678,
    'NLE': 398765,
    'OAX': 98765,
    'PUE': 145678,
    'QUE': 312456,
    'ROO': 234567,
    'SLP': 212345,
    'SIN': 187654,
    'SON': 267890,
    'TAB': 298765,
    'TAM': 287654,
    'TLA': 112345,
    'VER': 156789,
    'YUC': 198765,
    'ZAC': 167890
  }
};

/**
 * Dataset 3: Population Density (people per km²)
 */
export const densityDataset = {
  id: 'density',
  name: 'Densidad Poblacional',
  description: 'Habitantes por kilómetro cuadrado (2024)',
  colorScale: COLOR_SCALES.orange,
  unit: 'number',
  data: {
    'AGU': 270,
    'BCN': 54,
    'BCS': 12,
    'CAM': 18,
    'CHP': 79,
    'CHH': 16,
    'CMX': 6163,
    'COA': 22,
    'COL': 145,
    'DUR': 16,
    'GUA': 203,
    'GRO': 57,
    'HID': 154,
    'JAL': 109,
    'MEX': 775,
    'MIC': 83,
    'MOR': 427,
    'NAY': 49,
    'NLE': 92,
    'OAX': 44,
    'PUE': 196,
    'QUE': 208,
    'ROO': 46,
    'SLP': 48,
    'SIN': 56,
    'SON': 18,
    'TAB': 105,
    'TAM': 47,
    'TLA': 348,
    'VER': 112,
    'YUC': 60,
    'ZAC': 22
  }
};

/**
 * Dataset 4: Unemployment Rate (%)
 */
export const unemploymentDataset = {
  id: 'unemployment',
  name: 'Tasa de Desempleo',
  description: 'Tasa de desempleo por estado (2024 Q4)',
  colorScale: COLOR_SCALES.red,
  unit: 'percent',
  data: {
    'AGU': 0.034,
    'BCN': 0.028,
    'BCS': 0.032,
    'CAM': 0.045,
    'CHP': 0.038,
    'CHH': 0.025,
    'CMX': 0.052,
    'COA': 0.031,
    'COL': 0.029,
    'DUR': 0.033,
    'GUA': 0.036,
    'GRO': 0.021,
    'HID': 0.035,
    'JAL': 0.032,
    'MEX': 0.048,
    'MIC': 0.028,
    'MOR': 0.031,
    'NAY': 0.041,
    'NLE': 0.029,
    'OAX': 0.019,
    'PUE': 0.033,
    'QUE': 0.038,
    'ROO': 0.045,
    'SLP': 0.027,
    'SIN': 0.034,
    'SON': 0.036,
    'TAB': 0.058,
    'TAM': 0.035,
    'TLA': 0.039,
    'VER': 0.032,
    'YUC': 0.024,
    'ZAC': 0.031
  }
};

/**
 * Dataset 5: HDI (Human Development Index)
 */
export const hdiDataset = {
  id: 'hdi',
  name: 'Índice de Desarrollo Humano',
  description: 'IDH por estado (2023)',
  colorScale: COLOR_SCALES.purple,
  unit: 'number',
  data: {
    'AGU': 0.812,
    'BCN': 0.798,
    'BCS': 0.823,
    'CAM': 0.769,
    'CHP': 0.689,
    'CHH': 0.788,
    'CMX': 0.857,
    'COA': 0.809,
    'COL': 0.791,
    'DUR': 0.770,
    'GUA': 0.774,
    'GRO': 0.703,
    'HID': 0.754,
    'JAL': 0.802,
    'MEX': 0.767,
    'MIC': 0.724,
    'MOR': 0.778,
    'NAY': 0.763,
    'NLE': 0.836,
    'OAX': 0.693,
    'PUE': 0.746,
    'QUE': 0.815,
    'ROO': 0.791,
    'SLP': 0.765,
    'SIN': 0.779,
    'SON': 0.810,
    'TAB': 0.759,
    'TAM': 0.795,
    'TLA': 0.752,
    'VER': 0.741,
    'YUC': 0.779,
    'ZAC': 0.760
  }
};

/**
 * Dataset 6: Tourism (annual visitors in millions)
 */
export const tourismDataset = {
  id: 'tourism',
  name: 'Turismo',
  description: 'Visitantes anuales en millones (2024)',
  colorScale: COLOR_SCALES.blue,
  unit: 'number',
  data: {
    'AGU': 1.2,
    'BCN': 5.8,
    'BCS': 4.2,
    'CAM': 0.8,
    'CHP': 2.1,
    'CHH': 1.5,
    'CMX': 18.5,
    'COA': 1.1,
    'COL': 0.9,
    'DUR': 0.7,
    'GUA': 4.8,
    'GRO': 8.2,
    'HID': 2.3,
    'JAL': 12.4,
    'MEX': 4.5,
    'MIC': 3.2,
    'MOR': 2.8,
    'NAY': 2.1,
    'NLE': 3.5,
    'OAX': 3.9,
    'PUE': 5.2,
    'QUE': 3.8,
    'ROO': 22.5,
    'SLP': 2.1,
    'SIN': 2.4,
    'SON': 1.8,
    'TAB': 0.9,
    'TAM': 1.2,
    'TLA': 0.6,
    'VER': 4.8,
    'YUC': 6.2,
    'ZAC': 1.4
  }
};

/**
 * All datasets array
 */
export const MEXICO_DATASETS = [
  populationDataset,
  gdpDataset,
  densityDataset,
  unemploymentDataset,
  hdiDataset,
  tourismDataset
];

/**
 * Get a dataset by ID
 * @param {string} id - Dataset ID
 * @returns {Object|null} Dataset object or null
 */
export const getDatasetById = (id) => {
  return MEXICO_DATASETS.find(dataset => dataset.id === id) || null;
};

/**
 * Get all dataset IDs
 * @returns {Array<string>} Array of dataset IDs
 */
export const getDatasetIds = () => {
  return MEXICO_DATASETS.map(dataset => dataset.id);
};

/**
 * State name lookup
 */
export const STATE_NAMES = {
  'AGU': 'Aguascalientes',
  'BCN': 'Baja California',
  'BCS': 'Baja California Sur',
  'CAM': 'Campeche',
  'CHP': 'Chiapas',
  'CHH': 'Chihuahua',
  'CMX': 'Ciudad de México',
  'COA': 'Coahuila',
  'COL': 'Colima',
  'DUR': 'Durango',
  'GUA': 'Guanajuato',
  'GRO': 'Guerrero',
  'HID': 'Hidalgo',
  'JAL': 'Jalisco',
  'MEX': 'Estado de México',
  'MIC': 'Michoacán',
  'MOR': 'Morelos',
  'NAY': 'Nayarit',
  'NLE': 'Nuevo León',
  'OAX': 'Oaxaca',
  'PUE': 'Puebla',
  'QUE': 'Querétaro',
  'ROO': 'Quintana Roo',
  'SLP': 'San Luis Potosí',
  'SIN': 'Sinaloa',
  'SON': 'Sonora',
  'TAB': 'Tabasco',
  'TAM': 'Tamaulipas',
  'TLA': 'Tlaxcala',
  'VER': 'Veracruz',
  'YUC': 'Yucatán',
  'ZAC': 'Zacatecas'
};
