import { useState, useEffect } from 'react';
import NavigationSidebar from './components/NavigationSidebar.jsx';
import MapContainer from './components/MapContainer.jsx';
import DataPanel from './components/DataPanel.jsx';
import { DATASETS, getDatasetById } from './data/datasets.js';
import { toggleTheme } from './utils/darkMode';
import { HiOutlineMoon, HiOutlineSun, HiInformationCircle } from 'react-icons/hi';
import { Dropdown } from 'flowbite-react';
import usStatesGeoJSON from './data/us-states.geo.json';

/**
 * Main App Component
 *
 * Manages global state for the Geospatial Dashboard:
 * - Active dataset selection
 * - Selected region
 * - GeoJSON data
 *
 * ARCHITECTURE NOTES:
 * This component demonstrates the separation of concerns:
 * 1. Data is imported from datasets.js (easily replaceable)
 * 2. GeoJSON is loaded dynamically (can be from API)
 * 3. MapContainer is completely reusable (just pass props)
 * 4. State is managed here and flows down
 *
 * HOW TO EXTEND:
 * - Add new datasets to datasets.js
 * - Replace GeoJSON file with your own
 * - Add new data panels or visualizations
 * - Everything will work automatically!
 *
 * @component
 */
function App() {
  // State management
  const [activeDatasetId, setActiveDatasetId] = useState(DATASETS[0]?.id || null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [geojson, setGeojson] = useState(null);
  const [isLoadingGeoJSON, setIsLoadingGeoJSON] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  // Observe changes to the 'dark' class on the html element
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Derived state
  const activeDataset = getDatasetById(activeDatasetId);
  const selectedRegionData = selectedRegionId && activeDataset
    ? { id: selectedRegionId, value: activeDataset.data[selectedRegionId] }
    : null;

  // Load GeoJSON on mount
  useEffect(() => {
    console.log('GeoJSON loaded:', usStatesGeoJSON);
    console.log('GeoJSON type:', typeof usStatesGeoJSON);
    console.log('GeoJSON features count:', usStatesGeoJSON?.features?.length);
    console.log('Active dataset:', activeDataset);
    console.log('DATASETS:', DATASETS);

    setGeojson(usStatesGeoJSON);
    setIsLoadingGeoJSON(false);
  }, []);

  // Event handlers
  const handleDatasetChange = (datasetId) => {
    setActiveDatasetId(datasetId);
    // Optionally reset selected region when changing datasets
    // setSelectedRegionId(null);
  };

  const handleRegionClick = (regionId) => {
    setSelectedRegionId(regionId);
  };

  // Loading state
  if (isLoadingGeoJSON) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Dashboard...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing geospatial data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation - 280px fixed width */}
      <div className="w-80 flex-shrink-0">
        <NavigationSidebar
          datasets={DATASETS}
          activeDataset={activeDatasetId}
          onDatasetChange={handleDatasetChange}
        />
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeDataset?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                {activeDataset?.description || 'Select a dataset to begin'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* How to Use Instructions */}
              <Dropdown
                label=""
                renderTrigger={() => (
                  <button className="flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200">
                    <HiInformationCircle className="w-5 h-5" />
                  </button>
                )}
                placement="bottom-start"
              >
                <Dropdown.Header>
                  <span className="block text-sm font-semibold">How to use</span>
                </Dropdown.Header>
                <Dropdown.Item>
                  <ul className="text-xs text-gray-700 space-y-1 p-4 text-left dark:text-gray-200">
                    <li>• Click on regions to see details</li>
                    <li>• Switch datasets to compare metrics</li>
                    <li>• Hover over regions for quick stats</li>
                  </ul>
                </Dropdown.Item>
              </Dropdown>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>

              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Active Dataset</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeDataset?.name || 'None'}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Live data" />
            </div>
          </div>
        </div>

        {/* Map and Data Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Container - Takes remaining space */}
          <div className="flex-1 p-6">
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
              {activeDataset && geojson ? (
                <MapContainer
                  geojson={geojson}
                  data={activeDataset.data}
                  colorScale={activeDataset.colorScale}
                  onRegionClick={handleRegionClick}
                  selectedRegion={selectedRegionId}
                  dataUnit={activeDataset.unit}
                  idProperty="id"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="font-semibold">No data available</p>
                    <p className="text-sm mt-2">Please select a dataset from the sidebar</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Data Panel - 400px fixed width */}
          <div className="w-96 flex-shrink-0 bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <DataPanel
              selectedRegion={selectedRegionData}
              dataset={activeDataset}
              geojson={geojson}
              idProperty="id"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
