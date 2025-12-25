import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { initTheme } from './utils/darkMode'

initTheme()

/**
 * Application Entry Point
 *
 * Renders the React application into the DOM.
 * This is where the entire app bootstraps.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
