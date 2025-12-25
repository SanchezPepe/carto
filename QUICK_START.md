# Quick Start Guide - GeoAnalytics Dashboard

## 🚀 Start Developing in 30 Seconds

```bash
npm run dev
```

Open http://localhost:3000

That's it!

---

## 📋 Essential Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Package Management
npm install          # Install dependencies
npm audit fix        # Fix security vulnerabilities
```

---

## 📂 Key Files to Edit

```bash
src/data/datasets.js              # ADD YOUR DATASETS HERE
src/data/us-states.geo.json       # REPLACE WITH YOUR GEOJSON
src/utils/colorScale.js           # Add custom color scales
src/components/MapContainer.jsx   # Extend map functionality
```

---

## ⚡ 2-Minute Tutorial: Add Your Own Data

### Step 1: Edit `src/data/datasets.js`

```javascript
// Add this at the bottom of the file

export const myDataset = {
  id: 'my-metric',
  name: 'My Custom Metric',
  description: 'My data description',
  colorScale: COLOR_SCALES.blue,  // Choose: blue, green, orange, purple, red
  unit: 'number',                 // Options: 'number', 'percent', 'currency'
  data: {
    'CA': 1000,   // Region ID must match GeoJSON
    'TX': 2000,
    'NY': 1500,
    // ... add more regions
  }
};

// Add to DATASETS array
export const DATASETS = [
  populationDataset,
  gdpDataset,
  unemploymentDataset,
  myDataset  // ← YOUR DATASET
];
```

### Step 2: Refresh Browser

Done! Your dataset appears in the sidebar automatically.

---

## 🗺️ Change Geographic Region

### Option 1: Use Different US GeoJSON

Replace `src/data/us-states.geo.json` with a different file:

```bash
# Download counties instead of states
curl -o src/data/us-counties.geo.json \
  https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json
```

### Option 2: Use World Map

```bash
# Download world countries
curl -o src/data/world.geo.json \
  https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson
```

Then update your datasets to use country codes:

```javascript
data: {
  'USA': 331000000,
  'CHN': 1400000000,
  'IND': 1380000000,
  // ...
}
```

---

## 🎨 Customize Colors

Edit `src/utils/colorScale.js`:

```javascript
export const COLOR_SCALES = {
  // Add your custom scale
  myCustomScale: [
    '#e0f2fe',  // lightest
    '#7dd3fc',
    '#0ea5e9',
    '#0369a1',
    '#0c4a6e',  // darkest
  ]
};
```

Use in dataset:

```javascript
colorScale: COLOR_SCALES.myCustomScale
```

---

## 🔧 Common Customizations

### Change Map Base Layer

Edit `src/components/MapContainer.jsx` (line ~67):

```javascript
// Dark theme
window.L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '...' }
).addTo(map);

// Satellite
window.L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: '...' }
).addTo(map);
```

### Change Sidebar Width

Edit `src/App.jsx` (line ~67):

```javascript
// Change from w-80 to w-64 (smaller) or w-96 (larger)
<div className="w-64 flex-shrink-0">
  <NavigationSidebar />
</div>
```

### Update Branding

Edit `src/components/NavigationSidebar.jsx` (line ~42):

```javascript
<h1 className="text-2xl font-bold text-gray-900">
  Your Brand Name
</h1>
```

---

## 📦 Deploy to Production

### Option 1: Netlify (Easiest)

```bash
npm run build
# Drag dist/ folder to netlify.com
```

### Option 2: Vercel

```bash
npm install -g vercel
npm run build
vercel --prod
```

### Option 3: GitHub Pages

```bash
npm run build
# Copy dist/ contents to docs/ folder
git add docs/
git commit -m "Deploy"
git push
# Enable GitHub Pages in repo settings
```

### Option 4: Docker

```bash
docker build -t geospatial-dashboard .
docker run -p 8080:80 geospatial-dashboard
```

---

## 🐛 Troubleshooting

### Map not showing?

1. Open browser console (F12)
2. Check for errors
3. Common fixes:
   - Clear cache and hard reload (Ctrl+Shift+R)
   - Run `npm install` again
   - Delete `node_modules` and reinstall

### Data not matching regions?

1. Check that dataset keys match GeoJSON IDs:

```javascript
// In datasets.js
data: { 'CA': 1000 }  // ← This 'CA'

// Must match in GeoJSON
properties: { id: 'CA' }  // ← This 'CA'
```

2. If GeoJSON uses different property:

```javascript
// In App.jsx
<MapContainer idProperty="state_code" />  // Change from 'id'
```

### Build errors?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Architecture Guide**: See `ARCHITECTURE.md`
- **Code Examples**: See `EXAMPLES.md`
- **Component Docs**: Read inline JSDoc comments

---

## 🆘 Quick Help

### I want to...

**...add a new dataset**
→ Edit `src/data/datasets.js`, add object to DATASETS array

**...use different map boundaries**
→ Replace `src/data/us-states.geo.json`

**...change colors**
→ Edit `src/utils/colorScale.js`

**...load data from API**
→ See `EXAMPLES.md` Example 2

**...add more visualizations**
→ See `EXAMPLES.md` Example 5 (Charts)

**...export map as image**
→ See `EXAMPLES.md` Example 7

**...show historical data**
→ See `EXAMPLES.md` Example 8 (Time Series)

---

## ✅ Checklist for First Run

- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Click different datasets in sidebar
- [ ] Click regions on map
- [ ] Read `EXAMPLES.md` for ideas

---

## 🎯 Next Steps

1. **Replace sample data** with your own
2. **Customize colors** to match your brand
3. **Add more datasets** as needed
4. **Deploy** to production
5. **Share** with your team

---

**Need help? All components have detailed inline comments. Read the code!**
