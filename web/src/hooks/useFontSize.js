import { useCallback, useState } from 'react';

const CLAVE = 'boncloud-fontsize';
export const TAMANOS = [
  { etiqueta: 'A-', valor: '14px', nombre: 'Letra pequeña' },
  { etiqueta: 'A', valor: '16px', nombre: 'Letra normal' },
  { etiqueta: 'A+', valor: '18px', nombre: 'Letra grande' },
];

export function useFontSize() {
  const [actual, setActual] = useState(() => document.documentElement.style.fontSize || '16px');

  const cambiar = useCallback((valor) => {
    document.documentElement.style.fontSize = valor;
    try { localStorage.setItem(CLAVE, valor); } catch { /* sin almacenamiento */ }
    setActual(valor);
  }, []);

  return { actual, cambiar };
}
