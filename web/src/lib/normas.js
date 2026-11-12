// Normas que cita una lección, sacadas de su propio texto (contenido y caso de práctica; los
// quizzes no cuentan, porque sus opciones incorrectas nombran normas que no aplican). Sirve para mostrarle al estudiante en qué se apoya la lección y para
// armar la lista de revisión del experto.
const PATRONES = [
  /Decreto(?:\s+Ley)?(?:\s+Único\s+Reglamentario)?\s+(?:número\s+)?\d{2,4}\s+de\s+\d{4}/gi,
  /Ley\s+\d{2,4}\s+de\s+\d{4}/gi,
  /Resolución(?:\s+DIAN)?\s+0*\d{1,6}\s+de\s+\d{4}/gi,
  /Decisión\s+\d{3}(?:\s+(?:de\s+la\s+)?CAN)?/gi,
  /Circular\s+DCIP-\d+/gi,
  /Estatuto\s+Tributario/gi,
  /Incoterms®?\s+2020/gi,
];
const canonica = (t) => t.replace(/\s+/g, ' ').replace(/^(\w)/, (c) => c.toUpperCase())
  .replace(/Resolución(?: DIAN)? 0*(\d+) de/i, 'Resolución DIAN $1 de').replace(/ número /i, ' ').replace(/Incoterms®? 2020/i, 'Incoterms® 2020')
  .replace(/Decisión (\d{3}).*/i, 'Decisión $1 de la CAN').replace(/estatuto tributario/i, 'Estatuto Tributario');

export function normasCitadas(leccion) {
  const texto = [leccion.contenido, leccion.etapaCaso].join(' ').replace(/<[^>]+>/g, ' ');
  const halladas = new Map();
  PATRONES.forEach((p) => (texto.match(p) || []).forEach((m) => { const c = canonica(m); halladas.set(c.toLowerCase(), c); }));
  return [...halladas.values()].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
}
