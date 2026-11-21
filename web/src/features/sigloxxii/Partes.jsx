import { ACEPTACION, AUTOADHESIVO, DOCUMENTOS_A_MANO, DOCUMENTOS_SOPORTE, ESTADOS_SOPORTE, TASA_SEMANA, TIPOS_INSPECCION, numero, totalPagado, totalesGenerales } from '../../lib/sigloxxii.js';
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

export function Totales({ t, poner, malos, liq, onSalvar, onBuscar, radicacion, anteriores, tipo = 'Inicial' }) {
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
    ['69', 'Total arancel', g.arancel, 'pagado_arancel', anteriores?.arancel],
    ['70', 'Total IVA', g.iva, 'pagado_iva', anteriores?.iva],
    ['71', 'Sanciones', null, 'sanciones', 0],
    ['72', 'Total otros', g.otros, 'pagado_otros', 0],
  ];
  const pagado = totalPagado(t);
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>Totales declaración de importación</h2>
        <span className={css.chip}>1. Tipo: {tipo} · 24. TRM {TASA_SEMANA.toLocaleString('es-CO')} · Radicación {radicacion}</span>
      </div>
      <p className={css.suave}>
        {anteriores
          ? '67. Pagos anteriores: el sistema trae lo que se pagó con la declaración anterior. Con esta se paga la diferencia.'
          : '67. Pagos anteriores: 0 (solo se traen en correcciones, modificaciones o legalizaciones).'}
      </p>
      <div className={css.scroll}>
        <table className={`${css.liq} ${css.totales}`}>
          <thead><tr><th scope="col">68. Concepto</th><th scope="col">Total general $</th>{anteriores && <th scope="col">67. Pagos anteriores $</th>}<th scope="col">Total pagado con esta declaración $</th></tr></thead>
          <tbody>
            {filas.map(([n, concepto, valor, campo, anterior]) => (
              <tr key={n}>
                <td>{n}. {concepto}</td>
                <td>{valor === null ? input(campo, `${n}. ${concepto}`) : pesos(valor)}</td>
                {anteriores && <td>{pesos(anterior)}</td>}
                <td>{campo === 'sanciones' ? pesos(numero(t.sanciones) || 0) : input(campo, `${n}. ${concepto} pagado`)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td>73. Total</td><td>{pesos(general + (numero(t.sanciones) || 0))}</td>{anteriores && <td>{pesos(anteriores.arancel + anteriores.iva)}</td>}<td data-testid="sx-total-pagado">{pesos(pagado)}</td></tr></tfoot>
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

export function Soporte({ s, poner, malos, onSalvar, radicacion, soportes = DOCUMENTOS_SOPORTE }) {
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
            {soportes.map((d) => {
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


// Campo de texto con su rótulo, su error y, si tiene tabla, el botón para buscar el código
export function CampoTexto({ campo, rotulo, v, poner, malos, ancho = 1, placeholder, tabla, onBuscar, opciones }) {
  const id = `sx-${campo}`;
  const error = malos?.get(campo);
  return (
    <div className={`${css.campo}${error ? ` ${css.mal}` : ''}`} style={{ gridColumn: `span ${ancho}` }}>
      <span className={css.rotulo}>
        <label htmlFor={id}>{rotulo}</label>
        {tabla && <button type="button" className={css.buscar} onClick={() => onBuscar(tabla, campo, poner)} aria-label={`Buscar código: ${rotulo}`}>Buscar código</button>}
      </span>
      {opciones ? (
        <select id={id} value={v[campo] ?? ''} aria-invalid={Boolean(error)} onChange={(e) => poner(campo, e.target.value)}>
          <option value="">Selecciona…</option>
          {opciones.map(([c, t]) => <option key={c} value={c}>{t}</option>)}
        </select>
      ) : (
        <input id={id} type="text" autoComplete="off" placeholder={placeholder} aria-invalid={Boolean(error)} value={v[campo] ?? ''} onChange={(e) => poner(campo, e.target.value)} />
      )}
      {error && <small className={css.errorCampo}>{error}</small>}
    </div>
  );
}

// Pago en la entidad autorizada para recaudar: el banco recibe la declaración aceptada y el pago
export function Pago({ v, poner, malos, onSalvar, onBuscar }) {
  return (
    <div className={css.tarjeta}>
      <div className={css.radicada}>
        <span className={css.exitoIcono} aria-hidden="true">✓</span>
        <div>
          <h2>Declaración aceptada</h2>
          <p className={css.suave}>Número de aceptación generado <strong className={css.codigo}>{ACEPTACION.numero}</strong> · Fecha {ACEPTACION.fecha}. La declaración ya no se puede modificar y queda esperando el pago.</p>
        </div>
      </div>
      <h3 className={css.subtitulo}>Pago en el banco (entidad autorizada para recaudar)</h3>
      <p className={css.suave}>Lleva la declaración aceptada al banco y paga los tributos. Llena los datos con los que el banco recibe el pago.</p>
      <div className={css.rejilla}>
        <CampoTexto campo="aceptacion" rotulo="Número de aceptación de la declaración" v={v} poner={poner} malos={malos} ancho={2} />
        <CampoTexto campo="banco" rotulo="Banco (cód.)" v={v} poner={poner} malos={malos} tabla="bancos" onBuscar={onBuscar} />
        <CampoTexto campo="valor" rotulo="Valor pagado $" v={v} poner={poner} malos={malos} />
        <CampoTexto campo="cheque" rotulo="Número del cheque" v={v} poner={poner} malos={malos} />
      </div>
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Pagar</button></div>
    </div>
  );
}

// Solicitud de levante: con el autoadhesivo del banco y la aceptación se pide la autorización de retiro
export function Levante({ v, poner, malos, onSalvar }) {
  return (
    <div className={css.tarjeta}>
      <div className={css.comprobante} aria-label="Comprobante del banco">
        <strong>Autoadhesivo del banco</strong>
        <span>No. <b className={css.codigo}>{AUTOADHESIVO.numero}</b> · Fecha {AUTOADHESIVO.fecha} · Pago recibido y transmitido a la DIAN</span>
      </div>
      <div className={css.cabecera}>
        <h2>Solicitud de levante</h2>
        <span className={css.chip}>Declaración de importación</span>
      </div>
      <p className={css.suave}>
        Con el pago transmitido, pide el levante: la autorización para retirar la mercancía del depósito. Escribe los datos de la aceptación
        y del autoadhesivo que el banco puso en la declaración.
      </p>
      <div className={css.rejilla}>
        <CampoTexto campo="aceptacion" rotulo="Número de aceptación" v={v} poner={poner} malos={malos} ancho={2} />
        <CampoTexto campo="aceptacion_fecha" rotulo="Fecha de aceptación" v={v} poner={poner} malos={malos} ancho={2} placeholder="AAAA-MM-DD" />
        <CampoTexto campo="autoadhesivo" rotulo="Número de autoadhesivo" v={v} poner={poner} malos={malos} ancho={2} />
        <CampoTexto campo="autoadhesivo_fecha" rotulo="Fecha del autoadhesivo" v={v} poner={poner} malos={malos} ancho={2} placeholder="AAAA-MM-DD" />
      </div>
      <p className={css.nota}>El sistema puede dar levante automático o seleccionar la declaración para inspección física o documental. En esta práctica da levante automático.</p>
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Solicitar levante</button></div>
    </div>
  );
}

// Inspección: el sistema seleccionó la declaración. En la documental se presentan los documentos
// soporte; en la física, además, se revisa el acta de lo que el funcionario encontró en la mercancía.
export function Inspeccion({ tipo, hallazgos, v, poner, malos, onSalvar }) {
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>{TIPOS_INSPECCION[tipo]}</h2>
        <span className={css.chip}>Aceptación {ACEPTACION.numero}</span>
      </div>
      <p className={css.suave}>
        {tipo === 'fisica'
          ? 'El sistema seleccionó la declaración para inspección física: un funcionario de la DIAN revisa los documentos y la mercancía en el depósito, y deja un acta con lo que encontró. El levante lo autoriza el funcionario.'
          : 'El sistema seleccionó la declaración para inspección documental: un funcionario de la DIAN revisa los documentos soporte antes de autorizar el levante.'}
      </p>
      <fieldset className={css.seccion}>
        <legend>Documentos que le presentas al funcionario</legend>
        <div className={css.checks}>
          {DOCUMENTOS_A_MANO.map(([id, nombre]) => (
            <label key={id} className={malos?.get(`doc_${id}`) ? css.checkMal : undefined}>
              <input type="checkbox" checked={Boolean(v[`doc_${id}`])} onChange={(e) => poner(`doc_${id}`, e.target.checked)} /> {nombre}
              <Error malos={malos} campo={`doc_${id}`} />
            </label>
          ))}
        </div>
      </fieldset>
      {tipo === 'fisica' && (
        <fieldset className={css.seccion}>
          <legend>Acta de inspección: lo que encontró el funcionario</legend>
          <p className={css.suave}>Compara cada dato con lo que declaraste y con los documentos del caso.</p>
          <div className={css.scroll}>
            <table className={`${css.liq} ${css.soporte}`}>
              <thead><tr><th scope="col">Dato</th><th scope="col">Encontrado en la mercancía</th><th scope="col">¿Coincide con lo declarado?</th></tr></thead>
              <tbody>
                {hallazgos.map(([dato, valor], i) => (
                  <tr key={dato} className={malos?.get(`acta_${i}`) ? css.filaMal : undefined}>
                    <td>{dato}<Error malos={malos} campo={`acta_${i}`} /></td>
                    <td>{valor}</td>
                    <td>
                      <select aria-label={`¿Coincide? ${dato}`} value={v[`acta_${i}`] ?? ''} onChange={(e) => poner(`acta_${i}`, e.target.value)}>
                        <option value="">Selecciona…</option>
                        <option value="SI">Sí coincide</option>
                        <option value="NO">No coincide</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
      )}
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Terminar la inspección</button></div>
    </div>
  );
}
