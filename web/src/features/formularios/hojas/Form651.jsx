import { useState } from 'react';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import HojaOficial, { SelectorHojas, cajaDe } from '../kit/HojaOficial.jsx';
import { soloDigitos } from '../kit/formato.js';
import h1 from '../trazados/651-1.json';
import h2 from '../trazados/651-2.json';
import h3 from '../trazados/651-3.json';
import h5 from '../trazados/651-5.json';
import h6 from '../trazados/651-6.json';
import h7 from '../trazados/651-7.json';

// Formulario 651, Documento Único para Tránsito Aduanero / Operaciones de Transporte (DUTA),
// que reemplazó a la declaración de tránsito aduanero (DTA, formulario 650). Se diligencia en
// línea en MUISCA y la DIAN no publica la hoja en blanco: el trazado se extrajo de un borrador
// diligenciado con scripts/extraer_formulario.py en modo «sin-datos», que conserva solo los
// rótulos y las líneas. Cada casilla se guarda como c<número> (c<número>_cod para su código);
// en las hojas de bloques repetidos, como c<número>_<bloque>.
const HOJAS = [
  ['1', 'Hoja principal', h1],
  ['2', 'Hoja 2 · Documentos de transporte y unidades de carga', h2],
  ['3', 'Hoja 3 · Transportador', h3],
  ['5', 'Hoja 5 · Rutas y plazos', h5],
  ['6', 'Hoja 6 · Mercancías', h6],
  ['7', 'Hoja 7 · Documentos soporte', h7],
];
const BLOQUE = { 2: 'unidad de carga', 3: 'transportador', 5: 'ruta', 6: 'ítem', 7: 'documento' };
// Números que el extractor toma por casillas y no lo son («formato 1165», «Aduana de paso 10»)
const NO_SON = new Set(['1165', '1166', '1167', '10', '11', '12']);
// Las llena la DIAN
const RESERVADAS = [4, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 222, 223];
// DV que se calcula con el número de identificación de la casilla indicada
const DV_DE = { 6: 18, 30: 29, 42: 41, 54: 53, 133: 132, 207: 206, 1004: 1003 };
const SI_NO = [118, 120, 121, 130, 218, 220, 224, 226];
const TIPOS_DOCUMENTO = [['31', 'NIT'], ['13', 'Cédula de ciudadanía'], ['22', 'Cédula de extranjería'], ['41', 'Pasaporte'], ['43', 'Sin identificación del exterior']];
const DOCUMENTOS = new Set([20, 28, 40, 52, 131, 205, 1002]);
// En la hoja principal el año, el concepto y la firma no tienen celda propia: se ubican a mano
const A_MANO = {
  1: [50, 61.5, 36, 9.5], 2: [165, 61.5, 14, 9.5],
  1001: [70, 741, 225, 9], 1002: [70, 756, 26, 9], 1003: [163, 756, 100, 9], 1004: [287, 756, 14, 9],
  1005: [420, 732, 60, 9], 1006: [400, 745, 188, 9],
  // Casillas con el dato a la derecha del rótulo, en la misma franja
  68: { caja: [85, 469, 465, 9.4], cod: [557, 469, 34, 9.4] },
  76: { caja: [128, 529, 125, 9.4], cod: [283, 529, 29, 9.4] },
  221: [397, 529, 194, 9.4],
  79: [390, 542, 201, 10],
};

// Rótulos que el extractor no lee completos (el número va en una celda aparte)
const ROTULOS = {
  105: 'Fecha del documento de transporte', 224: '¿Unidad de carga precintable?', 120: '¿Trae precintos de seguridad?',
  1001: 'Apellidos y nombres', 1002: 'Tipo doc.', 1003: 'No. identificación',
};

const numeros = (t) => Object.keys(t.celdas).filter((n) => !NO_SON.has(n));

// En el DUTA el rótulo va en una franja angosta y el dato en la franja de abajo. En las celdas
// altas (hojas de bloques) el dato va debajo del rótulo, dentro de la misma celda.
function cajasDe(trazado, celda, { alto = 13 } = {}) {
  const enX = (x) => trazado.lineas.filter(([o, , a, b]) => o === 'h' && a - 0.5 <= x && x <= b + 0.5).map(([, pos]) => pos).sort((m, n) => m - n);
  const cod = trazado.textos.find((t) => t.t === 'Cód.' && t.x > celda.x + 8 && t.x < celda.x + celda.w + 16 && Math.abs(t.y - (celda.ly ?? celda.y + 7)) < 3);
  let x0 = celda.x + 1;
  let x1 = celda.x + celda.w - 1;
  let y;
  let h;
  if (celda.h >= 18) {
    [, y, , h] = cajaDe(celda);
  } else {
    const ys = enX(celda.x + 3);
    const base = celda.y + celda.h;
    const arriba = ys.find((v) => v > base + 0.5 && v <= base + 4) ?? base;
    const abajo = ys.find((v) => v > arriba + Math.min(alto, 12) - 8) ?? arriba + alto;
    y = arriba + 0.8;
    h = Math.min(abajo - arriba - 1.6, alto);
  }
  if (!cod) return { caja: [x0, y, x1 - x0, h] };
  // El código va debajo del rótulo «Cód.», hasta la siguiente línea vertical
  const verticales = trazado.lineas.filter(([o, , a, b]) => o === 'v' && a <= y + 2 && b >= y + h - 2).map(([, pos]) => pos);
  const fin = Math.min(...verticales.filter((v) => v > cod.x + 8), cod.x + 40, trazado.w - 20);
  x1 = Math.min(x1, cod.x - 1.5);
  return { caja: [x0, y, x1 - x0, h], cod: [cod.x - 1, y, fin - cod.x, h] };
}

// Casillas de marcar: el cuadrito es un recuadro pequeño dentro de la celda, debajo o a su derecha
function cuadrito(trazado, celda) {
  const cortas = trazado.lineas.filter(([o, pos, a, b]) => o === 'h' && b - a >= 7 && b - a <= 16
    && a >= celda.x - 1 && a <= celda.x + celda.w + 30 && pos > celda.y + 4 && pos <= celda.y + celda.h + 16);
  // un cuadrito tiene arriba y abajo dos líneas cortas iguales, separadas de 6 a 14 puntos
  const pares = cortas.map((l) => [l, cortas.find((m) => Math.abs(m[2] - l[2]) < 1 && Math.abs(m[3] - l[3]) < 1 && m[1] - l[1] >= 6 && m[1] - l[1] <= 14)]).filter(([, m]) => m);
  if (!pares.length) return null;
  // el más cercano al rótulo (el número de la casilla a veces queda en su propia celda)
  const [[, top, a, b], [, abajo]] = pares.reduce((x, y) => (y[0][2] < x[0][2] - 1 || (Math.abs(y[0][2] - x[0][2]) <= 1 && y[0][1] < x[0][1]) ? y : x));
  const alto = abajo - top;
  return [a + 0.6, top + 0.6, b - a - 1.2, alto - 1.2];
}

function Form651() {
  const { valores: v } = useCampos();
  const [hoja, setHoja] = useState('1');

  const camposDe = (n, trazado) => {
    const campos = {};
    numeros(trazado).forEach((num) => {
      const numero = Number(num);
      if (RESERVADAS.includes(numero)) { campos[num] = { omitir: true }; return; }
      const apariciones = trazado.repetidas?.[num] || [trazado.celdas[num]];
      const varios = n !== '1';
      const partes = [];
      apariciones.forEach((celda, i) => {
        const rotulo = ROTULOS[num] || celda.r || trazado.celdas[num].r || `Casilla ${num}`;
        const sufijo = varios ? `, ${BLOQUE[n]} ${i + 1}` : '';
        const nombre = varios ? `c${num}_${i + 1}` : `c${num}`;
        const manual = varios ? null : A_MANO[num];
        const { caja, cod } = manual ? (Array.isArray(manual) ? { caja: manual } : manual) : cajasDe(trazado, celda, numero === 200 ? { alto: 160 } : {});
        const etiqueta = `${rotulo}${sufijo}`;
        let def = { nombre, caja, etiqueta };
        if (DV_DE[num]) def = { valor: digitoVerificacion(v[varios ? `c${DV_DE[num]}_${i + 1}` : `c${DV_DE[num]}`]), caja, etiqueta: `DV${sufijo}`, centro: true };
        else if (SI_NO.includes(numero)) {
          // Se marca con X, como en el documento que genera MUISCA
          const caja2 = cuadrito(trazado, celda);
          def = { ...def, caja: caja2 || caja, max: 1, centro: true, placeholder: '', formato: (t) => t.toUpperCase().replace(/[^X]/g, '') };
        }
        else if (DOCUMENTOS.has(numero)) Object.assign(def, { sugerencias: TIPOS_DOCUMENTO, centro: true });
        if ([18, 29, 41, 53, 132, 206, 1003].includes(numero)) Object.assign(def, { inputMode: 'numeric', formato: soloDigitos });
        if (numero === 200) def.multilinea = true;
        partes.push(def);
        if (cod) partes.push({ nombre: varios ? `c${num}_cod_${i + 1}` : `c${num}_cod`, caja: cod, etiqueta: `${rotulo}: código${sufijo}`, centro: true });
      });
      campos[num] = { partes };
    });
    return campos;
  };
  const conDatos = (n) => n === '1' || Object.keys(v).some((k) => new RegExp(`^c(${numeros(HOJAS.find(([id]) => id === n)[2]).join('|')})(_cod)?_\\d+$`).test(k) && String(v[k] ?? '').trim());

  return (
    <>
      <SelectorHojas hojas={HOJAS.map(([id, texto]) => [id, texto])} actual={hoja} onCambiar={setHoja} />
      {HOJAS.map(([id, , trazado]) => (
        <HojaOficial key={id} trazado={trazado} numero="651" titulo={`Documento Único para Tránsito Aduanero${id === '1' ? '' : `, hoja ${id}`}`}
          campos={camposDe(id, trazado)} soloConfiguradas oculta={hoja !== id} imprimir={conDatos(id)} />
      ))}
      <p className="ho-nota no-imprimir" style={{ width: 980, maxWidth: '100%', margin: '10px auto 0' }}>Simulador educativo de BonCloud, sin validez ante la DIAN. El DUTA real se diligencia en línea en MUISCA (Tránsito Aduanero), lo revisa la DIAN y lo firma digitalmente el declarante. La hoja reproduce la distribución y la numeración del documento que genera el sistema. La hoja 4 no se incluye porque no aparece en el borrador de referencia.</p>
    </>
  );
}

export default {
  id: '651',
  sigla: 'DUTA',
  Componente: Form651,
  inicial: () => ({}),
  obligatorios: [
    ['c18', 'Número de identificación del declarante (casilla 18)'],
    ['c35', 'Razón social del consignatario (casilla 35)'],
    ['c72', 'Aduana de partida (casilla 72)'],
    ['c73', 'Aduana de destino (casilla 73)'],
    ['c80', 'Total valor FOB USD (casilla 80)'],
  ],
  // Caso del módulo 3 de la Ruta: la llenadora de Andina Pack (datos ficticios)
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el caso del módulo 3: tránsito aduanero de la máquina llenadora desde el Puerto de Cartagena hasta una zona franca de la Sabana de Bogotá. Revisa también las hojas 2, 3, 5, 6 y 7.',
    valores: () => {
      const anio = String(new Date().getFullYear());
      return {
        c1: anio, c2: '1',
        c20: '31', c18: '900555123', c11: 'Servicios de Logística Aduanera del Caribe S.A.S. (agencia ficticia)',
        c24: 'Manga, calle 25 (dirección ficticia)', c25: 'Colombia', c25_cod: '169', c26: 'Bolívar', c26_cod: '13', c27: 'Cartagena', c27_cod: '001',
        c28: '31', c29: '860111222', c35: 'Zona Franca de la Sabana S.A.S., usuario operador (empresa ficticia)', c37: 'Colombia', c37_cod: '169',
        c40: '31', c41: '901234567', c47: 'Andina Pack S.A.S. (usuario de zona franca, empresa ficticia)', c49: 'Colombia', c49_cod: '169',
        c59: 'Linea Pack S.p.A. (proveedor ficticio)', c61: 'Italia', c61_cod: '386',
        c65: 'Tránsito aduanero', c65_cod: 'T', c66: 'Tránsito aduanero nacional', c66_cod: '1',
        c68: 'Mercancías consignadas o endosadas a usuario de zona franca', c68_cod: '2',
        c69: 'Italia', c69_cod: '386', c70: 'Colombia', c70_cod: '169', c71: 'Colombia', c71_cod: '169',
        c72: 'Cartagena', c72_cod: '48', c73: 'Bogotá', c73_cod: '3', c74: 'Génova',
        c76: 'Zona Franca de la Sabana (ficticia)', c77: 'Día calendario o continuo', c77_cod: '2', c78: '6',
        c80: '80000', c81: '6', c82: '1', c83: '1', c84: '4200', c85: '1',
        c1001: 'Pérez Gómez Ana María (persona ficticia)', c1002: '13', c1003: '1000000001', c1005: '01',
        c1006: 'Servicios de Logística Aduanera del Caribe S.A.S.',
        // Hoja 2: el contenedor
        c98_1: '1', c101_1: 'Hijo', c104_1: 'GOACTG-2026-0311', c106_1: 'Camión', c107_1: 'TKO-892', c108_1: 'Colombia', c108_cod_1: '169',
        c111_1: 'Contenerizada', c111_cod_1: '2', c112_1: 'Contenedor', c112_cod_1: '2', c113_1: 'ABCU1234567 (ficticio)',
        c120_1: 'X', c224_1: 'X', c122_1: 'PR-000123 (ficticio)', c196_1: '4200', c190_1: '1',
        // Hoja 3: el transportador
        c131_1: '31', c132_1: '800444987', c138_1: 'Transportes Andinos de Carga S.A. (empresa ficticia)', c140_1: 'Colombia', c140_cod_1: '169', c143_1: 'Transporte carretero', c143_cod_1: '3',
        // Hoja 5: la ruta
        c169_1: 'Cartagena - Bogotá', c170_1: 'Aduana de Cartagena - Aduana de Bogotá', c171_1: 'Día calendario o continuo', c171_cod_1: '2', c172_1: '6',
        // Hoja 6: la mercancía
        c186_1: '1', c187_1: '8422.30.90.00', c191_1: 'Contenedor', c197_1: '1', c198_1: 'Unidad',
        c200_1: 'Máquina llenadora de botellas, de demostración, marca Linea Pack, modelo LP-200, con sus accesorios.',
        // Hoja 7: la factura
        c202_1: 'Documento que soporta la operación', c203_1: 'Factura comercial', c204_1: 'LP-2026-118 (ficticia)',
        c205_1: '43', c208_1: 'Linea Pack S.p.A. (proveedor ficticio)', c211_1: 'USD', c211_cod_1: 'USD', c212_1: '80000', c192_1: 'Italia', c192_cod_1: '386',
      };
    },
  },
  explicaciones: {
    1: 'Año en que se presenta el documento.',
    2: 'Concepto del trámite. Lo propone el sistema.',
    4: 'Número del formulario. Lo asigna la DIAN.',
    6: 'Dígito de verificación del declarante. Se calcula solo.',
    11: 'Razón social del declarante: la agencia de aduanas o el operador que solicita el tránsito.',
    18: 'Número de identificación del declarante.',
    20: 'Tipo de documento del declarante; 31 es NIT.',
    24: 'Dirección del declarante, con país, departamento y ciudad y sus códigos (casillas 25 a 27).',
    28: 'Tipo de documento del consignatario: a quien viene consignada la carga en el documento de transporte.',
    29: 'Número de identificación del consignatario.',
    35: 'Razón social del consignatario. En el caso, el usuario operador de la zona franca.',
    40: 'Tipo de documento del destinatario o importador.',
    41: 'Número de identificación del destinatario o importador.',
    47: 'Razón social del destinatario o importador: quien recibe la mercancía en la aduana de destino.',
    52: 'Tipo de documento del proveedor o exportador en el exterior; 43 si no tiene identificación colombiana.',
    59: 'Razón social del proveedor o exportador en el exterior.',
    64: 'Número del documento anterior, cuando este lo corrige o lo reemplaza.',
    65: 'Régimen, operación o traslado, con su código. Para el tránsito aduanero el código es T.',
    66: 'Tipo de régimen u operación, con su código; por ejemplo, tránsito aduanero nacional.',
    67: 'Número de referencia interno del declarante (en el manual, el número del DO).',
    68: 'Operación que se ampara, con su código; por ejemplo, mercancías consignadas o endosadas a un usuario de zona franca.',
    69: 'País de donde procede la mercancía, con su código.',
    70: 'País donde se hace el trámite.',
    71: 'País de destino final.',
    72: 'Aduana donde empieza el tránsito, con su código. Cartagena es 48.',
    73: 'Aduana donde termina el tránsito, con su código.',
    74: 'Lugar donde se embarcó la mercancía en el exterior.',
    75: 'Lugar de destino final en Colombia, con su código.',
    76: 'Depósito, zona franca o instalación industrial del Operador Económico Autorizado (OEA) adonde llega la mercancía.',
    77: 'Unidad en que se mide el plazo del tránsito.',
    78: 'Plazo para hacer el tránsito.',
    79: 'Fecha en que terminó la operación de tránsito.',
    80: 'Valor FOB total de la mercancía, en dólares.',
    81: 'Número total de páginas del documento.',
    82: 'Número de series: una por cada ítem de mercancía de la hoja 6.',
    83: 'Total de bultos de todas las unidades de carga (casilla 190).',
    84: 'Peso bruto total en kilogramos (casilla 196).',
    85: 'Número de unidades de carga (contenedores, furgones...) de la hoja 2.',
    86: 'Número de aceptación. Lo asigna la DIAN.',
    88: 'Número de autorización de la operación de tránsito. Lo asigna la DIAN después de revisar el documento.',
    90: 'Número del formato de colocación de precintos. Lo diligencia la DIAN.',
    94: 'Funcionario de la DIAN que actúa en la operación.',
    216: 'Valor CIF total, en dólares.',
    221: 'Usuario calificado de zona franca o bodega donde se entrega la mercancía.',
    98: 'Número consecutivo de la unidad de carga.',
    99: 'Número del manifiesto de carga (formato 1165). El sistema lo trae al consultar el manifiesto.',
    101: 'Tipo de documento de viaje (madre, hijo, directo), con su código.',
    102: 'Número del documento de transporte (formato 1166).',
    104: 'Número del documento de transporte que ampara el tránsito.',
    106: 'Tipo de medio de transporte (camión, tractocamión...), con su código.',
    107: 'Identificación del medio de transporte: la placa del vehículo.',
    108: 'Nacionalidad del medio de transporte.',
    109: 'Identificación del remolque, si lo hay.',
    111: 'Tipo de carga (contenerizada, suelta, a granel), con su código.',
    112: 'Tipo de unidad de carga (contenedor, furgón, estiba), con su código.',
    113: 'Número de identificación de la unidad de carga; por ejemplo, la sigla y el número del contenedor.',
    114: 'Tamaño de la unidad de carga.',
    118: 'Marca X si cambió el tipo de carga o la unidad de carga respecto del manifiesto.',
    119: 'Tipo de equipo.',
    120: 'Marca X si la unidad trae precintos de seguridad.',
    121: 'Marca X si los precintos son electrónicos.',
    122: 'Números de los precintos del usuario. Si no tiene, se escribe SIN.',
    126: 'Números de los precintos que coloca la DIAN.',
    190: 'Número de bultos de la unidad de carga.',
    196: 'Peso bruto de la unidad de carga, en kilogramos.',
    218: 'Marca X si la carga se moviliza por sus propios medios (por ejemplo, maquinaria rodante).',
    220: 'Marca X si la unidad de carga es funcional.',
    224: 'Marca X si la unidad de carga se puede precintar.',
    226: 'Marca X si es carga indivisible extrapesada o extradimensionada.',
    130: 'Marca X si el vehículo pertenece al declarante.',
    131: 'Tipo de documento del transportador.',
    132: 'NIT del transportador, que figura en la póliza. En MUISCA, al escribirlo el sistema trae los demás datos.',
    138: 'Razón social de la empresa transportadora.',
    143: 'Modo de transporte, con su código; el carretero es 3.',
    169: 'Ruta autorizada para el tránsito, con su código.',
    170: 'Descripción de la ruta: aduana de partida y aduana de destino.',
    171: 'Unidad en que se mide el plazo de la ruta.',
    172: 'Plazo de la ruta.',
    173: 'Aduanas por las que pasa la mercancía en la ruta, si las hay.',
    186: 'Número consecutivo del ítem de mercancía.',
    187: 'Subpartida arancelaria de la mercancía.',
    191: 'Clase de embalaje.',
    193: 'Indica si la mercancía trae marcas.',
    195: 'Descripción de las marcas y datos de manejo de la mercancía.',
    197: 'Cantidad en la unidad física.',
    198: 'Unidad física.',
    200: 'Descripción de la mercancía en español, según la factura comercial.',
    201: 'Documento de transporte al que corresponde el documento soporte.',
    202: 'Tipo de documento soporte, con su código: factura, garantía, documento de transporte, mandato...',
    203: 'Descripción del documento soporte, con su código.',
    204: 'Número del documento soporte.',
    205: 'Tipo de documento de quien lo expidió.',
    206: 'Número de identificación de quien lo expidió.',
    208: 'Nombre de quien expidió el documento.',
    209: 'Fecha de expedición.',
    210: 'Fecha de vencimiento. La factura comercial no lleva fecha de vencimiento.',
    211: 'Moneda del documento, con su código.',
    212: 'Monto del documento. En la factura, el valor en dólares sin fletes ni seguros.',
    192: 'País de origen de la mercancía.',
    1001: 'Apellidos y nombres de quien firma.',
    1003: 'Número de identificación de quien firma.',
    1005: 'Calidad en que firma: representante legal, agente de aduanas...',
    1006: 'Organización en cuyo nombre firma.',
  },
};
