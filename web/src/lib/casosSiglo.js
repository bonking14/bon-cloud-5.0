import { digitoVerificacion } from './nit.js';
import { normalizar } from './texto.js';

// Casos de práctica de SIGLO XXII. Cada cuenta recibe su propio caso, armado a partir de una
// semilla (su número de cuenta): otra mercancía, otro importador, otro proveedor, otro puerto,
// otras cantidades y otros números de documentos, para que los estudiantes no se copien las
// respuestas. La semilla 0 es el caso de ejemplo (las bombas de HidroColombia), el mismo de la
// Ruta guiada. Todas las empresas, marcas y números son ficticios. Las subpartidas y sus
// gravámenes son los del Arancel de Aduanas (Decreto 1881 de 2021); el IVA es la tarifa general.

// Generador de números pseudoaleatorios con semilla: la misma semilla da siempre el mismo caso
function azar(semilla) {
  let a = (semilla * 2654435761) >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Expresión que reconoce un dato en un texto libre, sin importar mayúsculas, tildes, guiones o puntos
const patron = (texto) => new RegExp(normalizar(texto).split(/[^a-z0-9]+/).filter(Boolean).join('\\W*'));
const patronCantidad = (n) => new RegExp(`\\b${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.?')}\\b`);

// Mercancías: subpartida, gravamen, cómo se describe y con qué datos se identifica
const MERCANCIAS = [
  {
    nombre: 'bombas de engranajes externos para aceite hidráulico, sin motor', corto: 'bombas', subpartida: '8413609000', arancel: 5,
    unidad: 'U', embalaje: ['PK', 'paquete'], precio: 120, cantidades: [500, 300, 400, 600], pesoUnidad: 4.8, ident: 'Seriales',
    marca: 'HYDROZ', referencia: 'GP-25', usos: 'sistemas hidráulicos industriales',
    claves: [['el nombre de la mercancía', /bomba/, 'Di qué es, como en la factura.'], ['el tipo', /engranaje/, 'La factura dice de qué tipo son las bombas.'],
      ['para qué sirve', /hidraulic|aceite/, 'La factura dice con qué líquido trabajan.'], ['si trae motor', /sin motor/, 'Es lo que separa esta subpartida de las bombas con motor.']],
  },
  {
    nombre: 'rodamientos rígidos de bolas de acero, de una hilera, medidas 25 x 52 x 15 mm', corto: 'rodamientos', subpartida: '8482100000', arancel: 5,
    unidad: 'U', embalaje: ['CT', 'cajas de cartón'], precio: 3, cantidades: [8000, 6000, 10000, 12000], pesoUnidad: 0.13, ident: 'Lote',
    marca: 'ROTAK', referencia: '6205-2RS', usos: 'motores y maquinaria industrial',
    claves: [['el nombre de la mercancía', /rodamiento/, 'Di qué es, como en la factura.'], ['el tipo', /bola/, 'La factura dice si son de bolas o de rodillos.'],
      ['el material', /acero/, 'Está en la factura.'], ['las medidas', /25\W*x\W*52/, 'Las medidas están en la factura.']],
  },
  {
    nombre: 'válvulas esféricas de acero inoxidable, diámetro nominal 50 mm, accionamiento manual', corto: 'válvulas', subpartida: '8481804000', arancel: 5,
    unidad: 'U', embalaje: ['BX', 'cajas'], precio: 85, cantidades: [400, 300, 500, 700], pesoUnidad: 2.6, ident: 'Seriales',
    marca: 'VALTEK', referencia: 'BV-50SS', usos: 'redes de agua y fluidos industriales',
    claves: [['el nombre de la mercancía', /valvula/, 'Di qué es, como en la factura.'], ['el tipo', /esferic/, 'La factura dice de qué tipo son las válvulas.'],
      ['el material', /inoxidable/, 'Está en la factura.'], ['el diámetro', /50\W*mm/, 'El diámetro nominal está en la factura.']],
  },
  {
    nombre: 'cadenas de transmisión de rodillos de acero, paso norma ANSI 80, en tramos de 3 m', corto: 'cadenas', subpartida: '7315110000', arancel: 5,
    unidad: 'M', embalaje: ['BX', 'cajas'], precio: 14, cantidades: [3000, 2400, 3600, 4500], pesoUnidad: 2.5, ident: 'Lote',
    marca: 'KETTLER-X', referencia: 'RC80-1', usos: 'transportadores y maquinaria agrícola',
    claves: [['el nombre de la mercancía', /cadena/, 'Di qué es, como en la factura.'], ['el tipo', /rodillo/, 'La factura dice de qué tipo son las cadenas.'],
      ['el material', /acero/, 'Está en la factura.'], ['la norma del paso', /ansi\W*80/, 'El paso está en la factura.']],
  },
  {
    nombre: 'reductores de velocidad de engranajes sinfín corona, relación 1:30, sin motor', corto: 'reductores', subpartida: '8483409100', arancel: 5,
    unidad: 'U', embalaje: ['CR', 'guacales'], precio: 260, cantidades: [150, 120, 200, 240], pesoUnidad: 18, ident: 'Seriales',
    marca: 'GEARMAX', referencia: 'WR-63', usos: 'bandas transportadoras',
    claves: [['el nombre de la mercancía', /reductor/, 'Di qué es, como en la factura.'], ['qué hace', /velocidad/, 'La factura dice qué reduce.'],
      ['la relación', /1\W*30/, 'La relación de reducción está en la factura.'], ['si trae motor', /sin motor/, 'Sin motor es otra subpartida que con motor.']],
  },
  {
    nombre: 'estanterías metálicas de acero para bodega, desarmadas, de 2 m de alto', corto: 'estanterías', subpartida: '9403200000', arancel: 15,
    unidad: 'U', embalaje: ['PX', 'estibas'], precio: 95, cantidades: [300, 250, 400, 500], pesoUnidad: 32, ident: 'Lote',
    marca: 'STOREX', referencia: 'SR-200', usos: 'almacenamiento en bodegas',
    claves: [['el nombre de la mercancía', /estanteria/, 'Di qué es, como en la factura.'], ['el material', /metal|acero/, 'Está en la factura.'],
      ['para qué sirve', /bodega|almacen/, 'La factura dice para qué son.'], ['cómo vienen', /desarmad/, 'Si vienen armadas o desarmadas está en la factura.']],
  },
];

// Proveedores en países sin acuerdo comercial vigente con Colombia (no se pide preferencia)
const PROVEEDORES = [
  { nombre: 'ZHEJIANG HYDRAULIC CO.', ficticio: 'Zhejiang Hydraulic Co.', ciudad: 'SHANGHAI', ciudadDoc: 'Shanghái', pais: 'CN', paisNombre: 'China', direccion: '88 INDUSTRIAL ROAD', prefijo: 'ZH', puerto: 'Shanghái' },
  { nombre: 'KANSAI KIKAI CO. LTD.', ficticio: 'Kansai Kikai Co. Ltd.', ciudad: 'YOKOHAMA', ciudadDoc: 'Yokohama', pais: 'JP', paisNombre: 'Japón', direccion: '3-12 MINATO MIRAI', prefijo: 'KK', puerto: 'Yokohama' },
  { nombre: 'BHARAT ENGINEERING PVT. LTD.', ficticio: 'Bharat Engineering Pvt. Ltd.', ciudad: 'MUMBAI', ciudadDoc: 'Bombay (Mumbai)', pais: 'IN', paisNombre: 'India', direccion: '14 MIDC ANDHERI EAST', prefijo: 'BE', puerto: 'Nhava Sheva (Bombay)' },
  { nombre: 'SAIGON MECHANICAL JSC', ficticio: 'Saigon Mechanical JSC', ciudad: 'HO CHI MINH', ciudadDoc: 'Ciudad Ho Chi Minh', pais: 'VN', paisNombre: 'Vietnam', direccion: '220 TAN THUAN EPZ', prefijo: 'SM', puerto: 'Ciudad Ho Chi Minh' },
  { nombre: 'KAOHSIUNG PRECISION CO.', ficticio: 'Kaohsiung Precision Co.', ciudad: 'KAOHSIUNG', ciudadDoc: 'Kaohsiung', pais: 'TW', paisNombre: 'Taiwán', direccion: '51 LINHAI 2ND ROAD', prefijo: 'KP', puerto: 'Kaohsiung' },
];

// Importadores (todos actúan directamente, sin agencia de aduanas)
const IMPORTADORES = [
  { nombre: 'HIDROCOLOMBIA S.A.S.', ficticio: 'HidroColombia S.A.S.', nit: '900123456', direccion: 'ZONA INDUSTRIAL DE MAMONAL', direccionDoc: 'Zona Industrial de Mamonal', ciudad: '13001', ciudadNombre: 'Cartagena', depto: '13', deptoNombre: 'Bolívar', deptoMayus: 'BOLIVAR', telefono: '6050000000', firmante: ['PEREZ GOMEZ ANA MARIA', 'Ana María Pérez Gómez', '1000000001'] },
  { nombre: 'METALMECANICA DEL VALLE S.A.S.', ficticio: 'Metalmecánica del Valle S.A.S.', nit: '900765432', direccion: 'CALLE 15 26 50 ACOPI', direccionDoc: 'Calle 15 # 26-50, Acopi', ciudad: '76001', ciudadNombre: 'Cali', depto: '76', deptoNombre: 'Valle del Cauca', deptoMayus: 'VALLE DEL CAUCA', telefono: '6023800000', firmante: ['RAMIREZ OSPINA CARLOS ANDRES', 'Carlos Andrés Ramírez Ospina', '1000000002'] },
  { nombre: 'FERRETERIA INDUSTRIAL ANDINA S.A.S.', ficticio: 'Ferretería Industrial Andina S.A.S.', nit: '901234567', direccion: 'AVENIDA CALLE 13 68 40', direccionDoc: 'Avenida Calle 13 # 68-40', ciudad: '11001', ciudadNombre: 'Bogotá D.C.', depto: '11', deptoNombre: 'Bogotá D.C.', deptoMayus: 'BOGOTA D.C.', telefono: '6014100000', firmante: ['TORRES MEJIA LAURA', 'Laura Torres Mejía', '1000000003'] },
  { nombre: 'MAQUINARIA DEL CARIBE S.A.S.', ficticio: 'Maquinaria del Caribe S.A.S.', nit: '900987654', direccion: 'VIA 40 71 125', direccionDoc: 'Vía 40 # 71-125', ciudad: '08001', ciudadNombre: 'Barranquilla', depto: '8', deptoNombre: 'Atlántico', deptoMayus: 'ATLANTICO', telefono: '6053600000', firmante: ['DIAZ BARRIOS JORGE LUIS', 'Jorge Luis Díaz Barrios', '1000000004'] },
];

// Puertos de llegada con su administración, depósito y prefijo del manifiesto
const PUERTOS = {
  CTG: { administracion: ['48', 'Cartagena'], lugar: 'CTG', ciudad: 'Cartagena', deposito: ['DEP048', 'Depósito público del terminal marítimo de Cartagena (ficticio)'], manifiesto: '1165750' },
  BUN: { administracion: ['35', 'Buenaventura'], lugar: 'BUN', ciudad: 'Buenaventura', deposito: ['DEP035', 'Depósito público del terminal de Buenaventura (ficticio)'], manifiesto: '1163510' },
};
const NAVIERAS = [['0457', 'Naviera del Pacífico (ficticia)'], ['0312', 'Línea Marítima del Caribe (ficticia)'], ['0788', 'Transoceánica Andina (ficticia)'], ['0921', 'Naviera Atlántico Sur (ficticia)']];
const BANDERAS = [['PA', 'Panamá'], ['LR', 'Liberia'], ['MH', 'Islas Marshall'], ['MT', 'Malta'], ['BS', 'Bahamas']];
const BANCOS = [['001', 'Banco de Bogotá'], ['002', 'Banco Popular'], ['007', 'Bancolombia'], ['013', 'BBVA Colombia'], ['023', 'Banco de Occidente'], ['051', 'Banco Davivienda'], ['052', 'Banco AV Villas']];
const INSPECCIONES = ['automatico', 'automatico', 'documental', 'fisica', 'automatico', 'documental', 'fisica'];

const fechaLarga = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][m - 1]} de ${a}`;
};
const miles = (n) => n.toLocaleString('es-CO');

export function generarCaso(semilla = 0) {
  const r = azar(semilla);
  const elegir = (lista) => (semilla === 0 ? lista[0] : lista[Math.floor(r() * lista.length)]);
  const entre = (min, max) => min + Math.floor(r() * (max - min + 1));

  const m = elegir(MERCANCIAS);
  const prov = elegir(PROVEEDORES);
  const imp = elegir(IMPORTADORES);
  // Al Valle se llega por Buenaventura; a los demás, por Cartagena
  const puerto = PUERTOS[imp.depto === '76' ? 'BUN' : 'CTG'];
  const naviera = elegir(NAVIERAS);
  const bandera = elegir(BANDERAS);
  const banco = elegir(BANCOS);
  const inspeccion = semilla === 0 ? 'automatico' : INSPECCIONES[Math.floor(r() * INSPECCIONES.length)];

  const cantidad = elegir(m.cantidades);
  const fob = Math.round(cantidad * m.precio);
  const flete = semilla === 0 ? 3500 : Math.round((2500 + r() * 2500) / 50) * 50;
  const seguro = semilla === 0 ? 300 : Math.round((fob * 0.005) / 10) * 10;
  const neto = Math.round(cantidad * m.pesoUnidad);
  const bruto = semilla === 0 ? 2600 : Math.round(neto * 1.08);
  const bultos = semilla === 0 ? 1 : Math.max(1, Math.round(bruto / 900));
  const n = semilla === 0 ? 457 : entre(100, 989);
  const nn = String(n).padStart(4, '0');
  const facturaNum = semilla === 0 ? 'ZH-2026-118' : `${prov.prefijo}-2026-${entre(100, 899)}`;
  const factura = facturaNum.replace(/^[A-Z]+-/, '');
  const docTransporte = semilla === 0 ? 'SHACTG-2026-0457' : `${prov.pais}${puerto.lugar}-2026-${nn}`;
  const manifiesto = `${puerto.manifiesto}0000${nn}`.slice(0, 15);
  const transportadora = semilla === 0 ? '0457' : naviera[0];
  const identDesde = `${prov.prefijo}${m.referencia.replace(/\D/g, '').slice(0, 3)}-0001`;
  const ident = m.ident === 'Seriales' ? `${identDesde} a ${identDesde.replace(/0001$/, String(cantidad).padStart(4, '0'))}` : `LT-2026-${nn}`;
  const identClave = m.ident === 'Seriales' ? identDesde : ident;
  const cheque = semilla === 0 ? '004571' : String(entre(100000, 999999));
  const dav = semilla === 0 ? '48000456' : `${puerto.administracion[0].padStart(2, '0')}000${String(n - 1).padStart(3, '0')}`;
  const fechas = { factura: '2026-02-05', transporte: '2026-02-12', manifiesto: '2026-03-10', dav: '2026-03-11' };
  const descripcion = `${m.nombre.toUpperCase()}. MARCA ${m.marca}, REFERENCIA ${m.referencia}, ${m.ident.toUpperCase()} ${ident.toUpperCase()}. CANTIDAD: ${cantidad} ${m.unidad === 'M' ? 'METROS' : 'UNIDADES'}. USO: ${m.usos.toUpperCase()}.`;
  const cantidadTexto = `${miles(cantidad)} ${m.unidad === 'M' ? 'metros' : 'unidades'}`;

  return {
    semilla,
    mercancia: m.corto,
    administracion: { codigo: puerto.administracion[0], nombre: puerto.administracion[1] },
    inspeccion,
    resumen: `${imp.ficticio} importa ${cantidadTexto} de ${m.corto} desde ${prov.paisNombre}, con llegada a ${puerto.ciudad}${semilla === 0 ? ' (caso del módulo 1 de la Ruta)' : ''}.`,
    documentos: [
      { titulo: 'RUT del importador', datos: [['Razón social', `${imp.ficticio} (empresa ficticia)`], ['NIT', `${imp.nit}-${digitoVerificacion(imp.nit)}`], ['Dirección', imp.direccionDoc], ['Ciudad', imp.ciudadNombre], ['Departamento', imp.deptoNombre], ['Teléfono', imp.telefono], ['Tipo de empresa', 'Sociedad privada']] },
      { titulo: 'Factura comercial', datos: [['Número', facturaNum], ['Fecha', fechaLarga(fechas.factura)], ['Vendedor', `${prov.ficticio} (ficticio)`], ['Ciudad y país', `${prov.ciudadDoc}, ${prov.paisNombre}`], ['Dirección', prov.direccion.replace(/\b\w+/g, (p) => p.charAt(0) + p.slice(1).toLowerCase())], ['Mercancía', `${cantidadTexto} de ${m.nombre}`], ['Marca', `${m.marca} (ficticia)`], ['Referencia', m.referencia], [m.ident, ident], ['Valor', `USD ${miles(fob)} FOB ${prov.puerto}`], ['Pago', 'Transferencia bancaria al proveedor (giro directo)']] },
      { titulo: 'Documento de transporte (B/L)', datos: [['Número', docTransporte], ['Fecha', fechaLarga(fechas.transporte)], ['Puerto de embarque', `${prov.puerto}, ${prov.paisNombre}`], ['Puerto de llegada', `${puerto.ciudad}, Colombia`], ['Medio', 'Buque portacontenedores'], ['Bandera del buque', bandera[1]], ['Naviera', semilla === 0 ? 'Naviera del Pacífico (ficticia)' : naviera[1]], ['Bultos', `${bultos} ${bultos === 1 ? 'bulto' : 'bultos'} (${m.embalaje[1]}), en contenedor`], ['Peso bruto', `${miles(bruto)} kg`], ['Peso neto', `${miles(neto)} kg`], ['Flete', `USD ${miles(flete)}`]] },
      { titulo: 'Manifiesto de carga', datos: [['Número', manifiesto], ['Fecha', fechaLarga(fechas.manifiesto)], ['Depósito de llegada', puerto.deposito[1]]] },
      { titulo: 'Lista de empaque', datos: [['Número', `PL-2026-${factura.split('-').pop()}`], ['Fecha', fechaLarga(fechas.factura)], ['Contenido', `${bultos} ${bultos === 1 ? 'bulto' : 'bultos'} (${m.embalaje[1]}) con ${cantidadTexto}`]] },
      { titulo: 'Póliza de seguro', datos: [['Aseguradora', 'Seguros del Litoral (ficticia)'], ['Prima', `USD ${miles(seguro)}`]] },
      { titulo: 'Clasificación y tributos', datos: [['Subpartida', `${m.subpartida.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3.$4')}${semilla === 0 ? ' (ficha técnica y lección 3)' : ''}`], ['Tipo de importación', 'Para quedarse en el país, pagada al proveedor'], ['Arancel', `${m.arancel}%${semilla === 0 ? ' (de práctica)' : ' (Decreto 1881 de 2021)'}`], ['IVA', 'Tarifa general'], ['Acuerdo comercial', `${prov.paisNombre} no tiene acuerdo comercial vigente con Colombia: no se pide preferencia`], ['Requisitos', 'La subpartida no exige registro ni licencia previa de importación']] },
      { titulo: 'Declaración andina del valor', datos: [['Formulario', '560, radicada en el sistema antes de la declaración'], ['No. de radicado', dav], ['Fecha', fechaLarga(fechas.dav)]] },
      { titulo: 'Instrucción de pago', datos: [['Forma de pago de los tributos', 'Un solo cheque de gerencia por el total'], ['No. del cheque', cheque], ['Banco', banco[1]]] },
      { titulo: 'Quien firma', datos: [['Nombre', imp.firmante[1]], ['Cédula', miles(Number(imp.firmante[2]))], ['Cargo', `Representante legal de ${imp.ficticio.replace(/ S\.A\.S\.$/, '')}`]] },
    ],
    // Consulta de inventario por documento de transporte: lo que el sistema muestra antes de declarar
    inventario: {
      manifiesto, documento: docTransporte, transportador: semilla === 0 ? 'Naviera del Pacífico (ficticia)' : naviera[1],
      deposito: puerto.deposito[1], consignatario: `${imp.ficticio} (ficticia)`,
      fechaManifiesto: `${fechas.manifiesto} 08:30`, vencimiento: '2026-04-09', prorroga: 'NO', ubicacion: 'Depósito', peso: bruto, cantidad: bultos, embalaje: m.embalaje[0],
    },
    importador: {
      departamento: imp.depto, departamentoNombre: imp.deptoMayus, ciudad: imp.ciudadNombre, nit: imp.nit, dv: String(digitoVerificacion(imp.nit)),
      razon: imp.ficticio, depto: imp.deptoNombre, direccion: imp.direccionDoc,
    },
    encabezado: {
      administracion: puerto.administracion[0], lugar_ingreso: puerto.lugar, deposito: puerto.deposito[0],
      manifiesto, manifiesto_fecha: fechas.manifiesto, doc_transporte: docTransporte, doc_transporte_fecha: fechas.transporte,
      signatario_doc: imp.firmante[2], signatario_nombre: imp.firmante[0],
      imp_nit: imp.nit, imp_nombre: imp.nombre, imp_direccion: imp.direccion, imp_telefono: imp.telefono,
      imp_ciudad: imp.ciudad, imp_departamento: imp.depto, imp_codigo: 'Empresa Privada',
      exp_nombre: prov.nombre, exp_ciudad: prov.ciudad, exp_pais: prov.pais, exp_direccion: prov.direccion,
      factura: facturaNum, factura_fecha: fechas.factura,
      pais_procedencia: prov.pais, modo_transporte: '1', bandera: bandera[0], depto_destino: imp.depto, transportadora,
    },
    subpartida: {
      modalidad: 'C100', cuotas: '0', subpartida: m.subpartida, pais_origen: prov.pais, forma_pago: '01', tipo_importacion: '01', pais_compra: prov.pais,
      peso_bruto: String(bruto), peso_neto: String(neto), embalaje: m.embalaje[0], bultos: String(bultos), subpartidas: '1', unidad_comercial: m.unidad, cantidad: String(cantidad),
      fob: String(fob), fletes: String(flete), seguros: String(seguro), otros: '0', ajuste: '0', arancel: String(m.arancel), iva: '19',
    },
    descripcion,
    descripcionMinima: [
      ...m.claves,
      ['la marca', patron(m.marca), 'Está en la factura.'],
      ['la referencia o modelo', patron(m.referencia), 'Está en la factura.'],
      [m.ident === 'Seriales' ? 'los seriales' : 'el lote', patron(identClave), m.ident === 'Seriales' ? 'Están en la factura: anota el rango completo.' : 'Está en la factura.'],
      ['la cantidad', patronCantidad(cantidad), 'Cuántas unidades ampara la declaración.'],
    ],
    pago: { numero: cheque, banco: banco[0] },
    soportes: [
      { id: 'factura', nombre: 'Factura comercial', estado: 'SI', numero: facturaNum, fecha: fechas.factura, pista: 'Mira la factura comercial.' },
      { id: 'transporte', nombre: 'Documento de transporte', estado: 'SI', numero: docTransporte, fecha: fechas.transporte, pista: 'Mira el B/L.' },
      { id: 'empaque', nombre: 'Lista de empaque', estado: 'SI', numero: `PL-2026-${factura.split('-').pop()}`, fecha: fechas.factura, pista: 'Mira la lista de empaque.' },
      { id: 'valor', nombre: 'Declaración andina del valor', estado: 'SI', numero: dav, fecha: fechas.dav, pista: 'Se exige porque el valor FOB pasa de USD 5.000. Como se radicó en el sistema, el número es el de radicado.' },
      { id: 'mandato', nombre: 'Mandato aduanero', estado: 'NR', pista: 'Solo se exige cuando una agencia de aduanas declara por el importador. Mira quién firma.' },
      { id: 'origen', nombre: 'Certificado de origen', estado: 'NR', pista: 'Solo se presenta para pedir una preferencia de un acuerdo comercial. Mira la clasificación del caso.' },
      { id: 'registro', nombre: 'Registro o licencia de importación', estado: 'NR', pista: 'Mira en la clasificación del caso si la subpartida exige requisitos previos.' },
    ],
    // Lo que el funcionario encuentra si la declaración sale a inspección física
    hallazgos: [
      ['Cantidad', cantidadTexto],
      ['Peso bruto', `${miles(bruto)} kg`],
      ['Bultos', `${bultos} (${m.embalaje[1]})`],
      ['Marca y referencia', `${m.marca} ${m.referencia}`],
      [m.ident, ident],
      ['Mercancía', m.nombre],
    ],
    // Para la práctica de corrección: después del levante se supo que el flete real era mayor
    correccion: {
      fleteReal: flete + (semilla === 0 ? 1000 : Math.round((600 + r() * 1400) / 50) * 50),
      facturaFlete: `FL-2026-${nn}`,
    },
  };
}

// Valores del RUT (formulario 001) del importador del caso, para abrirlo junto a SIGLO XXII
export function rutDelCaso(semilla) {
  const i = generarCaso(semilla).importador;
  return {
    concepto: '02', nit: i.nit, seccional: i.ciudad === 'Cartagena' ? 'Impuestos y Aduanas de Cartagena' : `Dirección Seccional de ${i.ciudad.replace(/ D\.C\.$/, '')}`,
    tipo_contribuyente: '1', tipo_doc: '31', num_id: i.nit,
    razon_social: `${i.razon} (empresa ficticia)`, nombre_comercial: i.razon.replace(/ S\.A\.S\.$/, ''),
    pais: 'Colombia', departamento: i.depto, ciudad: i.ciudad, dir_principal: `${i.direccion}, ${i.ciudad}`,
    act_principal: '4659', establecimientos: '1',
    resp_1: '05', resp_2: '10', resp_3: '42', resp_4: '48', resp_5: '52', adu_1: '23',
  };
}
