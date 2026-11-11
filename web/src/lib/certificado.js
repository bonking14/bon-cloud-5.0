// Certificado en PDF con código y QR de verificación. El certificado lo emite el servidor
// cuando se aprueban los exámenes de todos los módulos; aquí solo se dibuja.
export const urlVerificacion = (codigo) => `${window.location.href.split('#')[0]}#/verificar/${codigo}`;

export async function descargarCertificado({ codigo, nombre, nota, emitidoEn }, modulos) {
  const [{ jsPDF }, QR] = await Promise.all([import('jspdf'), import('qrcode')]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const centro = (texto, y) => doc.text(texto, W / 2, y, { align: 'center' });
  const fecha = new Date(emitidoEn).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const url = urlVerificacion(codigo);

  doc.setDrawColor(30, 58, 107);
  doc.setLineWidth(10);
  doc.rect(20, 20, W - 40, H - 40);
  doc.setLineWidth(1);
  doc.rect(34, 34, W - 68, H - 68);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 107);
  doc.setFontSize(30);
  centro('BonCloud', 96);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  centro('Plataforma de aprendizaje en comercio exterior — Puerto de Cartagena', 118);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(29, 78, 216);
  centro('Certificado de aprobación', 176);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  centro('BonCloud certifica que', 212);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  centro(nombre, 252);
  const ancho = Math.min(doc.getTextWidth(nombre) + 40, W - 160);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(2);
  doc.line(W / 2 - ancho / 2, 264, W / 2 + ancho / 2, 264);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(`aprobó los exámenes finales de la Ruta de Aprendizaje de Comercio Internacional (${modulos.join(', ')}) con una nota promedio de ${nota} sobre 100.`, 520), W / 2, 300, { align: 'center' });
  doc.setFontSize(11);
  centro(`Cartagena, Colombia — ${fecha}`, 372);

  // Verificación: código y QR que llevan a la página pública
  const qr = await QR.toDataURL(url, { margin: 1, width: 240 });
  doc.addImage(qr, 'PNG', 70, H - 190, 96, 96);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`Código de verificación: ${codigo}`, 180, H - 150);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(doc.splitTextToSize(`Compruebe este certificado escaneando el código QR o en ${url}`, 480), 180, H - 132);
  doc.text(doc.splitTextToSize('Certificado de un curso educativo de BonCloud. No es un título ni una certificación oficial de la DIAN, del SENA ni de ninguna otra entidad.', 480), 180, H - 104);

  doc.save(`Certificado_BonCloud_${nombre.replace(/[^\wÁÉÍÓÚÑáéíóúñ]+/g, '_')}.pdf`);
}
