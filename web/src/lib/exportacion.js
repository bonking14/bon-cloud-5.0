// En la exportación se declara el valor FOB. El flete y el seguro solo cuentan
// si la venta se pactó con un Incoterm que los incluye (CFR, CIF, CPT, CIP...).
// La exportación de bienes no paga arancel y está exenta de IVA (art. 481 E.T.).
export function calcularExportacion(v) {
  const fleteSeguro = (v.flete || 0) + (v.seguro || 0);
  return {
    fob: v.fob,
    flete: v.flete || 0,
    seguro: v.seguro || 0,
    valorVenta: v.fob + fleteSeguro,
    incluyeFleteSeguro: fleteSeguro > 0,
    fobCOP: Math.round(v.fob * v.trm),
    trm: v.trm,
    meses: v.meses || 0,
  };
}
