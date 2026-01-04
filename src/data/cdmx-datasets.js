/**
 * CDMX Datasets
 *
 * Contains datasets for all 16 alcaldías of Mexico City.
 * Data is based on INEGI and other official sources.
 *
 * @module cdmxDatasets
 */

import { COLOR_SCALES } from '../utils/colorScale.js';

/**
 * Alcaldía names lookup
 */
export const ALCALDIA_NAMES = {
  '002': 'Azcapotzalco',
  '003': 'Coyoacán',
  '004': 'Cuajimalpa de Morelos',
  '005': 'Gustavo A. Madero',
  '006': 'Iztacalco',
  '007': 'Iztapalapa',
  '008': 'La Magdalena Contreras',
  '009': 'Milpa Alta',
  '010': 'Álvaro Obregón',
  '011': 'Tláhuac',
  '012': 'Tlalpan',
  '013': 'Xochimilco',
  '014': 'Benito Juárez',
  '015': 'Cuauhtémoc',
  '016': 'Miguel Hidalgo',
  '017': 'Venustiano Carranza'
};

/**
 * Dataset 1: Population by Alcaldía (2024 estimates)
 */
export const cdmxPopulationDataset = {
  id: 'population',
  name: 'Población',
  description: 'Población por alcaldía (2024 est.)',
  colorScale: COLOR_SCALES.blue,
  unit: 'number',
  data: {
    '002': 400161,     // Azcapotzalco
    '003': 614447,     // Coyoacán
    '004': 217686,     // Cuajimalpa de Morelos
    '005': 1173351,    // Gustavo A. Madero
    '006': 390348,     // Iztacalco
    '007': 1815786,    // Iztapalapa
    '008': 247622,     // La Magdalena Contreras
    '009': 152685,     // Milpa Alta
    '010': 759137,     // Álvaro Obregón
    '011': 392313,     // Tláhuac
    '012': 699928,     // Tlalpan
    '013': 442178,     // Xochimilco
    '014': 434153,     // Benito Juárez
    '015': 545884,     // Cuauhtémoc
    '016': 414470,     // Miguel Hidalgo
    '017': 443704      // Venustiano Carranza
  }
};

/**
 * Dataset 2: GDP per Capita by Alcaldía (2024)
 * In Mexican Pesos (MXN)
 */
export const cdmxGdpDataset = {
  id: 'gdp',
  name: 'PIB per Cápita',
  description: 'PIB per cápita por alcaldía (2024)',
  colorScale: COLOR_SCALES.green,
  unit: 'currency',
  data: {
    '002': 285000,     // Azcapotzalco
    '003': 420000,     // Coyoacán
    '004': 580000,     // Cuajimalpa de Morelos
    '005': 195000,     // Gustavo A. Madero
    '006': 245000,     // Iztacalco
    '007': 165000,     // Iztapalapa
    '008': 310000,     // La Magdalena Contreras
    '009': 125000,     // Milpa Alta
    '010': 350000,     // Álvaro Obregón
    '011': 175000,     // Tláhuac
    '012': 380000,     // Tlalpan
    '013': 210000,     // Xochimilco
    '014': 720000,     // Benito Juárez
    '015': 550000,     // Cuauhtémoc
    '016': 680000,     // Miguel Hidalgo
    '017': 265000      // Venustiano Carranza
  }
};

/**
 * Dataset 3: Population Density (people per km²)
 */
export const cdmxDensityDataset = {
  id: 'density',
  name: 'Densidad Poblacional',
  description: 'Habitantes por km² (2024)',
  colorScale: COLOR_SCALES.orange,
  unit: 'number',
  data: {
    '002': 11834,      // Azcapotzalco
    '003': 11528,      // Coyoacán
    '004': 2815,       // Cuajimalpa de Morelos
    '005': 13745,      // Gustavo A. Madero
    '006': 17143,      // Iztacalco
    '007': 15847,      // Iztapalapa
    '008': 3281,       // La Magdalena Contreras
    '009': 540,        // Milpa Alta
    '010': 8012,       // Álvaro Obregón
    '011': 4566,       // Tláhuac
    '012': 2287,       // Tlalpan
    '013': 3613,       // Xochimilco
    '014': 16125,      // Benito Juárez
    '015': 16690,      // Cuauhtémoc
    '016': 8873,       // Miguel Hidalgo
    '017': 13016       // Venustiano Carranza
  }
};

/**
 * Dataset 4: Crime Rate (per 100,000 inhabitants)
 */
export const cdmxCrimeDataset = {
  id: 'crime',
  name: 'Índice de Delincuencia',
  description: 'Delitos por 100,000 hab. (2024)',
  colorScale: COLOR_SCALES.red,
  unit: 'number',
  data: {
    '002': 1850,       // Azcapotzalco
    '003': 1420,       // Coyoacán
    '004': 980,        // Cuajimalpa de Morelos
    '005': 2100,       // Gustavo A. Madero
    '006': 1680,       // Iztacalco
    '007': 2450,       // Iztapalapa
    '008': 890,        // La Magdalena Contreras
    '009': 620,        // Milpa Alta
    '010': 1560,       // Álvaro Obregón
    '011': 1340,       // Tláhuac
    '012': 1180,       // Tlalpan
    '013': 1050,       // Xochimilco
    '014': 1890,       // Benito Juárez
    '015': 3200,       // Cuauhtémoc
    '016': 2100,       // Miguel Hidalgo
    '017': 1780        // Venustiano Carranza
  }
};

/**
 * Dataset 5: Green Areas (m² per inhabitant)
 */
export const cdmxGreenAreasDataset = {
  id: 'green_areas',
  name: 'Áreas Verdes',
  description: 'm² por habitante (2024)',
  colorScale: COLOR_SCALES.green,
  unit: 'number',
  data: {
    '002': 3.2,        // Azcapotzalco
    '003': 8.5,        // Coyoacán
    '004': 28.4,       // Cuajimalpa de Morelos
    '005': 2.8,        // Gustavo A. Madero
    '006': 2.1,        // Iztacalco
    '007': 2.4,        // Iztapalapa
    '008': 45.2,       // La Magdalena Contreras
    '009': 156.8,      // Milpa Alta
    '010': 12.3,       // Álvaro Obregón
    '011': 18.6,       // Tláhuac
    '012': 85.4,       // Tlalpan
    '013': 42.1,       // Xochimilco
    '014': 4.8,        // Benito Juárez
    '015': 3.6,        // Cuauhtémoc
    '016': 6.2,        // Miguel Hidalgo
    '017': 2.9         // Venustiano Carranza
  }
};

/**
 * Dataset 6: Average Age
 */
export const cdmxAgeDataset = {
  id: 'avg_age',
  name: 'Edad Promedio',
  description: 'Edad promedio por alcaldía (2024)',
  colorScale: COLOR_SCALES.purple,
  unit: 'number',
  data: {
    '002': 38.2,       // Azcapotzalco
    '003': 39.8,       // Coyoacán
    '004': 36.5,       // Cuajimalpa de Morelos
    '005': 35.4,       // Gustavo A. Madero
    '006': 37.8,       // Iztacalco
    '007': 32.1,       // Iztapalapa
    '008': 35.2,       // La Magdalena Contreras
    '009': 29.8,       // Milpa Alta
    '010': 36.9,       // Álvaro Obregón
    '011': 31.5,       // Tláhuac
    '012': 34.8,       // Tlalpan
    '013': 33.2,       // Xochimilco
    '014': 42.5,       // Benito Juárez
    '015': 41.2,       // Cuauhtémoc
    '016': 40.8,       // Miguel Hidalgo
    '017': 36.4        // Venustiano Carranza
  }
};

/**
 * All CDMX datasets array
 */
export const CDMX_DATASETS = [
  cdmxPopulationDataset,
  cdmxGdpDataset,
  cdmxDensityDataset,
  cdmxCrimeDataset,
  cdmxGreenAreasDataset,
  cdmxAgeDataset
];

/**
 * Get a CDMX dataset by ID
 * @param {string} id - Dataset ID
 * @returns {Object|null} Dataset object or null
 */
export const getCdmxDatasetById = (id) => {
  return CDMX_DATASETS.find(dataset => dataset.id === id) || null;
};

/**
 * CDMX map configuration
 */
export const CDMX_CONFIG = {
  id: 'CMX',
  name: 'Ciudad de México',
  center: { lng: -99.1332, lat: 19.4326 },
  zoom: 10,
  geojsonPath: '/data/cdmx-alcaldias.geojson',
  idProperty: 'CVE_MUN',
  nameProperty: 'NOM_MUN'
};
