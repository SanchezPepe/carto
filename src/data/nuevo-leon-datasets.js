/**
 * Nuevo León Datasets
 *
 * Contains datasets for the 51 municipalities of Nuevo León.
 * Data is based on INEGI and other official sources (estimated values).
 *
 * @module nuevoLeonDatasets
 */

import { COLOR_SCALES } from '../utils/colorScale.js';

/**
 * Municipality names lookup (using NAME_2 from GeoJSON)
 */
export const NL_MUNICIPIO_NAMES = {
  'Abasolo': 'Abasolo',
  'Agualeguas': 'Agualeguas',
  'Allende': 'Allende',
  'Anáhuac': 'Anáhuac',
  'Apodaca': 'Apodaca',
  'Aramberri': 'Aramberri',
  'Bustamante': 'Bustamante',
  'Cadereyta Jiménez': 'Cadereyta Jiménez',
  'Carmen': 'Carmen',
  'Cerralvo': 'Cerralvo',
  'China': 'China',
  'Ciénega de Flores': 'Ciénega de Flores',
  'Doctor Arroyo': 'Doctor Arroyo',
  'Doctor Coss': 'Doctor Coss',
  'Doctor González': 'Doctor González',
  'Galeana': 'Galeana',
  'García': 'García',
  'General Bravo': 'General Bravo',
  'General Escobedo': 'General Escobedo',
  'General Terán': 'General Terán',
  'General Treviño': 'General Treviño',
  'General Zaragoza': 'General Zaragoza',
  'General Zuazua': 'General Zuazua',
  'Guadalupe': 'Guadalupe',
  'Hidalgo': 'Hidalgo',
  'Higueras': 'Higueras',
  'Iturbide': 'Iturbide',
  'Juárez': 'Juárez',
  'Lampazos de Naranjo': 'Lampazos de Naranjo',
  'Linares': 'Linares',
  'Los Aldamas': 'Los Aldamas',
  'Los Herreras': 'Los Herreras',
  'Los Ramones': 'Los Ramones',
  'Marín': 'Marín',
  'Melchor Ocampo': 'Melchor Ocampo',
  'Mier y Noriega': 'Mier y Noriega',
  'Mina': 'Mina',
  'Montemorelos': 'Montemorelos',
  'Monterrey': 'Monterrey',
  'Parás': 'Parás',
  'Pesquería': 'Pesquería',
  'Rayones': 'Rayones',
  'Sabinas Hidalgo': 'Sabinas Hidalgo',
  'Salinas Victoria': 'Salinas Victoria',
  'San Nicolás de los Garza': 'San Nicolás de los Garza',
  'San Pedro Garza García': 'San Pedro Garza García',
  'Santa Catarina': 'Santa Catarina',
  'Santiago': 'Santiago',
  'Vallecillo': 'Vallecillo',
  'Villaldama': 'Villaldama'
};

/**
 * Dataset 1: Population by Municipality (2024 estimates)
 */
export const nlPopulationDataset = {
  id: 'population',
  name: 'Población',
  description: 'Población por municipio (2024 est.)',
  colorScale: COLOR_SCALES.blue,
  unit: 'number',
  data: {
    'Monterrey': 1142994,
    'Guadalupe': 682880,
    'San Nicolás de los Garza': 443273,
    'Apodaca': 597207,
    'General Escobedo': 425148,
    'Santa Catarina': 306322,
    'San Pedro Garza García': 123156,
    'García': 247370,
    'Juárez': 333481,
    'Cadereyta Jiménez': 95534,
    'Santiago': 42407,
    'Allende': 32593,
    'Montemorelos': 61552,
    'Linares': 78669,
    'General Terán': 14437,
    'China': 10371,
    'Pesquería': 93485,
    'Ciénega de Flores': 52741,
    'General Zuazua': 66880,
    'Salinas Victoria': 54192,
    'Hidalgo': 17253,
    'Abasolo': 2798,
    'Agualeguas': 3152,
    'Anáhuac': 18479,
    'Aramberri': 15246,
    'Bustamante': 3749,
    'Carmen': 6753,
    'Cerralvo': 7653,
    'Doctor Arroyo': 35749,
    'Doctor Coss': 1751,
    'Doctor González': 3259,
    'Galeana': 42169,
    'General Bravo': 5481,
    'General Treviño': 1318,
    'General Zaragoza': 5962,
    'Higueras': 1643,
    'Iturbide': 3492,
    'Lampazos de Naranjo': 5349,
    'Los Aldamas': 1478,
    'Los Herreras': 2174,
    'Los Ramones': 6243,
    'Marín': 6148,
    'Melchor Ocampo': 862,
    'Mier y Noriega': 7824,
    'Mina': 5447,
    'Parás': 1091,
    'Rayones': 2628,
    'Sabinas Hidalgo': 35254,
    'Vallecillo': 1857,
    'Villaldama': 4236
  }
};

/**
 * Dataset 2: GDP per Capita by Municipality (2024)
 * In Mexican Pesos (MXN)
 */
export const nlGdpDataset = {
  id: 'gdp',
  name: 'PIB per Cápita',
  description: 'PIB per cápita por municipio (2024)',
  colorScale: COLOR_SCALES.green,
  unit: 'currency',
  data: {
    'San Pedro Garza García': 980000,
    'Monterrey': 520000,
    'San Nicolás de los Garza': 420000,
    'Santa Catarina': 380000,
    'Guadalupe': 340000,
    'Apodaca': 360000,
    'General Escobedo': 290000,
    'García': 280000,
    'Juárez': 250000,
    'Cadereyta Jiménez': 320000,
    'Pesquería': 310000,
    'Santiago': 280000,
    'Salinas Victoria': 260000,
    'General Zuazua': 240000,
    'Ciénega de Flores': 220000,
    'Linares': 210000,
    'Montemorelos': 195000,
    'Allende': 180000,
    'Sabinas Hidalgo': 175000,
    'Anáhuac': 165000,
    'Hidalgo': 155000,
    'China': 145000,
    'General Terán': 140000,
    'Galeana': 125000,
    'Doctor Arroyo': 115000,
    'Aramberri': 110000,
    'Marín': 165000,
    'Cerralvo': 135000,
    'Carmen': 130000,
    'Los Ramones': 125000,
    'Lampazos de Naranjo': 120000,
    'Bustamante': 115000,
    'Mina': 110000,
    'General Zaragoza': 105000,
    'General Bravo': 100000,
    'Villaldama': 95000,
    'Iturbide': 90000,
    'Abasolo': 88000,
    'Agualeguas': 85000,
    'Doctor Coss': 82000,
    'Doctor González': 80000,
    'Rayones': 78000,
    'Higueras': 75000,
    'Los Aldamas': 72000,
    'Los Herreras': 70000,
    'Mier y Noriega': 68000,
    'Parás': 65000,
    'Vallecillo': 62000,
    'Melchor Ocampo': 60000,
    'General Treviño': 58000
  }
};

/**
 * Dataset 3: Population Density (people per km²)
 */
export const nlDensityDataset = {
  id: 'density',
  name: 'Densidad Poblacional',
  description: 'Habitantes por km² (2024)',
  colorScale: COLOR_SCALES.orange,
  unit: 'number',
  data: {
    'San Nicolás de los Garza': 5892,
    'Monterrey': 2789,
    'Guadalupe': 5124,
    'San Pedro Garza García': 1653,
    'Apodaca': 2341,
    'General Escobedo': 1987,
    'Santa Catarina': 456,
    'Juárez': 789,
    'García': 234,
    'Pesquería': 312,
    'Ciénega de Flores': 287,
    'General Zuazua': 198,
    'Salinas Victoria': 45,
    'Cadereyta Jiménez': 67,
    'Santiago': 42,
    'Hidalgo': 78,
    'Marín': 89,
    'Allende': 54,
    'Montemorelos': 32,
    'Linares': 15,
    'General Terán': 8,
    'China': 4,
    'Sabinas Hidalgo': 23,
    'Anáhuac': 5,
    'Galeana': 6,
    'Doctor Arroyo': 7,
    'Aramberri': 9,
    'Carmen': 12,
    'Cerralvo': 11,
    'Los Ramones': 8,
    'Lampazos de Naranjo': 3,
    'Bustamante': 4,
    'Mina': 2,
    'General Zaragoza': 5,
    'General Bravo': 6,
    'Villaldama': 7,
    'Iturbide': 8,
    'Abasolo': 3,
    'Agualeguas': 4,
    'Doctor Coss': 2,
    'Doctor González': 5,
    'Rayones': 3,
    'Higueras': 6,
    'Los Aldamas': 2,
    'Los Herreras': 3,
    'Mier y Noriega': 4,
    'Parás': 1,
    'Vallecillo': 2,
    'Melchor Ocampo': 1,
    'General Treviño': 2
  }
};

/**
 * Dataset 4: Industrial Employment (% of workforce)
 */
export const nlIndustrialDataset = {
  id: 'industrial',
  name: 'Empleo Industrial',
  description: '% de fuerza laboral en industria (2024)',
  colorScale: COLOR_SCALES.purple,
  unit: 'percent',
  data: {
    'Apodaca': 48.5,
    'Santa Catarina': 45.2,
    'General Escobedo': 44.8,
    'San Nicolás de los Garza': 42.1,
    'Monterrey': 38.5,
    'García': 41.3,
    'Pesquería': 52.4,
    'Guadalupe': 35.6,
    'Juárez': 38.9,
    'Cadereyta Jiménez': 35.2,
    'San Pedro Garza García': 18.5,
    'Ciénega de Flores': 32.4,
    'General Zuazua': 28.7,
    'Salinas Victoria': 42.1,
    'Santiago': 22.3,
    'Allende': 24.6,
    'Montemorelos': 28.4,
    'Linares': 26.8,
    'Sabinas Hidalgo': 22.5,
    'Hidalgo': 18.9,
    'Marín': 15.6,
    'Anáhuac': 14.2,
    'China': 12.8,
    'General Terán': 18.5,
    'Galeana': 15.2,
    'Doctor Arroyo': 12.4,
    'Aramberri': 10.8,
    'Carmen': 14.5,
    'Cerralvo': 16.2,
    'Los Ramones': 11.8,
    'Lampazos de Naranjo': 9.5,
    'Bustamante': 8.2,
    'Mina': 7.8,
    'General Zaragoza': 9.2,
    'General Bravo': 10.5,
    'Villaldama': 11.2,
    'Iturbide': 8.5,
    'Abasolo': 6.8,
    'Agualeguas': 7.2,
    'Doctor Coss': 5.8,
    'Doctor González': 8.4,
    'Rayones': 6.2,
    'Higueras': 7.5,
    'Los Aldamas': 5.2,
    'Los Herreras': 6.4,
    'Mier y Noriega': 7.8,
    'Parás': 4.5,
    'Vallecillo': 5.8,
    'Melchor Ocampo': 4.2,
    'General Treviño': 5.5
  }
};

/**
 * Dataset 5: Education Level (% with higher education)
 */
export const nlEducationDataset = {
  id: 'education',
  name: 'Educación Superior',
  description: '% con educación superior (2024)',
  colorScale: COLOR_SCALES.blue,
  unit: 'percent',
  data: {
    'San Pedro Garza García': 62.5,
    'Monterrey': 38.2,
    'San Nicolás de los Garza': 35.8,
    'Guadalupe': 28.4,
    'Santiago': 32.1,
    'Santa Catarina': 24.6,
    'Apodaca': 22.8,
    'General Escobedo': 21.5,
    'García': 18.9,
    'Juárez': 19.2,
    'Cadereyta Jiménez': 18.5,
    'Pesquería': 16.8,
    'Ciénega de Flores': 15.2,
    'General Zuazua': 17.4,
    'Salinas Victoria': 14.8,
    'Allende': 16.2,
    'Montemorelos': 18.5,
    'Linares': 17.2,
    'Sabinas Hidalgo': 14.5,
    'Hidalgo': 12.8,
    'Marín': 22.5,
    'Anáhuac': 11.2,
    'China': 9.8,
    'General Terán': 10.5,
    'Galeana': 8.2,
    'Doctor Arroyo': 7.5,
    'Aramberri': 6.8,
    'Carmen': 8.5,
    'Cerralvo': 9.2,
    'Los Ramones': 7.8,
    'Lampazos de Naranjo': 8.5,
    'Bustamante': 7.2,
    'Mina': 6.5,
    'General Zaragoza': 5.8,
    'General Bravo': 7.5,
    'Villaldama': 8.2,
    'Iturbide': 6.2,
    'Abasolo': 5.5,
    'Agualeguas': 5.8,
    'Doctor Coss': 4.8,
    'Doctor González': 6.5,
    'Rayones': 5.2,
    'Higueras': 5.8,
    'Los Aldamas': 4.5,
    'Los Herreras': 5.2,
    'Mier y Noriega': 4.2,
    'Parás': 3.8,
    'Vallecillo': 4.5,
    'Melchor Ocampo': 3.5,
    'General Treviño': 4.2
  }
};

/**
 * All Nuevo León datasets array
 */
export const NL_DATASETS = [
  nlPopulationDataset,
  nlGdpDataset,
  nlDensityDataset,
  nlIndustrialDataset,
  nlEducationDataset
];

/**
 * Get a Nuevo León dataset by ID
 */
export const getNlDatasetById = (id) => {
  return NL_DATASETS.find(dataset => dataset.id === id) || null;
};

/**
 * Nuevo León map configuration
 */
export const NL_CONFIG = {
  id: 'NLE',
  name: 'Nuevo León',
  center: { lng: -99.9, lat: 25.67 },
  zoom: 7,
  geojsonPath: '/data/nuevo-leon-municipios.geojson',
  idProperty: 'NAME_2',
  nameProperty: 'NAME_2'
};
