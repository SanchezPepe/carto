/**
 * Visualization Suggester
 *
 * Provides intelligent suggestions for which visualizations
 * work best with different datasets.
 */

/**
 * Mapping of dataset IDs to recommended visualization types
 * Ordered by relevance (most recommended first)
 */
export const DATASET_RECOMMENDATIONS = {
  population: ['choropleth', 'heatmap', 'hexagon'],
  gdp: ['choropleth'],
  density: ['choropleth', 'heatmap'],
  unemployment: ['choropleth'],
  hdi: ['choropleth'],
  tourism: ['choropleth', 'markers']
};

/**
 * Check if a visualization is recommended for a dataset
 * @param {string} datasetId - The dataset ID
 * @param {string} visualizationType - The visualization type ID
 * @returns {boolean} True if recommended
 */
export function isVisualizationRecommended(datasetId, visualizationType) {
  const recommendations = DATASET_RECOMMENDATIONS[datasetId];
  if (!recommendations) return false;
  return recommendations.includes(visualizationType);
}

/**
 * Get all recommended visualizations for a dataset
 * @param {string} datasetId - The dataset ID
 * @returns {string[]} Array of recommended visualization type IDs
 */
export function getRecommendedVisualizations(datasetId) {
  return DATASET_RECOMMENDATIONS[datasetId] || [];
}

/**
 * Get the primary (most recommended) visualization for a dataset
 * @param {string} datasetId - The dataset ID
 * @returns {string|null} The most recommended visualization type ID
 */
export function getPrimaryVisualization(datasetId) {
  const recommendations = DATASET_RECOMMENDATIONS[datasetId];
  return recommendations && recommendations.length > 0 ? recommendations[0] : null;
}
