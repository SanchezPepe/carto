import { STATE_NAMES } from '../data/mexico-datasets.js';
import { useIsMobile } from '../utils/useMediaQuery';

/**
 * TopBar - Floating top bar showing current dataset and region info
 */
const TopBar = ({
  dataset,
  mapType,
  selectedRegion
}) => {
  const isMobile = useIsMobile();
  const regionName = selectedRegion ? (STATE_NAMES[selectedRegion] || selectedRegion) : null;

  return (
    <div className={`absolute left-1/2 -translate-x-1/2 z-20 ${
      isMobile ? 'top-14' : 'top-4'
    }`}>
      <div className={`glass-panel rounded-full flex items-center animate-fade-in ${
        isMobile ? 'px-3 py-1.5 gap-2' : 'px-4 py-2 gap-3'
      }`}>
        {/* Dataset Info */}
        <div className="flex items-center gap-2">
          <div className={`rounded-full bg-emerald-500 animate-pulse ${
            isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'
          }`} />
          <div>
            <p className={`font-semibold text-gray-900 dark:text-white ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}>
              {dataset?.name || 'TerraVista'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className={`w-px bg-gray-300 dark:bg-gray-600 ${
          isMobile ? 'h-4' : 'h-5'
        }`} />

        {/* Region Info */}
        <div className={isMobile ? 'text-xs' : 'text-xs'}>
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
