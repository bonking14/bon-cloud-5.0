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
  'Recibo Oficial Pago': ['Ingresar', 'Modificar', 'Preinformar', 'Imprimir', 'Borrar'],
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
    { titulo: 'Factura comercial', datos: [['Número', 'ZH-2026-118'], ['Fecha', '5 de febrero de 2026'], ['Vendedor', 'Zhejiang Hydraulic Co. (ficticio)'], ['Ciudad y país', 'Shanghái, China'], ['Dirección', '88 Industrial Road'], ['Mercancía', '500 unidades de bombas de engranajes externos para aceite hidráulico, sin motor'], ['Marca', 'HYDROZ (ficticia)'], ['Referencia', 'GP-25'], ['Seriales', 'ZH25-0001 a ZH25-0500'], ['Valor', 'USD 60.000 FOB Shanghái'], ['Pago', 'Transferencia bancaria al proveedor (giro directo)']] },
    { titulo: 'Documento de transporte (B/L)', datos: [['Número', 'SHACTG-2026-0457'], ['Fecha', '12 de febrero de 2026'], ['Puerto de embarque', 'Shanghái, China'], ['Puerto de llegada', 'Cartagena, Colombia'], ['Medio', 'Buque portacontenedores'], ['Bandera del buque', 'Panamá'], ['Naviera', 'Naviera del Pacífico (ficticia)'], ['Bultos', '1 bulto (paquete), en contenedor'], ['Peso bruto', '2.600 kg'], ['Peso neto', '2.400 kg'], ['Flete', 'USD 3.500']] },
    { titulo: 'Manifiesto de carga', datos: [['Número', '116575000000457'], ['Fecha', '10 de marzo de 2026'], ['Depósito de llegada', 'Depósito público del terminal marítimo de Cartagena (ficticio)']] },
    { titulo: 'Lista de empaque', datos: [['Número', 'PL-2026-118'], ['Fecha', '5 de febrero de 2026'], ['Contenido', '1 estiba (paquete) con 500 bombas en cajas individuales']] },
    { titulo: 'Póliza de seguro', datos: [['Aseguradora', 'Seguros del Litoral (ficticia)'], ['Prima', 'USD 300']] },
    { titulo: 'Clasificación y tributos', datos: [['Subpartida', '8413.60.90.00 (ficha técnica y lección 3)'], ['Tipo de importación', 'Para quedarse en el país, pagada al proveedor'], ['Arancel', '5% (de práctica)'], ['IVA', 'Tarifa general'], ['Acuerdo comercial', 'China no tiene acuerdo comercial vigente con Colombia: no se pide preferencia'], ['Requisitos', 'La subpartida no exige registro ni licencia previa de importación']] },
    { titulo: 'Declaración andina del valor', datos: [['Formulario', '560, radicada en el sistema antes de la declaración'], ['No. de radicado', '48000456'], ['Fecha', '11 de marzo de 2026']] },
    { titulo: 'Instrucción de pago', datos: [['Forma de pago de los tributos', 'Un solo cheque de gerencia por el total'], ['No. del cheque', '004571'], ['Banco', 'Banco de Bogotá']] },
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
  descripcion: 'BOMBAS DE ENGRANAJES EXTERNOS PARA ACEITE HIDRAULICO, SIN MOTOR. MARCA HYDROZ, REFERENCIA GP-25, SERIALES ZH25-0001 A ZH25-0500. CANTIDAD: 500 UNIDADES. USO: SISTEMAS HIDRAULICOS INDUSTRIALES.',
  pago: { numero: '004571', banco: '001' },
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
  // Montos en pesos: 4.902.000, 4902000 y $ 4.902.000 son lo mismo
  monto: (a, b) => numero(a) === numero(b),
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
export function aFormulario500(enc, sub, descripcion) {
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
    descripcion: descripcion || 'Bombas de engranajes externos para aceite hidráulico, sin motor. 500 unidades.', pagos_anteriores: '0', total_sancion: '0',
  };
}

// Autoliquidación: la misma fórmula del formulario 500
export function liquidar(v, tasa = TASA_SEMANA) {
  const r = calcular500({ v_fob: v.fob, v_fletes: v.fletes, v_seguros: v.seguros, v_otros: v.otros, v_ajuste: v.ajuste, tasa_cambio: tasa, tasa_arancel: v.arancel, tasa_iva: v.iva, modalidad: v.modalidad });
  return { gastos: r.gastos, aduanaUSD: r.aduanaUSD, baseArancel: r.aduanaCOP, arancel: r.arancel, baseIVA: r.baseIVA, iva: r.iva, total: r.arancel + r.iva };
}

// ---------- Partes de la declaración después del ítem (manual del declarante de SIGLO XXI) ----------

// Número de aceptación de práctica que el sistema da al confirmar en «Informar»
export const NUMERO_ACEPTACION = '482026000004571';

// Descripción de la mercancía (casilla 43): debe identificarla e individualizarla. Cada regla es
// [qué debe aparecer, cómo se reconoce, dónde mirar]
const DESCRIPCION_MINIMA = [
  ['el nombre de la mercancía', /bomba/, 'Di qué es, como en la factura.'],
  ['el tipo', /engranaje/, 'La factura dice de qué tipo son las bombas.'],
  ['para qué sirve', /hidraulic|aceite/, 'La factura dice con qué líquido trabajan.'],
  ['si trae motor', /sin motor/, 'Es lo que separa esta subpartida de las bombas con motor.'],
  ['la marca', /hydroz/, 'Está en la factura.'],
  ['la referencia o modelo', /gp\W?25/, 'Está en la factura.'],
  ['los seriales', /zh25\W?0001/, 'Están en la factura: anota el rango completo.'],
  ['la cantidad', /\b500\b/, 'Cuántas unidades ampara la declaración.'],
];
const normaTexto = (t) => normalizar(String(t ?? '')).toLowerCase();
export function validarDescripcion(texto) {
  const t = normaTexto(texto);
  if (t.trim().length < 20) return [{ campo: 'descripcion', mensaje: 'Descripción de la mercancía: falta. Describe la mercancía de forma que se pueda identificar sin ver otros documentos.' }];
  return DESCRIPCION_MINIMA.filter(([, re]) => !re.test(t))
    .map(([que, , pista]) => ({ campo: 'descripcion', mensaje: `Descripción de la mercancía: falta ${que}. ${pista}` }));
}

// Totales (casillas 67 a 76). La columna «Total general» la trae el sistema; el declarante
// llena «Total pagado con esta declaración», las sanciones y la forma de pago.
export const numero = (t) => {
  const s = String(t ?? '').replace(/[\s$]/g, '').replace(/\./g, '').replace(',', '.');
  return s === '' ? NaN : Number(s);
};
export const totalesGenerales = (liq) => ({ arancel: liq.arancel, iva: liq.iva, sanciones: 0, otros: 0 });
export function solucionTotales(liq) {
  const g = totalesGenerales(liq);
  return { pagado_arancel: String(g.arancel), pagado_iva: String(g.iva), sanciones: '0', pagado_otros: '0',
    efectivo: '0', cheque_valor: String(g.arancel + g.iva), cheque_numero: CASO.pago.numero, cheque_banco: CASO.pago.banco };
}
export function totalPagado(t) {
  return ['pagado_arancel', 'pagado_iva', 'sanciones', 'pagado_otros'].reduce((s, k) => s + (numero(t[k]) || 0), 0);
}
export function validarTotales(t, liq) {
  const g = totalesGenerales(liq);
  const faltas = [];
  const pon = (campo, mensaje) => faltas.push({ campo, mensaje });
  [['pagado_arancel', '69. Arancel pagado', g.arancel], ['pagado_iva', '70. IVA pagado', g.iva], ['pagado_otros', '72. Otros pagado', g.otros]].forEach(([campo, rotulo, general]) => {
    const n = numero(t[campo]);
    if (Number.isNaN(n)) pon(campo, `${rotulo}: falta. Escribe lo que se paga con esta declaración.`);
    else if (n > general) pon(campo, `${rotulo}: no puede ser mayor que el total general.`);
    else if (n !== general) pon(campo, `${rotulo}: no coincide. Es una declaración inicial sin pagos anteriores: se paga todo lo liquidado.`);
  });
  const sanc = numero(t.sanciones);
  if (Number.isNaN(sanc)) pon('sanciones', '71. Sanciones: falta. Si no hay sanción, escribe 0.');
  else if (sanc !== 0) pon('sanciones', '71. Sanciones: no coincide. Esta declaración se presenta a tiempo y por primera vez: no lleva sanción.');
  const efectivo = numero(t.efectivo) || 0;
  const cheque = numero(t.cheque_valor) || 0;
  if (efectivo + cheque !== totalPagado(t)) pon('cheque_valor', `74 y 75. Forma de pago: el efectivo más el cheque deben sumar el total pagado (${totalPagado(t).toLocaleString('es-CO')}).`);
  else if (efectivo) pon('efectivo', '74. Efectivo: no coincide. Mira la instrucción de pago del importador.');
  if (cheque) {
    if (!String(t.cheque_numero ?? '').trim()) pon('cheque_numero', '75. Número del cheque: falta. Está en la instrucción de pago.');
    else if (!igual(t.cheque_numero, CASO.pago.numero)) pon('cheque_numero', '75. Número del cheque: no coincide con la instrucción de pago.');
    if (!String(t.cheque_banco ?? '').trim()) pon('cheque_banco', '75. Código del banco: falta. Búscalo en la tabla de bancos.');
    else if (!igual(String(t.cheque_banco).padStart(3, '0'), CASO.pago.banco)) pon('cheque_banco', '75. Código del banco: no coincide. Mira el banco en la instrucción de pago y búscalo en la tabla de bancos.');
  }
  return faltas;
}

// Documentos soporte: «posibles documentos o requisitos a que puede estar sometida esta importación».
// Para cada uno se elige si se presentó, no se presentó o no se requiere, con número y fecha.
export const ESTADOS_SOPORTE = [['SI', 'Sí presentado'], ['NO', 'No presentado'], ['NR', 'No requerido']];
export const DOCUMENTOS_SOPORTE = [
  { id: 'factura', nombre: 'Factura comercial', estado: 'SI', numero: 'ZH-2026-118', fecha: '2026-02-05', pista: 'Mira la factura comercial.' },
  { id: 'transporte', nombre: 'Documento de transporte', estado: 'SI', numero: 'SHACTG-2026-0457', fecha: '2026-02-12', pista: 'Mira el B/L.' },
  { id: 'empaque', nombre: 'Lista de empaque', estado: 'SI', numero: 'PL-2026-118', fecha: '2026-02-05', pista: 'Mira la lista de empaque.' },
  { id: 'valor', nombre: 'Declaración andina del valor', estado: 'SI', numero: '48000456', fecha: '2026-03-11', pista: 'Se exige porque el valor FOB pasa de USD 5.000. Como se radicó en el sistema, el número es el de radicado.' },
  { id: 'mandato', nombre: 'Mandato aduanero', estado: 'NR', pista: 'Solo se exige cuando una agencia de aduanas declara por el importador. Mira quién firma.' },
  { id: 'origen', nombre: 'Certificado de origen', estado: 'NR', pista: 'Solo se presenta para pedir una preferencia de un acuerdo comercial. Mira la clasificación del caso.' },
  { id: 'registro', nombre: 'Registro o licencia de importación', estado: 'NR', pista: 'Mira en la clasificación del caso si la subpartida exige requisitos previos.' },
];
export function solucionSoporte() {
  return Object.fromEntries(DOCUMENTOS_SOPORTE.map((d) => [d.id, d.estado === 'SI' ? { estado: 'SI', numero: d.numero, fecha: d.fecha } : { estado: d.estado }]));
}
export function validarSoporte(s) {
  return DOCUMENTOS_SOPORTE.flatMap((d) => {
    const x = s[d.id] || {};
    if (!x.estado) return [{ campo: d.id, mensaje: `${d.nombre}: falta elegir si se presentó. ${d.pista}` }];
    if (x.estado === 'NO') return [{ campo: d.id, mensaje: `${d.nombre}: si un documento se exige y no se tiene, la declaración no se puede presentar. ${d.pista}` }];
    if (x.estado !== d.estado) return [{ campo: d.id, mensaje: `${d.nombre}: no coincide. ${d.pista}` }];
    if (d.estado !== 'SI') return [];
    const faltas = [];
    if (!String(x.numero ?? '').trim()) faltas.push(`falta el número. ${d.pista}`);
    else if (!igual(x.numero, d.numero)) faltas.push(`el número no coincide. ${d.pista}`);
    if (!String(x.fecha ?? '').trim()) faltas.push('falta la fecha de expedición.');
    else if (!igual(x.fecha, d.fecha, 'fecha')) faltas.push(`la fecha no coincide. ${d.pista}`);
    return faltas.map((f) => ({ campo: d.id, mensaje: `${d.nombre}: ${f}` }));
  });
}

// ---------- Pago en el banco y solicitud de levante (práctica 1, después de informar) ----------
// Al confirmar, la declaración queda aceptada y esperando el pago en una entidad autorizada para
// recaudar; el banco le pone un autoadhesivo y transmite el pago a la DIAN. Con el autoadhesivo y la
// aceptación se pide el levante, y el sistema lo da en la casilla 81 si no selecciona inspección.
export const ACEPTACION = { numero: NUMERO_ACEPTACION, fecha: '2026-03-12' };
export const AUTOADHESIVO = { numero: '90010004571236', fecha: '2026-03-12' };
export const LEVANTE = { numero: '482026000009871', fecha: '2026-03-13' };

export function validarPago(v, total) {
  const faltas = [];
  const pon = (campo, mensaje) => faltas.push({ campo, mensaje });
  if (!String(v.aceptacion ?? '').trim()) pon('aceptacion', 'Número de aceptación: falta. Es el que dio el sistema al informar la declaración.');
  else if (!igual(v.aceptacion, ACEPTACION.numero)) pon('aceptacion', 'Número de aceptación: no coincide con el que dio el sistema al informar.');
  if (!String(v.banco ?? '').trim()) pon('banco', 'Banco: falta. Búscalo en la tabla de bancos.');
  else if (!igual(String(v.banco).padStart(3, '0'), CASO.pago.banco)) pon('banco', 'Banco: no coincide. Mira la instrucción de pago y busca el código en la tabla de bancos.');
  const valor = numero(v.valor);
  if (Number.isNaN(valor)) pon('valor', 'Valor pagado: falta. Es el total pagado con esta declaración (casilla 73).');
  else if (valor !== total) pon('valor', 'Valor pagado: no coincide con el total pagado con esta declaración (casilla 73). El banco no recibe un valor distinto.');
  if (!String(v.cheque ?? '').trim()) pon('cheque', 'Número del cheque: falta. Está en la instrucción de pago.');
  else if (!igual(v.cheque, CASO.pago.numero)) pon('cheque', 'Número del cheque: no coincide con la instrucción de pago.');
  return faltas;
}
export const solucionPago = (total) => ({ aceptacion: ACEPTACION.numero, banco: CASO.pago.banco, valor: String(total), cheque: CASO.pago.numero });

export function validarLevante(v) {
  const reglas = [
    ['aceptacion', 'Número de aceptación', ACEPTACION.numero, 'Es el número que dio el sistema al informar.'],
    ['aceptacion_fecha', 'Fecha de aceptación', ACEPTACION.fecha, 'Es la fecha en que se informó la declaración.', 'fecha'],
    ['autoadhesivo', 'Número de autoadhesivo', AUTOADHESIVO.numero, 'Es el número que el banco puso en la declaración al recibir el pago.'],
    ['autoadhesivo_fecha', 'Fecha del autoadhesivo', AUTOADHESIVO.fecha, 'Es la fecha del pago en el banco.', 'fecha'],
  ];
  return reglas.flatMap(([campo, rotulo, esperado, pista, modo]) => {
    const x = String(v[campo] ?? '').trim();
    if (!x) return [{ campo, mensaje: `${rotulo}: falta. ${pista}` }];
    return igual(x, esperado, modo) ? [] : [{ campo, mensaje: `${rotulo}: no coincide. ${pista}` }];
  });
}
export const solucionLevante = () => ({ aceptacion: ACEPTACION.numero, aceptacion_fecha: ACEPTACION.fecha, autoadhesivo: AUTOADHESIVO.numero, autoadhesivo_fecha: AUTOADHESIVO.fecha });

// ---------- Práctica 2: Recibo Oficial de Pago (ROP) ----------
// Se usa para pagar saldos de declaraciones cuyos tributos o sanciones no se pagaron completos al
// presentarlas, o para pagar con títulos valores. Se ingresa, se preinforma (la DIAN da el número de
// aceptación del recibo) y se imprime para llevarlo al banco.
export const PRACTICA_ROP = 'sigloxxii-rop';
export const RUTA_ROP = ['Importaciones', 'Declarante SIA ó ALTEX', 'Recibo Oficial Pago', 'Ingresar'];
export const APLICACIONES_ROP = [['TA', 'Tributos aduaneros'], ['SC', 'Sanciones cambiarias']];
export const FORMAS_PAGO_ROP = [['EF', 'Efectivo'], ['CH', 'Cheque'], ['TV', 'Título valor']];
export const TITULOS_VALOR = [['CDTUR', 'CDTUR'], ['CERT', 'CERT'], ['TIDI', 'TIDIS'], ['BFE', 'Bonos de financiamiento especial'], ['BFP', 'Bonos de financiamiento presupuestal']];
export const ROP = { radicacion: '48900123', aceptacion: '489026000000731' };
export const CASO_ROP = {
  documentos: [
    { titulo: 'Declaración anterior', datos: [['Importador', 'HidroColombia S.A.S. (ficticia) · NIT 900123456-8'], ['Mercancía', 'Sellos y empaques para bombas'], ['No. de aceptación', '482026000003310'], ['Fecha de aceptación', '20 de febrero de 2026']] },
    { titulo: 'Estado de cuenta de la declaración', datos: [['Arancel liquidado', '$1.230.000'], ['Arancel pagado', '$1.230.000'], ['IVA liquidado', '$4.902.000'], ['IVA pagado', '$0 (quedó pendiente al presentarla)'], ['Sanciones', 'Ninguna'], ['Intereses de mora a la fecha de pago', '$61.000 (dato de práctica)']] },
    { titulo: 'Quien paga', datos: [['Nombre', 'Ana María Pérez Gómez'], ['Cédula', '1.000.000.001'], ['Forma de pago', 'En efectivo en la ventanilla del banco']] },
  ],
  solucion: {
    aplicacion: 'TA', declaracion: '482026000003310', declaracion_fecha: '2026-02-20', pagador: 'PEREZ GOMEZ ANA MARIA', pagador_doc: '1000000001',
    arancel: '0', iva: '4902000', sanciones: '0', otros: '0', mora: '61000', total: '4963000', forma: 'EF', titulo: '',
  },
};
const REGLAS_ROP = [
  ['aplicacion', 'Aplicación', 'Lo que se paga son tributos de una declaración de importación.'],
  ['declaracion', 'Número de aceptación de la declaración', 'Está en la declaración anterior.'],
  ['declaracion_fecha', 'Fecha de aceptación de la declaración', 'Está en la declaración anterior.', 'fecha'],
  ['pagador', 'Nombre de quien efectúa el pago', 'Mira quién paga.', 'libre'],
  ['pagador_doc', 'Documento de quien paga', 'Mira quién paga.'],
  ['arancel', 'Arancel', 'Solo se paga lo que quedó pendiente: mira el estado de cuenta.', 'monto'],
  ['iva', 'IVA', 'Solo se paga lo que quedó pendiente: mira el estado de cuenta.', 'monto'],
  ['sanciones', 'Sanciones', 'Mira el estado de cuenta.', 'monto'],
  ['otros', 'Otros', 'Mira el estado de cuenta.', 'monto'],
  ['mora', 'Intereses de mora', 'Están en el estado de cuenta.', 'monto'],
  ['forma', 'Forma de pago', 'Mira quién paga y cómo.'],
];
export function validarRop(v) {
  const faltas = validar(REGLAS_ROP, v, CASO_ROP.solucion);
  const suma = ['arancel', 'iva', 'sanciones', 'otros', 'mora'].reduce((t, k) => t + (numero(v[k]) || 0), 0);
  const total = numero(v.total);
  if (Number.isNaN(total)) faltas.push({ campo: 'total', mensaje: 'Total pagado: falta. Es la suma de arancel, IVA, sanciones, otros e intereses de mora.' });
  else if (total !== suma) faltas.push({ campo: 'total', mensaje: `Total pagado: no coincide con la suma de los conceptos (${suma.toLocaleString('es-CO')}).` });
  if (v.forma === 'TV' && !v.titulo) faltas.push({ campo: 'titulo', mensaje: 'Código del título: falta. Si paga con título valor, elige cuál.' });
  return faltas;
}
