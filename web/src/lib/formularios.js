// Cálculos de los formularios DIAN de práctica (sin DOM).
import { aMiles } from './numeros.js';

const n = (v) => parseFloat(v) || 0;

// Formulario 500 (numeración del formulario oficial): valor en aduana y autoliquidación.
//   84 valor en aduana USD = 78 FOB + 82 (79 fletes + 80 seguros + 81 otros gastos) + 83 ajuste
//   93 base arancel = 84 × 58 tasa de cambio · 98 base IVA = 93 + 94 arancel
// Cada concepto tiene: base, total liquidado, total a pagar con esta declaración y total en USD.
export function calcular500(v) {
  const fob = n(v.v_fob);
  const gastos = n(v.v_fletes) + n(v.v_seguros) + n(v.v_otros);
  // El ajuste (casilla 83) puede ser negativo cuando es una deducción
  const aduanaUSD = fob + gastos + n(v.v_ajuste);
  const tasa = n(v.tasa_cambio);
  const aduanaCOP = aduanaUSD * tasa;
  // Arancel y medidas de defensa comercial: base = valor en aduana en pesos
  const arancel = aMiles(aduanaCOP * n(v.tasa_arancel) / 100);
  const salvaguardia = aMiles(aduanaCOP * n(v.tasa_salva) / 100);
  const compensatorios = aMiles(aduanaCOP * n(v.tasa_comp) / 100);
  const antidumping = aMiles(aduanaCOP * n(v.tasa_anti) / 100);
  // IVA: base = valor en aduana + arancel (art. 459 E.T.). Los recargos antidumping y
  // de salvaguardia no son derechos de aduana y no se suman (Concepto DIAN 626 de 2020).
  const baseIVA = aduanaCOP + arancel;
  const iva = aMiles(baseIVA * n(v.tasa_iva) / 100);
  const sancion = n(v.total_sancion);
  const rescate = n(v.total_rescate);
  const total = arancel + iva + salvaguardia + compensatorios + antidumping + sancion + rescate;
  return {
    fob, gastos, aduanaUSD, aduanaCOP,
    arancel, salvaguardia, compensatorios, antidumping, baseIVA, iva, sancion, rescate,
    // Casilla 125: total liquidado · 126: su equivalente en dólares
    total, totalUSD: tasa ? total / tasa : 0,
    // Casilla 980: lo que se paga con esta declaración, descontados los pagos anteriores (127)
    pago: Math.max(0, total - n(v.pagos_anteriores)),
    requiereDAV: fob >= 5000,
  };
}

// Formulario 600: en la exportación se declara el valor FOB (casilla 72). La casilla 76,
// valor total de las exportaciones, le suma fletes (73), seguros (74) y otros gastos (75).
export function calcular600(v) {
  const fob = n(v.t_fob);
  return { fob, total: fob + n(v.t_fletes) + n(v.t_seguros) + n(v.t_otros) };
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

// Formulario 001: composición del capital. El capital nacional (82) se reparte en público (83)
// y privado (84), y el extranjero (85) en público (86) y privado (87); nacional más
// extranjero no puede pasar del 100%.
export function sumaCapital(v) {
  const total = n(v.porc_82) + n(v.porc_85);
  return { total, excede: total > 100 };
}

// Campos obligatorios vacíos de una lista [[nombre, descripción], ...]
export function faltantes(v, obligatorios) {
  return obligatorios.filter(([nombre]) => !String(v[nombre] ?? '').trim());
}
