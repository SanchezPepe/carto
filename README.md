# GeoAnalytics - Geospatial Dashboard

A modern, modular, and highly reusable geospatial data visualization dashboard built with React, Tailwind CSS, Flowbite, and Leaflet.js.

![Dashboard Preview](https://img.shields.io/badge/React-18.3-blue?logo=react) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss) ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?logo=leaflet)

## Features

- **Modern BI Dashboard Design**: Clean, professional interface using Flowbite components
- **Interactive Choropleth Maps**: Dynamic color-coded regions with hover tooltips
- **Multiple Datasets**: Switch between different data layers instantly
- **Responsive Layout**: Sidebar navigation, map view, and detailed data panel
- **Completely Reusable**: Modular architecture allows easy data and GeoJSON replacement
- **Real-time Statistics**: Automatic calculations of min, max, average, and percentiles
- **Progressive Interactions**: Click regions for details, hover for quick stats

## Architecture

### Component Structure

```
src/
├── components/
│   ├── MapContainer.jsx       # Reusable map component (data-agnostic)
│   ├── NavigationSidebar.jsx  # Dataset selection sidebar
│   └── DataPanel.jsx          # Region details and statistics
├── data/
│   ├── datasets.js            # Dataset definitions
│   └── us-states.geo.json     # GeoJSON boundaries
├── utils/
│   ├── colorScale.js          # Color calculation utilities
│   └── mapHelpers.js          # Leaflet helper functions
├── styles/
│   └── index.css              # Global styles and Tailwind
├── App.jsx                    # Main application with state management
└── main.jsx                   # React entry point
```

### Data Flow

```
datasets.js → App.jsx (state) → MapContainer + DataPanel
geojson → App.jsx → MapContainer
User interactions → App.jsx → Update state → Re-render
```

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd carto
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:3000`

### Build for production:
```bash
npm run build
npm run preview
```

## How to Add a New Dataset

The architecture is designed to make adding datasets extremely simple. Follow these steps:

### Step 1: Define Your Dataset

Open `src/data/datasets.js` and add a new dataset object:

```javascript
export const myNewDataset = {
  id: 'my-new-metric',           // Unique identifier
  name: 'My New Metric',         // Display name in UI
  description: 'Description of what this data represents',
  colorScale: COLOR_SCALES.blue, // Choose from: blue, green, orange, purple, red
  unit: 'number',                // Options: 'number', 'percent', 'currency'
  data: {
    'CA': 12345,                 // Region ID → Value
    'TX': 67890,
    'FL': 54321,
    // ... more regions
  }
};
```

### Step 2: Add to DATASETS Array

```javascript
export const DATASETS = [
  populationDataset,
  gdpDataset,
  unemploymentDataset,
  myNewDataset  // ← Add your dataset here
];
```

That's it! Your new dataset will automatically appear in the sidebar and work with the map.

### Dataset Requirements

- **id**: Must be unique across all datasets
- **data**: Keys must match the `id` property in your GeoJSON features
- **colorScale**: Choose an appropriate color scheme for your data type
- **unit**: Determines how numbers are formatted in the UI

## How to Replace the GeoJSON

### Option 1: Replace the File

1. Replace `src/data/us-states.geo.json` with your own GeoJSON file
2. Ensure your GeoJSON follows this structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "REGION_ID",    // This must match dataset keys
        "name": "Region Name" // Display name
      },
      "geometry": { ... }
    }
  ]
}
```

### Option 2: Load from API

Edit `src/App.jsx` to fetch from an API:

```javascript
useEffect(() => {
  const loadGeoJSON = async () => {
    try {
      setIsLoadingGeoJSON(true);
      const response = await fetch('https://your-api.com/geojson');
      const data = await response.json();
      setGeojson(data);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    } finally {
      setIsLoadingGeoJSON(false);
    }
  };
  loadGeoJSON();
}, []);
```

### Important Notes

- The `id` property in GeoJSON features must match the keys in your dataset's `data` object
- If you use a different property name for IDs, update the `idProperty` prop in `App.jsx`:

```javascript
<MapContainer
  idProperty="your_custom_id_field"  // ← Change this
  // ... other props
/>
```

## Customization

### Change Color Schemes

Edit `src/utils/colorScale.js` to add new color scales:

```javascript
export const COLOR_SCALES = {
  // Add your custom scale
  custom: [
    '#fef3c7', // lightest
    '#fcd34d',
    '#f59e0b',
    '#d97706',
    '#92400e'  // darkest
  ]
};
```

### Modify Map Style

Edit the tile layer in `src/components/MapContainer.jsx`:

```javascript
window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '...',
}).addTo(map);
```

Popular tile providers:
- **OpenStreetMap**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **CartoDB Light**: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
- **CartoDB Dark**: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- **Stamen Terrain**: `https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg`

### Update Sidebar Branding

Edit `src/components/NavigationSidebar.jsx`:

```javascript
<h1 className="text-2xl font-bold text-gray-900">
  Your Brand Name
</h1>
```

## Component API

### MapContainer

```jsx
<MapContainer
  geojson={Object}        // GeoJSON FeatureCollection
  data={Object}           // { regionId: value }
  colorScale={Array}      // Array of hex colors
  onRegionClick={Function} // Callback: (regionId) => void
  selectedRegion={String}  // Currently selected region ID
  dataUnit={String}        // 'number' | 'percent' | 'currency'
  idProperty={String}      // GeoJSON property for region ID (default: 'id')
/>
```

### NavigationSidebar

```jsx
<NavigationSidebar
  datasets={Array}         // Array of dataset objects
  activeDataset={String}   // ID of active dataset
  onDatasetChange={Function} // Callback: (datasetId) => void
/>
```

### DataPanel

```jsx
<DataPanel
  selectedRegion={Object}  // { id, value }
  dataset={Object}         // Current dataset object
  geojson={Object}         // GeoJSON for region names
  idProperty={String}      // Property for region ID (default: 'id')
/>
```

## Utilities

### colorScale.js

Pure functions for color calculations:

```javascript
import { getColor, formatNumber, getDataRange } from './utils/colorScale.js';

// Get color for a value
const color = getColor(500, 0, 1000, COLOR_SCALES.blue);

// Format a number
const formatted = formatNumber(1234567, 'number'); // "1,234,567"

// Get min/max from dataset
const { min, max } = getDataRange(dataObject);
```

### mapHelpers.js

Leaflet utilities:

```javascript
import { loadLeaflet, findFeatureById } from './utils/mapHelpers.js';

// Dynamically load Leaflet
await loadLeaflet();

// Find a feature in GeoJSON
const feature = findFeatureById(geojson, 'CA', 'id');
```

## Technologies Used

- **React 18.3**: UI framework with functional components and hooks
- **Vite 5.4**: Lightning-fast build tool and dev server
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Flowbite React 0.10**: Pre-built React components
- **Leaflet 1.9**: Open-source interactive maps library
- **React Icons**: Icon library for UI elements

## Best Practices Implemented

1. **Separation of Concerns**: Data, logic, and presentation are separated
2. **Pure Functions**: Utility functions are side-effect free
3. **Component Reusability**: MapContainer is completely data-agnostic
4. **State Management**: Centralized in App.jsx with unidirectional data flow
5. **Dynamic Loading**: Leaflet loaded on-demand to avoid SSR issues
6. **Responsive Design**: Mobile-friendly layout with Tailwind
7. **Type Safety**: Clear prop interfaces documented for each component
8. **Performance**: React.memo potential for optimization if needed

## Troubleshooting

### Map not loading
- Check browser console for Leaflet loading errors
- Ensure CDN is accessible
- Verify GeoJSON format is valid

### Regions not colored
- Ensure dataset keys match GeoJSON `id` properties
- Check that data values are numbers, not strings
- Verify colorScale is properly imported

### Sidebar components not styled
- Run `npm install` to ensure Flowbite is installed
- Check that Tailwind config includes Flowbite content paths
- Verify `flowbite/plugin` is in `tailwind.config.js`

## Performance Optimization

For large datasets (1000+ regions):

1. **Use React.memo**:
```javascript
export default React.memo(MapContainer);
```

2. **Debounce interactions**:
```javascript
import { debounce } from 'lodash';
const debouncedClick = debounce(handleRegionClick, 300);
```

3. **Simplify GeoJSON**: Use tools like [mapshaper](https://mapshaper.org/) to reduce complexity

4. **Lazy load datasets**: Split datasets into separate files and load on demand

## License

MIT

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review component source code comments

---

**Built with modern web technologies for maximum maintainability and reusability.**
