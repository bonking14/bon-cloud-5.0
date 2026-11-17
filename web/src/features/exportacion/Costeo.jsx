import { useState } from 'react';
import Filtros from '../../components/Filtros.jsx';
import { formatUSD, formatearMientrasEscribe, toNumber } from '../../lib/numeros.js';
import { CONCEPTOS, INCOTERMS, costear, compararIncoterms, pagaVendedor } from '../../lib/costeo.js';
import { incoterms } from '../../data/incoterms.js';
import css from './Costeo.module.css';

// Costeo de la exportación: según el Incoterm pactado, qué costos de la cadena logística asume
// el vendedor y, con ellos, a qué precio debe cotizar.
const ETAPAS = ['Origen', 'Internacional', 'Destino'];
const NOMBRE_ETAPA = { Origen: 'En Colombia, hasta el buque', Internacional: 'Transporte internacional', Destino: 'En el país del comprador' };
// Caso del módulo 2: café tostado vendido a Hamburgo, USD 162.000 FOB Cartagena (valores de ejemplo)
const CASO = {
  exw: 155500, embalaje: 1200, marcado: 100, cargue_fabrica: 200, transporte_origen: 600, documentos: 300,
  aduana_origen: 450, puerto_origen: 2400, cargue_buque: 1250, flete: 3800, seguro: 400,
  descargue_destino: 600, puerto_destino: 700, transporte_destino: 900, aduana_destino: 13000,
};
const aTexto = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v.toLocaleString('en-US')]));

export default function Costeo() {
  const [incoterm, setIncoterm] = useState('FOB');
  const [valores, setValores] = useState({});
  const numeros = Object.fromEntries(Object.entries(valores).map(([k, v]) => [k, toNumber(v)]));
  const r = costear(numeros, incoterm);
  const info = incoterms.find((i) => i.code === incoterm);
  const poner = (id, texto) => setValores((v) => ({ ...v, [id]: formatearMientrasEscribe(texto) }));
  const hayDatos = r.costoTotal > 0;

  return (
    <>
      <div className="dashboard-header">
        <div className="modal-header-info">
          <span className="modal-badge">Incoterms® 2020</span>
          <div>
            <h1>Costeo de la exportación</h1>
            <p>Qué costos asume el vendedor según el Incoterm y a qué precio debe cotizar</p>
          </div>
        </div>
      </div>

      <div className="modal-info-bar visible">
        <strong>Cómo funciona:</strong> escribe el valor de la mercancía en fábrica (EXW: costo de producción más tu utilidad) y lo que cuesta cada paso de la cadena logística, en dólares. Al elegir un Incoterm, cada costo queda a cargo del vendedor o del comprador; el precio de venta es el valor EXW más los costos del vendedor. Supuestos: transporte principal marítimo, entrega FCA en la terminal de origen, y en CPT, CIP y las reglas D, entrega en la bodega del comprador.
      </div>

      <div className={css.acciones}>
        <button type="button" className="btn-card" onClick={() => setValores(aTexto(CASO))}>Cargar caso del café (módulo 2)</button>
        <button type="button" className="btn-card" onClick={() => setValores({})}>Limpiar</button>
      </div>

      <div className="filtros-seccion">
        <span className="filtros-label">Incoterm pactado:</span>
        <Filtros opciones={INCOTERMS} activa={incoterm} onChange={setIncoterm} etiqueta="Incoterm pactado" />
      </div>
      <p className={css.explica}><strong>{info.code} · {info.nombre}</strong> ({info.lugar}). {info.desc}</p>

      <div className={css.envoltura} style={{ marginTop: 14 }}>
        <div className={`${css.panel} ${css.scroll}`}>
          <table className={css.tabla}>
            <thead>
              <tr><th scope="col">Concepto</th><th scope="col">Lo paga</th><th scope="col" style={{ textAlign: 'right' }}>USD</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><label htmlFor="c-exw"><strong>Valor de la mercancía en fábrica (EXW)</strong></label><span className={css.nota}>Costo de producción más la utilidad del exportador.</span></td>
                <td><span className={`${css.quien} ${css.vendedor}`}>Vendedor</span></td>
                <td style={{ textAlign: 'right' }}><input id="c-exw" className={css.monto} inputMode="decimal" value={valores.exw ?? ''} placeholder="0" onChange={(e) => poner('exw', e.target.value)} /></td>
              </tr>
              {ETAPAS.map((etapa) => [
                <tr key={etapa} className={css.grupo}><td colSpan={3}>{NOMBRE_ETAPA[etapa]}</td></tr>,
                ...CONCEPTOS.filter((c) => c.etapa === etapa).map((c) => {
                  const vendedor = pagaVendedor(c, incoterm);
                  return (
                    <tr key={c.id}>
                      <td><label htmlFor={`c-${c.id}`}>{c.nombre}</label>{c.nota && <span className={css.nota}>{c.nota}</span>}</td>
                      <td><span className={`${css.quien} ${vendedor ? css.vendedor : css.comprador}`}>{vendedor ? 'Vendedor' : 'Comprador'}</span></td>
                      <td style={{ textAlign: 'right' }}><input id={`c-${c.id}`} className={css.monto} inputMode="decimal" value={valores[c.id] ?? ''} placeholder="0" onChange={(e) => poner(c.id, e.target.value)} /></td>
                    </tr>
                  );
                }),
              ])}
            </tbody>
          </table>
        </div>

        <div className={css.panel} aria-live="polite">
          <h3>Resultado en {incoterm}</h3>
          <div className={css.fila}><span>Valor EXW</span><strong>{formatUSD(r.exw)}</strong></div>
          <div className={css.fila}><span>+ Costos que asume el vendedor</span><strong>{formatUSD(r.costosVendedor)}</strong></div>
          <div className={`${css.fila} ${css.precio}`}><span>= Precio de venta {incoterm}</span><strong>{formatUSD(r.precio)}</strong></div>
          <div className={css.fila}><span>Costos que asume el comprador</span><strong>{formatUSD(r.costosComprador)}</strong></div>
          <div className={css.fila}><span>Valor FOB a declarar en la DEX (casilla 72)</span><strong>{formatUSD(r.fob)}</strong></div>
          <p className={css.explica}>
            El precio de venta es lo que se factura y lo que el comprador debe girar; ese valor se reintegra por el mercado cambiario.
            La declaración de exportación siempre declara el valor FOB, sea cual sea el Incoterm: en una venta CIF, por ejemplo, se restan el flete y el seguro.
          </p>
          {hayDatos && r.costosComprador === 0 && incoterm !== 'DDP' && <p className={css.explica}>Todos los costos que escribiste quedan a cargo del vendedor en {incoterm}.</p>}
        </div>
      </div>

      {hayDatos && (
        <div className={`${css.panel} ${css.comparar} ${css.scroll}`}>
          <h3>Comparación de los 11 Incoterms</h3>
          <table className={css.tabla}>
            <thead>
              <tr><th scope="col">Incoterm</th><th scope="col">Costos del vendedor</th><th scope="col">Precio de venta</th><th scope="col">Costos del comprador</th></tr>
            </thead>
            <tbody>
              {compararIncoterms(numeros).map((x) => (
                <tr key={x.incoterm} className={x.incoterm === incoterm ? css.activa : undefined}>
                  <td><button type="button" className="filtro-btn" onClick={() => setIncoterm(x.incoterm)} aria-label={`Ver ${x.incoterm}`}>{x.incoterm}</button></td>
                  <td>{formatUSD(x.costosVendedor)}</td><td>{formatUSD(x.precio)}</td><td>{formatUSD(x.costosComprador)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={css.explica}>El costo total de la mercancía puesta en la bodega del comprador es el mismo en todos los casos ({formatUSD(r.costoTotal)}): el Incoterm solo decide quién paga cada parte.</p>
        </div>
      )}
    </>
  );
}
