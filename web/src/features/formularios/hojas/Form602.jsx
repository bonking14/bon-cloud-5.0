import { useState } from 'react';
import { calcular602 } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import HojaOficial, { SelectorHojas } from '../kit/HojaOficial.jsx';
import { dolares, soloDigitos } from '../kit/formato.js';
import { saePrincipal, saeSoportes, saeSeries, saeDescripciones, CASILLAS_SI_NO, SERIES } from '../trazados/sae.js';

// Formulario 602, Solicitud de Autorización de Embarque y/o Registros Previos (SAE), con sus
// cuatro hojas. La SAE real se llena en línea en los servicios informáticos de la DIAN, que no
// publica la hoja en blanco: el trazado se arma en trazados/sae.js.
// Cada casilla se guarda como c<número>; si se repite en la hoja (registros, series), como
// c<número>_<registro>. El recuadro «Cód.» que acompaña a un nombre se guarda como c<número>_cod.
const HOJAS = [['1', 'Hoja principal'], ['2', 'Hoja 2 · Documentos soporte'], ['3', 'Hoja 3 · Series'], ['4', 'Hoja 4 · Descripciones']];
const TIPOS_DOCUMENTO = [['31', 'NIT'], ['13', 'Cédula de ciudadanía'], ['22', 'Cédula de extranjería'], ['41', 'Pasaporte'], ['43', 'Sin identificación del exterior']];
const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'].map((c) => [c, c]);
const MONEDAS = [['USD', 'Dólar de los Estados Unidos'], ['EUR', 'Euro']];
const SUGERENCIAS = { 20: TIPOS_DOCUMENTO, 25: TIPOS_DOCUMENTO, 33: TIPOS_DOCUMENTO, 73: TIPOS_DOCUMENTO, 1002: TIPOS_DOCUMENTO, 54: INCOTERMS, 56: MONEDAS };
// DV que se calcula con el número de identificación de otra casilla
const DV_DE = { 6: 18, 27: 26, 75: 74, 1004: 1003 };
// Las llena la DIAN
const RESERVADAS = [4, 95, 96, 97, 997];
const NUMERICAS = [18, 26, 74, 1003];
const CENTRADAS = [1, 2, 20, 25, 33, 73, 54, 56, 116, 177, 105, 142, 178, 179, 1002, 1005];
const MULTILINEA = [130, 180];
const FECHAS = [61, 110, 111];
// Nombre de cada registro repetido, para el rótulo accesible
const DE_REGISTRO = { 2: 'documento', 3: 'serie', 4: 'registro' };

const nombreDe = (num, i, varios) => (varios ? `c${num}_${i + 1}` : `c${num}`);

function Form602() {
  const { valores: v } = useCampos();
  const [hoja, setHoja] = useState('1');
  const r = calcular602(v, SERIES);
  // Totales de la hoja principal que salen de las series de la hoja 3
  const calculadas = {
    88: dolares(r.fob) || '0', 89: dolares(r.total) || '0',
    92: String(r.series), 93: r.bultos ? r.bultos.toLocaleString('es-CO') : '0', 94: r.peso ? r.peso.toLocaleString('es-CO') : '0',
  };

  // Un campo por cada casilla del trazado. En las hojas 2 a 4 las casillas se repiten por registro.
  const camposDe = (n, trazado) => {
    const campos = {};
    RESERVADAS.forEach((num) => { campos[num] = { omitir: true }; });
    Object.entries(trazado.cajas).forEach(([num, veces]) => {
      const numero = Number(num);
      if (RESERVADAS.includes(numero)) return;
      const rotulo = trazado.celdas[num].r;
      // En la hoja 3 las casillas 142 a 149 son filas de la tabla de sistemas especiales
      const tabla = numero >= 142 && numero <= 149;
      const varios = n !== '1' && ![20, 18, 6, 11].includes(numero);
      const partes = [];
      veces.forEach(({ caja, cod }, i) => {
        const sufijo = varios ? `, ${tabla ? 'fila' : DE_REGISTRO[n]} ${i + 1}` : '';
        const etiqueta = `${rotulo}${sufijo}`;
        const nombre = nombreDe(num, i, varios);
        let def = { nombre, caja, etiqueta };
        if (n !== '1' && !varios) def = { valor: numero === 6 ? digitoVerificacion(v.c18) : v[`c${num}`] ?? '', caja, etiqueta: `${rotulo} del exportador (hoja ${n})` };
        else if (DV_DE[num]) def = { valor: digitoVerificacion(v[`c${DV_DE[num]}`]), caja, etiqueta, centro: true };
        else if (n === '1' && calculadas[num] !== undefined) def = { valor: calculadas[num], caja, etiqueta, derecha: true };
        else if (CASILLAS_SI_NO.includes(numero)) def = { ...def, opciones: ['SI', 'NO'] };
        else {
          if (SUGERENCIAS[num]) def.sugerencias = SUGERENCIAS[num];
          if (NUMERICAS.includes(numero)) Object.assign(def, { inputMode: 'numeric', formato: soloDigitos });
          if (CENTRADAS.includes(numero)) def.centro = true;
          if (MULTILINEA.includes(numero)) def.multilinea = true;
          if (FECHAS.includes(numero)) def.placeholder = 'AAAA-MM-DD';
        }
        partes.push(def);
        if (cod) partes.push({ nombre: `${nombre.replace(/^c(\d+)/, 'c$1_cod')}`, caja: cod, etiqueta: `${rotulo}: código${sufijo}`, centro: true });
      });
      campos[num] = { partes };
    });
    return campos;
  };
  const campos1 = {
    ...camposDe('1', saePrincipal),
    1: { nombre: 'c1', caja: [52.8, 63.3, 38.4, 8.9], centro: true, max: 4, formato: soloDigitos, etiqueta: 'Año' },
    2: { nombre: 'c2', caja: [190.8, 63.3, 14.4, 8.9], centro: true, max: 2, etiqueta: 'Concepto' },
  };
  const conDatos = (desde, hasta) => Object.keys(v).some((k) => {
    const m = /^c(\d+)(_cod)?_\d+$/.exec(k);
    return m && Number(m[1]) >= desde && Number(m[1]) <= hasta && String(v[k] ?? '').trim();
  });
  const fobDistinto = v.c57 && v.c54 === 'FOB' && v.c56 === 'USD' && r.fob > 0 && Math.abs(parseFloat(v.c57) - r.fob) > 0.005;

  return (
    <>
      <SelectorHojas hojas={HOJAS} actual={hoja} onCambiar={setHoja} />
      <HojaOficial trazado={saePrincipal} numero="602" titulo="Solicitud de Autorización de Embarque" campos={campos1} oculta={hoja !== '1'}
        pie={(
          <div className="no-imprimir">
            {r.series === 0 && <p className="ho-nota">Los totales de las casillas 88, 89, 92, 93 y 94 se calculan con las series que llenes en la hoja 3.</p>}
            {fobDistinto && <p className="ho-alerta" role="alert">El valor de la factura (57) es {dolares(parseFloat(v.c57))} y las series suman {dolares(r.fob)} FOB (88). En una venta FOB en dólares deben coincidir.</p>}
          </div>
        )} />
      <HojaOficial trazado={saeSoportes} numero="602" titulo="Solicitud de Autorización de Embarque, hoja 2" campos={camposDe('2', saeSoportes)} oculta={hoja !== '2'} imprimir={conDatos(105, 115)} />
      <HojaOficial trazado={saeSeries} numero="602" titulo="Solicitud de Autorización de Embarque, hoja 3" campos={camposDe('3', saeSeries)} oculta={hoja !== '3'} imprimir={conDatos(116, 177)} />
      <HojaOficial trazado={saeDescripciones} numero="602" titulo="Solicitud de Autorización de Embarque, hoja 4" campos={camposDe('4', saeDescripciones)} oculta={hoja !== '4'} imprimir={conDatos(178, 180)} />
      <p className="ho-nota no-imprimir" style={{ width: 980, maxWidth: '100%', margin: '10px auto 0' }}>Simulador educativo de BonCloud, sin validez ante la DIAN. La SAE real no se llena en una hoja en blanco: se presenta en línea en los servicios informáticos de la DIAN, que asigna el número de formulario y el de aceptación. Las casillas y su numeración son las de la hoja que genera el sistema; la distribución es aproximada. Las casillas sombreadas en verde se calculan solas.</p>
    </>
  );
}

export default {
  id: '602',
  sigla: 'SAE',
  Componente: Form602,
  inicial: () => ({}),
  obligatorios: [
    ['c18', 'Número de identificación del exportador (casilla 18)'],
    ['c11', 'Razón social del exportador (casilla 11)'],
    ['c26', 'Número de identificación del declarante (casilla 26)'],
    ['c39', 'Razón social del destinatario (casilla 39)'],
    ['c48', 'Aduana de despacho (casilla 48)'],
    ['c54', 'Incoterm (casilla 54)'],
    ['c57', 'Valor de la factura (casilla 57)'],
    ['c69', 'País de destino final (casilla 69)'],
    ['c117_1', 'Subpartida de la primera serie (casilla 117, hoja 3)'],
    ['c128_1', 'Valor FOB de la primera serie (casilla 128, hoja 3)'],
  ],
  // Caso del módulo 2 de la Ruta: el café de Café del Caribe (datos ficticios)
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó la SAE del módulo 2: 18.000 kg de café tostado en grano, USD 162.000 FOB Cartagena, para un comprador en Hamburgo. Es un embarque único con datos definitivos. La serie está en la hoja 3 y la factura en la hoja 2.',
    valores: () => {
      const hoy = new Date();
      const anio = String(hoy.getFullYear());
      return {
        c1: anio, c2: '1',
        c20: '31', c18: '890900123', c11: 'Café del Caribe Exportadores S.A.S. (empresa ficticia)',
        c25: '31', c26: '890900123', c32: 'Café del Caribe Exportadores S.A.S. (actúa directamente)',
        c33: '43', c39: 'Kaffeehaus Handel GmbH (comprador ficticio)', c40: 'Speicherstadt 10 (dirección ficticia)', c41: 'Alemania', c41_cod: 'DE', c42: 'Hamburgo',
        c47: 'Exportación definitiva', c48: 'Cartagena', c48_cod: '48', c49: 'Bolívar',
        c50: 'Único', c51: 'Definitivos al embarque', c52: 'Compraventa a precio firme', c53: 'Específica',
        c54: 'FOB', c55: 'Cartagena', c56: 'USD', c57: '162000',
        c62: 'NO', c63: 'NO', c64: 'NO', c65: 'Transporte marítimo', c66: 'Contenerizada',
        c67: 'Cartagena', c67_cod: '48', c68: 'Terminal marítimo de Cartagena', c69: 'Alemania', c69_cod: 'DE', c70: 'Hamburgo',
        c80: 'Naviera del Atlántico S.A. (empresa ficticia)',
        c81: 'Lugar de embarque', c84: 'NO',
        c85: '0', c86: '0', c87: '0', c91: '162000',
        c1001: 'Pérez Gómez Ana María (persona ficticia)', c1002: '13', c1003: '1000000001', c1005: '01',
        // Hoja 2: la factura comercial
        c105_1: '1', c106_1: 'Factura comercial', c107_1: 'FE-0458 (ficticia)', c108_1: '890900123', c109_1: 'Café del Caribe Exportadores S.A.S.',
        c110_1: `${anio}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`, c112_1: 'Dólar de los Estados Unidos', c112_cod_1: 'USD', c113_1: '162000', c114_1: 'Kilogramo', c114_cod_1: 'KG', c115_1: '18000',
        // Hoja 3: la serie
        c177_1: '1', c116_1: '1', c117_1: '0901.21.10.00', c120_1: 'Kilogramo', c120_cod_1: 'KG', c121_1: '18000',
        c122_1: 'Kilogramo', c122_cod_1: 'KG', c123_1: '18000', c124_1: 'Sacos', c125_1: '720', c126_1: '18360', c127_1: '18000', c128_1: '162000',
        c129_1: 'CAFÉ DEL CARIBE · HAMBURG', c130_1: 'Café tostado en grano, sin descafeinar. 720 sacos de 25 kg.', c133_1: 'Colombia', c133_cod_1: 'CO',
      };
    },
  },
  explicaciones: {
    1: 'Año en que se presenta la solicitud.',
    2: 'Concepto de la solicitud. Lo propone el sistema.',
    4: 'Número único del formulario. Lo asigna la DIAN.',
    6: 'Dígito de verificación del NIT del exportador. Se calcula solo.',
    7: 'Primer apellido del exportador, si es persona natural.',
    11: 'Razón social del exportador, tal como figura en su RUT.',
    18: 'Número de identificación del exportador. Su RUT debe tener la calidad de exportador (código 22 en la casilla 54).',
    20: 'Código del tipo de documento del exportador; 31 es NIT.',
    24: 'Se marca cuando el exportador es una misión o un funcionario diplomático.',
    25: 'Código del tipo de documento del declarante.',
    26: 'Número de identificación del declarante: el mismo exportador si actúa directamente, o la agencia de aduanas.',
    27: 'Dígito de verificación del declarante. Se calcula solo.',
    32: 'Razón social del declarante.',
    33: 'Código del tipo de documento del destinatario. Para un comprador del exterior sin identificación colombiana se usa 43.',
    34: 'Número de identificación del destinatario, si tiene uno.',
    39: 'Razón social del destinatario: el comprador en el exterior.',
    40: 'Dirección del destinatario en el exterior.',
    41: 'País del destinatario, con su código.',
    42: 'Ciudad del destinatario.',
    43: 'Número de la solicitud anterior, cuando esta la corrige o la reemplaza.',
    44: 'Número de referencia interno del declarante para identificar la operación.',
    45: 'Número de la autorización global, cuando el embarque es una fracción de una autorización global.',
    46: 'Número del programa especial de exportación o del contrato de suministro de energía, si aplica.',
    47: 'Régimen aduanero de la exportación, con su código; por ejemplo, exportación definitiva.',
    48: 'Aduana donde se presenta la solicitud, con su código. La Dirección Seccional de Aduanas de Cartagena es 48.',
    49: 'Departamento de donde procede la mercancía, con su código.',
    50: 'Tipo de embarque: único, cuando toda la mercancía sale en un solo envío, o fraccionado.',
    51: 'Tipo de datos: definitivos al embarque, o provisionales cuando la cantidad o el precio se conocen después.',
    52: 'Naturaleza de la transacción; por ejemplo, compraventa a precio firme.',
    53: 'Tipo de solicitud: específica para un embarque, o global para varios embarques fraccionados.',
    54: 'Incoterm pactado en la venta. El café del caso se vendió FOB Cartagena.',
    55: 'Lugar de entrega convenido según el Incoterm.',
    56: 'Código de la moneda en que se negoció la venta; USD es el dólar de los Estados Unidos.',
    57: 'Valor total de la factura en la moneda de la transacción.',
    58: 'Tasa de cambio de la moneda de la transacción frente al dólar. Si se negoció en dólares no hace falta.',
    59: 'Forma de pago pactada con el comprador, con su código.',
    60: 'Número de pagos anticipados recibidos, si la venta se pagó por adelantado.',
    61: 'Fecha del primer pago anticipado.',
    62: 'Indica si la mercancía sale del país a la mano de un viajero.',
    63: 'Indica si la exportación corresponde a sistemas especiales de importación-exportación (Plan Vallejo). Si es SÍ, se llena la tabla de la hoja 3.',
    64: 'Indica si la mercancía sale por una aduana distinta de la de despacho, en tránsito hasta la aduana de salida.',
    65: 'Modo de transporte con el que la mercancía sale del país, con su código.',
    66: 'Tipo de carga: contenerizada, suelta, a granel, entre otras.',
    67: 'Aduana por donde la mercancía sale del país, con su código.',
    68: 'Lugar de embarque: el puerto, muelle o aeropuerto donde se carga la mercancía, con su código.',
    69: 'País de destino final de la mercancía, con su código.',
    70: 'Ciudad o lugar de destino final en el exterior.',
    71: 'Lugar de destino en Colombia, cuando la mercancía va a una zona franca o a un depósito en el país.',
    72: 'Depósito habilitado donde está o adonde va la mercancía, si aplica.',
    73: 'Código del tipo de documento del transportador.',
    74: 'Número de identificación del transportador.',
    75: 'Dígito de verificación del transportador. Se calcula solo.',
    80: 'Razón social del transportador que sacará la mercancía del país.',
    81: 'Lugar donde se hará la inspección, si la DIAN la ordena: en el lugar de embarque o en zona secundaria.',
    82: 'Número con el que la DIAN aprobó la inspección en zona secundaria (por ejemplo, en la planta del exportador).',
    83: 'Dirección donde están las mercancías.',
    84: 'El declarante puede pedir que la inspección sea física.',
    85: 'Fletes hasta el lugar de destino, en dólares. En una venta FOB van en cero.',
    86: 'Seguros, en dólares. En una venta FOB van en cero.',
    87: 'Otros gastos, en dólares.',
    88: 'Valor FOB total: la suma del valor FOB de todas las series (casilla 128 de la hoja 3). Se calcula solo.',
    89: 'Valor total de la exportación: FOB (88) más fletes (85), seguros (86) y otros gastos (87). Se calcula solo.',
    90: 'Valor agregado nacional, en dólares.',
    91: 'Valor que el exportador debe reintegrar por el mercado cambiario, en dólares.',
    92: 'Número de series de la solicitud. Hay una serie por cada subpartida o mercancía distinta. Se calcula solo.',
    93: 'Suma de los bultos de todas las series (casilla 125). Se calcula sola.',
    94: 'Suma del peso bruto de todas las series, en kilogramos (casilla 126). Se calcula sola.',
    95: 'Número de aceptación de la solicitud. Lo asigna la DIAN; desde su fecha corre el mes de vigencia para embarcar.',
    96: 'Fecha de aceptación. La pone la DIAN.',
    97: 'Número de radicación. Lo asigna la DIAN.',
    105: 'Serie a la que corresponde el documento soporte.',
    106: 'Tipo de documento soporte, con su código: factura comercial, visto bueno, mandato, certificado, entre otros.',
    107: 'Número del documento soporte.',
    108: 'NIT de quien expidió el documento.',
    109: 'Nombre de quien expidió el documento.',
    110: 'Fecha de expedición del documento.',
    111: 'Fecha de vencimiento del documento, si la tiene (por ejemplo, un visto bueno).',
    112: 'Moneda del documento, con su código.',
    113: 'Valor del documento.',
    114: 'Unidad comercial a la que se refiere el documento, con su código.',
    115: 'Cantidad amparada por el documento, en la unidad comercial.',
    116: 'Número consecutivo de la serie.',
    117: 'Subpartida arancelaria de la mercancía, a 10 dígitos.',
    118: 'Código complementario de la subpartida, si aplica.',
    119: 'Código suplementario de la subpartida, si aplica.',
    120: 'Unidad física que el arancel fija para la subpartida, con su código.',
    121: 'Cantidad en la unidad física.',
    122: 'Unidad comercial en que se vendió la mercancía, con su código.',
    123: 'Cantidad en la unidad comercial.',
    124: 'Clase de embalaje, con su código: sacos, cajas de cartón, estibas, entre otros.',
    125: 'Número de bultos de la serie.',
    126: 'Peso bruto de la serie, en kilogramos: la mercancía con su empaque.',
    127: 'Peso neto de la serie, en kilogramos: la mercancía sin empaque.',
    128: 'Valor FOB de la serie, en dólares.',
    129: 'Marcas con que están identificados los bultos.',
    130: 'Descripción de la mercancía: nombre comercial y características que permitan identificarla.',
    131: 'Unidad en que se mide el plazo, en las exportaciones temporales.',
    132: 'Plazo de la exportación temporal.',
    133: 'País de origen de la mercancía, con su código.',
    134: 'Código de la región o departamento de origen.',
    135: 'Preferencia arancelaria o acuerdo comercial que se invocará en destino, si aplica.',
    136: 'Aduana de la declaración precedente, cuando la mercancía viene de un régimen anterior (por ejemplo, una importación temporal).',
    137: 'Número de la declaración precedente.',
    138: 'Año de aceptación de la declaración precedente.',
    139: 'Código del régimen precedente.',
    140: 'Código de la modalidad precedente.',
    141: 'Número de la serie en la declaración precedente.',
    142: 'Serie a la que corresponde el registro de sistemas especiales.',
    143: 'Número del programa de sistemas especiales de importación-exportación.',
    144: 'Indica si la exportación es en desarrollo de un programa de reposición.',
    145: 'Número del cuadro insumo producto (CIP).',
    146: 'Número del producto dentro del cuadro insumo producto.',
    147: 'Cantidad de producto que se exporta con cargo al cuadro insumo producto.',
    148: 'Valor agregado nacional (VAN).',
    149: 'Valor de los insumos externos (VIE).',
    177: 'Grupo al que pertenece la serie.',
    178: 'Grupo de la serie cuya descripción continúa.',
    179: 'Serie cuya descripción continúa.',
    180: 'Continuación de la descripción de la mercancía, cuando no cabe en la casilla 130.',
    997: 'Fecha y hora de aceptación. Las pone la DIAN.',
    1001: 'Apellidos y nombres de quien firma la solicitud.',
    1002: 'Tipo de documento de quien firma.',
    1003: 'Número de identificación de quien firma.',
    1004: 'Dígito de verificación de quien firma. Se calcula solo.',
    1005: 'Código de la calidad en que firma: representante legal, apoderado, agente de aduanas, entre otros.',
    1006: 'Organización en cuyo nombre firma.',
  },
};
