import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { ROLES } from './reglas.js';
import css from './Cuenta.module.css';

const fecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : '—');

// Lista de usuarios para el administrador: buscar y cambiar el rol.
// El servidor vuelve a comprobar el rol en cada pedido; esconder la página es solo comodidad.
export default function AdminUsuarios() {
  const { usuario, rol, tokenApi } = useAuth();
  const [buscar, setBuscar] = useState('');
  const [consulta, setConsulta] = useState({ buscar: '', pagina: 1 });
  const [datos, setDatos] = useState(null);
  const [instituciones, setInstituciones] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: 'Cargando usuarios…' });

  const cargar = useCallback(() => {
    if (rol !== 'administrador') return;
    const q = new URLSearchParams({ buscar: consulta.buscar, pagina: String(consulta.pagina) });
    pedir(`/admin/usuarios?${q}`, { token: tokenApi })
      .then((d) => { setDatos(d); setMensaje({ texto: '' }); })
      .catch((err) => setMensaje({ texto: err.message, error: true }));
  }, [consulta, tokenApi, rol]);
  useEffect(cargar, [cargar]);
  useEffect(() => {
    if (rol === 'administrador') pedir('/admin/instituciones', { token: tokenApi }).then((d) => setInstituciones(d.instituciones || [])).catch(() => {});
  }, [rol, tokenApi]);

  const asignar = async (u, valor) => {
    const institucionId = valor ? Number(valor) : null;
    try {
      const d = await pedir(`/admin/usuarios/${u.id}/institucion`, { metodo: 'PUT', token: tokenApi, cuerpo: { institucionId } });
      setDatos((x) => ({ ...x, usuarios: x.usuarios.map((y) => (y.id === u.id ? { ...y, institucionId } : y)) }));
      setMensaje({ texto: `${u.nombre}: ${d.mensaje}` });
    } catch (err) { setMensaje({ texto: err.message, error: true }); }
  };

  if (rol !== 'administrador') return <Navigate to="/inicio" replace />;

  const cambiarRol = async (u, nuevo) => {
    if (!window.confirm(`¿Cambiar el rol de ${u.nombre} de ${u.rol} a ${nuevo}?`)) return;
    try {
      const d = await pedir(`/admin/usuarios/${u.id}/rol`, { metodo: 'PUT', token: tokenApi, cuerpo: { rol: nuevo } });
      setDatos((x) => ({ ...x, usuarios: x.usuarios.map((y) => (y.id === u.id ? { ...y, rol: d.usuario.rol } : y)) }));
      setMensaje({ texto: `${u.nombre} ahora es ${d.usuario.rol}.` });
    } catch (err) { setMensaje({ texto: err.message, error: true }); }
  };

  const paginas = datos ? Math.max(1, Math.ceil(datos.total / datos.porPagina)) : 1;
  return (
    <div>
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <h1>Usuarios</h1>
        <p>Busca una cuenta y asígnale el rol de profesor o de administrador. Todo registro nuevo entra como estudiante.</p>
      </div>

      <form className={css.buscar} onSubmit={(e) => { e.preventDefault(); setConsulta({ buscar: buscar.trim(), pagina: 1 }); }}>
        <input type="search" value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Nombre o correo" aria-label="Buscar usuario por nombre o correo" />
        <button type="submit" className="btn-card">Buscar</button>
      </form>
      <p className={`${css.estado} ${mensaje.error ? css.error : ''}`} role="status">{mensaje.texto}</p>

      {datos && (
        <div className={css.panel}>
          <div className={css.desplazable}>
            <table className={css.tabla}>
              <thead>
                <tr><th>Nombre</th><th>Correo</th><th>Correo confirmado</th><th>Último ingreso</th><th>Rol</th><th>Institución</th></tr>
              </thead>
              <tbody>
                {datos.usuarios.length === 0 && <tr><td colSpan={6}>No hay usuarios que coincidan.</td></tr>}
                {datos.usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}{u.bloqueado ? ' (bloqueado)' : ''}</td>
                    <td>{u.email}</td>
                    <td>{u.emailVerificado ? 'Sí' : 'No'}</td>
                    <td>{fecha(u.ultimoLogin)}</td>
                    <td>
                      {u.id === usuario.id ? <span className={css.insignia}>{u.rol} (tú)</span> : (
                        <select className={css.selector} value={u.rol} aria-label={`Rol de ${u.nombre}`} onChange={(e) => cambiarRol(u, e.target.value)}>
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      )}
                    </td>
                    <td>
                      {u.rol === 'estudiante' ? '—' : (
                        <select className={css.selector} value={u.institucionId ?? ''} aria-label={`Institución de ${u.nombre}`} onChange={(e) => asignar(u, e.target.value)}>
                          <option value="">Sin institución</option>
                          {instituciones.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={css.pie}>
            <span>{datos.total} {datos.total === 1 ? 'usuario' : 'usuarios'} · página {datos.pagina} de {paginas}</span>
            <span>
              <button type="button" className="btn-card" disabled={datos.pagina <= 1} onClick={() => setConsulta((c) => ({ ...c, pagina: c.pagina - 1 }))}>Anterior</button>{' '}
              <button type="button" className="btn-card" disabled={datos.pagina >= paginas} onClick={() => setConsulta((c) => ({ ...c, pagina: c.pagina + 1 }))}>Siguiente</button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
