import { Sidebar } from "flowbite-react";
import { HiChartPie, HiDatabase, HiInformationCircle } from "react-icons/hi";

/**
 * NavigationSidebar Component
 *
 * Sidebar navigation using Flowbite React components.
 * Allows users to select between different datasets.
 *
 * HOW TO EXTEND:
 * 1. Add new datasets to the datasets array in datasets.js
 * 2. The sidebar will automatically display them
 * 3. No changes needed to this component!
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.datasets - Array of dataset objects
 * @param {string} props.activeDataset - ID of currently active dataset
 * @param {Function} props.onDatasetChange - Callback when dataset is selected
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed to icon-only
 * @param {Function} props.onToggleCollapse - Callback to toggle collapse state
 */
const NavigationSidebar = ({
  datasets = [],
  activeDataset,
  onDatasetChange,
}) => {
  // Icon mapping for different dataset types
  const getDatasetIcon = (datasetId) => {
    const iconMap = {
      population: HiChartPie,
      gdp: HiDatabase,
      unemployment: HiInformationCircle,
    };
    return iconMap[datasetId] || HiDatabase;
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Sidebar aria-label="Dashboard navigation" className="h-full">
        <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                clipRule="evenodd"
              />
            </svg>
            GeoAnalytics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Geospatial Data Dashboard
          </p>
        </div>

        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Data Layers
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
                  className={`cursor-pointer transition-smooth ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{dataset.name}</span>
                    <span className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {dataset.description}
                    </span>
                  </div>
                </Sidebar.Item>
              );
            })}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default NavigationSidebar;
