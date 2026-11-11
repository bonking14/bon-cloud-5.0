import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { descargarTexto } from '../../lib/csv.js';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { REGLA_CLAVE, TEXTO_REGLA } from './reglas.js';
import MisGrupos from '../grupos/MisGrupos.jsx';
import css from './Cuenta.module.css';

export default function Perfil() {
  const { usuario, rol, esInvitado, tokenApi, actualizarUsuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [claveBorrar, setClaveBorrar] = useState('');
  const [msgDatos, setMsgDatos] = useState({ texto: '' });
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [claves, setClaves] = useState({ actual: '', nueva: '', repetida: '' });
  const [msgPerfil, setMsgPerfil] = useState({ texto: '' });
  const [msgClave, setMsgClave] = useState({ texto: '' });
  const [msgCorreo, setMsgCorreo] = useState('');

  // El invitado no tiene cuenta
  if (esInvitado || !tokenApi) return <Navigate to="/inicio" replace />;

  const guardarNombre = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) { setMsgPerfil({ texto: 'Escribe tu nombre.', error: true }); return; }
    try {
      const data = await pedir('/cuenta', { metodo: 'PUT', token: tokenApi, cuerpo: { nombre: nombre.trim() } });
      actualizarUsuario(data.usuario);
      setMsgPerfil({ texto: data.mensaje });
    } catch (err) { setMsgPerfil({ texto: err.message, error: true }); }
  };

  const cambiarClave = async (e) => {
    e.preventDefault();
    if (!claves.actual) { setMsgClave({ texto: 'Escribe tu contraseña actual.', error: true }); return; }
    if (!REGLA_CLAVE.test(claves.nueva)) { setMsgClave({ texto: `La contraseña nueva no cumple la regla. ${TEXTO_REGLA}`, error: true }); return; }
    if (claves.nueva !== claves.repetida) { setMsgClave({ texto: 'Las dos contraseñas nuevas no coinciden.', error: true }); return; }
    try {
      const data = await pedir('/cuenta/password', { metodo: 'PUT', token: tokenApi, cuerpo: { actual: claves.actual, nueva: claves.nueva } });
      setClaves({ actual: '', nueva: '', repetida: '' });
      setMsgClave({ texto: data.mensaje });
    } catch (err) { setMsgClave({ texto: err.message, error: true }); }
  };

  const reenviar = async () => {
    try {
      const data = await pedir('/auth/resend-verification', { metodo: 'POST', token: tokenApi });
      setMsgCorreo(data.mensaje);
    } catch (err) { setMsgCorreo(err.message); }
  };

  const descargarDatos = async () => {
    try {
      const datos = await pedir('/cuenta/datos', { token: tokenApi });
      descargarTexto('BonCloud_mis_datos.json', JSON.stringify(datos, null, 2), 'application/json');
      setMsgDatos({ texto: 'Se descargó una copia de tus datos.' });
    } catch (err) { setMsgDatos({ texto: err.message, error: true }); }
  };

  const eliminarCuenta = async (e) => {
    e.preventDefault();
    if (!claveBorrar) { setMsgDatos({ texto: 'Escribe tu contraseña para confirmar.', error: true }); return; }
    if (!window.confirm('¿Eliminar tu cuenta? Se borran tu progreso, tus notas, tus exámenes, tu certificado y los grupos que dirijas. No se puede deshacer.')) return;
    try {
      await pedir('/cuenta', { metodo: 'DELETE', token: tokenApi, cuerpo: { password: claveBorrar } });
      cerrarSesion();
      navigate('/', { replace: true });
    } catch (err) { setMsgDatos({ texto: err.message, error: true }); }
  };

  const campoClave = (clave, etiqueta, auto) => (
    <label className={css.campo}>
      <span>{etiqueta}</span>
      <input type="password" autoComplete={auto} value={claves[clave]} onChange={(e) => setClaves((c) => ({ ...c, [clave]: e.target.value }))} />
    </label>
  );

  return (
    <div className={css.pagina}>
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <h1>Mi perfil</h1>
        <p>Tus datos de acceso a BonCloud.</p>
      </div>

      {!usuario.emailVerificado && (
        <p className={css.aviso} role="status">
          Tu correo todavía no está confirmado. Abre el enlace que te enviamos al registrarte.
          <button type="button" className="btn-card" onClick={reenviar}>Reenviar enlace</button>
          {msgCorreo && <><br />{msgCorreo}</>}
        </p>
      )}

      <section className={css.panel} aria-labelledby="t-cuenta">
        <h2 id="t-cuenta">Cuenta</h2>
        <div className={css.fila}>
          <span>Correo: <strong>{usuario.email}</strong></span>
          <span>Rol: <span className={css.insignia}>{rol}</span></span>
          <span>Correo confirmado: <strong>{usuario.emailVerificado ? 'Sí' : 'No'}</strong></span>
        </div>
      </section>

      <MisGrupos />

      <form className={css.panel} onSubmit={guardarNombre} aria-labelledby="t-nombre">
        <h2 id="t-nombre">Nombre</h2>
        <label className={css.campo}>
          <span>Nombre (aparece en tu constancia)</span>
          <input value={nombre} maxLength={100} autoComplete="name" onChange={(e) => setNombre(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary">Guardar nombre</button>
        <p className={`${css.estado} ${msgPerfil.error ? css.error : ''}`} role="status">{msgPerfil.texto}</p>
      </form>

      <form className={css.panel} onSubmit={cambiarClave} aria-labelledby="t-clave">
        <h2 id="t-clave">Cambiar contraseña</h2>
        {campoClave('actual', 'Contraseña actual', 'current-password')}
        {campoClave('nueva', 'Contraseña nueva', 'new-password')}
        <p className={css.pista}>{TEXTO_REGLA}</p>
        {campoClave('repetida', 'Repite la contraseña nueva', 'new-password')}
        <button type="submit" className="btn btn-primary">Cambiar contraseña</button>
        <p className={`${css.estado} ${msgClave.error ? css.error : ''}`} role="status">{msgClave.texto}</p>
      </form>

      <form className={css.panel} onSubmit={eliminarCuenta} aria-labelledby="t-datos">
        <h2 id="t-datos">Mis datos personales</h2>
        <p className={css.pista} style={{ margin: '0 0 12px' }}>Puedes llevarte una copia de todo lo que BonCloud guarda de ti o eliminar tu cuenta. Más detalle en la <Link to="/privacidad">política de datos</Link> y los <Link to="/terminos">términos de uso</Link>.</p>
        <button type="button" className="btn-card" onClick={descargarDatos}>Descargar mis datos</button>
        <label className={css.campo} style={{ marginTop: 16 }}>
          <span>Para eliminar la cuenta, escribe tu contraseña</span>
          <input type="password" autoComplete="current-password" value={claveBorrar} onChange={(e) => setClaveBorrar(e.target.value)} />
        </label>
        <button type="submit" className="btn-card" style={{ width: 'auto' }}>Eliminar mi cuenta</button>
        <p className={`${css.estado} ${msgDatos.error ? css.error : ''}`} role="status">{msgDatos.texto}</p>
      </form>
    </div>
  );
}
