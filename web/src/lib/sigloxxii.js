import { calcular500 } from './formularios.js';
import { digitoVerificacion } from './nit.js';
import { normalizar } from './texto.js';

// SIGLO XXII: simulador educativo del trámite de una declaración de importación en el sistema
// informático aduanero (el recorrido sigue el del sistema SIGLO XXI de la DIAN: ingreso, menú,
// parámetros previos, encabezado y subpartida con autoliquidación). Todos los datos son ficticios.

export const CREDENCIALES = { usuario: 'ALUMNO01', clave: 'practica' };
// Identificador con el que la práctica terminada se guarda en el servidor
export const PRACTICA = 'sigloxxii-importacion';
// Cada cuenta de BonCloud tiene su propio usuario del simulador, como el código que la DIAN le
// asigna a cada usuario aduanero. El invitado usa el de ejemplo.
export const usuarioDePractica = (usuario) => (usuario && !usuario.invitado && Number.isInteger(usuario.id)
  ? `A${String(usuario.id).padStart(6, '0')}`
  : CREDENCIALES.usuario);
export const ADMINISTRACION = { codigo: '48', nombre: 'Cartagena' };
export const TASA_SEMANA = 4100;

// Menú en cascada. Cada nivel abre el siguiente.
export const MENU = {
  '': ['SIGLOXXII', 'Importaciones'],
  Importaciones: ['Declarante SIA ó ALTEX'],
  'Declarante SIA ó ALTEX': ['Declaraciones', 'Recibo Oficial Pago', 'Árbol de Documentos', 'ROP Declaración Especial'],
  Declaraciones: ['Declaración Importación', 'Solicitud Inspección', 'Documentos Soporte'],
  'Declaración Importación': ['Encabezado'],
  Encabezado: ['Ingresar', 'Consultar', 'Modificar', 'Borrar', 'Actualizar Anticipada'],
};
export const RUTA_MENU = ['Importaciones', 'Declarante SIA ó ALTEX', 'Declaraciones', 'Declaración Importación', 'Encabezado', 'Ingresar'];
export const opcionesMenu = (ruta) => MENU[ruta[ruta.length - 1] ?? ''] || [];

export const DEPARTAMENTOS = [
  ['91', 'AMAZONAS'], ['5', 'ANTIOQUIA'], ['81', 'ARAUCA'], ['8', 'ATLANTICO'], ['11', 'BOGOTA'], ['13', 'BOLIVAR'], ['15', 'BOYACA'],
  ['17', 'CALDAS'], ['18', 'CAQUETA'], ['85', 'CASANARE'], ['19', 'CAUCA'], ['20', 'CESAR'], ['27', 'CHOCO'], ['23', 'CORDOBA'],
  ['25', 'CUNDINAMARCA'], ['94', 'GUAINIA'], ['44', 'GUAJIRA'], ['95', 'GUAVIARE'], ['41', 'HUILA'], ['47', 'MAGDALENA'], ['50', 'META'],
  ['52', 'NARINO'], ['54', 'NORTE DE SANTANDER'], ['86', 'PUTUMAYO'], ['63', 'QUINDIO'], ['66', 'RISARALDA'], ['88', 'SAN ANDRES'],
  ['68', 'SANTANDER'], ['70', 'SUCRE'], ['73', 'TOLIMA'], ['76', 'VALLE'], ['97', 'VAUPES'], ['99', 'VICHADA'],
];
export const FORMAS_PAGO = [['01', 'Giro directo'], ['02', 'Financiación del intermediario del mercado cambiario'], ['03', 'Financiación directa del proveedor'], ['99', 'Importación que no genera pago al exterior']];
export const TIPOS_IMPORTACION = [['01', 'Reembolsable'], ['02', 'Donación'], ['03', 'Importación temporal para reparación o mejora'], ['04', 'Importación por reposición de partes por inde'], ['05', 'Muestra promocional'], ['06', 'Muestra para exhibición'], ['07', 'Muestra experimental'], ['08', 'Resto de muestras'], ['99', 'Otras no-reembolsables']];
export const CODIGOS_EMPRESA = ['Empresa Privada', 'Empresa Mixta', 'Empresa Pública', 'Persona Natural'];

// Caso del módulo 1 de la Ruta: 500 bombas de engranajes, de Shanghái a Cartagena
export const CASO = {
  documentos: [
    // Los documentos traen nombres, no códigos: el código se busca en las tablas, como en el trabajo
    { titulo: 'RUT del importador', datos: [['Razón social', 'HidroColombia S.A.S. (empresa ficticia)'], ['NIT', '900123456-8'], ['Dirección', 'Zona Industrial de Mamonal'], ['Ciudad', 'Cartagena'], ['Departamento', 'Bolívar'], ['Teléfono', '6050000000'], ['Tipo de empresa', 'Sociedad privada']] },
    { titulo: 'Factura comercial', datos: [['Número', 'ZH-2026-118'], ['Fecha', '5 de febrero de 2026'], ['Vendedor', 'Zhejiang Hydraulic Co. (ficticio)'], ['Ciudad y país', 'Shanghái, China'], ['Dirección', '88 Industrial Road'], ['Mercancía', '500 unidades de bombas de engranajes externos para aceite hidráulico, sin motor'], ['Valor', 'USD 60.000 FOB Shanghái'], ['Pago', 'Transferencia bancaria al proveedor (giro directo)']] },
    { titulo: 'Documento de transporte (B/L)', datos: [['Número', 'SHACTG-2026-0457'], ['Fecha', '12 de febrero de 2026'], ['Puerto de embarque', 'Shanghái, China'], ['Puerto de llegada', 'Cartagena, Colombia'], ['Medio', 'Buque portacontenedores'], ['Bandera del buque', 'Panamá'], ['Naviera', 'Naviera del Pacífico (ficticia)'], ['Bultos', '1 bulto (paquete), en contenedor'], ['Peso bruto', '2.600 kg'], ['Peso neto', '2.400 kg'], ['Flete', 'USD 3.500']] },
    { titulo: 'Manifiesto de carga', datos: [['Número', '116575000000457'], ['Fecha', '10 de marzo de 2026'], ['Depósito de llegada', 'Depósito público del terminal marítimo de Cartagena (ficticio)']] },
    { titulo: 'Póliza de seguro', datos: [['Aseguradora', 'Seguros del Litoral (ficticia)'], ['Prima', 'USD 300']] },
    { titulo: 'Clasificación y tributos', datos: [['Subpartida', '8413.60.90.00 (ficha técnica y lección 3)'], ['Tipo de importación', 'Para quedarse en el país, pagada al proveedor'], ['Arancel', '5% (de práctica)'], ['IVA', 'Tarifa general']] },
    { titulo: 'Quien firma', datos: [['Nombre', 'Ana María Pérez Gómez'], ['Cédula', '1.000.000.001'], ['Cargo', 'Representante legal de HidroColombia']] },
  ],
  // Consulta de inventario por documento de transporte: lo que el sistema muestra antes de declarar
  inventario: {
    manifiesto: '116575000000457', documento: 'SHACTG-2026-0457', transportador: 'Naviera del Pacífico (ficticia)',
    deposito: 'Depósito público del terminal marítimo de Cartagena (ficticio)', consignatario: 'HidroColombia S.A.S. (ficticia)',
    fechaManifiesto: '2026-03-10 08:30', vencimiento: '2026-04-09', prorroga: 'NO', ubicacion: 'Depósito', peso: 2600, cantidad: 1,
  },
  encabezado: {
    administracion: '48', lugar_ingreso: 'CTG', deposito: 'DEP048',
    manifiesto: '116575000000457', manifiesto_fecha: '2026-03-10', doc_transporte: 'SHACTG-2026-0457', doc_transporte_fecha: '2026-02-12',
    signatario_doc: '1000000001', signatario_nombre: 'PEREZ GOMEZ ANA MARIA',
    imp_nit: '900123456', imp_nombre: 'HIDROCOLOMBIA S.A.S.', imp_direccion: 'ZONA INDUSTRIAL DE MAMONAL', imp_telefono: '6050000000',
    imp_ciudad: '13001', imp_departamento: '13', imp_codigo: 'Empresa Privada',
    exp_nombre: 'ZHEJIANG HYDRAULIC CO.', exp_ciudad: 'SHANGHAI', exp_pais: 'CN', exp_direccion: '88 INDUSTRIAL ROAD',
    factura: 'ZH-2026-118', factura_fecha: '2026-02-05',
    pais_procedencia: 'CN', modo_transporte: '1', bandera: 'PA', depto_destino: '13', transportadora: '0457',
  },
  subpartida: {
    modalidad: 'C100', cuotas: '0', subpartida: '8413609000', pais_origen: 'CN', forma_pago: '01', tipo_importacion: '01', pais_compra: 'CN',
    peso_bruto: '2600', peso_neto: '2400', embalaje: 'PK', bultos: '1', subpartidas: '1', unidad_comercial: 'U', cantidad: '500',
    fob: '60000', fletes: '3500', seguros: '300', otros: '0', ajuste: '0', arancel: '5', iva: '19',
  },
};

const limpiar = (t) => normalizar(String(t ?? '').trim()).replace(/[.\s\-/]/g, '');
// Fechas: acepta AAAA-MM-DD, AAAA/MM/DD, DD/MM/AAAA y DD-MM-AAAA
function fecha(t) {
  const s = String(t ?? '').trim();
  let m = /^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})$/.exec(s);
  if (m) return `${m[1]}${m[2].padStart(2, '0')}${m[3].padStart(2, '0')}`;
  m = /^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/.exec(s);
  if (m) return `${m[3]}${m[2].padStart(2, '0')}${m[1].padStart(2, '0')}`;
  return limpiar(s);
}
// Cada campo se compara a su manera; por defecto, sin mayúsculas, tildes, puntos ni guiones
const COMPARAR = {
  fecha: (a, b) => fecha(a) === fecha(b),
  // El código de la ciudad se acepta completo (13001) o solo el del municipio (001)
  ciudad: (a, b) => limpiar(a) === limpiar(b) || limpiar(a).padStart(3, '0') === limpiar(b).slice(-3),
};
const igual = (a, b, modo) => (COMPARAR[modo] || ((x, y) => limpiar(x) === limpiar(y)))(a, b);

// Qué se exige en cada campo: [campo, rótulo, pista]. `libre` solo exige que no esté vacío.
const REGLAS_ENCABEZADO = [
  ['administracion', 'Administración', 'Búscala en la tabla de administraciones: es la seccional donde llegó la carga.'],
  ['lugar_ingreso', 'Lugar de ingreso de las mercancías', 'Mira el puerto de llegada en el B/L y búscalo en la tabla de lugares de ingreso.'],
  ['deposito', 'Depósito', 'Mira el depósito de llegada en el manifiesto y búscalo en la tabla de depósitos.'],
  ['manifiesto', 'Número del manifiesto de carga', 'Está en el manifiesto de carga.'],
  ['manifiesto_fecha', 'Fecha del manifiesto', 'Está en el manifiesto de carga.', 'fecha'],
  ['doc_transporte', 'Número del documento de transporte', 'Está en el B/L.'],
  ['doc_transporte_fecha', 'Fecha del documento de transporte', 'Está en el B/L.', 'fecha'],
  ['signatario_doc', 'Documento del signatario', 'Es la cédula de quien firma, sin puntos.'],
  ['signatario_nombre', 'Apellidos y nombres del signatario', 'Primero los apellidos.', 'libre'],
  ['imp_nit', 'NIT del importador', 'Está en el RUT. Va sin el dígito de verificación.'],
  ['imp_nombre', 'Nombre del importador', 'Como figura en el RUT.', 'libre'],
  ['imp_direccion', 'Dirección del importador', 'La del RUT.', 'libre'],
  ['imp_telefono', 'Teléfono', 'El del RUT.', 'libre'],
  ['imp_ciudad', 'Ciudad', 'Mira la ciudad en el RUT y búscala en la tabla de ciudades.', 'ciudad'],
  ['imp_departamento', 'Departamento', 'Mira el departamento en el RUT.'],
  ['imp_codigo', 'Código (tipo de empresa)', 'Mira el tipo de empresa en el RUT.'],
  ['exp_nombre', 'Exportador o proveedor en el exterior', 'El vendedor de la factura.', 'libre'],
  ['exp_ciudad', 'Ciudad del exportador', 'La de la factura.', 'libre'],
  ['exp_pais', 'País exportador', 'Mira el país del vendedor en la factura y búscalo en la tabla de países.'],
  ['exp_direccion', 'Dirección del exportador', 'La de la factura.', 'libre'],
  ['factura', 'Número de factura', 'Está en la factura comercial.'],
  ['factura_fecha', 'Fecha de la factura', 'Está en la factura comercial.', 'fecha'],
  ['pais_procedencia', 'País de procedencia', 'Es el país desde donde se embarcó la carga, según el B/L. Búscalo en la tabla de países.'],
  ['modo_transporte', 'Modo de transporte', 'Mira en el B/L cómo llegó la carga y búscalo en la tabla de modos de transporte.'],
  ['bandera', 'Bandera', 'Mira la bandera del buque en el B/L y búscala en la tabla de países.'],
  ['depto_destino', 'Departamento de destino', 'Es el departamento donde queda la mercancía: búscalo en la tabla de departamentos.'],
  ['transportadora', 'Empresa transportadora', 'Mira la naviera en el B/L y búscala en la tabla de transportadores.'],
];
const REGLAS_SUBPARTIDA = [
  ['modalidad', 'Modalidad', 'Es una importación ordinaria: busca su código en la tabla de modalidades.'],
  ['subpartida', 'Subpartida arancelaria', 'Diez dígitos, según la clasificación del caso.'],
  ['pais_origen', 'País de origen', 'Es el país donde se fabricaron las bombas, según la factura.'],
  ['forma_pago', 'Forma de pago de la importación', 'Mira en la factura cómo se le paga al proveedor.'],
  ['tipo_importacion', 'Tipo de importación', 'Mira en los documentos si la mercancía se le paga al proveedor.'],
  ['pais_compra', 'País de compra', 'Es el país del vendedor, según la factura.'],
  ['peso_bruto', 'Peso bruto', 'Está en el B/L, en kilogramos.'],
  ['peso_neto', 'Peso neto', 'Está en el B/L, en kilogramos.'],
  ['embalaje', 'Embalaje', 'Mira en el B/L cómo viene empacada la carga y búscalo en la tabla de embalajes.'],
  ['bultos', 'Bultos', 'Está en el B/L.'],
  ['subpartidas', 'Subpartidas', 'Cuenta cuántas subpartidas distintas trae la declaración.'],
  ['unidad_comercial', 'Unidad comercial', 'Mira en la factura en qué unidad se vendió y búscala en la tabla de unidades.'],
  ['cantidad', 'Cantidad', 'Está en la factura.'],
  ['fob', 'Valor FOB USD', 'Está en la factura.'],
  ['fletes', 'Valor fletes USD', 'Está en el B/L.'],
  ['seguros', 'Valor seguros USD', 'Está en la póliza de seguro.'],
  ['arancel', 'Porcentaje de arancel', 'Está en la clasificación del caso.'],
  ['iva', 'Porcentaje de IVA', 'Es la tarifa general del IVA.'],
];

function validar(reglas, valores, esperado) {
  return reglas.flatMap(([campo, rotulo, pista, modo]) => {
    const v = String(valores[campo] ?? '').trim();
    if (!v) return [{ campo, mensaje: `${rotulo}: falta. ${pista}` }];
    if (modo !== 'libre' && !igual(v, esperado[campo], modo)) return [{ campo, mensaje: `${rotulo}: no coincide con los documentos del caso. ${pista}` }];
    return [];
  });
}
export const validarEncabezado = (v) => validar(REGLAS_ENCABEZADO, v, CASO.encabezado);
export const validarSubpartida = (v) => validar(REGLAS_SUBPARTIDA, v, CASO.subpartida);

export const dvImportador = (nit) => digitoVerificacion(nit);

// La declaración del alumno pasada a las casillas del formulario 500, para verla e imprimirla
export function aFormulario500(enc, sub) {
  const subpartida = String(sub.subpartida ?? '').replace(/\D/g, '');
  return {
    anio: String(new Date().getFullYear()), tipo_declaracion: '1',
    imp_nit: enc.imp_nit, imp_razon: enc.imp_nombre, imp_seccional: enc.administracion, imp_direccion: enc.imp_direccion,
    imp_telefono: enc.imp_telefono, imp_dpto: enc.imp_departamento, imp_ciudad: enc.imp_ciudad,
    dec_nit: enc.imp_nit, dec_razon: `${enc.imp_nombre} (actúa directamente)`, dec_documento: enc.signatario_doc, dec_nombre: enc.signatario_nombre,
    lugar_ingreso: enc.lugar_ingreso, deposito: enc.deposito, manifiesto: enc.manifiesto, fecha_llegada: enc.manifiesto_fecha,
    doc_transporte: enc.doc_transporte, doc_transporte_fecha: enc.doc_transporte_fecha,
    prov_razon: enc.exp_nombre, prov_ciudad: enc.exp_ciudad, prov_pais: enc.exp_pais, prov_direccion: enc.exp_direccion,
    factura_num: enc.factura, factura_fecha: enc.factura_fecha, pais_procedencia: enc.pais_procedencia, modo_transporte: enc.modo_transporte,
    bandera: enc.bandera, destino_mercancia: enc.depto_destino, transportadora: enc.transportadora, tasa_cambio: String(TASA_SEMANA),
    subpartida: subpartida.length === 10 ? `${subpartida.slice(0, 4)}.${subpartida.slice(4, 6)}.${subpartida.slice(6, 8)}.${subpartida.slice(8)}` : sub.subpartida,
    modalidad: String(sub.modalidad ?? '').toUpperCase(), cuotas: sub.cuotas, pais_origen: sub.pais_origen, forma_pago: sub.forma_pago,
    tipo_importacion: sub.tipo_importacion, pais_compra: sub.pais_compra, peso_bruto: sub.peso_bruto, peso_neto: sub.peso_neto,
    embalaje: sub.embalaje, bultos: sub.bultos, num_subpartidas: sub.subpartidas, unidad_fisica: sub.unidad_comercial, cantidad: sub.cantidad,
    v_fob: sub.fob, v_fletes: sub.fletes, v_seguros: sub.seguros, v_otros: sub.otros, v_ajuste: sub.ajuste,
    tasa_arancel: sub.arancel, tasa_iva: sub.iva,
    descripcion: 'Bombas de engranajes externos para aceite hidráulico, sin motor. 500 unidades.',
  };
}

// Autoliquidación: la misma fórmula del formulario 500
export function liquidar(v, tasa = TASA_SEMANA) {
  const r = calcular500({ v_fob: v.fob, v_fletes: v.fletes, v_seguros: v.seguros, v_otros: v.otros, v_ajuste: v.ajuste, tasa_cambio: tasa, tasa_arancel: v.arancel, tasa_iva: v.iva, modalidad: v.modalidad });
  return { gastos: r.gastos, aduanaUSD: r.aduanaUSD, baseArancel: r.aduanaCOP, arancel: r.arancel, baseIVA: r.baseIVA, iva: r.iva, total: r.arancel + r.iva };
}
