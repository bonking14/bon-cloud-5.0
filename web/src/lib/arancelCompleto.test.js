import { describe, it, expect } from 'vitest';
import datos from '../data/arancel.json';
import { indexar, buscarEnArancel } from './arancelCompleto.js';
import { subpartidas } from '../data/subpartidas.js';
import { seccionDe } from './arancel.js';

const filas = indexar(datos);

describe('arancel de aduanas completo', () => {
  it('tiene las 21 secciones en orden, con sus 98 capítulos', () => {
    expect(datos.secciones.map((s) => s.n)).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']);
    const caps = datos.secciones.flatMap((s) => s.capitulos.map((c) => c.n));
    expect(caps).toHaveLength(98);
    // cada capítulo está en la sección que le corresponde
    datos.secciones.forEach((s) => s.capitulos.forEach((c) => expect(seccionDe(`${String(c.n).padStart(2, '0')}01`).numero).toBe(s.n)));
  });

  it('tiene cerca de 8.000 subpartidas de 10 dígitos, sin repetidas', () => {
    expect(filas.length).toBeGreaterThan(7900);
    expect(new Set(filas.map((f) => f.codigo)).size).toBe(filas.length);
  });

  it('las fichas usan el gravamen del arancel, o su nota explica qué otro decreto lo cambia', () => {
    // El arancel trae el gravamen general; hay diferimientos (Decreto 272 de 2018, 1183 de 2025)
    // y aumentos (confecciones, vehículos) fijados por otros decretos
    const porCodigo = new Map(filas.map((f) => [f.codigo, f]));
    subpartidas.forEach((sp) => {
      const fila = porCodigo.get(sp.codigo);
      expect([sp.codigo, Boolean(fila)]).toEqual([sp.codigo, true]);
      if (fila.grv === sp.arancel) return;
      const otros = (sp.notas.match(/Decreto \d+ de \d{4}/g) || []).filter((d) => d !== 'Decreto 1881 de 2021');
      expect([sp.codigo, otros.length > 0]).toEqual([sp.codigo, true]);
    });
  });

  it('busca por código y por palabras, con la ruta de la subpartida', () => {
    const r = buscarEnArancel(filas, '0901.21');
    expect(r.resultados.length).toBeGreaterThan(0);
    expect(r.resultados[0].partida.codigo).toBe('09.01');
    const bombas = buscarEnArancel(filas, 'bombas liquidos');
    expect(bombas.resultados.some((f) => f.codigo.startsWith('8413'))).toBe(true);
    expect(buscarEnArancel(filas, '').total).toBe(0);
  });
});
