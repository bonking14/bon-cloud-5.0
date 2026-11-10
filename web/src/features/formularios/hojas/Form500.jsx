import { subpartidas } from '../../../data/subpartidas.js';
import { calcular500 } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import HojaOficial from '../kit/HojaOficial.jsx';
import { pesos, dolares, soloDigitos } from '../kit/formato.js';
import trazado from '../trazados/500.json';

// Formulario 500, Declaración de Importación. El trazado y la numeración de casillas son
// los del formulario oficial de la DIAN (Formulario_500_2026.pdf); las explicaciones siguen
// su instructivo. Cada declaración ampara una sola subpartida (casilla 59).
// Códigos de modalidad: Anexo 1 de la Resolución DIAN 46 de 2019 (los más usados en el curso).
const MODALIDADES = [['C100', 'Ordinaria'], ['C150', 'Franquicia del gravamen arancelario'], ['C160', 'Franquicia total (tratados o convenios)'], ['S100', 'Temporal de corto plazo'], ['C660', 'Reimportación en el mismo estado']];
const TIPOS_DECLARACION = [['1', 'Inicial'], ['2', 'Legalización'], ['3', 'Anticipada'], ['4', 'Corrección'], ['5', 'Modificación']];
const NOMBRE_TIPO = Object.fromEntries(TIPOS_DECLARACION);
const CLASES_IMPORTADOR = [['01', 'Empresa mixta'], ['02', 'Empresa privada'], ['03', 'Empresa o entidad pública']];

// Filas de la autoliquidación: casillas de %, base, total liquidado, total a pagar y total en USD
const LIQUIDACION = [
  ['Arancel', [92, 93, 94, 95, 96], 'tasa_arancel', 'arancel'],
  ['IVA', [97, 98, 99, 100, 101], 'tasa_iva', 'iva'],
  ['Salvaguardia', [102, 103, 104, 105, 106], 'tasa_salva', 'salvaguardia'],
  ['Derechos compensatorios', [107, 108, 109, 110, 111], 'tasa_comp', 'compensatorios'],
  ['Derechos antidumping', [112, 113, 114, 115, 116], 'tasa_anti', 'antidumping'],
];

const limpio = (t) => String(t || '').replace(/[.\s]/g, '');
const fecha = (nombre, caja, etiqueta) => ({ nombre, caja, etiqueta, placeholder: 'AAAA-MM-DD' });

function Form500() {
  const { valores: v, poner, ponerVarios } = useCampos();
  const r = calcular500(v);
  const sp = subpartidas.find((s) => limpio(s.codigo) === limpio(v.subpartida) && limpio(v.subpartida).length === 10);
  const vistos = sp?.vistoBueno || [];
  const tasa = parseFloat(v.tasa_cambio) || 0;
  const usd = (cop) => dolares(tasa ? cop / tasa : 0);

  // Al escribir una subpartida del catálogo se proponen su arancel, su IVA y su descripción
  const alCambiarSubpartida = (texto) => {
    const hallada = subpartidas.find((s) => limpio(s.codigo) === limpio(texto) && limpio(texto).length === 10);
    if (!hallada) { poner('subpartida', texto); return; }
    ponerVarios({
      subpartida: hallada.codigo, tasa_arancel: String(hallada.arancel), tasa_iva: String(hallada.iva),
      descripcion: v.descripcion?.trim() ? v.descripcion : hallada.titulo,
    });
  };

  const campos = {
    1: { nombre: 'anio', caja: [49, 62.5, 43.5, 11], max: 4, centro: true, formato: soloDigitos },
    4: { omitir: true },
    5: { nombre: 'imp_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'NIT del importador' },
    6: { valor: digitoVerificacion(v.imp_nit), caja: [187.2, 167.5, 12.5, 11.7], centro: true, etiqueta: 'DV del importador' },
    11: { nombre: 'imp_razon' },
    12: { nombre: 'imp_seccional' },
    13: { nombre: 'imp_direccion' },
    15: { nombre: 'imp_telefono' },
    16: { nombre: 'imp_dpto' },
    17: { nombre: 'imp_ciudad' },
    24: { nombre: 'dec_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'NIT del declarante' },
    25: { valor: digitoVerificacion(v.dec_nit), caja: [187.2, 215.5, 12.5, 11.7], centro: true, etiqueta: 'DV del declarante' },
    26: { nombre: 'dec_razon' },
    27: { nombre: 'dec_tipo' },
    28: { nombre: 'dec_cod_usuario' },
    29: { nombre: 'dec_documento' },
    30: { nombre: 'dec_nombre' },
    31: { nombre: 'clase_importador', sugerencias: CLASES_IMPORTADOR, centro: true },
    32: { valor: NOMBRE_TIPO[v.tipo_declaracion] || '', etiqueta: 'Tipo declaración' },
    33: { nombre: 'tipo_declaracion', sugerencias: TIPOS_DECLARACION, centro: true, etiqueta: 'Código del tipo de declaración' },
    34: { nombre: 'form_anterior' },
    35: fecha('fecha_anterior', [245.5, 263.5, 77, 11.7], 'Fecha del formulario anterior'),
    36: { nombre: 'seccional_anterior' },
    37: { nombre: 'dex_num' },
    38: fecha('dex_fecha', [465, 263.5, 72, 11.7], 'Fecha de la declaración de exportación'),
    39: { nombre: 'dex_seccional' },
    40: { nombre: 'lugar_ingreso' },
    41: { nombre: 'deposito' },
    42: { nombre: 'manifiesto' },
    43: fecha('fecha_llegada', [281.5, 287.5, 68.5, 11.7], 'Fecha de llegada'),
    44: { nombre: 'doc_transporte' },
    45: fecha('doc_transporte_fecha', [515.5, 287.5, 73.5, 11.7], 'Fecha del documento de transporte'),
    46: { nombre: 'prov_razon' },
    47: { nombre: 'prov_ciudad' },
    48: { nombre: 'prov_pais' },
    49: { nombre: 'prov_direccion' },
    50: { nombre: 'prov_email' },
    51: { nombre: 'factura_num' },
    52: fecha('factura_fecha', [108.5, 359.5, 71.5, 11.7], 'Fecha de la factura'),
    53: { nombre: 'pais_procedencia' },
    54: { nombre: 'modo_transporte' },
    55: { nombre: 'bandera' },
    56: { nombre: 'destino_mercancia' },
    57: { nombre: 'transportadora' },
    58: { nombre: 'tasa_cambio', inputMode: 'decimal', derecha: true, etiqueta: 'Tasa de cambio' },
    59: { nombre: 'subpartida', lista: 'lista-subpartidas', alCambiar: alCambiarSubpartida, placeholder: '0000.00.00.00' },
    60: { nombre: 'cod_complementario' },
    61: { nombre: 'cod_suplementario' },
    62: { nombre: 'modalidad', sugerencias: MODALIDADES },
    63: { nombre: 'cuotas' },
    64: { nombre: 'valor_cuota' },
    65: { nombre: 'periodicidad' },
    66: { nombre: 'pais_origen' },
    67: { nombre: 'acuerdo' },
    68: { nombre: 'forma_pago' },
    69: { nombre: 'tipo_importacion' },
    70: { nombre: 'pais_compra' },
    71: { nombre: 'peso_bruto', caja: [156, 407.5, 94, 11.7], derecha: true, etiqueta: 'Peso bruto kgs.' },
    72: { nombre: 'peso_neto', caja: [252, 407.5, 92, 11.7], derecha: true, etiqueta: 'Peso neto kgs.' },
    73: { nombre: 'embalaje' },
    74: { nombre: 'bultos' },
    75: { nombre: 'num_subpartidas' },
    76: { nombre: 'unidad_fisica' },
    77: { nombre: 'cantidad', caja: [509.5, 407.5, 79.5, 11.7], derecha: true, etiqueta: 'Cantidad' },
    78: { nombre: 'v_fob', inputMode: 'decimal', derecha: true },
    79: { nombre: 'v_fletes', inputMode: 'decimal', derecha: true, caja: [113, 431.3, 73.5, 11.4], etiqueta: 'Valor fletes USD' },
    80: { nombre: 'v_seguros', inputMode: 'decimal', derecha: true },
    81: { nombre: 'v_otros', inputMode: 'decimal', derecha: true, caja: [113, 455.3, 73.5, 11.4], etiqueta: 'Valor otros gastos USD' },
    82: { valor: dolares(r.gastos), derecha: true, etiqueta: 'Sumatoria de fletes, seguros y otros gastos USD' },
    83: { nombre: 'v_ajuste', inputMode: 'decimal', derecha: true, caja: [113, 479.3, 73.5, 11.4], etiqueta: 'Ajuste valor USD' },
    84: { valor: dolares(r.aduanaUSD), derecha: true, etiqueta: 'Valor aduana USD' },
    85: { nombre: 'reg_licencia' },
    86: { nombre: 'reg_numero', caja: [129.5, 504, 56, 11.2], etiqueta: 'Número del registro o licencia' },
    87: { nombre: 'reg_oficina' },
    88: { nombre: 'reg_anio' },
    89: { nombre: 'programa' },
    90: { nombre: 'cod_interno', caja: [141, 528.5, 45, 10.7], etiqueta: 'Cód. interno del producto' },
    91: { nombre: 'descripcion', multilinea: true, caja: [22, 561.5, 567, 37.5], etiqueta: 'Descripción de las mercancías' },
    117: { omitir: true }, 118: { omitir: true },
    119: { nombre: 'total_sancion', inputMode: 'decimal', derecha: true, etiqueta: 'Sanción: total liquidado' },
    120: { valor: pesos(r.sancion), derecha: true, etiqueta: 'Sanción: total a pagar' },
    121: { omitir: true }, 122: { omitir: true },
    123: { nombre: 'total_rescate', inputMode: 'decimal', derecha: true, etiqueta: 'Rescate: total liquidado' },
    124: { valor: pesos(r.rescate), derecha: true, etiqueta: 'Rescate: total a pagar' },
    125: { valor: pesos(r.total), derecha: true, etiqueta: 'Total liquidado' },
    126: { valor: dolares(r.totalUSD), derecha: true, etiqueta: 'Total liquidado en dólares' },
    127: { nombre: 'pagos_anteriores', inputMode: 'decimal', derecha: true },
    128: { nombre: 'recibo_anterior', caja: [310, 600.8, 158, 10.9], etiqueta: 'Recibo oficial de pago anterior No.' },
    129: { nombre: 'recibo_fecha', caja: [507.8, 600.8, 80.5, 10.9], etiqueta: 'Fecha del recibo de pago anterior' },
    // Espacios que llena la DIAN, la Cancillería o el banco
    130: { omitir: true }, 131: { omitir: true }, 132: { omitir: true }, 133: { omitir: true }, 134: { omitir: true },
    135: { omitir: true }, 136: { omitir: true }, 137: { omitir: true }, 996: { omitir: true }, 997: { omitir: true },
    980: { valor: pesos(r.pago), caja: [428, 681.5, 147.5, 15.5], derecha: true, grande: true, etiqueta: 'Pago total' },
  };
  LIQUIDACION.forEach(([concepto, [pct, base, liquidado, pagar, enUsd], tarifa, clave]) => {
    const baseCop = clave === 'iva' ? r.baseIVA : r.aduanaCOP;
    const hay = parseFloat(v[tarifa]) > 0;
    campos[pct] = { nombre: tarifa, inputMode: 'decimal', centro: true, etiqueta: `${concepto}: tarifa %` };
    campos[base] = { valor: hay || clave === 'arancel' || clave === 'iva' ? pesos(baseCop) : '', derecha: true, etiqueta: `${concepto}: base` };
    campos[liquidado] = { valor: pesos(r[clave]), derecha: true, etiqueta: `${concepto}: total liquidado` };
    campos[pagar] = { valor: pesos(r[clave]), derecha: true, etiqueta: `${concepto}: total a pagar` };
    campos[enUsd] = { valor: usd(r[clave]), derecha: true, etiqueta: `${concepto}: total en dólares` };
  });

  return (
    <>
      <HojaOficial trazado={trazado} numero="500" titulo="Declaración de Importación" campos={campos}
        pie={(
          <div className="no-imprimir">
            {r.requiereDAV && <p className="ho-alerta" role="status">El valor FOB es de USD 5.000 o más: debes presentar la Declaración Andina del Valor (formulario 560) como documento soporte.</p>}
            {vistos.length > 0 && <p className="ho-alerta" role="status"><strong>Vistos buenos requeridos:</strong> {vistos.join(' | ')}</p>}
            <p className="ho-nota">Simulador educativo de BonCloud, sin validez ante la DIAN. La hoja reproduce la distribución y la numeración del formulario 500 oficial; la declaración real se presenta con firma digital en los servicios informáticos de la DIAN. Las casillas sombreadas en verde se calculan solas.</p>
          </div>
        )} />
      <datalist id="lista-subpartidas">
        {subpartidas.map((s) => <option key={s.codigo} value={s.codigo}>{s.titulo}</option>)}
      </datalist>
    </>
  );
}

export default {
  id: '500',
  sigla: 'DIAN',
  Componente: Form500,
  inicial: () => ({ tasa_arancel: '', tasa_iva: '19' }),
  obligatorios: [['imp_nit', 'NIT del importador (casilla 5)'], ['imp_razon', 'Nombre o razón social del importador (casilla 11)']],
  // Caso de la Ruta de Aprendizaje: 500 bombas de engranajes desde Shanghái.
  // Los datos de la empresa son ficticios; los valores son los de las lecciones 5 y 6.
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el caso de la Ruta de Aprendizaje: valor en aduana USD 63.800 (casilla 84) y $65.264.000 de tributos (arancel del 5% de ejemplo).',
    valores: () => ({
      anio: String(new Date().getFullYear()),
      imp_nit: '900123456', imp_razon: 'HidroColombia S.A.S. (empresa ficticia)', imp_seccional: '48',
      dec_nit: '900123456', dec_razon: 'HidroColombia S.A.S. (actúa directamente)', dec_tipo: '23', clase_importador: '02',
      prov_razon: 'Zhejiang Hydraulic Co. (proveedor ficticio)', prov_pais: 'CN', prov_ciudad: 'Shanghái',
      modalidad: 'C100', tipo_declaracion: '1', tasa_cambio: '4100',
      pais_origen: 'CN', pais_procedencia: 'CN', pais_compra: 'CN', modo_transporte: '1', lugar_ingreso: 'CTG', bultos: '1',
      doc_transporte: 'SHACTG-2026-0457', factura_num: 'ZH-2026-118',
      subpartida: '8413.60.90.00', num_subpartidas: '1', cantidad: '500', unidad_fisica: 'U',
      descripcion: 'Bombas de engranajes externos para aceite hidráulico, sin motor. 500 unidades. DAV: (número de la declaración andina del valor presentada).',
      v_fob: '60000', v_fletes: '3500', v_seguros: '300', v_otros: '0', v_ajuste: '0', tasa_arancel: '5', tasa_iva: '19',
    }),
  },
  explicaciones: {
    1: 'Año en que se presenta la declaración.',
    4: 'Número único del formulario, asignado por la DIAN.',
    5: 'NIT del importador, sin dígito de verificación, puntos ni guiones.',
    6: 'Dígito de verificación del NIT. Se calcula solo con el algoritmo de módulo 11 de la DIAN.',
    11: 'Apellidos y nombres o razón social del importador, tal como figuran en su RUT.',
    12: 'Código de la Dirección Seccional donde se encuentra la mercancía o donde se tramitará la importación. Cartagena es 48 (Resolución DIAN 000065 de 2021).',
    13: 'Dirección del domicilio principal del importador, igual que en el RUT.',
    15: 'Teléfono del importador.',
    16: 'Código DANE del departamento del domicilio del importador.',
    17: 'Código DANE de la ciudad o municipio del domicilio del importador.',
    24: 'NIT de quien presenta la declaración: el importador si actúa directamente, o la agencia de aduanas.',
    25: 'Dígito de verificación del NIT del declarante. Se calcula solo.',
    26: 'Nombre o razón social del declarante: la agencia de aduanas o el importador que actúa directamente.',
    27: 'Código de usuario aduanero del declarante registrado en la casilla 54 de su RUT (23 si es el importador).',
    31: 'Clase de importador: 01 empresa mixta, 02 empresa privada, 03 empresa o entidad pública.',
    32: 'Tipo de declaración. Aparece solo al elegir el código en la casilla 33.',
    33: 'Código del tipo de declaración: 1 inicial, 2 legalización, 3 anticipada, 4 corrección, 5 modificación.',
    34: 'Solo en legalización, corrección o modificación: número (casilla 4) de la declaración anterior.',
    40: 'Código de la ciudad por donde ingresó la mercancía al país. Cartagena es CTG.',
    41: 'Código del depósito donde está almacenada la mercancía.',
    42: 'Número del manifiesto de carga que el transportador transmitió a la DIAN.',
    43: 'Fecha del acuse de recibo del aviso de llegada del medio de transporte, que da el sistema de la DIAN.',
    44: 'Número del documento de transporte (B/L o guía aérea), que debe figurar en el manifiesto de carga.',
    46: 'Nombre o razón social de quien expide la factura de la mercancía (exportador o proveedor en el exterior).',
    48: 'Código del país del exportador o proveedor (por ejemplo, CN para China).',
    51: 'Número de la factura comercial, documento soporte de la declaración.',
    53: 'País donde se embarcó la mercancía hacia Colombia. Puede ser distinto del país de origen.',
    54: 'Código del modo de transporte con el que llegó la mercancía (marítimo, aéreo, terrestre...).',
    58: 'Tasa de cambio representativa del mercado del último día hábil de la semana anterior a la presentación y aceptación de la declaración, con dos decimales. No es la TRM del día.',
    59: 'Subpartida arancelaria a 10 dígitos. Cada declaración ampara una sola subpartida: si llegan mercancías de varias subpartidas, se presenta una declaración por cada una. Si escribes una del catálogo de BonCloud, se proponen su arancel y su IVA.',
    62: 'Modalidad de importación (Anexo 1 de la Resolución DIAN 46 de 2019). C100 es la importación ordinaria; las temporales empiezan por S (S100, corto plazo).',
    66: 'País donde se produjo la mercancía. Es obligatoria y define si puede pedirse una preferencia por acuerdo comercial.',
    67: 'Código del acuerdo comercial con el que se pide trato preferencial. Vacío si se paga el arancel general.',
    68: 'Código de la forma de pago de la mercancía al proveedor (no de los tributos).',
    70: 'Código del país en el que se hizo la operación de compra.',
    71: 'Peso de la mercancía en kilogramos, con su empaque.',
    72: 'Peso de la mercancía en kilogramos, sin su empaque.',
    74: 'Número total de bultos que se declaran.',
    77: 'Cantidad de mercancía en la unidad física de la subpartida (casilla 76).',
    78: 'Valor FOB en dólares de la mercancía declarada.',
    79: 'Flete internacional en dólares hasta el lugar de importación en Colombia.',
    80: 'Seguro en dólares. Se declara la prima pagada según la póliza.',
    81: 'Otros gastos en dólares causados en el exterior y relacionados con la mercancía.',
    82: 'Suma de las casillas 79, 80 y 81. Se calcula sola.',
    83: 'Ajustes que se suman o restan al precio según las normas de valoración (por ejemplo, comisiones de venta o regalías). Si es una deducción, se escribe con signo menos.',
    84: 'Valor en aduana en dólares: FOB (78) + fletes, seguros y otros (82) + ajuste (83). Se calcula solo.',
    85: 'R si la importación requiere registro de importación, L si requiere licencia.',
    86: 'Número de aprobación del registro o licencia de importación (VUCE), si la subpartida lo exige.',
    91: 'Descripción de la mercancía con marcas, seriales y demás datos que la identifiquen. No se empieza copiando el texto del arancel.',
    92: 'Tarifa del arancel para la subpartida declarada.',
    93: 'Base del arancel: valor en aduana (84) convertido a pesos con la tasa de cambio (58).',
    94: 'Arancel liquidado: base (93) × tarifa (92), aproximado al múltiplo de mil más cercano.',
    95: 'Arancel que se paga con esta declaración.',
    97: 'Tarifa del IVA de la subpartida declarada.',
    98: 'Base del IVA: base del arancel (93) + arancel liquidado (94). Los derechos antidumping y la salvaguardia no se suman (Concepto DIAN 626 de 2020).',
    99: 'IVA liquidado: base (98) × tarifa (97), aproximado al múltiplo de mil más cercano.',
    102: 'Tarifa de la medida de salvaguardia, si la mercancía está sujeta a ella.',
    107: 'Tarifa de los derechos compensatorios, si la mercancía está sujeta a ellos.',
    112: 'Tarifa de los derechos antidumping, si la mercancía está sujeta a ellos.',
    119: 'Sanción liquidada, cuando corresponda según la normatividad vigente.',
    123: 'Rescate liquidado, cuando la mercancía se legaliza.',
    125: 'Suma de los totales liquidados de todos los conceptos.',
    127: 'Valor ya pagado con una declaración anterior, cuando esta se corrige o modifica.',
    980: 'Pago total: suma de los «total a pagar» de arancel, IVA, salvaguardia, compensatorios, antidumping, sanción y rescate, menos los pagos anteriores (127).',
  },
};
