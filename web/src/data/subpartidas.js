// ============================================================
//  BonCloud — Catálogo de subpartidas arancelarias (referencia educativa)
//
//  Arancel: tarifa vigente para importaciones sin preferencia (nación más
//  favorecida): la del Decreto 1881 de 2021 con los decretos que la modifican
//  (por ejemplo, el 0% del Decreto 272 de 2018). Revisado en octubre de 2026.
//
//  Estructura del código: 6 dígitos del Sistema Armonizado (versión 2022),
//  2 de la NANDINA y 2 nacionales. El arancel y el IVA son valores de
//  referencia para practicar: cambian por decreto (Decreto 1881 de 2021 y sus
//  modificaciones) y por acuerdos comerciales, así que antes de una operación
//  real se confirman en el Arancel de Aduanas de la DIAN.
//
// ============================================================

export const subpartidas = [
  {
    codigo: '8413.60.90.00', titulo: 'Bombas volumétricas rotativas (engranajes, paletas, tornillo)',
    desc: 'Bombas para líquidos volumétricas rotativas sin motor, como las bombas de engranajes para sistemas oleohidráulicos. Es la subpartida del caso de la Ruta de Aprendizaje.',
    seccion: 'Maquinaria', arancel: 0, iva: 19,
    keywords: ['bomba', 'bombas', 'engranajes', 'hidraulica', 'oleohidraulica', 'paletas', 'tornillo', 'pump', '8413'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Documento de transporte (B/L)', 'Lista de empaque', 'Ficha técnica (confirma que es rotativa y sin motor)', 'Declaración Andina del Valor si el FOB es de USD 5.000 o más'],
    notas: 'Las bombas de pistones van en 8413.50 (volumétricas alternativas) y las centrífugas en 8413.70. El Decreto 1881 de 2021 le fija un arancel general del 5%, pero esta subpartida está en la lista del Decreto 272 de 2018 (0% para materias primas y bienes de capital no producidos en Colombia) y no ha sido restablecida, así que hoy paga 0%. En la Ruta de Aprendizaje se usa un 5% de práctica para ejercitar el cálculo. Si la bomba trae motor eléctrico incorporado, revisa si aplica el RETIE.'
  },
  {
    codigo: '0901.11.90.00', titulo: 'Café sin tostar, sin descafeinar (excepto para siembra)',
    desc: 'Café verde sin proceso de tostión. Principal producto de exportación agrícola de Colombia.',
    seccion: 'Agroalimentario', arancel: 10, iva: 0,
    keywords: ['cafe', 'coffee', 'grano', 'verde', 'pergamino', 'exportacion'],
    vistoBueno: ['FNC — Registro de exportador de café y control de calidad (Almacafé)'],
    documentos: ['Registro como exportador de café ante la FNC', 'Certificado de calidad de Almacafé', 'Certificado de origen si el comprador pide preferencia', 'Factura comercial'],
    notas: 'Ficha pensada para exportar: la exportación no paga arancel ni IVA, pero sí la contribución cafetera. Si se importara, el arancel general es del 10% y el café en grano sin tostar está excluido de IVA (art. 424 del Estatuto Tributario). La subpartida 0901.11.10.00 es la de café para siembra.'
  },
  {
    codigo: '6403.99.90.00', titulo: 'Calzado con parte superior de cuero natural (los demás)',
    desc: 'Zapatos y botas con suela de caucho, plástico o cuero y capellada de cuero natural, que no cubren el tobillo ni son de deporte.',
    seccion: 'Calzado y textiles', arancel: 15, iva: 19,
    keywords: ['zapatos', 'calzado', 'botas', 'cuero', 'leather', 'shoes'],
    vistoBueno: ['Reglamento técnico de etiquetado de calzado (MinCIT)'],
    documentos: ['Factura comercial', 'Lista de empaque', 'Soporte del cumplimiento del reglamento de etiquetado'],
    notas: 'Arancel general del 15% (Decreto 1881 de 2021). El Decreto 594 de 2026 fija un arancel del 35% cuando el precio FOB declarado por par es igual o inferior al umbral que establece para el calzado de cuero, para importaciones desde países sin acuerdo comercial vigente; confirma el umbral en el texto oficial antes de liquidar.'
  },
  {
    codigo: '8471.30.00.00', titulo: 'Computadores portátiles (laptops)',
    desc: 'Máquinas automáticas para tratamiento de información, portátiles, de peso inferior o igual a 10 kg.',
    seccion: 'Electrónica', arancel: 0, iva: 19,
    keywords: ['computador', 'laptop', 'portatil', 'notebook', 'pc', 'computadora'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Lista de empaque', 'Documento de transporte'],
    notas: 'Arancel 0% en el Arancel de Aduanas (Colombia hace parte del Acuerdo de Tecnología de la Información de la OMC). Los computadores personales de valor igual o inferior a 50 UVT están excluidos de IVA (art. 424 del Estatuto Tributario); por encima de ese valor se paga el 19%.'
  },
  {
    codigo: '8517.13.00.00', titulo: 'Teléfonos inteligentes (smartphones)',
    desc: 'Teléfonos inteligentes para redes celulares. Desde la versión 2022 del Sistema Armonizado tienen subpartida propia; antes iban en 8517.12.',
    seccion: 'Electrónica', arancel: 0, iva: 19,
    keywords: ['celular', 'telefono', 'smartphone', 'movil', 'iphone', 'samsung'],
    vistoBueno: ['Registro de los IMEI ante el MinTIC antes de declarar (Decreto 2025 de 2015)', 'CRC — Equipo homologado'],
    documentos: ['Autorización de importador de terminales (MinTIC)', 'Homologación del modelo ante la CRC', 'Registro de los IMEI', 'Factura comercial'],
    notas: 'Arancel 0%. Los celulares de valor igual o inferior a 22 UVT están excluidos de IVA (art. 424 del Estatuto Tributario). Los teléfonos celulares que no son inteligentes siguen en 8517.14.'
  },
  {
    codigo: '3004.90.29.00', titulo: 'Medicamentos para uso humano, dosificados (los demás)',
    desc: 'Medicamentos preparados para uso terapéutico o profiláctico, en dosis o para la venta al por menor.',
    seccion: 'Farmacéutico', arancel: 10, iva: 0,
    keywords: ['medicamentos', 'farmacia', 'drogas', 'pastillas', 'capsulas', 'medicina'],
    vistoBueno: ['INVIMA — Registro sanitario del medicamento', 'FNE — Si es de control especial'],
    documentos: ['Registro sanitario INVIMA', 'Visto bueno de importación en la VUCE', 'Certificado de análisis del lote', 'Factura comercial'],
    notas: 'Arancel general del 10% (Decreto 1881 de 2021); otros medicamentos de la partida tienen 5%, por ejemplo los oncológicos o para VIH (3004.90.24.00). Los medicamentos de la partida 30.04 están excluidos de IVA (art. 424 del Estatuto Tributario). Los de control especial requieren además autorización del Fondo Nacional de Estupefacientes.'
  },
  {
    codigo: '2709.00.00.00', titulo: 'Aceites crudos de petróleo',
    desc: 'Aceites crudos de petróleo o de mineral bituminoso.',
    seccion: 'Energía y minería', arancel: 0, iva: 19,
    keywords: ['petroleo', 'crudo', 'oil', 'combustible', 'hidrocarburo'],
    vistoBueno: ['MinMinas — Registro y autorización para importar hidrocarburos'],
    documentos: ['Autorización de MinMinas', 'Certificado de calidad', 'Documento de transporte'],
    notas: 'Arancel 0% por el Decreto 272 de 2018 (materias primas no producidas en el país; el general del Decreto 1881 es 5%). No aparece en las listas de bienes excluidos o con tarifa reducida del Estatuto Tributario, así que se muestra la tarifa general de IVA del 19%; el tratamiento puede variar según el régimen del importador. Producto estratégico con control del Ministerio de Minas y Energía.'
  },
  {
    codigo: '8708.99.99.00', titulo: 'Partes y accesorios para vehículos automotores (los demás)',
    desc: 'Piezas, partes y accesorios para automóviles, camiones y demás vehículos de las partidas 87.01 a 87.05.',
    seccion: 'Automotriz', arancel: 5, iva: 19,
    keywords: ['repuestos', 'autopartes', 'vehiculos', 'carros', 'camiones', 'partes'],
    vistoBueno: ['Reglamento técnico si la autoparte lo tiene (por ejemplo, frenos o vidrios de seguridad)'],
    documentos: ['Factura comercial', 'Lista de empaque', 'Prueba de origen si se pide preferencia de un TLC'],
    notas: 'La subpartida 8708.99 se desdobla según la parte (bastidores, transmisiones, dirección...); esta es la residual "Los demás", con arancel general del 5%. Algunas autopartes tienen contingentes o diferimientos para ensambladores (Decreto 1530 de 2024). Con un TLC vigente y prueba de origen puede aplicar un arancel preferencial.'
  },
  {
    codigo: '1001.99.10.90', titulo: 'Trigo (excepto duro y para siembra)',
    desc: 'Trigo común para usos distintos a la siembra, como la molinería.',
    seccion: 'Agroalimentario', arancel: 10, iva: 5,
    keywords: ['trigo', 'wheat', 'cereal', 'harina', 'grano'],
    vistoBueno: ['ICA — Documento de requisitos fitosanitarios para importación'],
    documentos: ['Documento de requisitos fitosanitarios del ICA', 'Certificado fitosanitario del país de origen', 'Factura comercial'],
    notas: 'Arancel fijo del 10% (Decreto 1881 de 2021), sujeto además al Sistema Andino de Franjas de Precios, que lo ajusta según el precio internacional. Entre 2020 y 2024 tuvo arancel del 0% por decretos temporales (882 de 2020 y 1174 de 2022). El trigo, excepto el de siembra, tiene IVA del 5% (art. 468-1 del Estatuto Tributario).'
  },
  {
    codigo: '2204.21.00.00', titulo: 'Vino de uvas frescas en recipientes de hasta 2 litros',
    desc: 'Vinos de uvas frescas, incluso encabezados, en recipientes con capacidad inferior o igual a 2 litros.',
    seccion: 'Agroalimentario', arancel: 15, iva: 19,
    keywords: ['vino', 'wine', 'uva', 'bebida alcoholica', 'licor'],
    vistoBueno: ['INVIMA — Registro sanitario de bebidas alcohólicas'],
    documentos: ['Registro sanitario INVIMA', 'Certificado de análisis', 'Rotulado conforme a la norma sanitaria', 'Factura comercial'],
    notas: 'Además del arancel y el IVA, paga impuesto al consumo de licores, vinos y aperitivos, que va a los departamentos, y la estampilla o señalización exigida.'
  },
  {
    codigo: '6104.43.00.00', titulo: 'Vestidos de punto para mujeres o niñas, de fibras sintéticas',
    desc: 'Vestidos de tejido de punto para mujeres o niñas, de fibras sintéticas.',
    seccion: 'Calzado y textiles', arancel: 40, iva: 19,
    keywords: ['ropa', 'vestidos', 'textil', 'confeccion', 'moda', 'prendas'],
    vistoBueno: ['Reglamento técnico de etiquetado de confecciones (Resolución 1950 de 2009, MinCIT)'],
    documentos: ['Factura comercial', 'Lista de empaque', 'Etiquetas conforme al reglamento técnico de confecciones'],
    notas: 'Las confecciones de los capítulos 61 y 62 tienen un arancel del 40% para importaciones de cualquier origen sin preferencia (Decreto 2598 de 2022, sin umbral de precio). Con un TLC vigente y prueba de origen aplica el arancel preferencial del acuerdo.'
  },
  {
    codigo: '8703.23.90.90', titulo: 'Automóviles de turismo con motor de gasolina (1.500 a 3.000 cm³)',
    desc: 'Vehículos para transporte de personas con motor de émbolo de encendido por chispa y cilindrada superior a 1.500 cm³ e inferior o igual a 3.000 cm³.',
    seccion: 'Automotriz', arancel: 40, iva: 19,
    keywords: ['carro', 'automovil', 'vehiculo', 'sedan', 'suv', 'auto'],
    vistoBueno: ['MinTransporte — Homologación del modelo (ficha técnica)'],
    documentos: ['Homologación del modelo', 'Factura comercial', 'Documento de transporte', 'Registro en el RUNT después del levante'],
    notas: 'El Decreto 1432 de 2025 subió al 40% el arancel de los vehículos de combustión (antes 35%), desde enero de 2026; con un TLC vigente y prueba de origen puede aplicar un arancel preferencial. Además del IVA paga el impuesto nacional al consumo del 8% o 16% según el valor del vehículo.'
  },
  {
    codigo: '9403.60.00.00', titulo: 'Muebles de madera (los demás)',
    desc: 'Muebles de madera distintos de los de oficina, cocina o dormitorio.',
    seccion: 'Madera y muebles', arancel: 15, iva: 19,
    keywords: ['muebles', 'madera', 'furniture', 'sillas', 'mesa', 'sofa'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Lista de empaque', 'Permiso CITES si la madera es de una especie protegida'],
    notas: 'El mueble terminado normalmente no requiere visto bueno del ICA. Lo que sí se revisa es el embalaje: estibas y cajas de madera deben estar tratadas y marcadas según la NIMF 15.'
  },
  {
    codigo: '3921.90.90.00', titulo: 'Placas y láminas de plástico (las demás)',
    desc: 'Placas, hojas, películas, bandas y láminas de plástico no celulares, no clasificadas en otras subpartidas de la partida 39.21.',
    seccion: 'Químicos y plásticos', arancel: 10, iva: 19,
    keywords: ['plastico', 'laminas', 'placas', 'polimero', 'pvc', 'pelicula'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Ficha técnica', 'Hoja de datos de seguridad si aplica'],
    notas: 'La clasificación dentro de las partidas 39.20 y 39.21 depende de si el plástico es celular (espumado) y de qué polímero es; revisa la ficha técnica antes de elegir la subpartida.'
  },
  {
    codigo: '0302.11.00.00', titulo: 'Truchas frescas o refrigeradas',
    desc: 'Truchas (Salmo trutta, Oncorhynchus mykiss y otras especies del género), frescas o refrigeradas, excepto filetes.',
    seccion: 'Agroalimentario', arancel: 15, iva: 0,
    keywords: ['trucha', 'pescado', 'salmon', 'pez', 'acuicultura'],
    vistoBueno: ['ICA — Documento zoosanitario de importación', 'INVIMA — Inspección sanitaria en el puerto'],
    documentos: ['Documento zoosanitario de importación (ICA)', 'Certificado sanitario del país de origen', 'Registro de temperatura (cadena de frío)', 'Factura comercial'],
    notas: 'Arancel general del 15%. El pescado fresco o refrigerado está exento de IVA (art. 477 del Estatuto Tributario). Producto perecedero: se coordina la inspección del ICA y del INVIMA antes del arribo para no romper la cadena de frío.'
  },
  {
    codigo: '7208.51.10.00', titulo: 'Laminados planos de hierro o acero sin alear, sin enrollar, de más de 12,5 mm',
    desc: 'Productos laminados planos en caliente, sin enrollar, de anchura superior o igual a 600 mm y espesor superior a 10 mm.',
    seccion: 'Metales', arancel: 0, iva: 19,
    keywords: ['acero', 'hierro', 'laminas', 'steel', 'metal', 'estructural'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Certificado de calidad del acero (mill test)', 'Lista de empaque'],
    notas: 'Arancel 0% por el Decreto 272 de 2018 (el general del Decreto 1881 es 5%). Para espesores de más de 10 mm hasta 12,5 mm la subpartida es 7208.51.20.00. Algunos productos de acero tienen o han tenido derechos antidumping según el país de origen; revisa si hay una medida vigente.'
  },
  {
    codigo: '8802.40.00.00', titulo: 'Aviones de peso en vacío superior a 15.000 kg',
    desc: 'Aviones y demás aeronaves de peso en vacío superior a 15.000 kg.',
    seccion: 'Aeronáutica', arancel: 0, iva: 19,
    keywords: ['avion', 'aeronave', 'aircraft', 'aerolinea', 'boeing', 'airbus'],
    vistoBueno: ['Aerocivil — Autorización y registro de la aeronave'],
    documentos: ['Autorización de la Aerocivil', 'Certificado de aeronavegabilidad', 'Factura o contrato de compra o arrendamiento'],
    notas: 'Arancel 0%. Estas aeronaves no aparecen en las listas de bienes excluidos de IVA del Estatuto Tributario, así que se muestra la tarifa general del 19%; existen tratamientos especiales según el uso (por ejemplo, transporte aéreo regular), así que verifícalos antes de liquidar.'
  },
  {
    codigo: '3304.99.00.00', titulo: 'Preparaciones de belleza, maquillaje y cuidado de la piel',
    desc: 'Preparaciones de belleza, de maquillaje y para el cuidado de la piel, excepto medicamentos.',
    seccion: 'Químicos y plásticos', arancel: 15, iva: 19,
    keywords: ['cosmeticos', 'maquillaje', 'belleza', 'crema', 'skincare', 'beauty'],
    vistoBueno: ['INVIMA — Notificación sanitaria obligatoria (NSO)'],
    documentos: ['Notificación sanitaria obligatoria (Decisión 833 de la CAN)', 'Etiqueta en español', 'Factura comercial'],
    notas: 'La notificación sanitaria se obtiene antes de comercializar el producto y el rotulado debe estar en español.'
  },
  {
    codigo: '9503.00.99.90', titulo: 'Juguetes (los demás)',
    desc: 'Juguetes, modelos reducidos y rompecabezas, no clasificados en otra subpartida de la partida 95.03.',
    seccion: 'Otros', arancel: 15, iva: 19,
    keywords: ['juguetes', 'toys', 'muñecos', 'lego', 'juegos', 'rompecabezas'],
    vistoBueno: ['Reglamento técnico sanitario de juguetes (Resolución 686 de 2018, Ministerio de Salud)'],
    documentos: ['Certificado de conformidad con el reglamento técnico de juguetes', 'Etiqueta con advertencias en español', 'Factura comercial'],
    notas: 'Los juguetes deben cumplir el reglamento técnico sanitario de juguetes (Resolución 686 de 2018 del Ministerio de Salud) y demostrarlo antes de declararse. La subpartida 9503.00.99.10 es para globos de látex. Revisa en la VUCE los requisitos de la subpartida exacta.'
  },
  {
    codigo: '3105.20.00.00', titulo: 'Abonos con nitrógeno, fósforo y potasio (NPK)',
    desc: 'Abonos minerales o químicos con los tres elementos fertilizantes: nitrógeno, fósforo y potasio.',
    seccion: 'Químicos y plásticos', arancel: 0, iva: 0,
    keywords: ['fertilizante', 'abono', 'npk', 'agricola', 'cultivo', 'agroquimico'],
    vistoBueno: ['ICA — Registro de venta del fertilizante y visto bueno de importación'],
    documentos: ['Registro de venta del ICA', 'Certificado de análisis', 'Ficha técnica', 'Factura comercial'],
    notas: 'Arancel 0% hasta noviembre de 2026 por el Decreto 1183 de 2025 (insumos agropecuarios, vigencia de un año); el general del Decreto 1881 es 5%. Los abonos de la partida 31.05 están excluidos de IVA (art. 424 del Estatuto Tributario).'
  },
  {
    codigo: '4011.10.10.00', titulo: 'Llantas radiales nuevas de caucho para automóviles de turismo',
    desc: 'Neumáticos (llantas) nuevos de caucho, del tipo utilizado en automóviles de turismo.',
    seccion: 'Automotriz', arancel: 10, iva: 19,
    keywords: ['llantas', 'neumaticos', 'caucho', 'tires', 'ruedas', 'vehiculo'],
    vistoBueno: ['Reglamento técnico de llantas (Resolución 0481 de 2009, MinCIT)'],
    documentos: ['Certificado de conformidad con el reglamento técnico de llantas', 'Factura comercial', 'Prueba de origen si se pide preferencia'],
    notas: 'El cumplimiento del reglamento técnico se demuestra con certificado de conformidad antes de la importación y se verifica en la VUCE.'
  },
  {
    codigo: '1006.30.00.90', titulo: 'Arroz semiblanqueado o blanqueado',
    desc: 'Arroz semiblanqueado o blanqueado, incluso pulido o glaseado.',
    seccion: 'Agroalimentario', arancel: 80, iva: 0,
    keywords: ['arroz', 'rice', 'cereal', 'grano', 'alimento basico'],
    vistoBueno: ['ICA — Documento de requisitos fitosanitarios para importación', 'INVIMA — Inspección sanitaria'],
    documentos: ['Documento de requisitos fitosanitarios del ICA', 'Certificado fitosanitario del país de origen', 'Factura comercial'],
    notas: 'Arancel general del 80% para proteger la producción nacional (el arroz de grano corto o mediano, 1006.30.00.10, tiene 15%). Algunos TLC dan contingentes con arancel preferencial. El arroz para consumo humano está exento de IVA (art. 477 del Estatuto Tributario).'
  },
  {
    codigo: '1806.32.00.90', titulo: 'Chocolate en bloques, tabletas o barras, sin rellenar',
    desc: 'Chocolate y demás preparaciones alimenticias que contengan cacao, en bloques, tabletas o barras, sin rellenar.',
    seccion: 'Agroalimentario', arancel: 15, iva: 5,
    keywords: ['chocolate', 'cacao', 'dulce', 'confiteria', 'barra', 'tableta'],
    vistoBueno: ['INVIMA — Registro, permiso o notificación sanitaria según el riesgo del alimento'],
    documentos: ['Registro sanitario del alimento (INVIMA)', 'Etiquetado nutricional en español (Resolución 810 de 2021)', 'Factura comercial'],
    notas: 'Arancel general del 15%. El chocolate de mesa de esta subpartida tiene IVA del 5% (art. 468-1 del Estatuto Tributario). Puede estar sujeto al impuesto a los productos comestibles ultraprocesados azucarados (Ley 2277 de 2022), según su composición.'
  },
  {
    codigo: '2523.29.00.00', titulo: 'Cemento Portland (los demás)',
    desc: 'Cemento Portland, excepto el cemento blanco.',
    seccion: 'Construcción', arancel: 5, iva: 19,
    keywords: ['cemento', 'portland', 'construccion', 'concreto', 'obra'],
    vistoBueno: ['Reglamento técnico de cemento (MinCIT)'],
    documentos: ['Certificado de conformidad con el reglamento técnico', 'Factura comercial', 'Certificado de calidad'],
    notas: 'Se transporta a granel o en sacos; el tipo de carga cambia el flete y la operación en el puerto.'
  },
  {
    codigo: '8445.20.00.00', titulo: 'Máquinas para hilar materia textil',
    desc: 'Máquinas de hilar (continuas de hilar) materia textil.',
    seccion: 'Maquinaria', arancel: 0, iva: 19,
    keywords: ['maquinaria', 'textil', 'hilado', 'industrial', 'hilar', 'confeccion'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Ficha técnica del equipo', 'Lista de empaque'],
    notas: 'Arancel 0% por el Decreto 272 de 2018 (bienes de capital no producidos en Colombia; el general del Decreto 1881 es 5%). Si la máquina es usada, revisa los requisitos para bienes usados.'
  },
  {
    codigo: '8507.60.00.00', titulo: 'Acumuladores de iones de litio',
    desc: 'Acumuladores eléctricos (baterías recargables) de iones de litio.',
    seccion: 'Electrónica', arancel: 0, iva: 19,
    keywords: ['bateria', 'litio', 'acumulador', 'battery', 'lithium', 'recargable', 'energia'],
    vistoBueno: [],
    documentos: ['Factura comercial', 'Hoja de datos de seguridad', 'Informe de ensayos UN 38.3', 'Declaración de mercancía peligrosa para el transporte'],
    notas: 'Arancel 0% por el Decreto 272 de 2018 (el general del Decreto 1881 es 5%). Mercancía peligrosa clase 9 para el transporte: la naviera o la aerolínea exige embalaje, etiquetado y documentación especiales. Al final de su vida útil aplica la responsabilidad extendida del productor.'
  },
  {
    codigo: '9018.90.90.90', titulo: 'Instrumentos y aparatos de medicina y cirugía (los demás)',
    desc: 'Instrumentos y aparatos de medicina, cirugía u odontología no clasificados en otra subpartida de la partida 90.18.',
    seccion: 'Farmacéutico', arancel: 5, iva: 19,
    keywords: ['medico', 'cirugia', 'instrumental', 'hospital', 'quirurgico', 'salud', 'dispositivo'],
    vistoBueno: ['INVIMA — Registro sanitario de dispositivo médico'],
    documentos: ['Registro sanitario INVIMA', 'Visto bueno de importación en la VUCE', 'Factura comercial'],
    notas: 'El Decreto 366 de 2023 desdobló esta subpartida (bombas de infusión y equipos de diálisis peritoneal tienen códigos propios); la residual tiene arancel del 5%. Solo algunos dispositivos de la partida 90.18 están excluidos de IVA (art. 424 del Estatuto Tributario, por ejemplo catéteres y equipos de infusión); los demás pagan el 19%.'
  },
  {
    codigo: '2309.90.90.00', titulo: 'Preparaciones para la alimentación de animales (las demás)',
    desc: 'Preparaciones del tipo utilizado para la alimentación de animales, como premezclas y concentrados, excepto alimento para perros o gatos para la venta al por menor.',
    seccion: 'Agroalimentario', arancel: 0, iva: 5,
    keywords: ['alimento animal', 'concentrado', 'ganado', 'pecuario', 'premezcla'],
    vistoBueno: ['ICA — Registro del alimento para animales y documento zoosanitario'],
    documentos: ['Registro del producto ante el ICA', 'Certificado de análisis', 'Factura comercial'],
    notas: 'Arancel 0% hasta noviembre de 2026 por el Decreto 1183 de 2025 (insumos agropecuarios); el general del Decreto 1881 es 15%. Las preparaciones de la partida 23.09 tienen IVA del 5% (art. 468-1 del Estatuto Tributario). El alimento para perros y gatos va en 2309.10.'
  },
  {
    codigo: '8502.11.10.00', titulo: 'Grupos electrógenos de corriente alterna con motor diésel, de hasta 75 kVA',
    desc: 'Grupos electrógenos con motor de émbolo de encendido por compresión (diésel) de potencia inferior o igual a 75 kVA.',
    seccion: 'Maquinaria', arancel: 0, iva: 19,
    keywords: ['generador', 'planta electrica', 'diesel', 'energia', 'electrogeno', 'emergencia'],
    vistoBueno: ['Reglamento técnico de instalaciones eléctricas (RETIE)'],
    documentos: ['Certificado de conformidad RETIE', 'Factura comercial', 'Ficha técnica'],
    notas: 'Arancel 0% por el Decreto 272 de 2018 (el general del Decreto 1881 es 5%). La 8502.11.90.00 es para los demás (no de corriente alterna). El RETIE se verifica en la VUCE antes de declarar.'
  }
];
