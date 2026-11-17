import { describe, it, expect } from 'vitest';
import { CASO, MENU, RUTA_MENU, opcionesMenu, validarEncabezado, validarSubpartida, liquidar } from './sigloxxii.js';

describe('SIGLO XXII', () => {
  it('la ruta del menú existe paso a paso', () => {
    RUTA_MENU.forEach((opcion, i) => expect(opcionesMenu(RUTA_MENU.slice(0, i))).toContain(opcion));
    expect(Object.keys(MENU)).toContain('Encabezado');
  });

  it('el caso completo pasa las validaciones y un formulario vacío no', () => {
    expect(validarEncabezado(CASO.encabezado)).toEqual([]);
    expect(validarSubpartida(CASO.subpartida)).toEqual([]);
    expect(validarEncabezado({}).length).toBeGreaterThan(20);
  });

  it('acepta diferencias de mayúsculas, tildes y puntos, pero no un dato distinto', () => {
    expect(validarEncabezado({ ...CASO.encabezado, exp_pais: 'cn', factura: 'zh 2026 118' })).toEqual([]);
    const errores = validarEncabezado({ ...CASO.encabezado, imp_nit: '900123457' });
    expect(errores).toHaveLength(1);
    expect(errores[0].mensaje).toMatch(/NIT del importador: no coincide/);
    expect(validarSubpartida({ ...CASO.subpartida, subpartida: '8413.60.90.00' })).toEqual([]);
  });

  it('la autoliquidación del caso da $65.264.000', () => {
    const r = liquidar(CASO.subpartida);
    expect(r.aduanaUSD).toBe(63800);
    expect(r.baseArancel).toBe(261580000);
    expect(r.arancel).toBe(13079000);
    expect(r.iva).toBe(52185000);
    expect(r.total).toBe(65264000);
  });
});
