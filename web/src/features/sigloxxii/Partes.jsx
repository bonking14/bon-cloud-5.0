import { DOCUMENTOS_SOPORTE, ESTADOS_SOPORTE, TASA_SEMANA, numero, totalPagado, totalesGenerales } from '../../lib/sigloxxii.js';
import css from './SigloXXII.module.css';

// Pantallas de la declaración después del ítem, según el manual del declarante de SIGLO XXI:
// descripción de la mercancía (casilla 43), totales (67 a 76), documentos soporte e informar.
const pesos = (n) => Math.round(n || 0).toLocaleString('es-CO');

function Cabecera({ titulo, subpartida, radicacion }) {
  return (
    <div className={css.cabecera}>
      <h2>{titulo}</h2>
      <span className={css.chip}>Inicial · Subpartida {subpartida || '—'} · Radicación {radicacion}</span>
    </div>
  );
}

function Error({ malos, campo }) {
  const e = malos?.get(campo);
  return e ? <small className={css.errorCampo}>{e}</small> : null;
}

export function Descripcion({ texto, poner, malos, onSalvar, subpartida, radicacion }) {
  const error = malos?.get('descripcion');
  return (
    <div className={css.tarjeta}>
      <Cabecera titulo="Descripción mercancías (incluye marcas, seriales y otros)" subpartida={subpartida} radicacion={radicacion} />
      <p className={css.suave}>
        Casilla 43 del ítem 1. Describe en términos claros las características, tipo, referencia, composición, clase y calidad, de forma que
        la mercancía se pueda identificar e individualizar y se facilite su clasificación. Si se acoge a un acuerdo o a una preferencia, anota
        la norma, el número y la fecha.
      </p>
      <div className={`${css.campo}${error ? ` ${css.mal}` : ''}`}>
        <label htmlFor="sx-descripcion">Descripción de la mercancía</label>
        <textarea id="sx-descripcion" className={css.area} rows={6} value={texto} aria-invalid={Boolean(error)} onChange={(e) => poner(e.target.value)}
          placeholder="Qué es, tipo, uso, marca, referencia, seriales, cantidad…" />
        <small className={css.suave}>{texto.length} caracteres. Si no cabe, el sistema genera hojas adicionales numeradas.</small>
      </div>
      <p className={css.nota}>
        Ojo: la mercancía que no quede completamente descrita no queda amparada por la declaración, y esa omisión no se arregla con una
        declaración de corrección: hay que presentar una de legalización.
      </p>
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Guardar</button></div>
    </div>
  );
}

export function Totales({ t, poner, malos, liq, onSalvar, onBuscar, radicacion }) {
  const g = totalesGenerales(liq);
  const general = g.arancel + g.iva + g.sanciones + g.otros;
  const input = (campo, rotulo) => (
    <>
      <input id={`sx-${campo}`} type="text" inputMode="numeric" autoComplete="off" aria-label={rotulo} aria-invalid={Boolean(malos?.get(campo))}
        value={t[campo] ?? ''} onChange={(e) => poner(campo, e.target.value)} />
      <Error malos={malos} campo={campo} />
    </>
  );
  const filas = [
    ['69', 'Total arancel', g.arancel, 'pagado_arancel'],
    ['70', 'Total IVA', g.iva, 'pagado_iva'],
    ['71', 'Sanciones', null, 'sanciones'],
    ['72', 'Total otros', g.otros, 'pagado_otros'],
  ];
  const pagado = totalPagado(t);
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>Totales declaración de importación</h2>
        <span className={css.chip}>1. Tipo: Inicial · 24. TRM {TASA_SEMANA.toLocaleString('es-CO')} · Radicación {radicacion}</span>
      </div>
      <p className={css.suave}>67. Pagos anteriores: 0 (solo se traen en correcciones, modificaciones o legalizaciones).</p>
      <div className={css.scroll}>
        <table className={`${css.liq} ${css.totales}`}>
          <thead><tr><th scope="col">68. Concepto</th><th scope="col">Total general $</th><th scope="col">Total pagado con esta declaración $</th></tr></thead>
          <tbody>
            {filas.map(([n, concepto, valor, campo]) => (
              <tr key={n}>
                <td>{n}. {concepto}</td>
                <td>{valor === null ? input(campo, `${n}. ${concepto}`) : pesos(valor)}</td>
                <td>{campo === 'sanciones' ? pesos(numero(t.sanciones) || 0) : input(campo, `${n}. ${concepto} pagado`)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td>73. Total</td><td>{pesos(general + (numero(t.sanciones) || 0))}</td><td data-testid="sx-total-pagado">{pesos(pagado)}</td></tr></tfoot>
        </table>
      </div>
      <fieldset className={css.seccion}>
        <legend>Forma de pago</legend>
        <div className={css.rejilla}>
          <div className={css.campo}><label htmlFor="sx-efectivo">74. Efectivo</label>{input('efectivo', '74. Efectivo')}</div>
          <div className={css.campo}><label htmlFor="sx-cheque_valor">75. Cheque: valor</label>{input('cheque_valor', '75. Cheque: valor')}</div>
          <div className={css.campo}><label htmlFor="sx-cheque_numero">75. Número del cheque</label>{input('cheque_numero', '75. Número del cheque')}</div>
          <div className={css.campo}>
            <span className={css.rotulo}>
              <label htmlFor="sx-cheque_banco">75. Código del banco</label>
              <button type="button" className={css.buscar} onClick={() => onBuscar('bancos', 'cheque_banco', poner)} aria-label="Buscar código: 75. Código del banco">Buscar código</button>
            </span>
            {input('cheque_banco', '75. Código del banco')}
          </div>
          <div className={css.campo} style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="sx-recibo">76. Recibo oficial de pago anterior</label>
            <input id="sx-recibo" readOnly value="No se llena: el recibo de pago es posterior a la declaración" />
          </div>
        </div>
      </fieldset>
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Guardar</button></div>
    </div>
  );
}

export function Soporte({ s, poner, malos, onSalvar, radicacion }) {
  const cambiar = (id, k, val) => poner(id, { ...(s[id] || {}), [k]: val });
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>Documentos soporte · Radicar</h2>
        <span className={css.chip}>Radicación {radicacion}</span>
      </div>
      <p className={css.suave}>
        Posibles documentos o requisitos a que puede estar sometida esta importación. Para cada uno elige si se presentó, no se presentó o no
        se requiere; si se presentó, anota su número y su fecha de expedición.
      </p>
      <div className={css.scroll}>
        <table className={`${css.liq} ${css.soporte}`}>
          <thead><tr><th scope="col">Documento</th><th scope="col">Estado</th><th scope="col">Número</th><th scope="col">Fecha de expedición</th></tr></thead>
          <tbody>
            {DOCUMENTOS_SOPORTE.map((d) => {
              const x = s[d.id] || {};
              const mal = Boolean(malos?.get(d.id));
              return (
                <tr key={d.id} className={mal ? css.filaMal : undefined}>
                  <td>{d.nombre}<Error malos={malos} campo={d.id} /></td>
                  <td>
                    <select aria-label={`Estado: ${d.nombre}`} aria-invalid={mal} value={x.estado ?? ''} onChange={(e) => cambiar(d.id, 'estado', e.target.value)}>
                      <option value="">Selecciona…</option>
                      {ESTADOS_SOPORTE.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
                    </select>
                  </td>
                  <td><input aria-label={`Número: ${d.nombre}`} autoComplete="off" disabled={x.estado !== 'SI'} value={x.numero ?? ''} onChange={(e) => cambiar(d.id, 'numero', e.target.value)} /></td>
                  <td><input aria-label={`Fecha: ${d.nombre}`} autoComplete="off" placeholder="AAAA-MM-DD" disabled={x.estado !== 'SI'} value={x.fecha ?? ''} onChange={(e) => cambiar(d.id, 'fecha', e.target.value)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={css.nota}>La declaración andina del valor se diligencia antes que los documentos soporte; si se radicó en el sistema, su número de radicado es el número del documento.</p>
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Guardar</button></div>
    </div>
  );
}

// Informar: el declarante revisa lo que va a presentar y confirma
export function Informar({ enc, sub, liq, t, onConfirmar, onVolver, radicacion }) {
  const filas = [
    ['Importador', `${enc.imp_nombre || ''} · NIT ${enc.imp_nit || ''}`],
    ['Documento de transporte', `${enc.doc_transporte || ''} · Manifiesto ${enc.manifiesto || ''}`],
    ['Subpartida', `${sub.subpartida || ''} · ${sub.cantidad || ''} ${sub.unidad_comercial || ''} · Modalidad ${String(sub.modalidad || '').toUpperCase()}`],
    ['Valor en aduana', `USD ${liq.aduanaUSD.toLocaleString('es-CO')}`],
    ['Arancel e IVA', `$${pesos(liq.arancel)} + $${pesos(liq.iva)}`],
    ['Total pagado con esta declaración', `$${pesos(totalPagado(t))}`],
    ['Forma de pago', numero(t.cheque_valor) ? `Cheque No. ${t.cheque_numero} · Banco ${t.cheque_banco}` : 'Efectivo'],
    ['Documentos soporte', `${DOCUMENTOS_SOPORTE.length} revisados`],
  ];
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>Informar declaración de importación</h2>
        <span className={css.chip}>Radicación {radicacion}</span>
      </div>
      <p className={css.suave}>Revisa la información. Al confirmar, la declaración se presenta y ya no se puede modificar ni borrar.</p>
      <dl className={css.datosInv}>
        {filas.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <div className={css.acciones}>
        <button type="button" className={css.secundario} onClick={onVolver}>Volver a la declaración</button>
        <button type="button" className={css.primario} onClick={onConfirmar}>Confirmar</button>
      </div>
    </div>
  );
}

