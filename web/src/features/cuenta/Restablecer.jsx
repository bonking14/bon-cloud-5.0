import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { REGLA_CLAVE, TEXTO_REGLA } from './reglas.js';
import css from './Cuenta.module.css';

// Página que abre el enlace «Restablecer contraseña» del correo
export default function Restablecer() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [clave, setClave] = useState('');
  const [repetida, setRepetida] = useState('');
  const [estado, setEstado] = useState({ texto: '', error: false, listo: false, cargando: false });

  const enviar = async (e) => {
    e.preventDefault();
    if (!REGLA_CLAVE.test(clave)) { setEstado({ texto: `La contraseña no cumple la regla. ${TEXTO_REGLA}`, error: true }); return; }
    if (clave !== repetida) { setEstado({ texto: 'Las dos contraseñas no coinciden.', error: true }); return; }
    setEstado({ texto: 'Conectando con el servidor. Si estaba inactivo puede tardar hasta un minuto.', cargando: true });
    try {
      const data = await pedir('/auth/reset-password', { metodo: 'POST', cuerpo: { token, password: clave } });
      setEstado({ texto: data.mensaje, listo: true });
    } catch (err) {
      setEstado({ texto: err.message, error: true });
    }
  };

  return (
    <div className={css.suelta}>
      <form className={css.tarjeta} onSubmit={enviar} noValidate>
        <h1>BonCloud</h1>
        <h2>Crear una contraseña nueva</h2>
        {!token ? (
          <p className={css.error} role="alert">A este enlace le falta el código. Ábrelo desde el correo o pide uno nuevo.</p>
        ) : !estado.listo && (
          <>
            <label className={css.campo}>
              <span>Contraseña nueva</span>
              <input type="password" autoComplete="new-password" value={clave} onChange={(e) => setClave(e.target.value)} />
            </label>
            <p className={css.pista}>{TEXTO_REGLA}</p>
            <label className={css.campo}>
              <span>Repite la contraseña</span>
              <input type="password" autoComplete="new-password" value={repetida} onChange={(e) => setRepetida(e.target.value)} />
            </label>
            <button type="submit" className="btn btn-primary" disabled={estado.cargando}>Guardar contraseña</button>
          </>
        )}
        <p className={`${css.estado} ${estado.error ? css.error : ''}`} role="status">{estado.texto}</p>
        <p><Link to="/">{estado.listo ? 'Iniciar sesión' : 'Volver al inicio'}</Link></p>
      </form>
    </div>
  );
}
