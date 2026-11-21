import { describe, expect, it } from 'vitest';
import { aCsv } from '../../lib/csv.js';
import { lecciones } from '../../data/lecciones.js';
import { filasCsv, nota, resumir, textoPractica } from './resumen.js';

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
    expect(filas).toHaveLength(1 + lecciones.length + 2); // las lecciones y las dos prácticas del simulador
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

  it('la práctica del simulador sale en el panel y en el archivo para Excel', () => {
    expect(textoPractica(undefined)).toBe('—');
    expect(textoPractica({ veces: 1, sinSolucion: true })).toBe('Hecha');
    expect(textoPractica({ veces: 3, sinSolucion: false })).toBe('Hecha (3 veces), con la solución');
    const conPractica = { ...ana, practicas: { 'sigloxxii-importacion': { veces: 2, ultima: '2026-11-20T10:00:00Z', menosErrores: 1, sinSolucion: true } } };
    const fila = filasCsv([conPractica]).at(-2);
    expect(fila.slice(2, 6)).toEqual(['Simuladores', '', 'SIGLO XXII · Declaración de importación', 'Sí']);
    expect(fila[9]).toBe(2);
    // el recibo oficial de pago tiene su propia fila
    expect(filasCsv([conPractica]).at(-1).slice(4, 6)).toEqual(['SIGLO XXII · Recibo oficial de pago', 'No']);
    expect(filasCsv([ana]).at(-1)[5]).toBe('No');
    // terminar la práctica cuenta como última actividad
    expect(resumir(conPractica).ultimaActividad).toBe('2026-11-20T10:00:00Z');
  });
});
