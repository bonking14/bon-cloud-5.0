// Constancia de práctica en PDF. Se genera en el navegador a partir del progreso,
// por eso no es una certificación y así lo dice el documento.
export async function descargarConstancia(nombre, totalLecciones) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const centro = (texto, y) => doc.text(texto, W / 2, y, { align: 'center' });
  const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  doc.setDrawColor(30, 58, 107);
  doc.setLineWidth(10);
  doc.rect(20, 20, W - 40, H - 40);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 107);
  doc.setFontSize(30);
  centro('BonCloud', 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  centro('Plataforma de aprendizaje en comercio exterior — Puerto de Cartagena', 124);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(29, 78, 216);
  centro('Constancia de práctica', 190);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  centro('BonCloud deja constancia de que', 232);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  centro(nombre, 276);
  const ancho = Math.min(doc.getTextWidth(nombre) + 40, W - 160);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(2);
  doc.line(W / 2 - ancho / 2, 288, W / 2 + ancho / 2, 288);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(`completó las ${totalLecciones} lecciones de la Ruta de Aprendizaje de Comercio Internacional sobre el proceso de importación por el Puerto de Cartagena.`, 520), W / 2, 330, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(doc.splitTextToSize('Documento educativo generado automáticamente por BonCloud. No es una certificación oficial de la DIAN, del SENA ni de ninguna otra entidad.', 520), W / 2, 400, { align: 'center' });
  doc.setFontSize(11);
  centro(`Cartagena, Colombia — ${fecha}`, 460);

  doc.save(`Constancia_BonCloud_${nombre.replace(/[^\wÁÉÍÓÚÑáéíóúñ]+/g, '_')}.pdf`);
}
