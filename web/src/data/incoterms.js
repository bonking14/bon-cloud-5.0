// Incoterms® 2020 (ICC): datos de las 11 reglas y columnas de la tabla de responsabilidades.

export const incoterms = [
  {
    code: 'EXW', nombre: 'Ex Works', lugar: 'En fábrica del vendedor',
    tipo: ['multimodal', 'comprador'],
    desc: 'El vendedor pone la mercancía a disposición en sus instalaciones, sin cargarla. El comprador asume todos los costos y riesgos desde ese punto, incluido el despacho de exportación.',
    // riskPoint: fracción 0-1 donde la bandera cambia de mano
    riskPoint: 0.05,
    // etapas que paga el vendedor (para colorear el camino)
    vendedorHasta: 0.05,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'Si un colombiano vende EXW, el comprador extranjero tendría que hacer el despacho de exportación ante la DIAN, algo difícil sin presencia en Colombia. Para compras en el exterior pasa lo mismo al revés.',
    responsabilidades: {
      'Transporte origen':'Comprador','Aduana exportación':'Comprador',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'FCA', nombre: 'Free Carrier', lugar: 'Transportista en origen',
    tipo: ['multimodal'],
    desc: 'El vendedor entrega la mercancía, despachada para exportación, al transportista designado por el comprador en el lugar acordado. Sirve para cualquier modo de transporte.',
    riskPoint: 0.22, vendedorHasta: 0.22,
    etapas: ['Fábrica','Transportista','Océano','Puerto destino','Almacén'],
    notaCO: 'La ICC lo recomienda en lugar de FOB para carga en contenedor, porque el contenedor se entrega en la terminal antes de subir al buque.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'FAS', nombre: 'Free Alongside Ship', lugar: 'Al costado del buque',
    tipo: ['maritimo'],
    desc: 'El vendedor entrega la mercancía, despachada para exportación, al costado del buque en el puerto de embarque. Solo para transporte marítimo o fluvial.',
    riskPoint: 0.35, vendedorHasta: 0.35,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'Se usa sobre todo con carga a granel o carga pesada que se entrega en el muelle; no es adecuado para contenedores.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'FOB', nombre: 'Free On Board', lugar: 'A bordo del buque',
    tipo: ['maritimo'],
    desc: 'El vendedor entrega la mercancía, despachada para exportación, a bordo del buque que designa el comprador. El riesgo pasa cuando la mercancía queda a bordo.',
    riskPoint: 0.42, vendedorHasta: 0.42,
    etapas: ['Fábrica','Puerto origen','A bordo','Puerto destino','Almacén'],
    notaCO: 'Muy usado en compras a Asia. Para llegar al valor en aduana en Colombia se suman el flete y el seguro que paga el comprador.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Comprador','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'CFR', nombre: 'Cost and Freight', lugar: 'Puerto de destino',
    tipo: ['maritimo', 'vendedor'],
    desc: 'El vendedor paga el flete hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía queda a bordo en origen. Nadie está obligado a asegurar; normalmente lo hace el comprador.',
    riskPoint: 0.42, vendedorHasta: 0.75,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'El importador colombiano suma al precio CFR el seguro que haya contratado para llegar al valor en aduana.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'CIF', nombre: 'Cost, Insurance & Freight', lugar: 'Puerto de destino',
    tipo: ['maritimo', 'vendedor'],
    desc: 'El vendedor paga el flete y un seguro de cobertura mínima (Cláusulas C, 110% del valor) hasta el puerto de destino. El riesgo pasa al comprador cuando la mercancía queda a bordo en origen.',
    riskPoint: 0.42, vendedorHasta: 0.75,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'Un precio CIF ya incluye flete y seguro, así que coincide en la práctica con el valor en aduana, base del arancel y el IVA.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Comprador'
    }
  },
  {
    code: 'CPT', nombre: 'Carriage Paid To', lugar: 'Lugar de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor paga el transporte hasta el lugar de destino convenido, pero el riesgo pasa al comprador cuando entrega la mercancía al primer transportista.',
    riskPoint: 0.22, vendedorHasta: 0.82,
    etapas: ['Fábrica','Transportista','Tránsito','Destino','Almacén'],
    notaCO: 'Alternativa multimodal a CFR para carga aérea o combinada.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Comprador',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'CIP', nombre: 'Carriage & Insurance Paid', lugar: 'Lugar de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'Como CPT, pero el vendedor además contrata un seguro de cobertura amplia (Cláusulas A del Instituto) por el 110% del valor. El riesgo pasa al entregar al primer transportista.',
    riskPoint: 0.22, vendedorHasta: 0.82,
    etapas: ['Fábrica','Transportista','Tránsito','Destino','Almacén'],
    notaCO: 'Útil para carga aérea o multimodal de alto valor, porque exige una cobertura de seguro más amplia que CIF.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'DAP', nombre: 'Delivered At Place', lugar: 'Lugar de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor asume costos y riesgos hasta poner la mercancía en el lugar de destino, lista para descargar. El comprador descarga y hace la importación.',
    riskPoint: 0.88, vendedorHasta: 0.88,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Destino'],
    notaCO: 'El importador colombiano paga la descarga, el arancel y el IVA. Para el valor en aduana solo se toman el flete y el seguro hasta el puerto de importación.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'DPU', nombre: 'Delivered at Place Unloaded', lugar: 'Terminal de destino',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor entrega la mercancía descargada en el lugar de destino convenido. El comprador hace la importación.',
    riskPoint: 0.93, vendedorHasta: 0.93,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Descarga'],
    notaCO: 'Es la única regla que obliga al vendedor a descargar en destino, con el riesgo que eso implica. Reemplazó al antiguo DAT.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Comprador','Transporte destino':'Vendedor'
    }
  },
  {
    code: 'DDP', nombre: 'Delivered Duty Paid', lugar: 'Destino final',
    tipo: ['multimodal', 'vendedor'],
    desc: 'El vendedor asume absolutamente todo, incluyendo aranceles e impuestos de importación.',
    riskPoint: 0.98, vendedorHasta: 0.98,
    etapas: ['Fábrica','Puerto origen','Océano','Puerto destino','Almacén'],
    notaCO: 'El vendedor extranjero debe declarar la importación en Colombia y pagar los tributos, lo que exige un declarante habilitado aquí. Poco práctico.',
    responsabilidades: {
      'Transporte origen':'Vendedor','Aduana exportación':'Vendedor',
      'Flete internacional':'Vendedor','Seguro':'Vendedor',
      'Aduana importación':'Vendedor','Transporte destino':'Vendedor'
    }
  }
];

export const columnas = ['Transporte origen','Aduana exportación','Flete internacional','Seguro','Aduana importación','Transporte destino'];
