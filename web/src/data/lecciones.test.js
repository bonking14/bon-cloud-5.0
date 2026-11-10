import { describe, expect, it } from 'vitest';
import { lecciones, modulos } from './lecciones.js';
import { glosario } from './glosario.js';
import { buscarTermino } from '../lib/glosario.js';
import { MAPAS } from '../features/curso/MapaRuta.jsx';
import { formularios } from '../features/formularios/catalogo.js';
import { modalidades as importacion } from '../features/importacion/modalidades.js';

// El progreso se guarda por id de lección y la Ruta asume ids 1..N: estas pruebas
// avisan si al agregar contenido se rompe algo que el estudiante vería en pantalla.
describe('contenido de la Ruta de Aprendizaje', () => {
  it('las lecciones tienen ids y orden consecutivos desde 1', () => {
    lecciones.forEach((l, i) => {
      expect(l.id).toBe(i + 1);
      expect(l.orden).toBe(i + 1);
    });
  });

  it('cada lección pertenece a un módulo que existe y cada módulo tiene lecciones', () => {
    const ids = modulos.map((m) => m.id);
    lecciones.forEach((l) => expect(ids).toContain(l.modulo));
    ids.forEach((id) => expect(lecciones.some((l) => l.modulo === id)).toBe(true));
  });

  it('el mapa de cada módulo cubre exactamente sus lecciones', () => {
    modulos.forEach((m) => {
      const enMapa = MAPAS[m.id].nodos.flatMap((n) => n.lecciones).sort((a, b) => a - b);
      const delModulo = lecciones.filter((l) => l.modulo === m.id).map((l) => l.id);
      expect(enMapa).toEqual(delModulo);
    });
  });

  it('cada quiz tiene preguntas completas con una respuesta correcta válida', () => {
    lecciones.forEach((l) => {
      expect(l.quiz.length).toBeGreaterThanOrEqual(3);
      l.quiz.forEach((q) => {
        expect(q.opciones).toHaveLength(4);
        expect(new Set(q.opciones).size).toBe(4);
        expect(Number.isInteger(q.correcta) && q.correcta >= 0 && q.correcta < 4).toBe(true);
        expect(q.pregunta.trim()).not.toBe('');
        expect(q.explicacion.trim()).not.toBe('');
      });
    });
  });

  it('los términos enlazados en las lecciones existen en el glosario', () => {
    lecciones.forEach((l) => {
      const terminos = [...l.contenido.matchAll(/data-glosario="([^"]+)"/g)].map((m) => m[1]);
      terminos.forEach((t) => expect(buscarTermino(t), `lección ${l.id}: "${t}"`).not.toBeNull());
    });
  });

  it('la práctica de cada lección abre algo que existe', () => {
    const rutas = ['/formularios', '/glosario', '/subpartidas', '/vistos-buenos', '/incoterms', '/simulador', '/curso'];
    lecciones.forEach((l) => {
      if (!l.practica) return;
      const { moduloUrl, parametros = {} } = l.practica;
      const [, base, sub] = moduloUrl.split('/');
      // /importacion y /exportacion sin modalidad redirigen a la primera
      if (base === 'importacion') { if (sub) expect(Object.keys(importacion), `lección ${l.id}`).toContain(sub); }
      else if (base !== 'exportacion') expect(rutas, `lección ${l.id}`).toContain(moduloUrl);
      if (parametros.form) expect(formularios.map((f) => f.id)).toContain(parametros.form);
      if (parametros.termino) expect(buscarTermino(parametros.termino)).not.toBeNull();
    });
  });
});

describe('glosario', () => {
  it('no repite términos y los relacionados existen', () => {
    const nombres = glosario.map((g) => g.termino);
    expect(new Set(nombres).size).toBe(nombres.length);
    glosario.forEach((g) => g.relacionado.forEach((r) => expect(nombres, `${g.termino} → ${r}`).toContain(r)));
  });
});
