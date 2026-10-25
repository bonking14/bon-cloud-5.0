import { calcular600 } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import { Celda, Fila, Seccion, Hoja, Firmas, Calculado, Entrada, dosSiempre } from '../kit/campos.jsx';
import { TablaItems, itemVacio } from '../kit/TablaItems.jsx';

const MODALIDADES = [['definitiva', 'Definitiva'], ['temporal', 'Temporal para reimportación en el mismo estado'], ['reexportacion', 'Reexportación'], ['muestras', 'Muestras sin valor comercial']];
const MONEDAS = ['USD', 'EUR', 'COP', 'GBP'];
const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

function Form600() {
  const { valores: v } = useCampos();
  const r = calcular600(v);

  return (
    <Hoja numero="600" titulo="Declaración de Exportación">
      <div className="aviso">Simulador educativo de BonCloud: la distribución y numeración de casillas es aproximada y no tiene validez ante la DIAN. En la exportación se declara el valor FOB; la exportación de bienes no paga arancel y está exenta de IVA.</div>

      <Seccion>Exportador</Seccion>
      <Fila>
        <Celda num="5" etiqueta="NIT" flex={2} nombre="exp_nit" inputMode="numeric" />
        <Celda num="6" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.exp_nit)} />
        <Celda num="7" etiqueta="Primer Apellido" flex={2} />
        <Celda num="8" etiqueta="Segundo Apellido" flex={2} />
        <Celda num="9" etiqueta="Primer Nombre" flex={2} />
        <Celda num="10" etiqueta="Otros Nombres" flex={2} />
      </Fila>
      <Fila>
        <Celda num="11" etiqueta="Razón Social" flex={4} nombre="exp_razon" />
        <Celda num="12" etiqueta="Cód. Dirección Seccional" />
      </Fila>

      <Seccion>Declarante</Seccion>
      <Fila>
        <Celda num="24" etiqueta="NIT" flex={2} nombre="dec_nit" inputMode="numeric" />
        <Celda num="25" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.dec_nit)} />
        <Celda num="26" etiqueta="Razón Social" flex={5} />
        <Celda num="27" etiqueta="Tipo Usuario" />
      </Fila>

      <Seccion>Datos generales de la exportación</Seccion>
      <Fila>
        <Celda num="30" etiqueta="Cód. Aduana" nombre="cod_aduana" />
        <Celda num="31" etiqueta="Año solicitud autorización embarque" placeholder="AAAA" />
        <Celda num="32" etiqueta="No. solicitud autorización embarque" flex={2} nombre="sae_num" />
        <Celda num="33" etiqueta="Fecha Modificación" placeholder="AAAA-MM-DD" />
      </Fila>
      <Fila>
        <Celda num="34" etiqueta="Modalidad Exportación" nombre="modalidad" opciones={MODALIDADES} />
        <Celda num="35" etiqueta="Clase Exportación" />
        <Celda num="36" etiqueta="Datos Anteriores" />
        <Celda num="37" etiqueta="Cód. Vía Transporte" nombre="via_transporte" />
        <Celda num="38" etiqueta="Cód. País Destino" nombre="pais_destino" />
      </Fila>
      <Fila>
        <Celda num="40" etiqueta="Datos del Documento de Transporte" flex={2} />
        <Celda num="41" etiqueta="Fecha Doc. Transporte" placeholder="AAAA-MM-DD" />
        <Celda num="42" etiqueta="Cód. Unidad Medida" />
        <Celda num="43" etiqueta="Cantidad Carga" type="number" />
      </Fila>

      <Seccion>Comprador o destinatario</Seccion>
      <Fila>
        <Celda num="13" etiqueta="NIT / Identificación" flex={2} nombre="comp_nit" />
        <Celda num="14" etiqueta="Primer Apellido" flex={2} />
        <Celda num="15" etiqueta="Segundo Apellido" flex={2} />
        <Celda num="16" etiqueta="Primer Nombre" flex={2} />
        <Celda num="17" etiqueta="Otros Nombres" flex={2} />
      </Fila>
      <Fila>
        <Celda num="18" etiqueta="Razón Social del Comprador" flex={4} nombre="comp_razon" />
        <Celda num="19" etiqueta="Cód. País" />
        <Celda num="20" etiqueta="Ciudad" flex={2} />
      </Fila>
      <Fila>
        <Celda num="21" etiqueta="Dirección del Comprador" flex={4} />
        <Celda num="22" etiqueta="Teléfono" />
        <Celda num="23" etiqueta="Correo Electrónico" flex={2} />
      </Fila>

      <Seccion>Factura comercial y condiciones</Seccion>
      <Fila>
        <Celda num="39" etiqueta="No. Factura Comercial" flex={2} nombre="factura_num" />
        <Celda num="39a" etiqueta="Fecha Factura" placeholder="AAAA-MM-DD" />
        <Celda num="39b" etiqueta="Cód. Moneda" nombre="moneda" opciones={MONEDAS} />
        <Celda num="39c" etiqueta="Incoterm" nombre="incoterm" opciones={INCOTERMS} />
      </Fila>

      <Seccion>Descripción de mercancías</Seccion>
      <TablaItems
        lineas={r.lineas}
        placeholderSubpartida="Ej: 0901.11"
        columnas={[['Subpartida Arancelaria', 80], ['Descripción de la Mercancía'], ['Cantidad', 55], ['Unidad', 40], ['Peso Neto (Kg)', 65], ['Valor FOB Unit. (USD)', 80], ['Valor FOB Total (USD)', 80]]}
      />

      <Seccion>Totales</Seccion>
      <Fila>
        <Celda num="44" etiqueta="Total Peso Bruto (Kgs)" type="number" step="0.01" />
        <Celda num="45" etiqueta="Total Peso Neto (Kgs)" type="number" step="0.01" />
        <Celda num="46" etiqueta="Total Series Carga" type="number" />
      </Fila>
      <Fila style={{ backgroundColor: '#fcfcfc' }}>
        <Celda num="47" etiqueta="Valor Total FOB (USD)">
          {r.fobDesdeItems ? <Calculado valor={dosSiempre(r.fob)} title="Suma de los ítems" /> : <Entrada nombre="t_fob" type="number" />}
        </Celda>
        <Celda num="48" etiqueta="Valor Fletes (USD)" nombre="t_fletes" type="number" />
        <Celda num="49" etiqueta="Valor Seguros (USD)" nombre="t_seguros" type="number" />
        <Celda num="50" etiqueta="Otros Gastos (USD)" nombre="t_otros" type="number" />
        <Celda num="51" etiqueta="Valor total según Incoterm (USD)" className="cell-destacada" valor={dosSiempre(r.valorIncoterm)} />
      </Fila>

      <Seccion style={{ marginTop: 10 }}>Datos de aceptación / certificado de embarque (exclusivo DIAN)</Seccion>
      <Fila>
        <Celda num="52" etiqueta="Fecha Aceptación DEX" style={{ height: 60 }}>{null}</Celda>
        <Celda num="53" etiqueta="Número de Aceptación DEX">{null}</Celda>
        <Celda num="54" etiqueta="Fecha Autorización de Embarque">{null}</Celda>
      </Fila>

      <Firmas firmas={[
        { texto: 'Declaro bajo la gravedad de juramento que los datos aquí consignados son correctos, no incluyen omisiones o falsedades y que el producto exportado cumple con todos los requisitos legales vigentes correspondientes.', firma: 'Firma del Declarante' },
        { texto: 'Espacio exclusivo para sello y firma del Funcionario Aduanero.' },
      ]} />
    </Hoja>
  );
}

export default {
  id: '600',
  sigla: 'DEX',
  Componente: Form600,
  inicial: () => ({ items: Array.from({ length: 5 }, itemVacio), t_fob: '0', t_fletes: '0', t_seguros: '0', t_otros: '0' }),
  obligatorios: [
    ['exp_nit', 'NIT del exportador (casilla 5)'],
    ['exp_razon', 'Razón social del exportador (casilla 11)'],
    ['pais_destino', 'País de destino (casilla 38)'],
    ['factura_num', 'No. factura comercial (casilla 39)'],
  ],
  // Ejemplo de exportación: un contenedor de café verde desde Cartagena (datos ficticios)
  caso: {
    boton: 'Llenar datos de ejemplo (DEX)',
    mensaje: 'Se cargó un ejemplo de exportación de café FOB Cartagena: 19.250 kg × USD 6,20 = USD 119.350 FOB. Al ser FOB, fletes y seguros quedan en cero.',
    valores: () => ({
      exp_nit: '890900123', exp_razon: 'Café del Caribe Exportadores S.A.S. (empresa ficticia)', dec_nit: '890900123',
      cod_aduana: '48', modalidad: 'definitiva', via_transporte: 'Marítimo', pais_destino: 'US',
      comp_razon: 'Coffee Importers Inc. (comprador ficticio)', factura_num: 'EXP-2026-9901', moneda: 'USD', incoterm: 'FOB',
      items: [
        { ...itemVacio(), subpartida: '0901.11.90.00', descripcion: 'Café verde excelso, sin tostar ni descafeinar, 275 sacos de 70 kg', cantidad: '19250', fobUnitario: '6.20' },
        ...Array.from({ length: 4 }, itemVacio),
      ],
      t_fletes: '0', t_seguros: '0',
    }),
  },
  explicaciones: {
    5: 'NIT del exportador, tal como figura en su RUT, que debe tener la calidad de exportador (código 22).',
    6: 'Dígito de verificación del NIT. Se calcula solo.',
    24: 'NIT del declarante: el exportador si actúa directamente o la agencia de aduanas.',
    30: 'Código de la dirección seccional de aduanas por donde sale la mercancía. Cartagena es 48.',
    32: 'Número de la solicitud de autorización de embarque. La DEX se presenta después del embarque, con base en ella.',
    34: 'Modalidad de exportación: definitiva, temporal para reimportación en el mismo estado, reexportación, muestras sin valor comercial, etc.',
    38: 'País de destino final de la mercancía.',
    39: 'Número de la factura comercial que ampara la venta.',
    47: 'Valor FOB total en dólares: es el valor que se declara en la exportación. Se llena solo con la suma de los ítems.',
    48: 'Flete internacional. Solo se escribe si la venta se pactó con un Incoterm que lo incluye (CFR, CIF, CPT, CIP...).',
    49: 'Seguro internacional, si la venta lo incluye (por ejemplo CIF o CIP).',
    51: 'Valor total de la venta según el Incoterm pactado: FOB + fletes + seguros + otros gastos. El valor FOB (casilla 47) es el que se declara.',
    53: 'Número de aceptación que asigna la DIAN a la declaración de exportación.',
  },
};
