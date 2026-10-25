// Cliente de la API de BonCloud (Express en Render).
const API_URL = (import.meta.env.VITE_API_URL || 'https://boncloud-api.onrender.com/api').replace(/\/$/, '');

// Render apaga el servidor gratuito cuando no hay tráfico: el primer pedido
// puede tardar casi un minuto mientras arranca.
const LIMITE_MS = 70000;

export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.estado = estado;
  }
}

export async function pedir(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  const controlador = new AbortController();
  const limite = setTimeout(() => controlador.abort(), LIMITE_MS);
  try {
    const res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      signal: controlador.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ErrorApi(data.error || 'No se pudo completar la solicitud.', res.status);
    return data;
  } catch (err) {
    if (err instanceof ErrorApi) throw err;
    throw new ErrorApi(
      err.name === 'AbortError'
        ? 'El servidor no respondió a tiempo. Intenta de nuevo o entra como invitado.'
        : 'No se pudo conectar con el servidor. Intenta de nuevo o entra como invitado.',
      0,
    );
  } finally {
    clearTimeout(limite);
  }
}

// Lee el "exp" del JWT sin validar la firma (eso lo hace el backend)
export function tokenVencido(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return Boolean(payload.exp && payload.exp * 1000 < Date.now());
  } catch {
    return true;
  }
}
