import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import css from './Cuenta.module.css';

// Página que abre el enlace «Confirmar correo»
export default function VerificarCorreo() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { sesion, actualizarUsuario, tokenApi } = useAuth();
  const [estado, setEstado] = useState({ texto: token ? 'Confirmando tu correo…' : 'A este enlace le falta el código. Ábrelo desde el correo.', error: !token, listo: false });
  const enviado = useRef(false); // el enlace sirve una sola vez: no se manda dos veces

  useEffect(() => {
    if (!token || enviado.current) return;
    enviado.current = true;
    pedir('/auth/verify-email', { metodo: 'POST', cuerpo: { token } })
      .then(() => {
        setEstado({ texto: 'Correo confirmado. Gracias.', listo: true });
        // Si hay sesión abierta se refrescan el rol y el estado del correo
        if (tokenApi) pedir('/cuenta', { token: tokenApi }).then((d) => d.usuario && actualizarUsuario(d.usuario)).catch(() => {});
      })
      .catch((err) => setEstado({ texto: err.message, error: true }));
  }, [token, tokenApi, actualizarUsuario]);

  return (
    <div className={css.suelta}>
      <div className={css.tarjeta}>
        <h1>BonCloud</h1>
        <h2>Confirmación de correo</h2>
        <p className={`${css.estado} ${estado.error ? css.error : ''}`} role="status">{estado.texto}</p>
        <p><Link to={sesion ? '/inicio' : '/'}>{sesion ? 'Ir al inicio' : 'Iniciar sesión'}</Link></p>
      </div>
    </div>
  );
}
