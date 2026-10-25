// Utilidades numéricas compartidas por calculadoras, simulador y formularios.

// Acepta "60000", "60,000" (formato del campo), "60.000" (formato colombiano),
// "4,100.50" y "4.100,50".
export function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  let str = String(value).trim().replace(/[^0-9.,-]/g, '');
  const tieneComa = str.includes(',');
  const tienePunto = str.includes('.');
  if (tieneComa && tienePunto) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      str = str.replace(/\./g, '').replace(',', '.'); // 4.100,50
    } else {
      str = str.replace(/,/g, ''); // 4,100.50
    }
  } else if (tieneComa) {
    str = /^-?\d{1,3}(,\d{3})+$/.test(str)
      ? str.replace(/,/g, '') // 60,000
      : str.replace(',', '.'); // 0,5
  } else if (tienePunto) {
    if (/^-?\d{1,3}(\.\d{3})+$/.test(str) && !/^-?0\./.test(str)) {
      str = str.replace(/\./g, ''); // 60.000
    }
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// La DIAN aproxima cada tributo al múltiplo de mil más cercano
export function aMiles(valor) {
  return Math.round(valor / 1000) * 1000;
}

export function formatUSD(valor) {
  return `USD ${(valor || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCOP(valor) {
  return `COP ${Math.round(valor || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

// Formato mientras se escribe: agrega separador de miles con coma ("125000" -> "125,000")
export function formatearMientrasEscribe(texto) {
  const raw = String(texto).replace(/[^0-9.]/g, '');
  if (!raw) return '';
  const partes = raw.split('.');
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return partes.join('.');
}
