import { useState, useEffect, useMemo } from 'react';
import NavigationSidebar from './components/NavigationSidebar.jsx';
import DataPanel from './components/DataPanel.jsx';
import {
  ChoroplethMap,
  MarkersMap,
  HeatmapMap,
  HexagonMap,
  ArcMap,
  MAP_TYPES
} from './components/maps';
import { MEXICO_DATASETS, getDatasetById, STATE_NAMES } from './data/mexico-datasets.js';
import { MEXICO_CITIES, getTopCities } from './data/mexico-cities.js';
import { toggleTheme } from './utils/darkMode';
import { HiOutlineMoon, HiOutlineSun, HiInformationCircle } from 'react-icons/hi';
import { Dropdown } from 'flowbite-react';
import mexicoStatesGeoJSON from './data/mexico-states.geo.json';

/**
 * TerraVista - Geospatial Visualization App for Mexico
 *
 * Features:
 * - Multiple map visualization types (Choropleth, Markers, Heatmap, Hexagon, Arc)
 * - 32 Mexican states with demographic data
 * - 50+ major cities with coordinates
 * - 6 different datasets
 *
 * @component
 */
function App() {
  // State management
  const [activeDatasetId, setActiveDatasetId] = useState(MEXICO_DATASETS[0]?.id || null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [mapType, setMapType] = useState('choropleth');
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  // Observe dark mode changes
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

  // Generate sample arc connections (top 10 cities connected to CDMX)
  const arcData = useMemo(() => {
    const topCities = getTopCities(15);
    const cdmx = topCities.find(c => c.id === 'cdmx');
    if (!cdmx) return { arcs: [], nodes: topCities };

    const arcs = topCities
      .filter(c => c.id !== 'cdmx')
      .map(city => ({
        source: 'cdmx',
        target: city.id,
        value: city.population / 100000,
        label: `Conexión comercial`
      }));

    return { arcs, nodes: topCities };
  }, []);

  // Event handlers
  const handleDatasetChange = (datasetId) => {
    setActiveDatasetId(datasetId);
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    setSelectedRegionId(null);
  };

  const handleRegionClick = (regionId) => {
    setSelectedRegionId(regionId);
  };

  const handleCityClick = (city) => {
    setSelectedRegionId(city.state);
  };

  // Render the appropriate map type
  const renderMap = () => {
    switch (mapType) {
      case 'choropleth':
        return (
          <ChoroplethMap
            geojson={mexicoStatesGeoJSON}
            data={activeDataset?.data || {}}
            colorScale={activeDataset?.colorScale || []}
            onRegionClick={handleRegionClick}
            selectedRegion={selectedRegionId}
            dataUnit={activeDataset?.unit}
            idProperty="id"
            isDarkMode={isDarkMode}
          />
        );

      case 'markers':
        return (
          <MarkersMap
            cities={MEXICO_CITIES}
            onCityClick={handleCityClick}
            selectedCity={null}
            showLabels={true}
            isDarkMode={isDarkMode}
          />
        );

      case 'heatmap':
        return (
          <HeatmapMap
            data={MEXICO_CITIES.map(c => ({
              lng: c.lng,
              lat: c.lat,
              weight: c.population
            }))}
            radiusPixels={50}
            intensity={1}
            threshold={0.03}
            isDarkMode={isDarkMode}
          />
        );

      case 'hexagon':
        return (
          <HexagonMap
            data={MEXICO_CITIES.map(c => ({
              lng: c.lng,
              lat: c.lat,
              weight: c.population,
              population: c.population
            }))}
            radius={30000}
            elevationScale={500}
            extruded={true}
            coverage={0.8}
            isDarkMode={isDarkMode}
          />
        );

      case 'arc':
        return (
          <ArcMap
            arcs={arcData.arcs}
            nodes={arcData.nodes}
            showNodes={true}
            isDarkMode={isDarkMode}
          />
        );

      default:
        return null;
    }
  };

  // Get map type info
  const currentMapType = MAP_TYPES[mapType];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-80 flex-shrink-0">
        <NavigationSidebar
          datasets={MEXICO_DATASETS}
          activeDataset={activeDatasetId}
          onDatasetChange={handleDatasetChange}
          mapType={mapType}
          onMapTypeChange={handleMapTypeChange}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeDataset?.name || 'Dashboard'}
                </h2>
                <span className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 rounded-full dark:from-emerald-900/40 dark:to-blue-900/40 dark:text-emerald-300">
                  {currentMapType?.icon} {currentMapType?.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                {activeDataset?.description || 'Select a dataset to begin'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* How to Use */}
              <Dropdown
                label=""
                renderTrigger={() => (
                  <button className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                    <HiInformationCircle className="w-5 h-5" />
                  </button>
                )}
                placement="bottom-start"
              >
                <Dropdown.Header>
                  <span className="block text-sm font-semibold">Cómo usar TerraVista</span>
                </Dropdown.Header>
                <Dropdown.Item>
                  <ul className="text-xs text-gray-700 space-y-2 p-3 text-left dark:text-gray-200">
                    <li>• Selecciona un tipo de mapa en la barra lateral</li>
                    <li>• Cambia entre datasets para comparar métricas</li>
                    <li>• Click en regiones para ver detalles</li>
                    <li>• Usa el scroll para hacer zoom</li>
                    <li>• Arrastra para mover el mapa</li>
                  </ul>
                </Dropdown.Item>
              </Dropdown>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                title="Cambiar tema"
              >
                {isDarkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>

              {/* Region indicator */}
              <div className="text-right border-l border-gray-200 dark:border-gray-700 pl-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Región Seleccionada</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedRegionId ? STATE_NAMES[selectedRegionId] || selectedRegionId : 'Ninguna'}
                </p>
              </div>

              {/* Live indicator */}
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title="Datos activos" />
            </div>
          </div>
        </div>

        {/* Map and Data Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 p-4">
            <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
              {renderMap()}
            </div>
          </div>

          {/* Data Panel */}
          {(mapType === 'choropleth' || mapType === 'markers') && (
            <div className="w-96 flex-shrink-0 bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <DataPanel
                selectedRegion={selectedRegionData}
                dataset={activeDataset}
                geojson={mexicoStatesGeoJSON}
                idProperty="id"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
