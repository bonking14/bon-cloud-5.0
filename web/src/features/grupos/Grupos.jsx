import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import css from '../cuenta/Cuenta.module.css';

// Grupos del profesor (el administrador ve los de todos)
export default function Grupos() {
  const { rol, tokenApi } = useAuth();
  const puede = rol === 'profesor' || rol === 'administrador';
  const [grupos, setGrupos] = useState(null);
  const [licencia, setLicencia] = useState(null);
  const [nombre, setNombre] = useState('');
  const [msg, setMsg] = useState({ texto: 'Cargando grupos…' });

  const cargar = useCallback(() => {
    if (!puede) return;
    pedir('/grupos', { token: tokenApi })
      // Solo se borra el «Cargando…»: un mensaje de una acción recién hecha se conserva
      .then((d) => { setGrupos(d.grupos); setLicencia(d.licencia || null); setMsg((m) => (m.texto.startsWith('Cargando') ? { texto: '' } : m)); })
      .catch((err) => setMsg({ texto: err.message, error: true }));
  }, [puede, tokenApi]);
  useEffect(cargar, [cargar]);

  if (!puede) return <Navigate to="/inicio" replace />;

  const crear = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) { setMsg({ texto: 'Escribe el nombre del grupo.', error: true }); return; }
    try {
      const d = await pedir('/grupos', { metodo: 'POST', token: tokenApi, cuerpo: { nombre: nombre.trim() } });
      setNombre('');
      setMsg({ texto: `Grupo creado. Comparte el código ${d.grupo.codigo} con tus estudiantes.` });
      cargar();
    } catch (err) { setMsg({ texto: err.message, error: true }); }
  };

  return (
    <div>
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <h1>Grupos</h1>
        <p>Crea un grupo, comparte su código con tus estudiantes y sigue su avance en la Ruta de Aprendizaje.</p>
      </div>

      {licencia && (
        <p className={licencia.vigente ? css.pista : css.aviso} role="status">
          Licencia de <strong>{licencia.nombre}</strong>: {licencia.usados} de {licencia.cupos} cupos usados · {licencia.venceEn ? `vence el ${new Date(licencia.venceEn).toLocaleDateString('es-CO', { timeZone: 'UTC' })}` : 'no vence'}
          {!licencia.vigente && ' · No está vigente: tus estudiantes no pueden unirse a los grupos hasta que el administrador la renueve.'}
        </p>
      )}

      <form className={`${css.panel} ${css.enLinea}`} onSubmit={crear}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} placeholder="Nombre del grupo, por ejemplo: Comercio Exterior 2026-2" aria-label="Nombre del grupo nuevo" style={{ maxWidth: 420 }} />
        <button type="submit" className="btn-card btn-calcular">Crear grupo</button>
      </form>
      <p className={`${css.estado} ${msg.error ? css.error : ''}`} role="status">{msg.texto}</p>

      {grupos && grupos.length === 0 && <p className={css.pista}>Todavía no tienes grupos.</p>}
      {grupos && (
        <div className={css.tarjetas}>
          {grupos.map((g) => (
            <Link key={g.id} to={`/grupos/${g.id}`} className={`${css.tarjetaGrupo} ${g.archivado ? css.archivado : ''}`}>
              <h3>{g.nombre}</h3>
              <span>Código: <span className={css.codigo}>{g.codigo}</span></span>
              <small>{g.miembros} {g.miembros === 1 ? 'estudiante' : 'estudiantes'}{g.archivado ? ' · cerrado' : ''}{rol === 'administrador' ? ` · ${g.profesor}` : ''}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
