import { lecciones, modulos } from '../../data/lecciones.js';

const fecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : '');
export const fechaCorta = fecha;

// Nota de 0 a 100 del mejor intento de una lección, o null si no hay nota guardada
export const nota = (l) => (l?.mejorTotal ? Math.round((l.mejorAciertos / l.mejorTotal) * 100) : null);

// Prácticas en simuladores que se muestran en el panel: [identificador, nombre]
export const PRACTICAS = [['sigloxxii-importacion', 'SIGLO XXII · Declaración de importación']];

// Texto corto de una práctica para la tabla: «Hecha (2 veces)» o «—»
export function textoPractica(p) {
  if (!p?.veces) return '—';
  return `Hecha${p.veces > 1 ? ` (${p.veces} veces)` : ''}${p.sinSolucion ? '' : ', con la solución'}`;
}

// Resumen de un estudiante para la tabla del panel
export function resumir(estudiante) {
  const ls = estudiante.lecciones || {};
  const aprobadas = lecciones.filter((l) => ls[l.id]?.aprobada).length;
  const notas = lecciones.map((l) => nota(ls[l.id])).filter((n) => n !== null);
  const fechas = [...Object.values(ls).flatMap((l) => [l.ultimoIntento, l.aprobadaEn]), ...Object.values(estudiante.practicas || {}).map((p) => p.ultima)].filter(Boolean).sort();
  return {
    aprobadas,
    total: lecciones.length,
    promedio: notas.length ? Math.round(notas.reduce((a, b) => a + b, 0) / notas.length) : null,
    intentos: Object.values(ls).reduce((s, l) => s + (l.intentos || 0), 0),
    ultimaActividad: fechas[fechas.length - 1] || null,
  };
}

// Una fila por estudiante y lección, para abrir en Excel
export function filasCsv(estudiantes) {
  const cabecera = ['Estudiante', 'Correo', 'Módulo', 'Lección', 'Título', 'Aprobada', 'Mejor nota (%)', 'Aciertos', 'Preguntas', 'Intentos', 'Último intento', 'Aprobada el'];
  const filas = [cabecera];
  estudiantes.forEach((e) => lecciones.forEach((l) => {
    const d = e.lecciones?.[l.id] || {};
    const modulo = modulos.find((m) => m.id === l.modulo);
    filas.push([e.nombre, e.email, `${modulo.id}. ${modulo.titulo}`, l.orden, l.titulo, d.aprobada ? 'Sí' : 'No',
      nota(d) ?? '', d.mejorAciertos ?? '', d.mejorTotal ?? '', d.intentos ?? 0, fecha(d.ultimoIntento), fecha(d.aprobadaEn)]);
  }));
  // Y una fila por estudiante y práctica de simulador
  estudiantes.forEach((e) => PRACTICAS.forEach(([id, nombre]) => {
    const p = e.practicas?.[id] || {};
    filas.push([e.nombre, e.email, 'Simuladores', '', nombre, p.veces ? 'Sí' : 'No', '', p.veces ? `${p.menosErrores} pantallas con errores${p.sinSolucion ? '' : ' (con la solución)'}` : '', '', p.veces ?? 0, fecha(p.ultima), '']);
  }));
  return filas;
}
