/**
 * Data Loader Utility
 *
 * Fetches geospatial data from Firebase Storage.
 * Handles caching and provides helper functions for data access.
 *
 * @module dataLoader
 */

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.js';
import { COLOR_SCALES } from './colorScale.js';

// Cache for loaded data
const cache = {
  datasets: null,
  cities: null,
  geojson: null,
  stateNames: null,
  airports: null,
  flights: null
};

/**
 * Fetches JSON data from Firebase Storage
 * @param {string} path - Path to the file in storage
 * @returns {Promise<Object>} Parsed JSON data
 */
async function fetchFromStorage(path) {
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Loads all datasets from storage
 * @returns {Promise<Array>} Array of dataset objects with resolved color scales
 */
export async function loadDatasets() {
  if (cache.datasets) {
    return cache.datasets;
  }

  const data = await fetchFromStorage('data/mexico-datasets.json');

  // Resolve color scale names to actual arrays
  const datasets = data.datasets.map(dataset => ({
    ...dataset,
    colorScale: COLOR_SCALES[dataset.colorScale] || COLOR_SCALES.blue
  }));

  cache.datasets = datasets;
  cache.stateNames = data.stateNames;

  return datasets;
}

/**
 * Loads cities data from storage
 * @returns {Promise<Array>} Array of city objects
 */
export async function loadCities() {
  if (cache.cities) {
    return cache.cities;
  }

  const data = await fetchFromStorage('data/mexico-cities.json');
  cache.cities = data.cities;

  return data.cities;
}

/**
 * Loads GeoJSON data from storage
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
export async function loadGeoJSON() {
  if (cache.geojson) {
    return cache.geojson;
  }

  const geojson = await fetchFromStorage('data/mexico-states.geo.json');
  cache.geojson = geojson;

  return geojson;
}

/**
 * Loads airports and flights data from storage
 * @returns {Promise<Object>} Object containing airports and flights arrays
 */
export async function loadAirports() {
  if (cache.airports && cache.flights) {
    return { airports: cache.airports, flights: cache.flights };
  }

  const data = await fetchFromStorage('data/mexico-airports.json');
  cache.airports = data.airports;
  cache.flights = data.flights;

  return {
    airports: data.airports,
    flights: data.flights,
    airportTypeColors: data.airportTypeColors,
    airportTypeLabels: data.airportTypeLabels
  };
}

/**
 * Loads all data in parallel
 * @returns {Promise<Object>} Object containing datasets, cities, geojson, airports, flights, and stateNames
 */
export async function loadAllData() {
  const [datasets, cities, geojson, airportData] = await Promise.all([
    loadDatasets(),
    loadCities(),
    loadGeoJSON(),
    loadAirports()
  ]);

  return {
    datasets,
    cities,
    geojson,
    airports: airportData.airports,
    flights: airportData.flights,
    airportTypeColors: airportData.airportTypeColors,
    airportTypeLabels: airportData.airportTypeLabels,
    stateNames: cache.stateNames
  };
}

/**
 * Get a dataset by ID
 * @param {Array} datasets - Array of datasets
 * @param {string} id - Dataset ID
 * @returns {Object|null} Dataset object or null
 */
export function getDatasetById(datasets, id) {
  return datasets.find(dataset => dataset.id === id) || null;
}

/**
 * Get all dataset IDs
 * @param {Array} datasets - Array of datasets
 * @returns {Array<string>} Array of dataset IDs
 */
export function getDatasetIds(datasets) {
  return datasets.map(dataset => dataset.id);
}

/**
 * Get cities by state
 * @param {Array} cities - Array of cities
 * @param {string} stateId - State ID (e.g., 'JAL', 'NLE')
 * @returns {Array} Cities in the specified state
 */
export function getCitiesByState(cities, stateId) {
  return cities.filter(city => city.state === stateId);
}

/**
 * Get cities by type
 * @param {Array} cities - Array of cities
 * @param {string} type - City type (capital, major, large, medium, tourist, industrial)
 * @returns {Array} Cities of the specified type
 */
export function getCitiesByType(cities, type) {
  return cities.filter(city => city.type === type);
}

/**
 * Get top N cities by population
 * @param {Array} cities - Array of cities
 * @param {number} n - Number of cities to return
 * @returns {Array} Top N cities by population
 */
export function getTopCities(cities, n = 10) {
  return [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, n);
}

/**
 * City type colors for visualization
 */
export const CITY_TYPE_COLORS = {
  capital: '#dc2626',
  major: '#ea580c',
  large: '#ca8a04',
  medium: '#16a34a',
  tourist: '#0ea5e9',
  industrial: '#7c3aed'
};

/**
 * City type labels
 */
export const CITY_TYPE_LABELS = {
  capital: 'Capital Nacional',
  major: 'Área Metropolitana',
  large: 'Ciudad Grande',
  medium: 'Ciudad Media',
  tourist: 'Destino Turístico',
  industrial: 'Centro Industrial'
};

/**
 * Clears the data cache
 */
export function clearCache() {
  cache.datasets = null;
  cache.cities = null;
  cache.geojson = null;
  cache.stateNames = null;
  cache.airports = null;
  cache.flights = null;
}
