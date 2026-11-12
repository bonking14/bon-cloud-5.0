import { useState } from 'react';
import { sumaCapital } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import HojaOficial, { SelectorHojas } from '../kit/HojaOficial.jsx';
import { soloDigitos } from '../kit/formato.js';
import { rutPrincipal, rutHoja2, rutHoja3, rutHoja4, rutHoja5, rutHoja6 } from '../trazados/rut.js';

// Formulario 001, Registro Único Tributario (RUT), con sus seis hojas. La DIAN no publica
// el RUT en blanco (se genera en MUISCA), así que el trazado se arma en trazados/rut.js con las
// casillas del Instructivo de calidad del RUT (IN-CAC-0237, versión 3, 2026).
const CONCEPTOS = [['01', 'Inscripción'], ['02', 'Actualización'], ['03', 'Actualización de oficio'], ['09', 'Solicitud de cancelación']];
const TIPOS_CONTRIBUYENTE = [['1', 'Persona jurídica y asimiladas'], ['2', 'Persona natural o sucesión ilíquida']];
const TIPOS_DOCUMENTO = [['13', 'Cédula de ciudadanía'], ['22', 'Cédula de extranjería'], ['31', 'NIT'], ['41', 'Pasaporte']];
const FORMAS = [['1', 'Directa'], ['2', 'Indirecta'], ['3', 'Directa e indirecta']];
const TIPOS_EXPORTACION = [['01', 'Bienes'], ['02', 'Servicios'], ['03', 'Bienes y servicios']];
const NOMBRE = (lista) => Object.fromEntries(lista);
const HOJAS = [['1', 'Hoja principal'], ['2', 'Hoja 2 · Organización y capital'], ['3', 'Hoja 3 · Representación'], ['4', 'Hoja 4 · Socios'], ['5', 'Hoja 5 · Revisor fiscal y contador'], ['6', 'Hoja 6 · Establecimientos']];
// Hojas de bloques repetidos: [hoja, trazado, nombre de cada bloque]
const DE_BLOQUES = [
  ['3', rutHoja3, (b) => `representante ${b + 1}`],
  ['4', rutHoja4, (b) => `socio ${b + 1}`],
  ['5', rutHoja5, (b) => ['revisor fiscal principal', 'revisor fiscal suplente', 'contador'][b]],
  ['6', rutHoja6, (b) => `establecimiento ${b + 1}`],
];
// Casillas cuyo DV se calcula con el número de identificación de la casilla anterior
const DV_DE = { 102: 101, 109: 108, 113: 112, 126: 125, 133: 132, 138: 137, 145: 144, 150: 149, 157: 156 };

// Varias cajas de una misma casilla (rejillas de códigos o columnas de una tabla)
const partes = (cajas, nombre, etiqueta, extra = {}) => ({
  partes: cajas.map((caja, i) => ({ nombre: `${nombre}_${i + 1}`, caja, etiqueta: `${etiqueta} ${i + 1}`, centro: true, ...extra })),
});

function Form001() {
  const { valores: v } = useCampos();
  const [hoja, setHoja] = useState('1');
  const capital = sumaCapital(v);
  const R1 = rutPrincipal.rejillas;
  const R2 = rutHoja2.rejillas;
  const identificacion = {
    4: { omitir: true },
    5: { nombre: 'nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'Número de Identificación Tributaria (NIT)' },
    6: { valor: digitoVerificacion(v.nit), centro: true, etiqueta: 'DV' },
    12: { nombre: 'seccional' },
    14: { nombre: 'buzon' },
  };

  const campos1 = {
    ...identificacion,
    2: { nombre: 'concepto', caja: [60.8, 63.3, 20.4, 8.9], centro: true, sugerencias: CONCEPTOS, etiqueta: 'Concepto' },
    24: { nombre: 'tipo_contribuyente', sugerencias: TIPOS_CONTRIBUYENTE },
    25: { nombre: 'tipo_doc', sugerencias: TIPOS_DOCUMENTO },
    26: { nombre: 'num_id' },
    27: { nombre: 'fecha_expedicion', placeholder: 'AAAA-MM-DD' },
    35: { nombre: 'razon_social' },
    36: { nombre: 'nombre_comercial' },
    38: { nombre: 'pais' }, 39: { nombre: 'departamento' }, 40: { nombre: 'ciudad' },
    41: { nombre: 'dir_principal' },
    42: { nombre: 'correo' },
    46: { nombre: 'act_principal', centro: true, etiqueta: 'Actividad principal: código' },
    47: { nombre: 'act_principal_fecha', placeholder: 'AAAA-MM-DD', etiqueta: 'Actividad principal: fecha inicio actividad' },
    48: { nombre: 'act_secundaria', centro: true, etiqueta: 'Actividad secundaria: código' },
    49: { nombre: 'act_secundaria_fecha', placeholder: 'AAAA-MM-DD', etiqueta: 'Actividad secundaria: fecha inicio actividad' },
    50: partes(R1[50], 'act_otra', 'Otras actividades: código'),
    51: { nombre: 'ocupacion', centro: true, etiqueta: 'Ocupación: código' },
    52: { nombre: 'establecimientos', centro: true },
    53: partes(R1[53], 'resp', 'Responsabilidad, calidad o atributo', { max: 2 }),
    54: partes(R1[54], 'adu', 'Obligado aduanero: código', { max: 2 }),
    55: { nombre: 'exp_forma', sugerencias: FORMAS, centro: true },
    56: { nombre: 'exp_tipo', sugerencias: TIPOS_EXPORTACION, centro: true },
    57: partes(R1[57], 'exp_modo', 'Servicio: modo'),
    58: partes(R1[58], 'exp_cpc', 'Servicio: CPC'),
    // Los llena la DIAN
    59: { omitir: true }, 60: { omitir: true }, 61: { omitir: true }, 984: { omitir: true }, 985: { omitir: true },
  };

  const columnas = (num, nombre, etiqueta) => ({
    partes: R2[num].map((caja, i) => ({ nombre: `${nombre}_${i + 1}`, caja, etiqueta: `${etiqueta}: ${i === 0 ? 'constitución' : 'reforma'}` })),
  });
  const campos2 = {
    4: { omitir: true },
    5: { valor: v.nit ?? '', etiqueta: 'NIT (hoja 2)' },
    6: { valor: digitoVerificacion(v.nit), centro: true, etiqueta: 'DV (hoja 2)' },
    12: { valor: v.seccional ?? '', etiqueta: 'Dirección seccional (hoja 2)' },
    14: { valor: v.buzon ?? '', etiqueta: 'Buzón electrónico (hoja 2)' },
    62: { nombre: 'naturaleza' }, 63: { nombre: 'forma_asociativa' },
    71: columnas(71, 'doc_clase', 'Clase'), 72: columnas(72, 'doc_numero', 'Número'), 73: columnas(73, 'doc_fecha', 'Fecha'),
    74: columnas(74, 'doc_notaria', 'Número de notaría'), 75: columnas(75, 'doc_entidad', 'Entidad de registro'),
    76: columnas(76, 'doc_fecha_registro', 'Fecha de registro'), 77: columnas(77, 'doc_matricula', 'No. Matrícula mercantil'),
    78: columnas(78, 'doc_departamento', 'Departamento'), 79: columnas(79, 'doc_ciudad', 'Ciudad/Municipio'),
    89: partes(R2[89], 'estado', 'Estado actual, ítem', { centro: false }),
    90: partes(R2[90], 'estado_fecha', 'Fecha cambio de estado, ítem'),
    91: partes(R2[91], 'estado_nit', 'NIT, ítem'),
    92: partes(R2[92], 'estado_dv', 'DV, ítem', { max: 1 }),
    95: { nombre: 'matriz_nit', inputMode: 'numeric', formato: soloDigitos, etiqueta: 'NIT de la matriz o controlante' },
    96: { valor: digitoVerificacion(v.matriz_nit), centro: true, etiqueta: 'DV de la matriz o controlante' },
  };
  [82, 83, 84, 85, 86, 87].forEach((n) => { campos2[n] = { nombre: `porc_${n}`, inputMode: 'decimal', centro: true }; });
  // ── Hojas 3 a 6: un campo por cada casilla de cada bloque ──
  const camposDe = (n, trazado, nombreBloque) => {
    const campos = { 4: { omitir: true }, 5: campos2[5], 6: campos2[6], 12: campos2[12], 14: campos2[14] };
    [5, 6, 12, 14].forEach((c) => { campos[c] = { ...campos[c], etiqueta: campos[c].etiqueta.replace('(hoja 2)', `(hoja ${n})`) }; });
    Object.entries(trazado.rejillas).forEach(([num, cajas]) => {
      const rotulo = trazado.celdas[num].r;
      // En la hoja 5 las tres personas usan casillas distintas: cada casilla tiene un solo bloque
      const bloque = (i) => (n === '5' ? Math.floor((Number(num) - 124) / 12) : i);
      campos[num] = {
        partes: cajas.map((caja, i) => {
          const nombre = `h${n}_${num}_${i + 1}`;
          // El número de casilla va en el nombre: en un mismo bloque hay dos «DV» y dos números de identificación
          const etiqueta = `${num}. ${rotulo}, ${nombreBloque(bloque(i))}`;
          const origen = DV_DE[num];
          return origen
            ? { valor: digitoVerificacion(v[`h${n}_${origen}_${i + 1}`]), caja, etiqueta, centro: true }
            : { nombre, caja, etiqueta };
        }),
      };
    });
    return campos;
  };
  const conDatos = (n) => Object.keys(v).some((k) => k.startsWith(`h${n}_`) && String(v[k] ?? '').trim());

  const hoja2ConDatos = ['naturaleza', 'forma_asociativa', 'porc_82', 'porc_85', 'doc_clase_1', 'doc_numero_1', 'estado_1', 'matriz_nit'].some((k) => String(v[k] ?? '').trim());

  return (
    <>
      <SelectorHojas hojas={HOJAS} actual={hoja} onCambiar={setHoja} />
      <HojaOficial trazado={rutPrincipal} numero="001" titulo="Formulario del Registro Único Tributario" campos={campos1} oculta={hoja !== '1'}
        pie={(
          <div className="no-imprimir">
            {(v.tipo_contribuyente || v.tipo_doc || v.concepto) && (
              <p className="ho-nota">
                {[v.concepto && `Concepto ${v.concepto}: ${NOMBRE(CONCEPTOS)[v.concepto] || 'código no reconocido'}`,
                  v.tipo_contribuyente && `Tipo de contribuyente ${v.tipo_contribuyente}: ${NOMBRE(TIPOS_CONTRIBUYENTE)[v.tipo_contribuyente] || 'código no reconocido'}`,
                  v.tipo_doc && `Tipo de documento ${v.tipo_doc}: ${NOMBRE(TIPOS_DOCUMENTO)[v.tipo_doc] || 'código no reconocido'}`].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        )} />
      <HojaOficial trazado={rutHoja2} numero="001" titulo="Formulario del Registro Único Tributario, hoja 2" campos={campos2} oculta={hoja !== '2'} imprimir={hoja2ConDatos}
        pie={capital.excede && <p className="ho-alerta no-imprimir" role="alert">El capital nacional (82) más el extranjero (85) suma {capital.total}%: no puede pasar del 100%.</p>} />
      {DE_BLOQUES.map(([n, trazado, nombreBloque]) => (
        <HojaOficial key={n} trazado={trazado} numero="001" titulo={`Formulario del Registro Único Tributario, hoja ${n}`} campos={camposDe(n, trazado, nombreBloque)} oculta={hoja !== n} imprimir={conDatos(n)} />
      ))}
      <p className="ho-nota no-imprimir" style={{ width: 980, margin: '10px auto 0' }}>Simulador educativo de BonCloud, sin validez ante la DIAN. El RUT real no se llena en un formulario en blanco: se inscribe y actualiza en línea en MUISCA, y la DIAN no publica su hoja vacía. Esta hoja se reconstruyó con las secciones, los números y los nombres de casilla del Instructivo de calidad del RUT de la DIAN (IN-CAC-0237, 2026), así que la posición exacta de las casillas puede diferir de la del documento que genera MUISCA. Al imprimir salen la hoja principal y las demás hojas que tengan datos.</p>
    </>
  );
}

export default {
  id: '001',
  sigla: 'RUT',
  Componente: Form001,
  inicial: () => ({}),
  obligatorios: [
    ['nit', 'NIT (casilla 5)'],
    ['tipo_contribuyente', 'Tipo de contribuyente (casilla 24)'],
    ['tipo_doc', 'Tipo de documento (casilla 25)'],
    ['num_id', 'Número de identificación (casilla 26)'],
    ['dir_principal', 'Dirección principal (casilla 41)'],
    ['act_principal', 'Actividad principal (casilla 46)'],
  ],
  // Caso de la Ruta de Aprendizaje: HidroColombia S.A.S. (datos ficticios)
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el RUT de HidroColombia, la empresa del caso: responsabilidad 10 (obligado aduanero) y, en la casilla 54, el código 23 (importador). El DV del NIT 900123456 es 8.',
    valores: () => ({
      concepto: '02', nit: '900123456', seccional: 'Impuestos y Aduanas de Cartagena',
      tipo_contribuyente: '1', tipo_doc: '31', num_id: '900123456',
      razon_social: 'HidroColombia S.A.S. (empresa ficticia)', nombre_comercial: 'HidroColombia',
      pais: 'Colombia', departamento: 'Bolívar', ciudad: 'Cartagena', dir_principal: 'Zona Industrial de Mamonal, Cartagena',
      act_principal: '4659', establecimientos: '1',
      resp_1: '05', resp_2: '10', resp_3: '42', resp_4: '48', resp_5: '52', adu_1: '23',
    }),
  },
  explicaciones: {
    2: 'Concepto del trámite: 01 inscripción, 02 actualización, 03 actualización de oficio, 09 solicitud de cancelación. En las actualizaciones de oficio lo pone el sistema.',
    4: 'Número del formulario. Lo asigna el sistema automáticamente.',
    5: 'Número de Identificación Tributaria. En una inscripción nueva lo asigna la DIAN.',
    6: 'Dígito de verificación del NIT, calculado con el algoritmo de módulo 11 de la DIAN.',
    12: 'Dirección Seccional. El sistema la asigna sola según la dirección, el municipio y el departamento de la sección Ubicación.',
    14: 'Buzón electrónico que la DIAN asigna al inscrito.',
    24: 'Tipo de contribuyente: 1 persona jurídica y asimiladas, 2 persona natural o sucesión ilíquida.',
    25: 'Tipo de documento de identificación; por ejemplo 13 cédula de ciudadanía o 31 NIT. Debe coincidir con el documento aportado.',
    26: 'Número del documento de identificación.',
    27: 'Fecha de expedición del documento de identificación.',
    28: 'País donde se expidió el documento de identificación.',
    31: 'Primer apellido, si es persona natural.',
    35: 'Razón social tal como figura en el certificado de existencia y representación legal.',
    36: 'Nombre comercial, si usa uno distinto de la razón social.',
    38: 'País del domicilio principal.',
    41: 'Dirección del domicilio principal.',
    42: 'Correo electrónico de contacto.',
    46: 'Código CIIU de la actividad económica principal.',
    47: 'Fecha en que empezó a desarrollar la actividad principal.',
    48: 'Código CIIU de la actividad económica secundaria.',
    50: 'Códigos CIIU de otras actividades económicas.',
    51: 'Código de la ocupación, para personas naturales.',
    52: 'Número de establecimientos de comercio, oficinas, sedes o locales.',
    53: 'Responsabilidades, calidades y atributos: un código por recuadro. Quien opera en comercio exterior debe tener la 10, obligado aduanero, además de las tributarias que le correspondan.',
    54: 'Calidad de usuario aduanero: un código por recuadro. Para importar se registra el 23 (importador) y para exportar el 22 (exportador).',
    55: 'Forma en que participa en la exportación: 1 directa, 2 indirecta, 3 directa e indirecta.',
    56: 'Tipo de exportación: 01 bienes, 02 servicios, 03 bienes y servicios.',
    57: 'Modo de prestación del servicio que se exporta.',
    58: 'Código CPC (Clasificación Central de Productos) del servicio que se exporta.',
    62: 'Naturaleza de la organización.',
    63: 'Forma asociativa de la persona jurídica.',
    71: 'Clase del documento de constitución y de la última reforma.',
    77: 'Número de la matrícula mercantil.',
    82: 'Porcentaje de capital nacional. Se reparte en público (83) y privado (84).',
    85: 'Porcentaje de capital extranjero. Se reparte en público (86) y privado (87).',
    88: 'Entidad que ejerce la vigilancia y el control.',
    89: 'Estado actual y beneficio de la organización.',
    90: 'Fecha del cambio de estado.',
    94: 'Nombre del grupo económico o empresarial al que pertenece.',
    95: 'NIT de la matriz o controlante.',
    97: 'Nombre o razón social de la matriz o controlante.',
    98: 'Tipo de representación: representante legal principal, suplente, apoderado, entre otros. Se registra según el certificado de existencia y representación legal.',
    99: 'Fecha desde la que ejerce la representación.',
    100: 'Tipo de documento de identificación del representante.',
    101: 'Número de identificación del representante.',
    102: 'Dígito de verificación. Se calcula solo.',
    103: 'Número de la tarjeta profesional, cuando la representación la exige.',
    108: 'NIT de la persona jurídica que actúa como representante legal, si es el caso.',
    110: 'Razón social de la persona jurídica que actúa como representante legal.',
    111: 'Tipo de documento del socio o miembro.',
    112: 'Número de identificación del socio o miembro.',
    114: 'Nacionalidad del socio o miembro.',
    119: 'Razón social, si el socio es una persona jurídica.',
    120: 'Valor del capital que aporta el socio.',
    121: 'Porcentaje de participación del socio, comunero, consorciado o miembro de unión temporal. No se llena para miembros de juntas directivas.',
    122: 'Fecha en que ingresó como socio o miembro.',
    123: 'Fecha de retiro, si ya no hace parte.',
    124: 'Tipo de documento del revisor fiscal principal.',
    127: 'Número de la tarjeta profesional del revisor fiscal principal.',
    132: 'NIT de la sociedad o firma de revisoría designada, si el revisor actúa por medio de una.',
    134: 'Nombre de la sociedad o firma designada.',
    135: 'Fecha de nombramiento del revisor fiscal principal.',
    136: 'Tipo de documento del revisor fiscal suplente.',
    139: 'Número de la tarjeta profesional del revisor fiscal suplente.',
    147: 'Fecha de nombramiento del revisor fiscal suplente.',
    148: 'Tipo de documento del contador.',
    151: 'Número de la tarjeta profesional del contador.',
    159: 'Fecha de nombramiento del contador.',
    160: 'Tipo de establecimiento: agencia, sucursal, oficina, sede, establecimiento de comercio, entre otros.',
    161: 'Código de la actividad económica que se desarrolla en el establecimiento.',
    162: 'Nombre del establecimiento.',
    165: 'Dirección del establecimiento.',
    166: 'Número de la matrícula mercantil del establecimiento.',
    167: 'Fecha de la matrícula mercantil.',
    169: 'Fecha de cierre del establecimiento, si ya no funciona.',
    170: 'Número de identificación tributaria otorgado en el exterior.',
    172: 'Número de identificación tributaria de la sociedad o persona natural del exterior con establecimiento permanente (EP).',
  },
};
