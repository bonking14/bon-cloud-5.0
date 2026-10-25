import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
// Mismo orden que el sitio original: theme.css sobrescribe a styles.css
import './styles/styles.css';
import './styles/theme.css';
import './styles/curso.css';
import './styles/formularios.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
