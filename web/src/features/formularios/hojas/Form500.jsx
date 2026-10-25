import { useMemo } from 'react';
import { subpartidas } from '../../../data/subpartidas.js';
import { calcular500 } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import { Celda, Fila, Seccion, Hoja, Firmas, Calculado, Entrada, dosSiempre } from '../kit/campos.jsx';
import Casilla from '../kit/Casilla.jsx';
import { TablaItems, itemVacio } from '../kit/TablaItems.jsx';

// Códigos del Anexo 1 de la Resolución DIAN 46 de 2019 (los más usados en el curso)
const MODALIDADES = [['C100', 'C100 Ordinaria'], ['C150', 'C150 Franquicia del gravamen arancelario'], ['C160', 'C160 Franquicia total (tratados o convenios)'], ['S100', 'S100 Temporal de corto plazo'], ['C660', 'C660 Reimportación en el mismo estado']];
const TIPOS_DECLARACION = [['inicial', 'Inicial'], ['anticipada', 'Anticipada'], ['correccion', 'Corrección'], ['legalizacion', 'Legalización']];
const TIPOS_USUARIO = [['importador', 'Importador (actúa directamente)'], ['agencia', 'Agencia de aduanas']];
const FORMAS_PAGO = [['1', '1 – Pago en banco (recibo oficial)'], ['2', '2 – Pago electrónico (PSE)']];

function Form500() {
  const { valores: v } = useCampos();
  const r = calcular500(v);
  // Vistos buenos que exigen las subpartidas escritas en la tabla
  const vistos = useMemo(() => {
    const todos = new Set();
    v.items.forEach((it) => subpartidas.find((s) => s.codigo === it.subpartida)?.vistoBueno?.forEach((x) => todos.add(x)));
    return [...todos];
  }, [v.items]);

  return (
    <Hoja numero="500" titulo="Declaración de Importación">
      <div className="aviso">Simulador educativo de BonCloud: la distribución y numeración de casillas es aproximada y no tiene validez ante la DIAN. Pasa el cursor sobre el número de una casilla para ver qué se escribe en ella.</div>

      <Seccion>Importador</Seccion>
      <Fila>
        <Celda num="5" etiqueta="NIT" flex={2} nombre="imp_nit" inputMode="numeric" />
        <Celda num="6" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.imp_nit)} />
        <Celda num="7" etiqueta="Primer Apellido" flex={2} />
        <Celda num="8" etiqueta="Segundo Apellido" flex={2} />
        <Celda num="9" etiqueta="Primer Nombre" flex={2} />
        <Celda num="10" etiqueta="Otros Nombres" flex={2} />
      </Fila>
      <Fila>
        <Celda num="11" etiqueta="Razón Social" flex={4} nombre="imp_razon" />
        <Celda num="12" etiqueta="Cód. Dirección Seccional" nombre="imp_seccional" />
      </Fila>

      <Seccion>Declarante</Seccion>
      <Fila>
        <Celda num="24" etiqueta="NIT" flex={2} nombre="dec_nit" inputMode="numeric" />
        <Celda num="25" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.dec_nit)} />
        <Celda num="26" etiqueta="Razón Social" flex={5} nombre="dec_razon" />
        <Celda num="27" etiqueta="Tipo Usuario" nombre="dec_tipo" opciones={TIPOS_USUARIO} />
      </Fila>

      <Seccion>Proveedor / Exportador en el exterior</Seccion>
      <Fila>
        <Celda num="13" etiqueta="NIT / Identificación" flex={2} nombre="prov_nit" />
        <Celda num="14" etiqueta="Primer Apellido" flex={2} />
        <Celda num="15" etiqueta="Segundo Apellido" flex={2} />
        <Celda num="16" etiqueta="Primer Nombre" flex={2} />
        <Celda num="17" etiqueta="Otros Nombres" flex={2} />
      </Fila>
      <Fila>
        <Celda num="18" etiqueta="Razón Social" flex={4} nombre="prov_razon" />
        <Celda num="19" etiqueta="Cód. País" nombre="prov_pais" />
        <Celda num="20" etiqueta="Ciudad" flex={2} nombre="prov_ciudad" />
      </Fila>
      <Fila>
        <Celda num="21" etiqueta="Dirección" flex={4} />
        <Celda num="22" etiqueta="Teléfono" />
        <Celda num="23" etiqueta="Correo Electrónico" flex={2} />
      </Fila>

      <Seccion>Datos generales</Seccion>
      <Fila>
        <Celda num="30" etiqueta="Cód. Aduana" nombre="cod_aduana" />
        <Celda num="31" etiqueta="No. Declaración" flex={2} />
        <Celda num="32" etiqueta="Fecha" placeholder="AAAA-MM-DD" />
        <Celda num="33" etiqueta="Cód. Modalidad" nombre="modalidad" opciones={MODALIDADES} />
        <Celda num="34" etiqueta="Tasa de Cambio (TRM)" nombre="tasa_cambio" type="number" step="0.01" placeholder="Ej: 4100" />
      </Fila>
      <Fila>
        <Celda num="40" etiqueta="Cód. País Origen" nombre="pais_origen" />
        <Celda num="41" etiqueta="Cód. País Procedencia" nombre="pais_procedencia" />
        <Celda num="42" etiqueta="Modo Transporte" nombre="modo_transporte" />
        <Celda num="43" etiqueta="Manifiesto de Carga" flex={2} />
        <Celda num="44" etiqueta="Fecha Llegada" placeholder="AAAA-MM-DD" />
      </Fila>
      <Fila>
        <Celda num="28" etiqueta="Tipo Declaración" nombre="tipo_declaracion" opciones={TIPOS_DECLARACION} />
        <Celda num="29" etiqueta="Número Anterior" flex={2} />
        <Celda num="35" etiqueta="Cód. Depósito" />
        <Celda num="36" etiqueta="Cód. Lugar Ingreso" nombre="lugar_ingreso" />
        <Celda num="37" etiqueta="Cód. Dpto. Destino" />
        <Celda num="38" etiqueta="No. Bultos" nombre="bultos" type="number" />
        <Celda num="39" etiqueta="Peso Bruto Kgs" nombre="peso_bruto" type="number" step="0.01" />
      </Fila>

      <Seccion>Documentos soporte</Seccion>
      <Fila>
        <Celda etiqueta="Documento de transporte (B/L o guía) No." flex={2} nombre="doc_transporte" />
        <Celda etiqueta="Fecha doc. transporte" nombre="doc_transporte_fecha" type="date" />
        <Celda etiqueta="Factura comercial No." flex={2} nombre="factura_num" />
        <Celda etiqueta="Fecha factura" nombre="factura_fecha" type="date" />
      </Fila>
      <Fila>
        <Celda etiqueta="No. Declaración Andina del Valor (form. 560)" flex={2} nombre="dav_num" placeholder="Obligatoria si FOB ≥ USD 5.000" />
        <Celda etiqueta="Cód. acuerdo comercial (preferencia)" flex={2} nombre="cod_acuerdo" placeholder="Vacío si no hay preferencia" />
        <Celda etiqueta="Registro o licencia de importación (VUCE)" flex={2} nombre="registro_vuce" placeholder="Solo si la subpartida lo exige" />
      </Fila>
      {r.requiereDAV && (
        <div className="alerta" role="status">El valor FOB es de USD 5.000 o más: debes presentar la Declaración Andina del Valor (formulario 560) y escribir aquí su número.</div>
      )}

      <Seccion>Descripción de mercancías — subpartida arancelaria</Seccion>
      {vistos.length > 0 && (
        <div className="alerta" role="status"><strong>⚠ Vistos buenos requeridos:</strong> {vistos.join(' | ')}</div>
      )}
      <TablaItems
        lineas={r.lineas}
        placeholderSubpartida="Ej: 8413.60"
        columnas={[['45. Subpartida Arancel.', 95], ['46. Descripción Mercancía'], ['49. Cant.', 50], ['50. Unid.', 35], ['51. Peso Neto', 55], ['52. FOB Unit. USD', 70], ['53. FOB Total USD', 70]]}
        // Tarifas de referencia del catálogo; se confirman en el Arancel de Aduanas vigente
        onSubpartida={(sp) => ({ tasa_arancel: String(sp.arancel), tasa_iva: String(sp.iva) })}
      />

      <Seccion>Valor en aduana</Seccion>
      <Fila>
        <Celda num="65" etiqueta="Valor FOB (USD)">
          {r.fobDesdeItems ? <Calculado valor={dosSiempre(r.fob)} title="Suma de los ítems" /> : <Entrada nombre="v_fob" type="number" />}
        </Celda>
        <Celda num="66" etiqueta="Fletes (USD)" nombre="v_fletes" type="number" />
        <Celda num="67" etiqueta="Seguros (USD)" nombre="v_seguros" type="number" />
        <Celda num="68" etiqueta="Otros Gastos (USD)" nombre="v_otros" type="number" />
      </Fila>
      <Fila>
        <Celda num="69" etiqueta="Total Valor Aduana (USD)" valor={dosSiempre(r.aduanaUSD)} />
        <Celda num="70" etiqueta="Total Valor Aduana (COP)" valor={dosSiempre(r.aduanaCOP)} />
      </Fila>

      <Seccion>Autoliquidación de tributos aduaneros</Seccion>
      <table className="liquid-table">
        <tbody>
          <tr><th>Concepto</th><th>Base Gravable (COP)</th><th>% Tasa</th><th>Total a Pagar (COP)</th></tr>
          <tr>
            <td><strong>Arancel</strong> (Casillas 71-73)<br /><span>Base: valor en aduana en pesos</span></td>
            <td><Calculado valor={dosSiempre(r.aduanaCOP)} aria-label="Base del arancel" /></td>
            <td><Entrada nombre="tasa_arancel" type="number" aria-label="Tasa del arancel" /></td>
            <td><Calculado valor={dosSiempre(r.arancel)} aria-label="Arancel" /></td>
          </tr>
          <tr>
            <td><strong>IVA</strong> (Casillas 74-76)<br /><span>Base: valor en aduana + arancel (sin antidumping ni salvaguardia)</span></td>
            <td><Calculado valor={dosSiempre(r.baseIVA)} aria-label="Base del IVA" /></td>
            <td><Entrada nombre="tasa_iva" type="number" aria-label="Tasa del IVA" /></td>
            <td><Calculado valor={dosSiempre(r.iva)} aria-label="IVA" /></td>
          </tr>
          <tr>
            <td><strong>Salvaguardia</strong> (Casillas 77-79)</td>
            <td><Calculado valor={dosSiempre(r.aduanaCOP)} aria-label="Base de la salvaguardia" /></td>
            <td><Entrada nombre="tasa_salva" type="number" aria-label="Tasa de la salvaguardia" /></td>
            <td><Calculado valor={dosSiempre(r.salvaguardia)} aria-label="Salvaguardia" /></td>
          </tr>
          <tr>
            <td><strong>Derechos Antidumping</strong> (Casillas 80-82)</td>
            <td><Calculado valor={dosSiempre(r.aduanaCOP)} aria-label="Base del antidumping" /></td>
            <td><Entrada nombre="tasa_anti" type="number" aria-label="Tasa antidumping" /></td>
            <td><Calculado valor={dosSiempre(r.antidumping)} aria-label="Antidumping" /></td>
          </tr>
          <tr>
            <td><strong>Sanciones</strong> (Casilla 83)</td>
            <td colSpan={2} />
            <td><Entrada nombre="total_sancion" type="number" aria-label="Sanciones" /></td>
          </tr>
        </tbody>
      </table>

      <Fila className="total-pagar">
        <div className="cell" style={{ flex: 3 }}>
          <strong>TOTAL A PAGAR</strong>
          <small>Cada tributo se aproxima al múltiplo de mil más cercano</small>
        </div>
        <div className="cell" style={{ flex: 1 }}>
          <Casilla num="90" />
          <Calculado valor={dosSiempre(r.total)} aria-label="Total a pagar" />
        </div>
      </Fila>

      <Seccion>Pago</Seccion>
      <Fila>
        <Celda num="91" etiqueta="Cód. Banco Recaudador" />
        <Celda num="92" etiqueta="Forma de Pago" opciones={FORMAS_PAGO} />
        <Celda num="93" etiqueta="No. Recibo de Pago" flex={2} />
        <Celda num="94" etiqueta="Fecha de Pago" placeholder="AAAA-MM-DD" />
        <Celda num="95" etiqueta="Cód. Entidad Recaudadora" />
      </Fila>

      <Firmas firmas={[
        { texto: 'Declaro bajo la gravedad de juramento que los datos aquí consignados son correctos, no incluyen omisiones o falsedades.', firma: 'Firma del Declarante' },
        { texto: 'Espacio exclusivo para sello de entidad recaudadora.' },
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
    v_fob: '0', v_fletes: '0', v_seguros: '0', v_otros: '0',
    tasa_arancel: '0', tasa_iva: '19', tasa_salva: '0', tasa_anti: '0', total_sancion: '0',
  }),
  obligatorios: [['imp_nit', 'NIT del importador (casilla 5)'], ['imp_razon', 'Razón social del importador (casilla 11)']],
  // Caso de la Ruta de Aprendizaje: 500 bombas de engranajes desde Shanghái.
  // Los datos de la empresa son ficticios; los valores son los de las lecciones 5 y 6.
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el caso de la Ruta de Aprendizaje: valor en aduana USD 63.800 y $65.264.000 de tributos (arancel del 5% de ejemplo).',
    valores: () => ({
      imp_nit: '900123456', imp_razon: 'HidroColombia S.A.S. (empresa ficticia)', imp_seccional: '48',
      dec_nit: '900123456', dec_razon: 'HidroColombia S.A.S. (actúa directamente)', dec_tipo: 'importador',
      prov_razon: 'Zhejiang Hydraulic Co. (proveedor ficticio)', prov_pais: 'CN', prov_ciudad: 'Shanghái',
      cod_aduana: '48', modalidad: 'C100', tipo_declaracion: 'inicial', tasa_cambio: '4100',
      pais_origen: 'CN', pais_procedencia: 'CN', modo_transporte: 'Marítimo', lugar_ingreso: 'Cartagena', bultos: '1',
      doc_transporte: 'SHACTG-2026-0457', factura_num: 'ZH-2026-118', dav_num: '(número de la DAV presentada)',
      items: [
        { ...itemVacio(), subpartida: '8413.60.90.00', descripcion: 'Bombas de engranajes externos para aceite hidráulico, sin motor', cantidad: '500', fobUnitario: '120' },
        ...Array.from({ length: 4 }, itemVacio),
      ],
      v_fletes: '3500', v_seguros: '300', v_otros: '0', tasa_arancel: '5', tasa_iva: '19',
    }),
  },
  explicaciones: {
    1: 'Año en que se presenta la declaración.',
    4: 'Número del formulario. En los servicios informáticos de la DIAN lo asigna el sistema.',
    5: 'NIT del importador, tal como figura en su RUT (sin puntos ni DV).',
    6: 'Dígito de verificación del NIT. Se calcula solo con el algoritmo de módulo 11 de la DIAN.',
    11: 'Razón social del importador si es persona jurídica. Si es persona natural se usan las casillas 7 a 10.',
    12: 'Código de la dirección seccional de la DIAN que corresponde al domicilio del importador.',
    13: 'Identificación tributaria del proveedor en su país, si la tiene.',
    18: 'Nombre o razón social del proveedor o exportador en el exterior, igual que en la factura.',
    19: 'Código del país del proveedor (por ejemplo, CN para China).',
    24: 'NIT de quien firma la declaración: el mismo importador si actúa directamente, o la agencia de aduanas.',
    27: 'Indica si el declarante es el importador que actúa directamente o una agencia de aduanas con mandato.',
    28: 'Tipo de declaración: inicial, anticipada (antes de la llegada), de corrección o de legalización.',
    30: 'Código de la dirección seccional de aduanas donde se presenta la declaración. Cartagena es 48; en Bogotá, 91 (Aduanas de Bogotá) o 03 (Aeropuerto El Dorado), según la Resolución DIAN 000065 de 2021.',
    33: 'Modalidad de importación (Anexo 1 de la Resolución DIAN 46 de 2019). Para mercancía que queda en libre disposición después de pagar tributos es C100, importación ordinaria; las temporales empiezan por S (S100, corto plazo).',
    34: 'TRM vigente el último día hábil de la semana anterior a la presentación y aceptación de la declaración, no la del día.',
    35: 'Código del depósito o zona primaria donde está almacenada la mercancía.',
    36: 'Código del lugar por donde ingresó la mercancía (puerto o aeropuerto).',
    40: 'País donde se produjo la mercancía. Define si puede pedirse una preferencia por acuerdo comercial.',
    41: 'País desde donde se embarcó la mercancía hacia Colombia; puede ser distinto del de origen.',
    43: 'Número del manifiesto de carga que el transportador transmitió a la DIAN antes del arribo.',
    65: 'Valor FOB total en dólares. Se llena solo con la suma de los ítems.',
    66: 'Flete internacional hasta el puerto de importación en Colombia.',
    67: 'Prima del seguro internacional. Se declara el costo real de la póliza.',
    68: 'Otros ajustes de valoración que exige la Decisión 571 (por ejemplo, comisiones o regalías).',
    69: 'Valor en aduana en dólares: FOB + fletes + seguros + otros gastos. En la práctica es un valor CIF.',
    70: 'Valor en aduana en pesos: la casilla 69 multiplicada por la TRM de la casilla 34. Es la base del arancel.',
    90: 'Suma de los tributos liquidados y las sanciones. Se paga en bancos autorizados antes del levante.',
    91: 'Código del banco donde se paga la declaración.',
  },
};
