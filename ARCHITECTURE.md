# Architecture Guide - GeoAnalytics Dashboard

## Overview

This dashboard follows a **component-based architecture** with clear separation of concerns. The design prioritizes **reusability** and **maintainability**.

## Core Principles

### 1. Data Agnostic Components

The `MapContainer` component is completely independent of the data it displays. It only requires:
- GeoJSON boundaries
- Data object (key-value pairs)
- Color scale
- Event handlers

This means you can swap datasets without touching the component code.

### 2. Unidirectional Data Flow

```
datasets.js (data source)
    ↓
App.jsx (state management)
    ↓
MapContainer / DataPanel (presentation)
    ↓
User interactions → callbacks → back to App.jsx
```

### 3. Pure Utility Functions

All utilities in `src/utils/` are **pure functions**:
- No side effects
- Same input = same output
- Easily testable
- Reusable across components

## Component Breakdown

### App.jsx - State Manager

**Responsibility**: Orchestrate the entire application

```javascript
State Managed:
- activeDatasetId: Which dataset is displayed
- selectedRegionId: Which region is clicked
- geojson: Geographic boundaries
- isLoadingGeoJSON: Loading state

Props Passed Down:
- To MapContainer: geojson, data, colorScale, callbacks
- To DataPanel: selectedRegion, dataset, geojson
- To NavigationSidebar: datasets, activeDataset, callbacks
```

**Why this design?**
- Single source of truth
- Easy to debug (all state in one place)
- Predictable data flow

### MapContainer.jsx - Map Visualization

**Responsibility**: Display choropleth map with interactions

**Key Features:**
- Dynamic Leaflet loading (avoids SSR issues)
- Automatic color scaling
- Hover tooltips
- Click interactions
- Responsive to prop changes

**Props Interface:**
```javascript
{
  geojson: Object,        // Required: GeoJSON FeatureCollection
  data: Object,           // Required: { regionId: value }
  colorScale: Array,      // Required: Hex color array
  onRegionClick: Function, // Optional: Click handler
  selectedRegion: String,  // Optional: Highlighted region
  dataUnit: String,        // Optional: Number format
  idProperty: String       // Optional: GeoJSON ID property
}
```

**Extending the Map:**
1. Add new interaction types (double-click, right-click)
2. Add custom markers or overlays
3. Implement zoom to region functionality
4. Add layer controls for base maps

### NavigationSidebar.jsx - Dataset Selection

**Responsibility**: Display available datasets and navigation

**Built with:** Flowbite React Sidebar component

**Customization Points:**
- Icon mapping (getDatasetIcon function)
- Sidebar width (adjust in App.jsx grid)
- Additional navigation sections
- User settings panel

### DataPanel.jsx - Region Details

**Responsibility**: Show detailed statistics for selected regions

**Components Used:**
- Flowbite Cards
- Flowbite Badges
- Custom comparison visualizations

**Information Displayed:**
1. Region name and ID
2. Current dataset value
3. Dataset-wide statistics
4. Color legend
5. Comparison metrics

**Extension Ideas:**
- Add charts (line, bar, pie)
- Historical data comparison
- Export functionality
- Share/print options

## Data Layer

### datasets.js

**Structure:**
```javascript
{
  id: String,              // Unique identifier
  name: String,            // UI display name
  description: String,     // Subtitle/tooltip
  colorScale: Array,       // Colors from colorScale.js
  unit: String,            // 'number' | 'percent' | 'currency'
  data: Object            // { regionId: value }
}
```

**Adding Real Data Sources:**

#### From REST API:
```javascript
export const fetchLiveDataset = async (datasetId) => {
  const response = await fetch(`/api/datasets/${datasetId}`);
  const data = await response.json();

  return {
    id: datasetId,
    name: data.name,
    description: data.description,
    colorScale: COLOR_SCALES[data.colorType],
    unit: data.unit,
    data: data.values // Must be { regionId: value }
  };
};
```

#### From CSV:
```javascript
import Papa from 'papaparse';

export const loadDatasetFromCSV = (csvFile) => {
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        const data = {};
        results.data.forEach(row => {
          data[row.regionId] = parseFloat(row.value);
        });

        resolve({
          id: 'csv-data',
          name: 'CSV Dataset',
          data: data,
          // ... other props
        });
      }
    });
  });
};
```

### GeoJSON

**Requirements:**
- Must be valid GeoJSON FeatureCollection
- Each feature needs `properties.id` (or custom idProperty)
- Coordinates should be in WGS84 (EPSG:4326)

**Sources for GeoJSON:**
- [Natural Earth Data](https://www.naturalearthdata.com/)
- [geojson.io](https://geojson.io/)
- [OpenStreetMap Export](https://www.openstreetmap.org/export)
- Country-specific government portals

## Utility Functions

### colorScale.js

**Exports:**
- `COLOR_SCALES`: Predefined color palettes
- `getColor()`: Calculate color for a value
- `generateLegend()`: Create legend intervals
- `getDataRange()`: Get min/max from data
- `formatNumber()`: Format values for display

**Creating Custom Scales:**
```javascript
export const COLOR_SCALES = {
  myCustomScale: [
    '#lightest',
    '#light',
    '#medium',
    '#dark',
    '#darkest'
  ]
};
```

**ColorBrewer Integration:**
Import ColorBrewer scales for professional palettes:
```javascript
import * as colorbrewer from 'colorbrewer';

export const COLOR_SCALES = {
  ...colorbrewer.YlOrRd[9],
  ...colorbrewer.Blues[9]
};
```

### mapHelpers.js

**Exports:**
- `loadLeaflet()`: Dynamic script loader
- `findFeatureById()`: Search GeoJSON
- `getFeatureCenter()`: Calculate centroid
- `isValidGeoJSON()`: Validation
- `mergeGeoJSONWithData()`: Combine data sources

## State Management Patterns

### Current: Lift State Up

All state is in `App.jsx` and passed down as props.

**Pros:**
- Simple to understand
- No additional dependencies
- Good for small-medium apps

**Cons:**
- Prop drilling for deep trees
- Re-renders entire subtree

### Migration to Context API

For larger apps, consider React Context:

```javascript
// src/context/DashboardContext.jsx
import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [activeDatasetId, setActiveDatasetId] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  return (
    <DashboardContext.Provider value={{
      activeDatasetId,
      setActiveDatasetId,
      selectedRegionId,
      setSelectedRegionId
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
```

### Migration to Redux/Zustand

For very large apps with complex state:

```javascript
// src/store/dashboardStore.js (Zustand example)
import create from 'zustand';

export const useDashboardStore = create((set) => ({
  activeDatasetId: null,
  selectedRegionId: null,
  setActiveDataset: (id) => set({ activeDatasetId: id }),
  setSelectedRegion: (id) => set({ selectedRegionId: id })
}));
```

## Performance Optimization

### Current Performance

With ~50 regions and 3 datasets, performance is excellent. No optimization needed.

### For Large Datasets (500+ regions)

#### 1. Memoize Expensive Calculations

```javascript
import { useMemo } from 'react';

const MapContainer = ({ geojson, data, colorScale }) => {
  const { min, max } = useMemo(
    () => getDataRange(data),
    [data]
  );

  // ... rest of component
};
```

#### 2. React.memo for Pure Components

```javascript
import { memo } from 'react';

const DataPanel = memo(({ selectedRegion, dataset }) => {
  // ... component code
});

export default DataPanel;
```

#### 3. Virtualization for Large Lists

If you add a region list view:
```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={regions.length}
  itemSize={50}
>
  {RegionRow}
</FixedSizeList>
```

#### 4. Web Workers for Heavy Calculations

For complex data processing:
```javascript
// src/workers/dataProcessor.worker.js
self.onmessage = (e) => {
  const { data, operation } = e.data;
  const result = performHeavyCalculation(data, operation);
  self.postMessage(result);
};
```

## Testing Strategy

### Unit Tests

Test utilities in isolation:

```javascript
// colorScale.test.js
import { getColor, COLOR_SCALES } from '../utils/colorScale';

describe('getColor', () => {
  it('returns correct color for middle value', () => {
    const color = getColor(50, 0, 100, COLOR_SCALES.blue);
    expect(color).toBe(COLOR_SCALES.blue[4]);
  });
});
```

### Component Tests

Test component behavior:

```javascript
// MapContainer.test.jsx
import { render, fireEvent } from '@testing-library/react';
import MapContainer from '../components/MapContainer';

describe('MapContainer', () => {
  it('calls onRegionClick when region is clicked', () => {
    const mockClick = jest.fn();
    const { container } = render(
      <MapContainer
        geojson={mockGeoJSON}
        data={mockData}
        onRegionClick={mockClick}
      />
    );

    // Simulate click
    // Assert mockClick was called
  });
});
```

### Integration Tests

Test full user flows:

```javascript
// App.integration.test.jsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Dashboard Integration', () => {
  it('changes map when dataset is selected', async () => {
    const { getByText } = render(<App />);

    fireEvent.click(getByText('GDP per Capita'));

    await waitFor(() => {
      // Assert map updated
    });
  });
});
```

## Deployment

### Static Hosting (Recommended)

The app is a static SPA, perfect for:
- **Netlify**: Drag & drop `dist/` folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Enable in repo settings
- **Firebase Hosting**: `firebase deploy`

### Docker Container

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

For API endpoints:

```javascript
// vite.config.js
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:3000'
    )
  }
});

// Usage in code
const apiUrl = import.meta.env.VITE_API_URL;
```

## Security Considerations

### Content Security Policy

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' https://unpkg.com;
               style-src 'self' 'unsafe-inline' https://unpkg.com;">
```

### Data Validation

Always validate external data:
```javascript
const validateDataset = (dataset) => {
  if (!dataset.id || !dataset.data) {
    throw new Error('Invalid dataset format');
  }

  Object.values(dataset.data).forEach(value => {
    if (typeof value !== 'number') {
      throw new Error('Dataset values must be numbers');
    }
  });
};
```

## Future Enhancements

### Feature Ideas

1. **Time Series Support**
   - Animate changes over time
   - Timeline slider component
   - Play/pause controls

2. **Multi-layer Maps**
   - Toggle multiple datasets simultaneously
   - Opacity controls
   - Layer order management

3. **Export Functionality**
   - Export map as PNG/SVG
   - Export data as CSV/JSON
   - Generate PDF reports

4. **Comparison Mode**
   - Side-by-side map comparison
   - Difference calculation
   - Correlation analysis

5. **User Preferences**
   - Save favorite datasets
   - Custom color schemes
   - Layout preferences

6. **Collaboration**
   - Share custom views via URL
   - Annotations and notes
   - Real-time collaboration

7. **Advanced Analytics**
   - Statistical analysis
   - Trend detection
   - Outlier identification

## Contributing Guidelines

When adding new features:

1. **Keep components pure** - No side effects in render
2. **Document props** - Use JSDoc comments
3. **Follow naming conventions** - camelCase for variables, PascalCase for components
4. **Add comments** - Explain "why", not "what"
5. **Test edge cases** - Null values, empty arrays, etc.
6. **Update documentation** - Keep README and this doc in sync

## Questions & Support

For architectural questions or suggestions:
- Review component source code
- Check this documentation
- Open a GitHub issue
- Contact the development team

---

**Remember: Simplicity is key. Don't add complexity until you need it.**
