// ============================================================
//  BonCloud — Vistos buenos y requisitos de otras entidades
//  Guía educativa: los requisitos dependen de la subpartida exacta y de la
//  norma vigente. Antes de embarcar se verifican en la VUCE.
// ============================================================
export const vistosBuenos = [
  {
    entidad: 'INVIMA',
    titulo: 'Alimentos y bebidas',
    desc: 'Los alimentos procesados y las bebidas que se importan para consumo humano necesitan registro, permiso o notificación sanitaria del INVIMA según su nivel de riesgo, y pasan inspección sanitaria en el puerto.',
    subpartidas: ['04.01', '16.01', '17.04', '18.06', '19.05', '20.09', '21.06', '22.02', '22.04'],
    keywords: ['alimentos', 'bebidas', 'comida', 'procesado', 'suplemento', 'vino', 'chocolate'],
    requisitos: [
      'Registro (RSA), permiso (PSA) o notificación sanitaria (NSA) según el riesgo del alimento (Resolución 2674 de 2013)',
      'Visto bueno de importación en la VUCE',
      'Rotulado en español (Resolución 5109 de 2005) y etiquetado nutricional (Resolución 810 de 2021)',
      'Inspección sanitaria del INVIMA en el puerto de llegada'
    ]
  },
  {
    entidad: 'INVIMA',
    titulo: 'Medicamentos y dispositivos médicos',
    desc: 'Los medicamentos, dispositivos médicos y reactivos de diagnóstico necesitan registro sanitario del INVIMA vigente antes de importarse.',
    subpartidas: ['30.02', '30.03', '30.04', '30.05', '30.06', '90.18', '90.21'],
    keywords: ['medicamentos', 'farmaceutico', 'drogas', 'pastillas', 'vacunas', 'dispositivos medicos', 'cirugia'],
    requisitos: [
      'Registro sanitario INVIMA del producto',
      'Visto bueno de importación en la VUCE',
      'Certificado de análisis del lote',
      'Si es de control especial, autorización adicional del Fondo Nacional de Estupefacientes'
    ]
  },
  {
    entidad: 'INVIMA',
    titulo: 'Cosméticos y productos de higiene',
    desc: 'Los cosméticos se comercializan con notificación sanitaria obligatoria (NSO), regulada en la Comunidad Andina por la Decisión 833 de 2018, que reemplazó a la Decisión 516.',
    subpartidas: ['33.03', '33.04', '33.05', '33.06', '33.07'],
    keywords: ['cosmeticos', 'perfume', 'shampoo', 'crema', 'maquillaje', 'aseo', 'higiene'],
    requisitos: [
      'Notificación sanitaria obligatoria (NSO)',
      'Fórmula cualitativa del producto',
      'Etiqueta en español con los datos que exige la norma andina',
      'Visto bueno de importación en la VUCE cuando la subpartida lo exige'
    ]
  },
  {
    entidad: 'ICA',
    titulo: 'Animales y productos de origen animal',
    desc: 'La importación de animales vivos, carnes, lácteos, huevos y subproductos de origen animal requiere el documento zoosanitario de importación del ICA, que se tramita antes del embarque.',
    subpartidas: ['01.02', '01.05', '02.01', '02.02', '02.03', '03.02', '04.01', '04.07'],
    keywords: ['animales', 'ganado', 'carne', 'lacteos', 'leche', 'huevos', 'aves', 'porcinos', 'pescado'],
    requisitos: [
      'Documento zoosanitario de importación (DZI) del ICA, antes del embarque',
      'Certificado sanitario oficial del país de origen',
      'Inspección del ICA en el puerto de entrada',
      'Cuarentena cuando la especie o el origen lo exigen',
      'Para alimentos de consumo humano, además, inspección del INVIMA'
    ]
  },
  {
    entidad: 'ICA',
    titulo: 'Vegetales, semillas y granos',
    desc: 'Plantas, flores, frutas, semillas y granos requieren el documento de requisitos fitosanitarios para importación del ICA y el certificado fitosanitario del país de origen.',
    subpartidas: ['06.02', '07.01', '08.03', '08.08', '10.01', '10.05', '10.06', '12.01'],
    keywords: ['plantas', 'flores', 'frutas', 'verduras', 'semillas', 'banano', 'arroz', 'maiz', 'trigo', 'soya'],
    requisitos: [
      'Documento de requisitos fitosanitarios para importación (ICA), antes del embarque',
      'Certificado fitosanitario del país de origen',
      'Inspección fitosanitaria en el punto de ingreso',
      'Tratamiento cuarentenario si se detectan plagas',
      'Registro ante el ICA si se importa material de propagación'
    ]
  },
  {
    entidad: 'ICA',
    titulo: 'Insumos agropecuarios y fertilizantes',
    desc: 'Plaguicidas, fertilizantes, medicamentos veterinarios y bioinsumos necesitan registro del ICA para venderse en Colombia y visto bueno para importarse.',
    subpartidas: ['23.09', '30.04', '31.02', '31.05', '38.08'],
    keywords: ['fertilizantes', 'plaguicidas', 'pesticidas', 'abono', 'insecticida', 'veterinario', 'concentrado'],
    requisitos: [
      'Registro de venta del producto ante el ICA',
      'Registro del importador ante el ICA',
      'Visto bueno de importación en la VUCE',
      'Hoja de datos de seguridad',
      'Etiqueta aprobada por el ICA'
    ]
  },
  {
    entidad: 'SIC',
    titulo: 'Productos sujetos a reglamento técnico',
    desc: 'Cuando la subpartida está sujeta a un reglamento técnico (por ejemplo RETIE para productos eléctricos, llantas, cemento, etiquetado de confecciones o calzado), el importador demuestra la conformidad antes de declarar y la SIC hace la vigilancia.',
    subpartidas: ['40.11', '61.04', '64.03', '85.02', '85.04', '85.36', '85.44'],
    keywords: ['electricos', 'retie', 'cables', 'llantas', 'reglamento tecnico', 'etiquetado', 'confecciones', 'calzado'],
    requisitos: [
      'Certificado de conformidad expedido por un organismo acreditado ante el ONAC (o la declaración del proveedor, si el reglamento la admite)',
      'Registro de importación en la VUCE cuando la subpartida lo exige',
      'Inscripción en el registro de fabricantes e importadores de la SIC',
      'Etiquetado conforme al reglamento técnico'
    ]
  },
  {
    entidad: 'SIC',
    titulo: 'Juguetes',
    desc: 'Los juguetes deben cumplir el reglamento técnico sanitario de juguetes (Resolución 686 de 2018 del Ministerio de Salud, que derogó la 3388 de 2008) y demostrarlo antes de ingresar al país.',
    subpartidas: ['95.03', '95.04', '95.05'],
    keywords: ['juguetes', 'ninos', 'infantil', 'muñecas', 'legos', 'peluches'],
    requisitos: [
      'Certificado de conformidad con el reglamento técnico de juguetes',
      'Ensayos en laboratorio acreditado',
      'Advertencias de seguridad y edad recomendada en español',
      'Datos del importador en el empaque'
    ]
  },
  {
    entidad: 'MinTIC',
    titulo: 'Teléfonos celulares',
    desc: 'La importación de teléfonos móviles está controlada por el Decreto 2025 de 2015: el importador transmite al MinTIC los IMEI de los equipos antes de declarar, y los modelos deben estar homologados por la CRC.',
    subpartidas: ['85.17'],
    keywords: ['celular', 'telefono', 'smartphone', 'movil', 'imei'],
    requisitos: [
      'Cumplir los requisitos del Decreto 2025 de 2015 para importadores de terminales móviles',
      'Modelo homologado ante la Comisión de Regulación de Comunicaciones (CRC)',
      'Transmisión de los IMEI al MinTIC antes de presentar la declaración de importación'
    ]
  },
  {
    entidad: 'MinJusticia',
    titulo: 'Sustancias y productos químicos controlados',
    desc: 'Las sustancias que pueden usarse para producir drogas ilícitas (por ejemplo, ciertos solventes, ácidos y precursores) están bajo control del Ministerio de Justicia y del Derecho.',
    subpartidas: ['27.10', '28.06', '28.07', '28.41', '29.02', '29.14', '29.15'],
    keywords: ['quimicos', 'sustancias', 'acidos', 'solventes', 'precursores', 'controlados', 'acetona'],
    requisitos: [
      'Certificado vigente para el manejo de sustancias y productos químicos controlados (Resolución 0001 de 2015 del Consejo Nacional de Estupefacientes)',
      'Autorización de importación en la VUCE para cada operación',
      'Cantidades dentro del cupo autorizado',
      'Hoja de datos de seguridad en español'
    ]
  },
  {
    entidad: 'FNE',
    titulo: 'Medicamentos y materias primas de control especial',
    desc: 'El Fondo Nacional de Estupefacientes autoriza la importación de medicamentos y materias primas de control especial, como opioides y psicotrópicos.',
    subpartidas: ['29.39', '30.03', '30.04'],
    keywords: ['estupefacientes', 'control especial', 'opioides', 'psicotropicos', 'morfina'],
    requisitos: [
      'Inscripción ante el Fondo Nacional de Estupefacientes',
      'Autorización o visto bueno de importación por cada operación',
      'Cantidades dentro del cupo asignado',
      'Registro sanitario INVIMA del medicamento'
    ]
  },
  {
    entidad: 'MinDefensa',
    titulo: 'Armas, municiones y explosivos',
    desc: 'El comercio de armas, municiones y explosivos está controlado por el Estado: se hace a través de INDUMIL, con autorización del Ministerio de Defensa.',
    subpartidas: ['36.01', '36.02', '36.03', '93.01', '93.02', '93.03', '93.04', '93.06'],
    keywords: ['armas', 'municiones', 'explosivos', 'pistolas', 'rifles', 'dinamita', 'militar'],
    requisitos: [
      'Importación a través de INDUMIL o con autorización del Ministerio de Defensa',
      'Certificado de usuario final',
      'Permisos de tenencia o uso cuando aplican al destinatario'
    ]
  },
  {
    entidad: 'ANLA',
    titulo: 'Sustancias que afectan la capa de ozono y residuos peligrosos',
    desc: 'Las sustancias agotadoras de la capa de ozono y los movimientos transfronterizos de residuos peligrosos (Convenio de Basilea) requieren autorización ambiental.',
    subpartidas: ['29.03', '38.24', '38.27'],
    keywords: ['ozono', 'refrigerantes', 'residuos', 'peligroso', 'basilea', 'ambiental'],
    requisitos: [
      'Visto bueno ambiental de importación en la VUCE',
      'Cupo de importación para sustancias agotadoras de la capa de ozono',
      'Autorización del movimiento transfronterizo para residuos peligrosos',
      'Hoja de datos de seguridad'
    ]
  },
  {
    entidad: 'MinMinas',
    titulo: 'Combustibles y derivados del petróleo',
    desc: 'La importación de combustibles líquidos y derivados del petróleo requiere estar autorizado por el Ministerio de Minas y Energía como agente de la cadena de distribución.',
    subpartidas: ['27.09', '27.10', '27.11'],
    keywords: ['combustible', 'gasolina', 'petroleo', 'gas', 'diesel', 'aceite mineral'],
    requisitos: [
      'Autorización del Ministerio de Minas y Energía como importador de combustibles',
      'Registro en el SICOM (Sistema de Información de Combustibles)',
      'Certificado de calidad del producto'
    ]
  },
  {
    entidad: 'Aerocivil',
    titulo: 'Aeronaves y drones',
    desc: 'La importación de aeronaves y de drones de uso profesional requiere autorización de la Aeronáutica Civil de Colombia.',
    subpartidas: ['88.02', '88.06', '88.07'],
    keywords: ['aviones', 'helicopteros', 'drones', 'aeronaves', 'aeropartes', 'aeronautica'],
    requisitos: [
      'Autorización de importación de la Aerocivil',
      'Certificado de aeronavegabilidad',
      'Registro de la aeronave o del dron ante la Aerocivil'
    ]
  }
];
