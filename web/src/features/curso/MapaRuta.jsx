import { useEffect, useState } from 'react';
import { useProgreso } from '../../hooks/ProgresoContext.jsx';

// Etapas del embarque de cada módulo y las lecciones que cubre cada una
const MAPAS = {
  1: {
    carga: { icono: '📦', texto: '500 bombas', titulo: 'Embarque: 500 bombas de engranajes' },
    nodos: [
      { label: 'Shanghái', sub: 'Negociación y compra', icono: '🏭', lecciones: [1, 2] },
      { label: 'Antes de embarcar', sub: 'Clasificación y requisitos', icono: '📑', lecciones: [3, 4] },
      { label: 'Tránsito marítimo', sub: 'Valor en aduana', icono: '🚢', lecciones: [5] },
      { label: 'DIAN', sub: 'Tributos y declaración', icono: '📋', lecciones: [6, 7] },
      { label: 'Cartagena → bodega', sub: 'Levante y retiro', icono: '🏢', lecciones: [8] },
    ],
  },
  2: {
    carga: { icono: '☕', texto: '18 t de café', titulo: 'Embarque: 18.000 kg de café tostado' },
    nodos: [
      { label: 'Café del Caribe', sub: 'Requisitos y beneficios', icono: '🏭', lecciones: [9] },
      { label: 'Origen', sub: 'Acuerdo con la UE', icono: '📜', lecciones: [10] },
      { label: 'Cartagena → Hamburgo', sub: 'Embarque y DEX', icono: '🚢', lecciones: [11] },
    ],
  },
};

export default function MapaRuta({ modulo, actualId, onAbrir }) {
  const { completadas, siguientePendiente, estaDesbloqueada } = useProgreso();
  const { nodos: NODOS, carga } = MAPAS[modulo];
  const delModulo = NODOS.flatMap((n) => n.lecciones);
  const terminado = delModulo.every((id) => completadas.includes(id));
  const indiceNodo = (id) => Math.max(0, NODOS.findIndex((n) => n.lecciones.includes(id)));
  const nodoActual = terminado ? NODOS.length - 1 : indiceNodo(siguientePendiente(modulo));
  const destino = (nodoActual / (NODOS.length - 1)) * 100;

  // Al cargar, el contenedor viaja desde el origen hasta la etapa actual
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
        <div className="mapa-contenedor-animado" title={carga.titulo} style={{ left: `${pct}%` }}>
          <span className="contenedor-icono">{carga.icono}</span><span className="contenedor-label">{carga.texto}</span>
        </div>
      </div>
      <div className="mapa-nodos-grid" style={{ '--nodos': NODOS.length }}>
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
