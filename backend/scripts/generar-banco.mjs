// Genera backend/data/banco.json con las preguntas del examen final a partir de los quizzes
// de la web (web/src/data/lecciones.js). El servidor califica con este archivo, así que hay
// que volver a generarlo cuando cambien las lecciones:  npm run banco
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lecciones, modulos } from '../../web/src/data/lecciones.js';

export const construirBanco = () => ({
  modulos: modulos.map((m) => ({ id: m.id, titulo: m.titulo, lecciones: lecciones.filter((l) => l.modulo === m.id).map((l) => l.id) })),
  preguntas: lecciones.flatMap((l) => l.quiz.map((q, i) => ({
    id: `L${l.id}-${i + 1}`, leccion: l.id, modulo: l.modulo,
    pregunta: q.pregunta, opciones: q.opciones, correcta: q.correcta, explicacion: q.explicacion,
  }))),
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const banco = construirBanco();
  writeFileSync(new URL('../data/banco.json', import.meta.url), `${JSON.stringify(banco, null, 1)}\n`);
  console.log(`✅ banco.json: ${banco.preguntas.length} preguntas de ${banco.modulos.length} módulos`);
}
