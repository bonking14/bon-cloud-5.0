import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { formularios } from './catalogo.js';
import { contiene, normalizar } from '../../lib/texto.js';
import Buscador from '../../components/Buscador.jsx';
import EditorFormulario from './EditorFormulario.jsx';

export default function Formularios() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  // La Ruta de Aprendizaje abre /formularios?form=500
  const desdeRuta = params.get('form');
  if (!id && desdeRuta && formularios.some((f) => f.id === desdeRuta.toUpperCase())) {
    return <Navigate to={`/formularios/${desdeRuta.toUpperCase()}`} replace />;
  }

  const form = id && formularios.find((f) => f.id === id.toUpperCase());
  if (id && !form) return <Navigate to="/formularios" replace />;

  const q = normalizar(busqueda.trim());
  const lista = formularios.filter((f) => !q || contiene(f.nombre, q) || contiene(f.tipo, q) || contiene(f.id, q));

  return (
    <>
      <div className="dashboard-header no-imprimir">
        <h1>Formularios DIAN</h1>
        <p>Practica el diligenciamiento de los formularios aduaneros: se calculan solos y puedes imprimirlos o guardarlos en PDF.</p>
        <p className="buscador-hint" style={{ marginTop: 4 }}>Son simuladores educativos: no tienen validez ante la DIAN y la distribución de casillas es aproximada. Las declaraciones reales se presentan con firma digital en los servicios informáticos de la DIAN.</p>
      </div>

      {form ? (
        <EditorFormulario form={form} onVolver={() => navigate('/formularios')} />
      ) : (
        <>
          <div className="buscador-section">
            <Buscador valor={busqueda} onChange={setBusqueda} placeholder="Buscar formulario (Ej. 500, Importación)..." etiqueta="Buscar formulario" />
          </div>
          <div className="grid-formularios">
            {lista.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No se encontraron formularios.</p>}
            {lista.map((f) => (
              <button type="button" key={f.id} className="form-card" onClick={() => navigate(`/formularios/${f.id}`)}>
                <h3>{f.nombre}</h3>
                <p className="form-card-desc">{f.desc}</p>
                <span className="tag-tipo">{f.tipo}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
