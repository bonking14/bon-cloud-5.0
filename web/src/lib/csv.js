// Archivo CSV que Excel abre bien en español: separado por punto y coma y con marca BOM
// para que respete las tildes.
const celda = (v) => {
  let t = v === null || v === undefined ? '' : String(v);
  // Un texto que empieza por = + - @ Excel lo ejecuta como fórmula: se le antepone un apóstrofo
  if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
  return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

export const aCsv = (filas) => `﻿${filas.map((f) => f.map(celda).join(';')).join('\r\n')}\r\n`;

export function descargarCsv(nombre, filas) {
  const url = URL.createObjectURL(new Blob([aCsv(filas)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
