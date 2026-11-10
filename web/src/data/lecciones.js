/**
 * BonCloud — Ruta de Aprendizaje de Comercio Internacional
 * Datos de las lecciones (cursos.js)
 *
 * Tres casos de práctica, uno por módulo:
 *  1. Importación de 500 bombas de engranajes (oleohidráulicas, sin motor) desde Shanghái
 *     hasta el Puerto de Cartagena.
 *  2. Exportación de café tostado del Puerto de Cartagena a Hamburgo.
 *  3. Una máquina llenadora de demostración que llega a Cartagena, viaja en tránsito aduanero
 *     a una zona franca y sale a una feria con importación temporal.
 *
 * Marco normativo: Decreto 1165 de 2019 y sus modificaciones (entre ellas los Decretos 360 de 2021
 * y 659 de 2024), Resolución DIAN 000046 de 2019, Decisión 571 CAN, Estatuto Tributario (art. 459),
 * Ley 1004 de 2005 y Decreto 2147 de 2016 (zonas francas), Incoterms® 2020 (ICC).
 *
 * Valores de práctica: el arancel (5%), el flete, el seguro, la TRM y los gastos de terminal
 * son cifras de ejemplo del caso. El arancel real de 8413.60.90.00 hoy es 0% (Decreto 272 de 2018);
 * el curso usa 5% para que el estudiante practique la liquidación completa. Se presentan así en pantalla para que el estudiante sepa
 * que en una operación real debe consultarlos.
 *
 * Cada pregunta: `correcta` es el índice de la opción correcta. El orden se baraja al mostrarse.
 */

// Módulos de la Ruta. Cada uno sigue su propio caso de práctica y su primera
// lección está siempre disponible.
export const modulos = [
  {
    id: 1,
    titulo: 'Importación',
    subtitulo: 'De Shanghái a la bodega en Colombia',
    caso: 'Caso: 500 bombas de engranajes, de Shanghái al Puerto de Cartagena',
  },
  {
    id: 2,
    titulo: 'Exportación y origen',
    subtitulo: 'De Colombia a la Unión Europea',
    caso: 'Caso: café tostado colombiano, del Puerto de Cartagena a Hamburgo',
  },
  {
    id: 3,
    titulo: 'Regímenes especiales',
    subtitulo: 'Tránsito, zona franca e importación temporal',
    caso: 'Caso: una máquina llenadora de demostración, de Génova a una zona franca y a una feria en Bogotá',
  },
];

export const lecciones = [
  // ───────────────────────────────── 1
  {
    id: 1,
    orden: 1,
    modulo: 1,
    titulo: "¿Qué es el comercio internacional y quiénes intervienen?",
    nivel: "Fundamentos",
    duracionMin: 15,
    objetivos: [
      "Entender el recorrido de una importación en Colombia",
      "Identificar qué hace cada actor público y privado",
      "Conocer el primer requisito del importador: el RUT"
    ],
    contenido: `
      <p>El <strong>comercio internacional</strong> es el intercambio de bienes y servicios entre países. En Colombia, la entrada y salida de mercancías se rige por el <strong>Decreto 1165 de 2019</strong> (régimen de aduanas) y sus modificaciones, reglamentado por la Resolución 000046 de 2019. La autoridad aduanera es la <span class="term-glosario" data-glosario="DIAN">DIAN</span>.</p>

      <h4>Quién hace qué en una importación</h4>
      <ul>
        <li><strong>Importador:</strong> persona natural o jurídica que trae la mercancía al país. Debe estar inscrito en el <span class="term-glosario" data-glosario="Formulario 001">RUT (formulario 001)</span> con la calidad de usuario aduanero de importador.</li>
        <li><strong>Exportador o proveedor:</strong> vende y despacha la mercancía desde el país de origen.</li>
        <li><strong>Naviera (transportador):</strong> opera el buque y emite el conocimiento de embarque (B/L), que prueba el contrato de transporte.</li>
        <li><strong>Agente de carga internacional:</strong> contrata y coordina el transporte, consolida carga y puede emitir su propio documento de transporte (B/L hijo o <em>house</em>).</li>
        <li><strong>Agencia de aduanas:</strong> empresa autorizada por la DIAN que, mediante un mandato aduanero, presenta las declaraciones a nombre del importador. No es obligatoria: el importador puede actuar directamente ante la DIAN, por cualquier cuantía (art. 33 del Decreto 1165 de 2019), y en ese caso responde como declarante.</li>
        <li><strong>Sociedad portuaria:</strong> concesionaria que administra el terminal. En Cartagena, por ejemplo, la Sociedad Portuaria Regional de Cartagena (SPRC) y Contecar, del Grupo Puerto de Cartagena.</li>
        <li><strong>Autoridades:</strong> la DIAN controla la entrada de mercancías y recauda los tributos; el MinCIT define la política de comercio exterior y administra la VUCE; según el producto intervienen además el INVIMA, el ICA, la SIC y otras entidades.</li>
      </ul>
    `,
    etapaCaso: "HidroColombia S.A.S., una empresa colombiana, quiere importar 500 bombas de engranajes para sistemas oleohidráulicos, sin motor, del fabricante Zhejiang Hydraulic Co. (Shanghái). Primer paso: confirmar que su RUT tenga registrada la calidad de usuario aduanero de importador y decidir si contratará una agencia de aduanas o actuará directamente ante la DIAN.",
    practica: {
      texto: "Revisa el formulario 001 (RUT) en el simulador de formularios",
      moduloUrl: "/formularios",
      parametros: { form: "001" }
    },
    quiz: [
      {
        pregunta: "¿Qué norma contiene el régimen de aduanas vigente en Colombia?",
        opciones: [
          "El Decreto 1165 de 2019, con sus modificaciones",
          "El Decreto 2685 de 1999",
          "El Código de Comercio (Decreto 410 de 1971)",
          "El Estatuto Tributario"
        ],
        correcta: 0,
        explicacion: "El Decreto 1165 de 2019 reemplazó al Decreto 2685 de 1999 y es el régimen de aduanas vigente. El Código de Comercio regula los contratos y el Estatuto Tributario los impuestos, pero ninguno de los dos regula el procedimiento aduanero."
      },
      {
        pregunta: "¿Quién opera el buque y emite el conocimiento de embarque (B/L)?",
        opciones: [
          "La agencia de aduanas",
          "La naviera",
          "La sociedad portuaria",
          "La DIAN"
        ],
        correcta: 1,
        explicacion: "La naviera es el transportador marítimo: opera el buque y emite el B/L. El agente de carga puede emitir un B/L hijo cuando consolida carga, pero no opera el buque."
      },
      {
        pregunta: "HidroColombia no quiere contratar agencia de aduanas. ¿Qué permite la norma?",
        opciones: [
          "Debe contratarla siempre: ninguna importación se puede declarar sin agencia",
          "Solo puede actuar directamente si la mercancía vale menos de USD 1.000",
          "Puede actuar directamente ante la DIAN por cualquier cuantía, y responde como declarante",
          "Puede pedirle a la naviera que presente la declaración de importación"
        ],
        correcta: 2,
        explicacion: "El artículo 33 del Decreto 1165 de 2019 permite al importador actuar directamente, por cualquier cuantía. Al hacerlo asume las obligaciones del declarante, como conservar los documentos soporte."
      },
      {
        pregunta: "¿Qué entidad administra la VUCE, donde se tramitan los permisos de otras entidades?",
        opciones: [
          "El Ministerio de Comercio, Industria y Turismo",
          "La DIAN",
          "La Sociedad Portuaria Regional de Cartagena",
          "El Banco de la República"
        ],
        correcta: 0,
        explicacion: "La VUCE (Ventanilla Única de Comercio Exterior) la administra el MinCIT. La DIAN usa sus propios servicios informáticos para las declaraciones."
      }
    ]
  },

  // ───────────────────────────────── 2
  {
    id: 2,
    orden: 2,
    modulo: 1,
    titulo: "Incoterms 2020 y cómo elegir uno",
    nivel: "Fundamentos",
    duracionMin: 20,
    objetivos: [
      "Saber dónde pasa el riesgo y quién paga cada tramo en FOB, CIF, EXW y FCA",
      "Distinguir las reglas marítimas de las multimodales",
      "Elegir el Incoterm para la compra en Shanghái"
    ],
    contenido: `
      <p>Los <strong>Incoterms® 2020</strong> de la Cámara de Comercio Internacional (ICC) son 11 reglas que reparten costos, riesgos y trámites entre vendedor y comprador. Siete sirven para cualquier modo de transporte (EXW, FCA, CPT, CIP, DAP, DPU y DDP) y cuatro son solo para transporte marítimo o fluvial (FAS, FOB, CFR y CIF).</p>

      <ul>
        <li><span class="term-glosario" data-glosario="FOB">FOB (Free On Board):</span> el vendedor hace el despacho de exportación y entrega la mercancía a bordo del buque que designa el comprador. El comprador contrata y paga el flete. El riesgo pasa al comprador cuando la mercancía queda a bordo. El seguro no es obligatorio para ninguno de los dos; normalmente lo toma el comprador porque el riesgo del viaje ya es suyo.</li>
        <li><span class="term-glosario" data-glosario="CIF">CIF (Cost, Insurance and Freight):</span> el vendedor paga el flete y un seguro hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía queda a bordo en origen. El seguro exigido es de cobertura mínima (Cláusulas C del Instituto) por el 110% del valor.</li>
        <li><span class="term-glosario" data-glosario="EXW">EXW (Ex Works):</span> el vendedor solo pone la mercancía a disposición en su fábrica. El comprador asume todo, incluido el despacho de exportación en el país de origen, algo difícil para un importador colombiano en China.</li>
        <li><strong>FCA (Free Carrier):</strong> el vendedor entrega la mercancía despachada para exportación al transportador, por ejemplo en la terminal de contenedores. Para carga en contenedor la ICC recomienda FCA en lugar de FOB, porque el contenedor se entrega en la terminal antes de subir al buque.</li>
      </ul>
    `,
    etapaCaso: "HidroColombia negocia las 500 bombas a USD 120 cada una en términos FOB Shanghái: valor FOB total de USD 60.000. HidroColombia contrata el flete con su agente de carga y toma un seguro de transporte, porque el riesgo pasa a su cargo cuando el contenedor queda a bordo del buque en Shanghái. Como es carga en contenedor, FCA terminal de Shanghái sería la opción que recomienda la ICC; en este curso seguimos con FOB porque es el término más usado en compras a China.",
    practica: {
      texto: "Compara FOB, CIF y FCA en la guía interactiva de Incoterms",
      moduloUrl: "/incoterms",
      parametros: { term: "FOB" }
    },
    quiz: [
      {
        pregunta: "En una compra FOB Shanghái, ¿quién contrata y paga el flete marítimo hasta Cartagena?",
        opciones: [
          "El vendedor en China",
          "La sociedad portuaria de Cartagena",
          "El comprador en Colombia",
          "La agencia de aduanas en Colombia"
        ],
        correcta: 2,
        explicacion: "En FOB el vendedor entrega a bordo en el puerto de embarque; desde ahí, el flete principal lo contrata y paga el comprador."
      },
      {
        pregunta: "Según Incoterms 2020, ¿en qué momento pasa el riesgo al comprador en FOB?",
        opciones: [
          "Cuando la mercancía queda a bordo del buque en el puerto de embarque",
          "Cuando la mercancía cruza la borda del buque",
          "Cuando el buque llega al puerto de Cartagena",
          "Cuando la mercancía se entrega en la terminal de contenedores de origen"
        ],
        correcta: 0,
        explicacion: "Desde Incoterms 2010 el riesgo en FOB pasa cuando la mercancía está a bordo. El criterio de 'cruzar la borda' pertenece a versiones anteriores. La entrega en la terminal de contenedores corresponde a FCA."
      },
      {
        pregunta: "En CIF, ¿qué seguro debe contratar el vendedor como mínimo?",
        opciones: [
          "Cobertura amplia (Cláusulas A) por el 100% del valor",
          "Cobertura mínima (Cláusulas C del Instituto) por el 110% del valor",
          "Ninguno: en CIF el seguro siempre lo contrata el comprador",
          "Un seguro todo riesgo hasta la bodega del comprador"
        ],
        correcta: 1,
        explicacion: "En CIF el vendedor debe contratar al menos una cobertura mínima (Cláusulas C) por el 110% del valor. La cobertura amplia (Cláusulas A) es la exigida en CIP."
      },
      {
        pregunta: "¿Qué regla recomienda la ICC para carga en contenedor que se entrega en una terminal?",
        opciones: [
          "FOB",
          "FAS",
          "CFR",
          "FCA"
        ],
        correcta: 3,
        explicacion: "FOB, FAS, CFR y CIF suponen entrega a bordo o al costado del buque. Cuando el contenedor se entrega en la terminal antes de embarcarse, la regla adecuada es FCA."
      }
    ]
  },

  // ───────────────────────────────── 3
  {
    id: 3,
    orden: 3,
    modulo: 1,
    titulo: "Clasificación arancelaria y subpartidas",
    nivel: "Intermedio",
    duracionMin: 25,
    objetivos: [
      "Leer la estructura de 10 dígitos del Arancel de Aduanas colombiano",
      "Aplicar las Reglas Generales Interpretativas en orden",
      "Clasificar las bombas del caso y justificar la subpartida"
    ],
    contenido: `
      <p>Clasificar es asignarle a la mercancía su <span class="term-glosario" data-glosario="Subpartida Arancelaria">subpartida</span> en el Arancel de Aduanas. De ella dependen el arancel, el IVA, los requisitos de otras entidades y las estadísticas.</p>

      <h4>Estructura del código (10 dígitos)</h4>
      <ul>
        <li><strong>6 dígitos del Sistema Armonizado</strong> de la Organización Mundial de Aduanas: capítulo (2), partida (4) y subpartida (6).</li>
        <li><strong>2 dígitos de la NANDINA</strong>, la nomenclatura común de la Comunidad Andina, que tiene 8 dígitos.</li>
        <li><strong>2 dígitos nacionales</strong> que agrega Colombia. Si no hay desdoblamiento nacional, son 00.</li>
      </ul>

      <h4>Cómo se clasifica</h4>
      <p>Se aplican las Reglas Generales Interpretativas (RGI) en orden. La RGI 1 dice que los títulos de secciones y capítulos solo orientan: la clasificación la determinan los textos de las partidas y las notas. La RGI 6 aplica la misma lógica para escoger entre subpartidas. Si hay duda, se puede pedir a la DIAN una resolución de clasificación anticipada.</p>

      <h4>Las bombas del caso</h4>
      <ul>
        <li>Capítulo 84: máquinas y aparatos mecánicos.</li>
        <li>Partida 84.13: bombas para líquidos, incluso con dispositivo medidor incorporado; elevadores de líquidos.</li>
        <li>Subpartida 8413.60: las demás bombas volumétricas rotativas, como las de engranajes, paletas o tornillo.</li>
        <li>No confundir: las bombas de pistones (volumétricas alternativas) van en 8413.50, las centrífugas en 8413.70 y los motores hidráulicos en la partida 84.12.</li>
      </ul>
      <p>La subpartida nacional es <strong>8413.60.90.00</strong>. El Arancel de Aduanas (Decreto 1881 de 2021) le fija un gravamen general del 5%, pero esta subpartida está en la lista del <strong>Decreto 272 de 2018</strong>, que deja en 0% las materias primas y bienes de capital que no se producen en Colombia. Por eso hoy su arancel real es 0%. En el curso usamos un <strong>arancel de práctica del 5%</strong> para que puedas ejercitar la liquidación completa. Antes de una operación real confirma siempre el gravamen vigente: además del arancel general, revisa los decretos que lo modifican.</p>
    `,
    etapaCaso: "La ficha técnica confirma que son bombas de engranajes externos (volumétricas rotativas), sin motor, para aceite hidráulico. Con la RGI 1 y la RGI 6: capítulo 84, partida 84.13, subpartida 8413.60. La subpartida nacional es 8413.60.90.00. Colombia no tiene acuerdo comercial vigente con China, así que no hay preferencia por origen: se aplica el arancel de nación más favorecida, que para esta subpartida hoy es 0% por el Decreto 272 de 2018. Para practicar la liquidación usaremos un arancel del 5%.",
    practica: {
      texto: "Busca la partida 8413 en el buscador de subpartidas",
      moduloUrl: "/subpartidas",
      parametros: { buscar: "8413" }
    },
    quiz: [
      {
        pregunta: "¿Cómo se componen los 10 dígitos de una subpartida en el Arancel de Aduanas de Colombia?",
        opciones: [
          "Los 10 los define la Comunidad Andina",
          "6 del Sistema Armonizado, 2 de la NANDINA y 2 nacionales",
          "8 del Sistema Armonizado y 2 nacionales",
          "6 del Sistema Armonizado y 4 nacionales"
        ],
        correcta: 1,
        explicacion: "El Sistema Armonizado llega a 6 dígitos, la NANDINA a 8 y Colombia agrega 2 dígitos nacionales para completar 10."
      },
      {
        pregunta: "Si las bombas del caso fueran de pistones en lugar de engranajes, ¿qué subpartida del Sistema Armonizado correspondería?",
        opciones: [
          "8413.60, porque todas las bombas hidráulicas van ahí",
          "8413.70, bombas centrífugas",
          "8413.50, bombas volumétricas alternativas",
          "8412.21, motores hidráulicos de movimiento rectilíneo"
        ],
        correcta: 2,
        explicacion: "Las bombas de pistones son volumétricas alternativas (8413.50); las de engranajes, paletas o tornillo son rotativas (8413.60). La partida 84.12 es de motores, no de bombas."
      },
      {
        pregunta: "¿Qué Regla General Interpretativa se aplica primero?",
        opciones: [
          "La RGI 1: mandan los textos de las partidas y las notas de sección y capítulo",
          "La RGI 6: se clasifica directamente por subpartida",
          "La RGI 3: siempre se elige la partida más específica",
          "Ninguna: los títulos de los capítulos son los que tienen valor legal"
        ],
        correcta: 0,
        explicacion: "Las RGI se aplican en orden y la primera es la RGI 1. Los títulos de secciones y capítulos solo tienen valor indicativo."
      },
      {
        pregunta: "Las bombas vienen de China y Colombia no tiene acuerdo comercial con ese país. ¿Qué arancel se aplica?",
        opciones: [
          "0%, porque China es miembro de la OMC",
          "El arancel general de la subpartida en el Arancel de Aduanas",
          "El arancel preferencial de la Comunidad Andina",
          "Ninguno, si se presenta un certificado de origen chino"
        ],
        correcta: 1,
        explicacion: "Sin acuerdo comercial no hay preferencia: se paga el arancel general de la subpartida, con las modificaciones que haya hecho el Gobierno por decreto (para las bombas, el Decreto 272 de 2018 lo deja hoy en 0%). Ser miembro de la OMC no significa arancel cero, y el certificado de origen chino no da preferencia sin un acuerdo."
      }
    ]
  },

  // ───────────────────────────────── 4
  {
    id: 4,
    orden: 4,
    modulo: 1,
    titulo: "Vistos buenos y requisitos previos",
    nivel: "Intermedio",
    duracionMin: 20,
    objetivos: [
      "Saber cuándo una mercancía necesita permisos de otras entidades",
      "Usar la VUCE para verificar requisitos antes de embarcar",
      "Diferenciar libre importación, registro y licencia"
    ],
    contenido: `
      <p>Algunas mercancías necesitan <span class="term-glosario" data-glosario="Vistos Buenos">vistos buenos</span>, permisos o certificaciones de otras entidades además de la DIAN. Se tramitan en la <strong>VUCE</strong> (Ventanilla Única de Comercio Exterior) y deben estar aprobados antes de presentar la declaración de importación; algunas entidades los exigen desde antes del embarque. Por eso se revisan justo después de clasificar.</p>

      <p>Con el Decreto 925 de 2013, la mayoría de mercancías son de <strong>libre importación</strong>. El registro de importación se exige cuando la subpartida tiene requisitos o vistos buenos, y la licencia previa en casos restringidos.</p>

      <h4>Entidades que aparecen con más frecuencia</h4>
      <ul>
        <li><strong>INVIMA:</strong> alimentos, medicamentos, cosméticos y dispositivos médicos.</li>
        <li><strong>ICA:</strong> animales, plantas, semillas e insumos agropecuarios.</li>
        <li><strong>SIC:</strong> verifica que los productos sujetos a reglamentos técnicos (por ejemplo, el RETIE para productos eléctricos) tengan su certificado de conformidad, expedido por un organismo acreditado.</li>
        <li><strong>Ministerio de Justicia:</strong> sustancias químicas controladas.</li>
        <li><strong>Fondo Nacional de Estupefacientes:</strong> medicamentos y materias primas de control especial.</li>
        <li><strong>Indumil y Ministerio de Defensa:</strong> armas, municiones y explosivos.</li>
      </ul>
    `,
    etapaCaso: "Antes de confirmar la orden de compra, HidroColombia consulta la subpartida en la VUCE. En este caso de práctica, las bombas de engranajes sin motor son de libre importación: no requieren vistos buenos ni registro de importación. Si hubieran sido electrobombas, el motor eléctrico podría tener que demostrar conformidad con el RETIE, y la SIC lo verificaría antes de declarar. En una operación real, el resultado depende de la subpartida y de la norma vigente ese día.",
    practica: {
      texto: "Consulta las entidades y sus requisitos en la guía de vistos buenos",
      moduloUrl: "/vistos-buenos",
      parametros: { entidad: "SIC" }
    },
    quiz: [
      {
        pregunta: "¿Dónde se tramitan los vistos buenos y registros de importación de otras entidades?",
        opciones: [
          "En los servicios informáticos de la DIAN (MUISCA)",
          "En el portal de la sociedad portuaria",
          "En la VUCE",
          "En el sistema de la naviera"
        ],
        correcta: 2,
        explicacion: "La VUCE centraliza los trámites ante las entidades de control. La DIAN usa sus servicios informáticos para las declaraciones, no para los vistos buenos."
      },
      {
        pregunta: "¿Cuándo deben estar aprobados los vistos buenos que exija la mercancía?",
        opciones: [
          "Antes de presentar la declaración de importación; algunas entidades los piden desde antes del embarque",
          "Después del levante, para poder vender la mercancía",
          "Solo si la DIAN ordena inspección física",
          "Dentro del mes siguiente a la llegada del buque"
        ],
        correcta: 0,
        explicacion: "Sin los vistos buenos aprobados la mercancía no puede declararse correctamente. Por eso se revisan justo después de clasificar, antes de comprar y embarcar."
      },
      {
        pregunta: "Si importaras electrobombas, ¿quién verificaría el certificado de conformidad del reglamento técnico?",
        opciones: [
          "El INVIMA",
          "La SIC, a través de la VUCE",
          "El ICA",
          "La sociedad portuaria"
        ],
        correcta: 1,
        explicacion: "La SIC verifica el cumplimiento de reglamentos técnicos como el RETIE. El certificado lo expide un organismo de certificación acreditado."
      },
      {
        pregunta: "Con el Decreto 925 de 2013, ¿cuál es la situación de la mayoría de mercancías?",
        opciones: [
          "Necesitan licencia previa",
          "Necesitan registro de importación, sin importar la subpartida",
          "Necesitan autorización del INVIMA",
          "Son de libre importación, salvo que la subpartida tenga requisitos"
        ],
        correcta: 3,
        explicacion: "La regla general es la libre importación. El registro y la licencia se exigen solo cuando la subpartida o la operación lo requieren."
      }
    ]
  },

  // ───────────────────────────────── 5
  {
    id: 5,
    orden: 5,
    modulo: 1,
    titulo: "Valor en aduana: FOB, flete, seguro y CIF",
    nivel: "Intermedio",
    duracionMin: 20,
    objetivos: [
      "Construir el valor en aduana a partir del precio FOB",
      "Convertirlo a pesos con la TRM correcta",
      "Evitar el error de sumar dos veces el flete y el seguro"
    ],
    contenido: `
      <p>Los tributos se liquidan sobre el <strong>valor en aduana</strong>, que se determina con las normas de valoración de la OMC y la Comunidad Andina (Decisión 571 y su reglamento). El método principal es el valor de transacción: el precio realmente pagado o por pagar, con los ajustes que exija la norma. En Colombia se incluyen el transporte y el seguro hasta el puerto de importación, por eso en la práctica el valor en aduana es un valor <span class="term-glosario" data-glosario="CIF">CIF</span>.</p>

      <p class="formula-destacada">Valor en aduana (USD) = FOB + flete internacional + seguro (+ otros ajustes, si los hay)</p>

      <ul>
        <li><strong>Seguro:</strong> se declara el costo real de la póliza contratada. Si la mercancía no se aseguró, igual se suma la prima que se cobra habitualmente, sustentada con la cotización de una aseguradora (art. 340 de la Resolución 46 de 2019). La DIAN no acepta valores estimados sin soporte.</li>
        <li><strong>Si compras en CIF:</strong> el precio ya incluye flete y seguro; no se vuelven a sumar.</li>
        <li><strong>Conversión a pesos:</strong> se usa la <span class="term-glosario" data-glosario="TRM">TRM</span> vigente el último día hábil de la semana anterior a la presentación y aceptación de la declaración (art. 15 del Decreto 1165 de 2019). No es la del día de presentación ni la del día de llegada del buque.</li>
      </ul>
    `,
    etapaCaso: "Datos del embarque (valores de práctica):<br>" +
      "• Valor FOB: USD 60.000 (500 bombas × USD 120)<br>" +
      "• Flete Shanghái–Cartagena, contenedor de 20 pies: USD 3.500 (cotización de ejemplo)<br>" +
      "• Seguro de transporte: USD 300 (prima de ejemplo)<br>" +
      "• <strong>Valor en aduana: USD 63.800</strong><br>" +
      "• TRM del último día hábil de la semana anterior (ejemplo): $4.100<br>" +
      "• <strong>Valor en aduana en pesos: $261.580.000</strong>",
    practica: {
      texto: "Calcula el valor en aduana en la calculadora de importación",
      moduloUrl: "/importacion",
      parametros: { fob: 60000, flete: 3500, seguro: 300, trm: 4100, arancel: 5 }
    },
    quiz: [
      {
        pregunta: "¿Cómo se calcula el valor en aduana en el caso de las bombas compradas FOB?",
        opciones: [
          "FOB + flete, sin el seguro",
          "Solo el FOB, porque es el precio pactado",
          "FOB + flete + seguro + IVA",
          "FOB + flete internacional + seguro"
        ],
        correcta: 3,
        explicacion: "El valor en aduana incluye el precio de la mercancía más el transporte y el seguro hasta el puerto de importación. El IVA se calcula después, sobre esa base."
      },
      {
        pregunta: "¿Qué TRM se usa para convertir el valor en aduana a pesos?",
        opciones: [
          "La del día en que se presenta la declaración",
          "La vigente el último día hábil de la semana anterior a la presentación y aceptación de la declaración",
          "La del día en que llega el buque a Cartagena",
          "La de la fecha de la factura comercial"
        ],
        correcta: 1,
        explicacion: "La DIAN aplica la TRM del último día hábil de la semana anterior a la presentación y aceptación de la declaración. Usar la del mismo día es el error más frecuente."
      },
      {
        pregunta: "FOB USD 60.000, flete USD 3.500 y seguro USD 300. ¿Cuál es el valor en aduana?",
        opciones: [
          "USD 63.500",
          "USD 60.300",
          "USD 63.800",
          "USD 67.300"
        ],
        correcta: 2,
        explicacion: "60.000 + 3.500 + 300 = USD 63.800."
      },
      {
        pregunta: "Si hubieras comprado CIF Cartagena por USD 63.800, ¿qué sumas para llegar al valor en aduana?",
        opciones: [
          "Nada por flete ni seguro: el precio CIF ya los incluye",
          "Otra vez el flete y el seguro",
          "El arancel",
          "El IVA"
        ],
        correcta: 0,
        explicacion: "El precio CIF ya trae el flete y el seguro. Sumarlos de nuevo inflaría la base y los tributos. Solo se agregarían otros ajustes de valoración, si existieran."
      }
    ]
  },

  // ───────────────────────────────── 6
  {
    id: 6,
    orden: 6,
    modulo: 1,
    titulo: "Tributos aduaneros: arancel e IVA",
    nivel: "Avanzado",
    duracionMin: 25,
    objetivos: [
      "Liquidar el arancel sobre el valor en aduana",
      "Construir la base del IVA de importación",
      "Aproximar cada tributo como lo hace la DIAN"
    ],
    contenido: `
      <p>Al importar para consumo en Colombia se pagan los tributos aduaneros. En la mayoría de los casos son dos:</p>
      <ol>
        <li><strong>Arancel:</strong> <code>Arancel = valor en aduana (pesos) × tarifa de la subpartida</code>. En el caso usamos la tarifa de práctica del 5%.</li>
        <li><strong><span class="term-glosario" data-glosario="IVA de Importación">IVA</span>:</strong> su base es el valor en aduana más el arancel (art. 459 del Estatuto Tributario). La tarifa general es del 19%.<br>
          <code>Base IVA = valor en aduana + arancel</code><br>
          <code>IVA = base IVA × 19%</code>
        </li>
      </ol>
      <p>Cada tributo se aproxima al múltiplo de mil más cercano. Se pagan en bancos autorizados antes del levante. Según el producto pueden aparecer otros recargos, como derechos antidumping o salvaguardias. Según la DIAN, esos recargos no hacen parte de la base del IVA, porque no son derechos de aduana (Concepto 626 de 2020).</p>
    `,
    etapaCaso: "Liquidación del embarque (TRM de ejemplo $4.100, arancel de práctica 5%):<br>" +
      "1. Valor en aduana: USD 63.800 × $4.100 = <strong>$261.580.000</strong><br>" +
      "2. Arancel (5%): $261.580.000 × 5% = <strong>$13.079.000</strong><br>" +
      "3. Base del IVA: $261.580.000 + $13.079.000 = $274.659.000<br>" +
      "4. IVA (19%): $274.659.000 × 19% = $52.185.210 → se aproxima a <strong>$52.185.000</strong><br>" +
      "5. <strong>Total de tributos: $65.264.000</strong>",
    practica: {
      texto: "Liquida el arancel y el IVA en la calculadora de importación",
      moduloUrl: "/importacion",
      parametros: { fob: 60000, flete: 3500, seguro: 300, trm: 4100, arancel: 5 }
    },
    quiz: [
      {
        pregunta: "¿Sobre qué base se liquida el arancel?",
        opciones: [
          "Sobre el valor FOB en dólares",
          "Sobre el valor en aduana convertido a pesos",
          "Sobre el valor en aduana más el IVA",
          "Sobre el precio de venta en Colombia"
        ],
        correcta: 1,
        explicacion: "El arancel se aplica al valor en aduana (CIF) en pesos. El IVA se calcula después."
      },
      {
        pregunta: "¿Cuál es la base del IVA de importación?",
        opciones: [
          "Solo el valor en aduana",
          "El valor FOB más el arancel",
          "El valor en aduana más el arancel",
          "El valor en aduana más el arancel y los gastos del puerto"
        ],
        correcta: 2,
        explicacion: "El artículo 459 del Estatuto Tributario toma como base del IVA la misma base de los derechos de aduana (el valor en aduana) más esos derechos, es decir, el arancel. Los gastos del puerto no hacen parte, y según la DIAN tampoco los recargos antidumping o de salvaguardia (Concepto 626 de 2020)."
      },
      {
        pregunta: "La base del IVA es $274.659.000 y el 19% da $52.185.210. ¿Qué valor se declara?",
        opciones: [
          "$52.185.210",
          "$52.186.000",
          "$52.190.000",
          "$52.185.000"
        ],
        correcta: 3,
        explicacion: "Cada tributo se aproxima al múltiplo de mil más cercano: 52.185.210 queda en 52.185.000."
      },
      {
        pregunta: "Arancel $13.079.000 e IVA $52.185.000. ¿Cuál es el total de tributos?",
        opciones: [
          "$65.264.000",
          "$65.264.210",
          "$274.659.000",
          "$52.185.000"
        ],
        correcta: 0,
        explicacion: "13.079.000 + 52.185.000 = $65.264.000."
      }
    ]
  },

  // ───────────────────────────────── 7
  {
    id: 7,
    orden: 7,
    modulo: 1,
    titulo: "Declaración y formularios DIAN",
    nivel: "Avanzado",
    duracionMin: 30,
    objetivos: [
      "Reunir los documentos soporte de la importación",
      "Saber cuándo es obligatoria la Declaración Andina del Valor",
      "Conocer qué contiene la declaración de importación"
    ],
    contenido: `
      <p>Las bombas se importan en la <strong>modalidad de importación ordinaria</strong>: quedan en libre disposición en Colombia después de pagar los tributos y obtener el levante.</p>

      <h4>Documentos soporte</h4>
      <p>Factura comercial, documento de transporte (B/L), lista de empaque, póliza o certificado de seguro, mandato aduanero si actúa una agencia, y los vistos buenos o certificados de origen cuando apliquen. El declarante debe conservarlos durante 5 años.</p>

      <h4>Formularios</h4>
      <ul>
        <li><span class="term-glosario" data-glosario="Formulario 560">Formulario 560 (Declaración Andina del Valor):</span> detalla los elementos de la transacción (precio, fletes, seguros, comisiones, vinculación entre las partes). Es obligatoria cuando el valor FOB es igual o superior a USD 5.000.</li>
        <li><span class="term-glosario" data-glosario="Formulario 500">Formulario 500 (declaración de importación):</span> identifica al importador y al declarante, la subpartida, la descripción, el valor en aduana y los tributos liquidados.</li>
      </ul>
      <p>Las declaraciones se presentan de forma electrónica, con firma digital, en los servicios informáticos de la DIAN. Los formularios de BonCloud son simuladores para practicar y no tienen validez ante la DIAN.</p>
    `,
    etapaCaso: "El valor FOB de las bombas es USD 60.000, por encima de USD 5.000, así que se presenta la Declaración Andina del Valor (formulario 560). Luego se elabora y firma la declaración de importación (formulario 500) con $65.264.000 de tributos liquidados, y se archivan los documentos soporte.",
    practica: {
      texto: "Practica el diligenciamiento del formulario 500",
      moduloUrl: "/formularios",
      parametros: { form: "500" }
    },
    quiz: [
      {
        pregunta: "¿Qué formulario se usa para declarar la importación y liquidar los tributos?",
        opciones: [
          "El formulario 560 (Declaración Andina del Valor)",
          "El formulario 500 (declaración de importación)",
          "El formulario 600 (exportación)",
          "El formulario 001 (RUT)"
        ],
        correcta: 1,
        explicacion: "El formulario 500 es la declaración de importación. El 560 soporta el valor, pero no liquida los tributos."
      },
      {
        pregunta: "¿Cuándo es obligatoria la Declaración Andina del Valor?",
        opciones: [
          "Cuando el valor FOB es igual o superior a USD 5.000",
          "Cuando el valor FOB supera USD 1.000",
          "Solo cuando comprador y vendedor están vinculados",
          "En todas las importaciones, sin excepción"
        ],
        correcta: 0,
        explicacion: "La DAV se exige desde USD 5.000 FOB. La vinculación entre las partes es una de las preguntas del formulario, no la condición para presentarlo."
      },
      {
        pregunta: "¿Cuánto tiempo debe conservar el declarante los documentos soporte?",
        opciones: [
          "Hasta obtener el levante",
          "1 año",
          "5 años desde la presentación y aceptación de la declaración",
          "10 años"
        ],
        correcta: 2,
        explicacion: "El declarante debe conservar los documentos soporte durante 5 años, porque la DIAN puede pedirlos en un control posterior."
      },
      {
        pregunta: "¿Qué documento prueba el contrato de transporte marítimo?",
        opciones: [
          "La factura comercial",
          "La lista de empaque",
          "El certificado de origen",
          "El conocimiento de embarque (B/L)"
        ],
        correcta: 3,
        explicacion: "El B/L lo emite la naviera (o el agente de carga, en el caso de un B/L hijo) y prueba el contrato de transporte."
      }
    ]
  },

  // ───────────────────────────────── 8
  {
    id: 8,
    orden: 8,
    modulo: 1,
    titulo: "Nacionalización, levante y retiro en el Puerto de Cartagena",
    nivel: "Avanzado",
    duracionMin: 25,
    objetivos: [
      "Seguir la carga desde el arribo hasta la bodega",
      "Distinguir levante automático, inspección documental e inspección física",
      "Cerrar la operación: retiro y devolución del contenedor"
    ],
    contenido: `
      <h4>De la llegada a la bodega</h4>
      <ol>
        <li><strong>Antes del arribo:</strong> el transportador transmite a la DIAN el manifiesto de carga y los documentos de transporte.</li>
        <li><strong>Arribo y descargue:</strong> el buque llega al terminal (por ejemplo, Contecar o la SPRC) y se reportan las diferencias entre lo manifestado y lo descargado.</li>
        <li><strong>Almacenamiento:</strong> la carga queda en un depósito habilitado bajo control aduanero. Como regla general puede permanecer 1 mes, prorrogable 1 mes más; si no se declara a tiempo, queda en abandono legal.</li>
        <li><strong>Declaración y pago:</strong> se presenta la declaración y se pagan los tributos en bancos autorizados.</li>
        <li><strong>Gestión de riesgo de la DIAN:</strong>
          <ul>
            <li><em>Levante automático:</em> se autoriza sin inspección.</li>
            <li><em>Inspección documental:</em> un funcionario revisa los documentos soporte.</li>
            <li><em>Inspección física:</em> se revisa la mercancía; puede ser no intrusiva, con escáner.</li>
          </ul>
        </li>
        <li><strong><span class="term-glosario" data-glosario="Levante de Mercancía">Levante</span>:</strong> la DIAN autoriza disponer de la mercancía.</li>
        <li><strong>Pago al terminal y retiro:</strong> se pagan los servicios a la carga (uso de instalaciones, almacenamiento, manejo del contenedor) y el camión sale del puerto.</li>
        <li><strong>Devolución del contenedor:</strong> después de descargarlo en la bodega, se devuelve vacío a la naviera dentro de los días libres; si se pasan, hay cobros por demora.</li>
      </ol>
      <p><strong>Reforma en camino:</strong> el Decreto 659 de 2024 prevé volver obligatoria la declaración anticipada. Esas disposiciones empiezan a regir cuando la DIAN certifique sus sistemas informáticos; verifica su estado antes de aplicarlas.</p>
    `,
    etapaCaso: "El buque llega al terminal de Contecar y el contenedor pasa al depósito. Se presenta la declaración, se pagan $65.264.000 de tributos y la DIAN otorga levante automático. HidroColombia paga los servicios del terminal (valor de ejemplo: $450.000), el camión lleva el contenedor a la bodega y, una vez descargado, lo devuelve vacío al patio de la naviera dentro de los días libres.",
    practica: {
      texto: "Simula tiempos, costos y riesgos de la operación",
      moduloUrl: "/simulador",
      parametros: { escenario: "caso_bombas" }
    },
    quiz: [
      {
        pregunta: "¿Qué significa que la DIAN otorgue levante automático?",
        opciones: [
          "Que inspeccionó la carga y luego la autorizó",
          "Que el puerto entrega la carga sin cobrar",
          "Que la mercancía quedó en abandono legal",
          "Que autoriza disponer de la mercancía sin inspección"
        ],
        correcta: 3,
        explicacion: "El levante automático lo otorga el sistema de gestión de riesgo sin inspección. Si hay inspección documental o física, el levante llega después de ella."
      },
      {
        pregunta: "¿Qué pasa si la mercancía no se declara dentro del término de almacenamiento?",
        opciones: [
          "Queda en abandono legal",
          "Se nacionaliza automáticamente",
          "Se devuelve al exportador sin costo",
          "El plazo se prorroga indefinidamente"
        ],
        correcta: 0,
        explicacion: "Vencido el término de almacenamiento (y su prórroga, si se pidió) sin declarar, la mercancía queda en abandono legal."
      },
      {
        pregunta: "El contenedor ya se descargó en la bodega de HidroColombia. ¿Qué falta?",
        opciones: [
          "Presentar otra declaración de importación",
          "Devolver el contenedor vacío a la naviera dentro de los días libres",
          "Pedir el visto bueno de la SIC",
          "Nada: el contenedor pasa a ser del importador"
        ],
        correcta: 1,
        explicacion: "El contenedor es de la naviera. Si no se devuelve dentro de los días libres, genera cobros por demora."
      },
      {
        pregunta: "Si la DIAN ordena inspección física, ¿qué verifica?",
        opciones: [
          "Solo el peso del contenedor",
          "Solo los documentos, sin revisar la mercancía",
          "Que la mercancía coincida con lo declarado: naturaleza, cantidad, estado y subpartida",
          "Que se hayan pagado los servicios del puerto"
        ],
        correcta: 2,
        explicacion: "La inspección física compara la mercancía con lo declarado. Revisar solo los documentos es la inspección documental."
      }
    ]
  },
  // ═════════════════════════════════ MÓDULO 2: EXPORTACIÓN Y ORIGEN

  // ───────────────────────────────── 9
  {
    id: 9,
    orden: 9,
    modulo: 2,
    titulo: "Exportar desde Colombia: requisitos, modalidades y beneficios",
    nivel: "Fundamentos",
    duracionMin: 20,
    objetivos: [
      "Saber qué necesita una empresa para exportar",
      "Conocer las modalidades de exportación",
      "Entender por qué una exportación no paga arancel ni IVA"
    ],
    contenido: `
      <p>Exportar es sacar mercancías del territorio aduanero nacional hacia otro país o hacia una zona franca. Lo regula el mismo <strong>Decreto 1165 de 2019</strong> (arts. 340 y siguientes) y el declarante es el exportador o la agencia de aduanas que lo represente.</p>

      <h4>Requisitos del exportador</h4>
      <ul>
        <li><strong>RUT</strong> con la responsabilidad 10 (usuario aduanero) y el código <strong>22, exportador</strong>, en la casilla 54.</li>
        <li><strong>Firma digital</strong> (certificado digital de la DIAN) para firmar la declaración de exportación; quien no lo tiene la firma con asistencia de un funcionario (art. 400 de la Resolución 46 de 2019).</li>
        <li><strong>Vistos buenos</strong> cuando el producto o el país de destino los exigen: por ejemplo, certificados sanitarios o fitosanitarios. El comprador en el exterior suele indicar cuáles pide su aduana.</li>
        <li>Para el café hay reglas propias: solo se exporta café que cumpla los requisitos de calidad del Comité Nacional de Cafeteros, que vigila la Federación Nacional de Cafeteros (art. 418), y antes de exportar se paga la <strong>contribución cafetera</strong> (art. 414).</li>
      </ul>

      <h4>Modalidades (art. 343)</h4>
      <p>Exportación definitiva; temporal para perfeccionamiento pasivo (por ejemplo, una reparación en el exterior); temporal para reimportación en el mismo estado (ferias o exposiciones); reexportación; reembarque; tráfico postal y envíos urgentes; muestras sin valor comercial; exportaciones temporales de viajeros; menaje; y programas especiales de exportación.</p>

      <h4>Tributos y beneficios</h4>
      <ul>
        <li>La exportación de bienes <strong>no paga arancel</strong> en Colombia.</li>
        <li>Los bienes que se exportan son <strong>exentos de IVA con derecho a devolución</strong> (art. 481 del Estatuto Tributario): el exportador no cobra IVA y puede pedir que le devuelvan el IVA que pagó en sus compras.</li>
        <li>Las divisas de la venta deben <strong>canalizarse por el mercado cambiario</strong> (bancos o cuentas de compensación) dentro de los seis meses siguientes a su recibo, con la declaración de cambio (Circular DCIP-83 del Banco de la República).</li>
      </ul>
    `,
    etapaCaso: "Café del Caribe Exportadores S.A.S. (empresa ficticia), en Cartagena, le vendió a un distribuidor de Hamburgo 18.000 kg de café tostado en grano (subpartida 0901.21.10.00) a USD 9 por kilo, en términos FOB Cartagena: un valor FOB de USD 162.000 (valores de práctica). Antes de embarcar revisa que su RUT tenga el código 22, que el café cumpla los requisitos de calidad y que la contribución cafetera esté pagada. La factura sale sin IVA, porque la exportación es exenta.",
    practica: {
      texto: "Calcula el valor FOB en pesos en la calculadora de exportación definitiva",
      moduloUrl: "/exportacion/definitiva",
      parametros: { fob: 162000, trm: 4100 }
    },
    quiz: [
      {
        pregunta: "¿Qué código debe tener el RUT de una empresa en la casilla 54 para exportar?",
        opciones: [
          "El 23, importador",
          "El 22, exportador",
          "El 48, impuesto sobre las ventas",
          "Ninguno: el RUT no tiene relación con la exportación"
        ],
        correcta: 1,
        explicacion: "La casilla 54 registra la calidad de usuario aduanero: 22 es exportador y 23 importador. Además debe tener la responsabilidad 10, usuario aduanero."
      },
      {
        pregunta: "¿Cómo trata el IVA la venta de bienes que se exportan?",
        opciones: [
          "Se cobra el 19% al comprador del exterior",
          "Se cobra el 5% por ser una exportación",
          "Es exenta, con derecho a que le devuelvan al exportador el IVA que pagó en sus compras",
          "Está excluida, sin derecho a devolución"
        ],
        correcta: 2,
        explicacion: "El artículo 481 del Estatuto Tributario hace exentos a los bienes que se exportan, con derecho a devolución. Por eso el exportador no cobra IVA y puede recuperar el que pagó."
      },
      {
        pregunta: "Una empresa envía una máquina a Alemania para que la reparen y vuelva. ¿Qué modalidad usa?",
        opciones: [
          "Exportación definitiva",
          "Reembarque",
          "Exportación temporal para perfeccionamiento pasivo",
          "Muestras sin valor comercial"
        ],
        correcta: 2,
        explicacion: "Cuando la mercancía sale para un proceso de elaboración, transformación o reparación en el exterior y luego regresa, la modalidad es exportación temporal para perfeccionamiento pasivo."
      },
      {
        pregunta: "¿Qué debe hacer el exportador con los dólares que le paga el comprador del exterior?",
        opciones: [
          "Nada: puede dejarlos en el exterior sin informar",
          "Canalizarlos por el mercado cambiario, con la declaración de cambio, dentro de los seis meses siguientes a su recibo",
          "Entregarlos a la DIAN junto con la declaración de exportación",
          "Cambiarlos en efectivo en una casa de cambio sin ningún registro"
        ],
        correcta: 1,
        explicacion: "La exportación de bienes es una operación de canalización obligatoria: las divisas se canalizan por un intermediario del mercado cambiario o por una cuenta de compensación, con la declaración de cambio (Circular DCIP-83)."
      }
    ]
  },

  // ───────────────────────────────── 10
  {
    id: 10,
    orden: 10,
    modulo: 2,
    titulo: "Origen de las mercancías y acuerdos comerciales (TLC)",
    nivel: "Intermedio",
    duracionMin: 25,
    objetivos: [
      "Entender cómo un acuerdo comercial baja el arancel",
      "Distinguir las reglas de origen más comunes",
      "Saber quién expide la prueba de origen y cuándo se presenta"
    ],
    contenido: `
      <p>Un <span class="term-glosario" data-glosario="TLC">acuerdo comercial</span> da <strong>preferencias arancelarias</strong>: un arancel menor, muchas veces del 0%, para las mercancías <strong>originarias</strong> de los países que lo firmaron. Sin acuerdo, o si la mercancía no prueba su origen, se paga el arancel general de nación más favorecida.</p>
      <p>Colombia tiene acuerdos vigentes, entre otros, con la Comunidad Andina, Mercosur, México, Chile, Estados Unidos, Canadá, la Unión Europea, la AELC (EFTA), Corea, la Alianza del Pacífico, Costa Rica, Israel y el Reino Unido. No tiene acuerdo con China ni con Japón. La lista oficial está en tlc.gov.co.</p>

      <h4><span class="term-glosario" data-glosario="Reglas de Origen">Reglas de origen</span></h4>
      <p>Cada acuerdo define cuándo una mercancía es originaria. Los criterios más comunes son:</p>
      <ul>
        <li><strong>Totalmente obtenida:</strong> cultivada, cosechada, extraída o criada en el país (por ejemplo, café cultivado y cosechado en Colombia).</li>
        <li><strong>Cambio de clasificación arancelaria:</strong> los insumos importados cambian de capítulo, partida o subpartida al transformarse.</li>
        <li><strong>Valor de contenido regional:</strong> un porcentaje mínimo del valor se agrega en los países del acuerdo.</li>
        <li><strong>Requisitos específicos por producto:</strong> reglas propias para ciertas subpartidas.</li>
      </ul>
      <p>Las operaciones mínimas, como empacar, etiquetar o mezclar, no confieren origen, y la mercancía debe cumplir las condiciones de expedición directa del acuerdo.</p>

      <h4><span class="term-glosario" data-glosario="Prueba de Origen">Prueba de origen</span></h4>
      <ul>
        <li>La expide el productor, el exportador o la autoridad competente, según el acuerdo (art. 312 del Decreto 1165 de 2019). En Colombia la autoridad competente es la <strong>DIAN</strong>, y antes de expedir la prueba se presenta la <strong>declaración juramentada de origen</strong>.</li>
        <li>Algunos acuerdos usan certificados que expide la autoridad; otros permiten la certificación del exportador, del productor o del importador. Con la Unión Europea se usa el certificado EUR.1 o la declaración de origen de un exportador autorizado.</li>
        <li>Al importar, la prueba de origen es un documento soporte: debe obtenerse <strong>antes</strong> de presentar la declaración de importación (arts. 177 y 313). Si después no se cumplen las normas de origen, el importador debe pagar los tributos (art. 309).</li>
        <li>Quien la expide y quien pide la preferencia deben conservar los documentos que prueban el origen (art. 317), y la DIAN puede verificar el origen (art. 318).</li>
      </ul>
    `,
    etapaCaso: "La Unión Europea cobra un arancel general del 7,5% al café tostado. Sobre un valor de USD 162.000 serían unos USD 12.150 (allá se calcula sobre su propio valor en aduana, que incluye el flete). Con el Acuerdo Comercial Colombia–UE, el café tostado colombiano entra con arancel del 0% si prueba su origen. La regla del acuerdo exige que el café se haya cultivado y cosechado en los países del acuerdo: Café del Caribe tuesta café colombiano, así que califica. Presenta ante la DIAN la declaración juramentada de origen y solicita la prueba de origen para que su cliente en Hamburgo pida la preferencia. Si tostara café importado de Vietnam, no sería originario.",
    practica: {
      texto: "Repasa los términos TLC, valor en aduana y subpartida en el glosario",
      moduloUrl: "/glosario",
      parametros: { termino: "TLC" }
    },
    quiz: [
      {
        pregunta: "¿Qué necesita una mercancía para recibir el arancel preferencial de un acuerdo comercial?",
        opciones: [
          "Haberse embarcado en un puerto del país del acuerdo",
          "Cumplir las reglas de origen del acuerdo y presentar la prueba de origen",
          "Que el vendedor sea miembro de la OMC",
          "Que su valor FOB sea inferior a USD 5.000"
        ],
        correcta: 1,
        explicacion: "La preferencia es solo para mercancías originarias. Embarcar en un país del acuerdo no basta: si el producto es de otro país, no califica (art. 309 del Decreto 1165 de 2019)."
      },
      {
        pregunta: "Una empresa importa tela de un país sin acuerdo y en Colombia la convierte en camisas que exporta a un país con TLC. ¿Qué criterio de origen podría cumplir?",
        opciones: [
          "Totalmente obtenido",
          "Ninguno: si un insumo es importado, nunca hay origen",
          "Cambio de clasificación arancelaria, si el acuerdo lo permite para esa camisa",
          "Origen automático por ser fabricada en una zona franca"
        ],
        correcta: 2,
        explicacion: "Al confeccionar la camisa, el insumo cambia de clasificación. Si la regla específica del acuerdo acepta ese cambio, la camisa puede ser originaria aunque la tela sea importada."
      },
      {
        pregunta: "En Colombia, ¿qué se presenta ante la DIAN antes de que expida una prueba de origen?",
        opciones: [
          "La declaración de importación",
          "La declaración juramentada de origen",
          "El registro de importación en la VUCE",
          "La Declaración Andina del Valor"
        ],
        correcta: 1,
        explicacion: "El artículo 312 del Decreto 1165 de 2019 exige como soporte la declaración juramentada de origen vigente para que la autoridad o un exportador autorizado expidan la prueba de origen."
      },
      {
        pregunta: "Un importador colombiano quiere la preferencia del TLC con Estados Unidos. ¿Cuándo debe tener la prueba de origen?",
        opciones: [
          "Antes de presentar y aceptar la declaración de importación",
          "Dentro del año siguiente al levante",
          "Solo si la DIAN la pide en una inspección",
          "Nunca: la preferencia se aplica automáticamente"
        ],
        correcta: 0,
        explicacion: "La prueba de origen es un documento soporte de la declaración y debe obtenerse antes de presentarla y aceptarla (arts. 177 y 313 del Decreto 1165 de 2019)."
      }
    ]
  },

  // ───────────────────────────────── 11
  {
    id: 11,
    orden: 11,
    modulo: 2,
    titulo: "El trámite de exportación: del embarque a la declaración (DEX)",
    nivel: "Avanzado",
    duracionMin: 25,
    objetivos: [
      "Seguir los pasos de la exportación en orden",
      "Conocer la solicitud de autorización de embarque y su vigencia",
      "Saber cuándo se presenta la declaración de exportación"
    ],
    contenido: `
      <h4>Los pasos (arts. 347 a 363 del Decreto 1165 de 2019)</h4>
      <ol>
        <li><strong><span class="term-glosario" data-glosario="SAE">Solicitud de autorización de embarque (SAE)</span>:</strong> el exportador o su agencia la presenta en los servicios informáticos de la DIAN, ante la seccional donde está la mercancía. Puede ser un embarque único o una autorización global con embarques fraccionados, con datos definitivos o provisionales.</li>
        <li><strong>Vigencia de un mes:</strong> dentro de ese mes la mercancía debe trasladarse e ingresar a la zona primaria (el puerto) y embarcarse. Si vence, hay que presentar una nueva SAE (art. 352).</li>
        <li><strong>Ingreso a zona primaria y gestión de riesgo:</strong> la DIAN autoriza el embarque directamente o después de una inspección documental, física o no intrusiva.</li>
        <li><strong>Embarque:</strong> se carga la mercancía en el medio de transporte, con la autorización de la aduana.</li>
        <li><strong>Certificación del embarque:</strong> el transportador transmite a la DIAN el manifiesto de carga con lo embarcado (art. 362).</li>
        <li><strong>Declaración de exportación (DEX, formulario 600):</strong> certificado el embarque, el declarante firma y presenta la declaración que generan los servicios informáticos de la DIAN, en la que se declara el valor FOB (art. 363 y art. 400 de la Resolución 46 de 2019).</li>
      </ol>

      <h4>Después de embarcar</h4>
      <ul>
        <li>El declarante conserva los documentos soporte (la factura u otro documento de la operación, los vistos buenos y el mandato) durante <strong>5 años</strong> desde la aceptación de la SAE (art. 349).</li>
        <li>Canaliza las divisas por el mercado cambiario y, con la DEX, puede tramitar la devolución del IVA de sus compras.</li>
      </ul>
    `,
    etapaCaso: "Café del Caribe presenta la SAE en la Dirección Seccional de Aduanas de Cartagena (48) y tiene un mes para embarcar. El contenedor con el café ingresa al terminal, la DIAN autoriza el embarque sin inspección y la carga sube al buque con destino a Hamburgo. La naviera transmite el manifiesto de carga, con lo que el embarque queda certificado, y Café del Caribe firma y presenta la DEX por USD 162.000 FOB. Luego canaliza los dólares que le gira el comprador y archiva los soportes durante 5 años.",
    practica: {
      texto: "Practica el diligenciamiento del formulario 600 (DEX)",
      moduloUrl: "/formularios",
      parametros: { form: "600" }
    },
    quiz: [
      {
        pregunta: "¿Con qué trámite empieza una exportación?",
        opciones: [
          "Con la declaración de exportación (DEX)",
          "Con la solicitud de autorización de embarque",
          "Con la certificación del embarque por el transportador",
          "Con el pago del arancel de exportación"
        ],
        correcta: 1,
        explicacion: "El artículo 347 del Decreto 1165 de 2019 dice que el trámite se inicia con la presentación y aceptación de la solicitud de autorización de embarque. La DEX se presenta al final."
      },
      {
        pregunta: "¿Cuánto tiempo tiene el exportador para ingresar la mercancía a puerto y embarcarla después de aceptada la SAE?",
        opciones: [
          "Quince días",
          "Un mes",
          "Seis meses",
          "No hay plazo"
        ],
        correcta: 1,
        explicacion: "La solicitud de autorización de embarque tiene una vigencia de un mes desde su aceptación; si vence, debe tramitarse una nueva (art. 352)."
      },
      {
        pregunta: "¿Quién certifica el embarque ante la DIAN?",
        opciones: [
          "El exportador, con la factura comercial",
          "La sociedad portuaria",
          "El transportador, al transmitir el manifiesto de carga",
          "El comprador en el país de destino"
        ],
        correcta: 2,
        explicacion: "El transportador transmite la información del manifiesto de carga según los embarques autorizados, y con ello el embarque queda certificado (art. 362)."
      },
      {
        pregunta: "¿Qué valor se declara en la declaración de exportación?",
        opciones: [
          "El valor CIF en el puerto de destino",
          "El valor FOB",
          "El precio de venta más el IVA",
          "El valor en aduana del país de destino"
        ],
        correcta: 1,
        explicacion: "En la exportación se declara el valor FOB. Si la venta se pactó en CIF u otro término que incluya flete y seguro, esos conceptos se informan aparte."
      }
    ]
  },

  // ───────────────────────────────── 12
  {
    id: 12,
    orden: 12,
    modulo: 3,
    titulo: "Modalidades de importación: no todo es importación ordinaria",
    nivel: "Fundamentos",
    duracionMin: 20,
    objetivos: [
      "Conocer las modalidades de importación del régimen de aduanas",
      "Distinguir entre libre disposición y disposición restringida",
      "Elegir la modalidad según lo que va a pasar con la mercancía"
    ],
    contenido: `
      <p>En el módulo 1 hiciste una <strong>importación ordinaria</strong>: la mercancía entra para quedarse de manera indefinida, paga los tributos y queda en <strong>libre disposición</strong> (art. 173 del Decreto 1165 de 2019). Pero no toda mercancía entra para quedarse, ni toda paga tributos. El artículo 172 enumera doce modalidades de importación, y el decreto regula aparte el régimen de exportación y el de tránsito.</p>

      <h4>Las modalidades (art. 172)</h4>
      <ul>
        <li><strong>Ordinaria</strong> (art. 173): para permanecer de manera indefinida, en libre disposición, con el pago de los tributos aduaneros.</li>
        <li><strong>Con franquicia</strong> (art. 193): un tratado, un convenio o una ley exonera total o parcialmente los tributos. La mercancía queda en disposición restringida: para venderla o cambiarle el destino hay que modificar antes la declaración y pagar los tributos exonerados (art. 195).</li>
        <li><strong>Reimportación en el mismo estado</strong> (art. 198): vuelve sin pagar tributos la mercancía que se exportó y no se modificó en el exterior. Por regla general, la declaración se presenta dentro del año siguiente a la exportación.</li>
        <li><strong>En cumplimiento de garantía</strong> (art. 199): entra sin tributos la mercancía que se reparó en el exterior, o la que reemplaza a una averiada o defectuosa, por la garantía del fabricante o proveedor.</li>
        <li><strong><span class="term-glosario" data-glosario="Importación Temporal">Temporal para reexportación en el mismo estado</span></strong> (art. 200): entra con los tributos suspendidos y debe volver a salir en un plazo, sin modificaciones.</li>
        <li><strong>Temporal para perfeccionamiento activo</strong> y <strong>transformación y/o ensamble</strong>: para reparar, procesar o ensamblar mercancías.</li>
        <li><strong>Otras:</strong> reimportación por perfeccionamiento pasivo, tráfico postal y envíos urgentes, entregas urgentes, viajeros y muestras sin valor comercial.</li>
      </ul>

      <h4>Libre disposición o disposición restringida</h4>
      <p>Según la modalidad, la mercancía queda en libre o en restringida disposición. En disposición restringida no se puede vender ni destinar a otro fin sin cumplir antes las condiciones de la modalidad. Salvo en la de viajeros, a todas las modalidades se les aplican las reglas de la importación ordinaria, con las excepciones propias de cada una (art. 172).</p>

      <h4>Tres preguntas para elegir</h4>
      <ul>
        <li><strong>¿La mercancía se queda en el país o vuelve a salir?</strong> Si vuelve a salir sin cambios, una importación temporal evita pagar tributos por algo que no se va a quedar.</li>
        <li><strong>¿Alguna norma la exonera?</strong> Si un tratado, un convenio o una ley concede la exención, procede la franquicia.</li>
        <li><strong>¿Ya estuvo en Colombia?</strong> Si se exportó y regresa igual, o regresa reparada por garantía, hay modalidades que no pagan tributos.</li>
      </ul>
    `,
    etapaCaso: "Andina Pack S.A.S. (empresa ficticia) distribuye en Colombia las máquinas del fabricante italiano Linea Pack S.r.l. (ficticio) y es usuario comercial de una zona franca de la Sabana de Bogotá. Quiere traer una máquina llenadora de botellas de demostración, de USD 80.000 FOB Génova, para mostrarla a sus clientes; todavía no sabe si se venderá en Colombia o en otro país. Con una importación ordinaria pagaría de entrada $86.951.000 de arancel e IVA (valores de práctica: flete USD 4.500, seguro USD 500, arancel de práctica del 5% y TRM de $4.100). Decide no nacionalizarla todavía: la traerá consignada a su nombre a la zona franca y, cuando haya una feria, la sacará con una importación temporal.",
    practica: {
      texto: "Compara la importación ordinaria, la franquicia y la temporal con los valores de la máquina",
      moduloUrl: "/importacion/ordinaria",
      parametros: { fob: 80000, flete: 4500, seguro: 500, arancel: 5, trm: 4100 }
    },
    quiz: [
      {
        pregunta: "¿Cuál de estas NO es una modalidad de importación del artículo 172 del Decreto 1165 de 2019?",
        opciones: [
          "Importación con franquicia",
          "Reimportación en el mismo estado",
          "Tránsito aduanero",
          "Muestras sin valor comercial"
        ],
        correcta: 2,
        explicacion: "El tránsito aduanero no es una modalidad de importación: pertenece al régimen de tránsito (art. 432). Las otras tres están en la lista del artículo 172."
      },
      {
        pregunta: "Una empresa colombiana exportó temporalmente una máquina para exhibirla en una feria en Panamá y ahora regresa sin cambios. ¿Qué modalidad usa?",
        opciones: [
          "Reimportación en el mismo estado",
          "Importación ordinaria, pagando arancel e IVA",
          "Importación con franquicia",
          "Importación en cumplimiento de garantía"
        ],
        correcta: 0,
        explicacion: "La mercancía que se exportó y no se modificó en el exterior vuelve sin pagar tributos por la reimportación en el mismo estado (art. 198), si se prueba que es la misma que salió."
      },
      {
        pregunta: "¿Qué significa que una mercancía quede en disposición restringida?",
        opciones: [
          "Que la DIAN la retiene en el puerto hasta que se paguen los tributos",
          "Que no se puede vender ni cambiar de destino sin cumplir antes las condiciones de la modalidad",
          "Que solo puede usarse dentro de una zona franca",
          "Que el importador no puede usarla durante el primer año"
        ],
        correcta: 1,
        explicacion: "La disposición restringida limita lo que el importador puede hacer con la mercancía. Por ejemplo, en la franquicia hay que modificar la declaración y pagar los tributos exonerados antes de venderla (art. 195)."
      },
      {
        pregunta: "Andina Pack no sabe si la llenadora se quedará en Colombia. ¿Por qué no le conviene la importación ordinaria?",
        opciones: [
          "Porque las máquinas no se pueden importar por la modalidad ordinaria",
          "Porque la importación ordinaria exige que el importador sea una agencia de aduanas",
          "Porque en la ordinaria la mercancía queda en disposición restringida",
          "Porque pagaría de entrada el arancel y el IVA de una mercancía que quizá vuelva a salir"
        ],
        correcta: 3,
        explicacion: "La importación ordinaria es para mercancía que permanece de manera indefinida y exige pagar los tributos (art. 173). Si la máquina puede volver a salir, hay modalidades que no obligan a pagarlos de entrada."
      }
    ]
  },

  // ───────────────────────────────── 13
  {
    id: 13,
    orden: 13,
    modulo: 3,
    titulo: "Tránsito aduanero: del puerto a otra aduana bajo control",
    nivel: "Intermedio",
    duracionMin: 25,
    objetivos: [
      "Saber qué es el tránsito aduanero y cuándo se puede pedir",
      "Seguir los pasos de una operación de tránsito",
      "Identificar las garantías y quién responde por la mercancía"
    ],
    contenido: `
      <p>El <span class="term-glosario" data-glosario="Tránsito Aduanero">tránsito aduanero</span> permite transportar por tierra, <strong>bajo control aduanero</strong>, mercancías de una aduana a otra dentro del país (art. 432 del Decreto 1165 de 2019). La mercancía viaja sin haberse declarado en importación: por eso va precintada y el declarante garantiza los tributos.</p>

      <h4>Cuándo se puede pedir (art. 433)</h4>
      <p>No es para cualquier carga. Solo se autoriza cuando la mercancía:</p>
      <ul>
        <li>viene consignada o se endosa a un <strong>usuario de zona franca</strong>, al titular de un depósito privado, o a la Nación y otras entidades públicas;</li>
        <li>se va a someter a transformación y/o ensamble o a una importación temporal para perfeccionamiento activo;</li>
        <li>o viene consignada a un Operador Económico Autorizado (OEA) o a un usuario aduanero con trámite simplificado, casos en los que procede para cualquier modalidad de importación.</li>
      </ul>

      <h4>Los pasos</h4>
      <ol>
        <li><strong>Solicitud:</strong> una vez descargada la mercancía y <strong>sin ingresarla a depósito</strong> (art. 438), el declarante presenta la <span class="term-glosario" data-glosario="DTA">declaración de tránsito aduanero (DTA)</span> ante la <strong>aduana de partida</strong>, en los servicios informáticos de la DIAN (art. 439), soportada en el documento de transporte y en la factura comercial o proforma (art. 440).</li>
        <li><strong>Transportador:</strong> el tránsito solo se hace en vehículos de empresas inscritas y autorizadas por la DIAN (art. 434).</li>
        <li><strong>Garantías (art. 436):</strong> el declarante respalda los tributos y las sanciones. Una agencia de aduanas lo hace con su garantía global; quien no tiene garantía global constituye una específica por el <strong>40% del valor FOB</strong>. El transportador respalda con su garantía global la finalización del tránsito.</li>
        <li><strong>Precintos:</strong> la aduana autoriza el tránsito si la unidad de carga viene sellada y precintada. En la aduana de partida no hay inspección, salvo malas condiciones exteriores, diferencias de peso o señales de que se violaron los precintos (art. 443).</li>
        <li><strong>Plazo y ruta:</strong> la aduana fija la duración según la distancia (art. 444). El vehículo usa la ruta más directa y los precintos deben llegar intactos (art. 445).</li>
        <li><strong>Finalización (art. 448):</strong> el tránsito termina con la entrega de la carga al depósito o al <span class="term-glosario" data-glosario="Usuario Operador">usuario operador</span> de la zona franca, que confronta cantidad, peso y estado de los bultos con la DTA. Si hay inconsistencias, elabora un acta e informa a la aduana.</li>
      </ol>

      <h4>Quién responde (art. 435)</h4>
      <p>El declarante responde por la información de la DTA y por los tributos de la mercancía que no llegue a la aduana de destino; si es una agencia de aduanas, responde por los tributos en cualquier evento. La empresa transportadora responde por finalizar el tránsito dentro del plazo autorizado.</p>
      <p>Cuando el traslado bajo control aduanero se hace por agua o por aire entre dos puertos o aeropuertos del país, la modalidad se llama <strong>cabotaje</strong> (art. 454).</p>
    `,
    etapaCaso: "El contenedor con la llenadora llega al Puerto de Cartagena. En el B/L viene consignado a Andina Pack, usuario de zona franca, así que el tránsito procede (art. 433). Su agencia de aduanas presenta la DTA ante la aduana de Cartagena, que es la aduana de partida, sin ingresar la carga a depósito. La aduana verifica que los precintos del contenedor estén intactos, autoriza el tránsito y fija el plazo. Un camión de una transportadora inscrita ante la DIAN lleva el contenedor por la ruta más directa hasta la zona franca, en la jurisdicción de la aduana de Bogotá. Allí el usuario operador revisa precintos, peso y bultos contra la DTA y registra la llegada: el tránsito termina.",
    practica: {
      texto: "Practica el diligenciamiento de la declaración de tránsito aduanero (formulario 650)",
      moduloUrl: "/formularios",
      parametros: { form: "650" }
    },
    quiz: [
      {
        pregunta: "¿Qué permite la modalidad de tránsito aduanero?",
        opciones: [
          "Nacionalizar la mercancía en el puerto sin pagar tributos",
          "Transportar por tierra mercancía bajo control aduanero de una aduana a otra dentro del país",
          "Exportar mercancía sin presentar la solicitud de autorización de embarque",
          "Retirar la mercancía del puerto antes de que llegue el buque"
        ],
        correcta: 1,
        explicacion: "El artículo 432 del Decreto 1165 de 2019 define el tránsito aduanero como el transporte terrestre de mercancías, bajo control aduanero, de una aduana a otra situadas en el territorio aduanero nacional."
      },
      {
        pregunta: "Según el artículo 433, ¿cuál de estas cargas puede ir en tránsito aduanero?",
        opciones: [
          "Un contenedor consignado a un usuario de zona franca",
          "Mercancía que ya obtuvo el levante en el puerto",
          "El equipaje de un viajero",
          "Cualquier carga, si el importador prefiere declararla en otra ciudad"
        ],
        correcta: 0,
        explicacion: "El tránsito solo se autoriza en los casos del artículo 433; uno de ellos es la mercancía consignada o endosada a un usuario de zona franca. No basta con que el importador prefiera otra ciudad."
      },
      {
        pregunta: "Un declarante sin garantía global pide un tránsito aduanero. ¿Por cuánto debe constituir la garantía específica?",
        opciones: [
          "Por el 5% del valor FOB de la mercancía",
          "Por el 100% de los tributos aduaneros",
          "Por el 40% del valor FOB de la mercancía",
          "No necesita garantía: basta la del transportador"
        ],
        correcta: 2,
        explicacion: "El artículo 436 exige al declarante una garantía específica equivalente al 40% del valor FOB de la mercancía cuando no cuenta con una garantía global, como la de las agencias de aduanas. La del transportador cubre otra cosa: la finalización del tránsito."
      },
      {
        pregunta: "¿Con qué termina normalmente una operación de tránsito aduanero?",
        opciones: [
          "Con el pago de los tributos en la aduana de partida",
          "Con la salida del camión del puerto",
          "Con la autorización de levante en la aduana de partida",
          "Con la entrega de la carga al depósito o al usuario operador de la zona franca de destino"
        ],
        correcta: 3,
        explicacion: "El artículo 448 dice que la modalidad finaliza con la entrega de la carga al depósito o al usuario operador de la zona franca, que la confronta con la DTA y registra la información en los servicios informáticos."
      }
    ]
  },

  // ───────────────────────────────── 14
  {
    id: 14,
    orden: 14,
    modulo: 3,
    titulo: "Zonas francas: dentro del país, fuera del territorio aduanero",
    nivel: "Intermedio",
    duracionMin: 20,
    objetivos: [
      "Entender qué es una zona franca y quiénes operan en ella",
      "Distinguir las operaciones de ingreso y salida de mercancías",
      "Saber cuándo se pagan los tributos de una mercancía que pasa por zona franca"
    ],
    contenido: `
      <p>Una <span class="term-glosario" data-glosario="Zona Franca">zona franca</span> es un área geográfica delimitada dentro del territorio nacional donde se desarrollan actividades industriales de bienes y de servicios, o actividades comerciales, con reglas especiales en materia tributaria, aduanera y de comercio exterior. Las mercancías que ingresan a ella <strong>se consideran fuera del territorio aduanero nacional</strong> para efectos de los impuestos a las importaciones y a las exportaciones (art. 1 de la Ley 1004 de 2005).</p>

      <h4>Clases de zonas francas (art. 3 del Decreto 2147 de 2016)</h4>
      <ul>
        <li><strong>Permanente:</strong> en ella se instalan múltiples usuarios industriales o comerciales.</li>
        <li><strong>Permanente especial:</strong> se instala un único usuario industrial.</li>
        <li><strong>Transitoria:</strong> el área donde se celebran ferias, exposiciones, congresos y seminarios de importancia para la economía o el comercio internacional.</li>
      </ul>

      <h4>Usuarios (art. 3 de la Ley 1004 de 2005)</h4>
      <ul>
        <li><strong><span class="term-glosario" data-glosario="Usuario Operador">Usuario operador</span>:</strong> dirige, administra y supervisa la zona franca y califica a sus usuarios. Autoriza todo ingreso y salida de bienes (art. 475 del Decreto 1165 de 2019).</li>
        <li><strong>Usuario industrial de bienes:</strong> produce, transforma o ensambla bienes.</li>
        <li><strong>Usuario industrial de servicios:</strong> presta servicios como logística, reparación, tecnología o salud.</li>
        <li><strong>Usuario comercial:</strong> hace mercadeo, comercialización, almacenamiento o conservación de bienes.</li>
      </ul>

      <h4>Las cuatro operaciones (Decreto 1165 de 2019)</h4>
      <ul>
        <li><strong>Del exterior a la zona franca:</strong> no se considera una importación. Solo se requiere que los bienes vengan consignados en el documento de transporte a un usuario de la zona, o que el documento se endose a su favor (art. 477).</li>
        <li><strong>De la zona franca al exterior:</strong> es una exportación, con autorización del usuario operador (art. 478).</li>
        <li><strong>Del resto del país a la zona franca:</strong> es una exportación definitiva cuando se trata de materias primas, partes, insumos y bienes terminados nacionales o en libre disposición, a favor del usuario operador o de un usuario industrial. El envío a un usuario comercial no se considera exportación (art. 479).</li>
        <li><strong>De la zona franca al resto del país:</strong> es una importación y sigue las reglas de las importaciones (art. 482). La mercancía extranjera almacenada se valora en el estado en que se encuentre y paga el arancel de su subpartida; a la que se fabricó en la zona franca se le descuenta del valor en aduana el valor agregado nacional (art. 483).</li>
      </ul>
    `,
    etapaCaso: "La llenadora queda almacenada en la bodega de Andina Pack en la zona franca. Como vino del exterior consignada a un usuario, su ingreso no fue una importación: no se presentó declaración de importación ni se pagaron arancel ni IVA. Allí puede permanecer mientras aparece un comprador. Si la compra un cliente de otro país, saldrá de la zona franca como una exportación, sin haber pagado tributos en Colombia. Si la compra una planta de Medellín, su salida al resto del país será una importación: en ese momento se declaran y se pagan el arancel y el IVA sobre su valor en aduana.",
    practica: {
      texto: "Repasa el término zona franca y sus términos relacionados en el glosario",
      moduloUrl: "/glosario",
      parametros: { termino: "Zona Franca" }
    },
    quiz: [
      {
        pregunta: "Para efectos de los impuestos a las importaciones y a las exportaciones, ¿cómo se consideran las mercancías que ingresan a una zona franca?",
        opciones: [
          "Fuera del territorio aduanero nacional",
          "Nacionalizadas y en libre disposición",
          "En abandono legal a favor de la Nación",
          "En tránsito aduanero permanente"
        ],
        correcta: 0,
        explicacion: "El artículo 1 de la Ley 1004 de 2005 dice que las mercancías ingresadas a la zona franca se consideran fuera del territorio aduanero nacional para efectos de los impuestos a las importaciones y a las exportaciones."
      },
      {
        pregunta: "¿Quién autoriza el ingreso y la salida de bienes de una zona franca?",
        opciones: [
          "El usuario comercial dueño de la bodega",
          "La sociedad portuaria",
          "El usuario operador",
          "La naviera que trajo la carga"
        ],
        correcta: 2,
        explicacion: "El usuario operador debe autorizar todo ingreso y salida de bienes de la zona franca, sin perjuicio de los demás requisitos aduaneros (art. 475 del Decreto 1165 de 2019)."
      },
      {
        pregunta: "Una fábrica de Cali vende insumos nacionales a un usuario industrial de bienes de una zona franca. ¿Qué es esa operación para la fábrica?",
        opciones: [
          "Una importación ordinaria",
          "Una exportación definitiva",
          "Un tránsito aduanero",
          "Una reimportación en el mismo estado"
        ],
        correcta: 1,
        explicacion: "La introducción a zona franca de materias primas, partes, insumos y bienes terminados nacionales, a favor del usuario operador o de un usuario industrial, se considera exportación definitiva (art. 479). Si el destinatario fuera un usuario comercial, no lo sería."
      },
      {
        pregunta: "Una mercancía extranjera almacenada en zona franca se vende a una empresa de Medellín. ¿Qué pasa cuando sale hacia el resto del país?",
        opciones: [
          "Sale libremente, porque ya estaba dentro de Colombia",
          "Se considera una exportación y no paga tributos",
          "Solo paga el IVA, nunca el arancel",
          "Es una importación: se declara y paga los tributos que correspondan"
        ],
        correcta: 3,
        explicacion: "La introducción al resto del territorio aduanero nacional de bienes procedentes de zona franca es una importación y se somete a las normas de las importaciones (art. 482 del Decreto 1165 de 2019)."
      }
    ]
  },

  // ───────────────────────────────── 15
  {
    id: 15,
    orden: 15,
    modulo: 3,
    titulo: "Importación temporal: usar la mercancía sin nacionalizarla",
    nivel: "Avanzado",
    duracionMin: 25,
    objetivos: [
      "Distinguir la importación temporal de corto y de largo plazo",
      "Entender la suspensión de tributos y la garantía",
      "Saber cómo se termina la modalidad y qué pasa si se vence el plazo"
    ],
    contenido: `
      <p>La <span class="term-glosario" data-glosario="Importación Temporal">importación temporal para reexportación en el mismo estado</span> permite traer mercancía con los <strong>tributos aduaneros suspendidos</strong>, para reexportarla en un plazo señalado y sin modificaciones, salvo la depreciación normal por el uso. Mientras tanto queda en disposición restringida (art. 200 del Decreto 1165 de 2019). No sirve para mercancías fungibles ni para las que no puedan identificarse plenamente.</p>

      <h4>Dos clases (art. 201)</h4>
      <ul>
        <li><strong>De corto plazo:</strong> para una finalidad específica de corta permanencia, como exhibir mercancía en ferias y exposiciones (la lista está en el art. 232 de la Resolución 46 de 2019). El plazo máximo es de <strong>seis meses</strong> desde el levante, prorrogables por tres más. Los tributos se liquidan en la declaración, pero <strong>no se pagan</strong> (art. 202).</li>
        <li><strong>De largo plazo:</strong> para bienes de capital, con sus piezas y accesorios. El plazo máximo es de <strong>cinco años</strong>. Los tributos se liquidan en dólares y se pagan en cuotas semestrales iguales, por semestres vencidos (art. 203).</li>
      </ul>

      <h4>Garantía (art. 205)</h4>
      <p>La aduana exige una garantía a favor de la Nación que respalda la finalización de la modalidad, con los tributos, los intereses y la sanción a que haya lugar: por regla general es del 150% de los tributos, y en el corto plazo, del <strong>100% de los tributos</strong> que se habrían causado en una importación ordinaria. No se exige para mercancías destinadas a eventos científicos, culturales, deportivos o recreativos.</p>

      <h4>Cómo termina (art. 214)</h4>
      <ul>
        <li>Con la <strong><span class="term-glosario" data-glosario="Reexportación">reexportación</span></strong>, que se tramita como una exportación: solicitud de autorización de embarque y declaración (arts. 380 y 381). Los bienes de capital también pueden reexportarse a una zona franca, a nombre de un usuario industrial o comercial (art. 480).</li>
        <li>Con la <strong>importación ordinaria</strong> o con franquicia: antes de que venza el plazo se modifica la declaración, se pagan los tributos y se obtiene el levante (art. 208).</li>
        <li>Con la modificación de oficio a importación ordinaria que hace la DIAN por incumplimiento, con la destrucción de la mercancía por fuerza mayor o caso fortuito demostrados, o con su legalización.</li>
      </ul>

      <h4>Si se vence el plazo (art. 208)</h4>
      <p>En el corto plazo, si la mercancía no se reexporta ni se modifica la declaración a tiempo, se aprehende y la garantía se hace efectiva por los tributos y la sanción, a menos que el importador la legalice voluntariamente pagando los tributos y la sanción.</p>
    `,
    etapaCaso: "Andina Pack exhibirá la llenadora durante tres meses en una feria industrial en Bogotá, donde no puede venderse mientras dure el evento. Sacarla de la zona franca al resto del país es una importación, así que presenta una declaración de importación temporal de corto plazo por tres meses. En ella liquida el arancel de práctica del 5% ($17.425.000) y el IVA del 19% ($69.526.000) sobre un valor en aduana de USD 85.000 a una TRM de $4.100, pero no los paga: quedan suspendidos $86.951.000 y constituye una garantía por ese mismo valor. Al terminar la feria, antes de que venza el plazo, reexporta la máquina a la zona franca a nombre de Andina Pack, porque es un bien de capital (art. 480): la modalidad termina sin pagar tributos. Si hubiera decidido dejarla en el país, habría tenido que modificar la declaración a importación ordinaria y pagar los tributos antes del vencimiento.",
    practica: {
      texto: "Calcula los tributos suspendidos de la máquina en la calculadora de importación temporal",
      moduloUrl: "/importacion/temporal-corto",
      parametros: { fob: 80000, flete: 4500, seguro: 500, arancel: 5, trm: 4100 }
    },
    quiz: [
      {
        pregunta: "¿Qué pasa con los tributos aduaneros en una importación temporal de corto plazo?",
        opciones: [
          "Se pagan completos al presentar la declaración y se devuelven al reexportar",
          "No se liquidan ni se pagan, porque la mercancía no es una importación",
          "Se liquidan en la declaración, pero no se pagan: quedan suspendidos y respaldados con una garantía",
          "Se pagan en cuotas mensuales mientras la mercancía esté en el país"
        ],
        correcta: 2,
        explicacion: "En la declaración de importación temporal de corto plazo se liquidan los tributos para constituir la garantía, pero no se pagan (art. 202 del Decreto 1165 de 2019)."
      },
      {
        pregunta: "¿Cuál es el plazo máximo de una importación temporal de corto plazo?",
        opciones: [
          "Un mes, sin prórroga",
          "Seis meses desde el levante, prorrogables por tres meses más",
          "Un año, prorrogable por otro año",
          "Cinco años"
        ],
        correcta: 1,
        explicacion: "El artículo 201 fija para el corto plazo un máximo de seis meses contados desde el levante, prorrogables por tres meses más. Los cinco años son el máximo del largo plazo."
      },
      {
        pregunta: "Una constructora trae una grúa, que es un bien de capital, en importación temporal de largo plazo por tres años. ¿Cómo paga los tributos?",
        opciones: [
          "En cuotas semestrales iguales, por semestres vencidos",
          "No paga nada: en toda importación temporal los tributos quedan suspendidos",
          "Todo de contado al presentar la declaración",
          "En un solo pago al final de los tres años"
        ],
        correcta: 0,
        explicacion: "En el largo plazo los tributos se liquidan en dólares y se distribuyen en cuotas semestrales iguales durante el término de permanencia, que se pagan por semestres vencidos (art. 203)."
      },
      {
        pregunta: "Faltan pocos días para que venza el plazo y Andina Pack decide dejar la máquina en Colombia. ¿Qué debe hacer?",
        opciones: [
          "Nada: al vencer el plazo la máquina pasa sola a libre disposición",
          "Venderla y avisar después a la DIAN",
          "Pedir a la aseguradora que pague los tributos con la garantía",
          "Modificar la declaración a importación ordinaria, pagar los tributos y obtener el levante antes del vencimiento"
        ],
        correcta: 3,
        explicacion: "El artículo 208 exige que, antes de que venza el plazo, el importador modifique la declaración de importación temporal a ordinaria y obtenga el levante, o reexporte la mercancía. Si no lo hace, en el corto plazo la mercancía se aprehende y la garantía se hace efectiva."
      }
    ]
  }
];
