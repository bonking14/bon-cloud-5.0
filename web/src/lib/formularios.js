// Cálculos de los formularios DIAN de práctica (sin DOM).
import { aMiles } from './numeros.js';

const n = (v) => parseFloat(v) || 0;

// Ítems de mercancía (formularios 500 y 600): total por línea = cantidad × FOB unitario
export function totalesItems(items) {
  const lineas = items.map((it) => n(it.cantidad) * n(it.fobUnitario));
  return { lineas, suma: lineas.reduce((t, x) => t + x, 0) };
}

// Formulario 500: valor en aduana y autoliquidación.
// Si los ítems tienen valores, el FOB (casilla 65) se toma de su suma.
export function calcular500(v) {
  const { lineas, suma } = totalesItems(v.items);
  const fob = suma > 0 ? suma : n(v.v_fob);
  const aduanaUSD = fob + n(v.v_fletes) + n(v.v_seguros) + n(v.v_otros);
  const aduanaCOP = aduanaUSD * n(v.tasa_cambio);
  // Arancel, salvaguardia y antidumping: base = valor en aduana en pesos
  const arancel = aMiles(aduanaCOP * n(v.tasa_arancel) / 100);
  const salvaguardia = aMiles(aduanaCOP * n(v.tasa_salva) / 100);
  const antidumping = aMiles(aduanaCOP * n(v.tasa_anti) / 100);
  // IVA: base = valor en aduana + arancel (art. 459 E.T.). Los recargos antidumping y
  // de salvaguardia no son derechos de aduana y no se suman (Concepto DIAN 626 de 2020).
  const baseIVA = aduanaCOP + arancel;
  const iva = aMiles(baseIVA * n(v.tasa_iva) / 100);
  return {
    lineas, fobDesdeItems: suma > 0, fob, aduanaUSD, aduanaCOP,
    arancel, salvaguardia, antidumping, baseIVA, iva,
    total: arancel + salvaguardia + antidumping + iva + n(v.total_sancion),
    requiereDAV: fob >= 5000,
  };
}

// Formulario 600: en la exportación se declara el FOB; la casilla 51 es el valor
// total de la venta según el Incoterm.
export function calcular600(v) {
  const { lineas, suma } = totalesItems(v.items);
  const fob = suma > 0 ? suma : n(v.t_fob);
  return { lineas, fobDesdeItems: suma > 0, fob, valorIncoterm: fob + n(v.t_fletes) + n(v.t_seguros) + n(v.t_otros) };
}

// Formulario 560 (DAV), columna USD:
// 97 = 94 + 96 · 123 = adiciones · 134 = deducciones · 135 = 97 + 123 − 134
export const CASILLAS_ADICIONES = [99, 101, 103, 105, 107, 109, 111, 113, 116, 118, 120, 122];
export const CASILLAS_DEDUCCIONES = [125, 127, 129, 131, 133];

export function calcularDAV(v) {
  const c = (num) => n(v[`v${num}`]);
  const precio = c(94) + c(96);
  const adiciones = CASILLAS_ADICIONES.reduce((t, num) => t + c(num), 0);
  const deducciones = CASILLAS_DEDUCCIONES.reduce((t, num) => t + c(num), 0);
  return { 97: precio, 123: adiciones, 134: deducciones, 135: precio + adiciones - deducciones };
}

// Formulario 001: la composición del capital (casillas 82 a 87) no puede pasar del 100%
export function sumaCapital(v) {
  let total = 0;
  for (let i = 82; i <= 87; i++) total += n(v[`porc_${i}`]);
  return { total, excede: total > 100 };
}

// Campos obligatorios vacíos de una lista [[nombre, descripción], ...]
export function faltantes(v, obligatorios) {
  return obligatorios.filter(([nombre]) => !String(v[nombre] ?? '').trim());
}
