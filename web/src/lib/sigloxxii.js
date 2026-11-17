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
    { titulo: 'RUT del importador', datos: [['Razón social', 'HidroColombia S.A.S. (empresa ficticia)'], ['NIT', '900123456'], ['Dirección', 'Zona Industrial de Mamonal'], ['Ciudad', 'Cartagena (13001)'], ['Departamento', 'Bolívar (13)'], ['Teléfono', '6050000000'], ['Tipo de empresa', 'Empresa Privada']] },
    { titulo: 'Factura comercial', datos: [['Número', 'ZH-2026-118'], ['Fecha', '2026-02-05'], ['Proveedor', 'Zhejiang Hydraulic Co. (ficticio)'], ['Ciudad y país', 'Shanghái, China (CN)'], ['Dirección', '88 Industrial Road'], ['Mercancía', '500 bombas de engranajes externos para aceite hidráulico, sin motor'], ['Valor FOB', 'USD 60.000'], ['Forma de pago', 'Giro directo']] },
    { titulo: 'Documento de transporte (B/L)', datos: [['Número', 'SHACTG-2026-0457'], ['Fecha', '2026-02-12'], ['Puerto de embarque', 'Shanghái (CN)'], ['Puerto de llegada', 'Cartagena (CTG)'], ['Modo', 'Marítimo (1)'], ['Bandera del buque', 'Panamá (PA)'], ['Naviera', 'Naviera del Pacífico, código 0457 (ficticio)'], ['Bultos', '1 contenedor, embalaje PK'], ['Peso bruto', '2.600 kg'], ['Peso neto', '2.400 kg'], ['Flete', 'USD 3.500']] },
    { titulo: 'Manifiesto de carga y depósito', datos: [['Manifiesto', '116575000000457'], ['Fecha', '2026-03-10'], ['Depósito', 'DEP048 (depósito público ficticio)']] },
    { titulo: 'Otros datos', datos: [['Póliza de seguro', 'USD 300'], ['Subpartida', '8413.60.90.00'], ['Modalidad', 'C100 (importación ordinaria)'], ['Arancel', '5% (de práctica)'], ['IVA', '19%'], ['Firma', 'Ana María Pérez Gómez, C.C. 1000000001']] },
  ],
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

const igual = (a, b) => normalizar(String(a ?? '').trim()).replace(/[.\s-]/g, '') === normalizar(String(b)).replace(/[.\s-]/g, '');

// Qué se exige en cada campo: [campo, rótulo, pista]. `libre` solo exige que no esté vacío.
const REGLAS_ENCABEZADO = [
  ['administracion', 'Administración', 'La mercancía llegó a Cartagena: administración 48.'],
  ['lugar_ingreso', 'Lugar de ingreso de las mercancías', 'El puerto de llegada del B/L: CTG.'],
  ['deposito', 'Depósito', 'El código del depósito donde está la carga.'],
  ['manifiesto', 'Número del manifiesto de carga', 'Está en el manifiesto que transmitió la naviera.'],
  ['manifiesto_fecha', 'Fecha del manifiesto', 'Año, mes y día del manifiesto.'],
  ['doc_transporte', 'Número del documento de transporte', 'El número del B/L.'],
  ['doc_transporte_fecha', 'Fecha del documento de transporte', 'La fecha del B/L.'],
  ['signatario_doc', 'Documento del signatario', 'La cédula de quien firma la declaración.'],
  ['signatario_nombre', 'Apellidos y nombres del signatario', 'Primero los apellidos.', 'libre'],
  ['imp_nit', 'NIT del importador', 'Sin dígito de verificación, puntos ni guiones.'],
  ['imp_nombre', 'Nombre del importador', 'Como figura en el RUT.', 'libre'],
  ['imp_direccion', 'Dirección del importador', 'La del RUT.', 'libre'],
  ['imp_telefono', 'Teléfono', 'El del RUT.', 'libre'],
  ['imp_ciudad', 'Ciudad', 'Código DANE de Cartagena: 13001.'],
  ['imp_departamento', 'Departamento', 'Bolívar es 13.'],
  ['imp_codigo', 'Código (tipo de empresa)', 'HidroColombia es una empresa privada.'],
  ['exp_nombre', 'Exportador o proveedor en el exterior', 'El vendedor de la factura.', 'libre'],
  ['exp_ciudad', 'Ciudad del exportador', 'La de la factura.', 'libre'],
  ['exp_pais', 'País exportador', 'Código de China: CN.'],
  ['exp_direccion', 'Dirección del exportador', 'La de la factura.', 'libre'],
  ['factura', 'Número de factura', 'El de la factura comercial.'],
  ['factura_fecha', 'Fecha de la factura', 'La de la factura comercial.'],
  ['pais_procedencia', 'País de procedencia', 'De donde viene la carga: CN.'],
  ['modo_transporte', 'Modo de transporte', 'Marítimo es 1.'],
  ['bandera', 'Bandera', 'La del buque en el B/L: PA.'],
  ['depto_destino', 'Departamento de destino', 'Bolívar es 13.'],
  ['transportadora', 'Empresa transportadora', 'El código de la naviera.'],
];
const REGLAS_SUBPARTIDA = [
  ['modalidad', 'Modalidad', 'Importación ordinaria: C100.'],
  ['subpartida', 'Subpartida arancelaria', 'Diez dígitos, sin puntos: 8413609000.'],
  ['pais_origen', 'País de origen', 'Donde se fabricaron las bombas: CN.'],
  ['forma_pago', 'Forma de pago de la importación', 'La factura se paga por giro directo.'],
  ['tipo_importacion', 'Tipo de importación', 'Se paga al proveedor: reembolsable.'],
  ['pais_compra', 'País de compra', 'CN.'],
  ['peso_bruto', 'Peso bruto', 'El del B/L, en kilogramos.'],
  ['peso_neto', 'Peso neto', 'El del B/L, en kilogramos.'],
  ['embalaje', 'Embalaje', 'El código del B/L: PK.'],
  ['bultos', 'Bultos', 'El número de bultos del B/L.'],
  ['subpartidas', 'Subpartidas', 'La declaración tiene una sola subpartida.'],
  ['unidad_comercial', 'Unidad comercial', 'Unidades o artículos: U.'],
  ['cantidad', 'Cantidad', 'Las unidades de la factura.'],
  ['fob', 'Valor FOB USD', 'El de la factura.'],
  ['fletes', 'Valor fletes USD', 'El flete del B/L.'],
  ['seguros', 'Valor seguros USD', 'El de la póliza.'],
  ['arancel', 'Porcentaje de arancel', 'El arancel del caso.'],
  ['iva', 'Porcentaje de IVA', 'La tarifa general.'],
];

function validar(reglas, valores, esperado) {
  return reglas.flatMap(([campo, rotulo, pista, modo]) => {
    const v = String(valores[campo] ?? '').trim();
    if (!v) return [{ campo, mensaje: `${rotulo}: falta. ${pista}` }];
    if (modo !== 'libre' && !igual(v, esperado[campo])) return [{ campo, mensaje: `${rotulo}: no coincide con los documentos del caso. ${pista}` }];
    return [];
  });
}
export const validarEncabezado = (v) => validar(REGLAS_ENCABEZADO, v, CASO.encabezado);
export const validarSubpartida = (v) => validar(REGLAS_SUBPARTIDA, v, CASO.subpartida);

export const dvImportador = (nit) => digitoVerificacion(nit);

// Autoliquidación: la misma fórmula del formulario 500
export function liquidar(v, tasa = TASA_SEMANA) {
  const r = calcular500({ v_fob: v.fob, v_fletes: v.fletes, v_seguros: v.seguros, v_otros: v.otros, v_ajuste: v.ajuste, tasa_cambio: tasa, tasa_arancel: v.arancel, tasa_iva: v.iva, modalidad: v.modalidad });
  return { gastos: r.gastos, aduanaUSD: r.aduanaUSD, baseArancel: r.aduanaCOP, arancel: r.arancel, baseIVA: r.baseIVA, iva: r.iva, total: r.arancel + r.iva };
}
