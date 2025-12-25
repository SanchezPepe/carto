import { Card, Badge } from 'flowbite-react';
import { formatNumber, getDataRange, generateLegend } from '../utils/colorScale.js';

/**
 * DataPanel Component
 *
 * Displays detailed information about the selected region and dataset.
 * Uses Flowbite Card components for a modern BI dashboard look.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.selectedRegion - Selected region data
 * @param {Object} props.dataset - Current dataset
 * @param {Object} props.geojson - GeoJSON to find region name
 * @param {string} props.idProperty - Property name for region ID
 */
const DataPanel = ({ selectedRegion, dataset, geojson, idProperty = 'id' }) => {
  // Find region details from GeoJSON
  const getRegionName = (regionId) => {
    if (!geojson || !geojson.features) return regionId;
    const feature = geojson.features.find(
      f => f.properties[idProperty] === regionId
    );
    return feature?.properties?.name || regionId;
  };

  // Calculate statistics
  const getStatistics = () => {
    if (!dataset || !dataset.data) return null;

    const { min, max } = getDataRange(dataset.data);
    const values = Object.values(dataset.data).filter(v => v != null && !isNaN(v));
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    return { min, max, average, count: values.length };
  };

  const stats = getStatistics();

  // If no region selected, show welcome message
  if (!selectedRegion) {
    return (
      <div className="h-full p-6 bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 dark:bg-blue-900">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
            Select a Region
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Click on any region in the map to view detailed statistics and insights.
          </p>
        </div>
      </div>
    );
  }

  const regionName = getRegionName(selectedRegion.id);
  const value = selectedRegion.value;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50 p-6 dark:bg-gray-900 dark:text-gray-200">
      <div className="space-y-6">
        {/* Region Header Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
                {regionName}
              </h2>
              <Badge color="blue" size="sm">
                {selectedRegion.id}
              </Badge>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Current Value Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {dataset?.name || 'Value'}
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {value != null ? formatNumber(value, dataset?.unit || 'number') : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {dataset?.description || 'Current dataset value'}
            </p>
          </div>
        </Card>

        {/* Statistics Card */}
        {stats && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
              Dataset Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Minimum</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.min, dataset?.unit || 'number')}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Average</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.average, dataset?.unit || 'number')}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Maximum</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.max, dataset?.unit || 'number')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Regions</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stats.count}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Legend Card */}
        {dataset && stats && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
              Color Legend
            </h3>
            <div className="space-y-2">
              {generateLegend(stats.min, stats.max, 5, dataset.colorScale).map((interval, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border border-gray-300 flex-shrink-0 dark:border-gray-600"
                    style={{ backgroundColor: interval.color }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {formatNumber(interval.min, dataset.unit)} - {formatNumber(interval.max, dataset.unit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Comparison Card */}
        {value != null && stats && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
              Regional Comparison
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">vs. Average</span>
                  <span className={`font-semibold ${
                    value > stats.average ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {value > stats.average ? '+' : ''}
                    {formatNumber(value - stats.average, dataset?.unit || 'number')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full ${
                      value > stats.average ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs((value - stats.average) / stats.average) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">Percentile Rank</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 h-3 rounded-full relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-gray-900 rounded"
                      style={{
                        left: `${((value - stats.min) / (stats.max - stats.min)) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right dark:text-white">
                    {Math.round(((value - stats.min) / (stats.max - stats.min)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DataPanel;
