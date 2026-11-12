import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import css from './Cuenta.module.css';

const VACIA = { nombre: '', cupos: '', venceEn: '', notas: '' };

// Licencias: instituciones con cupos y fecha de vencimiento (solo el administrador)
export default function Instituciones() {
  const { rol, tokenApi } = useAuth();
  const [lista, setLista] = useState(null);
  const [nueva, setNueva] = useState(VACIA);
  const [msg, setMsg] = useState({ texto: 'Cargando…' });

  const cargar = useCallback(() => {
    if (rol !== 'administrador') return;
    pedir('/admin/instituciones', { token: tokenApi })
      .then((d) => { setLista(d.instituciones); setMsg((m) => (m.texto.startsWith('Cargando') ? { texto: '' } : m)); })
      .catch((err) => setMsg({ texto: err.message, error: true }));
  }, [rol, tokenApi]);
  useEffect(cargar, [cargar]);

  if (rol !== 'administrador') return <Navigate to="/inicio" replace />;

  const hacer = async (pedido, exito) => {
    try { const d = await pedido(); setMsg({ texto: exito || d.mensaje }); cargar(); } catch (err) { setMsg({ texto: err.message, error: true }); }
  };
  const crear = (e) => {
    e.preventDefault();
    const cupos = Number(nueva.cupos);
    if (!nueva.nombre.trim() || !Number.isInteger(cupos) || cupos < 0 || nueva.cupos === '') { setMsg({ texto: 'Escribe el nombre y el número de cupos.', error: true }); return; }
    hacer(() => pedir('/admin/instituciones', { metodo: 'POST', token: tokenApi, cuerpo: { nombre: nueva.nombre.trim(), cupos, venceEn: nueva.venceEn || null, notas: nueva.notas } }));
    setNueva(VACIA);
  };
  const editar = (i, cambios) => hacer(() => pedir(`/admin/instituciones/${i.id}`, { metodo: 'PUT', token: tokenApi, cuerpo: cambios }));
  const cambiarCupos = (i) => {
    const r = window.prompt(`Cupos de ${i.nombre} (hoy usa ${i.usados}):`, String(i.cupos));
    if (r === null) return;
    const n = Number(r);
    if (!Number.isInteger(n) || n < 0) { setMsg({ texto: 'Los cupos deben ser un número entero.', error: true }); return; }
    editar(i, { cupos: n });
  };
  const cambiarFecha = (i) => {
    const r = window.prompt(`Fecha de vencimiento de ${i.nombre} (AAAA-MM-DD). Déjala vacía si no vence:`, i.venceEn || '');
    if (r === null) return;
    editar(i, { venceEn: r.trim() || null });
  };
  const eliminar = (i) => {
    if (window.confirm(`¿Eliminar ${i.nombre}? Sus profesores quedan sin institución y sin límite de cupos; sus grupos no se borran.`)) hacer(() => pedir(`/admin/instituciones/${i.id}`, { metodo: 'DELETE', token: tokenApi }));
  };
  const estado = (i) => (!i.activa ? 'Suspendida' : i.vencida ? 'Vencida' : 'Vigente');

  return (
    <div>
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <h1>Instituciones y licencias</h1>
        <p>Cada institución tiene un número de cupos (estudiantes distintos en los grupos de sus profesores) y una fecha de vencimiento. Asigna los profesores a su institución en «Usuarios».</p>
      </div>

      <form className={`${css.panel} ${css.enLinea}`} onSubmit={crear}>
        <input value={nueva.nombre} maxLength={150} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} placeholder="Nombre de la institución" aria-label="Nombre de la institución" />
        <input value={nueva.cupos} inputMode="numeric" onChange={(e) => setNueva({ ...nueva, cupos: e.target.value })} placeholder="Cupos" aria-label="Cupos" style={{ maxWidth: 100, minWidth: 80 }} />
        <input type="date" value={nueva.venceEn} onChange={(e) => setNueva({ ...nueva, venceEn: e.target.value })} aria-label="Fecha de vencimiento (opcional)" style={{ maxWidth: 170 }} />
        <button type="submit" className="btn-card btn-calcular">Crear institución</button>
      </form>
      <p className={`${css.estado} ${msg.error ? css.error : ''}`} role="status">{msg.texto}</p>

      {lista && lista.length === 0 && <p className={css.pista}>Todavía no hay instituciones. Mientras un profesor no tenga institución, sus grupos no tienen límite de cupos.</p>}
      {lista && lista.length > 0 && (
        <div className={`${css.panel} ${css.desplazable}`}>
          <table className={css.tabla}>
            <thead><tr><th>Institución</th><th>Estado</th><th>Cupos usados</th><th>Vence</th><th>Profesores</th><th /></tr></thead>
            <tbody>
              {lista.map((i) => (
                <tr key={i.id}>
                  <td>{i.nombre}</td>
                  <td className={estado(i) === 'Vigente' ? css.si : css.error}>{estado(i)}</td>
                  <td><span className={css.barra}><i style={{ width: `${i.cupos ? Math.min(100, (i.usados / i.cupos) * 100) : 0}%` }} /></span>{i.usados} de {i.cupos}</td>
                  <td>{i.venceEn || 'No vence'}</td>
                  <td>{i.profesores}</td>
                  <td>
                    <span className={css.enLinea}>
                      <button type="button" className="btn-card" onClick={() => cambiarCupos(i)}>Cupos</button>
                      <button type="button" className="btn-card" onClick={() => cambiarFecha(i)}>Vencimiento</button>
                      <button type="button" className="btn-card" onClick={() => editar(i, { activa: !i.activa })}>{i.activa ? 'Suspender' : 'Reactivar'}</button>
                      <button type="button" className="btn-card" onClick={() => eliminar(i)}>Eliminar</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
