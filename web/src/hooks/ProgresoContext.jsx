import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { pedir } from '../auth/api.js';
import { lecciones } from '../data/lecciones.js';

// v2: el orden de las lecciones cambió (vistos buenos pasó a la lección 4),
// así que el progreso anterior no es compatible.
const CLAVE = 'boncloud_progreso_curso_v2';
const TOTAL = lecciones.length;
const valida = (n) => Number.isInteger(n) && n >= 1 && n <= TOTAL;

function leerLocal() {
  try {
    const data = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(data?.leccionesCompletadas) ? data.leccionesCompletadas.filter(valida) : [];
  } catch {
    return [];
  }
}

function guardarLocal(completadas) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ leccionesCompletadas: completadas }));
    return true;
  } catch {
    return false;
  }
}

const ProgresoContext = createContext(null);

// localStorage responde al instante; si hay sesión real, el progreso también se
// sincroniza con /api/progreso para que siga al usuario entre dispositivos.
export function ProgresoProvider({ children }) {
  const { tokenApi } = useAuth();
  const [completadas, setCompletadas] = useState(leerLocal);

  useEffect(() => {
    if (!tokenApi) return;
    let vigente = true;
    pedir('/progreso', { token: tokenApi })
      .then((data) => {
        if (!vigente) return;
        const remotas = (data.progreso?.leccionesCompletadas || []).filter(valida);
        setCompletadas((locales) => {
          const union = [...new Set([...locales, ...remotas])].sort((a, b) => a - b);
          guardarLocal(union);
          if (union.length > remotas.length) {
            pedir('/progreso', { metodo: 'POST', token: tokenApi, cuerpo: { progreso: { leccionesCompletadas: union } } }).catch(() => {});
          }
          return union;
        });
      })
      .catch(() => { /* sin conexión: se queda con lo local */ });
    return () => { vigente = false; };
  }, [tokenApi]);

  const persistir = useCallback((nuevas) => {
    setCompletadas(nuevas);
    const ok = guardarLocal(nuevas);
    if (tokenApi) {
      pedir('/progreso', { metodo: 'POST', token: tokenApi, cuerpo: { progreso: { leccionesCompletadas: nuevas } } }).catch(() => {});
    }
    return ok;
  }, [tokenApi]);

  const valor = useMemo(() => ({
    completadas,
    total: TOTAL,
    estaCompletada: (id) => completadas.includes(id),
    estaDesbloqueada: (id) => id === 1 || completadas.includes(id - 1),
    siguientePendiente: () => {
      for (let i = 1; i <= TOTAL; i++) if (!completadas.includes(i)) return i;
      return TOTAL;
    },
    completar: (id) => (completadas.includes(id) ? true : persistir([...completadas, id].sort((a, b) => a - b))),
    reiniciar: () => persistir([]),
  }), [completadas, persistir]);

  return <ProgresoContext.Provider value={valor}>{children}</ProgresoContext.Provider>;
}

export function useProgreso() {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error('useProgreso debe usarse dentro de <ProgresoProvider>');
  return ctx;
}
