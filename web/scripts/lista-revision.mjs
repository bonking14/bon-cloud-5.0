// Genera docs/revision-contenido.md: la lista con la que un profesional de aduanas revisa
// el contenido de la Ruta, lección por lección.  Uso: node scripts/lista-revision.mjs
import { writeFileSync } from 'node:fs';
import { lecciones, modulos } from '../src/data/lecciones.js';
import { normasCitadas } from '../src/lib/normas.js';

const limpio = (html) => html.replace(/<li>/g, '\n- ').replace(/<\/(p|h4|ul|ol)>/g, '\n').replace(/<[^>]+>/g, '').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
const out = [
  '# Lista de revisión del contenido de BonCloud',
  '',
  'Para el profesional de aduanas que revisa la Ruta de Aprendizaje. Por cada lección: confirme',
  'que las normas citadas siguen vigentes, que cada afirmación es correcta y que la respuesta',
  'marcada en cada pregunta es la única correcta. Anote las correcciones al lado.',
  '',
  'Al terminar, su nombre, su credencial y la fecha se registran en `web/src/data/revision.js`,',
  'y aparecen al pie de cada lección. Este archivo se genera solo: no lo edite a mano.',
  '',
];
modulos.forEach((m) => {
  out.push(`## Módulo ${m.id}. ${m.titulo}`, '', `${m.caso}.`, '');
  lecciones.filter((l) => l.modulo === m.id).forEach((l) => {
    out.push(`### Lección ${l.orden}. ${l.titulo}`, '');
    const normas = normasCitadas(l);
    out.push('**Normas citadas**', '', ...(normas.length ? normas.map((n) => `- [ ] ${n}`) : ['- (ninguna)']), '');
    out.push('**Contenido**', '', limpio(l.contenido), '', '**Caso de práctica**', '', l.etapaCaso, '', '**Preguntas**', '');
    l.quiz.forEach((q, i) => out.push(`${i + 1}. ${q.pregunta}`, `   - Respuesta marcada como correcta: **${q.opciones[q.correcta]}**`, `   - Explicación: ${q.explicacion}`, `   - [ ] Correcta  [ ] Corregir: `, ''));
    out.push('- [ ] Lección revisada', '');
  });
});
writeFileSync(new URL('../../docs/revision-contenido.md', import.meta.url), `${out.join('\n')}\n`);
console.log(`✅ docs/revision-contenido.md: ${lecciones.length} lecciones`);
