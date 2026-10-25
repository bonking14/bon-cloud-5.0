import { simUSD, simCOP } from '../../lib/simulador.js';

const AZUL = [30, 58, 95];

// Informe PDF de una simulación (jsPDF + autotable se cargan solo al descargar)
export async function descargarInforme(r) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF();
  const hoy = new Date();
  const titulo = (texto, y) => { doc.setFontSize(12); doc.setTextColor(...AZUL); doc.text(texto, 14, y); };
  const tabla = (y, head, body, extra = {}) => {
    autoTable(doc, { startY: y + 4, head: [head], body, theme: 'grid', headStyles: { fillColor: AZUL }, ...extra });
    return doc.lastAutoTable.finalY + 12;
  };
  let y = 20;

  doc.setFontSize(16); doc.setTextColor(...AZUL); doc.text('BonCloud', 14, y);
  doc.setFontSize(14); doc.setTextColor(50); doc.text('Simulación de importación', 196, y, { align: 'right' });
  y += 6;
  doc.setFontSize(10); doc.setTextColor(100); doc.text(`Fecha: ${hoy.toLocaleDateString('es-CO')}`, 196, y, { align: 'right' });
  y += 14;

  titulo('Resumen', y);
  y += 6;
  doc.setFontSize(10); doc.setTextColor(60);
  const lineas = doc.splitTextToSize(r.resumen, 180);
  doc.text(lineas, 14, y);
  y += lineas.length * 5 + 8;

  titulo('Costos estimados', y);
  y = tabla(y, ['Concepto', 'USD', 'COP'],
    r.costos.map((c) => [c.concepto, c.usd != null ? simUSD(c.usd) : '', c.cop != null ? simCOP(c.cop) : (c.nota || '')]),
    { didParseCell: (cell) => {
      const fila = r.costos[cell.row.index];
      if (cell.section === 'body' && fila && (fila.total || fila.destacado)) cell.cell.styles.fontStyle = 'bold';
    } });

  titulo('Tiempos', y);
  y = tabla(y, ['Etapa', 'Días mín.', 'Días máx.', 'Descripción'], r.timeline.map((t) => [t.etapa, t.dias_min, t.dias_max, t.descripcion]));

  titulo('Riesgos', y);
  const colores = { ALTO: [252, 165, 165], MEDIO: [253, 230, 138], BAJO: [134, 239, 172] };
  y = tabla(y, ['Nivel', 'Riesgo', 'Descripción'], r.riesgos.map((x) => [x.nivel.toUpperCase(), x.titulo, x.descripcion]), {
    didParseCell: (cell) => {
      if (cell.section === 'body' && cell.column.index === 0) {
        if (colores[cell.cell.raw]) cell.cell.styles.fillColor = colores[cell.cell.raw];
        cell.cell.styles.fontStyle = 'bold';
      }
    },
  });

  titulo('Documentos', y);
  tabla(y, ['Documento', 'Obligatorio', 'Observación'], r.documentos.map((d) => [d.nombre, d.obligatorio ? 'Sí' : 'No', d.entidad]));

  const paginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(150);
    doc.text('Simulación educativa con valores de referencia. Confirme tarifas, fletes y requisitos antes de operar. | BonCloud', 105, 290, { align: 'center' });
  }
  doc.save(`simulacion-boncloud-${hoy.toISOString().slice(0, 10).replace(/-/g, '')}.pdf`);
}
