import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { pedir } from '../auth/api.js';
import { lecciones } from '../data/lecciones.js';
import { claveProgreso, guardarProgreso, leerProgreso, migrarProgresoCompartido } from '../lib/progresoLocal.js';

const porId = new Map(lecciones.map((l) => [l.id, l]));
// La primera lección de cada módulo está siempre disponible; las demás se
// desbloquean al aprobar la anterior del mismo módulo.
const anteriorEnModulo = (id) => {
  const l = porId.get(id);
  const previas = lecciones.filter((x) => x.modulo === l?.modulo && x.orden < l.orden);
  return previas.length ? previas[previas.length - 1].id : null;
};

const TOTAL = lecciones.length;
const valida = (n) => Number.isInteger(n) && n >= 1 && n <= TOTAL;

const ProgresoContext = createContext(null);

// localStorage responde al instante; si hay sesión real, el progreso también se
// sincroniza con /api/progreso para que siga al usuario entre dispositivos.
export function ProgresoProvider({ children }) {
  const { tokenApi, usuario } = useAuth();
  // Cada persona (o el invitado) tiene su propio progreso en el navegador
  const clave = claveProgreso(usuario);
  const [estado, setEstado] = useState(() => {
    migrarProgresoCompartido(clave);
    return { clave, completadas: leerProgreso(clave, valida) };
  });
  // Al cambiar de usuario se carga su progreso en el mismo render, sin mostrar el del anterior
  if (estado.clave !== clave) {
    migrarProgresoCompartido(clave);
    setEstado({ clave, completadas: leerProgreso(clave, valida) });
  }
  const completadas = estado.clave === clave ? estado.completadas : leerProgreso(clave, valida);
  const setCompletadas = useCallback((cambio) => {
    setEstado((e) => ({ ...e, completadas: typeof cambio === 'function' ? cambio(e.completadas) : cambio }));
  }, []);

  useEffect(() => {
    if (!tokenApi) return;
    let vigente = true;
    pedir('/progreso', { token: tokenApi })
      .then((data) => {
        if (!vigente) return;
        const remotas = (data.progreso?.leccionesCompletadas || []).filter(valida);
        setCompletadas((locales) => {
          const union = [...new Set([...locales, ...remotas])].sort((a, b) => a - b);
          guardarProgreso(clave, union);
          if (union.length > remotas.length) {
            pedir('/progreso', { metodo: 'POST', token: tokenApi, cuerpo: { progreso: { leccionesCompletadas: union } } }).catch(() => {});
          }
          return union;
        });
      })
      .catch(() => { /* sin conexión: se queda con lo local */ });
    return () => { vigente = false; };
  }, [tokenApi, clave, setCompletadas]);

  const persistir = useCallback((nuevas) => {
    setCompletadas(nuevas);
    const ok = guardarProgreso(clave, nuevas);
    if (tokenApi) {
      pedir('/progreso', { metodo: 'POST', token: tokenApi, cuerpo: { progreso: { leccionesCompletadas: nuevas } } }).catch(() => {});
    }
    return ok;
  }, [tokenApi, clave, setCompletadas]);

  const valor = useMemo(() => ({
    completadas,
    total: TOTAL,
    estaCompletada: (id) => completadas.includes(id),
    estaDesbloqueada: (id) => {
      const anterior = anteriorEnModulo(id);
      return anterior === null || completadas.includes(anterior);
    },
    // Primera lección sin aprobar (de un módulo, si se indica); si no hay, la última
    siguientePendiente: (modulo) => {
      const lista = modulo ? lecciones.filter((l) => l.modulo === modulo) : lecciones;
      return (lista.find((l) => !completadas.includes(l.id)) || lista[lista.length - 1]).id;
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
