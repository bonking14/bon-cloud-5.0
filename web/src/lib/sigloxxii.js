import { calcular500 } from './formularios.js';
import { digitoVerificacion } from './nit.js';
import { normalizar } from './texto.js';
import { generarCaso } from './casosSiglo.js';

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
// El caso de ejemplo (semilla 0); cada cuenta recibe el suyo con generarCaso(semilla)
export const CASO = generarCaso(0);
export { generarCaso };
// Caso de cada cuenta: el invitado practica con el de ejemplo; «otro caso» suma 1000 a la semilla
export const semillaDe = (usuario, otro = 0) => (usuario && !usuario.invitado && Number.isInteger(usuario.id) ? usuario.id : 0) + otro * 1000;

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
  ['pais_origen', 'País de origen', 'Es el país donde se fabricó la mercancía, según la factura.'],
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
export const validarEncabezado = (v, caso = CASO) => validar(REGLAS_ENCABEZADO, v, caso.encabezado);
export const validarSubpartida = (v, caso = CASO) => validar(REGLAS_SUBPARTIDA, v, caso.subpartida);

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
// Las reglas de cada caso están en casosSiglo.js (descripcionMinima)
const normaTexto = (t) => normalizar(String(t ?? '')).toLowerCase();
export function validarDescripcion(texto, caso = CASO) {
  const t = normaTexto(texto);
  if (t.trim().length < 20) return [{ campo: 'descripcion', mensaje: 'Descripción de la mercancía: falta. Describe la mercancía de forma que se pueda identificar sin ver otros documentos.' }];
  return caso.descripcionMinima.filter(([, re]) => !re.test(t))
    .map(([que, , pista]) => ({ campo: 'descripcion', mensaje: `Descripción de la mercancía: falta ${que}. ${pista}` }));
}

// Totales (casillas 67 a 76). La columna «Total general» la trae el sistema; el declarante
// llena «Total pagado con esta declaración», las sanciones y la forma de pago.
export const numero = (t) => {
  const s = String(t ?? '').replace(/[\s$]/g, '').replace(/\./g, '').replace(',', '.');
  return s === '' ? NaN : Number(s);
};
export const totalesGenerales = (liq) => ({ arancel: liq.arancel, iva: liq.iva, sanciones: 0, otros: 0 });
export function solucionTotales(liq, caso = CASO, op = {}) {
  if (op.anteriores) {
    const pagar = aPagar(liq, op);
    return { pagado_arancel: String(pagar.arancel), pagado_iva: String(pagar.iva), sanciones: String(op.sancion || 0), pagado_otros: '0',
      efectivo: String(pagar.arancel + pagar.iva + (op.sancion || 0)), cheque_valor: '0', cheque_numero: '', cheque_banco: '' };
  }
  const g = totalesGenerales(liq);
  return { pagado_arancel: String(g.arancel), pagado_iva: String(g.iva), sanciones: '0', pagado_otros: '0',
    efectivo: '0', cheque_valor: String(g.arancel + g.iva), cheque_numero: caso.pago.numero, cheque_banco: caso.pago.banco };
}
export function totalPagado(t) {
  return ['pagado_arancel', 'pagado_iva', 'sanciones', 'pagado_otros'].reduce((s, k) => s + (numero(t[k]) || 0), 0);
}
// Lo que se paga con esta declaración: todo lo liquidado, o en una corrección, lo liquidado menos lo ya pagado
function aPagar(liq, op = {}) {
  const g = totalesGenerales(liq);
  const a = op.anteriores || { arancel: 0, iva: 0 };
  return { arancel: g.arancel - a.arancel, iva: g.iva - a.iva, otros: 0 };
}
export function validarTotales(t, liq, caso = CASO, op = {}) {
  const g = totalesGenerales(liq);
  const p = aPagar(liq, op);
  const faltas = [];
  const pon = (campo, mensaje) => faltas.push({ campo, mensaje });
  [['pagado_arancel', '69. Arancel pagado', g.arancel, p.arancel], ['pagado_iva', '70. IVA pagado', g.iva, p.iva], ['pagado_otros', '72. Otros pagado', g.otros, p.otros]].forEach(([campo, rotulo, general, debe]) => {
    const n = numero(t[campo]);
    if (Number.isNaN(n)) pon(campo, `${rotulo}: falta. Escribe lo que se paga con esta declaración.`);
    else if (n > general) pon(campo, `${rotulo}: no puede ser mayor que el total general.`);
    else if (n !== debe) {
      pon(campo, op.anteriores
        ? `${rotulo}: no coincide. En una corrección se paga lo nuevo liquidado menos lo que ya se pagó (casilla 67).`
        : `${rotulo}: no coincide. Es una declaración inicial sin pagos anteriores: se paga todo lo liquidado.`);
    }
  });
  const sanc = numero(t.sanciones);
  const sancion = op.sancion || 0;
  if (Number.isNaN(sanc)) pon('sanciones', '71. Sanciones: falta. Si no hay sanción, escribe 0.');
  else if (sanc !== sancion) {
    pon('sanciones', sancion
      ? '71. Sanciones: no coincide. Mira la liquidación de la sanción en los documentos del caso.'
      : '71. Sanciones: no coincide. Esta declaración se presenta a tiempo y por primera vez: no lleva sanción.');
  }
  const efectivo = numero(t.efectivo) || 0;
  const cheque = numero(t.cheque_valor) || 0;
  const enEfectivo = op.forma === 'EF';
  if (efectivo + cheque !== totalPagado(t)) pon('cheque_valor', `74 y 75. Forma de pago: el efectivo más el cheque deben sumar el total pagado (${totalPagado(t).toLocaleString('es-CO')}).`);
  else if (enEfectivo ? cheque : efectivo) pon(enEfectivo ? 'cheque_valor' : 'efectivo', `${enEfectivo ? '75. Cheque' : '74. Efectivo'}: no coincide. Mira la instrucción de pago del importador.`);
  if (enEfectivo) return faltas;
  if (cheque) {
    if (!String(t.cheque_numero ?? '').trim()) pon('cheque_numero', '75. Número del cheque: falta. Está en la instrucción de pago.');
    else if (!igual(t.cheque_numero, caso.pago.numero)) pon('cheque_numero', '75. Número del cheque: no coincide con la instrucción de pago.');
    if (!String(t.cheque_banco ?? '').trim()) pon('cheque_banco', '75. Código del banco: falta. Búscalo en la tabla de bancos.');
    else if (!igual(String(t.cheque_banco).padStart(3, '0'), caso.pago.banco)) pon('cheque_banco', '75. Código del banco: no coincide. Mira el banco en la instrucción de pago y búscalo en la tabla de bancos.');
  }
  return faltas;
}

// Documentos soporte: «posibles documentos o requisitos a que puede estar sometida esta importación».
// Para cada uno se elige si se presentó, no se presentó o no se requiere, con número y fecha.
export const ESTADOS_SOPORTE = [['SI', 'Sí presentado'], ['NO', 'No presentado'], ['NR', 'No requerido']];
export const DOCUMENTOS_SOPORTE = CASO.soportes;
export function solucionSoporte(caso = CASO) {
  return Object.fromEntries(caso.soportes.map((d) => [d.id, d.estado === 'SI' ? { estado: 'SI', numero: d.numero, fecha: d.fecha } : { estado: d.estado }]));
}
export function validarSoporte(s, caso = CASO) {
  return caso.soportes.flatMap((d) => {
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

export function validarPago(v, total, caso = CASO) {
  const faltas = [];
  const pon = (campo, mensaje) => faltas.push({ campo, mensaje });
  if (!String(v.aceptacion ?? '').trim()) pon('aceptacion', 'Número de aceptación: falta. Es el que dio el sistema al informar la declaración.');
  else if (!igual(v.aceptacion, ACEPTACION.numero)) pon('aceptacion', 'Número de aceptación: no coincide con el que dio el sistema al informar.');
  if (!String(v.banco ?? '').trim()) pon('banco', 'Banco: falta. Búscalo en la tabla de bancos.');
  else if (!igual(String(v.banco).padStart(3, '0'), caso.pago.banco)) pon('banco', 'Banco: no coincide. Mira la instrucción de pago y busca el código en la tabla de bancos.');
  const valor = numero(v.valor);
  if (Number.isNaN(valor)) pon('valor', 'Valor pagado: falta. Es el total pagado con esta declaración (casilla 73).');
  else if (valor !== total) pon('valor', 'Valor pagado: no coincide con el total pagado con esta declaración (casilla 73). El banco no recibe un valor distinto.');
  if (!String(v.cheque ?? '').trim()) pon('cheque', 'Número del cheque: falta. Está en la instrucción de pago.');
  else if (!igual(v.cheque, caso.pago.numero)) pon('cheque', 'Número del cheque: no coincide con la instrucción de pago.');
  return faltas;
}
export const solucionPago = (total, caso = CASO) => ({ aceptacion: ACEPTACION.numero, banco: caso.pago.banco, valor: String(total), cheque: caso.pago.numero });

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

// ---------- Inspección aduanera ----------
// Al pedir el levante, el sistema puede dar levante automático o seleccionar la declaración para
// inspección documental (el funcionario revisa los documentos soporte) o física (además revisa la
// mercancía y deja un acta con lo que encontró).
export const TIPOS_INSPECCION = { documental: 'Inspección documental', fisica: 'Inspección física' };
// Documentos que el declarante tiene a mano: debe presentar solo los soportes de la declaración
export const DOCUMENTOS_A_MANO = [
  ['factura', 'Factura comercial'], ['transporte', 'Documento de transporte (B/L)'], ['empaque', 'Lista de empaque'],
  ['valor', 'Declaración andina del valor'], ['poliza', 'Póliza de seguro'], ['rut', 'RUT del importador'],
  ['mandato', 'Mandato aduanero'], ['origen', 'Certificado de origen'],
];
const soportesPresentados = (caso) => caso.soportes.filter((d) => d.estado === 'SI').map((d) => d.id);
export function solucionInspeccion(caso = CASO) {
  const v = Object.fromEntries(soportesPresentados(caso).map((id) => [`doc_${id}`, true]));
  if (caso.inspeccion === 'fisica') caso.hallazgos.forEach((_, i) => { v[`acta_${i}`] = 'SI'; });
  return v;
}
export function validarInspeccion(v, caso = CASO) {
  const exigidos = soportesPresentados(caso);
  const faltas = [];
  DOCUMENTOS_A_MANO.forEach(([id, nombre]) => {
    if (exigidos.includes(id) && !v[`doc_${id}`]) faltas.push({ campo: `doc_${id}`, mensaje: `${nombre}: falta presentarlo. El funcionario revisa los documentos soporte de la declaración.` });
    if (!exigidos.includes(id) && v[`doc_${id}`]) faltas.push({ campo: `doc_${id}`, mensaje: `${nombre}: no es documento soporte de esta declaración. Mira los documentos soporte que radicaste.` });
  });
  if (caso.inspeccion === 'fisica') {
    caso.hallazgos.forEach(([dato], i) => {
      const x = v[`acta_${i}`];
      if (!x) faltas.push({ campo: `acta_${i}`, mensaje: `Acta, ${dato}: falta decir si coincide con lo declarado.` });
      else if (x !== 'SI') faltas.push({ campo: `acta_${i}`, mensaje: `Acta, ${dato}: revisa otra vez la declaración y los documentos: lo que encontró el funcionario sí coincide.` });
    });
  }
  return faltas;
}

// ---------- Práctica 3: declaración de corrección ----------
// Después del levante, la agencia se entera de que el flete real fue mayor que el declarado. Con una
// declaración de corrección se corrige el valor, se liquidan los tributos otra vez y se paga la
// diferencia (lo nuevo menos lo pagado, casilla 67) con la sanción que corresponda.
export const PRACTICA_CORRECCION = 'sigloxxii-correccion';
export const ACEPTACION_CORRECCION = { numero: '482026000005102', fecha: '2026-04-06' };
const fechaDMA = (iso) => iso.split('-').reverse().join('/');
const pesosTexto = (n) => `$${n.toLocaleString('es-CO')}`;
export function datosCorreccion(caso = CASO) {
  const anterior = liquidar(caso.subpartida);
  const corregida = { ...caso.subpartida, fletes: String(caso.correccion.fleteReal) };
  const nueva = liquidar(corregida);
  const mayorValor = (nueva.arancel - anterior.arancel) + (nueva.iva - anterior.iva);
  // Sanción de práctica: 10 % del mayor valor, redondeada a miles. La real depende del régimen sancionatorio vigente.
  const sancion = Math.round((mayorValor * 0.1) / 1000) * 1000;
  return {
    anterior, corregida, nueva, mayorValor, sancion,
    anteriores: { arancel: anterior.arancel, iva: anterior.iva },
    caso: { ...caso, subpartida: corregida },
    documentos: [
      { titulo: 'Declaración anterior', datos: [['No. de aceptación', ACEPTACION.numero], ['Fecha de aceptación', fechaDMA(ACEPTACION.fecha)], ['Levante', `${LEVANTE.numero} del ${fechaDMA(LEVANTE.fecha)}`], ['Flete declarado', `USD ${Number(caso.subpartida.fletes).toLocaleString('es-CO')}`], ['Tributos pagados', `${pesosTexto(anterior.arancel + anterior.iva)} (arancel ${pesosTexto(anterior.arancel)} e IVA ${pesosTexto(anterior.iva)})`]] },
      { titulo: 'Factura de flete corregida', datos: [['Número', caso.correccion.facturaFlete], ['Naviera', 'La del B/L'], ['Flete real', `USD ${caso.correccion.fleteReal.toLocaleString('es-CO')}`], ['Motivo', 'Recargo por combustible que no se había facturado']] },
      { titulo: 'Liquidación de la sanción', datos: [['Sanción', pesosTexto(sancion)], ['Nota', 'Dato de práctica (10 % del mayor valor). La sanción real depende del régimen sancionatorio vigente: verifícala con tu docente.']] },
      { titulo: 'Instrucción de pago', datos: [['Forma de pago', 'En efectivo: el mayor valor de los tributos y la sanción']] },
      ...caso.documentos.filter((d) => !['Instrucción de pago', 'Declaración andina del valor'].includes(d.titulo)),
    ],
  };
}

// Parámetros previos de la corrección: la declaración que se corrige
export function validarDeclaracionAnterior(numeroAnterior, fechaAnterior) {
  const faltas = [];
  if (!String(numeroAnterior ?? '').trim()) faltas.push({ campo: 'anterior', mensaje: 'No. de aceptación de la declaración anterior: falta. Está en la declaración anterior.' });
  else if (!igual(numeroAnterior, ACEPTACION.numero)) faltas.push({ campo: 'anterior', mensaje: 'No. de aceptación de la declaración anterior: no coincide. Mira la declaración anterior.' });
  if (!String(fechaAnterior ?? '').trim()) faltas.push({ campo: 'anterior_fecha', mensaje: 'Fecha de aceptación de la declaración anterior: falta.' });
  else if (!igual(fechaAnterior, ACEPTACION.fecha, 'fecha')) faltas.push({ campo: 'anterior_fecha', mensaje: 'Fecha de aceptación de la declaración anterior: no coincide. Mira la declaración anterior.' });
  return faltas;
}
