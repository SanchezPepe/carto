# Practical Examples - GeoAnalytics Dashboard

## Quick Start Examples

### Example 1: Adding a New Dataset (Temperature Data)

**Step 1:** Create your dataset in `src/data/datasets.js`:

```javascript
export const temperatureDataset = {
  id: 'temperature',
  name: 'Average Temperature',
  description: 'Average annual temperature by state (°F)',
  colorScale: COLOR_SCALES.orange, // Orange for temperature
  unit: 'number',
  data: {
    'CA': 75.2,
    'TX': 78.5,
    'FL': 82.1,
    'NY': 65.3,
    // ... add more states
  }
};
```

**Step 2:** Add to DATASETS array:

```javascript
export const DATASETS = [
  populationDataset,
  gdpDataset,
  unemploymentDataset,
  temperatureDataset // ← Your new dataset
];
```

**Done!** The dashboard will automatically:
- Show it in the sidebar
- Apply appropriate colors
- Display statistics
- Handle interactions

---

### Example 2: Loading Data from an API

Replace the static data with live API data:

**Modify `src/data/datasets.js`:**

```javascript
// Function to fetch live data
export const fetchPopulationData = async () => {
  const response = await fetch('https://api.example.com/population');
  const apiData = await response.json();

  // Transform API response to our format
  const data = {};
  apiData.states.forEach(state => {
    data[state.code] = state.population;
  });

  return {
    id: 'population',
    name: 'Population (Live)',
    description: 'Real-time population data',
    colorScale: COLOR_SCALES.blue,
    unit: 'number',
    data: data
  };
};
```

**Update `src/App.jsx`:**

```javascript
import { fetchPopulationData } from './data/datasets.js';

function App() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const liveData = await fetchPopulationData();
        setDatasets([liveData, gdpDataset, unemploymentDataset]);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to static data
        setDatasets(DATASETS);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ... rest of component
}
```

---

### Example 3: Using a Different GeoJSON (World Countries)

**Step 1:** Get world countries GeoJSON:

Download from: https://github.com/datasets/geo-countries

**Step 2:** Place in `src/data/world-countries.geo.json`

**Step 3:** Update `src/App.jsx`:

```javascript
useEffect(() => {
  const loadGeoJSON = async () => {
    try {
      setIsLoadingGeoJSON(true);
      const response = await fetch('/src/data/world-countries.geo.json');
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

**Step 4:** Update your datasets to use country codes:

```javascript
export const worldPopulationDataset = {
  id: 'world-population',
  name: 'World Population',
  description: 'Population by country',
  colorScale: COLOR_SCALES.blue,
  unit: 'number',
  data: {
    'USA': 331000000,
    'CHN': 1400000000,
    'IND': 1380000000,
    'BRA': 212000000,
    // ... more countries
  }
};
```

**Step 5:** Ensure the GeoJSON id property matches:

If your GeoJSON uses `ISO_A3` instead of `id`:

```javascript
<MapContainer
  idProperty="ISO_A3"  // ← Change this
  // ... other props
/>
```

---

### Example 4: Custom Color Scale

Create a custom gradient for your data:

**Add to `src/utils/colorScale.js`:**

```javascript
export const COLOR_SCALES = {
  // Existing scales...

  // Custom gradient: Light yellow → Deep purple
  sunset: [
    '#FFF9E6', // Lightest
    '#FFE5B4',
    '#FFD700',
    '#FFA500',
    '#FF6347',
    '#DC143C',
    '#8B008B',
    '#4B0082', // Darkest
  ],

  // Diverging scale: Red ← White → Green
  diverging: [
    '#d73027', // Red (negative)
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#ffffbf', // White (neutral)
    '#d9ef8b',
    '#a6d96a',
    '#66bd63',
    '#1a9850', // Green (positive)
  ]
};
```

**Use in dataset:**

```javascript
export const myDataset = {
  // ...
  colorScale: COLOR_SCALES.sunset, // ← Use custom scale
  // ...
};
```

---

### Example 5: Adding a Chart Panel

Integrate Chart.js for additional visualizations:

**Install Chart.js:**

```bash
npm install react-chartjs-2 chart.js
```

**Create `src/components/ChartPanel.jsx`:**

```javascript
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartPanel = ({ dataset }) => {
  // Convert dataset to chart format
  const chartData = {
    labels: Object.keys(dataset.data),
    datasets: [{
      label: dataset.name,
      data: Object.values(dataset.data),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    }]
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {dataset.name} Distribution
      </h3>
      <Line data={chartData} />
    </div>
  );
};

export default ChartPanel;
```

**Add to `App.jsx`:**

```javascript
<div className="flex-1 p-6 space-y-6">
  {/* Existing map */}
  <div className="h-96">
    <MapContainer {...props} />
  </div>

  {/* New chart */}
  <ChartPanel dataset={activeDataset} />
</div>
```

---

### Example 6: Filtering Regions

Add a search/filter feature:

**Update `src/App.jsx`:**

```javascript
function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter GeoJSON based on search
  const filteredGeoJSON = useMemo(() => {
    if (!geojson || !searchTerm) return geojson;

    return {
      ...geojson,
      features: geojson.features.filter(feature =>
        feature.properties.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    };
  }, [geojson, searchTerm]);

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search regions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      />

      {/* Pass filtered GeoJSON */}
      <MapContainer
        geojson={filteredGeoJSON}
        // ... other props
      />
    </div>
  );
}
```

---

### Example 7: Export Map as Image

Add export functionality:

**Install html2canvas:**

```bash
npm install html2canvas
```

**Create export function:**

```javascript
import html2canvas from 'html2canvas';

const exportMapAsImage = async () => {
  const mapElement = document.querySelector('.leaflet-container');

  const canvas = await html2canvas(mapElement, {
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  // Download
  const link = document.createElement('a');
  link.download = 'map-export.png';
  link.href = canvas.toDataURL();
  link.click();
};
```

**Add export button:**

```javascript
<button
  onClick={exportMapAsImage}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Export Map
</button>
```

---

### Example 8: Time Series Animation

Animate data changes over time:

**Create time series dataset:**

```javascript
export const populationByYear = {
  id: 'population-timeline',
  name: 'Population Timeline',
  description: 'Population changes over time',
  colorScale: COLOR_SCALES.blue,
  unit: 'number',
  timeSeriesData: {
    2020: { 'CA': 39512223, 'TX': 29145505, /* ... */ },
    2021: { 'CA': 39538223, 'TX': 29500000, /* ... */ },
    2022: { 'CA': 39600000, 'TX': 29800000, /* ... */ },
    2023: { 'CA': 39700000, 'TX': 30100000, /* ... */ },
  }
};
```

**Add timeline control:**

```javascript
function App() {
  const [currentYear, setCurrentYear] = useState(2020);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance timeline
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentYear(prev => {
        const years = Object.keys(timeSeriesDataset.timeSeriesData);
        const currentIndex = years.indexOf(String(prev));
        const nextIndex = (currentIndex + 1) % years.length;
        return parseInt(years[nextIndex]);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Get data for current year
  const currentData = timeSeriesDataset.timeSeriesData[currentYear];

  return (
    <div>
      {/* Timeline controls */}
      <div className="flex items-center gap-4 p-4">
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <input
          type="range"
          min="2020"
          max="2023"
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
        />

        <span className="font-semibold">{currentYear}</span>
      </div>

      {/* Map with current year data */}
      <MapContainer data={currentData} {...otherProps} />
    </div>
  );
}
```

---

### Example 9: Comparison View (Side-by-Side)

Compare two datasets simultaneously:

```javascript
function App() {
  const [leftDataset, setLeftDataset] = useState(DATASETS[0]);
  const [rightDataset, setRightDataset] = useState(DATASETS[1]);

  return (
    <div className="grid grid-cols-2 gap-4 h-screen">
      {/* Left panel */}
      <div className="flex flex-col">
        <select onChange={(e) => setLeftDataset(getDatasetById(e.target.value))}>
          {DATASETS.map(ds => (
            <option key={ds.id} value={ds.id}>{ds.name}</option>
          ))}
        </select>

        <MapContainer
          geojson={geojson}
          data={leftDataset.data}
          colorScale={leftDataset.colorScale}
        />
      </div>

      {/* Right panel */}
      <div className="flex flex-col">
        <select onChange={(e) => setRightDataset(getDatasetById(e.target.value))}>
          {DATASETS.map(ds => (
            <option key={ds.id} value={ds.id}>{ds.name}</option>
          ))}
        </select>

        <MapContainer
          geojson={geojson}
          data={rightDataset.data}
          colorScale={rightDataset.colorScale}
        />
      </div>
    </div>
  );
}
```

---

### Example 10: CSV Upload Feature

Allow users to upload their own CSV data:

```javascript
import Papa from 'papaparse';

const CSVUploader = ({ onDataLoaded }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Expected CSV format:
        // regionId,value
        // CA,12345
        // TX,67890

        const data = {};
        results.data.forEach(row => {
          if (row.regionId && row.value) {
            data[row.regionId] = parseFloat(row.value);
          }
        });

        const customDataset = {
          id: 'csv-upload',
          name: 'Uploaded Data',
          description: `From ${file.name}`,
          colorScale: COLOR_SCALES.purple,
          unit: 'number',
          data: data
        };

        onDataLoaded(customDataset);
      }
    });
  };

  return (
    <div className="p-4">
      <label className="block mb-2 font-semibold">
        Upload CSV Data
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
      />
    </div>
  );
};
```

---

## Common Patterns

### Pattern: Conditional Rendering

Show different components based on state:

```javascript
{selectedRegionId ? (
  <DataPanel selectedRegion={...} />
) : (
  <WelcomeMessage />
)}
```

### Pattern: Loading States

Handle async data gracefully:

```javascript
{isLoading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} />
) : (
  <MapContainer {...props} />
)}
```

### Pattern: Responsive Breakpoints

Adapt layout for mobile:

```javascript
<div className="flex flex-col lg:flex-row">
  {/* Sidebar - full width on mobile, sidebar on desktop */}
  <div className="w-full lg:w-80">
    <NavigationSidebar />
  </div>

  {/* Map - stacks below sidebar on mobile */}
  <div className="flex-1">
    <MapContainer />
  </div>
</div>
```

---

## Debugging Tips

### Debug: Data not showing on map

```javascript
// Add console logs to trace data flow
console.log('GeoJSON features:', geojson?.features?.length);
console.log('Dataset keys:', Object.keys(activeDataset.data));
console.log('Matching IDs:', geojson?.features.map(f => f.properties.id));
```

### Debug: Colors not updating

```javascript
// Check color calculation
const { min, max } = getDataRange(data);
console.log('Data range:', min, max);
console.log('Sample color:', getColor(data['CA'], min, max, colorScale));
```

### Debug: Map not rendering

```javascript
// Check Leaflet loading
console.log('Leaflet loaded:', !!window.L);
console.log('Map instance:', mapInstanceRef.current);
```

---

## Next Steps

After mastering these examples, explore:

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Interactions**: Drag regions, draw polygons
3. **3D Visualization**: Integrate Three.js for elevation
4. **Mobile App**: Convert to React Native
5. **Backend Integration**: Build API with Node.js/Python

---

**Need more examples? Check component source code for inline documentation!**
