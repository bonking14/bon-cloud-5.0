import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { lecciones, modulos } from '../../data/lecciones.js';
import { descargarCsv } from '../../lib/csv.js';
import { PRACTICAS, fechaCorta, filasCsv, nota, resumir, textoPractica } from './resumen.js';
import css from '../cuenta/Cuenta.module.css';

// Panel de un grupo: avance y notas de cada estudiante
export default function PanelGrupo() {
  const { id } = useParams();
  const { rol, tokenApi } = useAuth();
  const navigate = useNavigate();
  const puede = rol === 'profesor' || rol === 'administrador';
  const [datos, setDatos] = useState(null);
  const [abierto, setAbierto] = useState(null);
  const [msg, setMsg] = useState({ texto: 'Cargando el grupo…' });

  const cargar = useCallback(() => {
    if (!puede) return;
    pedir(`/grupos/${id}`, { token: tokenApi })
      // Solo se borra el «Cargando…»: un mensaje de una acción recién hecha se conserva
      .then((d) => { setDatos(d); setMsg((m) => (m.texto.startsWith('Cargando') ? { texto: '' } : m)); })
      .catch((err) => setMsg({ texto: err.message, error: true }));
  }, [puede, id, tokenApi]);
  useEffect(cargar, [cargar]);

  if (!puede) return <Navigate to="/inicio" replace />;
  if (!datos) return <p className={`${css.estado} ${msg.error ? css.error : ''}`} role="status">{msg.texto} {msg.error && <Link to="/grupos">Volver a Grupos</Link>}</p>;

  const { grupo, estudiantes } = datos;
  const accion = async (hacer, exito) => {
    try { await hacer(); if (exito) exito(); } catch (err) { setMsg({ texto: err.message, error: true }); }
  };
  const archivar = () => accion(
    () => pedir(`/grupos/${grupo.id}`, { metodo: 'PUT', token: tokenApi, cuerpo: { archivado: !grupo.archivado } }),
    () => { setMsg({ texto: grupo.archivado ? 'Grupo reabierto: el código vuelve a servir.' : 'Grupo cerrado: nadie más puede unirse con el código.' }); cargar(); },
  );
  const eliminar = () => {
    if (!window.confirm(`¿Eliminar el grupo ${grupo.nombre}? Los estudiantes conservan su progreso, pero dejarás de verlo. No se puede deshacer.`)) return;
    accion(() => pedir(`/grupos/${grupo.id}`, { metodo: 'DELETE', token: tokenApi }), () => navigate('/grupos', { replace: true }));
  };
  const retirar = (e) => {
    if (!window.confirm(`¿Retirar a ${e.nombre} del grupo?`)) return;
    accion(() => pedir(`/grupos/${grupo.id}/miembros/${e.id}`, { metodo: 'DELETE', token: tokenApi }), () => { setMsg({ texto: `${e.nombre} ya no está en el grupo.` }); cargar(); });
  };
  const exportar = () => descargarCsv(`BonCloud_${grupo.nombre.replace(/[^\wÁÉÍÓÚÑáéíóúñ]+/g, '_')}.csv`, filasCsv(estudiantes));

  return (
    <div>
      <div className="dashboard-header" style={{ marginBottom: 16 }}>
        <h1>{grupo.nombre}{grupo.archivado ? ' (cerrado)' : ''}</h1>
        <p>Código para unirse: <span className={css.codigo}>{grupo.codigo}</span> · {estudiantes.length} {estudiantes.length === 1 ? 'estudiante' : 'estudiantes'}</p>
      </div>
      <div className={css.acciones}>
        <Link to="/grupos" className="btn-card">Volver a Grupos</Link>
        <button type="button" className="btn-card btn-calcular" onClick={exportar} disabled={!estudiantes.length}>Descargar para Excel</button>
        <button type="button" className="btn-card" onClick={archivar}>{grupo.archivado ? 'Reabrir grupo' : 'Cerrar grupo'}</button>
        <button type="button" className="btn-card" onClick={eliminar}>Eliminar grupo</button>
      </div>
      <p className={`${css.estado} ${msg.error ? css.error : ''}`} role="status">{msg.texto}</p>

      {estudiantes.length === 0 ? (
        <p className={css.pista}>Todavía nadie se ha unido. Tus estudiantes escriben el código en «Mi perfil» → «Mis grupos».</p>
      ) : (
        <div className={`${css.panel} ${css.desplazable}`}>
          <table className={css.tabla}>
            <thead>
              <tr><th>Estudiante</th><th>Lecciones aprobadas</th><th>Promedio</th><th>Intentos</th><th>SIGLO XXII</th><th>Última actividad</th><th /></tr>
            </thead>
            <tbody>
              {estudiantes.map((e) => {
                const r = resumir(e);
                const visible = abierto === e.id;
                return (
                  <Fragment key={e.id}>
                    <tr className={css.filaClic} onClick={() => setAbierto(visible ? null : e.id)}>
                      <td>
                        <button type="button" className="btn-card" aria-expanded={visible} aria-label={`Ver el detalle de ${e.nombre}`} onClick={(ev) => { ev.stopPropagation(); setAbierto(visible ? null : e.id); }}>{visible ? '−' : '+'}</button>
                        {' '}{e.nombre}<br /><small>{e.email}</small>
                      </td>
                      <td><span className={css.barra}><i style={{ width: `${(r.aprobadas / r.total) * 100}%` }} /></span>{r.aprobadas} de {r.total}</td>
                      <td>{r.promedio === null ? '—' : `${r.promedio}%`}</td>
                      <td>{r.intentos}</td>
                      <td>{PRACTICAS.map(([id, , corto]) => (
                        <div key={id} className={e.practicas?.[id]?.veces ? css.si : undefined}>{corto}: {textoPractica(e.practicas?.[id])}</div>
                      ))}</td>
                      <td>{fechaCorta(r.ultimaActividad) || '—'}</td>
                      <td><button type="button" className="btn-card" onClick={(ev) => { ev.stopPropagation(); retirar(e); }}>Retirar</button></td>
                    </tr>
                    {visible && (
                      <tr className={css.detalle}>
                        <td colSpan={7}>
                          <table>
                            <thead><tr><th>Lección</th><th>Estado</th><th>Mejor nota</th><th>Intentos</th><th>Último intento</th></tr></thead>
                            <tbody>
                              {lecciones.map((l) => {
                                const d = e.lecciones[l.id] || {};
                                const n = nota(d);
                                return (
                                  <tr key={l.id}>
                                    <td>{l.orden}. {l.titulo} <small>(módulo {modulos.find((m) => m.id === l.modulo).id})</small></td>
                                    <td className={d.aprobada ? css.si : css.no}>{d.aprobada ? 'Aprobada' : d.intentos ? 'Sin aprobar' : 'Sin empezar'}</td>
                                    <td>{n === null ? '—' : `${n}% (${d.mejorAciertos} de ${d.mejorTotal})`}</td>
                                    <td>{d.intentos || '—'}</td>
                                    <td>{fechaCorta(d.ultimoIntento) || '—'}</td>
                                  </tr>
                                );
                              })}
                              {PRACTICAS.map(([idPractica, nombre]) => {
                                const p = e.practicas?.[idPractica] || {};
                                return (
                                  <tr key={idPractica}>
                                    <td>Simulador: {nombre}</td>
                                    <td className={p.veces ? css.si : css.no}>{p.veces ? 'Terminada' : 'Sin hacer'}</td>
                                    <td>{p.veces ? `${p.menosErrores} ${p.menosErrores === 1 ? 'pantalla' : 'pantallas'} con errores${p.sinSolucion ? '' : ' (con la solución)'}` : '—'}</td>
                                    <td>{p.veces || '—'}</td>
                                    <td>{fechaCorta(p.ultima) || '—'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <p className={css.pista} style={{ marginTop: 10 }}>El promedio usa la mejor nota de cada lección con quiz registrado. Las lecciones aprobadas antes de que existiera el registro de notas aparecen como aprobadas, sin nota. La columna SIGLO XXII indica si el estudiante terminó cada práctica del simulador (la declaración de importación, el recibo oficial de pago y la declaración de corrección); en el detalle se ve cuántas pantallas le devolvió el sistema con errores en su mejor intento y si usó el botón de la solución.</p>
        </div>
      )}
    </div>
  );
}
