// Tablas de códigos para diligenciar declaraciones en el simulador SIGLO XXII.
// Países: código ISO 3166 de dos letras. Modos de transporte, embalajes y unidades: códigos de
// las recomendaciones de Naciones Unidas que usa la DIAN. Ciudades: código DANE del municipio.
// Lugares de ingreso: códigos internacionales de puertos y aeropuertos (UN/LOCODE, sin el prefijo
// del país). Depósitos, transportadores y agencias de aduanas son de práctica: los reales son datos
// de empresas y cambian, así que aquí son ficticios.

export const TABLAS = {
  administraciones: {
    titulo: 'Administraciones de aduanas',
    nota: 'Dirección Seccional de la DIAN donde está la mercancía.',
    filas: [['3', 'Bogotá'], ['35', 'Buenaventura'], ['48', 'Cartagena']],
  },
  lugares: {
    titulo: 'Lugares de ingreso',
    nota: 'Puerto o aeropuerto por donde entra la mercancía al país.',
    filas: [
      ['CTG', 'Cartagena (puerto marítimo)'], ['BAQ', 'Barranquilla (puerto marítimo)'], ['SMR', 'Santa Marta (puerto marítimo)'],
      ['BUN', 'Buenaventura (puerto marítimo)'], ['TCO', 'Tumaco (puerto marítimo)'], ['TRB', 'Turbo (puerto marítimo)'],
      ['BOG', 'Bogotá, aeropuerto El Dorado'], ['MDE', 'Rionegro, aeropuerto José María Córdova'], ['CLO', 'Cali, aeropuerto Alfonso Bonilla Aragón'],
      ['CUC', 'Cúcuta (frontera terrestre)'], ['IPI', 'Ipiales (frontera terrestre)'], ['ADZ', 'San Andrés (puerto y aeropuerto)'],
    ],
  },
  depositos: {
    titulo: 'Depósitos habilitados',
    nota: 'Depósitos de práctica con códigos ficticios.',
    ficticia: true,
    filas: [
      ['DEP048', 'Depósito público del terminal marítimo de Cartagena'], ['DEP049', 'Depósito privado Mamonal'], ['DEP050', 'Depósito público Bocagrande'],
      ['DEP035', 'Depósito público del terminal de Buenaventura'], ['DEP003', 'Depósito aeroportuario El Dorado'], ['DEP087', 'Depósito público de Barranquilla'],
    ],
  },
  paises: {
    titulo: 'Países',
    nota: 'Código ISO de dos letras.',
    filas: [
      ['DE', 'Alemania'], ['AR', 'Argentina'], ['BS', 'Bahamas'], ['BD', 'Bangladés'], ['BE', 'Bélgica'], ['BR', 'Brasil'], ['CA', 'Canadá'],
      ['CL', 'Chile'], ['CN', 'China'], ['CY', 'Chipre'], ['CO', 'Colombia'], ['KR', 'Corea del Sur'], ['CR', 'Costa Rica'], ['EC', 'Ecuador'],
      ['ES', 'España'], ['US', 'Estados Unidos'], ['FR', 'Francia'], ['GR', 'Grecia'], ['GT', 'Guatemala'], ['HK', 'Hong Kong'], ['IN', 'India'],
      ['ID', 'Indonesia'], ['MH', 'Islas Marshall'], ['IT', 'Italia'], ['JP', 'Japón'], ['LR', 'Liberia'], ['MT', 'Malta'], ['MX', 'México'],
      ['NL', 'Países Bajos'], ['PA', 'Panamá'], ['PE', 'Perú'], ['PT', 'Portugal'], ['GB', 'Reino Unido'], ['DO', 'República Dominicana'],
      ['SG', 'Singapur'], ['SE', 'Suecia'], ['CH', 'Suiza'], ['TH', 'Tailandia'], ['TW', 'Taiwán'], ['TR', 'Turquía'], ['VE', 'Venezuela'], ['VN', 'Vietnam'],
    ],
  },
  departamentos: {
    titulo: 'Departamentos',
    nota: 'Código DANE del departamento.',
    filas: [
      ['91', 'Amazonas'], ['5', 'Antioquia'], ['81', 'Arauca'], ['8', 'Atlántico'], ['11', 'Bogotá D.C.'], ['13', 'Bolívar'], ['15', 'Boyacá'],
      ['17', 'Caldas'], ['18', 'Caquetá'], ['85', 'Casanare'], ['19', 'Cauca'], ['20', 'Cesar'], ['27', 'Chocó'], ['23', 'Córdoba'],
      ['25', 'Cundinamarca'], ['94', 'Guainía'], ['44', 'La Guajira'], ['95', 'Guaviare'], ['41', 'Huila'], ['47', 'Magdalena'], ['50', 'Meta'],
      ['52', 'Nariño'], ['54', 'Norte de Santander'], ['86', 'Putumayo'], ['63', 'Quindío'], ['66', 'Risaralda'], ['88', 'San Andrés'],
      ['68', 'Santander'], ['70', 'Sucre'], ['73', 'Tolima'], ['76', 'Valle del Cauca'], ['97', 'Vaupés'], ['99', 'Vichada'],
    ],
  },
  ciudades: {
    titulo: 'Ciudades',
    nota: 'Código DANE del municipio: los dos primeros dígitos son el departamento.',
    filas: [
      ['11001', 'Bogotá D.C.'], ['05001', 'Medellín (Antioquia)'], ['76001', 'Cali (Valle del Cauca)'], ['08001', 'Barranquilla (Atlántico)'],
      ['13001', 'Cartagena (Bolívar)'], ['76109', 'Buenaventura (Valle del Cauca)'], ['47001', 'Santa Marta (Magdalena)'], ['68001', 'Bucaramanga (Santander)'],
      ['54001', 'Cúcuta (Norte de Santander)'], ['66001', 'Pereira (Risaralda)'], ['17001', 'Manizales (Caldas)'], ['63001', 'Armenia (Quindío)'],
      ['73001', 'Ibagué (Tolima)'], ['50001', 'Villavicencio (Meta)'], ['52001', 'Pasto (Nariño)'], ['23001', 'Montería (Córdoba)'],
      ['70001', 'Sincelejo (Sucre)'], ['20001', 'Valledupar (Cesar)'], ['44001', 'Riohacha (La Guajira)'], ['15001', 'Tunja (Boyacá)'],
      ['41001', 'Neiva (Huila)'], ['19001', 'Popayán (Cauca)'], ['27001', 'Quibdó (Chocó)'],
    ],
  },
  modos: {
    titulo: 'Modos de transporte',
    nota: 'Medio con el que la mercancía llegó al país.',
    filas: [
      ['1', 'Transporte marítimo'], ['2', 'Transporte ferroviario'], ['3', 'Transporte por carretera'], ['4', 'Transporte aéreo'],
      ['5', 'Envíos postales'], ['6', 'Transporte multimodal'], ['7', 'Instalaciones de transporte fijas'], ['8', 'Transporte fluvial'], ['9', 'Propulsión propia'],
    ],
  },
  transportadores: {
    titulo: 'Transportadores',
    nota: 'Navieras y aerolíneas de práctica con códigos ficticios.',
    ficticia: true,
    filas: [
      ['0457', 'Naviera del Pacífico'], ['0312', 'Línea Marítima del Caribe'], ['0788', 'Transoceánica Andina'], ['0921', 'Naviera Atlántico Sur'],
      ['1205', 'Aerocarga del Norte'], ['1340', 'Carga Aérea Continental'],
    ],
  },
  declarantes: {
    titulo: 'Agencias de aduanas (declarantes)',
    nota: 'Agencias de práctica con datos ficticios. Si el importador actúa directamente, el declarante es él mismo.',
    ficticia: true,
    filas: [
      ['900555123', 'Servicios de Logística Aduanera del Caribe S.A.S., nivel 1'], ['900555456', 'Agencia de Aduanas Puerto Heroico S.A.S., nivel 2'],
      ['900555789', 'Agencia de Aduanas Andina Global S.A.S., nivel 1'], ['900123456', 'HidroColombia S.A.S. (importador que actúa directamente)'],
    ],
  },
  embalajes: {
    titulo: 'Clases de embalaje',
    nota: 'Cómo viene empacada la mercancía.',
    filas: [
      ['PK', 'Paquete o bulto'], ['BX', 'Caja'], ['CT', 'Caja de cartón'], ['CR', 'Jaula o guacal'], ['BG', 'Bolsa o saco'], ['DR', 'Tambor'],
      ['PX', 'Estiba o pallet'], ['BE', 'Atado'], ['BA', 'Barril'], ['NE', 'Sin embalar'],
    ],
  },
  unidades: {
    titulo: 'Unidades comerciales',
    nota: 'Unidad en que se vendió la mercancía.',
    filas: [['U', 'Unidades o artículos'], ['KG', 'Kilogramo'], ['M', 'Metro'], ['M2', 'Metro cuadrado'], ['L', 'Litro'], ['PR', 'Par'], ['DPC', 'Docena']],
  },
  modalidades: {
    titulo: 'Modalidades de importación',
    nota: 'Anexo de la Resolución DIAN 46 de 2019.',
    filas: [
      ['C100', 'Importación ordinaria'], ['C150', 'Importación con franquicia del gravamen arancelario'], ['C160', 'Importación con franquicia total'],
      ['S100', 'Importación temporal de corto plazo'], ['S120', 'Importación temporal de largo plazo'], ['S130', 'Importación temporal en arrendamiento'],
      ['C660', 'Reimportación en el mismo estado'],
    ],
  },
  bancos: {
    titulo: 'Bancos',
    nota: 'Entidades financieras donde se pagan los tributos, con su código de referencia. Verifica el código vigente con la entidad.',
    filas: [
      ['001', 'Banco de Bogotá'], ['002', 'Banco Popular'], ['007', 'Bancolombia'], ['013', 'BBVA Colombia'], ['023', 'Banco de Occidente'],
      ['032', 'Banco Caja Social'], ['040', 'Banco Agrario de Colombia'], ['051', 'Banco Davivienda'], ['052', 'Banco AV Villas'],
    ],
  },
};

// Busca en una tabla por código o por nombre, sin tildes ni mayúsculas
export function buscarCodigo(tabla, consulta) {
  const norma = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const q = norma(consulta.trim());
  const filas = TABLAS[tabla]?.filas || [];
  return q ? filas.filter(([c, n]) => norma(c).includes(q) || norma(n).includes(q)) : filas;
}
