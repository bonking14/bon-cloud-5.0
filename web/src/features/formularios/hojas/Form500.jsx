import { useMemo } from 'react';
import { subpartidas } from '../../../data/subpartidas.js';
import { calcular500 } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import { Celda, Fila, Seccion, Hoja, Firmas, Calculado, Entrada, dosSiempre } from '../kit/campos.jsx';
import Casilla from '../kit/Casilla.jsx';
import { TablaItems, itemVacio } from '../kit/TablaItems.jsx';

// Numeración de casillas según la cartilla de instrucciones del formulario 500 de la DIAN.
// Códigos de modalidad: Anexo 1 de la Resolución DIAN 46 de 2019 (los más usados en el curso).
const MODALIDADES = [['C100', 'C100 Ordinaria'], ['C150', 'C150 Franquicia del gravamen arancelario'], ['C160', 'C160 Franquicia total (tratados o convenios)'], ['S100', 'S100 Temporal de corto plazo'], ['C660', 'C660 Reimportación en el mismo estado']];
const TIPOS_DECLARACION = [['1', '1 – Inicial'], ['2', '2 – Legalización'], ['3', '3 – Anticipada'], ['4', '4 – Corrección'], ['5', '5 – Modificación']];
const CLASES_IMPORTADOR = [['01', '01 – Empresa mixta'], ['02', '02 – Empresa privada'], ['03', '03 – Empresa o entidad pública']];
const TIPOS_USUARIO = [['23', '23 – Importador (actúa directamente)'], ['agencia', 'Agencia de aduanas (código de su RUT)']];

// Filas de la autoliquidación: [concepto, casillas tarifa/base/liquidado/a pagar, nombre de la tarifa, clave del resultado, nota]
const LIQUIDACION = [
  ['Arancel', [92, 93, 94, 95], 'tasa_arancel', 'arancel', 'Base: valor en aduana en pesos'],
  ['IVA', [97, 98, 99, 100], 'tasa_iva', 'iva', 'Base: valor en aduana + arancel (sin salvaguardia ni antidumping)'],
  ['Salvaguardia', [102, 103, 104, 105], 'tasa_salva', 'salvaguardia'],
  ['Derechos compensatorios', [107, 108, 109, 110], 'tasa_comp', 'compensatorios'],
  ['Derechos antidumping', [112, 113, 114, 115], 'tasa_anti', 'antidumping'],
];

function Form500() {
  const { valores: v } = useCampos();
  const r = calcular500(v);
  // Vistos buenos que exige la subpartida escrita en la tabla
  const vistos = useMemo(() => {
    const todos = new Set();
    v.items.forEach((it) => subpartidas.find((s) => s.codigo === it.subpartida)?.vistoBueno?.forEach((x) => todos.add(x)));
    return [...todos];
  }, [v.items]);
  const base = (clave) => (clave === 'iva' ? r.baseIVA : r.aduanaCOP);

  return (
    <Hoja numero="500" titulo="Declaración de Importación">
      <div className="aviso">Simulador educativo de BonCloud, sin validez ante la DIAN. Las casillas siguen la numeración de la cartilla del formulario 500; algunas se omiten para simplificar. Pasa el cursor sobre el número de una casilla para ver qué se escribe en ella.</div>

      <Seccion>Importador</Seccion>
      <Fila>
        <Celda num="5" etiqueta="NIT" flex={2} nombre="imp_nit" inputMode="numeric" />
        <Celda num="6" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.imp_nit)} />
        <Celda num="11" etiqueta="Apellidos y nombres o razón social" flex={5} nombre="imp_razon" />
        <Celda num="12" etiqueta="Cód. Dirección seccional" nombre="imp_seccional" />
      </Fila>
      <Fila>
        <Celda num="13" etiqueta="Dirección" flex={4} />
        <Celda num="15" etiqueta="Teléfono" flex={2} />
        <Celda num="16" etiqueta="Cód. Dpto." />
        <Celda num="17" etiqueta="Cód. Ciudad/Municipio" />
      </Fila>

      <Seccion>Declarante</Seccion>
      <Fila>
        <Celda num="24" etiqueta="NIT" flex={2} nombre="dec_nit" inputMode="numeric" />
        <Celda num="25" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.dec_nit)} />
        <Celda num="26" etiqueta="Razón social del declarante autorizado" flex={4} nombre="dec_razon" />
        <Celda num="27" etiqueta="Tipo de usuario" flex={2} nombre="dec_tipo" opciones={TIPOS_USUARIO} />
        <Celda num="28" etiqueta="Cód. Usuario" />
      </Fila>
      <Fila>
        <Celda num="29" etiqueta="No. documento de identificación" flex={2} />
        <Celda num="30" etiqueta="Apellidos y nombres de quien firma" flex={4} />
        <Celda num="31" etiqueta="Clase de importador" flex={2} nombre="clase_importador" opciones={CLASES_IMPORTADOR} />
      </Fila>

      <Seccion>Tipo de declaración</Seccion>
      <Fila>
        <Celda num="33" etiqueta="Tipo de declaración (código)" flex={2} nombre="tipo_declaracion" opciones={TIPOS_DECLARACION} />
        <Celda num="34" etiqueta="No. formulario anterior" flex={2} />
        <Celda num="35" etiqueta="Fecha" placeholder="AAAA-MM-DD" />
        <Celda num="36" etiqueta="Cód. Seccional anterior" />
      </Fila>

      <Seccion>Llegada de la mercancía</Seccion>
      <Fila>
        <Celda num="40" etiqueta="Cód. Lugar de ingreso" nombre="lugar_ingreso" />
        <Celda num="41" etiqueta="Cód. Depósito" />
        <Celda num="42" etiqueta="Manifiesto de carga" flex={2} />
        <Celda num="43" etiqueta="Fecha de llegada" placeholder="AAAA-MM-DD" />
        <Celda num="44" etiqueta="Documento de transporte" flex={2} nombre="doc_transporte" />
        <Celda num="45" etiqueta="Fecha" placeholder="AAAA-MM-DD" />
      </Fila>

      <Seccion>Exportador o proveedor en el exterior</Seccion>
      <Fila>
        <Celda num="46" etiqueta="Nombre o razón social" flex={4} nombre="prov_razon" />
        <Celda num="47" etiqueta="Ciudad" flex={2} nombre="prov_ciudad" />
        <Celda num="48" etiqueta="Cód. País" nombre="prov_pais" />
      </Fila>
      <Fila>
        <Celda num="49" etiqueta="Dirección" flex={3} />
        <Celda num="50" etiqueta="Correo electrónico" flex={2} />
        <Celda num="51" etiqueta="No. de factura" flex={2} nombre="factura_num" />
        <Celda num="52" etiqueta="Fecha factura" placeholder="AAAA-MM-DD" />
      </Fila>

      <Seccion>Transporte, tasa de cambio y mercancía</Seccion>
      <Fila>
        <Celda num="53" etiqueta="Cód. País procedencia" nombre="pais_procedencia" />
        <Celda num="54" etiqueta="Cód. Modo de transporte" nombre="modo_transporte" />
        <Celda num="55" etiqueta="Cód. Bandera" />
        <Celda num="56" etiqueta="Cód. Destino (dpto.)" />
        <Celda num="57" etiqueta="Empresa transportadora" flex={2} />
        <Celda num="58" etiqueta="Tasa de cambio $" nombre="tasa_cambio" type="number" step="0.01" placeholder="Ej: 4100" />
      </Fila>
      <Fila>
        <Celda num="59" etiqueta="Subpartida arancelaria" flex={2} valor={r.subpartida} placeholder="Se toma de los ítems" aria-label="Subpartida arancelaria" />
        <Celda num="62" etiqueta="Cód. Modalidad" flex={2} nombre="modalidad" opciones={MODALIDADES} />
        <Celda num="66" etiqueta="Cód. País origen" nombre="pais_origen" />
        <Celda num="67" etiqueta="Cód. Acuerdo" nombre="cod_acuerdo" placeholder="Vacío si no hay preferencia" />
        <Celda num="68" etiqueta="Forma de pago de la importación" />
        <Celda num="70" etiqueta="Cód. País de compra" />
      </Fila>
      <Fila>
        <Celda num="71" etiqueta="Peso bruto kgs." nombre="peso_bruto" type="number" step="0.01" />
        <Celda num="72" etiqueta="Peso neto kgs." type="number" step="0.01" />
        <Celda num="73" etiqueta="Cód. Embalaje" />
        <Celda num="74" etiqueta="No. Bultos" nombre="bultos" type="number" />
        <Celda num="76" etiqueta="Cód. Unidad física" />
        <Celda num="77" etiqueta="Cantidad" type="number" />
      </Fila>

      <Seccion>Valor en aduana (USD)</Seccion>
      <Fila>
        <Celda num="78" etiqueta="Valor FOB">
          {r.fobDesdeItems ? <Calculado valor={dosSiempre(r.fob)} title="Suma de los ítems" aria-label="Valor FOB" /> : <Entrada nombre="v_fob" type="number" aria-label="Valor FOB" />}
        </Celda>
        <Celda num="79" etiqueta="Valor fletes" nombre="v_fletes" type="number" />
        <Celda num="80" etiqueta="Valor seguros" nombre="v_seguros" type="number" />
        <Celda num="81" etiqueta="Valor otros gastos" nombre="v_otros" type="number" />
        <Celda num="82" etiqueta="Sumatoria fletes, seguros y otros" valor={dosSiempre(r.gastos)} />
        <Celda num="83" etiqueta="Ajuste valor" nombre="v_ajuste" type="number" placeholder="0" />
        <Celda num="84" etiqueta="Valor en aduana" className="cell-destacada" valor={dosSiempre(r.aduanaUSD)} aria-label="Valor en aduana USD" />
      </Fila>

      <Seccion>Registro o licencia de importación y documentos soporte</Seccion>
      <Fila>
        <Celda num="85" etiqueta="Cód. Registro o licencia" placeholder="R o L" />
        <Celda num="86" etiqueta="Número" flex={2} nombre="registro_vuce" placeholder="Solo si la subpartida lo exige" />
        <Celda num="88" etiqueta="Año" />
        <Celda etiqueta="No. Declaración Andina del Valor (form. 560)" flex={3} nombre="dav_num" placeholder="Obligatoria si FOB ≥ USD 5.000" />
      </Fila>
      {r.requiereDAV && (
        <div className="alerta" role="status">El valor FOB es de USD 5.000 o más: debes presentar la Declaración Andina del Valor (formulario 560) como documento soporte.</div>
      )}

      <Seccion>91. Descripción de las mercancías</Seccion>
      {r.variasSubpartidas && (
        <div className="alerta" role="alert">Hay ítems con subpartidas distintas. Cada declaración de importación ampara una sola subpartida arancelaria (casilla 59): presenta una declaración por cada subpartida.</div>
      )}
      {vistos.length > 0 && (
        <div className="alerta" role="status"><strong>⚠ Vistos buenos requeridos:</strong> {vistos.join(' | ')}</div>
      )}
      <TablaItems
        lineas={r.lineas}
        placeholderSubpartida="Ej: 8413.60"
        columnas={[['Subpartida', 95], ['Descripción (marca, referencia, serie)'], ['Cant.', 50], ['Unid.', 35], ['Peso neto', 55], ['FOB unit. USD', 70], ['FOB total USD', 70]]}
        // Tarifas de referencia del catálogo; se confirman en el Arancel de Aduanas vigente
        onSubpartida={(sp) => ({ tasa_arancel: String(sp.arancel), tasa_iva: String(sp.iva) })}
      />

      <Seccion>Liquidación de tributos aduaneros (pesos)</Seccion>
      <table className="liquid-table">
        <tbody>
          <tr><th>Concepto</th><th>% Tarifa</th><th>Base</th><th>Total liquidado</th><th>Total a pagar</th></tr>
          {LIQUIDACION.map(([concepto, [cTarifa, cBase, cLiq, cPagar], tarifa, clave, nota]) => (
            <tr key={clave}>
              <td><strong>{concepto}</strong>{nota && <><br /><span>{nota}</span></>}</td>
              <td><Casilla num={cTarifa} /><Entrada nombre={tarifa} type="number" aria-label={`Tarifa ${concepto}`} /></td>
              <td><Casilla num={cBase} /><Calculado valor={dosSiempre(base(clave))} aria-label={`Base ${concepto}`} /></td>
              <td><Casilla num={cLiq} /><Calculado valor={dosSiempre(r[clave])} aria-label={`Liquidado ${concepto}`} /></td>
              <td><Casilla num={cPagar} /><Calculado valor={dosSiempre(r[clave])} aria-label={`A pagar ${concepto}`} /></td>
            </tr>
          ))}
          <tr>
            <td><strong>Sanción</strong></td>
            <td colSpan={2} />
            <td><Casilla num={119} /><Entrada nombre="total_sancion" type="number" aria-label="Sanción" /></td>
            <td><Casilla num={120} /><Calculado valor={dosSiempre(r.sancion)} aria-label="A pagar Sanción" /></td>
          </tr>
        </tbody>
      </table>

      <Fila className="total-pagar">
        <div className="cell" style={{ flex: 3 }}>
          <strong>PAGO TOTAL $</strong>
          <small>Suma de los «total a pagar». Cada tributo se aproxima al múltiplo de mil más cercano.</small>
        </div>
        <div className="cell" style={{ flex: 1 }}>
          <Casilla num="980" />
          <Calculado valor={dosSiempre(r.total)} aria-label="Total a pagar" />
        </div>
      </Fila>

      <Seccion>Espacio reservado a la DIAN</Seccion>
      <Fila>
        <Celda num="132" etiqueta="No. Aceptación declaración">{null}</Celda>
        <Celda num="133" etiqueta="Fecha">{null}</Celda>
        <Celda num="134" etiqueta="Levante No.">{null}</Celda>
        <Celda num="135" etiqueta="Fecha">{null}</Celda>
      </Fila>

      <Firmas firmas={[
        { texto: 'Declaro bajo la gravedad de juramento que los datos aquí consignados son correctos, no incluyen omisiones o falsedades.', firma: 'Firma del Declarante' },
        { texto: '996-997. Espacio exclusivo para el adhesivo y el sello de la entidad recaudadora.' },
      ]} />
    </Hoja>
  );
}

export default {
  id: '500',
  sigla: 'DIAN',
  Componente: Form500,
  inicial: () => ({
    items: Array.from({ length: 5 }, itemVacio),
    v_fob: '0', v_fletes: '0', v_seguros: '0', v_otros: '0', v_ajuste: '0',
    tasa_arancel: '0', tasa_iva: '19', tasa_salva: '0', tasa_comp: '0', tasa_anti: '0', total_sancion: '0',
  }),
  obligatorios: [['imp_nit', 'NIT del importador (casilla 5)'], ['imp_razon', 'Nombre o razón social del importador (casilla 11)']],
  // Caso de la Ruta de Aprendizaje: 500 bombas de engranajes desde Shanghái.
  // Los datos de la empresa son ficticios; los valores son los de las lecciones 5 y 6.
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el caso de la Ruta de Aprendizaje: valor en aduana USD 63.800 (casilla 84) y $65.264.000 de tributos (arancel del 5% de ejemplo).',
    valores: () => ({
      imp_nit: '900123456', imp_razon: 'HidroColombia S.A.S. (empresa ficticia)', imp_seccional: '48',
      dec_nit: '900123456', dec_razon: 'HidroColombia S.A.S. (actúa directamente)', dec_tipo: '23', clase_importador: '02',
      prov_razon: 'Zhejiang Hydraulic Co. (proveedor ficticio)', prov_pais: 'CN', prov_ciudad: 'Shanghái',
      modalidad: 'C100', tipo_declaracion: '1', tasa_cambio: '4100',
      pais_origen: 'CN', pais_procedencia: 'CN', modo_transporte: 'Marítimo', lugar_ingreso: 'CTG', bultos: '1',
      doc_transporte: 'SHACTG-2026-0457', factura_num: 'ZH-2026-118', dav_num: '(número de la DAV presentada)',
      items: [
        { ...itemVacio(), subpartida: '8413.60.90.00', descripcion: 'Bombas de engranajes externos para aceite hidráulico, sin motor', cantidad: '500', fobUnitario: '120' },
        ...Array.from({ length: 4 }, itemVacio),
      ],
      v_fletes: '3500', v_seguros: '300', v_otros: '0', v_ajuste: '0', tasa_arancel: '5', tasa_iva: '19',
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
    16: 'Código DANE del departamento del domicilio del importador.',
    17: 'Código DANE de la ciudad o municipio del domicilio del importador.',
    24: 'NIT de quien presenta la declaración: el importador si actúa directamente, o la agencia de aduanas.',
    26: 'Nombre o razón social del declarante: la agencia de aduanas o el importador que actúa directamente.',
    27: 'Código de usuario aduanero del declarante registrado en la casilla 54 de su RUT (23 si es el importador).',
    31: 'Clase de importador: 01 empresa mixta, 02 empresa privada, 03 empresa o entidad pública.',
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
    59: 'Subpartida arancelaria a 10 dígitos. Cada declaración ampara una sola subpartida: si llegan mercancías de varias subpartidas, se presenta una declaración por cada una.',
    62: 'Modalidad de importación (Anexo 1 de la Resolución DIAN 46 de 2019). C100 es la importación ordinaria; las temporales empiezan por S (S100, corto plazo).',
    66: 'País donde se produjo la mercancía. Es obligatoria y define si puede pedirse una preferencia por acuerdo comercial.',
    67: 'Código del acuerdo comercial con el que se pide trato preferencial. Vacío si se paga el arancel general.',
    68: 'Código de la forma de pago de la mercancía al proveedor (no de los tributos).',
    71: 'Peso de la mercancía en kilogramos, con su empaque.',
    72: 'Peso de la mercancía en kilogramos, sin su empaque.',
    74: 'Número total de bultos que se declaran.',
    78: 'Valor FOB en dólares de la mercancía declarada. Se llena solo con la suma de los ítems.',
    79: 'Flete internacional en dólares hasta el lugar de importación en Colombia.',
    80: 'Seguro en dólares. Se declara la prima pagada según la póliza.',
    81: 'Otros gastos en dólares causados en el exterior y relacionados con la mercancía.',
    82: 'Suma de las casillas 79, 80 y 81. Se calcula sola.',
    83: 'Ajustes que se suman o restan al precio según las normas de valoración (por ejemplo, comisiones de venta o regalías). Si es una deducción, se escribe con signo menos.',
    84: 'Valor en aduana en dólares: FOB (78) + fletes, seguros y otros (82) + ajuste (83). Se calcula solo.',
    85: 'R si la importación requiere registro de importación, L si requiere licencia.',
    86: 'Número de aprobación del registro o licencia de importación (VUCE), si la subpartida lo exige.',
    92: 'Tarifa del arancel para la subpartida declarada.',
    93: 'Base del arancel: valor en aduana (84) convertido a pesos con la tasa de cambio (58).',
    94: 'Arancel liquidado: base (93) × tarifa (92), aproximado al múltiplo de mil más cercano.',
    97: 'Tarifa del IVA de la subpartida declarada.',
    98: 'Base del IVA: base del arancel (93) + arancel liquidado (94). Los derechos antidumping y la salvaguardia no se suman (Concepto DIAN 626 de 2020).',
    99: 'IVA liquidado: base (98) × tarifa (97), aproximado al múltiplo de mil más cercano.',
    104: 'Medida de salvaguardia, si la mercancía está sujeta a ella.',
    109: 'Derechos compensatorios, si la mercancía está sujeta a ellos.',
    114: 'Derechos antidumping, si la mercancía está sujeta a ellos.',
    119: 'Sanción liquidada, cuando corresponda según la normatividad vigente.',
    132: 'Número de aceptación que asigna el sistema informático aduanero.',
    134: 'Número de levante: autorización para disponer de la mercancía.',
    980: 'Pago total: suma de los «total a pagar» de arancel, IVA, salvaguardia, compensatorios, antidumping, sanción y rescate.',
  },
};
