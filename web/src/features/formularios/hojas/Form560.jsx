import { calcularDAV, CASILLAS_ADICIONES, CASILLAS_DEDUCCIONES } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import HojaOficial from '../kit/HojaOficial.jsx';
import { dolares, soloDigitos } from '../kit/formato.js';
import trazado from '../trazados/560.json';

// Formulario 560, Declaración Andina del Valor (DAV). Trazado, numeración e instrucciones
// del formulario oficial de la DIAN (Formulario_560_2026.pdf).
const SI_NO = [['S', 'Sí'], ['N', 'No']];
const TIPOS_DECLARACION = [['1', 'Inicial'], ['2', 'Legalización'], ['3', 'Anticipada'], ['4', 'Corrección'], ['5', 'Modificación']];
const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'].map((t) => [t, t]);

const caja = (x, y, w, h, extra = {}) => ({ caja: [x, y, w, h], ...extra });
const fecha = (nombre, x, y, etiqueta) => ({ nombre, caja: [x, y, 79, 11], etiqueta });

// Descripción de la mercancía: tres ítems en dos bloques de columnas
const BLOQUE_A = [[67, 'nombre', 'Nombre comercial'], [68, 'marca', 'Marca comercial'], [69, 'tipo', 'Tipo'], [70, 'clase', 'Clase'], [71, 'modelo', 'Modelo']];
const BLOQUE_B = [[72, 'referencia', 'Referencia'], [73, 'estado', 'Cód. Estado'], [74, 'anio', 'Año de fabricación'], [75, 'otras', 'Otras características'], [76, 'cantidad', 'Cantidad'], [77, 'unidad', 'Unidad comercial'], [78, 'precio', 'Precio FOB unitario USD']];

function Form560() {
  const { valores: v } = useCampos();
  const r = calcularDAV(v);
  const celdas = trazado.celdas;

  const campos = {
    1: { nombre: 'anio', caja: [52, 62.5, 44, 10.5], max: 4, centro: true, formato: soloDigitos, etiqueta: 'Año' },
    4: { omitir: true },
    5: { nombre: 'f_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'NIT del importador' },
    6: { valor: digitoVerificacion(v.f_nit), caja: [188, 167.5, 13, 11.7], centro: true, etiqueta: 'DV del importador' },
    11: { nombre: 'f_razon' },
    24: caja(114, 205, 22, 10.3, { nombre: 'f_dirsec', centro: true, etiqueta: 'Cód. Dirección seccional' }),
    25: caja(234, 205, 125, 10.3, { nombre: 'f_declaracion', etiqueta: 'No. Declaración de importación' }),
    26: { nombre: 'f_fecha26', caja: [394, 205, 73, 10.3], etiqueta: 'Fecha de la declaración de importación' },
    27: caja(571, 205.3, 17.5, 10, { nombre: 'f_tipodec', centro: true, sugerencias: TIPOS_DECLARACION, etiqueta: 'Tipo declaración de importación' }),
    28: caja(76, 228, 20, 11, { nombre: 'f_nivel', centro: true, etiqueta: 'Cód. Nivel comercial comprador' }),
    30: caja(252.5, 229.8, 28.5, 9.6, { nombre: 'f_condvend', centro: true, etiqueta: 'Cód. Condición vendedor' }),
    32: caja(430, 228, 78, 11, { nombre: 'f_resolucion', etiqueta: 'Resolución No.' }),
    33: fecha('f_fecha33', 510, 228.3, 'Fecha de la resolución'),
    34: caja(71, 252.3, 18, 10.7, { nombre: 'f_tipores', centro: true, etiqueta: 'Cód. Tipo resolución' }),
    35: caja(129.5, 252.3, 18, 10.7, { nombre: 'f_nattrans', centro: true, etiqueta: 'Cód. Naturaleza transacción' }),
    36: caja(187.5, 252.3, 18.5, 10.7, { nombre: 'f_formaenv', centro: true, etiqueta: 'Cód. Forma de envío' }),
    37: caja(209, 253.3, 45.5, 10, { nombre: 'f_incoterm', centro: true, sugerencias: INCOTERMS, etiqueta: 'Condiciones de entrega' }),
    38: { nombre: 'f_lugar38' },
    39: caja(378.5, 253.3, 37.5, 10, { nombre: 'f_paisprocedencia', centro: true, etiqueta: 'Cód. País procedencia' }),
    40: caja(430, 252, 78, 11, { nombre: 'f_factura40', etiqueta: 'Factura No.' }),
    41: fecha('f_fecha41', 510, 252.3, 'Fecha de la factura'),
    43: caja(158, 275.5, 126, 11.7, { nombre: 'f_contrato', etiqueta: 'Número contrato u otro documento' }),
    44: fecha('f_fecha44', 285.5, 276.3, 'Fecha del contrato u otro documento'),
    46: { nombre: 'f_fob46', inputMode: 'decimal', derecha: true },
    47: { nombre: 'f_mon47', centro: true },
    48: caja(63, 299.5, 77, 11.7, { nombre: 'f_tc48', derecha: true, etiqueta: 'Tipo de cambio de la moneda de facturación' }),
    49: fecha('f_fecha49', 141, 300.3, 'Fecha del tipo de cambio'),
    51: caja(248, 299.5, 77, 11.7, { etiqueta: 'Tipo de cambio (segunda moneda)', derecha: true }),
    52: caja(326, 300.3, 79, 11, { etiqueta: 'Fecha del tipo de cambio (segunda moneda)' }),
    54: caja(433, 299.5, 76, 11.7, { etiqueta: 'Tipo de cambio (tercera moneda)', derecha: true }),
    55: caja(510.5, 300.3, 79, 11, { etiqueta: 'Fecha del tipo de cambio (tercera moneda)' }),
    56: { nombre: 'f_intermediacion', centro: true, sugerencias: SI_NO },
    91: caja(379, 492, 104, 11, { nombre: 'f_dec_anterior', etiqueta: 'Declaración de importación anterior No.' }),
    92: fecha('f_fecha92', 510.5, 492.3, 'Fecha de la declaración anterior'),
    114: caja(134.5, 680.5, 27.5, 13.5, { nombre: 'f_lugar_importacion', centro: true, etiqueta: 'Lugar de importación' }),
    136: caja(571, 685, 18, 10.3, { nombre: 'f_provisional', centro: true, sugerencias: SI_NO, etiqueta: '¿Algunos importes tienen carácter provisional?' }),
    137: { nombre: 'sig_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'NIT del signatario' },
    138: { valor: digitoVerificacion(v.sig_nit), caja: [188, 707.5, 13, 11.7], centro: true, etiqueta: 'DV del signatario' },
    997: { nombre: 'fecha_expedicion', caja: [487.5, 752.3, 79.5, 11.5], etiqueta: 'Fecha de expedición' },
  };
  [79, 81, 84, 85, 86, 87, 89, 90].forEach((n) => { campos[n] = { nombre: `f_${n}`, centro: true, sugerencias: SI_NO }; });
  // Ítems: una fila de 12 puntos por ítem, debajo del encabezado de cada bloque
  const tabla = (bloque, letra, y0) => bloque.forEach(([num, clave, etiqueta]) => {
    const c = celdas[num];
    campos[num] = { partes: [0, 1, 2].map((i) => ({ nombre: `${letra}${i + 1}_${clave}`, caja: [c.x + 0.8, y0 + i * 12 + 0.8, c.w - 1.6, 10.4], etiqueta: `${etiqueta}, ítem ${i + 1}` })) };
  });
  tabla(BLOQUE_A, 'a', 372);
  tabla(BLOQUE_B, 'b', 420);
  // Determinación del valor: columna de moneda de facturación (impares) y columna USD (pares)
  for (let n = 93; n <= 135; n++) {
    if (n === 114) continue;
    const etiqueta = `Casilla ${n}`;
    if (r[n] !== undefined) campos[n] = { valor: dolares(r[n]), derecha: true, etiqueta };
    else campos[n] = { nombre: `v${n}`, inputMode: 'decimal', derecha: true, etiqueta };
  }
  campos[97].etiqueta = 'Precio pagado o por pagar';
  campos[123].etiqueta = 'Total adiciones';
  campos[134].etiqueta = 'Total deducciones';
  campos[135] = { ...campos[135], etiqueta: 'Valor de transacción declarado', grande: false };

  return (
    <HojaOficial trazado={trazado} numero="560" titulo="Declaración Andina del Valor" campos={campos} sombra="#c9d4e4"
      pie={(
        <p className="ho-nota no-imprimir">Simulador educativo de BonCloud, sin validez ante la DIAN. La hoja reproduce la distribución y la numeración del formulario 560 oficial (hoja principal). En la determinación del valor, la columna USD suma sola: precio pagado (97), adiciones (123), deducciones (134) y valor de transacción declarado (135 = 97 + 123 − 134). La DAV se exige cuando el valor FOB es de USD 5.000 o más.</p>
      )} />
  );
}

export default {
  id: '560',
  sigla: 'DAV (Form 560)',
  Componente: Form560,
  inicial: () => ({}),
  obligatorios: [
    ['f_nit', 'NIT del importador (casilla 5)'],
    ['f_razon', 'Razón social (casilla 11)'],
    ['f_factura40', 'Factura No. (casilla 40)'],
    ['f_incoterm', 'Condiciones de entrega (casilla 37)'],
  ],
  // Caso de la Ruta de Aprendizaje: 500 bombas × USD 120 FOB Shanghái
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el caso de la Ruta de Aprendizaje: precio pagado USD 60.000 + flete USD 3.500 + seguro USD 300 = valor en aduana USD 63.800 (casilla 135).',
    valores: () => ({
      anio: String(new Date().getFullYear()),
      f_nit: '900123456', f_razon: 'HidroColombia S.A.S. (empresa ficticia)', f_dirsec: '48', f_tipodec: '1',
      f_nattrans: '11', f_formaenv: '1', f_incoterm: 'FOB', f_lugar38: 'Shanghái', f_paisprocedencia: 'CN',
      f_factura40: 'ZH-2026-118', f_fob46: '60000', f_mon47: 'USD', f_tc48: '1', f_intermediacion: 'N',
      f_79: 'N', f_81: 'N', f_85: 'N', f_86: 'N', f_87: 'N', f_provisional: 'N',
      a1_nombre: 'Bomba de engranajes hidráulica', a1_marca: 'Zhejiang Hydraulic', a1_tipo: 'Engranajes externos', a1_clase: 'Sin motor',
      b1_estado: '1', b1_anio: '2026', b1_otras: 'Para aceite hidráulico', b1_cantidad: '500', b1_unidad: 'UN', b1_precio: '120',
      v94: '60000', v118: '3500', v122: '300',
    }),
  },
  explicaciones: {
    5: 'NIT del importador (comprador), igual que en la declaración de importación.',
    6: 'Dígito de verificación del NIT. Se calcula solo.',
    11: 'Razón social del importador.',
    24: 'Código de la dirección seccional de aduanas donde se presenta la importación. Cartagena es 48.',
    25: 'Número de aceptación de la declaración de importación (casilla 132 del formulario 500) de la que esta DAV es soporte.',
    27: 'Tipo de la declaración de importación: 1 inicial, 2 legalización, 3 anticipada, 4 corrección, 5 modificación.',
    28: 'Nivel comercial del comprador: usuario final, distribuidor, etc.',
    30: 'Condición del vendedor: fabricante, distribuidor, etc.',
    35: 'Naturaleza de la transacción. Una compra con precio fijo es 11 – compraventa a precio firme. Un código distinto de 11 o 12 indica que no se puede usar el método del valor de transacción.',
    36: 'Forma de envío: si la mercancía llega en un solo envío o fraccionada, y si el valor es total o parcial.',
    37: 'Incoterm pactado. Debe coincidir con la factura. Las bombas del caso se compraron FOB.',
    38: 'Lugar convenido del Incoterm, por ejemplo el puerto de Shanghái en FOB Shanghái.',
    40: 'Número de la factura comercial del proveedor.',
    46: 'Valor FOB total en la moneda de la negociación.',
    47: 'Moneda en que se negoció la compra.',
    56: 'Indica si hubo un intermediario (comisionista, agente) en la compra.',
    67: 'Nombre comercial de la mercancía, como se conoce en el mercado.',
    76: 'Cantidad de unidades comerciales de la mercancía.',
    78: 'Precio unitario FOB en dólares.',
    79: 'Restricciones a la cesión o utilización de la mercancía por el comprador (Decisión 571).',
    85: 'Si el comprador paga regalías o licencias relacionadas con la mercancía, se suman al valor.',
    87: 'Vinculación entre comprador y vendedor (por ejemplo, casa matriz y filial).',
    89: 'Si la vinculación influyó en el precio, el valor de transacción puede no aceptarse.',
    94: 'Precio neto que figura en la factura, en dólares.',
    96: 'Pagos indirectos o descuentos retroactivos que forman parte del precio.',
    97: 'Precio realmente pagado o por pagar: suma de las casillas 94 y 96. Se calcula solo.',
    116: 'Gastos de transporte en el exterior hasta el lugar de embarque, si no están en el precio.',
    118: 'Fletes y otros gastos de transporte desde el lugar de embarque hasta el lugar de importación en Colombia.',
    122: 'Seguro: la prima efectivamente pagada según la póliza. Si no se contrató seguro, se toma el valor de una certificación de una aseguradora con las tarifas habitualmente aplicables.',
    123: 'Total de adiciones al precio (casillas 99 a 122, columna USD). Se calcula solo.',
    134: 'Total de deducciones (casillas 125, 127, 129, 131 y 133): gastos posteriores a la importación, derechos e impuestos, intereses y otros conceptos incluidos en el precio que no hacen parte del valor en aduana. Se calcula solo.',
    135: 'Valor de transacción declarado: precio pagado o por pagar (97) + total adiciones (123) − total deducciones (134). Corresponde al valor en aduana del formulario 500.',
    136: 'Si algún importe de las casillas 99, 111 o 113 es provisional, se indica aquí.',
  },
};
