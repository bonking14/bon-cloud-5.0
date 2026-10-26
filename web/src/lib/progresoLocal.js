// Progreso del curso guardado en el navegador, separado por persona: así dos
// estudiantes que usan el mismo computador no ven el avance del otro.

// Clave anterior, compartida por todos los usuarios del navegador
const CLAVE_COMPARTIDA = 'boncloud_progreso_curso_v2';
const PREFIJO = 'boncloud_progreso_curso_v3:';
const ID_INVITADO = 'invitado';

export function claveProgreso(usuario) {
  if (!usuario) return null;
  if (usuario.invitado) return PREFIJO + ID_INVITADO;
  const id = usuario.id ?? usuario.email;
  return id == null ? null : PREFIJO + id;
}

export function leerProgreso(clave, valida) {
  if (!clave) return [];
  try {
    const data = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(data?.leccionesCompletadas) ? data.leccionesCompletadas.filter(valida) : [];
  } catch {
    return [];
  }
}

export function guardarProgreso(clave, completadas) {
  if (!clave) return false;
  try {
    localStorage.setItem(clave, JSON.stringify({ leccionesCompletadas: completadas }));
    return true;
  } catch {
    return false;
  }
}

export function borrarProgresoInvitado() {
  try {
    localStorage.removeItem(PREFIJO + ID_INVITADO);
  } catch {
    // Sin almacenamiento: no hay nada que borrar
  }
}

// Una sola vez: el progreso de la clave compartida pasa a quien tenga la sesión
// abierta ahora (era quien lo estaba usando) y la clave compartida se borra.
export function migrarProgresoCompartido(clave) {
  if (!clave) return;
  try {
    const anterior = localStorage.getItem(CLAVE_COMPARTIDA);
    if (anterior === null) return;
    if (localStorage.getItem(clave) === null) localStorage.setItem(clave, anterior);
    localStorage.removeItem(CLAVE_COMPARTIDA);
  } catch {
    // Sin almacenamiento: no hay nada que migrar
  }
}
