/**
 * Sample Datasets for the Geospatial Dashboard
 *
 * This file demonstrates how to structure data for the dashboard.
 * Each dataset contains:
 * - id: Unique identifier
 * - name: Display name
 * - description: What the data represents
 * - data: Object with region IDs as keys and values as numbers
 * - colorScale: The color scale to use (from colorScale.js)
 * - unit: How to format the numbers ('number', 'percent', 'currency')
 *
 * HOW TO ADD A NEW DATASET:
 * 1. Create a new object following the structure below
 * 2. Add it to the DATASETS array
 * 3. Ensure your region IDs match the GeoJSON 'id' property
 * 4. The map will automatically update!
 *
 * @module datasets
 */

import { COLOR_SCALES } from '../utils/colorScale.js';

/**
 * Dataset 1: Population by State (2024)
 * Source: Simulated data for demonstration
 */
export const populationDataset = {
  id: 'population',
  name: 'Population',
  description: 'Total population by state (2024 est.)',
  colorScale: COLOR_SCALES.blue,
  unit: 'number',
  data: {
    'CA': 39538223,
    'TX': 29145505,
    'FL': 21538187,
    'NY': 20201249,
    'PA': 13002700,
    'IL': 12812508,
    'OH': 11799448,
    'GA': 10711908,
    'NC': 10439388,
    'MI': 10077331,
    'NJ': 9288994,
    'VA': 8631393,
    'WA': 7705281,
    'AZ': 7151502,
    'MA': 7029917,
    'TN': 6910840,
    'IN': 6785528,
    'MO': 6154913,
    'MD': 6177224,
    'WI': 5893718,
    'CO': 5773714,
    'MN': 5706494,
    'SC': 5118425,
    'AL': 5024279,
    'LA': 4657757,
    'KY': 4505836,
    'OR': 4237256,
    'OK': 3959353,
    'CT': 3605944,
    'UT': 3271616,
    'IA': 3190369,
    'NV': 3104614,
    'AR': 3011524,
    'MS': 2961279,
    'KS': 2937880,
    'NM': 2117522,
    'NE': 1961504,
    'ID': 1839106,
    'WV': 1793716,
    'HI': 1455271,
    'NH': 1377529,
    'ME': 1362359,
    'RI': 1097379,
    'MT': 1084225,
    'DE': 989948,
    'SD': 886667,
    'ND': 779094,
    'AK': 733391,
    'VT': 643077,
    'WY': 576851
  }
};

/**
 * Dataset 2: GDP per Capita by State
 * Source: Simulated data for demonstration
 */
export const gdpDataset = {
  id: 'gdp',
  name: 'GDP per Capita',
  description: 'Gross Domestic Product per capita by state (2024)',
  colorScale: COLOR_SCALES.green,
  unit: 'currency',
  data: {
    'CA': 79315,
    'TX': 67444,
    'FL': 58389,
    'NY': 92470,
    'PA': 66259,
    'IL': 73133,
    'OH': 63098,
    'GA': 63029,
    'NC': 62281,
    'MI': 57880,
    'NJ': 80239,
    'VA': 72633,
    'WA': 87802,
    'AZ': 56667,
    'MA': 91203,
    'TN': 61409,
    'IN': 60674,
    'MO': 59845,
    'MD': 76776,
    'WI': 61862,
    'CO': 77364,
    'MN': 71920,
    'SC': 54297,
    'AL': 51471,
    'LA': 59673,
    'KY': 54057,
    'OR': 66633,
    'OK': 55151,
    'CT': 84972,
    'UT': 62909,
    'IA': 61836,
    'NV': 61108,
    'AR': 51347,
    'MS': 44820,
    'KS': 60915,
    'NM': 51645,
    'NE': 68059,
    'ID': 54721,
    'WV': 47985,
    'HI': 68517,
    'NH': 72992,
    'ME': 58924,
    'RI': 63877,
    'MT': 56366,
    'DE': 77214,
    'SD': 65419,
    'ND': 76894,
    'AK': 76398,
    'VT': 60365,
    'WY': 72495
  }
};

/**
 * Dataset 3: Unemployment Rate by State
 * Source: Simulated data for demonstration
 */
export const unemploymentDataset = {
  id: 'unemployment',
  name: 'Unemployment Rate',
  description: 'Unemployment rate by state (2024 Q4)',
  colorScale: COLOR_SCALES.orange,
  unit: 'percent',
  data: {
    'CA': 0.048,
    'TX': 0.039,
    'FL': 0.036,
    'NY': 0.044,
    'PA': 0.041,
    'IL': 0.045,
    'OH': 0.042,
    'GA': 0.037,
    'NC': 0.038,
    'MI': 0.046,
    'NJ': 0.043,
    'VA': 0.032,
    'WA': 0.047,
    'AZ': 0.041,
    'MA': 0.035,
    'TN': 0.036,
    'IN': 0.038,
    'MO': 0.034,
    'MD': 0.033,
    'WI': 0.031,
    'CO': 0.033,
    'MN': 0.028,
    'SC': 0.040,
    'AL': 0.042,
    'LA': 0.044,
    'KY': 0.046,
    'OR': 0.045,
    'OK': 0.037,
    'CT': 0.041,
    'UT': 0.025,
    'IA': 0.029,
    'NV': 0.052,
    'AR': 0.036,
    'MS': 0.047,
    'KS': 0.032,
    'NM': 0.048,
    'NE': 0.026,
    'ID': 0.030,
    'WV': 0.050,
    'HI': 0.038,
    'NH': 0.024,
    'ME': 0.033,
    'RI': 0.042,
    'MT': 0.031,
    'DE': 0.039,
    'SD': 0.023,
    'ND': 0.022,
    'AK': 0.046,
    'VT': 0.027,
    'WY': 0.035
  }
};

/**
 * Dataset 4: Population Density by State (2024)
 * Source: Simulated data for demonstration
 */
export const populationDensityDataset = {
  id: 'population_density',
  name: 'Population Density',
  description: 'Population density per square mile by state (2024 est.)',
  colorScale: COLOR_SCALES.red,
  unit: 'number',
  data: {
    'CA': 253, 'TX': 113, 'FL': 400, 'NY': 416, 'PA': 286, 'IL': 230, 'OH': 288,
    'GA': 187, 'NC': 223, 'MI': 177, 'NJ': 1210, 'VA': 218, 'WA': 116, 'AZ': 64,
    'MA': 890, 'TN': 167, 'IN': 190, 'MO': 90, 'MD': 627, 'WI': 108, 'CO': 56,
    'MN': 71, 'SC': 175, 'AL': 100, 'LA': 105, 'KY': 113, 'OR': 44, 'OK': 58,
    'CT': 740, 'UT': 40, 'IA': 57, 'NV': 28, 'AR': 58, 'MS': 63, 'KS': 36,
    'NM': 17, 'NE': 26, 'ID': 22, 'WV': 74, 'HI': 227, 'NH': 157, 'ME': 44,
    'RI': 1057, 'MT': 7, 'DE': 489, 'SD': 12, 'ND': 11, 'AK': 1, 'VT': 69,
    'WY': 6
  }
};

/**
 * Main datasets array
 * This is what the application will iterate over
 */
export const DATASETS = [
  populationDataset,
  gdpDataset,
  unemploymentDataset,
  populationDensityDataset // Added new dataset
];

/**
 * Get a dataset by ID
 * @param {string} id - Dataset ID
 * @returns {Object|null} Dataset object or null
 */
export const getDatasetById = (id) => {
  return DATASETS.find(dataset => dataset.id === id) || null;
};

/**
 * Get all dataset IDs
 * @returns {Array<string>} Array of dataset IDs
 */
export const getDatasetIds = () => {
  return DATASETS.map(dataset => dataset.id);
};
