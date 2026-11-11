import { describe, expect, it } from 'vitest';
import { aCsv } from '../../lib/csv.js';
import { lecciones } from '../../data/lecciones.js';
import { filasCsv, nota, resumir } from './resumen.js';

const ana = {
  nombre: 'Ana', email: 'ana@example.com',
  lecciones: {
    1: { aprobada: true, aprobadaEn: '2026-11-02T10:00:00Z', intentos: 2, mejorAciertos: 4, mejorTotal: 4, ultimoIntento: '2026-11-02T10:00:00Z' },
    2: { aprobada: false, intentos: 1, mejorAciertos: 1, mejorTotal: 4, ultimoIntento: '2026-11-05T10:00:00Z' },
    3: { aprobada: true, aprobadaEn: '2026-10-01T10:00:00Z' }, // aprobada antes de que se guardaran notas
  },
};

describe('panel del profesor', () => {
  it('resume aprobadas, promedio de las mejores notas, intentos y última actividad', () => {
    expect(resumir(ana)).toEqual({ aprobadas: 2, total: lecciones.length, promedio: 63, intentos: 3, ultimaActividad: '2026-11-05T10:00:00Z' });
    expect(resumir({ lecciones: {} })).toEqual({ aprobadas: 0, total: lecciones.length, promedio: null, intentos: 0, ultimaActividad: null });
  });

  it('una lección aprobada sin intentos guardados no tiene nota', () => {
    expect(nota(ana.lecciones[3])).toBeNull();
    expect(nota(ana.lecciones[1])).toBe(100);
  });

  it('el archivo para Excel trae una fila por estudiante y lección', () => {
    const filas = filasCsv([ana]);
    expect(filas).toHaveLength(1 + lecciones.length);
    expect(filas[1].slice(0, 2)).toEqual(['Ana', 'ana@example.com']);
    expect(filas[1][5]).toBe('Sí');
    expect(filas[2][5]).toBe('No');
    expect(filas[2][6]).toBe(25);
  });
});

describe('CSV', () => {
  it('usa punto y coma, BOM y comillas donde hacen falta', () => {
    expect(aCsv([['a', 'b;c', 'd"e'], [1, null, 'ñ']])).toBe('﻿a;"b;c";"d""e"\r\n1;;ñ\r\n');
  });

  it('un nombre que empieza como fórmula no se ejecuta en Excel', () => {
    expect(aCsv([['=HYPERLINK("http://x")', '+57 300', '-1', '@x']])).toBe('﻿"\'=HYPERLINK(""http://x"")";\'+57 300;\'-1;\'@x\r\n');
  });
});
