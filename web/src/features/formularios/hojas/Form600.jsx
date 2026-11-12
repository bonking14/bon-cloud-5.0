import { useMemo, useState } from 'react';
import { subpartidas } from '../../../data/subpartidas.js';
import { calcular600 } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import HojaOficial, { SelectorHojas } from '../kit/HojaOficial.jsx';
import { recuadrosVacios } from '../kit/recuadros.js';
import { dolares, soloDigitos } from '../kit/formato.js';
import hoja1 from '../trazados/600-1.json';
import hoja2 from '../trazados/600-2.json';
import hoja3 from '../trazados/600-3.json';
import hoja4 from '../trazados/600-4.json';
import hoja5 from '../trazados/600-5.json';
import hoja6 from '../trazados/600-6.json';
import hoja7 from '../trazados/600-7.json';
import hoja8 from '../trazados/600-8.json';

// Formulario 600, Declaración de Exportación (DEX). Trazado y numeración del formulario
// oficial de la DIAN (Formulario_600_2026.pdf), con sus ocho hojas. Las hojas 1 y 2 tienen
// nombres de campo propios (los usa el caso de práctica); en las hojas 3 a 8 los campos se
// generan a partir de los recuadros vacíos del trazado.
const TIPOS_DOCUMENTO = [['13', 'Cédula de ciudadanía'], ['22', 'Cédula de extranjería'], ['31', 'NIT'], ['41', 'Pasaporte']];
const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'].map((t) => [t, t]);
const ALTO_FILA = 24;
const HOJAS = [
  ['1', 'Hoja 1 · Principal'], ['2', 'Hoja 2 · Subpartidas'], ['3', 'Hoja 3 · Transporte'], ['4', 'Hoja 4 · Documentos soporte'],
  ['5', 'Hoja 5 · Sistemas especiales'], ['6', 'Hoja 6 · Provisionales a definitivos'], ['7', 'Hoja 7 · Embarques fraccionados'], ['8', 'Hoja 8 · Continuación descripción'],
];
const CONTINUACION = [['3', hoja3, 'Detalles del transporte'], ['4', hoja4, 'Documentos soporte y vistos buenos'], ['5', hoja5, 'Sistemas especiales'],
  ['6', hoja6, 'Detalle provisionales a definitivos'], ['7', hoja7, 'Detalle embarques fraccionados'], ['8', hoja8, 'Continuación descripción subpartidas declaradas']];

// En este formulario el rótulo va arriba y el dato debajo, en filas de 24 puntos
function debajo(c, extra = {}, alto = ALTO_FILA) {
  const y = c.ly + 2;
  return { caja: [c.x + 1, y, c.w - 2, Math.max(c.y + alto - y - 1.2, 8)], ...extra };
}
// Recuadro «Cód.» a la derecha de una casilla, hasta x1
const codigo = (c, x1, nombre, etiqueta) => ({ casilla: undefined, nombre, etiqueta, centro: true, caja: [c.x + c.w + 1, c.y + 11.5, x1 - c.x - c.w - 2, 11] });
const marca = (x, y, etiqueta, nombre) => ({ nombre, etiqueta, caja: [x, y, 11, 11], centro: true, max: 1 });
const limpio = (t) => String(t || '').replace(/[.\s]/g, '');

function Form600() {
  const { valores: v, poner, ponerVarios } = useCampos();
  const [hoja, setHoja] = useState('1');
  const r = calcular600(v);
  // Hojas 3 a 8: un campo por cada recuadro vacío, debajo del bloque del exportador
  const recuadros = useMemo(() => Object.fromEntries(CONTINUACION.map(([n, t]) => [n, recuadrosVacios(t, { desdeY: 205, prefijo: `h${n}` })])), []);
  // Se imprimen las hojas 1 y 2 y las de continuación que tengan algún dato
  const conDatos = (n) => recuadros[n].some((c) => String(v[c.nombre] ?? '').trim());
  // El bloque del exportador se repite en todas las hojas con los datos de la hoja 1
  const exportador = (n) => ({
    20: { valor: v.exp_tipo_doc ?? '', centro: true, caja: [41, 168.5, 35, 10.5], etiqueta: `Tipo de documento del exportador (hoja ${n})` },
    18: { valor: v.exp_nit ?? '', caja: [79, 168, 149, 11], etiqueta: `NIT del exportador (hoja ${n})` },
    6: { valor: digitoVerificacion(v.exp_nit), caja: [229.5, 168, 17, 11], centro: true, etiqueta: `DV del exportador (hoja ${n})` },
    11: { valor: v.exp_razon ?? '', caja: [41, 191.5, 552, 11], etiqueta: `Razón social del exportador (hoja ${n})` },
  });
  const c1 = hoja1.celdas;
  const c2 = hoja2.celdas;

  const alCambiarSubpartida = (texto) => {
    const hallada = subpartidas.find((s) => limpio(s.codigo) === limpio(texto) && limpio(texto).length === 10);
    if (!hallada) { poner('s_subpartida', texto); return; }
    ponerVarios({ s_subpartida: hallada.codigo, s_descripcion: v.s_descripcion?.trim() ? v.s_descripcion : hallada.titulo });
  };

  // ── Hoja 1 ──
  const nombres1 = {
    20: { nombre: 'exp_tipo_doc', sugerencias: TIPOS_DOCUMENTO, centro: true },
    11: { nombre: 'exp_razon' },
    24: { nombre: 'dec_tipo_doc', sugerencias: TIPOS_DOCUMENTO, centro: true },
    31: { nombre: 'dec_razon' },
    32: { nombre: 'comp_tipo_doc', centro: true }, 33: { nombre: 'comp_documento' },
    38: { nombre: 'comp_razon' }, 39: { nombre: 'comp_domicilio' }, 40: { nombre: 'comp_ciudad' },
    41: { nombre: 'clase_dex' }, 43: { nombre: 'tipo_diligenciamiento' }, 44: { nombre: 'tipo_despacho' },
    49: { nombre: 'regimen' }, 50: { nombre: 'aduana_despacho' }, 51: { nombre: 'pais_tramite', centro: true },
    53: { nombre: 'tipo_datos' }, 54: { nombre: 'tipo_embarque' }, 55: { nombre: 'naturaleza', centro: true },
    56: { nombre: 'incoterm', sugerencias: INCOTERMS, centro: true }, 57: { nombre: 'lugar_entrega' },
    58: { nombre: 'moneda', centro: true }, 59: { nombre: 'valor_factura', derecha: true }, 60: { nombre: 'tasa_cambio', derecha: true },
    61: { nombre: 'forma_pago' }, 67: { nombre: 'modo_transporte' }, 68: { nombre: 'tipo_carga' },
    69: { nombre: 'aduana_salida' }, 70: { nombre: 'pais_destino' }, 71: { nombre: 'lugar_destino' },
    72: { nombre: 't_fob', inputMode: 'decimal', derecha: true }, 73: { nombre: 't_fletes', inputMode: 'decimal', derecha: true },
    74: { nombre: 't_seguros', inputMode: 'decimal', derecha: true }, 75: { nombre: 't_otros', inputMode: 'decimal', derecha: true },
    76: { valor: dolares(r.total), derecha: true }, 77: { nombre: 'valor_reintegrar', inputMode: 'decimal', derecha: true },
    78: { nombre: 'van', derecha: true }, 79: { nombre: 'total_series', centro: true }, 80: { nombre: 'total_bultos', derecha: true }, 81: { nombre: 'total_peso', derecha: true },
  };
  const campos1 = {
    1: { nombre: 'anio', caja: [55, 63, 41.5, 10.5], max: 4, centro: true, formato: soloDigitos, etiqueta: 'Año' },
    4: { omitir: true },
    18: { nombre: 'exp_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'NIT del exportador', caja: [79, 168, 149, 11] },
    6: { valor: digitoVerificacion(v.exp_nit), caja: [229.5, 168, 17, 11], centro: true, etiqueta: 'DV del exportador' },
    25: { nombre: 'dec_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'Número de identificación del declarante', caja: [78, 216.5, 127, 11] },
    26: { valor: digitoVerificacion(v.dec_nit), caja: [207, 216.5, 21.5, 11], centro: true, etiqueta: 'DV del declarante' },
    63: { nombre: 'fecha_pago', caja: [41, 456.5, 76, 11], etiqueta: 'Fecha del primer pago anticipado' },
    64: { partes: [marca(134.3, 456.3, 'Mercancía a la mano con el viajero: SI'), marca(171.3, 456.3, 'Mercancía a la mano con el viajero: NO')] },
    65: { partes: [marca(206.3, 456.3, 'Sistemas especiales: SI'), marca(243.3, 456.3, 'Sistemas especiales: NO')] },
    66: { partes: [marca(279.7, 456.3, 'Exportación en tránsito: SI'), marca(315.3, 456.3, 'Exportación en tránsito: NO')] },
    45: { nombre: 'tipo_correccion', caja: [191, 360.5, 119, 11], etiqueta: 'Tipo de corrección' },
  };
  Object.entries(c1).forEach(([num, c]) => {
    const n = Number(num);
    if (campos1[num]) return;
    // Actuación aduanera (82 a 90) y firma: los llena la DIAN o van con firma digital
    if (n >= 82) { campos1[num] = { omitir: true }; return; }
    const alto = n >= 79 && n <= 81 ? 23 : ALTO_FILA;
    campos1[num] = debajo(c, nombres1[num] || {}, alto);
  });
  campos1[61] = { ...campos1[61], caja: [334, 431.5, 141, 11] };
  const extras1 = [
    codigo(c1[41], 292, 'clase_dex_cod', 'Código de la clase de DEX'), codigo(c1[43], 594, 'tipo_dilig_cod', 'Código del tipo de diligenciamiento'),
    codigo(c1[44], 190, 'tipo_despacho_cod', 'Código del tipo de despacho'), { nombre: 'tipo_correccion_cod', etiqueta: 'Código del tipo de corrección', centro: true, caja: [312, 360.5, 21.5, 11] },
    codigo(c1[49], 237, 'regimen_cod', 'Código del régimen aduanero'), codigo(c1[50], 456, 'cod_aduana', 'Código de la aduana de despacho'),
    codigo(c1[53], 237, 'tipo_datos_cod', 'Código del tipo de datos'), codigo(c1[54], 349, 'tipo_embarque_cod', 'Código del tipo de embarque'),
    { nombre: 'forma_pago_cod', etiqueta: 'Código de la forma de pago', centro: true, caja: [477, 431.5, 24, 11] },
    codigo(c1[67], 466, 'modo_transporte_cod', 'Código del modo de transporte'), codigo(c1[68], 594, 'tipo_carga_cod', 'Código del tipo de carga'),
    codigo(c1[69], 218, 'aduana_salida_cod', 'Código de la aduana de salida'), codigo(c1[70], 382, 'pais_destino_cod', 'Código del país de destino final'),
  ];

  // ── Hoja 2: una serie (una subpartida) ──
  const nombres2 = {
    98: { nombre: 's_serie', centro: true }, 99: { nombre: 's_subpartida', lista: 'lista-subpartidas-600', alCambiar: alCambiarSubpartida, placeholder: '0000.00.00.00' },
    102: { nombre: 's_unidad_fisica' }, 103: { nombre: 's_cantidad_fisica', derecha: true }, 104: { nombre: 's_unidad_comercial' },
    105: { nombre: 's_cantidad_comercial', derecha: true }, 106: { nombre: 's_embalaje' }, 107: { nombre: 's_bultos', derecha: true },
    108: { nombre: 's_peso_bruto', derecha: true }, 109: { nombre: 's_peso_neto', derecha: true }, 110: { nombre: 's_fob', inputMode: 'decimal', derecha: true },
    115: { nombre: 's_pais_origen' }, 117: { nombre: 's_preferencia' },
  };
  const campos2 = {
    4: { omitir: true },
    ...exportador(2),
    7: { omitir: true }, 8: { omitir: true }, 9: { omitir: true }, 10: { omitir: true },
    111: { nombre: 's_marcas', multilinea: true, caja: [25, 277.5, 568, 22.5], etiqueta: 'Marcas' },
    112: { nombre: 's_descripcion', multilinea: true, caja: [25, 313.5, 568, 370], etiqueta: 'Descripción' },
  };
  // Recuadros de datos de la hoja 2: [casilla, x inicial, x final, nombre del recuadro «Cód.» que lo sigue, x final del código]
  const FILAS_2 = [
    [98, 24, 73], [99, 73, 176], [100, 176, 225], [101, 225, 273], [102, 273, 380, 's_unidad_fisica_cod', 409], [103, 409, 457], [104, 457, 569, 's_unidad_comercial_cod', 594],
    [105, 24, 73], [106, 73, 195.5, 's_embalaje_cod', 224], [107, 224, 273], [108, 273, 380], [109, 380, 486], [110, 486, 594],
    [113, 24, 177, 's_plazo_cod', 206], [114, 206, 250], [115, 250, 397, 's_pais_origen_cod', 425], [116, 425, 565, 's_region_cod', 594],
    [118, 24, 127, 's_aduana_prec_cod', 154], [119, 154, 250], [120, 250, 311], [121, 311, 410, 's_regimen_prec_cod', 440], [122, 440, 503], [123, 503, 594],
  ];
  const extras2 = [];
  FILAS_2.forEach(([num, x0, x1, nombreCod, xCod]) => {
    const c = c2[num];
    const y = c.y + 12.3;
    campos2[num] = { ...(nombres2[num] || {}), caja: [x0 + 1, y, x1 - x0 - 2, 10.8] };
    if (nombreCod) extras2.push({ nombre: nombreCod, etiqueta: `Código: ${c.r.replace(/\s*Cód\.?$/, '')}`, centro: true, caja: [x1 + 1, y, xCod - x1 - 2, 10.8] });
  });
  campos2[117] = { nombre: 's_preferencia', caja: [25, 721.3, 539, 10.8], etiqueta: 'Preferencia arancelaria' };
  extras2.push({ nombre: 's_preferencia_cod', etiqueta: 'Código de la preferencia arancelaria', centro: true, caja: [566, 721.3, 27, 10.8] });

  return (
    <>
      <SelectorHojas hojas={HOJAS} actual={hoja} onCambiar={setHoja} />
      <HojaOficial trazado={hoja1} numero="600" titulo="Declaración de Exportación" campos={campos1} extras={extras1} oculta={hoja !== '1'} />
      <HojaOficial trazado={hoja2} numero="600" titulo="Declaración de Exportación, hoja 2: subpartidas declaradas" campos={campos2} extras={extras2} oculta={hoja !== '2'} />
      {CONTINUACION.map(([n, trazado, nombre]) => (
        <HojaOficial key={n} trazado={trazado} numero="600" titulo={`Declaración de Exportación, hoja ${n}: ${nombre}`}
          campos={exportador(n)} extras={recuadros[n]} soloConfiguradas oculta={hoja !== n} imprimir={conDatos(n)} />
      ))}
      <p className="ho-nota no-imprimir" style={{ width: 980, margin: '10px auto 0' }}>Simulador educativo de BonCloud, sin validez ante la DIAN. Reproduce las ocho hojas del formulario 600 oficial; al imprimir salen las hojas 1 y 2 y las demás que tengan datos. La declaración real la generan los servicios informáticos de la DIAN después del embarque y se firma digitalmente (art. 363 del Decreto 1165 de 2019).</p>
      <datalist id="lista-subpartidas-600">
        {subpartidas.map((s) => <option key={s.codigo} value={s.codigo}>{s.titulo}</option>)}
      </datalist>
    </>
  );
}

export default {
  id: '600',
  sigla: 'DEX',
  Componente: Form600,
  inicial: () => ({}),
  obligatorios: [
    ['exp_nit', 'NIT del exportador (casilla 18)'],
    ['exp_razon', 'Razón social del exportador (casilla 11)'],
    ['pais_destino', 'País de destino final (casilla 70)'],
  ],
  // Caso del módulo 2 de la Ruta: café tostado de Cartagena a Hamburgo (datos ficticios)
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el caso del módulo 2: 18.000 kg de café tostado en grano × USD 9 = USD 162.000 FOB Cartagena, para un comprador en Hamburgo. Al ser FOB, fletes y seguros quedan en cero.',
    valores: () => ({
      anio: String(new Date().getFullYear()),
      exp_tipo_doc: '31', exp_nit: '890900123', exp_razon: 'Café del Caribe Exportadores S.A.S. (empresa ficticia)',
      dec_tipo_doc: '31', dec_nit: '890900123', dec_razon: 'Café del Caribe Exportadores S.A.S. (actúa directamente)',
      comp_razon: 'Kaffeehaus Handel GmbH (comprador ficticio)', comp_ciudad: 'Hamburgo',
      aduana_despacho: 'Cartagena', cod_aduana: '48', aduana_salida: 'Cartagena', aduana_salida_cod: '48',
      incoterm: 'FOB', lugar_entrega: 'Cartagena', moneda: 'USD', valor_factura: '162000',
      modo_transporte: 'Marítimo', pais_destino: 'Alemania', pais_destino_cod: 'DE',
      t_fob: '162000', t_fletes: '0', t_seguros: '0', t_otros: '0', valor_reintegrar: '162000',
      total_series: '1', total_bultos: '720', total_peso: '18360',
      s_serie: '1', s_subpartida: '0901.21.10.00', s_unidad_fisica: 'Kilogramo', s_unidad_fisica_cod: 'KG', s_cantidad_fisica: '18000',
      s_embalaje: 'Sacos', s_bultos: '720', s_peso_bruto: '18360', s_peso_neto: '18000', s_fob: '162000',
      s_descripcion: 'Café tostado en grano, sin descafeinar. 720 sacos de 25 kg.', s_pais_origen: 'Colombia', s_pais_origen_cod: 'CO',
    }),
  },
  explicaciones: {
    1: 'Año en que se presenta la declaración.',
    4: 'Número único del formulario, asignado por la DIAN.',
    6: 'Dígito de verificación del NIT. Se calcula solo.',
    11: 'Razón social del exportador, tal como figura en su RUT.',
    18: 'Número de identificación del exportador. Su RUT debe tener la calidad de exportador (código 22 en la casilla 54).',
    20: 'Código del tipo de documento del exportador; 31 es NIT.',
    25: 'Número de identificación del declarante: el exportador si actúa directamente o la agencia de aduanas.',
    31: 'Razón social del declarante.',
    38: 'Razón social del destinatario: el comprador en el exterior.',
    39: 'Domicilio del destinatario en el exterior.',
    41: 'Clase de declaración de exportación, con su código.',
    50: 'Aduana donde se tramita la exportación, con su código. La Dirección Seccional de Aduanas de Cartagena es 48.',
    56: 'Incoterm pactado en la venta. El café del caso se vendió FOB Cartagena.',
    57: 'Lugar de entrega convenido según el Incoterm.',
    58: 'Código de la moneda en que se pactó la venta.',
    59: 'Valor de la factura en la moneda de la transacción.',
    67: 'Modo de transporte con el que sale la mercancía, con su código.',
    69: 'Aduana por donde sale la mercancía del país, con su código.',
    70: 'País de destino final de la mercancía, con su código.',
    72: 'Valor total FOB en dólares: es el valor que se declara en la exportación (art. 363 del Decreto 1165 de 2019).',
    73: 'Fletes en dólares. Solo se escriben si la venta se pactó con un Incoterm que los incluye (CFR, CIF, CPT, CIP...).',
    74: 'Seguros en dólares, si la venta los incluye (por ejemplo CIF o CIP).',
    75: 'Otros gastos en dólares incluidos en la venta.',
    76: 'Valor total de las exportaciones: FOB (72) + fletes (73) + seguros (74) + otros gastos (75). Se calcula solo.',
    77: 'Valor en dólares que el exportador debe reintegrar, es decir, canalizar por el mercado cambiario.',
    79: 'Número de series de la declaración: una por cada subpartida declarada en la hoja 2.',
    80: 'Número total de bultos.',
    81: 'Peso bruto total en kilogramos, con empaques.',
    98: 'Número de la serie. Cada serie corresponde a una subpartida.',
    99: 'Subpartida arancelaria a 10 dígitos de la mercancía que se exporta.',
    103: 'Cantidad en la unidad física de la subpartida.',
    107: 'Número de bultos de esta serie.',
    108: 'Peso bruto de esta serie en kilogramos.',
    109: 'Peso neto de esta serie en kilogramos, sin empaques.',
    110: 'Valor FOB en dólares de esta serie.',
    112: 'Descripción de la mercancía de esta serie.',
    115: 'País de origen de la mercancía, con su código.',
    117: 'Acuerdo comercial con el que el comprador pedirá preferencia arancelaria en destino, si aplica.',
    // Hojas 3 a 8. El PDF oficial del 600 no trae instructivo: estas ayudas explican el rótulo
    // de cada casilla con base en el trámite de exportación del Decreto 1165 de 2019.
    124: 'Hoja 3, transporte. Tipo de documento del transportador que saca la mercancía del país; 31 es NIT.',
    125: 'Número de identificación del transportador.',
    126: 'Dígito de verificación del transportador.',
    127: 'Apellidos y nombres del transportador, si es persona natural.',
    131: 'Razón social de la empresa transportadora (naviera, aerolínea o transportador terrestre).',
    132: 'País de la bandera del medio de transporte, con su código.',
    133: 'Número del manifiesto de carga. Con su transmisión el transportador certifica el embarque (art. 362 del Decreto 1165 de 2019).',
    134: 'Fecha del manifiesto de carga.',
    135: 'Identificación del medio de transporte: nombre de la motonave, matrícula de la aeronave o placa del vehículo.',
    136: 'Lugar donde se embarca la mercancía, con su código.',
    137: 'Hoja 4, documentos soporte. Número de la serie (subpartida de la hoja 2) a la que corresponde el documento.',
    138: 'Código del tipo de documento soporte: factura, visto bueno, certificado, mandato, entre otros.',
    139: 'Descripción del documento soporte.',
    140: 'Número del documento soporte.',
    141: 'Número de identificación de quien expidió el documento; por ejemplo, la entidad que dio el visto bueno.',
    142: 'Dígito de verificación del emisor.',
    143: 'Nombre de quien expidió el documento.',
    144: 'Fecha de expedición del documento.',
    145: 'Fecha de vencimiento del documento, si la tiene. Un visto bueno vencido no sirve de soporte.',
    146: 'Moneda en que está expresado el documento.',
    147: 'Valor del documento, en esa moneda.',
    148: 'Unidad comercial que ampara el documento, con su código.',
    149: 'Cantidad, en unidades comerciales, que ampara el documento.',
    150: 'Hoja 5, sistemas especiales de importación-exportación (Plan Vallejo). Número de la serie a la que corresponde.',
    151: 'Número del programa de sistemas especiales con el que se importaron los insumos.',
    152: 'Indica si la exportación corresponde a un programa de reposición.',
    153: 'Número del cuadro insumo producto (CIP) que relaciona los insumos importados con el producto exportado.',
    154: 'Número del producto dentro del cuadro insumo producto.',
    155: 'Cantidad de producto que se exporta con cargo a ese cuadro insumo producto.',
    156: 'Valor agregado nacional (VAN) del producto, en dólares.',
    157: 'Valor de los insumos externos (VIE) incorporados al producto, en dólares.',
    158: 'Hoja 6, de datos provisionales a definitivos. Número de la declaración de exportación del embarque fraccionado.',
    159: 'Número de la serie de esa declaración.',
    160: 'Subpartida arancelaria de la serie.',
    163: 'Descripción de la mercancía.',
    165: 'Cantidad declarada, en unidades comerciales.',
    166: 'Cantidad que realmente se pagó, en unidades comerciales.',
    167: 'Valor FOB en dólares que realmente se pagó. Sirve para pasar de datos provisionales a definitivos.',
    168: 'Hoja 7, embarques fraccionados. Número total de embarques que se consolidan en esta declaración.',
    169: 'Número de la declaración de exportación de cada embarque fraccionado.',
    170: 'Fecha de esa declaración.',
    174: 'Peso bruto del embarque fraccionado, en kilogramos.',
    175: 'Número de bultos del embarque fraccionado.',
    171: 'Hoja 8, continuación de la descripción. Número del grupo de subpartidas.',
    172: 'Número de la serie cuya descripción continúa.',
    173: 'Continuación de la descripción de la mercancía que no cupo en la hoja 2.',
  },
};
