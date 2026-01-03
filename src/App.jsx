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
import { loadAllData, getDatasetById, getTopCities } from './utils/dataLoader.js';
import { toggleTheme } from './utils/darkMode';
import { useIsMobile } from './utils/useMediaQuery';

/**
 * TerraVista - Modern Geospatial Visualization App
 *
 * Features a full-screen map with floating glassmorphic control panels.
 * Data is loaded from Firebase Storage at runtime.
 */
function App() {
  // Data state
  const [datasets, setDatasets] = useState([]);
  const [cities, setCities] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [activeDatasetId, setActiveDatasetId] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [mapType, setMapType] = useState('choropleth');
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const isMobile = useIsMobile();

  // Load data from Firebase Storage
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await loadAllData();
        setDatasets(data.datasets);
        setCities(data.cities);
        setGeojson(data.geojson);
        setAirports(data.airports || []);
        setFlights(data.flights || []);
        // Set initial dataset
        if (data.datasets.length > 0) {
          setActiveDatasetId(data.datasets[0].id);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Observe dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Derived state
  const activeDataset = getDatasetById(datasets, activeDatasetId);
  const selectedRegionData = selectedRegionId && activeDataset
    ? { id: selectedRegionId, value: activeDataset.data[selectedRegionId] }
    : null;

  // Arc data for connections
  const arcData = useMemo(() => {
    if (cities.length === 0) return { arcs: [], nodes: [] };

    const topCities = getTopCities(cities, 15);
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
  }, [cities]);

  // Flight data for airport connections
  const flightData = useMemo(() => {
    if (airports.length === 0 || flights.length === 0) return { arcs: [], nodes: [] };

    // Convert airports to nodes format
    const nodes = airports.map(airport => ({
      id: airport.id,
      name: airport.name,
      city: airport.city,
      lat: airport.lat,
      lng: airport.lng,
      population: airport.passengers,
      type: airport.type
    }));

    // Convert flights to arcs format
    const arcs = flights.map(flight => ({
      source: flight.from,
      target: flight.to,
      value: flight.frequency,
      label: `${flight.frequency} vuelos/día`
    }));

    return { arcs, nodes };
  }, [airports, flights]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-white text-xl font-semibold mb-2">Error al cargar datos</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Render map based on type
  const renderMap = () => {
    const commonProps = { isDarkMode };

    switch (mapType) {
      case 'choropleth':
        return (
          <ChoroplethMap
            geojson={geojson}
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
            cities={cities}
            onCityClick={handleCityClick}
            selectedCity={null}
            showLabels={true}
            {...commonProps}
          />
        );

      case 'heatmap':
        return (
          <HeatmapMap
            data={cities.map(c => ({
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
            data={cities.map(c => ({
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

      case 'flights':
        return (
          <ArcMap
            arcs={flightData.arcs}
            nodes={flightData.nodes}
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
        datasets={datasets}
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
            {mapType === 'flights' && 'Rutas aéreas entre aeropuertos de México'}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
