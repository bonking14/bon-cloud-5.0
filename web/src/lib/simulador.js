// Simulador de importación BonCloud: cálculo puro (sin DOM).
// Estima valor en aduana, tributos, gastos locales, tiempos y riesgos de una
// importación por el Puerto de Cartagena con reglas de referencia: sirve para
// aprender y comparar escenarios, no reemplaza una cotización ni una liquidación oficial.

// ───────── Parámetros de referencia ─────────
export const SIM_REGIONES = {
  'China': 'asia', 'Japón': 'asia', 'Corea del Sur': 'asia', 'Taiwán': 'asia', 'India': 'asia_sur',
  'Alemania': 'europa', 'España': 'europa', 'Italia': 'europa', 'Francia': 'europa', 'Reino Unido': 'europa', 'Turquía': 'europa',
  'Estados Unidos': 'norteamerica', 'Canadá': 'norteamerica', 'México': 'norteamerica',
  'Brasil': 'suramerica'
};

// Flete marítimo de referencia hasta Cartagena (USD). Contenedores por unidad;
// carga suelta, granel y proyecto por tonelada, con un mínimo.
export const SIM_FLETES = {
  asia:         { '20': 3500, '40': 5000, tonelada: 120, minimo: 400, transito: [30, 40] },
  asia_sur:     { '20': 3000, '40': 4500, tonelada: 110, minimo: 400, transito: [32, 45] },
  europa:       { '20': 2500, '40': 3500, tonelada: 90,  minimo: 300, transito: [15, 22] },
  norteamerica: { '20': 1500, '40': 2200, tonelada: 70,  minimo: 250, transito: [5, 12] },
  suramerica:   { '20': 2000, '40': 3000, tonelada: 80,  minimo: 250, transito: [12, 20] }
};

// Países de la lista con acuerdo comercial vigente con Colombia
// (preferencia arancelaria si se demuestra el origen).
export const SIM_ACUERDOS = {
  'Estados Unidos': 'TLC Colombia–Estados Unidos',
  'Canadá': 'TLC Colombia–Canadá',
  'México': 'TLC Colombia–México (G-2)',
  'Corea del Sur': 'TLC Colombia–Corea',
  'Alemania': 'Acuerdo Comercial con la Unión Europea',
  'España': 'Acuerdo Comercial con la Unión Europea',
  'Italia': 'Acuerdo Comercial con la Unión Europea',
  'Francia': 'Acuerdo Comercial con la Unión Europea',
  'Reino Unido': 'Acuerdo Comercial Colombia–Reino Unido',
  'Brasil': 'Acuerdo de Complementación Económica con Mercosur (ACE 72)'
};

// Gastos locales de referencia en COP (cotiza siempre los reales)
export const SIM_TERMINAL_COP = { '20': 1200000, '40': 1600000, tonelada: 60000, minimo: 400000 };
export const SIM_AGENCIA_COP = { porcentaje: 0.002, minimo: 900000 };
export const SIM_SEGURO_SUPUESTO = 0.005; // 0,5% del valor si no se escribe la prima real

// Qué pasa con los tributos según el régimen
export const SIM_REGIMENES = {
  'Importación ordinaria': 'pagan',
  'Importación para transformación o ensamble': 'pagan',
  'Tráfico postal y envíos urgentes': 'pagan',
  'Importación con franquicia': 'exentos',
  'Reimportación en el mismo estado': 'exentos',
  'Reimportación por perfeccionamiento pasivo': 'valor_agregado',
  'Importación temporal para reexportación en el mismo estado': 'suspendidos',
  'Importación temporal para perfeccionamiento activo': 'suspendidos'
};

// ───────── Utilidades ─────────
export function simNum(valor) {
  const n = parseFloat(String(valor == null ? '' : valor).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}
export const simMiles = (v) => Math.round(v / 1000) * 1000;
export const simUSD = (v) => 'USD ' + (v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const simCOP = (v) => '$' + Math.round(v || 0).toLocaleString('es-CO') + ' COP';

// ───────── Cálculo ─────────
export function simularOperacion(d) {
  const region = SIM_REGIONES[d.pais_origen] || 'asia';
  const tarifas = SIM_FLETES[region];
  const toneladas = Math.max(d.peso_kg, 0) / 1000;
  const esContenedor = d.tipo_carga === 'Contenedor 20ft' || d.tipo_carga === 'Contenedor 40ft';
  const tamano = d.tipo_carga === 'Contenedor 40ft' ? '40' : '20';
  const incoterm = d.incoterm;

  // 1. Flete y seguro: los que escribió el usuario o los de referencia
  const fleteEstimado = esContenedor ? tarifas[tamano] : Math.max(tarifas.minimo, Math.round(toneladas * tarifas.tonelada));
  const incluyeFlete = ['CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'].includes(incoterm);
  const incluyeSeguro = ['CIF', 'CIP', 'DAP', 'DPU', 'DDP'].includes(incoterm);
  const flete = incluyeFlete ? 0 : (d.flete_usd > 0 ? d.flete_usd : fleteEstimado);
  const fleteSupuesto = !incluyeFlete && !(d.flete_usd > 0);
  const seguro = incluyeSeguro ? 0 : (d.seguro_usd > 0 ? d.seguro_usd : d.valor_usd * SIM_SEGURO_SUPUESTO);
  const seguroSupuesto = !incluyeSeguro && !(d.seguro_usd > 0);
  // En EXW el comprador también paga la carga y el despacho en origen
  const gastosOrigen = incoterm === 'EXW' ? Math.max(250, Math.round(d.valor_usd * 0.01)) : 0;

  const valorAduanaUSD = d.valor_usd + gastosOrigen + flete + seguro;
  const valorAduanaCOP = valorAduanaUSD * d.trm;

  // 2. Tributos según el régimen
  const tratamiento = SIM_REGIMENES[d.regimen] || 'pagan';
  const arancelLiquidado = simMiles(valorAduanaCOP * d.arancel / 100);
  const ivaLiquidado = simMiles((valorAduanaCOP + arancelLiquidado) * d.iva / 100);
  let arancel = 0, iva = 0, suspendidos = 0, notaTributos = '';
  if (tratamiento === 'pagan') {
    arancel = arancelLiquidado; iva = ivaLiquidado;
  } else if (tratamiento === 'suspendidos') {
    suspendidos = arancelLiquidado + ivaLiquidado;
    notaTributos = 'Tributos suspendidos: no se pagan mientras la mercancía cumpla las condiciones del régimen, pero se garantizan ante la DIAN.';
  } else if (tratamiento === 'valor_agregado') {
    notaTributos = 'En la reimportación por perfeccionamiento pasivo los tributos se liquidan sobre el valor agregado en el exterior (la reparación o transformación), no sobre todo el valor. Este simulador no lo calcula.';
  } else {
    notaTributos = 'Este cálculo supone que el régimen exonera arancel e IVA. Verifica la norma que lo concede y sus condiciones.';
  }
  if (incoterm === 'DDP' && tratamiento === 'pagan') {
    notaTributos = 'En DDP los tributos los paga el vendedor, aunque la declaración se liquida igual. Se muestran para que sepas cuánto está asumiendo.';
  }
  const tributosImportador = incoterm === 'DDP' ? 0 : arancel + iva;
  const primaGarantia = suspendidos * 0.015;

  // 3. Gastos locales de referencia
  const terminal = esContenedor ? SIM_TERMINAL_COP[tamano] : Math.max(SIM_TERMINAL_COP.minimo, Math.round(toneladas * SIM_TERMINAL_COP.tonelada));
  const agencia = d.usa_agencia ? Math.max(SIM_AGENCIA_COP.minimo, Math.round(valorAduanaCOP * SIM_AGENCIA_COP.porcentaje)) : 0;

  const totalPagarCOP = tributosImportador + primaGarantia + terminal + agencia;
  const costoTotalCOP = (d.valor_usd + gastosOrigen + flete + seguro) * d.trm + totalPagarCOP;

  const costos = [
    { concepto: `Valor de la mercancía (${incoterm})`, usd: d.valor_usd },
    gastosOrigen ? { concepto: 'Carga y despacho en origen (estimado, por ser EXW)', usd: gastosOrigen } : null,
    incluyeFlete ? { concepto: 'Flete internacional', nota: `Incluido en el precio ${incoterm}` }
                 : { concepto: fleteSupuesto ? `Flete internacional (referencia ${d.tipo_carga})` : 'Flete internacional', usd: flete },
    incluyeSeguro ? { concepto: 'Seguro internacional', nota: `Incluido en el precio ${incoterm}` }
                  : { concepto: seguroSupuesto ? 'Seguro (estimado: 0,5% del valor; cotiza la prima real)' : 'Seguro internacional', usd: seguro },
    { concepto: 'Valor en aduana (CIF)', usd: valorAduanaUSD, cop: valorAduanaCOP, destacado: true },
    { concepto: `Arancel (${d.arancel}%)`, cop: tratamiento === 'pagan' ? arancel : 0, nota: tratamiento === 'pagan' ? '' : (tratamiento === 'suspendidos' ? 'Suspendido' : 'No se paga') },
    { concepto: `IVA (${d.iva}%)`, cop: tratamiento === 'pagan' ? iva : 0, nota: tratamiento === 'pagan' ? '' : (tratamiento === 'suspendidos' ? 'Suspendido' : 'No se paga') },
    suspendidos ? { concepto: 'Prima de la garantía (supuesto: 1,5% de los tributos suspendidos)', cop: primaGarantia } : null,
    { concepto: `Servicios del terminal portuario (referencia)`, cop: terminal },
    d.usa_agencia ? { concepto: 'Agencia de aduanas (referencia)', cop: agencia } : null,
    { concepto: 'Total a pagar en Colombia (tributos y gastos)', cop: totalPagarCOP, destacado: true },
    { concepto: 'Costo total puesto en el puerto (mercancía + logística + tributos + gastos)', cop: costoTotalCOP, total: true }
  ].filter(Boolean);

  // 4. Tiempos
  const [tMin, tMax] = tarifas.transito;
  const timeline = [];
  if (d.licencia_previa) {
    timeline.push({ etapa: 'Registro o licencia en la VUCE', dias_min: 5, dias_max: 15, descripcion: 'Debe estar aprobada antes de declarar; algunas entidades la exigen antes del embarque.' });
  }
  if (incoterm === 'EXW') {
    timeline.push({ etapa: 'Recogida y despacho de exportación en origen', dias_min: 3, dias_max: 7, descripcion: 'A cargo del comprador por ser EXW.' });
  }
  timeline.push(
    { etapa: 'Tránsito marítimo', dias_min: tMin, dias_max: tMax, descripcion: `Desde ${d.puerto_embarque || d.pais_origen} hasta Cartagena (referencia; depende de la ruta y los transbordos).` },
    { etapa: 'Arribo, descargue y almacenamiento', dias_min: 1, dias_max: 2, descripcion: 'El transportador debe haber transmitido el manifiesto de carga antes del arribo.' },
    { etapa: 'Declaración, pago y levante', dias_min: 1, dias_max: d.primera_importacion ? 7 : 4, descripcion: 'Levante automático en 1 día; si la DIAN ordena inspección documental o física puede tardar varios días más.' },
    { etapa: 'Retiro del puerto y entrega', dias_min: 1, dias_max: 3, descripcion: esContenedor ? 'Luego se devuelve el contenedor vacío dentro de los días libres de la naviera.' : 'Transporte hasta la bodega del importador.' }
  );
  const diasMin = timeline.reduce((t, e) => t + e.dias_min, 0);
  const diasMax = timeline.reduce((t, e) => t + e.dias_max, 0);

  // 5. Riesgos según los datos
  const riesgos = [];
  if (!d.subpartida) riesgos.push({ nivel: 'alto', titulo: 'Subpartida sin definir', descripcion: 'Sin subpartida no hay certeza sobre el arancel, el IVA ni los vistos buenos. Clasifica la mercancía antes de comprar o pide una resolución de clasificación anticipada a la DIAN.' });
  if (d.licencia_previa) riesgos.push({ nivel: 'alto', titulo: 'Requisito previo en la VUCE', descripcion: 'Si el registro o la licencia no están aprobados a tiempo, la mercancía no se puede declarar y genera almacenamiento en el puerto.' });
  if (incoterm === 'EXW') riesgos.push({ nivel: 'alto', titulo: 'EXW: despacho de exportación en origen', descripcion: `El comprador debe hacer el despacho de exportación en ${d.pais_origen}, lo que exige un agente allá. FCA suele ser mejor opción.` });
  if (incoterm === 'DDP') riesgos.push({ nivel: 'alto', titulo: 'DDP: el vendedor declara en Colombia', descripcion: 'El vendedor extranjero necesita un declarante habilitado en Colombia. Si no lo tiene, la mercancía puede quedarse en el puerto.' });
  if ((incoterm === 'FOB' || incoterm === 'CFR' || incoterm === 'CIF') && esContenedor) riesgos.push({ nivel: 'bajo', titulo: `${incoterm} con carga en contenedor`, descripcion: `La ICC recomienda ${incoterm === 'FOB' ? 'FCA' : incoterm === 'CFR' ? 'CPT' : 'CIP'} para contenedores, porque el contenedor se entrega en la terminal antes de subir al buque.` });
  if (d.primera_importacion) riesgos.push({ nivel: 'medio', titulo: 'Primera importación', descripcion: 'Verifica que el RUT tenga la calidad de importador (código 23). Los importadores nuevos tienen más probabilidad de inspección.' });
  if (region === 'asia' || region === 'asia_sur') riesgos.push({ nivel: 'medio', titulo: 'Tránsito largo con transbordos', descripcion: 'Las rutas desde Asia suelen tener transbordo; un retraso puede consumir los días libres del contenedor y generar cobros por demora.' });
  if (d.tipo_carga === 'Carga proyecto' || d.tipo_carga === 'Granel') riesgos.push({ nivel: 'medio', titulo: `Operación de ${d.tipo_carga.toLowerCase()}`, descripcion: 'Requiere coordinación previa con el terminal (equipos, muelle y ventana de atraque). Los valores de referencia de este simulador son solo orientativos.' });
  riesgos.push({ nivel: 'medio', titulo: 'Variación de la TRM', descripcion: 'Los tributos se liquidan con la TRM del último día hábil de la semana anterior a la declaración; la cifra de hoy puede cambiar.' });

  // 6. Documentos
  const acuerdo = SIM_ACUERDOS[d.pais_origen];
  const documentos = [
    { nombre: 'Factura comercial', obligatorio: true, entidad: 'Proveedor' },
    { nombre: 'Documento de transporte (B/L)', obligatorio: true, entidad: 'Naviera o agente de carga' },
    { nombre: 'Lista de empaque', obligatorio: true, entidad: 'Proveedor' },
    { nombre: 'Póliza o certificado de seguro', obligatorio: false, entidad: incluyeSeguro ? 'Vendedor' : 'Importador' },
    { nombre: 'Declaración Andina del Valor (formulario 560)', obligatorio: d.valor_usd >= 5000, entidad: 'Importador (obligatoria desde USD 5.000 FOB)' },
    { nombre: 'Declaración de importación (formulario 500)', obligatorio: true, entidad: 'Importador o agencia de aduanas' },
    { nombre: acuerdo ? `Prueba de origen para el ${acuerdo}` : 'Certificado de origen', obligatorio: false, entidad: acuerdo ? 'Solo si se pide la preferencia arancelaria' : 'No hay acuerdo comercial con este origen' },
    { nombre: 'Registro o licencia de importación', obligatorio: !!d.licencia_previa, entidad: 'VUCE' },
    { nombre: 'Mandato aduanero', obligatorio: !!d.usa_agencia, entidad: 'Si actúa una agencia de aduanas' }
  ];

  const resumen = `Importación de "${d.descripcion_mercancia}" desde ${d.pais_origen} en ${incoterm}, por ${d.tipo_carga.toLowerCase()}. ` +
    `El valor en aduana estimado es ${simUSD(valorAduanaUSD)} (${simCOP(valorAduanaCOP)} con TRM ${d.trm.toLocaleString('es-CO')}). ` +
    (tratamiento === 'pagan' && incoterm !== 'DDP' ? `Los tributos suman ${simCOP(arancel + iva)} y ` : '') +
    `el total a pagar en Colombia se estima en ${simCOP(totalPagarCOP)}. ` +
    `La operación tomaría entre ${diasMin} y ${diasMax} días desde el embarque hasta la entrega.`;

  return {
    costos, timeline, riesgos, documentos, resumen, notaTributos,
    trm: d.trm, dias: [diasMin, diasMax], acuerdo
  };
}
