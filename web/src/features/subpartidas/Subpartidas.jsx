import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subpartidas } from '../../data/subpartidas.js';
import { normalizar, soloDigitos, contiene } from '../../lib/texto.js';
import Buscador from '../../components/Buscador.jsx';
import Filtros from '../../components/Filtros.jsx';
import Modal from '../../components/Modal.jsx';

const SECCIONES = [{ valor: 'todas', texto: 'Todas' }, ...[...new Set(subpartidas.map((s) => s.seccion))]];

// Carga tributaria total sobre el valor en aduana: el IVA se liquida sobre
// (valor en aduana + arancel), así que no basta con sumar los porcentajes.
const cargaTributaria = (sp) => ((1 + sp.arancel / 100) * (1 + sp.iva / 100) - 1) * 100;

export default function Subpartidas() {
  const [params] = useSearchParams();
  const [busqueda, setBusqueda] = useState(params.get('buscar') || ''); // la Ruta abre ?buscar=8413
  const [seccion, setSeccion] = useState('todas');
  const [abierta, setAbierta] = useState(null);

  const resultado = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const qDigitos = soloDigitos(q);
    return subpartidas.filter((sp) =>
      (seccion === 'todas' || sp.seccion === seccion) &&
      (q === '' || contiene(sp.titulo, q) || contiene(sp.desc, q) ||
        (qDigitos.length >= 2 && soloDigitos(sp.codigo).startsWith(qDigitos)) ||
        sp.keywords.some((k) => contiene(k, q))));
  }, [busqueda, seccion]);

  return (
    <>
      <div className="dashboard-header">
        <h1>🔢 Subpartidas Arancelarias</h1>
        <p>Busca el código arancelario de tu producto y consulta su arancel de referencia</p>
        <p className="buscador-hint" style={{ marginTop: 6 }}>Catálogo educativo con subpartidas a 10 dígitos (Sistema Armonizado 2022). El arancel y el IVA son valores de referencia: antes de una operación real confírmalos en el Arancel de Aduanas vigente de la DIAN.</p>
      </div>

      <div className="buscador-section">
        <Buscador valor={busqueda} onChange={setBusqueda} placeholder="Busca por producto o código... Ej: bombas, café, zapatos, 8413" />
        <div className="filtros-seccion">
          <span className="filtros-label">Sectores:</span>
          <Filtros opciones={SECCIONES} activa={seccion} onChange={setSeccion} etiqueta="Sectores" />
        </div>
      </div>

      <div className="stats-bar">
        <span>Mostrando {resultado.length} producto{resultado.length !== 1 ? 's' : ''}</span>
        <span className="stats-hint">Haz clic en una tarjeta para ver el detalle completo</span>
      </div>

      <div className="sp-grid">
        {resultado.map((sp) => (
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

      {resultado.length === 0 && (
        <div className="sin-resultados">
          <p>No se encontraron productos para tu búsqueda.</p>
          <p>Intenta con otro término o código arancelario.</p>
        </div>
      )}

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
        <div className="modal-stat"><div className="modal-stat-label">Sector</div><div className="modal-stat-value amarillo" style={{ fontSize: 14 }}>{sp.seccion}</div></div>
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
