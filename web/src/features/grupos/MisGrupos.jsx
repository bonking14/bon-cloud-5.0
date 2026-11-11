import { useCallback, useEffect, useState } from 'react';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import css from '../cuenta/Cuenta.module.css';

// Sección del perfil: los grupos a los que pertenece el estudiante y el formulario para unirse
export default function MisGrupos() {
  const { tokenApi } = useAuth();
  const [grupos, setGrupos] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [msg, setMsg] = useState({ texto: '' });

  const cargar = useCallback(() => {
    pedir('/mis-grupos', { token: tokenApi }).then((d) => setGrupos(d.grupos || [])).catch(() => setGrupos([]));
  }, [tokenApi]);
  useEffect(cargar, [cargar]);

  const unirse = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) { setMsg({ texto: 'Escribe el código que te dio tu profesor.', error: true }); return; }
    try {
      const d = await pedir('/mis-grupos', { metodo: 'POST', token: tokenApi, cuerpo: { codigo } });
      setMsg({ texto: d.mensaje });
      setCodigo('');
      cargar();
    } catch (err) { setMsg({ texto: err.message, error: true }); }
  };

  const salir = async (g) => {
    if (!window.confirm(`¿Salir del grupo ${g.nombre}? Tu profesor dejará de ver tu progreso.`)) return;
    try {
      const d = await pedir(`/mis-grupos/${g.id}`, { metodo: 'DELETE', token: tokenApi });
      setMsg({ texto: d.mensaje });
      cargar();
    } catch (err) { setMsg({ texto: err.message, error: true }); }
  };

  return (
    <section className={css.panel} aria-labelledby="t-grupos">
      <h2 id="t-grupos">Mis grupos</h2>
      {grupos && grupos.length > 0 && (
        <ul className={css.lista}>
          {grupos.map((g) => (
            <li key={g.id}>
              <span>{g.nombre}{g.archivado ? ' (cerrado)' : ''} <small>· Profesor: {g.profesor}</small></span>
              <button type="button" className="btn-card" onClick={() => salir(g)}>Salir</button>
            </li>
          ))}
        </ul>
      )}
      <form className={css.enLinea} onSubmit={unirse}>
        <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código del grupo" aria-label="Código del grupo" maxLength={12} autoComplete="off" />
        <button type="submit" className="btn-card">Unirme</button>
      </form>
      <p className={css.pista} style={{ marginTop: 8 }}>Al unirte, el profesor del grupo podrá ver tu nombre, tu correo, las lecciones que apruebes y las notas de tus quizzes. Puedes salir cuando quieras.</p>
      <p className={`${css.estado} ${msg.error ? css.error : ''}`} role="status">{msg.texto}</p>
    </section>
  );
}
