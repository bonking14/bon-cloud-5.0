// Glosario de comercio exterior y aduanas.

export const glosario = [
  {
    termino: "DIAN",
    nombreCompleto: "Dirección de Impuestos y Aduanas Nacionales",
    categoria: "Entidades",
    definicion: "Autoridad tributaria y aduanera de Colombia. Controla la entrada y salida de mercancías, recauda los tributos aduaneros, aplica la gestión de riesgo (levante automático o inspección) y sanciona las infracciones.",
    ejemplo: "En la importación de las bombas, la DIAN recibe la declaración de importación, verifica el pago del arancel y el IVA, y otorga el levante.",
    relacionado: ["Formulario 500", "Levante de Mercancía", "Nacionalización"],
    moduloBonCloud: "/formularios"
  },
  {
    termino: "CIF",
    nombreCompleto: "Cost, Insurance and Freight",
    categoria: "Incoterms",
    definicion: "El vendedor paga el flete y un seguro de cobertura mínima hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía queda a bordo en origen. En Colombia el valor en aduana, base de los tributos, equivale en la práctica a un valor CIF.",
    ejemplo: "Si compras CIF Cartagena por USD 10.000, ese precio ya incluye flete y seguro: no se vuelven a sumar para calcular el valor en aduana.",
    relacionado: ["FOB", "CFR", "Base Arancelaria", "Valor en Aduana"],
    moduloBonCloud: "/incoterms"
  },
  {
    termino: "FOB",
    nombreCompleto: "Free On Board",
    categoria: "Incoterms",
    definicion: "El vendedor entrega la mercancía, despachada para exportación, a bordo del buque designado por el comprador en el puerto de embarque. Desde que está a bordo, el riesgo y el flete internacional son del comprador. Es una regla solo para transporte marítimo o fluvial; para contenedores la ICC recomienda FCA.",
    ejemplo: "Al comprar FOB Shanghai, tú como importador en Colombia contratas y pagas el flete marítimo hasta Cartagena.",
    relacionado: ["CIF", "CFR", "EXW", "FCA"],
    moduloBonCloud: "/incoterms"
  },
  {
    termino: "EXW",
    nombreCompleto: "Ex Works (En Fábrica)",
    categoria: "Incoterms",
    definicion: "El vendedor pone la mercancía a disposición del comprador en sus propias instalaciones. El comprador asume todos los costos y riesgos desde la fábrica de origen.",
    ejemplo: "Comprar EXW en Stuttgart implica cargar la mercancía en la fábrica, hacer el despacho de exportación en Alemania y contratar el transporte internacional.",
    relacionado: ["FOB", "FCA", "DDP"],
    moduloBonCloud: "/incoterms"
  },
  {
    termino: "DDP",
    nombreCompleto: "Delivered Duty Paid (Entregado Derechos Pagados)",
    categoria: "Incoterms",
    definicion: "El vendedor asume la máxima responsabilidad: transporte, seguro, desaduanamiento de importación y pago de tributos aduaneros en el destino.",
    ejemplo: "Con DDP Bogotá, el vendedor extranjero debe encargarse de la importación en Colombia y pagar el arancel y el IVA. En la práctica es difícil, porque necesita un declarante habilitado en Colombia.",
    relacionado: ["EXW", "CIF", "Nacionalización"],
    moduloBonCloud: "/incoterms"
  },
  {
    termino: "CFR",
    nombreCompleto: "Cost and Freight (Costo y Flete)",
    categoria: "Incoterms",
    definicion: "El vendedor paga el transporte marítimo hasta el puerto de destino, pero el riesgo de pérdida se transmite al comprador cuando la carga se embarca.",
    ejemplo: "Si compras CFR Cartagena, el vendedor paga el barco, pero el riesgo del viaje ya es tuyo: el seguro no es obligatorio, aunque conviene contratarlo por tu cuenta.",
    relacionado: ["CIF", "FOB"],
    moduloBonCloud: "/incoterms"
  },
  {
    termino: "FCA",
    nombreCompleto: "Free Carrier (Franco Transportista)",
    categoria: "Incoterms",
    definicion: "El vendedor entrega la mercancía, despachada para exportación, al transportador que designa el comprador en el lugar acordado. Sirve para cualquier modo de transporte y es la regla que la ICC recomienda para carga en contenedor.",
    ejemplo: "Con FCA terminal de contenedores de Shanghái, el vendedor entrega el contenedor en la terminal y desde ahí el riesgo y el flete son del comprador.",
    relacionado: ["FOB", "EXW", "CIF"],
    moduloBonCloud: "/incoterms"
  },
  {
    termino: "Valor en Aduana",
    nombreCompleto: "Base de los tributos aduaneros",
    categoria: "Tributos Aduaneros",
    definicion: "Valor que se determina con las normas de valoración de la OMC y la Comunidad Andina (Decisión 571). Parte del precio realmente pagado y en Colombia incluye el flete y el seguro hasta el puerto de importación, por eso en la práctica es un valor CIF.",
    ejemplo: "FOB USD 60.000 + flete USD 3.500 + seguro USD 300 = valor en aduana de USD 63.800.",
    relacionado: ["CIF", "Base Arancelaria", "Formulario 560", "TRM"],
    moduloBonCloud: "/importacion"
  },
  {
    termino: "DTA",
    nombreCompleto: "Declaración de Tránsito Aduanero",
    categoria: "Formularios DIAN",
    definicion: "Declaración con la que la mercancía se traslada bajo control aduanero de una aduana a otra dentro del país, con los tributos suspendidos mientras dura el tránsito.",
    ejemplo: "Un contenedor que llega al Puerto de Cartagena pero se declarará en la aduana de Medellín viaja en tránsito aduanero, amparado por la DTA.",
    relacionado: ["Nacionalización", "Zona Franca", "Formulario 500"],
    moduloBonCloud: "/formularios"
  },
  {
    termino: "Formulario 500",
    nombreCompleto: "Declaración de Importación DIAN",
    categoria: "Formularios DIAN",
    definicion: "Declaración de importación: en ella el declarante identifica la mercancía, declara su valor en aduana y liquida los tributos aduaneros (arancel, IVA y otros si aplican).",
    ejemplo: "Antes de retirar la mercancía de la sociedad portuaria se presenta y paga el Formulario 500 ante la DIAN.",
    relacionado: ["Base Arancelaria", "Levante de Mercancía", "Formulario 560"],
    moduloBonCloud: "/formularios/500"
  },
  {
    termino: "Formulario 600",
    nombreCompleto: "Declaración de Exportación (DEX)",
    categoria: "Formularios DIAN",
    definicion: "Declaración que presenta el exportador o su agencia de aduanas en los servicios informáticos de la DIAN para amparar la salida definitiva o temporal de mercancías. Va precedida de la solicitud de autorización de embarque.",
    ejemplo: "El exportador de café en Cartagena requiere presentar el Formulario 600 DEX para legalizar el despacho al exterior.",
    relacionado: ["Subpartida Arancelaria", "Vistos Buenos"],
    moduloBonCloud: "/formularios/600"
  },
  {
    termino: "Formulario 560",
    nombreCompleto: "Declaración Andina del Valor (DAV)",
    categoria: "Formularios DIAN",
    definicion: "Documento que soporta la determinación del valor en aduana conforme a las normas de la CAN y la OMC. Es obligatoria cuando el valor FOB de la importación es igual o superior a USD 5.000.",
    ejemplo: "Si el valor FOB de la importación es igual o superior a USD 5.000, se presenta la DAV detallando precio, fletes, seguros, comisiones, descuentos y la posible vinculación entre comprador y vendedor.",
    relacionado: ["Formulario 500", "Base Arancelaria", "CIF"],
    moduloBonCloud: "/formularios/560"
  },
  {
    termino: "Formulario 001",
    nombreCompleto: "Registro Único Tributario (RUT)",
    categoria: "Formularios DIAN",
    definicion: "Mecanismo administrado por la DIAN para identificar, ubicar y clasificar a las personas y entidades sujetas a obligaciones tributarias y aduaneras.",
    ejemplo: "Para importar, el RUT debe tener registrada la calidad de usuario aduanero de importador.",
    relacionado: ["NIT", "DV"],
    moduloBonCloud: "/formularios/001"
  },
  {
    termino: "DV",
    nombreCompleto: "Dígito de Verificación",
    categoria: "Identificación Tributaria",
    definicion: "Dígito que se calcula a partir del NIT con un algoritmo de módulo 11 (pesos 3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67 y 71). Sirve para detectar errores de digitación.",
    ejemplo: "Para el NIT 900123456 el dígito de verificación es 8, así que se escribe 900123456-8.",
    relacionado: ["NIT", "Formulario 001"],
    moduloBonCloud: "/formularios/001"
  },
  {
    termino: "NIT",
    nombreCompleto: "Número de Identificación Tributaria",
    categoria: "Identificación Tributaria",
    definicion: "Número que asigna la DIAN al inscribirse en el RUT para identificar a contribuyentes y usuarios aduaneros.",
    ejemplo: "Importadores, exportadores y agencias de aduanas usan su NIT con el DV en todas las declaraciones y en los trámites de la VUCE.",
    relacionado: ["DV", "Formulario 001"],
    moduloBonCloud: "/formularios/001"
  },
  {
    termino: "Subpartida Arancelaria",
    nombreCompleto: "Código de Nomenclatura del Sistema Armonizado",
    categoria: "Arancel y Clasificación",
    definicion: "Código de 10 dígitos del Arancel de Aduanas colombiano: 6 del Sistema Armonizado, 2 de la NANDINA (Comunidad Andina) y 2 nacionales. De él dependen los tributos y los requisitos de la mercancía.",
    ejemplo: "Las bombas de engranajes del caso se clasifican en 8413.60.90.00; el café verde sin tostar ni descafeinar (excepto para siembra), en 0901.11.90.00.",
    relacionado: ["Base Arancelaria", "Vistos Buenos", "TLC"],
    moduloBonCloud: "/subpartidas"
  },
  {
    termino: "Base Arancelaria",
    nombreCompleto: "Base Gravable Aduanera",
    categoria: "Tributos Aduaneros",
    definicion: "Valor en aduana convertido a pesos con la TRM: es la base del arancel. La base del IVA es esta misma cifra más el arancel.",
    ejemplo: "Un valor en aduana de USD 10.000 con TRM de $4.200 da una base de $42.000.000 COP.",
    relacionado: ["CIF", "TRM", "Arancel (Ad-Valorem)", "IVA de Importación"],
    moduloBonCloud: "/importacion"
  },
  {
    termino: "Arancel (Ad-Valorem)",
    nombreCompleto: "Impuesto a la Importación de Mercancías",
    categoria: "Tributos Aduaneros",
    definicion: "Gravamen aduanero expresado en porcentaje que se cobra sobre el valor en aduana (en la práctica, CIF) convertido a pesos. La tarifa depende de la subpartida y puede reducirse con un acuerdo comercial.",
    ejemplo: "Si la subpartida paga el 15% de arancel, sobre un valor en aduana de $10.000.000 COP se liquidan $1.500.000 COP de arancel. En el caso de práctica de las bombas (5%), sobre $261.580.000 el arancel es $13.079.000; su arancel real hoy es 0% por el Decreto 272 de 2018.",
    relacionado: ["Base Arancelaria", "IVA de Importación", "TLC"],
    moduloBonCloud: "/importacion"
  },
  {
    termino: "IVA de Importación",
    nombreCompleto: "Impuesto al Valor Agregado en Aduana",
    categoria: "Tributos Aduaneros",
    definicion: "Impuesto sobre las ventas que se paga al importar (tarifa general del 19%). Su base es el valor en aduana en pesos más el arancel (art. 459 del Estatuto Tributario). Según la DIAN, los recargos antidumping, compensatorios o de salvaguardia no se suman a esa base (Concepto 626 de 2020).",
    ejemplo: "Valor en aduana $42.000.000 + arancel $4.200.000 = base de $46.200.000. El IVA del 19% es $8.778.000.",
    relacionado: ["Base Arancelaria", "Arancel (Ad-Valorem)", "Formulario 500"],
    moduloBonCloud: "/importacion"
  },
  {
    termino: "TRM",
    nombreCompleto: "Tasa Representativa del Mercado",
    categoria: "Financiero y Aduanero",
    definicion: "Tasa de cambio peso–dólar que certifica diariamente la Superintendencia Financiera. Para liquidar tributos aduaneros se usa la TRM vigente el último día hábil de la semana anterior a la presentación y aceptación de la declaración.",
    ejemplo: "Si la declaración se presenta un miércoles, se usa la TRM vigente el último día hábil de la semana anterior (normalmente el viernes), no la del miércoles.",
    relacionado: ["Base Arancelaria", "CIF"],
    moduloBonCloud: "/importacion"
  },
  {
    termino: "Vistos Buenos",
    nombreCompleto: "Permisos y Licencias de Requisito Previo",
    categoria: "Control Aduanero",
    definicion: "Autorizaciones, registros o certificados de otras entidades (INVIMA, ICA, SIC, MinJusticia, entre otras) que ciertas mercancías necesitan además de la declaración ante la DIAN. Se tramitan en la VUCE.",
    ejemplo: "Las frutas frescas necesitan el documento de requisitos fitosanitarios del ICA; los medicamentos, el registro sanitario del INVIMA. Las bombas de engranajes del caso son de libre importación.",
    relacionado: ["INVIMA", "ICA", "Subpartida Arancelaria"],
    moduloBonCloud: "/vistos-buenos"
  },
  {
    termino: "INVIMA",
    nombreCompleto: "Instituto Nacional de Vigilancia de Medicamentos y Alimentos",
    categoria: "Entidades Regulatorias",
    definicion: "Entidad de vigilancia sanitaria de Colombia. Otorga registros y notificaciones sanitarias para alimentos, medicamentos, dispositivos médicos y cosméticos, e inspecciona estos productos en los puertos.",
    ejemplo: "Los suplementos dietarios necesitan registro sanitario INVIMA vigente antes de importarse para la venta.",
    relacionado: ["Vistos Buenos", "ICA"],
    moduloBonCloud: "/vistos-buenos"
  },
  {
    termino: "ICA",
    nombreCompleto: "Instituto Colombiano Agropecuario",
    categoria: "Entidades Regulatorias",
    definicion: "Entidad responsable de controlar la sanidad animal y vegetal en Colombia para prevenir plagas y enfermedades en el comercio exterior agropecuario.",
    ejemplo: "Para importar frutas frescas se tramita ante el ICA el documento de requisitos fitosanitarios para importación; para carne, el documento zoosanitario de importación.",
    relacionado: ["Vistos Buenos", "INVIMA"],
    moduloBonCloud: "/vistos-buenos"
  },
  {
    termino: "BL",
    nombreCompleto: "Bill of Lading (Conocimiento de Embarque)",
    categoria: "Documentos de Transporte",
    definicion: "Documento que emite la naviera (o el agente de carga, si es un B/L hijo). Prueba el contrato de transporte y el recibo de la carga a bordo, y es un título representativo de las mercancías: quien lo tiene legítimamente puede reclamarlas.",
    ejemplo: "El consignatario debe presentar el BL original o endosado para solicitar la entrega del contenedor en el Puerto de Cartagena.",
    relacionado: ["AWB", "CIF", "Formulario 500"],
    moduloBonCloud: "/simulador"
  },
  {
    termino: "AWB",
    nombreCompleto: "Air Waybill (Guía Aérea)",
    categoria: "Documentos de Transporte",
    definicion: "Documento equivalente al BL utilizado exclusivamente en transporte aéreo de carga, que actúa como recibo y contrato de transporte no negociable.",
    ejemplo: "En un envío aéreo que llega a El Dorado o al Rafael Núñez, la aerolínea emite la guía máster y el agente de carga, si consolida, emite las guías hijas.",
    relacionado: ["BL", "CIF"],
    moduloBonCloud: "/simulador"
  },
  {
    termino: "Nacionalización",
    nombreCompleto: "Desaduanamiento y Libre Disposición",
    categoria: "Operativa Aduanera",
    definicion: "Proceso legal y administrativo mediante el cual se presentan declaraciones, pagan tributos y obtienen autorizaciones para disponer libremente de la mercancía.",
    ejemplo: "Tras presentar la declaración, pagar los tributos y obtener el levante (automático o después de inspección), la mercancía queda en libre disposición.",
    relacionado: ["Levante de Mercancía", "Formulario 500", "Base Arancelaria"],
    moduloBonCloud: "/importacion"
  },
  {
    termino: "Levante de Mercancía",
    nombreCompleto: "Autorización de Retiro Aduanero DIAN",
    categoria: "Operativa Aduanera",
    definicion: "Acto por el cual la DIAN autoriza disponer de la mercancía declarada. Puede ser automático (sin inspección) o darse después de una inspección documental o física.",
    ejemplo: "Si el sistema de gestión de riesgo no selecciona la declaración para inspección, se otorga levante automático; si ordena inspección física, el levante llega cuando el inspector confirma que la mercancía coincide con lo declarado.",
    relacionado: ["Nacionalización", "Inspección Física (Aduanera)"],
    moduloBonCloud: "/formularios/500"
  },
  {
    termino: "Inspección Física (Aduanera)",
    nombreCompleto: "Aforo y Verificación Física de Mercancías",
    categoria: "Control Aduanero",
    definicion: "Diligencia en la que un funcionario de la DIAN examina la mercancía para comprobar que coincide con lo declarado: naturaleza, cantidad, peso, estado y subpartida.",
    ejemplo: "Si la DIAN ordena inspección física en el puerto de Cartagena, se programa la revisión del contenedor; también puede hacerse de forma no intrusiva, con escáner.",
    relacionado: ["Levante de Mercancía", "Formulario 500"],
    moduloBonCloud: "/formularios/500"
  },
  {
    termino: "Zona Franca",
    nombreCompleto: "Área Delimitada con Régimen Tributario Especial",
    categoria: "Regímenes Especiales",
    definicion: "Extensión de territorio nacional con beneficios tributarios, aduaneros y de comercio exterior cuyas mercancías se entienden fuera del territorio aduanero nacional para efectos de los tributos a las importaciones y exportaciones (Ley 1004 de 2005).",
    ejemplo: "Mercancía que ingresa del exterior a una zona franca de Cartagena no paga arancel ni IVA mientras permanezca allí; los paga cuando sale al resto del país con una declaración de importación.",
    relacionado: ["DTA", "Nacionalización"],
    moduloBonCloud: "/simulador"
  },
  {
    termino: "SAE",
    nombreCompleto: "Solicitud de Autorización de Embarque",
    categoria: "Operativa Aduanera",
    definicion: "Primer trámite de una exportación: se presenta en los servicios informáticos de la DIAN ante la seccional donde está la mercancía. Tiene una vigencia de un mes, dentro del cual la mercancía debe ingresar a la zona primaria y embarcarse (arts. 347 a 352 del Decreto 1165 de 2019).",
    ejemplo: "Café del Caribe presenta la SAE en la seccional de Cartagena; autorizado y certificado el embarque, presenta la declaración de exportación (formulario 600).",
    relacionado: ["Formulario 600", "DIAN", "BL"],
    moduloBonCloud: "/formularios/600"
  },
  {
    termino: "Reglas de Origen",
    nombreCompleto: "Criterios para considerar originaria una mercancía",
    categoria: "Acuerdos Comerciales",
    definicion: "Condiciones que fija cada acuerdo comercial para que una mercancía sea originaria y reciba la preferencia arancelaria: totalmente obtenida, cambio de clasificación arancelaria, valor de contenido regional o requisitos específicos por producto. Las operaciones mínimas, como empacar o etiquetar, no confieren origen.",
    ejemplo: "En el acuerdo con la Unión Europea, el café tostado es originario si el café se cultivó y cosechó en los países del acuerdo; tostar en Colombia café importado de otro país no basta.",
    relacionado: ["TLC", "Prueba de Origen", "Subpartida Arancelaria"],
    moduloBonCloud: "/subpartidas"
  },
  {
    termino: "Prueba de Origen",
    nombreCompleto: "Certificado o declaración que acredita el origen",
    categoria: "Acuerdos Comerciales",
    definicion: "Documento que demuestra que la mercancía es originaria según un acuerdo comercial. La expide el productor, el exportador o la autoridad competente, según el acuerdo; en Colombia la autoridad es la DIAN y antes se presenta la declaración juramentada de origen (art. 312 del Decreto 1165 de 2019). Al importar se obtiene antes de presentar la declaración.",
    ejemplo: "Para que su cliente en Hamburgo pague 0% de arancel, Café del Caribe solicita ante la DIAN la prueba de origen del Acuerdo Comercial con la Unión Europea.",
    relacionado: ["TLC", "Reglas de Origen", "Formulario 500"],
    moduloBonCloud: "/formularios/500"
  },
  {
    termino: "TLC",
    nombreCompleto: "Tratado de Libre Comercio",
    categoria: "Acuerdos Comerciales",
    definicion: "Acuerdo vinculante entre dos o más países para conceder preferencias arancelarias recíprocas y reducir barreras al comercio de bienes y servicios.",
    ejemplo: "Con el TLC Colombia–Estados Unidos, muchas subpartidas de maquinaria entran con 0% de arancel si se demuestra el origen. Con China no hay acuerdo, por eso las bombas del caso no tienen preferencia por origen: pagan el arancel de nación más favorecida.",
    relacionado: ["Reglas de Origen", "Prueba de Origen", "Arancel (Ad-Valorem)"],
    moduloBonCloud: "/subpartidas"
  }
];
