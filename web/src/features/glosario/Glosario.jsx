import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { glosario } from '../../data/glosario.js';
import { normalizar, contiene } from '../../lib/texto.js';
import Buscador from '../../components/Buscador.jsx';
import Filtros from '../../components/Filtros.jsx';
import Modal from '../../components/Modal.jsx';
import FichaGlosario from '../../components/FichaGlosario.jsx';
import { buscarTermino } from '../../lib/glosario.js';

const CATEGORIAS = ['TODAS', ...new Set(glosario.map((g) => g.categoria))];

export default function Glosario() {
  const [params] = useSearchParams();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('TODAS');
  const [abierto, setAbierto] = useState(() => buscarTermino(params.get('termino') || '') || null);

  const resultado = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return glosario.filter((g) =>
      (categoria === 'TODAS' || g.categoria === categoria) &&
      (!q || contiene(g.termino, q) || contiene(g.nombreCompleto, q) || contiene(g.definicion, q) ||
        contiene(g.ejemplo, q) || g.relacionado.some((r) => contiene(r, q))));
  }, [busqueda, categoria]);

  // Un término relacionado abre su ficha si existe; si no, filtra por esa palabra
  const irARelacionado = (rel) => {
    const t = buscarTermino(rel);
    if (t) { setAbierto(t); return; }
    setAbierto(null);
    setBusqueda(rel);
  };

  return (
    <>
      <div className="dashboard-header">
        <h1>📖 Glosario de Comercio Exterior y Aduanas</h1>
        <p>Consulta términos clave, normativas DIAN, Incoterms y conceptos operativos portuarios</p>
      </div>

      <div className="buscador-section">
        <Buscador valor={busqueda} onChange={setBusqueda} placeholder="Busca un término, acrónimo o definición... Ej: CIF, DTA, Levante, IVA" />
        <div className="filtros-seccion">
          <span className="filtros-label">Categorías:</span>
          <Filtros opciones={CATEGORIAS} activa={categoria} onChange={setCategoria} etiqueta="Categorías" />
        </div>
      </div>

      <div className="stats-bar">
        <span>Mostrando {resultado.length} de {glosario.length} términos</span>
        <span className="stats-hint">Haz clic en una tarjeta para ver la definición técnica completa y ejemplos</span>
      </div>

      <div className="glosario-grid">
        {resultado.map((g) => (
          <button type="button" key={g.termino} className="glosario-card" onClick={() => setAbierto(g)}>
            <div className="glosario-card-header">
              <span className="glosario-badge">{g.categoria}</span>
              <h3 className="glosario-card-title">{g.termino}</h3>
            </div>
            <p className="glosario-card-sub">{g.nombreCompleto}</p>
            <p className="glosario-card-desc">{g.definicion}</p>
            <div className="glosario-card-footer"><span>Ver más detalle ➔</span></div>
          </button>
        ))}
      </div>

      {resultado.length === 0 && (
        <div className="sin-resultados">
          <p>⚠️ No se encontraron términos para tu búsqueda.</p>
          <p>Intenta con otra palabra clave o acrónimo aduanero.</p>
        </div>
      )}

      <Modal abierto={Boolean(abierto)} onCerrar={() => setAbierto(null)} etiqueta={abierto?.termino}
        claseFondo="glosario-modal-overlay" claseCaja="glosario-modal" claseCerrar="glosario-modal-close">
        {abierto && <FichaGlosario termino={abierto} onRelacionado={irARelacionado} />}
      </Modal>
    </>
  );
}
