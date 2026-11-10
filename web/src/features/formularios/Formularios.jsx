import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { formularios, ALIAS } from './catalogo.js';
import { contiene, normalizar } from '../../lib/texto.js';
import Buscador from '../../components/Buscador.jsx';
import EditorFormulario from './EditorFormulario.jsx';

export default function Formularios() {
  const { id: idRuta } = useParams();
  const id = idRuta && (ALIAS[idRuta.toUpperCase()] || idRuta);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  // La Ruta de Aprendizaje abre /formularios?form=500
  const pedido = (params.get('form') || '').toUpperCase();
  const desdeRuta = ALIAS[pedido] || pedido;
  if (!id && desdeRuta && formularios.some((f) => f.id === desdeRuta)) {
    return <Navigate to={`/formularios/${desdeRuta}`} replace />;
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
        <p className="buscador-hint" style={{ marginTop: 4 }}>Son simuladores educativos: no tienen validez ante la DIAN. Los formularios 500, 560, 600 y 650 reproducen la distribución y la numeración de los formularios oficiales. Las declaraciones reales se presentan con firma digital en los servicios informáticos de la DIAN.</p>
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
