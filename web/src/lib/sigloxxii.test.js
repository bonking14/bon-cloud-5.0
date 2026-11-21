import { describe, it, expect } from 'vitest';
import { CASO, MENU, RUTA_MENU, aFormulario500, opcionesMenu, validarEncabezado, validarSubpartida, liquidar } from './sigloxxii.js';
import { TABLAS, buscarCodigo } from './codigosAduana.js';

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

  it('acepta las fechas en los formatos de uso común y la ciudad con o sin el departamento', () => {
    for (const f of ['2026-03-10', '2026/03/10', '10/03/2026', '10-3-2026']) {
      expect(validarEncabezado({ ...CASO.encabezado, manifiesto_fecha: f })).toEqual([]);
    }
    expect(validarEncabezado({ ...CASO.encabezado, imp_ciudad: '001' })).toEqual([]);
    expect(validarEncabezado({ ...CASO.encabezado, manifiesto_fecha: '2026-03-11' })).toHaveLength(1);
  });

  it('los mensajes dicen dónde buscar, pero no regalan el código', () => {
    const vacio = validarEncabezado({}).map((e) => e.mensaje).join(' ');
    for (const codigo of ['CTG', 'DEP048', '13001', 'PA', '0457']) expect(vacio).not.toMatch(new RegExp(`\\b${codigo}\\b`));
    expect(vacio).toMatch(/tabla de lugares de ingreso/);
  });

  it('cada código que pide el caso está en su tabla de consulta', () => {
    const e = CASO.encabezado;
    const sub = CASO.subpartida;
    const en = (tabla, codigo) => TABLAS[tabla].filas.some(([c]) => c === codigo);
    expect(en('administraciones', e.administracion) && en('lugares', e.lugar_ingreso) && en('depositos', e.deposito)).toBe(true);
    expect(en('ciudades', e.imp_ciudad) && en('paises', e.exp_pais) && en('paises', e.bandera) && en('modos', e.modo_transporte)).toBe(true);
    expect(en('transportadores', e.transportadora) && en('departamentos', e.depto_destino)).toBe(true);
    expect(en('modalidades', sub.modalidad) && en('embalajes', sub.embalaje) && en('unidades', sub.unidad_comercial)).toBe(true);
    expect(buscarCodigo('paises', 'panama')).toEqual([['PA', 'Panamá']]);
  });

  it('pasa la declaración a las casillas del formulario 500', () => {
    const f = aFormulario500(CASO.encabezado, CASO.subpartida);
    expect(f.subpartida).toBe('8413.60.90.00');
    expect(f.imp_nit).toBe('900123456');
    expect([f.lugar_ingreso, f.bandera, f.modalidad, f.v_fob, f.tasa_arancel]).toEqual(['CTG', 'PA', 'C100', '60000', '5']);
  });
});
