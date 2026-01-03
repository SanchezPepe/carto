import { STATE_NAMES } from '../data/mexico-datasets.js';

/**
 * TopBar - Floating top bar showing current dataset and region info
 */
const TopBar = ({
  dataset,
  mapType,
  selectedRegion
}) => {
  const regionName = selectedRegion ? (STATE_NAMES[selectedRegion] || selectedRegion) : null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-4 animate-fade-in">
        {/* Dataset Info */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {dataset?.name || 'TerraVista'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Region Info */}
        <div className="text-sm">
          {regionName ? (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {regionName}
            </span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              Selecciona una región
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
