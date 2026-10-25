// Liquidación de tributos de importación (sin cambios respecto a la versión vanilla).
import { aMiles } from './numeros.js';

export const IVA_GENERAL = 0.19;
// Supuesto de práctica si no se escribe la prima. En una declaración real el seguro se
// soporta con la póliza o, si no se contrató, con la cotización de la prima habitual
// de una aseguradora (art. 340 de la Resolución DIAN 46 de 2019).
export const SEGURO_SUPUESTO = 0.005;
export const PRIMA_GARANTIA = 0.015; // supuesto de prima de la póliza en temporal corto plazo

function valorEnAduana(v) {
  const seguroSupuesto = !(v.seguro > 0);
  const seguro = seguroSupuesto ? v.fob * SEGURO_SUPUESTO : v.seguro;
  const cifUSD = v.fob + v.flete + seguro;
  return { seguro, seguroSupuesto, cifUSD, baseArancelariaCOP: cifUSD * v.trm };
}

function tributos(baseArancelariaCOP, arancelPct) {
  const totalArancel = aMiles(baseArancelariaCOP * (arancelPct / 100));
  const baseIVA = baseArancelariaCOP + totalArancel;
  const totalIVA = aMiles(baseIVA * IVA_GENERAL);
  return { totalArancel, baseIVA, totalIVA };
}

const gastosLocales = (v) => (v.agencia || 0) + (v.bodegaje || 0) + (v.transporte || 0);

export function calcularOrdinaria(v) {
  const { seguro, seguroSupuesto, cifUSD, baseArancelariaCOP } = valorEnAduana(v);
  const { totalArancel, baseIVA, totalIVA } = tributos(baseArancelariaCOP, v.arancel);
  const totalImpuestos = totalArancel + totalIVA;
  const gastosNac = gastosLocales(v);
  return {
    fob: v.fob, flete: v.flete, seguro, seguroSupuesto, cifUSD, arancelPorcentaje: v.arancel, trm: v.trm,
    baseArancelariaCOP: Math.round(baseArancelariaCOP), totalArancel: Math.round(totalArancel),
    baseIVA: Math.round(baseIVA), totalIVA: Math.round(totalIVA),
    totalImpuestos: Math.round(totalImpuestos), gastosNacionalizacion: Math.round(gastosNac),
    totalPagar: Math.round(totalImpuestos + gastosNac),
  };
}

// Franquicia total: la norma que la concede exonera arancel e IVA.
// Solo se pagan los gastos de nacionalización.
export function calcularFranquicia(v) {
  const { seguro, seguroSupuesto, cifUSD, baseArancelariaCOP } = valorEnAduana(v);
  const gastos = gastosLocales(v);
  return {
    fob: v.fob, flete: v.flete, seguro, seguroSupuesto, cifUSD,
    baseArancelariaCOP: Math.round(baseArancelariaCOP),
    gastos: Math.round(gastos), totalPagar: Math.round(gastos), trm: v.trm,
  };
}

// Temporal para reexportación en el mismo estado (corto plazo): los tributos
// se suspenden y se respaldan con una garantía; se paga la prima y los gastos.
export function calcularTemporalCorto(v) {
  const { seguro, seguroSupuesto, cifUSD, baseArancelariaCOP } = valorEnAduana(v);
  const { totalArancel, totalIVA } = tributos(baseArancelariaCOP, v.arancel);
  const tributosSuspendidos = totalArancel + totalIVA;
  const poliza = tributosSuspendidos * PRIMA_GARANTIA;
  const gastos = gastosLocales(v);
  return {
    fob: v.fob, flete: v.flete, seguro, seguroSupuesto, cifUSD, arancelPorcentaje: v.arancel, trm: v.trm,
    baseArancelariaCOP: Math.round(baseArancelariaCOP), tributosSuspendidos: Math.round(tributosSuspendidos),
    poliza: Math.round(poliza), gastos: Math.round(gastos),
    totalPagar: Math.round(gastos + poliza),
  };
}
