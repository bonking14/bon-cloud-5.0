import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import HojaOficial from '../kit/HojaOficial.jsx';
import { soloDigitos } from '../kit/formato.js';
import trazado from '../trazados/650.json';

// Formulario 650, Declaración de Tránsito Aduanero y/o Cabotaje. Trazado, numeración e
// instrucciones del formulario oficial de la DIAN (Formulario_650_2026.pdf).
const TIPOS_DOCUMENTO = [['13', 'Cédula de ciudadanía'], ['21', 'Tarjeta de extranjería'], ['22', 'Cédula de extranjería'], ['31', 'NIT'], ['41', 'Pasaporte']];
const CONCEPTOS = [['01', 'Modalidad de tránsito'], ['02', 'Cabotaje']];
const CLASE_GARANTIA = [['1', 'Global'], ['2', 'Específica']];
const TIPO_GARANTIA = [['1', 'Bancaria'], ['2', 'Compañía de seguros']];

// Casillas de uso exclusivo de la autoridad aduanera (instrucciones del formulario)
const USO_OFICIAL = [64, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 101, 102, 103, 997];
// Filas de la tabla de mercancías: [y, alto]
const FILAS = [[372.6, 22.4], [396.6, 22.4], [420.6, 23]];
const columna = (prefijo, x, w, etiqueta, extra = {}) => ({
  partes: FILAS.map(([y, h], i) => ({ nombre: `${prefijo}_${i + 1}`, caja: [x + 0.8, y, w - 1.6, h], etiqueta: `${etiqueta}, ítem ${i + 1}`, ...extra })),
});
const abajo = (x, y, w, extra = {}) => ({ caja: [x + 1, y, w - 2, 10.8], ...extra });

function Form650() {
  const { valores: v } = useCampos();
  const campos = {
    1: { nombre: 'anio', caja: [52, 62.5, 44, 10.5], max: 4, centro: true, formato: soloDigitos, etiqueta: 'Año' },
    2: { nombre: 'concepto', caja: [187.5, 62.5, 22, 10.5], centro: true, sugerencias: CONCEPTOS, etiqueta: 'Concepto' },
    4: { omitir: true },
    5: { nombre: 'dest_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'NIT del destinatario' },
    6: { valor: digitoVerificacion(v.dest_nit), caja: [188, 167, 13.5, 12], centro: true, etiqueta: 'DV del destinatario' },
    11: { nombre: 'dest_razon' },
    24: { nombre: 'dec_tipo_doc', sugerencias: TIPOS_DOCUMENTO, centro: true },
    25: { nombre: 'dec_nit', etiqueta: 'Número de identificación del declarante' },
    26: { nombre: 'dec_razon' },
    27: { nombre: 'dec_tipo_usuario' },
    28: { nombre: 'dec_cod_usuario' },
    29: { nombre: 'trans_tipo_doc', sugerencias: TIPOS_DOCUMENTO, centro: true },
    30: { nombre: 'trans_nit', etiqueta: 'Número de identificación del transportador' },
    31: { nombre: 'trans_razon', etiqueta: 'Razón social del transportador' },
    32: { nombre: 'trans_cod_usuario' },
    33: { nombre: 'rep_tipo_doc', sugerencias: TIPOS_DOCUMENTO, centro: true },
    34: { nombre: 'rep_documento' },
    35: abajo(223, 264.4, 94, { nombre: 'rep_apellido1', etiqueta: 'Primer apellido del representante del transportador' }),
    36: abajo(317, 264.4, 88, { nombre: 'rep_apellido2', etiqueta: 'Segundo apellido del representante del transportador' }),
    37: abajo(405, 264.4, 95.5, { nombre: 'rep_nombre1', etiqueta: 'Primer nombre del representante del transportador' }),
    38: abajo(500.5, 264.4, 89.5, { nombre: 'rep_nombre2', etiqueta: 'Otros nombres del representante del transportador' }),
    39: { nombre: 'gar_trib_clase', sugerencias: CLASE_GARANTIA, centro: true },
    40: { nombre: 'gar_trib_tipo', sugerencias: TIPO_GARANTIA, centro: true },
    41: { nombre: 'gar_trib_num' },
    42: { nombre: 'gar_trib_valor', derecha: true },
    43: { nombre: 'gar_trib_vigencia', caja: [511.5, 276.8, 78, 10.6], etiqueta: 'Vigencia de la garantía de tributos' },
    44: { nombre: 'gar_fin_clase', sugerencias: CLASE_GARANTIA, centro: true },
    45: { nombre: 'gar_fin_tipo', sugerencias: TIPO_GARANTIA, centro: true },
    46: { nombre: 'gar_fin_num' },
    47: { nombre: 'gar_fin_valor', derecha: true },
    48: { nombre: 'gar_fin_vigencia', caja: [511.5, 288.8, 78, 11], etiqueta: 'Vigencia de la garantía por finalización' },
    49: { nombre: 'aduana_partida', caja: [66.5, 302, 26, 21], centro: true, etiqueta: 'Código de la aduana de partida' },
    50: { nombre: 'aduana_destino', caja: [126.5, 302, 32, 21], centro: true, etiqueta: 'Código de la aduana de destino' },
    51: { nombre: 'manifiesto' },
    52: { nombre: 'fecha_llegada', caja: [295, 312.3, 78.5, 11], etiqueta: 'Fecha de llegada' },
    53: { nombre: 'doc_transporte', caja: [390, 312.3, 119, 11], etiqueta: 'Documento de transporte No.' },
    54: { nombre: 'doc_transporte_fecha', caja: [511.5, 312.3, 78, 11], etiqueta: 'Fecha del documento de transporte' },
    55: { nombre: 'trans_placa', etiqueta: 'Identificación del medio de transporte, remolque o semirremolque' },
    56: { nombre: 'deposito' },
    57: { nombre: 'deposito_codigo' },
    58: { nombre: 'fob', inputMode: 'decimal', derecha: true },
    59: { nombre: 'pais_procedencia', centro: true },
    60: columna('desc', 50.5, 187, 'Tipo, naturaleza y descripción de la mercancía', { multilinea: true }),
    61: columna('bultos', 237.5, 50.5, 'Cantidad de bultos', { centro: true }),
    62: columna('unidad_carga', 288, 72, 'Número de identificación de la unidad de carga'),
    63: columna('precintable', 360, 21.5, 'Precintable (S o N)', { centro: true, max: 1 }),
    65: columna('peso', 461, 57.5, 'Peso bruto declarado', { derecha: true }),
    89: { nombre: 'obs_transportador', multilinea: true, caja: [38, 599, 291, 24.5], etiqueta: 'Observaciones de la empresa transportadora durante la operación' },
    90: { caja: [366, 612.5, 130, 10.8], etiqueta: 'Nombre del conductor o representante de la empresa transportadora' },
    91: { caja: [530, 612.5, 59, 10.8], etiqueta: 'C.C. del conductor o representante' },
    92: { caja: [81, 637, 78, 13], etiqueta: 'Fecha de entrega de la carga' },
    93: { caja: [161, 637, 46.5, 13], etiqueta: 'Hora de entrega de la carga' },
    94: { caja: [209.5, 637, 84.5, 13], etiqueta: 'Peso recibido' },
    95: { caja: [296, 637, 39.5, 13], etiqueta: 'Bultos recibidos' },
    96: { caja: [337.5, 637, 136, 13], etiqueta: 'Comunicación a la aduana de partida No.' },
    97: { caja: [475, 637, 78, 13], etiqueta: 'Fecha de la comunicación a la aduana de partida' },
    98: { caja: [555, 637, 34.5, 13], etiqueta: 'Hora de la comunicación' },
    99: { caja: [430, 652, 159, 9.6], etiqueta: 'Nombre del empleado del depósito o usuario que recibe la carga' },
    100: { caja: [430, 662, 159, 9.6], etiqueta: 'C.C. del empleado que recibe la carga' },
    104: { nombre: 'sig_tipo_doc', sugerencias: TIPOS_DOCUMENTO, centro: true },
    105: { nombre: 'sig_documento' },
    106: abajo(234, 720.6, 96, { nombre: 'sig_apellido1', etiqueta: 'Primer apellido del declarante' }),
    107: abajo(330, 720.6, 87.5, { nombre: 'sig_apellido2', etiqueta: 'Segundo apellido del declarante' }),
    108: abajo(417.5, 720.6, 97.5, { nombre: 'sig_nombre1', etiqueta: 'Primer nombre del declarante' }),
    109: abajo(515, 720.6, 74.5, { nombre: 'sig_nombre2', etiqueta: 'Otros nombres del declarante' }),
  };
  USO_OFICIAL.forEach((n) => { campos[n] = { omitir: true }; });

  return (
    <HojaOficial trazado={trazado} numero="650" titulo="Declaración de Tránsito Aduanero y/o Cabotaje" campos={campos}
      pie={(
        <p className="ho-nota no-imprimir">Simulador educativo de BonCloud, sin validez ante la DIAN. La hoja reproduce la distribución y la numeración del formulario 650 oficial. Las casillas 64, 66 a 88 y 101 a 103 son de uso exclusivo de la autoridad aduanera y por eso no se pueden llenar. Hoy el tránsito aduanero se solicita, autoriza y finaliza en los servicios informáticos de la DIAN (art. 439 del Decreto 1165 de 2019).</p>
      )} />
  );
}

export default {
  id: '650',
  sigla: 'DIAN',
  Componente: Form650,
  inicial: () => ({}),
  obligatorios: [
    ['dec_nit', 'Número de identificación del declarante (casilla 25)'],
    ['trans_nit', 'Número de identificación del transportador (casilla 30)'],
    ['aduana_partida', 'Código de la aduana de partida (casilla 49)'],
    ['aduana_destino', 'Código de la aduana de destino (casilla 50)'],
  ],
  // Caso del módulo 3 de la Ruta: la llenadora viaja de Cartagena a una zona franca.
  // Empresas, placas y números son ficticios.
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el caso del módulo 3 de la Ruta: tránsito aduanero de la máquina llenadora, de Cartagena a una zona franca de la Sabana de Bogotá.',
    valores: () => ({
      anio: String(new Date().getFullYear()), concepto: '01',
      dest_nit: '901234567', dest_razon: 'Andina Pack S.A.S. (usuario de zona franca, empresa ficticia)',
      dec_tipo_doc: '31', dec_nit: '900555123', dec_razon: 'Servicios de Logística Aduanera del Caribe S.A.S. (agencia ficticia)', dec_tipo_usuario: '26',
      trans_tipo_doc: '31', trans_nit: '800444987', trans_razon: 'Transportes Andinos de Carga S.A. (empresa ficticia)',
      gar_trib_clase: '1', gar_trib_tipo: '2', gar_fin_clase: '1', gar_fin_tipo: '2',
      aduana_partida: '48', aduana_destino: '91',
      doc_transporte: 'GOACTG-2026-0311', trans_placa: 'TKO-892 / R-45871',
      deposito: 'Usuario operador de la zona franca (ficticio)', fob: '80000', pais_procedencia: 'IT',
      desc_1: 'Máquina llenadora de botellas, de demostración, marca Linea Pack, modelo LP-200, con sus accesorios.',
      bultos_1: '1', unidad_carga_1: 'Contenedor (número ficticio)', precintable_1: 'S', peso_1: '4200',
    }),
  },
  explicaciones: {
    1: 'Año calendario en el que se presenta la declaración, con cuatro dígitos.',
    2: 'Concepto: 01 si es modalidad de tránsito, 02 si es cabotaje.',
    4: 'Número único del formulario, asignado por la DIAN.',
    5: 'NIT del destinatario de la mercancía, sin dígito de verificación, puntos ni guiones.',
    6: 'Dígito de verificación del NIT del destinatario. Se calcula solo.',
    7: 'Primer apellido del destinatario, si es persona natural.',
    11: 'Razón social del destinatario, si es persona jurídica, tal como aparece en el RUT. En ese caso no se llenan las casillas 7 a 10.',
    24: 'Código del documento de identificación del declarante: 13 cédula de ciudadanía, 21 tarjeta de extranjería, 22 cédula de extranjería, 31 NIT, 41 pasaporte.',
    25: 'Número de identificación del declarante, con el dígito de verificación cuando corresponda.',
    26: 'Nombre o razón social del declarante autorizado por la DIAN. El declarante responde por la información de la declaración y por los tributos de la mercancía que no llegue a la aduana de destino (art. 435 del Decreto 1165 de 2019).',
    27: 'Tipo de usuario registrado en la casilla 54 del RUT. Una agencia de aduanas de cualquier nivel escribe el código 26.',
    28: 'Código que la DIAN asignó al declarante autorizado.',
    29: 'Código del tipo de documento del transportador (misma tabla de la casilla 24).',
    30: 'Número de identificación de la empresa transportadora. El tránsito solo se hace en vehículos de empresas inscritas y autorizadas por la DIAN (art. 434 del Decreto 1165 de 2019).',
    31: 'Razón social de la empresa que transporta las mercancías en tránsito o cabotaje.',
    32: 'Código que la DIAN asignó a la empresa transportadora.',
    33: 'Tipo de documento de la persona natural que firma en representación del transportador.',
    34: 'Número del documento de identificación de quien firma en representación del transportador.',
    35: 'Apellidos y nombres de la persona natural que representa al transportador.',
    39: 'Clase de la garantía de tributos aduaneros, a cargo del declarante: 1 global, 2 específica.',
    40: 'Tipo de garantía: 1 bancaria, 2 de compañía de seguros.',
    41: 'Número de la garantía.',
    42: 'Valor o monto asegurado que figura en la garantía.',
    43: 'Último día de vigencia de la garantía.',
    44: 'Clase de la garantía por finalización de la modalidad, a cargo del transportador: 1 global, 2 específica.',
    45: 'Tipo de garantía: 1 bancaria, 2 de compañía de seguros.',
    49: 'Código de la Dirección Seccional de partida, donde se autoriza el tránsito. La de Aduanas de Cartagena es 48.',
    50: 'Código de la Dirección Seccional donde finalizará el tránsito o el cabotaje.',
    51: 'Número del manifiesto de carga que dio la DIAN al arribo de la mercancía.',
    52: 'Fecha del acuse de recibo del aviso de llegada del medio de transporte, que da el sistema de la DIAN.',
    53: 'Número del documento de transporte (conocimiento de embarque, guía aérea o carta de porte) que ampara las mercancías.',
    54: 'Fecha de expedición del documento de transporte.',
    55: 'Identificación del medio de transporte: placa del vehículo, matrícula de la aeronave o nombre de la motonave. En transporte terrestre se escribe además la placa del remolque o semirremolque.',
    56: 'Nombre del depósito o del usuario de zona franca al que van destinadas las mercancías.',
    57: 'Código del depósito o del usuario de zona franca de destino.',
    58: 'Valor FOB en dólares de las mercancías objeto del tránsito. En cabotaje no se llena.',
    59: 'Código del país donde se embarcó la mercancía.',
    60: 'Tipo, naturaleza y descripción de la mercancía, con su denominación comercial. No se aceptan descripciones genéricas ni expresiones como «dice contener».',
    61: 'Cantidad total de bultos de cada documento de transporte.',
    62: 'Número de identificación de cada unidad de carga; por ejemplo, el número del contenedor.',
    63: 'S si la carga se puede precintar, N si no.',
    65: 'Peso en kilogramos de los bultos de cada documento de transporte.',
    89: 'Observaciones de la empresa transportadora durante la ejecución de la operación.',
    90: 'Nombre del conductor o representante de la empresa transportadora, cuando se usa la casilla 89.',
    92: 'La llena el depósito o el usuario operador de la zona franca: fecha en que llega la carga.',
    93: 'Hora en que llega la carga al depósito o a la zona franca.',
    94: 'Peso de la carga recibida, que el depósito o el usuario operador confronta con lo declarado.',
    95: 'Número de bultos recibidos.',
    104: 'Tipo de documento de quien firma la declaración.',
    105: 'Número de identificación de quien firma la declaración.',
  },
};
