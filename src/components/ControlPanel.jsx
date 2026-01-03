import { useState } from 'react';
import {
  HiMap,
  HiLocationMarker,
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp,
  HiChevronDown,
  HiOutlineMoon,
  HiOutlineSun
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import {
  HiFire,
  HiCube,
  HiArrowsPointingOut,
  HiMapPin,
  HiPaperAirplane
} from 'react-icons/hi2';
import { MAP_TYPES } from './maps';
import { useIsMobile } from '../utils/useMediaQuery';

/**
 * ControlPanel - Responsive floating panel
 * Desktop: Left sidebar | Mobile: Bottom sheet
 */
const ControlPanel = ({
  mapType,
  onMapTypeChange,
  datasets,
  activeDataset,
  onDatasetChange,
  isDarkMode,
  onToggleTheme
}) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [showDatasets, setShowDatasets] = useState(false);

  const mapTypeIcons = {
    choropleth: HiMap,
    markers: HiLocationMarker,
    heatmap: HiFire,
    hexagon: HiCube,
    arc: HiArrowsPointingOut,
    flights: HiPaperAirplane
  };

  const datasetIcons = {
    population: '👥',
    gdp: '💰',
    density: '🏙️',
    unemployment: '📉',
    hdi: '📊',
    tourism: '✈️'
  };

  const currentDataset = datasets.find(d => d.id === activeDataset);

  // Mobile Bottom Sheet
  if (isMobile) {
    return (
      <>
        {/* Floating Action Buttons */}
        <div className="absolute left-4 top-4 z-30 flex flex-col gap-2">
          {/* Logo */}
          <div className="glass-panel rounded-2xl p-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <HiGlobeAmericas className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute right-4 top-4 z-30">
          <button
            onClick={onToggleTheme}
            className="glass-panel rounded-xl p-3"
          >
            {isDarkMode ? <HiOutlineSun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <HiOutlineMoon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Bottom Sheet */}
        <div
          className={`absolute left-0 right-0 bottom-0 z-30 transition-transform duration-300 ease-out ${
            isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'
          }`}
        >
          <div className="glass-panel rounded-t-3xl overflow-hidden">
            {/* Handle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-3 flex justify-center"
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </button>

            {/* Collapsed View - Map Types */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Visualización
                </p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400"
                >
                  {isExpanded ? <HiChevronDown className="w-5 h-5" /> : <HiChevronUp className="w-5 h-5" />}
                </button>
              </div>

              {/* Map Type Buttons */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {Object.values(MAP_TYPES).map((type) => {
                  const Icon = mapTypeIcons[type.id];
                  const isActive = type.id === mapType;

                  return (
                    <button
                      key={type.id}
                      onClick={() => onMapTypeChange(type.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25'
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expanded View - Datasets */}
            {isExpanded && (
              <div className="px-4 pb-6 animate-fade-in">
                <div className="divider mb-4" />

                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Datos
                </p>

                {/* Dataset Chips - Horizontal Scroll */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                  {datasets.map((dataset) => {
                    const isActive = dataset.id === activeDataset;
                    const icon = datasetIcons[dataset.id] || '📊';

                    return (
                      <button
                        key={dataset.id}
                        onClick={() => onDatasetChange(dataset.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 ring-2 ring-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{icon}</span>
                        <span className="text-sm font-medium">{dataset.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Current Dataset Info */}
                {currentDataset && (
                  <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentDataset.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className={`absolute left-4 top-4 bottom-4 z-30 flex flex-col transition-all duration-300 ease-out ${
        isExpanded ? 'w-72' : 'w-16'
      }`}
    >
      <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            {isExpanded ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <HiMapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">TerraVista</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">México</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 mx-auto">
                <HiMapPin className="w-5 h-5 text-white" />
              </div>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="icon-btn ml-2"
            >
              {isExpanded ? <HiChevronLeft className="w-5 h-5" /> : <HiChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Map Type Selector */}
        <div className="p-4">
          {isExpanded ? (
            <>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Visualización
              </p>
              <div className="relative">
                <select
                  value={mapType}
                  onChange={(e) => onMapTypeChange(e.target.value)}
                  className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                >
                  {Object.values(MAP_TYPES).map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.values(MAP_TYPES).map((type) => {
                const Icon = mapTypeIcons[type.id];
                const isActive = type.id === mapType;

                return (
                  <button
                    key={type.id}
                    onClick={() => onMapTypeChange(type.id)}
                    className={`map-type-btn ${isActive ? 'active' : ''}`}
                    title={type.name}
                  >
                    <Icon className={`w-5 h-5 map-type-icon ${
                      isActive ? '' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dataset Selector - Only for choropleth */}
        {mapType === 'choropleth' && (
          <>
            <div className="divider mx-4" />
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {isExpanded && (
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Datos
                </p>
              )}

              <div className="space-y-2">
                {datasets.map((dataset) => {
                  const isActive = dataset.id === activeDataset;
                  const icon = datasetIcons[dataset.id] || '📊';

                  return (
                    <button
                      key={dataset.id}
                      onClick={() => onDatasetChange(dataset.id)}
                      className={`w-full rounded-xl p-3 transition-all duration-200 ${
                        isExpanded ? 'text-left' : 'flex justify-center'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 ring-1 ring-emerald-500/30'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                      title={dataset.name}
                    >
                      {isExpanded ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {dataset.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {dataset.description}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xl">{icon}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Data Info - For non-choropleth maps */}
        {mapType !== 'choropleth' && isExpanded && (
          <>
            <div className="divider mx-4" />
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Datos
              </p>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-sm text-gray-600 dark:text-gray-400">
                {mapType === 'markers' && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>50+ ciudades de México</span>
                  </div>
                )}
                {mapType === 'heatmap' && (
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>Densidad por población</span>
                  </div>
                )}
                {mapType === 'hexagon' && (
                  <div className="flex items-center gap-2">
                    <span>⬡</span>
                    <span>Agregación de ciudades</span>
                  </div>
                )}
                {mapType === 'arc' && (
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>Conexiones desde CDMX</span>
                  </div>
                )}
                {mapType === 'flights' && (
                  <div className="flex items-center gap-2">
                    <span>✈️</span>
                    <span>30 aeropuertos, 44 rutas</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Footer Controls */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className={`flex ${isExpanded ? 'justify-between' : 'justify-center'}`}>
            <button onClick={onToggleTheme} className="icon-btn" title="Cambiar tema">
              {isDarkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>

            {isExpanded && (
              <a
                href="https://github.com/SanchezPepe/carto"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                title="Ver en GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
            )}
          </div>

          {isExpanded && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>32 Estados • 50+ Ciudades</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
