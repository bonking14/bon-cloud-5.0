import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import { iniciarEscenaPuerto } from './escenaPuerto.js';
import css from './Landing.module.css';

const REGLA_CLAVE = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

export default function Landing() {
  const { sesion, iniciarSesion, registrarse, entrarComoInvitado } = useAuth();
  const { esClaro, alternar } = useTheme();
  const canvasRef = useRef(null);
  const claroRef = useRef(esClaro);
  claroRef.current = esClaro;

  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.desde || '/inicio';

  const [modo, setModo] = useState('login'); // 'login' | 'registro'
  const [campos, setCampos] = useState({ nombre: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  // Con sesión abierta la landing solo redirige y no pinta el canvas: no hay escena que iniciar
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    return iniciarEscenaPuerto(canvasRef.current, () => claroRef.current);
  }, []);

  if (sesion && !exito) return <Navigate to={destino} replace />;

  const cambiar = (e) => setCampos((c) => ({ ...c, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    const email = campos.email.trim();
    if (!email || !campos.password || (modo === 'registro' && !campos.nombre.trim())) {
      setMensaje(modo === 'registro' ? 'Completa tu nombre, correo y contraseña.' : 'Escribe tu correo y tu contraseña.');
      return;
    }
    if (modo === 'registro' && !REGLA_CLAVE.test(campos.password)) {
      setMensaje('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo (!@#$%^&*).');
      return;
    }
    setCargando(true);
    setMensaje('Conectando con el servidor. Si estaba inactivo puede tardar hasta un minuto.');
    try {
      if (modo === 'registro') await registrarse({ nombre: campos.nombre.trim(), email, password: campos.password });
      else await iniciarSesion(email, campos.password);
      setMensaje('');
      setExito(true);
      setTimeout(() => navigate(destino, { replace: true }), 600);
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setCargando(false);
    }
  };

  const invitado = (e) => {
    e.preventDefault();
    entrarComoInvitado();
  };

  const alternarModo = () => {
    setModo((m) => (m === 'login' ? 'registro' : 'login'));
    setMensaje('');
  };

  const textoBoton = exito ? 'ACCESO CONCEDIDO' : cargando ? 'VERIFICANDO...' : modo === 'registro' ? 'CREAR CUENTA' : 'BIENVENIDO';

  return (
    <div className={css.landing}>
      <canvas ref={canvasRef} className={css.canvas} aria-hidden="true" />

      <button type="button" className={css.botonTema} onClick={alternar}>
        {esClaro ? 'Modo oscuro' : 'Modo claro'}
      </button>

      <div className={css.contenedor}>
        <form className={css.tarjeta} onSubmit={enviar} noValidate>
          <div className={css.logo}>
            <h1>BonCloud</h1>
            <p>PLATAFORMA DE APRENDIZAJE · PUERTO DE CARTAGENA</p>
          </div>

          <div className={css.campos}>
            {modo === 'registro' && (
              <div className={css.campo}>
                <label htmlFor="nombre">NOMBRE</label>
                <input id="nombre" name="nombre" autoComplete="name" value={campos.nombre} onChange={cambiar} placeholder="Tu nombre" />
              </div>
            )}
            <div className={css.campo}>
              <label htmlFor="email">CORREO</label>
              <input id="email" name="email" type="email" autoComplete="email" value={campos.email} onChange={cambiar} placeholder="operations@boncloud.com" />
            </div>
            <div className={css.campo}>
              <label htmlFor="password">CONTRASEÑA</label>
              <input id="password" name="password" type="password" value={campos.password} onChange={cambiar}
                autoComplete={modo === 'registro' ? 'new-password' : 'current-password'} placeholder="••••••••" />
              {modo === 'registro' && <span className={css.pista}>Mínimo 8 caracteres, una mayúscula, un número y un símbolo.</span>}
            </div>
          </div>

          <button type="submit" className={`${css.boton} ${exito ? css.botonExito : ''}`} disabled={cargando || exito}>
            {textoBoton}
          </button>
          <p className={css.mensaje} role="status" aria-live="polite">{mensaje}</p>

          <div className={css.enlaces}>
            <button type="button" onClick={alternarModo}>
              {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={invitado}>Entrar como invitado</button>
          </div>
        </form>
      </div>

      <div className={css.credito}>Bahía de Cartagena • Plataforma educativa de comercio exterior</div>
    </div>
  );
}
