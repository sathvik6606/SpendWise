
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Configure axios base URL globally — falls back to local dev if env var not set
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
