import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subpartidas } from '../../data/subpartidas.js';
import { normalizar, soloDigitos, contiene } from '../../lib/texto.js';
import { SECCIONES_ARANCEL, seccionDe, capitulos } from '../../lib/arancel.js';
import Buscador from '../../components/Buscador.jsx';
import Filtros from '../../components/Filtros.jsx';
import Modal from '../../components/Modal.jsx';
import ArancelCompleto from './ArancelCompleto.jsx';

// El catálogo va en el orden del Arancel de Aduanas: de la sección I a la XXI y, dentro de
// cada una, por código
const ORDENADAS = subpartidas
  .map((sp) => ({ ...sp, arancelSeccion: seccionDe(sp.codigo) }))
  .sort((a, b) => a.arancelSeccion.orden - b.arancelSeccion.orden || a.codigo.localeCompare(b.codigo));
const FICHAS = new Set(subpartidas.map((sp) => sp.codigo));
const VISTAS = [{ valor: 'arancel', texto: 'Arancel completo' }, { valor: 'fichas', texto: 'Fichas de práctica (con IVA y vistos buenos)' }];
const SECCIONES = [{ valor: 'todas', texto: 'Todas' }, ...SECCIONES_ARANCEL.map((s) => ({ valor: s.numero, texto: s.numero }))];

// Carga tributaria total sobre el valor en aduana: el IVA se liquida sobre
// (valor en aduana + arancel), así que no basta con sumar los porcentajes.
const cargaTributaria = (sp) => ((1 + sp.arancel / 100) * (1 + sp.iva / 100) - 1) * 100;

export default function Subpartidas() {
  const [params] = useSearchParams();
  const [busqueda, setBusqueda] = useState(params.get('buscar') || ''); // la Ruta abre ?buscar=8413
  const [seccion, setSeccion] = useState('todas');
  const [abierta, setAbierta] = useState(null);
  // La Ruta abre ?buscar=8413 para ver la ficha de su caso
  const [vista, setVista] = useState(params.get('buscar') ? 'fichas' : 'arancel');
  const verFicha = (codigo) => setAbierta(ORDENADAS.find((sp) => sp.codigo === codigo) || null);

  const resultado = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const qDigitos = soloDigitos(q);
    return ORDENADAS.filter((sp) =>
      (seccion === 'todas' || sp.arancelSeccion.numero === seccion) &&
      (q === '' || contiene(sp.titulo, q) || contiene(sp.desc, q) ||
        (qDigitos.length >= 2 && soloDigitos(sp.codigo).startsWith(qDigitos)) ||
        sp.keywords.some((k) => contiene(k, q))));
  }, [busqueda, seccion]);

  // Una lista por sección, en orden. Sin búsqueda se muestran las 21, también las que el
  // catálogo aún no cubre; al buscar o filtrar, solo las que tienen resultados.
  const sinFiltro = busqueda.trim() === '' && seccion === 'todas';
  const grupos = SECCIONES_ARANCEL
    .map((s) => ({ s, items: resultado.filter((sp) => sp.arancelSeccion.numero === s.numero) }))
    .filter((g) => g.items.length > 0 || sinFiltro || (seccion === g.s.numero && busqueda.trim() === ''));

  return (
    <>
      <div className="dashboard-header">
        <h1>🔢 Subpartidas Arancelarias</h1>
        <p>El Arancel de Aduanas completo, de la Sección I a la XXI, y fichas de práctica con IVA, vistos buenos y documentos</p>
      </div>

      <div className="filtros-seccion" style={{ marginBottom: 14 }}>
        <Filtros opciones={VISTAS} activa={vista} onChange={setVista} etiqueta="Vista" />
      </div>

      {vista === 'arancel' ? <ArancelCompleto fichas={FICHAS} onVerFicha={verFicha} /> : (<>
      <p className="buscador-hint" style={{ marginBottom: 10 }}>Catálogo educativo con subpartidas a 10 dígitos (Sistema Armonizado 2022). El arancel y el IVA son valores de referencia: antes de una operación real confírmalos en el Arancel de Aduanas vigente de la DIAN.</p>

      <div className="buscador-section">
        <Buscador valor={busqueda} onChange={setBusqueda} placeholder="Busca por producto o código... Ej: bombas, café, zapatos, 8413" />
        <div className="filtros-seccion">
          <span className="filtros-label">Sección del arancel:</span>
          <Filtros opciones={SECCIONES} activa={seccion} onChange={setSeccion} etiqueta="Secciones del arancel" />
        </div>
      </div>

      <div className="stats-bar">
        <span>Mostrando {resultado.length} producto{resultado.length !== 1 ? 's' : ''}</span>
        <span className="stats-hint">Haz clic en una tarjeta para ver el detalle completo</span>
      </div>

      {grupos.map(({ s, items }) => (
        <section key={s.numero} className="sp-seccion-arancel" aria-labelledby={`sec-${s.numero}`}>
          <h2 id={`sec-${s.numero}`} className="sp-seccion-titulo">
            <span className="sp-seccion-num">Sección {s.numero}</span> {s.titulo} <small>({capitulos(s)})</small>
          </h2>
          {items.length === 0 ? (
            <p className="sp-seccion-vacia">Este catálogo todavía no tiene subpartidas de esta sección.</p>
          ) : (
            <div className="sp-grid">
              {items.map((sp) => (
                <button type="button" key={sp.codigo} className="sp-card" onClick={() => setAbierta(sp)}>
                  <div className="sp-card-code">{sp.codigo}</div>
                  <div className="sp-card-title">{sp.titulo}</div>
                  <div className="sp-card-desc">{sp.desc}</div>
                  <div className="sp-card-footer">
                    <span className="sp-arancel">Arancel ref.: {sp.arancel}%</span>
                    <span className="sp-seccion">{sp.seccion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      ))}

      {resultado.length === 0 && (
        <div className="sin-resultados">
          <p>No se encontraron productos para tu búsqueda.</p>
          <p>Intenta con otro término o código arancelario, o búscalo en el arancel completo.</p>
        </div>
      )}
      </>)}

      <Modal abierto={Boolean(abierta)} onCerrar={() => setAbierta(null)} etiqueta={abierta?.titulo}>
        {abierta && <DetalleSubpartida sp={abierta} />}
      </Modal>
    </>
  );
}

function DetalleSubpartida({ sp }) {
  return (
    <>
      <div className="modal-code">{sp.codigo}</div>
      <div className="modal-title">{sp.titulo}</div>
      <div className="modal-desc">{sp.desc}</div>

      <div className="modal-grid">
        <div className="modal-stat"><div className="modal-stat-label">Arancel (referencia)</div><div className="modal-stat-value">{sp.arancel}%</div></div>
        <div className="modal-stat"><div className="modal-stat-label">IVA</div><div className="modal-stat-value azul">{sp.iva}%</div></div>
        <div className="modal-stat"><div className="modal-stat-label">Sección del arancel</div><div className="modal-stat-value amarillo" style={{ fontSize: 14 }}>{sp.arancelSeccion.numero} · {sp.seccion}</div></div>
        <div className="modal-stat"><div className="modal-stat-label">Tributos sobre el valor en aduana</div><div className="modal-stat-value">{cargaTributaria(sp).toLocaleString('es-CO', { maximumFractionDigits: 2 })}%</div></div>
      </div>
      <p className="modal-nota">El IVA se calcula sobre el valor en aduana más el arancel, por eso la carga total es (1 + arancel) × (1 + IVA) − 1 y no la suma de los dos porcentajes.</p>

      <div className="modal-section">
        <div className="modal-section-title">Vistos buenos y reglamentos</div>
        {sp.vistoBueno.length > 0
          ? sp.vistoBueno.map((v) => <span key={v} className="modal-tag">{v}</span>)
          : <span className="modal-tag">Libre importación: sin vistos buenos por regla general</span>}
      </div>

      <div className="modal-section">
        <div className="modal-section-title">Documentos</div>
        {sp.documentos.map((d) => <div key={d} className="modal-req">{d}</div>)}
      </div>

      <div className="modal-section">
        <div className="modal-section-title">Notas importantes</div>
        <p className="modal-notas">{sp.notas}</p>
      </div>
    </>
  );
}
