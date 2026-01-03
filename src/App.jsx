import { useState, useEffect, useMemo } from 'react';
import ControlPanel from './components/ControlPanel.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import TopBar from './components/TopBar.jsx';
import {
  ChoroplethMap,
  MarkersMap,
  HeatmapMap,
  HexagonMap,
  ArcMap
} from './components/maps';
import { MEXICO_DATASETS, getDatasetById } from './data/mexico-datasets.js';
import { MEXICO_CITIES, getTopCities } from './data/mexico-cities.js';
import { toggleTheme } from './utils/darkMode';
import { useIsMobile } from './utils/useMediaQuery';
import mexicoStatesGeoJSON from './data/mexico-states.geo.json';

/**
 * TerraVista - Modern Geospatial Visualization App
 *
 * Features a full-screen map with floating glassmorphic control panels.
 */
function App() {
  // State
  const [activeDatasetId, setActiveDatasetId] = useState(MEXICO_DATASETS[0]?.id || null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [mapType, setMapType] = useState('choropleth');
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const isMobile = useIsMobile();

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

  // Arc data for connections
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
        label: 'Conexión'
      }));

    return { arcs, nodes: topCities };
  }, []);

  // Handlers
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

  const handleCloseInfoPanel = () => {
    setSelectedRegionId(null);
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  // Render map based on type
  const renderMap = () => {
    const commonProps = { isDarkMode };

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
            {...commonProps}
          />
        );

      case 'markers':
        return (
          <MarkersMap
            cities={MEXICO_CITIES}
            onCityClick={handleCityClick}
            selectedCity={null}
            showLabels={true}
            {...commonProps}
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
            {...commonProps}
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
            {...commonProps}
          />
        );

      case 'arc':
        return (
          <ArcMap
            arcs={arcData.arcs}
            nodes={arcData.nodes}
            showNodes={true}
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  // Show info panel for choropleth and markers
  const showInfoPanel = (mapType === 'choropleth' || mapType === 'markers') && selectedRegionId;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900">
      {/* Full Screen Map */}
      <div className="absolute inset-0">
        {renderMap()}
      </div>

      {/* Top Bar */}
      <TopBar
        dataset={activeDataset}
        mapType={mapType}
        selectedRegion={selectedRegionId}
      />

      {/* Left Control Panel */}
      <ControlPanel
        mapType={mapType}
        onMapTypeChange={handleMapTypeChange}
        datasets={MEXICO_DATASETS}
        activeDataset={activeDatasetId}
        onDatasetChange={handleDatasetChange}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Right Info Panel */}
      <InfoPanel
        selectedRegion={selectedRegionData}
        dataset={activeDataset}
        onClose={handleCloseInfoPanel}
        isVisible={showInfoPanel}
      />

      {/* Map Type Indicator (bottom) - Hidden on mobile due to bottom sheet */}
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="glass-panel rounded-full px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
            {mapType === 'hexagon' && 'Ctrl + Arrastra para rotar • Scroll para zoom'}
            {mapType === 'arc' && 'Conexiones desde Ciudad de México'}
            {mapType === 'heatmap' && 'Densidad poblacional de ciudades'}
            {mapType === 'markers' && 'Click en ciudades para ver detalles'}
            {mapType === 'choropleth' && 'Click en estados para ver estadísticas'}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
