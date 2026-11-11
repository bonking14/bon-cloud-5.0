import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { pedir, tokenVencido } from './api.js';
import { borrarProgresoInvitado } from '../lib/progresoLocal.js';

// Mismas claves de localStorage que el sitio anterior, para no cerrar sesiones abiertas
const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';
const TOKEN_INVITADO = 'invitado';

function leerSesion() {
  try {
    const token = localStorage.getItem(CLAVE_TOKEN);
    const usuario = JSON.parse(localStorage.getItem(CLAVE_USUARIO));
    if (!token || !usuario) return null;
    if (usuario.invitado) return { token: TOKEN_INVITADO, usuario };
    if (tokenVencido(token)) return null;
    return { token, usuario };
  } catch {
    return null;
  }
}

function guardarSesion(sesion) {
  try {
    if (sesion) {
      localStorage.setItem(CLAVE_TOKEN, sesion.token);
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(sesion.usuario));
    } else {
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_USUARIO);
    }
  } catch {
    // Sin almacenamiento (modo privado): la sesión dura lo que dure la pestaña
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  const actualizar = useCallback((nueva) => {
    guardarSesion(nueva);
    setSesion(nueva);
  }, []);

  const iniciarSesion = useCallback(async (email, password) => {
    const data = await pedir('/auth/login', { metodo: 'POST', cuerpo: { email, password } });
    actualizar({ token: data.token, usuario: data.usuario });
    return data.usuario;
  }, [actualizar]);

  const registrarse = useCallback(async ({ nombre, email, password, aceptaTerminos, versionTerminos }) => {
    await pedir('/auth/register', { metodo: 'POST', cuerpo: { nombre, email, password, aceptaTerminos, versionTerminos } });
    return iniciarSesion(email, password);
  }, [iniciarSesion]);

  // El invitado siempre empieza de cero y su progreso se borra al salir:
  // en un computador compartido el siguiente invitado no hereda nada
  const entrarComoInvitado = useCallback(() => {
    borrarProgresoInvitado();
    actualizar({ token: TOKEN_INVITADO, usuario: { nombre: 'Invitado', invitado: true } });
  }, [actualizar]);

  const cerrarSesion = useCallback(() => {
    if (sesion?.usuario?.invitado) borrarProgresoInvitado();
    actualizar(null);
  }, [sesion, actualizar]);

  // Cambia datos del usuario de la sesión (nombre, rol, correo verificado) sin cerrar sesión
  const actualizarUsuario = useCallback((datos) => {
    setSesion((s) => {
      if (!s || s.usuario?.invitado) return s;
      const nueva = { ...s, usuario: { ...s.usuario, ...datos } };
      guardarSesion(nueva);
      return nueva;
    });
  }, []);

  // El rol y la verificación del correo pueden cambiar mientras la sesión está abierta
  // (un administrador asciende a alguien, o se abre el enlace del correo): se refrescan
  // al cargar la aplicación. Si el servidor no responde, se sigue con lo guardado.
  const tokenReal = sesion && !sesion.usuario?.invitado ? sesion.token : null;
  useEffect(() => {
    if (!tokenReal) return undefined;
    let vigente = true;
    pedir('/cuenta', { token: tokenReal })
      .then((data) => { if (vigente && data.usuario) actualizarUsuario(data.usuario); })
      .catch(() => {});
    return () => { vigente = false; };
  }, [tokenReal, actualizarUsuario]);

  const valor = useMemo(() => ({
    sesion,
    usuario: sesion?.usuario ?? null,
    esInvitado: Boolean(sesion?.usuario?.invitado),
    // Token solo si es un JWT real: el de invitado no sirve contra la API
    tokenApi: sesion && !sesion.usuario?.invitado ? sesion.token : null,
    rol: sesion?.usuario?.invitado ? null : sesion?.usuario?.rol || (sesion ? 'estudiante' : null),
    iniciarSesion, registrarse, entrarComoInvitado, cerrarSesion, actualizarUsuario,
    // Si la API responde 401/403, el token ya no sirve: se cierra la sesión
    verificarVigencia: () => { if (sesion && !sesion.usuario?.invitado && tokenVencido(sesion.token)) actualizar(null); },
  }), [sesion, iniciarSesion, registrarse, entrarComoInvitado, cerrarSesion, actualizarUsuario, actualizar]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
