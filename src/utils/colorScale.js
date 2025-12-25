/**
 * Color Scale Utilities
 *
 * Pure functions for calculating choropleth colors based on data ranges.
 * This module is completely data-agnostic and can be reused with any dataset.
 *
 * @module colorScale
 */

/**
 * Predefined color scales for different data visualizations
 * Each scale contains colors from light to dark
 */
export const COLOR_SCALES = {
  // Blue scale - Good for population, general metrics
  blue: [
    '#eff6ff', // blue-50
    '#dbeafe', // blue-100
    '#bfdbfe', // blue-200
    '#93c5fd', // blue-300
    '#60a5fa', // blue-400
    '#3b82f6', // blue-500
    '#2563eb', // blue-600
    '#1d4ed8', // blue-700
    '#1e40af', // blue-800
  ],

  // Green scale - Good for positive metrics, growth
  green: [
    '#f0fdf4', // green-50
    '#dcfce7', // green-100
    '#bbf7d0', // green-200
    '#86efac', // green-300
    '#4ade80', // green-400
    '#22c55e', // green-500
    '#16a34a', // green-600
    '#15803d', // green-700
    '#166534', // green-800
  ],

  // Orange scale - Good for alerts, temperature
  orange: [
    '#fff7ed', // orange-50
    '#ffedd5', // orange-100
    '#fed7aa', // orange-200
    '#fdba74', // orange-300
    '#fb923c', // orange-400
    '#f97316', // orange-500
    '#ea580c', // orange-600
    '#c2410c', // orange-700
    '#9a3412', // orange-800
  ],

  // Purple scale - Good for economic data
  purple: [
    '#faf5ff', // purple-50
    '#f3e8ff', // purple-100
    '#e9d5ff', // purple-200
    '#d8b4fe', // purple-300
    '#c084fc', // purple-400
    '#a855f7', // purple-500
    '#9333ea', // purple-600
    '#7e22ce', // purple-700
    '#6b21a8', // purple-800
  ],

  // Red scale - Good for risk, negative metrics
  red: [
    '#fef2f2', // red-50
    '#fee2e2', // red-100
    '#fecaca', // red-200
    '#fca5a5', // red-300
    '#f87171', // red-400
    '#ef4444', // red-500
    '#dc2626', // red-600
    '#b91c1c', // red-700
    '#991b1b', // red-800
  ]
};

/**
 * Calculates the appropriate color for a value based on the data range
 *
 * @param {number} value - The value to get color for
 * @param {number} min - Minimum value in the dataset
 * @param {number} max - Maximum value in the dataset
 * @param {Array<string>} colorScale - Array of hex color codes (light to dark)
 * @returns {string} Hex color code
 *
 * @example
 * const color = getColor(500, 0, 1000, COLOR_SCALES.blue);
 * // Returns a mid-range blue color
 */
export const getColor = (value, min, max, colorScale = COLOR_SCALES.blue) => {
  // Handle edge cases
  if (value == null || isNaN(value)) {
    return '#e5e7eb'; // gray-200 for null/undefined values
  }

  if (min === max) {
    return colorScale[Math.floor(colorScale.length / 2)]; // Middle color
  }

  // Normalize value to 0-1 range
  const normalized = (value - min) / (max - min);

  // Map to color index
  const index = Math.floor(normalized * (colorScale.length - 1));
  const clampedIndex = Math.max(0, Math.min(colorScale.length - 1, index));

  return colorScale[clampedIndex];
};

/**
 * Generates legend intervals for a given data range
 *
 * @param {number} min - Minimum value in the dataset
 * @param {number} max - Maximum value in the dataset
 * @param {number} steps - Number of intervals (default: 5)
 * @returns {Array<{min: number, max: number, color: string}>} Array of interval objects
 *
 * @example
 * const legend = generateLegend(0, 1000, 5, COLOR_SCALES.blue);
 * // Returns 5 intervals with colors
 */
export const generateLegend = (min, max, steps = 5, colorScale = COLOR_SCALES.blue) => {
  const intervals = [];
  const range = max - min;
  const step = range / steps;

  for (let i = 0; i < steps; i++) {
    const intervalMin = min + (step * i);
    const intervalMax = min + (step * (i + 1));
    const colorIndex = Math.floor((i / (steps - 1)) * (colorScale.length - 1));

    intervals.push({
      min: Math.round(intervalMin),
      max: Math.round(intervalMax),
      color: colorScale[colorIndex] || colorScale[colorScale.length - 1]
    });
  }

  return intervals;
};

/**
 * Gets the min and max values from a dataset
 *
 * @param {Object} data - Object where keys are region IDs and values are numbers
 * @returns {{min: number, max: number}} Object with min and max values
 *
 * @example
 * const range = getDataRange({ 'region1': 100, 'region2': 500 });
 * // Returns { min: 100, max: 500 }
 */
export const getDataRange = (data) => {
  const values = Object.values(data).filter(v => v != null && !isNaN(v));

  if (values.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
};

/**
 * Formats a number for display
 *
 * @param {number} value - Number to format
 * @param {string} type - Type of formatting ('number', 'percent', 'currency')
 * @returns {string} Formatted string
 *
 * @example
 * formatNumber(1234567, 'number'); // "1,234,567"
 * formatNumber(0.856, 'percent'); // "85.6%"
 * formatNumber(1234.56, 'currency'); // "$1,234.56"
 */
export const formatNumber = (value, type = 'number') => {
  if (value == null || isNaN(value)) {
    return 'N/A';
  }

  switch (type) {
    case 'percent':
      return `${(value * 100).toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};
