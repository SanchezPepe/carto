import { useState, useRef, useEffect } from 'react';
import {
  HiMap,
  HiLocationMarker,
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp,
  HiChevronDown,
  HiOutlineMoon,
  HiOutlineSun,
  HiSearch,
  HiSelector
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import {
  HiFire,
  HiCube,
  HiArrowsPointingOut,
  HiMapPin,
  HiPaperAirplane,
  HiGlobeAmericas,
  HiMagnifyingGlass,
  HiArrowPath
} from 'react-icons/hi2';
import { MAP_TYPES } from './maps';
import { useIsMobile } from '../utils/useMediaQuery';
import { isVisualizationRecommended } from '../utils/visualizationSuggester';
import { STATE_NAMES } from '../data/mexico-datasets';

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
  onToggleTheme,
  onNavigateToState,
  stateNames = STATE_NAMES,
  mapLevel = 'national',
  onMapLevelChange,
  availableLevels = {},
  isLoadingLocal = false,
  onResetView
}) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [showDatasets, setShowDatasets] = useState(false);
  const [showStateSelector, setShowStateSelector] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const levelSelectorRef = useRef(null);

  // Close level selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (levelSelectorRef.current && !levelSelectorRef.current.contains(event.target)) {
        setShowLevelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Convert state names to sorted array
  const sortedStates = Object.entries(stateNames)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  // Filter states by search
  const filteredStates = stateSearch
    ? sortedStates.filter(s =>
        s.name.toLowerCase().includes(stateSearch.toLowerCase())
      )
    : sortedStates;

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
        {/* Top Bar - Logo, Level Selector and Theme */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between gap-2">
          <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
              <HiGlobeAmericas className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold gradient-text">Carto</span>
          </div>

          {/* Level Selector Dropdown */}
          {Object.keys(availableLevels).length > 1 && (
            <div className="relative" ref={levelSelectorRef}>
              <button
                onClick={() => setShowLevelSelector(!showLevelSelector)}
                disabled={isLoadingLocal}
                className={`glass-panel rounded-xl px-3 py-2 flex items-center gap-2 ${isLoadingLocal ? 'opacity-50' : ''}`}
              >
                <span>{availableLevels[mapLevel]?.icon || '🗺️'}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                  {mapLevel === 'national' ? 'País' : availableLevels[mapLevel]?.name}
                </span>
                <HiSelector className="w-4 h-4 text-gray-400" />
              </button>

              {showLevelSelector && (
                <div className="absolute top-full left-0 mt-2 w-48 glass-panel rounded-xl overflow-hidden shadow-xl z-50">
                  <div className="max-h-64 overflow-y-auto">
                    {Object.values(availableLevels).map((level) => {
                      const isActive = level.id === mapLevel;
                      return (
                        <button
                          key={level.id}
                          onClick={() => {
                            onMapLevelChange?.(level.id);
                            setShowLevelSelector(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-900/30'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <span className="text-lg">{level.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200'
                            }`}>
                              {level.id === 'national' ? 'Todo México' : level.name}
                            </p>
                            {level.id !== 'national' && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {level.description}
                              </p>
                            )}
                          </div>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {mapLevel === 'national' && (
              <button
                onClick={() => setShowStateSelector(true)}
                className="glass-panel rounded-xl p-2.5"
                title="Buscar estado"
              >
                <HiMagnifyingGlass className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            )}
            <button
              onClick={onResetView}
              className="glass-panel rounded-xl p-2.5"
              title="Reiniciar vista"
            >
              <HiArrowPath className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={onToggleTheme}
              className="glass-panel rounded-xl p-2.5"
            >
              {isDarkMode ? <HiOutlineSun className="w-5 h-5 text-gray-300" /> : <HiOutlineMoon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* State Selector Modal */}
        {showStateSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowStateSelector(false);
                setStateSearch('');
              }}
            />
            <div className="relative glass-panel rounded-2xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Navegar a Estado
                </h3>
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar estado..."
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {filteredStates.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => {
                      onNavigateToState?.(state.id);
                      setShowStateSelector(false);
                      setStateSearch('');
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {state.name}
                    </span>
                  </button>
                ))}
                {filteredStates.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-4">
                    No se encontraron estados
                  </p>
                )}
              </div>
              <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={() => {
                    onNavigateToState?.(null);
                    setShowStateSelector(false);
                    setStateSearch('');
                  }}
                  className="w-full py-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                >
                  Ver todo México
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 safe-area-bottom">
          <div className="glass-panel rounded-2xl p-2">
            {/* Map Type Icons */}
            <div className="flex items-center justify-around">
              {Object.values(MAP_TYPES).map((type) => {
                const Icon = mapTypeIcons[type.id];
                const isActive = type.id === mapType;
                const isRecommended = isVisualizationRecommended(activeDataset, type.id);

                return (
                  <button
                    key={type.id}
                    onClick={() => onMapTypeChange(type.id)}
                    className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{type.name.split(' ')[0]}</span>
                    {isRecommended && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dataset Selector - Only for choropleth */}
            {mapType === 'choropleth' && datasets.length > 0 && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1 px-1">
                  {datasets.map((dataset) => {
                    const isActive = dataset.id === activeDataset;
                    const icon = datasetIcons[dataset.id] || '📊';

                    return (
                      <button
                        key={dataset.id}
                        onClick={() => onDatasetChange(dataset.id)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span>{icon}</span>
                        <span>{dataset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </>
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
                  <h1 className="text-lg font-bold gradient-text">Carto</h1>
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

        {/* Map Level Selector */}
        {isExpanded && Object.keys(availableLevels).length > 1 && (
          <>
            <div className="p-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Nivel de Mapa
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowLevelSelector(!showLevelSelector)}
                  disabled={isLoadingLocal}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all hover:border-emerald-500/50 ${
                    isLoadingLocal ? 'opacity-50 cursor-wait' : ''
                  }`}
                >
                  <span className="text-xl">{availableLevels[mapLevel]?.icon || '🗺️'}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {mapLevel === 'national' ? 'Todo México' : availableLevels[mapLevel]?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mapLevel === 'national' ? '32 estados' : availableLevels[mapLevel]?.description}
                    </p>
                  </div>
                  <HiSelector className="w-5 h-5 text-gray-400" />
                </button>

                {showLevelSelector && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {Object.values(availableLevels).map((level) => {
                        const isActive = level.id === mapLevel;
                        return (
                          <button
                            key={level.id}
                            onClick={() => {
                              onMapLevelChange?.(level.id);
                              setShowLevelSelector(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              isActive
                                ? 'bg-emerald-50 dark:bg-emerald-900/30'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <span className="text-xl">{level.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-200'
                              }`}>
                                {level.id === 'national' ? 'Todo México' : level.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {level.id === 'national' ? '32 estados' : level.description}
                              </p>
                            </div>
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {isLoadingLocal && (
                <p className="text-xs text-center text-gray-500 mt-2 animate-pulse">
                  Cargando datos locales...
                </p>
              )}
            </div>
            <div className="divider mx-4" />
          </>
        )}

        {/* Map Type Selector */}
        <div className="p-4">
          {isExpanded ? (
            <>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Visualización
              </p>
              <div className="space-y-1">
                {Object.values(MAP_TYPES).map((type) => {
                  const Icon = mapTypeIcons[type.id];
                  const isActive = type.id === mapType;
                  const isRecommended = isVisualizationRecommended(activeDataset, type.id);

                  return (
                    <button
                      key={type.id}
                      onClick={() => onMapTypeChange(type.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 ring-1 ring-emerald-500/30'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <span className={`flex-1 text-left text-sm font-medium ${
                        isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {type.name}
                      </span>
                      {isRecommended && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                          Sugerido
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.values(MAP_TYPES).map((type) => {
                const Icon = mapTypeIcons[type.id];
                const isActive = type.id === mapType;
                const isRecommended = isVisualizationRecommended(activeDataset, type.id);

                return (
                  <button
                    key={type.id}
                    onClick={() => onMapTypeChange(type.id)}
                    className={`relative map-type-btn ${isActive ? 'active' : ''}`}
                    title={type.name}
                  >
                    <Icon className={`w-5 h-5 map-type-icon ${
                      isActive ? '' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    {isRecommended && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* State Navigation */}
        {isExpanded && (
          <>
            <div className="divider mx-4" />
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Navegar a Estado
              </p>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar estado..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  onFocus={() => setShowStateSelector(true)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              {showStateSelector && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  {filteredStates.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => {
                        onNavigateToState?.(state.id);
                        setShowStateSelector(false);
                        setStateSearch('');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {state.name}
                    </button>
                  ))}
                  {filteredStates.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-3">
                      No encontrado
                    </p>
                  )}
                  <button
                    onClick={() => {
                      onNavigateToState?.(null);
                      setShowStateSelector(false);
                      setStateSearch('');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium border-t border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    Ver todo México
                  </button>
                </div>
              )}
            </div>
          </>
        )}

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
          <div className={`flex ${isExpanded ? 'justify-between' : 'flex-col gap-2'}`}>
            <div className="flex gap-2">
              <button onClick={onToggleTheme} className="icon-btn" title="Cambiar tema">
                {isDarkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>
              <button onClick={onResetView} className="icon-btn" title="Reiniciar vista">
                <HiArrowPath className="w-5 h-5" />
              </button>
            </div>

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
