import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vistosBuenos } from '../../data/vistosBuenos.js';
import { normalizar, soloDigitos, contiene } from '../../lib/texto.js';
import Buscador from '../../components/Buscador.jsx';
import Filtros from '../../components/Filtros.jsx';

const ENTIDADES = [{ valor: 'todos', texto: 'Todos' }, ...new Set(vistosBuenos.map((v) => v.entidad))];

export default function VistosBuenos() {
  const [params] = useSearchParams();
  const entidadInicial = params.get('entidad'); // la Ruta abre ?entidad=SIC
  const [entidad, setEntidad] = useState(ENTIDADES.includes(entidadInicial) ? entidadInicial : 'todos');
  const [busqueda, setBusqueda] = useState('');

  const resultado = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const qDigitos = soloDigitos(q);
    return vistosBuenos.filter((vb) =>
      (entidad === 'todos' || vb.entidad === entidad) &&
      (q === '' || contiene(vb.titulo, q) || contiene(vb.desc, q) || contiene(vb.entidad, q) ||
        vb.keywords.some((k) => contiene(k, q)) ||
        (qDigitos.length >= 2 && vb.subpartidas.some((s) => s.replace('.', '').startsWith(qDigitos.slice(0, 4))))));
  }, [busqueda, entidad]);

  return (
    <>
      <div className="dashboard-header">
        <h1>✅ Vistos Buenos</h1>
        <p>Consulta los permisos y requisitos según el tipo de producto</p>
        <p className="buscador-hint" style={{ marginTop: 6 }}>La mayoría de mercancías son de libre importación (Decreto 925 de 2013). Esta guía muestra los casos más frecuentes; los requisitos exactos dependen de la subpartida y se verifican en la VUCE antes de embarcar.</p>
      </div>

      <div className="buscador-section">
        <Buscador valor={busqueda} onChange={setBusqueda} icono="⌕" placeholder="Busca por producto, subpartida o entidad... Ej: alimentos, 8517, INVIMA" />
        <p className="buscador-hint">También puedes filtrar por entidad:</p>
        <Filtros opciones={ENTIDADES} activa={entidad} onChange={setEntidad} etiqueta="Entidad" className="filtros-entidad" />
      </div>

      <div className="vb-grid">
        {resultado.map((vb) => (
          <article className="vb-card" key={vb.entidad + vb.titulo}>
            <div className="vb-card-header">
              <span className={`vb-entidad-badge badge-${vb.entidad}`}>{vb.entidad}</span>
              <span className="vb-card-title">{vb.titulo}</span>
            </div>
            <p className="vb-card-desc">{vb.desc}</p>
            <div className="vb-subpartidas">
              <div className="vb-subpartidas-title">Partidas relacionadas</div>
              <div className="vb-chips">{vb.subpartidas.map((s) => <span key={s} className="vb-chip">{s}</span>)}</div>
            </div>
            <div className="vb-requisitos">
              <div className="vb-requisitos-title">Requisitos</div>
              {vb.requisitos.map((r) => <div key={r} className="vb-req-item">{r}</div>)}
            </div>
          </article>
        ))}
      </div>

      {resultado.length === 0 && (
        <div className="sin-resultados">
          <p>No se encontraron resultados para tu búsqueda.</p>
          <p>Intenta con el nombre del producto, código arancelario o entidad reguladora.</p>
        </div>
      )}
    </>
  );
}
