import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiUserGroup,
  HiCurrencyDollar,
  HiOfficeBuilding,
  HiTrendingDown,
  HiAcademicCap,
  HiGlobe,
  HiMap,
  HiLocationMarker,
  HiFire,
  HiCube,
  HiArrowsExpand
} from "react-icons/hi";
import { MAP_TYPES } from './maps';

/**
 * NavigationSidebar Component
 *
 * Sidebar navigation for TerraVista.
 * Allows users to select map types and datasets.
 *
 * @component
 */
const NavigationSidebar = ({
  datasets = [],
  activeDataset,
  onDatasetChange,
  mapType = 'choropleth',
  onMapTypeChange
}) => {
  // Icon mapping for different dataset types
  const getDatasetIcon = (datasetId) => {
    const iconMap = {
      population: HiUserGroup,
      gdp: HiCurrencyDollar,
      density: HiOfficeBuilding,
      unemployment: HiTrendingDown,
      hdi: HiAcademicCap,
      tourism: HiGlobe
    };
    return iconMap[datasetId] || HiChartPie;
  };

  // Icon mapping for map types
  const getMapTypeIcon = (typeId) => {
    const iconMap = {
      choropleth: HiMap,
      markers: HiLocationMarker,
      heatmap: HiFire,
      hexagon: HiCube,
      arc: HiArrowsExpand
    };
    return iconMap[typeId] || HiMap;
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Sidebar aria-label="TerraVista navigation" className="h-full">
        {/* Logo & Branding */}
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              TerraVista
            </span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-1">
            Visualización Geoespacial de México
          </p>
        </div>

        <Sidebar.Items>
          {/* Map Type Selector */}
          <Sidebar.ItemGroup>
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Tipo de Mapa
              </p>
            </div>

            <div className="px-2 space-y-1">
              {Object.values(MAP_TYPES).map((type) => {
                const Icon = getMapTypeIcon(type.id);
                const isActive = type.id === mapType;

                return (
                  <button
                    key={type.id}
                    onClick={() => onMapTypeChange?.(type.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 border border-emerald-200 dark:from-emerald-900/30 dark:to-blue-900/30 dark:text-emerald-300 dark:border-emerald-800"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm">{type.name}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                        {type.description}
                      </span>
                    </div>
                    <span className="text-lg">{type.icon}</span>
                  </button>
                );
              })}
            </div>
          </Sidebar.ItemGroup>

          {/* Dataset Selector */}
          <Sidebar.ItemGroup>
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Datos
              </p>
            </div>

            {datasets.map((dataset) => {
              const Icon = getDatasetIcon(dataset.id);
              const isActive = dataset.id === activeDataset;

              return (
                <Sidebar.Item
                  key={dataset.id}
                  icon={Icon}
                  active={isActive}
                  onClick={() => onDatasetChange(dataset.id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{dataset.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">
                      {dataset.description}
                    </span>
                  </div>
                </Sidebar.Item>
              );
            })}
          </Sidebar.ItemGroup>

          {/* Info Section */}
          <Sidebar.ItemGroup>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg mx-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <HiGlobe className="w-4 h-4" />
                <span>32 Estados de México</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <HiLocationMarker className="w-4 h-4" />
                <span>50+ Ciudades Principales</span>
              </div>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default NavigationSidebar;
