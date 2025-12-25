import { useEffect, useRef, useState } from 'react';
import { loadLeaflet } from '../utils/mapHelpers.js';
import { getColor, getDataRange, formatNumber } from '../utils/colorScale.js';

/**
 * MapContainer Component
 *
 * A completely reusable map component that displays choropleth maps.
 * This component is DATA-AGNOSTIC - it only needs:
 * - geojson: The geographic boundaries
 * - data: Object with region IDs and values
 * - colorScale: Array of colors
 *
 * HOW TO USE:
 * <MapContainer
 *   geojson={yourGeoJSON}
 *   data={yourData}
 *   colorScale={COLOR_SCALES.blue}
 *   onRegionClick={(regionId) => console.log(regionId)}
 *   selectedRegion="CA"
 *   dataUnit="number"
 * />
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.geojson - GeoJSON FeatureCollection
 * @param {Object} props.data - Data object with region IDs as keys
 * @param {Array} props.colorScale - Array of hex color codes
 * @param {Function} props.onRegionClick - Callback when a region is clicked
 * @param {string} props.selectedRegion - Currently selected region ID
 * @param {string} props.dataUnit - How to format numbers ('number', 'percent', 'currency')
 * @param {string} props.idProperty - GeoJSON property to use as ID (default: 'id')
 */
const MapContainer = ({
  geojson,
  data,
  colorScale,
  onRegionClick,
  selectedRegion = null,
  dataUnit = 'number',
  idProperty = 'id'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const tileLayerRef = useRef(null); // Ref to store the tile layer instance
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  // Observe changes to the 'dark' class on the html element
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);


  // Initialize map
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        // Load Leaflet dynamically
        await loadLeaflet();

        if (!mounted) return;

        // Create map instance if it doesn't exist
        if (!mapInstanceRef.current && mapContainerRef.current) {
          const map = window.L.map(mapContainerRef.current, {
            center: [37.8, -96],
            zoom: 4,
            zoomControl: true,
            scrollWheelZoom: true
          });

          mapInstanceRef.current = map;
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when dark mode changes
  useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }

      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      const newTileLayer = window.L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      });
      newTileLayer.addTo(mapInstanceRef.current);
      tileLayerRef.current = newTileLayer;
    }
  }, [isDarkMode]); // Rerun when isDarkMode changes


  // Update GeoJSON layer when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !geojson || !data || !window.L) {
      return;
    }

    // Remove existing layer
    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Calculate data range for color scaling
    const { min, max } = getDataRange(data);
    console.log('MapContainer - Data Min:', min, 'Max:', max);
    console.log('MapContainer - Color Scale:', colorScale);

    // Style function for each feature
    const style = (feature) => {
      const regionId = feature.properties[idProperty];
      const value = data[regionId];
      const fillColor = getColor(value, min, max, colorScale);

      return {
        fillColor: fillColor,
        weight: selectedRegion === regionId ? 4 : 2,
        opacity: 1,
        color: selectedRegion === regionId ? '#1e40af' : (isDarkMode ? '#555555' : '#ffffff'), // Adjust border color for dark mode
        fillOpacity: selectedRegion === regionId ? 0.9 : 0.7
      };
    };

    // Create tooltip content
    const getTooltipContent = (feature) => {
      const regionId = feature.properties[idProperty];
      const regionName = feature.properties.name || regionId;
      const value = data[regionId];

      if (value == null) {
        return `<div class="font-semibold ${isDarkMode ? 'dark:text-white' : ''}">${regionName}</div><div class="text-sm text-gray-500 ${isDarkMode ? 'dark:text-gray-400' : ''}">No data</div>`;
      }

      const formattedValue = formatNumber(value, dataUnit);
      return `<div class="font-semibold ${isDarkMode ? 'dark:text-white' : ''}">${regionName}</div><div class="text-sm ${isDarkMode ? 'dark:text-gray-300' : ''}">${formattedValue}</div>`;
    };

    // Event handlers
    const onEachFeature = (feature, layer) => {
      // Tooltip
      layer.bindTooltip(getTooltipContent(feature), {
        permanent: false,
        direction: 'auto',
        className: `custom-tooltip ${isDarkMode ? 'dark-tooltip' : ''}` // Add dark-tooltip class
      });

      // Click event
      layer.on('click', () => {
        const regionId = feature.properties[idProperty];
        if (onRegionClick) {
          onRegionClick(regionId);
        }
      });

      // Hover effects
      layer.on('mouseover', function() {
        if (feature.properties[idProperty] !== selectedRegion) {
          this.setStyle({
            weight: 3,
            fillOpacity: 0.85
          });
        }
      });

      layer.on('mouseout', function() {
        if (feature.properties[idProperty] !== selectedRegion) {
          geoJsonLayerRef.current.resetStyle(this);
        }
      });
    };

    // Add GeoJSON layer
    const geoJsonLayer = window.L.geoJSON(geojson, {
      style: style,
      onEachFeature: onEachFeature
    });

    geoJsonLayer.addTo(mapInstanceRef.current);
    geoJsonLayerRef.current = geoJsonLayer;

    // Fit bounds to show all features
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

  }, [geojson, data, colorScale, selectedRegion, dataUnit, idProperty, onRegionClick, isDarkMode]); // Added isDarkMode to dependencies

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg dark:bg-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg dark:bg-red-900">
        <div className="text-center text-red-600 dark:text-red-300">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-semibold">Error loading map</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="map-container w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
};

export default MapContainer;
