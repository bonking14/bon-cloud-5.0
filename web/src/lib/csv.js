// Archivo CSV que Excel abre bien en español: separado por punto y coma y con marca BOM
// para que respete las tildes.
const celda = (v) => {
  let t = v === null || v === undefined ? '' : String(v);
  // Un texto que empieza por = + - @ Excel lo ejecuta como fórmula: se le antepone un apóstrofo
  if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
  return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

export const aCsv = (filas) => `﻿${filas.map((f) => f.map(celda).join(';')).join('\r\n')}\r\n`;

export function descargarTexto(nombre, texto, tipo) {
  const url = URL.createObjectURL(new Blob([texto], { type: tipo }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const descargarCsv = (nombre, filas) => descargarTexto(nombre, aCsv(filas), 'text/csv;charset=utf-8');
