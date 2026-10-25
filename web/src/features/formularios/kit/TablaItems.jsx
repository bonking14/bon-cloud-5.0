import { useState } from 'react';
import { subpartidas } from '../../../data/subpartidas.js';
import { useCampos } from './contexto.js';

export const itemVacio = () => ({ subpartida: '', descripcion: '', cantidad: '', unidad: '', pesoNeto: '', fobUnitario: '' });

function buscarSubpartidas(texto) {
  const q = texto.toLowerCase().replace(/[.\s]/g, '');
  if (q.length < 2) return [];
  return subpartidas.filter((s) => s.codigo.replace(/[.\s]/g, '').includes(q) || s.titulo.toLowerCase().includes(q)).slice(0, 8);
}

// Tabla de mercancías de los formularios 500 y 600, con autocompletado de
// subpartidas desde el catálogo de la app (src/data/subpartidas.js).
//   columnas: títulos de las 7 columnas después de "Ítem"
//   lineas: total FOB por fila (calculado afuera)
//   onSubpartida(sp, indice): se llama al elegir una sugerencia
export function TablaItems({ columnas, lineas, placeholderSubpartida, onSubpartida }) {
  const { valores, ponerVarios } = useCampos();
  const items = valores.items;
  const [abierta, setAbierta] = useState(null); // índice de la fila con sugerencias
  const [resaltada, setResaltada] = useState(0);

  const cambiar = (i, campo, valor) => {
    const nuevos = items.map((it, j) => (j === i ? { ...it, [campo]: valor } : it));
    ponerVarios({ items: nuevos });
  };

  const elegir = (i, sp) => {
    const nuevos = items.map((it, j) => (j === i ? { ...it, subpartida: sp.codigo, descripcion: sp.titulo } : it));
    ponerVarios({ items: nuevos, ...(onSubpartida?.(sp, nuevos) || {}) });
    setAbierta(null);
  };

  const sugerencias = abierta === null ? [] : buscarSubpartidas(items[abierta].subpartida);

  const teclas = (i, e) => {
    if (!sugerencias.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setResaltada((r) => (r + 1) % sugerencias.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setResaltada((r) => (r - 1 + sugerencias.length) % sugerencias.length); }
    else if (e.key === 'Enter') { e.preventDefault(); elegir(i, sugerencias[resaltada]); }
    else if (e.key === 'Escape') setAbierta(null);
  };

  return (
    <table className="tabla-items">
      <thead>
        <tr>
          <th style={{ width: 22 }}>Ítem</th>
          {columnas.map(([titulo, ancho]) => <th key={titulo} style={ancho ? { width: ancho } : undefined}>{titulo}</th>)}
        </tr>
      </thead>
      <tbody>
        {items.map((it, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <input className="centro" value={it.subpartida} placeholder={placeholderSubpartida} aria-label={`Subpartida del ítem ${i + 1}`}
                role="combobox" aria-expanded={abierta === i && sugerencias.length > 0} aria-autocomplete="list"
                onChange={(e) => { cambiar(i, 'subpartida', e.target.value); setAbierta(i); setResaltada(0); }}
                onKeyDown={(e) => teclas(i, e)}
                onBlur={() => setTimeout(() => setAbierta((a) => (a === i ? null : a)), 150)} />
              {abierta === i && sugerencias.length > 0 && (
                <div className="sp-sugerencias" role="listbox">
                  {sugerencias.map((s, k) => (
                    <button type="button" key={s.codigo} role="option" aria-selected={k === resaltada}
                      onMouseDown={(e) => { e.preventDefault(); elegir(i, s); }}>
                      <strong>{s.codigo}</strong>
                      <span>{s.titulo} | Arancel: {s.arancel}% | IVA: {s.iva}%</span>
                    </button>
                  ))}
                </div>
              )}
            </td>
            <td><input value={it.descripcion} placeholder="Descripción" aria-label={`Descripción del ítem ${i + 1}`} onChange={(e) => cambiar(i, 'descripcion', e.target.value)} /></td>
            <td><input className="num" type="number" value={it.cantidad} placeholder="0" aria-label={`Cantidad del ítem ${i + 1}`} onChange={(e) => cambiar(i, 'cantidad', e.target.value)} /></td>
            <td><input className="centro" value={it.unidad} placeholder="KG" aria-label={`Unidad del ítem ${i + 1}`} onChange={(e) => cambiar(i, 'unidad', e.target.value)} /></td>
            <td><input className="num" type="number" step="0.01" value={it.pesoNeto} aria-label={`Peso neto del ítem ${i + 1}`} onChange={(e) => cambiar(i, 'pesoNeto', e.target.value)} /></td>
            <td><input className="num" type="number" step="0.01" value={it.fobUnitario} placeholder="0" aria-label={`FOB unitario del ítem ${i + 1}`} onChange={(e) => cambiar(i, 'fobUnitario', e.target.value)} /></td>
            <td><input className="num" readOnly tabIndex={-1} value={lineas[i] ? lineas[i].toFixed(2) : ''} aria-label={`FOB total del ítem ${i + 1}`} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
