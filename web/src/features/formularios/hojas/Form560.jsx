import { calcularDAV } from '../../../lib/formularios.js';
import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import { Entrada, Selector, Calculado, dos } from '../kit/campos.jsx';
import Casilla from '../kit/Casilla.jsx';
import '../kit/formulario-560.css';

// Etiqueta de casilla al estilo del 560: "37. Condiciones de entrega"
const Cl = ({ num, children, inline }) => (
  <span className="cl" style={inline ? { display: 'inline' } : undefined}>
    <Casilla num={num} className="cl-num">{num}.</Casilla> {children}
  </span>
);

const ESTADOS = [['1', '1-Nuevo'], ['2', '2-Usado'], ['3', '3-Desarmado'], ['4', '4-Semiarmado'], ['5', '5-Siniestrado'], ['6', '6-Averiado'], ['7', '7-Reconstruido'], ['8', '8-Reacondicionado o reparado'], ['9', '9-Remanufacturado']];
const INCOTERMS = [['EXW', 'EXW – En Fábrica'], ['FCA', 'FCA – Franco Transportista'], ['FAS', 'FAS – Franco Costado Buque'], ['FOB', 'FOB – Franco a Bordo'], ['CFR', 'CFR – Coste y Flete'], ['CIF', 'CIF – Coste, Seguro y Flete'], ['CPT', 'CPT – Transporte Pagado hasta'], ['CIP', 'CIP – Transporte y Seguro Pagados'], ['DAP', 'DAP – Entregada en Lugar'], ['DPU', 'DPU – Entregada en Lugar Descargada'], ['DDP', 'DDP – Entregada Derechos Pagados']];
const NATURALEZA = [['11', '11 – Compraventa precio firme'], ['12', '12 – Compraventa precio revisable'], ['13', '13 – Uso exterior y posterior exp.'], ['14', '14 – Suministros gratuitos'], ['15', '15 – Reparación o transformación'], ['16', '16 – Sucursales'], ['17', '17 – Consignación'], ['18', '18 – Intercambio compensado'], ['19', '19 – Leasing'], ['20', '20 – Alquiler simple'], ['21', '21 – Sustitución devueltas'], ['22', '22 – Sustitución no devueltas'], ['28', '28 – Préstamo/Comodato'], ['29', '29 – Otras transacciones']];
const MONEDAS = ['USD', 'EUR', 'CNY', 'GBP'];

// Determinación del valor, en dos columnas. Cada lado: [etiqueta, casilla moneda distinta, casilla USD]
// o un total calculado { total, etiqueta, gris }.
const FILAS_VALOR = [
  [['Precio neto según factura', 93, 94], ['Gastos de transporte, manejo y entrega en el exterior hasta el lugar de embarque', 115, 116]],
  [['Pagos indirectos, descuentos retroactivos u otros', 95, 96], ['Gastos de transporte desde el lugar de embarque hasta el lugar de importación', 117, 118]],
  [{ total: 97, etiqueta: 'Precio pagado o por pagar' }, ['Gastos de carga, descarga y manipulación', 119, 120]],
  [['Comisiones, corretajes, excepto las comisiones de compra', 98, 99], ['Seguro', 121, 122]],
  [['Envases y embalajes', 100, 101], { total: 123, etiqueta: 'Total adiciones', gris: true }],
  [['Prestaciones en materias primas y otros', 102, 103], ['Gastos de entrega posteriores a la importación', 124, 125]],
  [['Prestaciones en herramientas, matrices, moldes, etc.', 104, 105], ['Gastos de construcción, armado, instalación, montaje, mantenimiento y asistencia técnica, realizados después de la importación.', 126, 127]],
  [['Prestaciones en insumos y otros', 106, 107], ['Derechos de aduana y otros impuestos', 128, 129]],
  [['Prestaciones en ingeniería, creación, planos, otros', 108, 109], ['Intereses', 130, 131]],
  [['Cánones y derechos de licencia (regalías)', 110, 111], ['Otros gastos', 132, 133]],
  [['Producto de la reventa, cesión o utilización posterior, que revierta al vendedor de manera directa o indirecta', 112, 113], { total: 134, etiqueta: 'Total deducciones', gris: true }],
];

function LadoValor({ lado, calculos }) {
  if (!Array.isArray(lado)) {
    return (
      <>
        <td className="v-label v-total"><b>{lado.etiqueta}</b></td>
        <td className={lado.gris ? 'gris' : undefined} />
        <td><Casilla num={lado.total} className="casilla-num" /><Calculado valor={dos(calculos[lado.total])} style={{ fontWeight: 700, width: 'calc(100% - 15px)' }} aria-label={lado.etiqueta} /></td>
      </>
    );
  }
  const [etiqueta, moneda, usd] = lado;
  return (
    <>
      <td className="v-label">{etiqueta} <Casilla num={moneda} className="casilla-num" style={{ float: 'right' }} /></td>
      <td><Entrada nombre={`v${moneda}`} type="number" placeholder="0.00" aria-label={`${etiqueta}, moneda distinta al dólar`} /></td>
      <td><Casilla num={usd} className="casilla-num" /><Entrada nombre={`v${usd}`} type="number" placeholder="0.00" style={{ width: 'calc(100% - 15px)' }} aria-label={`${etiqueta}, USD`} /></td>
    </>
  );
}

// Tablas de descripción de la mercancía (casillas 67 a 78) para las filas indicadas
function Descripcion({ filas }) {
  return (
    <>
      <tr>
        <td className="sec-label" rowSpan={2} style={{ width: 20 }}>Descripción de la mercancía</td>
        <td colSpan={8} style={{ padding: 0 }}>
          <table className="desc-table" style={{ borderStyle: 'hidden' }}>
            <thead>
              <tr>
                <th style={{ width: 20, textAlign: 'center' }}>Ítem</th>
                <th><Cl num="67">Nombre comercial</Cl></th>
                <th><Cl num="68">Marca comercial</Cl></th>
                <th style={{ width: 60 }}><Cl num="69">Tipo</Cl></th>
                <th style={{ width: 70 }}><Cl num="70">Clase</Cl></th>
                <th style={{ width: 60 }}><Cl num="71">Modelo</Cl></th>
              </tr>
            </thead>
            <tbody>
              {filas.map((i) => (
                <tr key={i}>
                  <td className="row-num">{i}</td>
                  {['nombre', 'marca', 'tipo', 'clase', 'modelo'].map((c) => <td key={c}><Entrada nombre={`a${i}_${c}`} aria-label={`${c}, ítem ${i}`} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td colSpan={8} style={{ padding: 0 }}>
          <table className="desc-table" style={{ borderStyle: 'hidden' }}>
            <thead>
              <tr>
                <th style={{ width: 20, textAlign: 'center' }}>Ítem</th>
                <th style={{ width: 80 }}><Cl num="72">Referencia</Cl></th>
                <th style={{ width: 50 }}><Cl num="73">Cód.<br />Estado</Cl></th>
                <th style={{ width: 50 }}><Cl num="74">Año<br />fabricación</Cl></th>
                <th><Cl num="75">Otras características</Cl></th>
                <th style={{ width: 50 }}><Cl num="76">Cantidad</Cl></th>
                <th style={{ width: 50 }}><Cl num="77">Unid.<br />Cial.</Cl></th>
                <th style={{ width: 80 }}><Cl num="78">Precio FOB<br />unitario USD</Cl></th>
              </tr>
            </thead>
            <tbody>
              {filas.map((i) => (
                <tr key={i}>
                  <td className="row-num">{i}</td>
                  <td><Entrada nombre={`b${i}_referencia`} aria-label={`Referencia, ítem ${i}`} /></td>
                  <td><Selector nombre={`b${i}_estado`} opciones={ESTADOS} style={{ fontSize: '0.4375rem', width: '100%' }} aria-label={`Estado, ítem ${i}`} /></td>
                  <td><Entrada nombre={`b${i}_anio`} placeholder="AAAA" aria-label={`Año de fabricación, ítem ${i}`} /></td>
                  <td><Entrada nombre={`b${i}_otras`} aria-label={`Otras características, ítem ${i}`} /></td>
                  <td><Entrada nombre={`b${i}_cantidad`} type="number" placeholder="0" aria-label={`Cantidad, ítem ${i}`} /></td>
                  <td><Entrada nombre={`b${i}_unidad`} placeholder="KG/UN" aria-label={`Unidad comercial, ítem ${i}`} /></td>
                  <td><Entrada nombre={`b${i}_precio`} type="number" placeholder="0.00" aria-label={`Precio FOB unitario, ítem ${i}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
}

const Cabecera = ({ children, numeroGrande }) => (
  <div className="hdr-dian">
    <div className="dian-brand">
      <div className="dian-logo-box">DIAN<span>®</span></div>
      <div className="dian-sub">POR UNA COLOMBIA MÁS HONESTA</div>
    </div>
    <div className="hdr-center">
      <div className="hdr-title">Declaración Andina del Valor</div>
      {children}
    </div>
    <div className="big-num" style={numeroGrande}>560</div>
  </div>
);

const MonedaCambio = ({ moneda, cambio, fecha, opciones, ultima }) => (
  <td style={{ width: ultima ? '34%' : '33%', border: 'none', borderRight: ultima ? 'none' : '1px solid #1a3a6b', padding: '1px 3px' }}>
    <Cl num={moneda}>Cód. Moneda</Cl>
    <Selector nombre={`f_mon${moneda}`} opciones={opciones} style={{ fontSize: '0.4688rem', width: 40, display: 'inline-block' }} aria-label={`Moneda (casilla ${moneda})`} />
    {' '}<Cl num={cambio} inline>Tipo de cambio</Cl>{' '}
    <Entrada nombre={`f_tc${cambio}`} type="number" placeholder="1.00" style={{ width: 55, display: 'inline-block' }} aria-label={`Tipo de cambio (casilla ${cambio})`} />
    {' '}<Cl num={fecha} inline>Fecha</Cl>{' '}
    <input type="date" style={{ width: 90, display: 'inline-block' }} aria-label={`Fecha (casilla ${fecha})`} />
  </td>
);

function Form560() {
  const { valores: v } = useCampos();
  const calculos = calcularDAV(v);

  return (
    <div className="form-560-wrapper">
      {/* ========== HOJA 1 ========== */}
      <div className="paper-wrap">
        <div className="paper">
          <Cabecera>
            <div style={{ display: 'flex', borderBottom: '1px solid #1a3a6b' }}>
              <div style={{ padding: '2px 4px', borderRight: '1px solid #1a3a6b' }}>
                <Cl num="1">Año</Cl>
                <input type="text" style={{ width: 50 }} placeholder="AAAA" aria-label="Año" />
              </div>
              <div style={{ padding: '2px 4px', flex: 1 }}>
                <Cl num="4">Número de formulario</Cl>
                <Entrada nombre="numform" placeholder="N° único DAV" aria-label="Número de formulario" />
              </div>
            </div>
            <div className="nota-lea">Lea cuidadosamente las instrucciones</div>
          </Cabecera>

          {/* IMPORTADOR */}
          <table className="form-560">
            <tbody>
              <tr>
                <td className="sec-label" rowSpan={2} style={{ width: 20 }}>Importador</td>
                <td colSpan={5}><Cl num="5">Número de Identificación Tributaria (NIT)</Cl><Entrada nombre="f_nit" placeholder="NIT sin puntos" inputMode="numeric" /></td>
                <td style={{ width: 30 }}><Cl num="6">DV.</Cl><Calculado className="small" valor={digitoVerificacion(v.f_nit)} placeholder="0" aria-label="DV" /></td>
                <td colSpan={2}><Cl num="7">Primer apellido</Cl><input type="text" /></td>
                <td colSpan={2}><Cl num="8">Segundo apellido</Cl><input type="text" /></td>
                <td colSpan={2}><Cl num="9">Primer nombre</Cl><input type="text" /></td>
                <td colSpan={2}><Cl num="10">Otros nombres</Cl><input type="text" /></td>
              </tr>
              <tr>
                <td colSpan={14}><Cl num="11">Razón social</Cl><Entrada nombre="f_razon" placeholder="Nombre empresa o persona jurídica" /></td>
              </tr>
            </tbody>
          </table>

          {/* DATOS GENERALES */}
          <table className="form-560">
            <tbody>
              <tr>
                <td className="sec-label" rowSpan={7} style={{ width: 20 }}>Datos generales</td>
                <td style={{ width: 80 }}><Cl num="24">Cód. Dirección seccional</Cl><Entrada nombre="f_dirsec" placeholder="Cód." /></td>
                <td colSpan={2}><Cl num="25">No. Declaración de importación</Cl><input type="text" placeholder="N° de la declaración de importación (form. 500)" /></td>
                <td colSpan={3}><Cl num="26">Fecha <small>(AAAA MM DD)</small></Cl><input type="date" /></td>
                <td colSpan={2}><Cl num="27">Tipo declaración de importación</Cl>
                  <Selector nombre="f_tipodec" vacio="Seleccionar..." opciones={[['1', '1 – Inicial'], ['2', '2 – Legalización'], ['3', '3 – Anticipada'], ['4', '4 – Corrección'], ['5', '5 – Modificación']]} />
                </td>
              </tr>
              <tr>
                <td><Cl num="28">Cód. Nivel comercial comprador</Cl><Selector opciones={[['1', '1 – Mayorista'], ['2', '2 – Minorista'], ['3', '3 – Usuario'], ['4', '4 – Otro']]} /></td>
                <td colSpan={7}><Cl num="29">Especifique (si cód. 28 = 4)</Cl><input type="text" /></td>
              </tr>
              <tr>
                <td><Cl num="30">Cód. Condición Vendedor</Cl><Selector opciones={[['1', '1 – Fabricante'], ['2', '2 – Distribuidor'], ['3', '3 – Otro']]} /></td>
                <td colSpan={2}><Cl num="31">Especifique Vendedor</Cl><input type="text" /></td>
                <td><Cl num="32">Resolución No.</Cl><input type="text" /></td>
                <td colSpan={4}><Cl num="33">Fecha <small>(AAAA MM DD)</small></Cl><input type="date" /></td>
              </tr>
              <tr>
                <td><Cl num="34">Cód. Tipo resolución</Cl><Selector opciones={[['1', '1 – Ajuste permanente'], ['2', '2 – Anticipada']]} /></td>
                <td><Cl num="35">Cód. Naturaleza transacción</Cl><Selector nombre="f_nattrans" opciones={NATURALEZA} /></td>
                <td><Cl num="36">Cód. Forma envío</Cl>
                  <Selector nombre="f_formaenv" opciones={[['1', '1 – Envío único / valor total'], ['2', '2 – Envío único / valor fraccionado'], ['3', '3 – Envío fraccionado / valor total'], ['4', '4 – Envío fraccionado / valor fraccionado']]} />
                </td>
                <td><Cl num="37">Condiciones de entrega</Cl><Selector nombre="f_incoterm" opciones={INCOTERMS} /></td>
                <td colSpan={2}><Cl num="38">Lugar</Cl><Entrada nombre="f_lugar38" placeholder="Ciudad/Puerto/Aeropuerto" /></td>
                <td><Cl num="39">Cód. País procedencia</Cl><Entrada nombre="f_paisprocedencia" placeholder="Ej: CO, US, CN" /></td>
              </tr>
              <tr>
                <td><Cl num="40">Factura No.</Cl><Entrada nombre="f_factura40" /></td>
                <td><Cl num="41">Fecha</Cl><input type="date" /></td>
                <td colSpan={2}><Cl num="42">Tipo contrato o documento</Cl>
                  <Selector vacio="Seleccionar..." opciones={['Compraventa', 'Alquiler simple, arrendamiento operativo', 'Leasing', 'Reversiones', 'Comisión de compra', 'Comisión de venta/Corretaje', 'Cánones y derechos de licencia', 'Consignación', 'Otro contrato o documento']} />
                </td>
                <td colSpan={2}><Cl num="43">Número contrato u otro documento</Cl><input type="text" /></td>
                <td><Cl num="44">Fecha</Cl><input type="date" /></td>
                <td><Cl num="45">Valor contrato</Cl><input type="number" placeholder="0.00" /></td>
              </tr>
              <tr>
                <td colSpan={8}><Cl num="46">Valor FOB total (moneda negociación)</Cl><Entrada nombre="f_fob46" type="number" placeholder="0.00" style={{ width: 120 }} /></td>
              </tr>
              <tr>
                <td colSpan={9} style={{ padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.5rem' }}>
                    <tbody>
                      <tr>
                        <MonedaCambio moneda={47} cambio={48} fecha={49} opciones={[...MONEDAS, 'COP']} />
                        <MonedaCambio moneda={50} cambio={51} fecha={52} opciones={MONEDAS} />
                        <MonedaCambio moneda={53} cambio={54} fecha={55} opciones={MONEDAS} ultima />
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* INTERMEDIACIÓN */}
          <table className="form-560">
            <tbody>
              <tr>
                <td className="sec-label" rowSpan={2} style={{ width: 20 }}>Intermediación</td>
                <td style={{ width: 60 }}><Cl num="56">Existe intermediación?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td style={{ width: 80 }}><Cl num="57">Cód. Tipo intermediario</Cl><Selector opciones={[['1', '1 – Agente venta'], ['2', '2 – Agente compra'], ['3', '3 – Broker'], ['4', '4 – Otros']]} /></td>
                <td colSpan={2}><Cl num="58">Especifique (si cód. 57 = 4)</Cl><input type="text" /></td>
                <td><Cl num="59">Primer apellido</Cl><input type="text" /></td>
                <td><Cl num="60">Segundo apellido</Cl><input type="text" /></td>
                <td><Cl num="61">Primer nombre</Cl><input type="text" /></td>
                <td><Cl num="62">Otros nombres</Cl><input type="text" /></td>
              </tr>
              <tr>
                <td colSpan={4}><Cl num="63">Razón social</Cl><input type="text" /></td>
                <td colSpan={2}><Cl num="64">Dirección</Cl><input type="text" /></td>
                <td><Cl num="65">Ciudad</Cl><input type="text" /></td>
                <td><Cl num="66">Cód. País</Cl><input type="text" className="small" /></td>
              </tr>
            </tbody>
          </table>

          {/* DESCRIPCIÓN DE LA MERCANCÍA */}
          <table className="form-560">
            <tbody>
              <Descripcion filas={[1, 2, 3]} />
            </tbody>
          </table>

          {/* REQUISITOS */}
          <table className="form-560">
            <tbody>
              <tr>
                <td className="sec-label" rowSpan={2} style={{ width: 20 }}>Requisitos</td>
                <td style={{ width: 70 }}><Cl num="79">Existen<br />restricciones?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td><Cl num="80">Cód. Tipo<br />restricción</Cl>
                  <Selector style={{ fontSize: '0.4688rem' }} opciones={[['01', '01 – Impuestas por ley'], ['02', '02 – Limitan territorio reventa'], ['03', '03 – No afectan valor'], ['04', '04 – Otro tipo']]} />
                </td>
                <td><Cl num="81">Existen condiciones o<br />contraprestaciones?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td><Cl num="82">Cód. Tipo condición<br />o contraprestación</Cl>
                  <Selector style={{ fontSize: '0.4688rem' }} opciones={[['01', '01 – Precio depende otras mercancías'], ['02', '02 – Precio depende venta otras mercs.'], ['03', '03 – Precio depende forma pago ajena'], ['04', '04 – Descuentos por cantidades/pago'], ['05', '05 – Venta depende comercialización'], ['06', '06 – Pagos indirectos beneficio vendedor'], ['07', '07 – Prestaciones para producción'], ['08', '08 – Pagos por derechos PI'], ['09', '09 – Otra condición']]} />
                </td>
                <td colSpan={2}><Cl num="83">Especifique (si cód. 82 = 09)</Cl><input type="text" /></td>
                <td><Cl num="84">Puede<br />determinarse?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td><Cl num="85">Existen cánones y<br />derechos de licencia?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
              </tr>
              <tr>
                <td colSpan={2}><Cl num="86">Existen reversiones al<br />vendedor?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td><Cl num="87">Existe vinculación entre<br />comprador y vendedor?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td><Cl num="88">Cód. Tipo<br />vinculación</Cl>
                  <Selector style={{ fontSize: '0.4688rem' }} opciones={[['1', '1 – Cargos dirección'], ['2', '2 – Asociadas en negocios'], ['3', '3 – Empleador-empleado'], ['4', '4 – ≥5% acciones'], ['5', '5 – Control directo/indirecto'], ['6', '6 – Controladas por tercero'], ['7', '7 – Controlan a tercero'], ['8', '8 – Familia']]} />
                </td>
                <td><Cl num="89">Influye la vinculación<br />en el precio?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td><Cl num="90">Existen<br />valores criterio?</Cl><input type="text" className="yn" placeholder="S/N" /></td>
                <td><Cl num="91">Declaración de importación No.</Cl><input type="text" /></td>
                <td><Cl num="92">Fecha</Cl><input type="date" /></td>
              </tr>
            </tbody>
          </table>

          {/* DETERMINACIÓN DEL VALOR */}
          <table className="form-560">
            <tbody>
              <tr>
                <td className="sec-label" style={{ width: 20 }}>Determinación del valor en aduana</td>
                <td colSpan={6} style={{ padding: 0 }}>
                  <table className="valor-table" style={{ tableLayout: 'fixed' }}>
                    {/* Anchos fijos: con anchos automáticos las etiquetas largas comprimían la columna USD derecha */}
                    <colgroup>
                      {[0, 1].map((k) => [<col key={`a${k}`} style={{ width: '28%' }} />, <col key={`b${k}`} style={{ width: '10%' }} />, <col key={`c${k}`} style={{ width: '12%' }} />])}
                    </colgroup>
                    <thead>
                      <tr>
                        {[0, 1].map((k) => [
                          <td key={`a${k}`} style={{ fontSize: '0.5rem', fontWeight: 700, padding: 3, textAlign: 'center' }}>Determinación del valor</td>,
                          <td key={`b${k}`} className="v-col-head">Valor moneda de<br />facturación distinta<br />al dólar</td>,
                          <td key={`c${k}`} className="v-col-head">USD</td>,
                        ])}
                      </tr>
                    </thead>
                    <tbody>
                      {FILAS_VALOR.map(([izq, der], i) => (
                        <tr key={i}>
                          <LadoValor lado={izq} calculos={calculos} />
                          <LadoValor lado={der} calculos={calculos} />
                        </tr>
                      ))}
                      <tr>
                        <td className="v-label">
                          114. Lugar de importación
                          <div style={{ textAlign: 'center', marginTop: 4 }}>
                            <input type="text" placeholder="2" aria-label="Lugar de importación, dígito 1" style={{ fontSize: '0.75rem', fontWeight: 900, width: 15, border: '1px solid #1a3a6b', textAlign: 'center' }} />
                            <input type="text" placeholder="0" aria-label="Lugar de importación, dígito 2" style={{ fontSize: '0.75rem', fontWeight: 900, width: 15, border: '1px solid #1a3a6b', textAlign: 'center' }} />
                            <input type="text" aria-label="Lugar de importación" style={{ width: 50, border: '1px solid #1a3a6b' }} />
                          </div>
                        </td>
                        <td colSpan={2} className="gris" />
                        <td className="v-label v-total"><b>Valor de transacción declarado</b></td>
                        <td className="gris" />
                        <td><Casilla num={135} className="casilla-num" /><Calculado valor={dos(calculos[135])} style={{ fontWeight: 900, fontSize: '0.625rem', width: 'calc(100% - 15px)' }} aria-label="Valor de transacción declarado" /></td>
                      </tr>
                      <tr>
                        <td colSpan={5} style={{ padding: '3px 4px', borderRight: 'none' }}>
                          <Cl num="136">Algunos de los importes declarados en las casillas 99, 111 y 113 tienen carácter provisional?</Cl>
                        </td>
                        <td style={{ borderLeft: 'none', textAlign: 'center' }}>
                          <input type="text" className="yn yn-bordeado" placeholder="S/N" aria-label="Importes provisionales" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* SIGNATARIO */}
          <table className="form-560">
            <tbody>
              <tr>
                <td className="sec-label" style={{ width: 20 }}>Signatario</td>
                <td style={{ padding: 0, border: 'none' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.5rem' }}>
                    <tbody>
                      <tr>
                        {[
                          ['18%', <><Cl num="137">Número de Identificación Tributaria (NIT)</Cl><Entrada nombre="f_snit" placeholder="NIT" inputMode="numeric" /></>],
                          ['6%', <><Cl num="138">D.V.</Cl><Calculado className="small" valor={digitoVerificacion(v.f_snit)} aria-label="DV del signatario" /></>],
                          ['18%', <><Cl num="139">Primer apellido</Cl><input type="text" /></>],
                          ['18%', <><Cl num="140">Segundo apellido</Cl><input type="text" /></>],
                          ['18%', <><Cl num="141">Primer nombre</Cl><input type="text" /></>],
                          ['22%', <><Cl num="142">Otros nombres</Cl><input type="text" /></>],
                        ].map(([ancho, contenido], i, todos) => (
                          <td key={i} style={{ width: ancho, border: 'none', borderBottom: '1px solid #1a3a6b', borderRight: i < todos.length - 1 ? '1px solid #1a3a6b' : 'none' }}>{contenido}</td>
                        ))}
                      </tr>
                      <tr>
                        <td colSpan={6} style={{ border: 'none', padding: '4px 4px 20px' }}>
                          <span className="cl" style={{ marginTop: 50 }}>Firma declarante</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
            <div style={{ width: 130, textAlign: 'right' }}>
              <Cl num="997">Fecha de expedición <small>(AAAA MM DD)</small></Cl>
              <div style={{ display: 'flex' }}>
                <input type="text" placeholder="AAAA" aria-label="Año de expedición" style={{ width: 40, border: '1px solid #1a3a6b', textAlign: 'center' }} />
                <input type="text" placeholder="MM" aria-label="Mes de expedición" style={{ width: 30, border: '1px solid #1a3a6b', borderLeft: 'none', textAlign: 'center' }} />
                <input type="text" placeholder="DD" aria-label="Día de expedición" style={{ width: 30, border: '1px solid #1a3a6b', borderLeft: 'none', textAlign: 'center' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== HOJA 2: ítems 4 a 25 ========== */}
      <div className="paper-wrap">
        <div className="paper p2">
          <Cabecera numeroGrande={{ fontSize: '2.625rem' }}>
            <div style={{ fontSize: '0.5rem', marginTop: 3, paddingLeft: 8 }}>
              Página: <input type="text" defaultValue="2" aria-label="Página" style={{ width: 20, display: 'inline', border: '1px solid #1a3a6b', textAlign: 'center' }} /> de{' '}
              <input type="text" aria-label="Total de páginas" style={{ width: 20, display: 'inline', border: '1px solid #1a3a6b', textAlign: 'center' }} />
              {'  '}<b>Hoja No. 2</b>{'  '}<b>4. Número de formulario:</b>{' '}
              <Calculado valor={v.numform ?? ''} placeholder="N° DAV" aria-label="Número de formulario, hoja 2" style={{ width: 100, border: '1px solid #1a3a6b', display: 'inline' }} />
            </div>
          </Cabecera>

          <table className="form-560">
            <tbody>
              <tr>
                <td className="sec-label" rowSpan={2} style={{ width: 20 }}>Importador</td>
                <td colSpan={4}><Cl num="5">NIT</Cl><Calculado valor={v.f_nit ?? ''} placeholder="Igual que hoja 1" aria-label="NIT, hoja 2" /></td>
                <td><Cl num="6">DV</Cl><Calculado className="small" valor={digitoVerificacion(v.f_nit)} aria-label="DV, hoja 2" /></td>
                <td colSpan={2}><Cl num="7">Primer apellido</Cl><input type="text" /></td>
                <td colSpan={2}><Cl num="8">Segundo apellido</Cl><input type="text" /></td>
                <td colSpan={2}><Cl num="9">Primer nombre</Cl><input type="text" /></td>
                <td colSpan={2}><Cl num="10">Otros nombres</Cl><input type="text" /></td>
              </tr>
              <tr>
                <td colSpan={13}><Cl num="11">Razón social</Cl><Calculado valor={v.f_razon ?? ''} placeholder="Igual que hoja 1" aria-label="Razón social, hoja 2" /></td>
              </tr>
            </tbody>
          </table>

          <table className="form-560">
            <tbody>
              <Descripcion filas={Array.from({ length: 22 }, (_, i) => i + 4)} />
            </tbody>
          </table>

          <div className="pie">
            Generado por <b>BonCloud</b> | Cartagena, Colombia | Formulario 560 – DAV DIAN (Decreto 1165/2019)
          </div>
        </div>
      </div>
    </div>
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
      f_nit: '900123456', f_razon: 'HidroColombia S.A.S. (empresa ficticia)', f_dirsec: '48', f_tipodec: '1',
      f_nattrans: '11', f_formaenv: '1', f_incoterm: 'FOB', f_lugar38: 'Shanghái', f_paisprocedencia: 'CN',
      f_factura40: 'ZH-2026-118', f_fob46: '60000', f_mon47: 'USD', f_tc48: '1',
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
