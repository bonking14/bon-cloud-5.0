import { describe, it, expect } from 'vitest';
import { calcular500, calcular600, calcularDAV, sumaCapital, faltantes } from './formularios.js';

describe('formulario 500', () => {
  // Caso de la Ruta: 500 bombas × USD 120, flete 3.500, seguro 300, TRM 4.100, arancel 5%
  const caso = {
    v_fob: '60000', v_fletes: '3500', v_seguros: '300', v_otros: '0',
    tasa_cambio: '4100', tasa_arancel: '5', tasa_iva: '19', tasa_salva: '0', tasa_anti: '0', total_sancion: '0',
  };

  it('liquida el caso de la Ruta: USD 63.800 y $65.264.000 de tributos', () => {
    const r = calcular500(caso);
    expect(r.fob).toBe(60000);
    expect(r.aduanaUSD).toBe(63800);
    expect(r.aduanaCOP).toBe(261580000);
    expect(r.arancel).toBe(13079000);
    expect(r.iva).toBe(52185000);
    expect(r.total).toBe(65264000);
    expect(r.pago).toBe(65264000);
    expect(r.totalUSD).toBeCloseTo(15918.05, 2);
    expect(r.requiereDAV).toBe(true);
  });

  it('salvaguardia y antidumping se pagan pero no entran a la base del IVA (Concepto DIAN 626 de 2020)', () => {
    const r = calcular500({ ...caso, tasa_salva: '10', tasa_anti: '2' });
    expect(r.salvaguardia).toBe(26158000);
    expect(r.antidumping).toBe(5232000);
    expect(r.baseIVA).toBe(261580000 + 13079000);
    expect(r.total).toBe(13079000 + 26158000 + 5232000 + 52185000);
  });

  it('el ajuste de valor (casilla 83) suma o resta al valor en aduana', () => {
    expect(calcular500({ ...caso, v_ajuste: '200' }).aduanaUSD).toBe(64000);
    expect(calcular500({ ...caso, v_ajuste: '-800' }).aduanaUSD).toBe(63000);
  });

  it('la DAV se exige desde USD 5.000 FOB exactos (igual o superior)', () => {
    expect(calcular500({ ...caso, v_fob: '5000' }).requiereDAV).toBe(true);
    expect(calcular500({ ...caso, v_fob: '4999.99' }).requiereDAV).toBe(false);
  });

  it('sanción y rescate se suman al total, y los pagos anteriores (127) se descuentan del pago (980)', () => {
    const r = calcular500({ ...caso, total_sancion: '1000000', total_rescate: '500000', pagos_anteriores: '264000' });
    expect(r.total).toBe(66764000);
    expect(r.pago).toBe(66500000);
  });
});

it('formulario 600: el total de exportaciones (76) suma FOB, fletes, seguros y otros gastos', () => {
  expect(calcular600({ t_fob: '162000' })).toEqual({ fob: 162000, total: 162000 });
  expect(calcular600({ t_fob: '162000', t_fletes: '4000', t_seguros: '500', t_otros: '100' }).total).toBe(166600);
});

it('formulario 560: precio + flete + seguro = valor en aduana USD 63.800', () => {
  const r = calcularDAV({ v94: '60000', v118: '3500', v122: '300', v125: '100' });
  expect(r[97]).toBe(60000);
  expect(r[123]).toBe(3800);
  expect(r[134]).toBe(100);
  expect(r[135]).toBe(63700);
});

it('formulario 001: la composición del capital no pasa del 100%', () => {
  expect(sumaCapital({ porc_82: '60', porc_85: '40' }).excede).toBe(false);
  expect(sumaCapital({ porc_82: '60', porc_85: '41' }).excede).toBe(true);
});

it('faltantes', () => {
  expect(faltantes({ a: 'x', b: ' ' }, [['a', 'A'], ['b', 'B'], ['c', 'C']]).map(([k]) => k)).toEqual(['b', 'c']);
});
