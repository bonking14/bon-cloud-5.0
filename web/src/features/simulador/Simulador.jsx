import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SIM_REGIONES, SIM_REGIMENES, simularOperacion, simNum, simUSD, simCOP } from '../../lib/simulador.js';
import { digitoVerificacion } from '../../lib/nit.js';
import { subpartidas } from '../../data/subpartidas.js';
import { useTasaReferencia } from '../../hooks/useTasaReferencia.js';
import { ESCENARIOS } from './escenarios.js';
import { descargarInforme } from './informePdf.js';

const PASOS = ['Mercancía', 'Origen y Logística', 'Importador', 'Confirmación'];
const CARGAS = ['Contenedor 20ft', 'Contenedor 40ft', 'Carga suelta', 'Granel', 'Carga proyecto'];
const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
const OBLIGATORIOS = [
  ['desc', 'valor', 'arancel', 'iva', 'carga', 'peso'],
  ['pais', 'puerto', 'incoterm', 'regimen', 'trm'],
  ['nit'],
  [],
];
const POSITIVOS = ['valor', 'trm', 'peso'];
const VACIO = {
  desc: '', subpartida: '', valor: '', arancel: '', iva: '19', carga: '', peso: '',
  pais: '', puerto: '', incoterm: '', regimen: '', flete: '', seguro: '', trm: '', fecha: '',
  nit: '', agencia: false, licencia: false, primera: false,
};

function errores(paso, d) {
  return OBLIGATORIOS[paso].filter((k) => {
    const v = String(d[k] ?? '').trim();
    return !v || simNum(v) < 0 && v !== '' && !isNaN(Number(v)) || (POSITIVOS.includes(k) && simNum(v) <= 0);
  });
}

function aEntrada(d) {
  return {
    descripcion_mercancia: d.desc.trim(), subpartida: d.subpartida.trim(),
    valor_usd: simNum(d.valor), arancel: simNum(d.arancel), iva: simNum(d.iva),
    tipo_carga: d.carga, peso_kg: simNum(d.peso), pais_origen: d.pais, puerto_embarque: d.puerto.trim(),
    incoterm: d.incoterm, regimen: d.regimen, flete_usd: simNum(d.flete), seguro_usd: simNum(d.seguro),
    trm: simNum(d.trm), fecha_embarque: d.fecha, nit: d.nit.replace(/\D/g, ''),
    usa_agencia: d.agencia, licencia_previa: d.licencia, primera_importacion: d.primera,
  };
}

export default function Simulador() {
  const [params] = useSearchParams();
  const [datos, setDatos] = useState(VACIO);
  const [paso, setPaso] = useState(0);
  const [conError, setConError] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [infoTrm, setInfoTrm] = useState('');
  const resultadoRef = useRef(null);

  const poner = (k, v) => {
    setDatos((d) => {
      const nuevo = { ...d, [k]: v };
      // Al elegir una subpartida del catálogo se sugieren su arancel e IVA
      if (k === 'subpartida') {
        const sp = subpartidas.find((s) => s.codigo === String(v).trim());
        if (sp) { nuevo.arancel = String(sp.arancel); nuevo.iva = String(sp.iva); }
      }
      return nuevo;
    });
    setConError((e) => e.filter((x) => x !== k));
  };

  // Si no carga la TRM oficial, el campo queda vacío para que el estudiante la escriba
  const ponerTasa = useCallback((tasa, pista, esRespaldo) => {
    if (!esRespaldo) setDatos((d) => (d.trm ? d : { ...d, trm: tasa }));
    setInfoTrm(pista);
  }, []);
  useTasaReferencia(ponerTasa);

  const precargar = useCallback((clave) => {
    const e = ESCENARIOS[clave];
    if (!e) return;
    setDatos((d) => ({
      ...VACIO,
      trm: e.trm ? String(e.trm) : d.trm,
      desc: e.desc, subpartida: e.subpartida, valor: String(e.valor), arancel: String(e.arancel), iva: String(e.iva),
      carga: e.carga, peso: String(e.peso), pais: e.pais, puerto: e.puerto, incoterm: e.incoterm, regimen: e.regimen,
      flete: String(e.flete), seguro: String(e.seguro), nit: e.nit, agencia: e.agencia,
    }));
    setConError([]);
    setResultado(null);
    setPaso(0);
  }, []);

  useEffect(() => { precargar(params.get('escenario')); }, [params, precargar]);

  const siguiente = () => {
    if (paso < PASOS.length - 1) {
      const mal = errores(paso, datos);
      setConError(mal);
      if (!mal.length) setPaso(paso + 1);
      return;
    }
    for (let i = 0; i < PASOS.length - 1; i++) {
      const mal = errores(i, datos);
      if (mal.length) { setConError(mal); setPaso(i); return; }
    }
    setResultado(simularOperacion(aEntrada(datos)));
    requestAnimationFrame(() => resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const sp = subpartidas.find((s) => s.codigo === datos.subpartida.trim());
  const dv = datos.nit.replace(/\D/g, '').length >= 6 ? digitoVerificacion(datos.nit) : '';
  const campo = (k) => ({ id: `sim-${k}`, value: datos[k], onChange: (e) => poner(k, e.target.value) });
  const grupo = (k) => `sim-group${conError.includes(k) ? ' has-error' : ''}`;

  return (
    <>
      <div className="dashboard-header" style={{ marginBottom: 24 }}>
        <h1>Simulador Logístico</h1>
        <p>Estima el valor en aduana, los tributos, los tiempos y los riesgos de una importación por el Puerto de Cartagena.</p>
        <p className="buscador-hint" style={{ marginTop: 4 }}>Usa reglas y valores de referencia (fletes, gastos portuarios, tiempos de tránsito). Sirve para aprender y comparar escenarios; no reemplaza una cotización ni la liquidación oficial.</p>
      </div>

      <div className="simulador-container">
        <div className="sim-escenarios">
          <div className="sim-escenarios-titulo">💡 Escenarios de práctica:</div>
          <div className="sim-escenarios-lista">
            {Object.entries(ESCENARIOS).map(([clave, e]) => (
              <button key={clave} type="button" className="filtro-btn" onClick={() => precargar(clave)}>{e.titulo}</button>
            ))}
          </div>
        </div>

        {!resultado && (
          <>
            <div className="wizard-progress">
              {PASOS.map((p, i) => (
                <div key={p} className={`wizard-step${i === paso ? ' active' : ''}${i < paso ? ' done' : ''}`}>
                  <div className="step-circle">{i + 1}</div><small>{p}</small>
                </div>
              ))}
            </div>

            {paso === 0 && (
              <div className="wizard-panel active">
                <h3 className="sim-panel-titulo">Datos de la Mercancía</h3>
                <div className={grupo('desc')}><label htmlFor="sim-desc">Descripción de la mercancía *</label><input type="text" {...campo('desc')} placeholder="Ej. Bombas de engranajes para aceite hidráulico" /><div className="sim-error">Este campo es obligatorio</div></div>
                <div className="sim-row">
                  <div className="sim-group">
                    <label htmlFor="sim-subpartida">Subpartida arancelaria</label>
                    <input type="text" {...campo('subpartida')} placeholder="Ej. 8413.60.90.00" list="sim-subpartidas-lista" />
                    <datalist id="sim-subpartidas-lista">{subpartidas.map((s) => <option key={s.codigo} value={s.codigo}>{s.titulo}</option>)}</datalist>
                    {sp && <div className="sim-hint">{sp.titulo}. Arancel de referencia {sp.arancel}% e IVA {sp.iva}%: confírmalos en el Arancel de Aduanas vigente.</div>}
                  </div>
                  <div className={grupo('valor')}><label htmlFor="sim-valor">Valor de la mercancía según el Incoterm (USD) *</label><input type="number" {...campo('valor')} placeholder="0.00" min="0" step="0.01" /><div className="sim-error">Ingrese el valor en USD</div></div>
                </div>
                <div className="sim-row">
                  <div className={grupo('arancel')}><label htmlFor="sim-arancel">Arancel (%) *</label><input type="number" {...campo('arancel')} placeholder="Según la subpartida" min="0" step="0.1" /><div className="sim-error">Escriba el arancel (puede ser 0)</div></div>
                  <div className={grupo('iva')}><label htmlFor="sim-iva">IVA (%) *</label><input type="number" {...campo('iva')} min="0" step="0.1" /><div className="sim-error">Escriba el IVA</div></div>
                </div>
                <div className="sim-row">
                  <div className={grupo('carga')}><label htmlFor="sim-carga">Tipo de carga *</label><select {...campo('carga')}><option value="">Seleccionar...</option>{CARGAS.map((c) => <option key={c}>{c}</option>)}</select><div className="sim-error">Seleccione tipo de carga</div></div>
                  <div className={grupo('peso')}><label htmlFor="sim-peso">Peso bruto (kg) *</label><input type="number" {...campo('peso')} placeholder="0" min="0" /><div className="sim-error">Ingrese el peso</div></div>
                </div>
              </div>
            )}

            {paso === 1 && (
              <div className="wizard-panel active">
                <h3 className="sim-panel-titulo">Origen y Logística</h3>
                <div className="sim-row">
                  <div className={grupo('pais')}><label htmlFor="sim-pais">País de origen *</label><select {...campo('pais')}><option value="">Seleccionar...</option>{Object.keys(SIM_REGIONES).map((p) => <option key={p}>{p}</option>)}</select><div className="sim-error">Seleccione el país</div></div>
                  <div className={grupo('puerto')}><label htmlFor="sim-puerto">Puerto de embarque *</label><input type="text" {...campo('puerto')} placeholder="Ej. Shanghái, Rotterdam, Miami" /><div className="sim-error">Ingrese el puerto</div></div>
                </div>
                <div className="sim-row">
                  <div className={grupo('incoterm')}><label htmlFor="sim-incoterm">Incoterm *</label><select {...campo('incoterm')}><option value="">Seleccionar...</option>{INCOTERMS.map((i) => <option key={i}>{i}</option>)}</select><div className="sim-error">Seleccione un Incoterm</div></div>
                  <div className={grupo('regimen')}><label htmlFor="sim-regimen">Régimen aduanero *</label><select {...campo('regimen')}><option value="">Seleccionar...</option>{Object.keys(SIM_REGIMENES).map((r) => <option key={r}>{r}</option>)}</select><div className="sim-error">Seleccione el régimen</div></div>
                </div>
                <div className="sim-row">
                  <div className="sim-group"><label htmlFor="sim-flete">Flete internacional (USD)</label><input type="number" {...campo('flete')} placeholder="Vacío = valor de referencia" min="0" step="0.01" /></div>
                  <div className="sim-group"><label htmlFor="sim-seguro">Seguro (USD)</label><input type="number" {...campo('seguro')} placeholder="Vacío = 0,5% del valor" min="0" step="0.01" /></div>
                </div>
                <div className="sim-row">
                  <div className={grupo('trm')}><label htmlFor="sim-trm">TRM (COP por USD) *</label><input type="number" {...campo('trm')} placeholder="Ej. 4100" min="0" step="0.01" />{infoTrm && <div className="sim-hint">{infoTrm}</div>}<div className="sim-error">Escriba la TRM</div></div>
                  <div className="sim-group"><label htmlFor="sim-fecha">Fecha estimada de embarque</label><input type="date" {...campo('fecha')} /></div>
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="wizard-panel active">
                <h3 className="sim-panel-titulo">Datos del Importador</h3>
                <div className="nit-input-group">
                  <div className={grupo('nit')} style={{ flex: 1, marginBottom: 0 }}><label htmlFor="sim-nit">NIT del importador *</label><input type="text" {...campo('nit')} placeholder="Ej. 900123456" inputMode="numeric" /><div className="sim-error">Ingrese el NIT</div></div>
                  <span className="nit-separator">-</span>
                  <div className="sim-group" style={{ marginBottom: 0 }}><label htmlFor="sim-dv">DV</label><input type="text" id="sim-dv" className="nit-dv-input" readOnly value={dv} placeholder="—" /></div>
                </div>
                <div style={{ marginTop: 16 }} />
                {[['agencia', '¿Usará agencia de aduanas?'], ['licencia', '¿La subpartida exige registro o licencia en la VUCE?'], ['primera', '¿Es su primera importación?']].map(([k, texto]) => (
                  <label className="toggle-group" key={k}>
                    <span>{texto}</span>
                    <div className="toggle"><input type="checkbox" checked={datos[k]} onChange={(e) => poner(k, e.target.checked)} /><div className="toggle-slider" /></div>
                  </label>
                ))}
              </div>
            )}

            {paso === 3 && (
              <div className="wizard-panel active">
                <h3 className="sim-panel-titulo">Confirmar Datos de la Simulación</h3>
                <Resumen d={aEntrada(datos)} dv={dv} />
              </div>
            )}

            <div className="wizard-nav">
              <button type="button" className="sim-btn sim-btn-secondary" style={{ visibility: paso === 0 ? 'hidden' : 'visible' }} onClick={() => setPaso(paso - 1)}>← Anterior</button>
              <button type="button" className={`sim-btn ${paso === PASOS.length - 1 ? 'sim-btn-submit' : 'sim-btn-primary'}`} onClick={siguiente}>
                {paso === PASOS.length - 1 ? '🚀 Simular operación' : 'Siguiente →'}
              </button>
            </div>
          </>
        )}

        {resultado && (
          <div ref={resultadoRef}>
            <Resultado r={resultado} onEditar={() => { setResultado(null); setPaso(0); }} />
          </div>
        )}
      </div>
    </>
  );
}

function Resumen({ d, dv }) {
  const filas = [
    ['Mercancía', d.descripcion_mercancia],
    ['Valor', `${simUSD(d.valor_usd)} ${d.incoterm}`],
    ['Subpartida', d.subpartida || 'Sin definir'],
    ['Arancel / IVA', `${d.arancel}% / ${d.iva}%`],
    ['Carga', `${d.tipo_carga}, ${d.peso_kg.toLocaleString('es-CO')} kg`],
    ['Origen', `${d.pais_origen} (${d.puerto_embarque})`],
    ['Régimen', d.regimen],
    ['TRM', d.trm.toLocaleString('es-CO')],
    ['NIT', `${d.nit}-${dv}`],
    ['Agencia de aduanas', d.usa_agencia ? 'Sí' : 'No, actúa directamente'],
  ];
  return (
    <div className="sim-resumen-datos">
      {filas.map(([k, v]) => <div key={k}><strong>{k}:</strong> {v}</div>)}
    </div>
  );
}

function Resultado({ r, onEditar }) {
  const [generando, setGenerando] = useState(false);
  const pdf = async () => {
    setGenerando(true);
    try { await descargarInforme(r); } finally { setGenerando(false); }
  };

  return (
    <div className="simulador-resultado active">
      <div className="sim-resumen"><strong>Resumen</strong><br /><br />{r.resumen}</div>

      <div className="resultado-card">
        <h4>💰 Costos estimados</h4>
        <table className="sim-cost-table">
          <tbody>
            {r.costos.map((c) => {
              const usd = c.usd != null ? simUSD(c.usd) : '';
              const cop = c.cop != null ? simCOP(c.cop) : (c.nota || '');
              return (
                <tr key={c.concepto} style={c.total ? { fontWeight: 800 } : c.destacado ? { fontWeight: 700 } : undefined}>
                  <td>{c.concepto}</td><td>{[usd, cop].filter(Boolean).join(' · ') || c.nota || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {r.notaTributos && <p className="sim-nota">{r.notaTributos}</p>}
        <p className="sim-nota-fina">TRM usada: {r.trm.toLocaleString('es-CO')} COP/USD. Cada tributo se aproxima al múltiplo de mil. Fletes, gastos del terminal y agencia son valores de referencia: cotiza los reales.</p>
      </div>

      <div className="resultado-card">
        <h4>📅 Tiempos estimados ({r.dias[0]} a {r.dias[1]} días)</h4>
        <div className="timeline-visual">
          {r.timeline.map((t) => (
            <div className="timeline-etapa" key={t.etapa}>
              <div className="sim-tl-dot" /><div className="sim-tl-name">{t.etapa}</div>
              <div className="sim-tl-days">{t.dias_min}-{t.dias_max} días</div><div className="sim-tl-desc">{t.descripcion}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="resultado-card">
        <h4>⚠️ Riesgos identificados</h4>
        {r.riesgos.map((x) => (
          <div key={x.titulo}>
            <span className={`badge-riesgo ${x.nivel}`}>{x.nivel.toUpperCase()}: {x.titulo}</span>
            <div className="sim-risk-desc">{x.descripcion}</div>
          </div>
        ))}
      </div>

      <div className="resultado-card">
        <h4>📋 Documentos</h4>
        <ul className="sim-doc-list">
          {r.documentos.map((doc) => (
            <li key={doc.nombre}>
              <span className={`sim-doc-check ${doc.obligatorio ? 'si' : 'no'}`}>{doc.obligatorio ? '✓' : '○'}</span>
              <span className={doc.obligatorio ? '' : 'sim-doc-optional'}>{doc.nombre}</span>
              <span className="sim-doc-entidad">{doc.entidad}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sim-acciones">
        <button type="button" className="sim-btn sim-btn-secondary" onClick={onEditar}>← Editar datos</button>
        <button type="button" className="btn-pdf" onClick={pdf} disabled={generando}>{generando ? 'Generando…' : '📄 Descargar informe PDF'}</button>
      </div>
    </div>
  );
}
