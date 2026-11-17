// Costeo de la exportación según el Incoterm (Incoterms® 2020).
// La cadena de distribución física internacional se divide en conceptos de costo. Para cada
// Incoterm, cada concepto lo paga el vendedor o el comprador. El precio de venta es el valor
// de la mercancía en fábrica (EXW) más los costos que asume el vendedor.
// Supuestos: transporte principal marítimo; en FCA la entrega es en la terminal de origen; en CPT,
// CIP y las reglas D el lugar convenido es la bodega del comprador, y en CFR y CIF, el puerto de destino.
export const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

const desde = (codigo) => INCOTERMS.slice(INCOTERMS.indexOf(codigo));
const solo = (...codigos) => codigos;

// vendedor: Incoterms en los que el concepto lo paga el vendedor. origen: hace parte del valor FOB.
export const CONCEPTOS = [
  { id: 'embalaje', nombre: 'Embalaje y empaque de exportación', etapa: 'Origen', origen: true, vendedor: INCOTERMS,
    nota: 'Lo asume siempre el vendedor: la mercancía se entrega embalada para el transporte.' },
  { id: 'marcado', nombre: 'Marcado y rotulado', etapa: 'Origen', origen: true, vendedor: INCOTERMS },
  { id: 'cargue_fabrica', nombre: 'Cargue en la fábrica', etapa: 'Origen', origen: true, vendedor: desde('FCA'),
    nota: 'En EXW el vendedor no carga la mercancía: la pone a disposición en sus instalaciones.' },
  { id: 'transporte_origen', nombre: 'Transporte interno hasta el puerto', etapa: 'Origen', origen: true, vendedor: desde('FCA') },
  { id: 'documentos', nombre: 'Documentos, certificados y vistos buenos', etapa: 'Origen', origen: true, vendedor: desde('FCA'),
    nota: 'Certificado de origen, fitosanitario, vistos buenos. Desde FCA el despacho de exportación es del vendedor.' },
  { id: 'aduana_origen', nombre: 'Agencia de aduanas y despacho de exportación (SAE y DEX)', etapa: 'Origen', origen: true, vendedor: desde('FCA') },
  { id: 'puerto_origen', nombre: 'Manejo y almacenamiento en el puerto de origen', etapa: 'Origen', origen: true, vendedor: desde('FAS'),
    nota: 'En FCA la entrega es al transportista en la terminal: el manejo posterior es del comprador.' },
  { id: 'cargue_buque', nombre: 'Cargue a bordo del buque', etapa: 'Origen', origen: true, vendedor: desde('FOB'),
    nota: 'En FAS el vendedor entrega al costado del buque; desde FOB entrega a bordo.' },
  { id: 'flete', nombre: 'Flete internacional', etapa: 'Internacional', vendedor: desde('CFR') },
  { id: 'seguro', nombre: 'Seguro internacional', etapa: 'Internacional', vendedor: [...solo('CIF', 'CIP'), ...desde('DAP')],
    nota: 'En CIF y CIP el vendedor está obligado a contratarlo. En las reglas D el riesgo del viaje es suyo, así que le conviene asegurar.' },
  { id: 'descargue_destino', nombre: 'Descargue en el puerto de destino', etapa: 'Destino', vendedor: solo('DPU', 'DDP'),
    nota: 'DPU es la única regla en la que el vendedor entrega la mercancía descargada.' },
  { id: 'puerto_destino', nombre: 'Manejo en el puerto de destino', etapa: 'Destino', vendedor: desde('CPT'),
    nota: 'En CPT y CIP el vendedor paga el transporte hasta el lugar convenido en destino; en CFR y CIF, solo hasta el puerto.' },
  { id: 'transporte_destino', nombre: 'Transporte interno en destino', etapa: 'Destino', vendedor: desde('CPT') },
  { id: 'aduana_destino', nombre: 'Despacho de importación, aranceles e impuestos en destino', etapa: 'Destino', vendedor: solo('DDP'),
    nota: 'Solo en DDP el vendedor paga la importación en el país del comprador.' },
];

export const pagaVendedor = (concepto, incoterm) => concepto.vendedor.includes(incoterm);

const n = (v) => (Number.isFinite(v) ? v : parseFloat(v) || 0);

// valores: { exw, [id del concepto]: USD }
export function costear(valores, incoterm) {
  const exw = n(valores.exw);
  let vendedor = 0;
  let comprador = 0;
  let origen = 0;
  CONCEPTOS.forEach((c) => {
    const v = n(valores[c.id]);
    if (pagaVendedor(c, incoterm)) vendedor += v; else comprador += v;
    if (c.origen) origen += v;
  });
  return {
    incoterm,
    exw,
    costosVendedor: vendedor,
    costosComprador: comprador,
    // Lo que se le factura al comprador y lo que debe reintegrarse por el mercado cambiario
    precio: exw + vendedor,
    // La DEX siempre declara el valor FOB, sea cual sea el Incoterm de la venta
    fob: exw + origen,
    // Lo que le cuesta la mercancía puesta en la bodega del comprador, pague quien pague
    costoTotal: exw + vendedor + comprador,
  };
}

export const compararIncoterms = (valores) => INCOTERMS.map((i) => costear(valores, i));
