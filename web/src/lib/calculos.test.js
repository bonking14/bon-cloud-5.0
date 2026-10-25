import { describe, it, expect } from 'vitest';
import { toNumber, aMiles, formatUSD, formatearMientrasEscribe } from './numeros.js';
import { calcularOrdinaria, calcularFranquicia, calcularTemporalCorto } from './importacion.js';
import { calcularExportacion } from './exportacion.js';
import { digitoVerificacion } from './nit.js';
import { simularOperacion } from './simulador.js';

describe('toNumber', () => {
  it.each([
    ['60000', 60000], ['60,000', 60000], ['60.000', 60000],
    ['4,100.50', 4100.5], ['4.100,50', 4100.5], ['0,5', 0.5], ['0.5', 0.5],
    ['', 0], [null, 0], ['abc', 0], [12, 12],
  ])('%s -> %s', (entrada, esperado) => expect(toNumber(entrada)).toBe(esperado));
});

it('aMiles y formatos', () => {
  expect(aMiles(1499)).toBe(1000);
  expect(aMiles(1500)).toBe(2000);
  expect(formatUSD(1234.5)).toBe('USD 1,234.50');
  expect(formatearMientrasEscribe('1250000.5')).toBe('1,250,000.5');
});

const caso = { fob: 10000, flete: 1500, seguro: 0, arancel: 10, trm: 4000, agencia: 500000, bodegaje: 200000, transporte: 300000 };

describe('importación', () => {
  it('ordinaria: CIF, arancel e IVA aproximados a miles', () => {
    const r = calcularOrdinaria(caso);
    expect(r.seguro).toBe(50); // 0,5% supuesto
    expect(r.cifUSD).toBe(11550);
    expect(r.baseArancelariaCOP).toBe(46200000);
    expect(r.totalArancel).toBe(4620000);
    expect(r.totalIVA).toBe(9656000); // (46.200.000 + 4.620.000) × 19% = 9.655.800 -> 9.656.000
    expect(r.totalPagar).toBe(4620000 + 9656000 + 1000000);
  });

  it('usa la prima real si se escribe', () => {
    expect(calcularOrdinaria({ ...caso, seguro: 80 }).seguroSupuesto).toBe(false);
  });

  it('franquicia solo paga gastos', () => {
    expect(calcularFranquicia(caso).totalPagar).toBe(1000000);
  });

  it('temporal corto: prima del 1,5% de los tributos suspendidos', () => {
    const r = calcularTemporalCorto(caso);
    expect(r.tributosSuspendidos).toBe(14276000);
    expect(r.poliza).toBe(214140);
    expect(r.totalPagar).toBe(1214140);
  });
});

it('exportación', () => {
  const r = calcularExportacion({ fob: 50000, flete: 0, seguro: 0, trm: 4000 });
  expect(r.fobCOP).toBe(200000000);
  expect(r.incluyeFleteSeguro).toBe(false);
});

describe('dígito de verificación', () => {
  it.each([['800197268', 4], ['900.123.456', 8], ['860002964', 4], ['', '']])('%s -> %s', (nit, dv) => {
    expect(digitoVerificacion(nit)).toBe(dv);
  });
});

describe('simulador', () => {
  const base = {
    descripcion_mercancia: 'Bombas', subpartida: '8413.70', valor_usd: 20000, arancel: 5, iva: 19,
    tipo_carga: 'Contenedor 20ft', peso_kg: 8000, pais_origen: 'China', puerto_embarque: 'Shanghái',
    incoterm: 'FOB', regimen: 'Importación ordinaria', flete_usd: 0, seguro_usd: 0, trm: 4000,
    usa_agencia: true, licencia_previa: false, primera_importacion: false,
  };

  it('FOB desde Asia usa el flete de referencia y suma tributos', () => {
    const r = simularOperacion(base);
    const cif = r.costos.find((c) => c.concepto === 'Valor en aduana (CIF)');
    expect(cif.usd).toBe(20000 + 3500 + 100);
    expect(r.dias).toEqual([30 + 1 + 1 + 1, 40 + 2 + 4 + 3]);
  });

  it('régimen temporal suspende tributos', () => {
    const r = simularOperacion({ ...base, regimen: 'Importación temporal para reexportación en el mismo estado' });
    expect(r.notaTributos).toMatch(/suspendidos/);
  });

  it('DDP: el importador no paga tributos', () => {
    const r = simularOperacion({ ...base, incoterm: 'DDP' });
    expect(r.riesgos.some((x) => x.titulo.startsWith('DDP'))).toBe(true);
  });
});
