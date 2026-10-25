import { useEffect, useState } from 'react';
import { useProgreso } from '../../hooks/ProgresoContext.jsx';

// Etapas del embarque y las lecciones que cubre cada una
const NODOS = [
  { label: 'Shanghái', sub: 'Negociación y compra', icono: '🏭', lecciones: [1, 2] },
  { label: 'Antes de embarcar', sub: 'Clasificación y requisitos', icono: '📑', lecciones: [3, 4] },
  { label: 'Tránsito marítimo', sub: 'Valor en aduana', icono: '🚢', lecciones: [5] },
  { label: 'DIAN', sub: 'Tributos y declaración', icono: '📋', lecciones: [6, 7] },
  { label: 'Cartagena → bodega', sub: 'Levante y retiro', icono: '🏢', lecciones: [8] },
];

export default function MapaRuta({ actualId, onAbrir }) {
  const { completadas, total, siguientePendiente, estaDesbloqueada } = useProgreso();
  const terminado = completadas.length === total;
  const indiceNodo = (id) => Math.max(0, NODOS.findIndex((n) => n.lecciones.includes(id)));
  const nodoActual = terminado ? NODOS.length - 1 : indiceNodo(siguientePendiente());
  const destino = (nodoActual / (NODOS.length - 1)) * 100;

  // Al cargar, el contenedor viaja desde Shanghái hasta la etapa actual
  const [pct, setPct] = useState(() => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? destino : 0));
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPct(destino)));
    return () => cancelAnimationFrame(id);
  }, [destino]);

  return (
    <div>
      <div className="mapa-ruta-track" aria-hidden="true">
        <div className="mapa-ruta-linea-bg" />
        <div className="mapa-ruta-linea-fill" style={{ width: `${pct}%` }} />
        <div className="mapa-contenedor-animado" title="Embarque: 500 bombas de engranajes" style={{ left: `${pct}%` }}>
          <span className="contenedor-icono">📦</span><span className="contenedor-label">500 bombas</span>
        </div>
      </div>
      <div className="mapa-nodos-grid">
        {NODOS.map((n) => {
          const completado = n.lecciones.every((l) => completadas.includes(l));
          const primera = Math.min(...n.lecciones);
          const alcanzado = estaDesbloqueada(primera);
          const clases = ['mapa-nodo',
            completado && 'nodo-completado',
            !completado && alcanzado && 'nodo-activo',
            !alcanzado && 'nodo-pendiente',
            n.lecciones.includes(actualId) && 'nodo-seleccionado'].filter(Boolean).join(' ');
          const estado = completado ? 'completada' : alcanzado ? 'disponible' : 'bloqueada';
          return (
            <button type="button" key={n.label} className={clases} aria-disabled={!alcanzado}
              aria-label={`${n.label}: ${n.sub}. Etapa ${estado}.`} onClick={() => onAbrir(primera)}>
              <span className="nodo-icono-wrapper" aria-hidden="true">
                <span className="nodo-icono">{n.icono}</span>
                <span className="nodo-check">✓</span>
              </span>
              <span className="nodo-info">
                <span className="nodo-titulo">{n.label}</span>
                <span className="nodo-sub">{n.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
