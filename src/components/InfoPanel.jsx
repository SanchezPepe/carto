import { HiX, HiTrendingUp, HiTrendingDown, HiMinus } from 'react-icons/hi';
import { formatNumber, getDataRange } from '../utils/colorScale.js';
import { STATE_NAMES } from '../data/mexico-datasets.js';

/**
 * InfoPanel - Floating right panel showing region details
 */
const InfoPanel = ({
  selectedRegion,
  dataset,
  onClose,
  isVisible
}) => {
  if (!isVisible || !selectedRegion) return null;

  const regionName = STATE_NAMES[selectedRegion.id] || selectedRegion.id;
  const value = selectedRegion.value;

  // Calculate statistics
  const getStats = () => {
    if (!dataset?.data) return null;
    const { min, max } = getDataRange(dataset.data);
    const values = Object.values(dataset.data).filter(v => v != null && !isNaN(v));
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const rank = sorted.indexOf(value) + 1;
    const percentile = ((value - min) / (max - min)) * 100;

    return { min, max, average, rank, total: values.length, percentile };
  };

  const stats = getStats();
  const vsAverage = stats ? value - stats.average : 0;
  const trend = vsAverage > 0 ? 'up' : vsAverage < 0 ? 'down' : 'neutral';

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 z-30 animate-slide-in-right">
      <div className="glass-panel rounded-2xl h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-emerald">{selectedRegion.id}</span>
                {trend === 'up' && <HiTrendingUp className="w-4 h-4 text-emerald-500" />}
                {trend === 'down' && <HiTrendingDown className="w-4 h-4 text-rose-500" />}
                {trend === 'neutral' && <HiMinus className="w-4 h-4 text-gray-400" />}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {regionName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="icon-btn -mr-2 -mt-1"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Value */}
        <div className="p-5">
          <div className="stat-card">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {dataset?.name || 'Valor'}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value != null ? formatNumber(value, dataset?.unit || 'number') : 'N/A'}
            </p>
            {stats && (
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-emerald-600' :
                  trend === 'down' ? 'text-rose-600' : 'text-gray-500'
                }`}>
                  {vsAverage > 0 ? '+' : ''}{formatNumber(vsAverage, dataset?.unit)}
                </span>
                <span className="text-xs text-gray-400">vs promedio</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="px-5 pb-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ranking</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  #{stats.total - stats.rank + 1}
                  <span className="text-sm font-normal text-gray-400 ml-1">/{stats.total}</span>
                </p>
              </div>
              <div className="stat-card">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Percentil</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.round(stats.percentile)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="divider mx-5" />

        {/* Comparison Bars */}
        {stats && (
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Comparación
            </p>

            <div className="space-y-4">
              {/* Value Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Este valor</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(value, dataset?.unit)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.percentile}%` }}
                  />
                </div>
              </div>

              {/* Average Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Promedio nacional</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(stats.average, dataset?.unit)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 dark:bg-gray-500 rounded-full"
                    style={{ width: `${((stats.average - stats.min) / (stats.max - stats.min)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Min/Max */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20">
                  <p className="text-xs text-rose-600 dark:text-rose-400 mb-1">Mínimo</p>
                  <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                    {formatNumber(stats.min, dataset?.unit)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Máximo</p>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {formatNumber(stats.max, dataset?.unit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        {dataset?.colorScale && (
          <div className="p-5 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Escala de color</p>
            <div className="h-3 rounded-full overflow-hidden flex">
              {dataset.colorScale.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 first:rounded-l-full last:rounded-r-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Bajo</span>
              <span>Alto</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
