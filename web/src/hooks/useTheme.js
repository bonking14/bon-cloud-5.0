import { useCallback, useEffect, useState } from 'react';

const CLAVE = 'boncloud-theme';
const leer = () => document.documentElement.classList.contains('light-mode');

// Tema oscuro por defecto; la clase "light-mode" en <html> activa el claro.
// index.html ya la aplica antes de pintar para evitar el parpadeo.
export function useTheme() {
  const [esClaro, setEsClaro] = useState(leer);

  useEffect(() => {
    // Sincroniza varias instancias del hook (landing y sidebar)
    const obs = new MutationObserver(() => setEsClaro(leer()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const alternar = useCallback(() => {
    const claro = document.documentElement.classList.toggle('light-mode');
    try { localStorage.setItem(CLAVE, claro ? 'light' : 'dark'); } catch { /* sin almacenamiento */ }
  }, []);

  return { esClaro, alternar };
}
