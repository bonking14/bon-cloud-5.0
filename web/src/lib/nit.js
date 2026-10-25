// Dígito de verificación del NIT (algoritmo de módulo 11 de la DIAN).
// Antes había tres versiones distintas en los formularios 001, 500 y 560;
// la del 001 devolvía NaN si el NIT traía puntos o guiones.
const PESOS = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];

export function digitoVerificacion(nit) {
  const limpio = String(nit ?? '').replace(/[^0-9]/g, '').substring(0, 15);
  if (!limpio) return '';
  const str = limpio.padStart(15, '0');
  let suma = 0;
  for (let i = 0; i < 15; i++) suma += Number(str[i]) * PESOS[i];
  const residuo = suma % 11;
  return residuo > 1 ? 11 - residuo : residuo;
}
