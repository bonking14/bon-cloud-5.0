import { useEffect, useMemo, useState } from 'react';
import Buscador from '../../components/Buscador.jsx';
import { indexar, buscarEnArancel } from '../../lib/arancelCompleto.js';
import { capitulos as rangoCapitulos, SECCIONES_ARANCEL } from '../../lib/arancel.js';
import css from './ArancelCompleto.module.css';

// Arancel de Aduanas completo: las 21 secciones con sus capítulos, partidas y subpartidas.
// El archivo pesa cerca de 800 kB, así que se descarga solo al abrir esta vista.
const gravamen = (g) => (g === null || g === undefined ? '—' : `${g.toLocaleString('es-CO')}%`);

export default function ArancelCompleto({ fichas, onVerFicha }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  useEffect(() => {
    let vivo = true;
    import('../../data/arancel.json').then((m) => { if (vivo) setDatos(m.default); }).catch(() => vivo && setError(true));
    return () => { vivo = false; };
  }, []);
  const filas = useMemo(() => (datos ? indexar(datos) : []), [datos]);
  const { total, resultados } = useMemo(() => buscarEnArancel(filas, busqueda), [filas, busqueda]);

  if (error) return <p className="sin-resultados">No se pudo cargar el arancel. Revisa la conexión y vuelve a abrir la página.</p>;
  if (!datos) return <p className={css.cargando} role="status">Cargando el Arancel de Aduanas…</p>;

  return (
    <>
      <p className="buscador-hint">
        {filas.length.toLocaleString('es-CO')} subpartidas de 10 dígitos del <strong>Arancel de Aduanas</strong> (Decreto 1881 de 2021,
        con sus modificaciones, según la compilación jurídica de la DIAN consultada en noviembre de 2026). La columna Grv. es el gravamen
        arancelario. Las confecciones de los capítulos 61 y 62 ya tienen el 40% del Decreto 2598 de 2022. Algunos productos tienen
        además una tarifa diferida por otro decreto (por ejemplo, el 0% del Decreto 272 de 2018 para ciertos bienes de capital), que se
        indica en las fichas de práctica. El IVA no hace parte del arancel. Antes de una operación real, confírmalo en la norma vigente.
      </p>
      <div className="buscador-section">
        <Buscador valor={busqueda} onChange={setBusqueda} placeholder="Busca en todo el arancel por código o palabras… Ej: 0901, café tostado, bombas" />
      </div>

      {busqueda.trim() ? (
        <div className={css.resultados}>
          <p className="stats-bar"><span>{total === 0 ? 'Sin resultados' : `${total.toLocaleString('es-CO')} subpartida${total === 1 ? '' : 's'}${total > resultados.length ? `; se muestran las primeras ${resultados.length}, escribe más para precisar` : ''}`}</span></p>
          <ul className={css.lista}>
            {resultados.map((f) => (
              <li key={f.codigo} className={css.resultado}>
                <span className={css.codigo}>{f.codigo}</span>
                <span className={css.texto}>
                  <span className={css.ruta}>Sección {f.seccion} · Partida {f.partida?.codigo}: {f.partida?.desc}{f.ruta.length ? ` › ${f.ruta.join(' › ')}` : ''}</span>
                  {f.nota && <span className={css.nota}>{f.nota}</span>}
                  <strong>{f.desc}</strong>
                  {fichas.has(f.codigo) && <button type="button" className={css.ficha} onClick={() => onVerFicha(f.codigo)}>Ver ficha con IVA y vistos buenos</button>}
                </span>
                <span className={css.grv} title="Gravamen arancelario">{gravamen(f.grv)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={css.arbol}>
          {datos.secciones.map((sec) => (
            <details key={sec.n} className={css.seccion}>
              <summary>
                <span className={css.num}>Sección {sec.n}</span> {sec.t}
                <small> ({rangoCapitulos(SECCIONES_ARANCEL.find((s) => s.numero === sec.n))})</small>
              </summary>
              {sec.capitulos.map((cap) => <Capitulo key={cap.n} cap={cap} fichas={fichas} onVerFicha={onVerFicha} />)}
            </details>
          ))}
        </div>
      )}
    </>
  );
}

// Un capítulo dibuja su tabla solo cuando se abre: el arancel completo tiene más de 11.000 renglones
function Capitulo({ cap, fichas, onVerFicha }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <details className={css.capitulo} onToggle={(e) => setAbierto(e.currentTarget.open)}>
      <summary><span className={css.numCap}>Capítulo {cap.n}</span> {cap.t}</summary>
      {abierto && cap.nota && <p className={css.nota}>{cap.nota}</p>}
      {abierto && (
        <div className={css.scroll}>
          <table className={css.tabla}>
            <thead><tr><th scope="col">Código</th><th scope="col">Designación de la mercancía</th><th scope="col">Grv. (%)</th></tr></thead>
            <tbody>
              {cap.items.map(([codigo, nivel, desc, grv], i) => (
                <tr key={`${codigo}-${i}`} className={nivel === 0 ? css.partida : undefined}>
                  <td className={css.codigo}>{codigo}</td>
                  <td style={{ paddingLeft: 8 + nivel * 14 }}>
                    {nivel > 0 && <span className={css.guiones}>{'- '.repeat(nivel)}</span>}{desc}
                    {fichas.has(codigo) && <> <button type="button" className={css.ficha} onClick={() => onVerFicha(codigo)}>Ver ficha</button></>}
                  </td>
                  <td className={css.grv}>{codigo.length === 13 ? gravamen(grv) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
}
