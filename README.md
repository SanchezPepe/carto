# TerraVista - Visualización Geoespacial de México

Una aplicación moderna de visualización de datos geoespaciales construida con React, react-map-gl, deck.gl, Tailwind CSS y Flowbite.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react) ![deck.gl](https://img.shields.io/badge/deck.gl-9.0-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss) ![MapLibre](https://img.shields.io/badge/MapLibre-5.0-green)

## Características

- **5 Tipos de Mapas**: Coroplético, Marcadores, Mapa de Calor, Hexágonos 3D, y Arcos
- **32 Estados de México**: Datos demográficos, económicos y sociales
- **50+ Ciudades Principales**: Con coordenadas y metadatos
- **6 Datasets**: Población, PIB, Densidad, Desempleo, IDH, Turismo
- **Modo Oscuro**: Interfaz adaptable con tema claro/oscuro
- **Visualizaciones WebGL**: Renderizado de alto rendimiento con deck.gl

## Tipos de Visualización

| Tipo | Descripción | Uso Ideal |
|------|-------------|-----------|
| 🗺️ **Coroplético** | Regiones coloreadas por valor | Comparar datos entre estados |
| 📍 **Marcadores** | Puntos de ciudades con iconos | Ubicar ciudades y puntos de interés |
| 🔥 **Mapa de Calor** | Densidad de datos | Visualizar concentración poblacional |
| ⬡ **Hexágonos 3D** | Agregación hexagonal elevada | Patrones de distribución |
| 🌐 **Arcos** | Conexiones entre ciudades | Rutas comerciales, migración |

## Estructura del Proyecto

```
src/
├── components/
│   ├── maps/
│   │   ├── BaseMap.jsx        # Mapa base con MapLibre
│   │   ├── ChoroplethMap.jsx  # Mapa coroplético
│   │   ├── MarkersMap.jsx     # Mapa de marcadores
│   │   ├── HeatmapMap.jsx     # Mapa de calor
│   │   ├── HexagonMap.jsx     # Hexágonos 3D
│   │   ├── ArcMap.jsx         # Arcos de conexión
│   │   └── index.js           # Exportaciones
│   ├── NavigationSidebar.jsx  # Barra lateral
│   └── DataPanel.jsx          # Panel de estadísticas
├── data/
│   ├── mexico-states.geo.json # GeoJSON de estados
│   ├── mexico-cities.js       # Datos de ciudades
│   └── mexico-datasets.js     # Datasets mexicanos
├── utils/
│   ├── colorScale.js          # Escalas de color
│   ├── mapHelpers.js          # Utilidades de mapa
│   └── darkMode.js            # Toggle de tema
├── styles/
│   └── index.css              # Estilos globales
├── App.jsx                    # Componente principal
└── main.jsx                   # Punto de entrada
```

## Instalación

### Prerrequisitos

- Node.js 18+ y npm

### Configuración

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd carto
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

4. Abrir en navegador: `http://localhost:5173`

### Build para producción:
```bash
npm run build
npm run preview
```

## Agregar Nuevos Datos

### Agregar un Dataset

Edita `src/data/mexico-datasets.js`:

```javascript
export const myNewDataset = {
  id: 'mi-metrica',
  name: 'Mi Métrica',
  description: 'Descripción de los datos',
  colorScale: COLOR_SCALES.blue,
  unit: 'number', // 'number' | 'percent' | 'currency'
  data: {
    'AGU': 12345,
    'BCN': 67890,
    // ... todos los estados
  }
};

// Agregar al array MEXICO_DATASETS
export const MEXICO_DATASETS = [
  ...existingDatasets,
  myNewDataset
];
```

### Agregar Ciudades

Edita `src/data/mexico-cities.js`:

```javascript
export const MEXICO_CITIES = [
  ...existingCities,
  {
    id: 'nueva-ciudad',
    name: 'Nueva Ciudad',
    state: 'JAL',
    lat: 20.1234,
    lng: -103.5678,
    population: 100000,
    type: 'medium' // capital | major | large | medium | tourist | industrial
  }
];
```

## API de Componentes

### ChoroplethMap

```jsx
<ChoroplethMap
  geojson={Object}        // GeoJSON FeatureCollection
  data={Object}           // { regionId: value }
  colorScale={Array}      // Colores hex
  onRegionClick={Function}
  selectedRegion={String}
  dataUnit={String}       // 'number' | 'percent' | 'currency'
  isDarkMode={Boolean}
/>
```

### MarkersMap

```jsx
<MarkersMap
  cities={Array}          // Array de ciudades
  onCityClick={Function}
  selectedCity={String}
  showLabels={Boolean}
  isDarkMode={Boolean}
/>
```

### HeatmapMap

```jsx
<HeatmapMap
  data={Array}            // [{ lng, lat, weight }]
  radiusPixels={Number}
  intensity={Number}
  threshold={Number}
  isDarkMode={Boolean}
/>
```

### HexagonMap

```jsx
<HexagonMap
  data={Array}            // [{ lng, lat, weight }]
  radius={Number}         // Radio en metros
  elevationScale={Number}
  extruded={Boolean}
  coverage={Number}       // 0-1
  isDarkMode={Boolean}
/>
```

### ArcMap

```jsx
<ArcMap
  arcs={Array}            // [{ source, target, value }]
  nodes={Array}           // [{ id, name, lng, lat }]
  showNodes={Boolean}
  isDarkMode={Boolean}
/>
```

## Tecnologías

- **React 18.3**: Framework UI
- **Vite 5.4**: Build tool
- **react-map-gl 8.1**: Wrapper de MapLibre GL
- **deck.gl 9.0**: Visualizaciones WebGL de alto rendimiento
- **MapLibre GL 5.0**: Renderizado de mapas
- **Tailwind CSS 3.4**: Framework CSS
- **Flowbite React**: Componentes UI
- **React Icons**: Iconos

## Datasets Incluidos

| Dataset | Descripción | Unidad |
|---------|-------------|--------|
| Población | Población total por estado (2024) | Número |
| PIB per Cápita | Producto Interno Bruto per cápita | MXN |
| Densidad | Habitantes por km² | Número |
| Desempleo | Tasa de desempleo Q4 2024 | Porcentaje |
| IDH | Índice de Desarrollo Humano | Índice |
| Turismo | Visitantes anuales en millones | Número |

## Ciudades por Tipo

- **Capital**: Ciudad de México
- **Áreas Metropolitanas**: Guadalajara, Monterrey, Puebla, Tijuana, León, etc.
- **Ciudades Grandes**: Mérida, Aguascalientes, Hermosillo, etc.
- **Destinos Turísticos**: Cancún, Los Cabos, Puerto Vallarta, Playa del Carmen
- **Centros Industriales**: Celaya, Irapuato, Tampico, Monclova

## Personalización

### Cambiar Colores

Edita `src/utils/colorScale.js`:

```javascript
export const COLOR_SCALES = {
  custom: ['#color1', '#color2', '#color3', ...]
};
```

### Cambiar Estilo del Mapa

Los mapas usan estilos de CARTO. Puedes cambiarlos en cada componente:

- **Claro**: `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`
- **Oscuro**: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`
- **Calles**: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`

## Roadmap

- [ ] Datos en tiempo real via API
- [ ] Exportar mapas como imagen
- [ ] Filtros y búsqueda
- [ ] Animaciones temporales
- [ ] Mapas mundiales
- [ ] Más tipos de visualización

## Licencia

MIT

---

**TerraVista** - Visualización geoespacial moderna para México 🇲🇽
