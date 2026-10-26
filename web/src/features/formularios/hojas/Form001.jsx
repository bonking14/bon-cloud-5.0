import { useState } from 'react';
import { digitoVerificacion } from '../../../lib/nit.js';
import { sumaCapital } from '../../../lib/formularios.js';
import { useCampos } from '../kit/contexto.js';
import { Celda, Fila, Seccion, Hoja, Firmas, Entrada } from '../kit/campos.jsx';
import Casilla from '../kit/Casilla.jsx';

// El NIT se escribe sin puntos ni DV, hasta 10 dígitos
const soloNit = (t) => t.replace(/[^0-9]/g, '').substring(0, 10);

// Casillas 5, 6, 12 y 14: se repiten en cada hoja con el mismo NIT
function Identificacion() {
  const { valores: v } = useCampos();
  return (
    <div className="ident-row">
      <Celda num="5" etiqueta="Número de Identificación Tributaria (NIT)" flex={3} nombre="nit" formato={soloNit} inputMode="numeric" />
      <Celda num="6" etiqueta="DV" flex={1} valor={digitoVerificacion(v.nit)} />
      <Celda num="12" etiqueta="Dirección seccional" flex={2} />
      <Celda num="14" etiqueta="Buzón electrónico" flex={4} />
    </div>
  );
}

const Rotulo = ({ children, ancho = 100 }) => <div className="cell cell-nota" style={{ width: ancho, flex: 'none' }}>{children}</div>;

function Hoja1({ oculta }) {
  return (
    <Hoja numero="001" titulo="Registro Único Tributario" oculta={oculta}>
      <Identificacion />
      <Fila style={{ marginBottom: 5, borderTop: '1px solid #000' }}>
        <Celda num="2" etiqueta="Concepto" ancho={80} />
        <div className="cell cell-nota" style={{ flex: 1, alignItems: 'flex-start', color: '#555' }}>Inscripción · Actualización · Cancelación</div>
      </Fila>

      <Seccion>Identificación</Seccion>
      <Fila>
        <Celda num="24" etiqueta="Tipo contribuyente" nombre="tipo_contribuyente" />
        <Celda num="25" etiqueta="Tipo documento" nombre="tipo_doc" />
        <Celda num="26" etiqueta="Número de Identificación" flex={2} nombre="num_id" />
        <Celda num="27" etiqueta="Fecha expedición" placeholder="DD/MM/AAAA" />
      </Fila>
      <Fila>
        <Rotulo>Lugar de expedición</Rotulo>
        <Celda num="28" etiqueta="País" />
        <Celda num="29" etiqueta="Departamento" />
        <Celda num="30" etiqueta="Ciudad/Municipio" />
      </Fila>
      <Fila>
        <Celda num="31" etiqueta="Primer apellido" />
        <Celda num="32" etiqueta="Segundo apellido" />
        <Celda num="33" etiqueta="Primer nombre" />
        <Celda num="34" etiqueta="Otros nombres" />
      </Fila>
      <Fila><Celda num="35" etiqueta="Razón social" nombre="razon_social" /></Fila>
      <Fila>
        <Celda num="36" etiqueta="Nombre comercial" flex={2} />
        <Celda num="37" etiqueta="Sigla" />
      </Fila>

      <Seccion>Ubicación</Seccion>
      <Fila>
        <Celda num="38" etiqueta="País" />
        <Celda num="39" etiqueta="Departamento" />
        <Celda num="40" etiqueta="Ciudad/Municipio" />
      </Fila>
      <Fila><Celda num="41" etiqueta="Dirección principal" nombre="dir_principal" /></Fila>
      <Fila>
        <Celda num="42" etiqueta="Correo electrónico" flex={2} />
        <Celda num="43" etiqueta="Código postal" />
        <Celda num="44" etiqueta="Teléfono 1" />
        <Celda num="45" etiqueta="Teléfono 2" />
      </Fila>

      <Seccion>Clasificación</Seccion>
      <Fila>
        <Rotulo>Actividad principal</Rotulo>
        <Celda num="46" etiqueta="Código" nombre="act_principal" />
        <Celda num="47" etiqueta="Fecha inicio actividad" placeholder="DD/MM/AAAA" />
        <Rotulo>Actividad secundaria</Rotulo>
        <Celda num="48" etiqueta="Código" />
        <Celda num="49" etiqueta="Fecha inicio actividad" placeholder="DD/MM/AAAA" />
      </Fila>
      <Fila>
        <Rotulo>Otras actividades</Rotulo>
        <Celda num="50" etiqueta="Código 1" />
        <Celda etiqueta="Código 2" />
        <Rotulo>Ocupación</Rotulo>
        <Celda num="51" etiqueta="Código" />
        <Celda num="52" etiqueta="Número establecimientos" />
      </Fila>

      <Fila style={{ marginTop: 5, borderTop: '1px solid #000' }}>
        <Celda num="53" etiqueta="Responsabilidades, Calidades y Atributos (Códigos)" nombre="resp_53" placeholder="Ej: 05, 10, 42, 48" />
      </Fila>

      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
        <div style={{ flex: 1, border: '1px solid #000' }}>
          <div className="row" style={{ border: 'none' }}>
            <Celda num="54" etiqueta="Usuarios aduaneros (Códigos)" nombre="adu_54" placeholder="Ej: 23 importador, 22 exportador" />
          </div>
        </div>
        <div style={{ flex: 1, border: '1px solid #000' }}>
          <div className="cell-nota" style={{ fontSize: '0.5rem', borderBottom: '1px solid #000' }}>Exportadores</div>
          <div className="row" style={{ border: 'none', borderBottom: '1px solid #000' }}>
            <Celda num="55" etiqueta="Forma" />
            <Celda num="56" etiqueta="Tipo" />
          </div>
          <div className="row" style={{ border: 'none' }}>
            <Rotulo ancho={60}>Servicio</Rotulo>
            <Celda etiqueta="1" />
            <Celda etiqueta="2" />
            <Celda etiqueta="3" />
            <Celda num="57" etiqueta="Modo" />
            <Celda num="58" etiqueta="CPC" />
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid #000', marginTop: 5 }}>
        <div style={{ fontSize: '0.5rem', padding: 2, borderBottom: '1px solid #000' }}>Para uso exclusivo de la DIAN</div>
        <div className="row" style={{ border: 'none' }}>
          <div className="cell" style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', fontSize: '0.5rem', gap: 4 }}>
            <Casilla num="59" /> Anexos: SI <input type="checkbox" style={{ width: 'auto' }} aria-label="Anexos sí" /> NO <input type="checkbox" style={{ width: 'auto' }} aria-label="Anexos no" />
          </div>
          <Celda num="60" etiqueta="No. de Folios" />
          <Celda num="61" etiqueta="Fecha" />
        </div>
      </div>

      <Firmas alto={110} firmas={[
        { texto: 'La información suministrada a través del formulario oficial del Registro Único Tributario, deberá ser exacta y veraz; en caso de constatar inexactitud en alguno de los datos suministrados se adelantarán los procedimientos administrativos sancionatorios o de suspensión, según el caso. (Parágrafo 1o. del Artículo 1.6.1.2.20. del Decreto 1625 de 2016).', firma: 'Firma del solicitante' },
        {
          texto: 'Sin perjuicio de las verificaciones que la DIAN realice.',
          firma: 'Firma autorizada',
          children: (
            <div className="firma-campos">
              <div style={{ flex: 1 }}>984. Nombre <input type="text" aria-label="Nombre (casilla 984)" /></div>
              <div style={{ flex: 1 }}>985. Cargo <input type="text" aria-label="Cargo (casilla 985)" /></div>
            </div>
          ),
        },
      ]} />
    </Hoja>
  );
}

// Celda dentro de una tabla, con su número de casilla en línea
const CeldaTabla = ({ num, texto, children }) => (
  <div style={{ flex: 1, padding: 2 }}><Casilla num={num} /> {texto} {children ?? <input type="text" aria-label={texto} />}</div>
);

function Hoja2({ oculta }) {
  const { valores: v } = useCampos();
  const capital = sumaCapital(v);
  const fila = (n) => Array.from({ length: n }, (_, i) => i + 1);

  return (
    <Hoja numero="001" titulo="Registro Único Tributario" oculta={oculta}>
      <Identificacion />

      <Seccion>Características y formas de las organizaciones</Seccion>
      <Fila>
        <Celda num="62" etiqueta="Naturaleza" />
        <Celda num="63" etiqueta="Formas asociativas" />
        <Celda num="64" etiqueta="Entidades o institutos de derecho público..." flex={2} />
        <Celda num="65" etiqueta="Fondos" />
        <Celda num="66" etiqueta="Cooperativas" />
        <Celda num="67" etiqueta="Sociedades y organismos extranjeros" />
      </Fila>
      <Fila>
        <Celda num="68" etiqueta="Sin personería jurídica" />
        <Celda num="69" etiqueta="Otras organizaciones no clasificadas" flex={2} />
        <Celda num="70" etiqueta="Beneficio" />
      </Fila>

      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
        <div style={{ flex: 2 }}>
          <Seccion style={{ marginTop: 0 }}>Constitución, registro y última reforma</Seccion>
          <table className="dian-table" style={{ marginTop: 0 }}>
            <tbody>
              <tr><th>Documento</th><th>1. Constitución</th><th>2. Reforma</th></tr>
              {['71. Clase', '72. Número', '73. Fecha', '74. Número de notaría', '75. Entidad de registro', '76. Fecha de registro'].map((t) => (
                <tr key={t}><td>{t}</td><td><input type="text" aria-label={`${t}, constitución`} /></td><td><input type="text" aria-label={`${t}, reforma`} /></td></tr>
              ))}
              <tr>
                <td colSpan={3} style={{ padding: 0 }}>
                  <div style={{ display: 'flex' }}>
                    <CeldaTabla num="77" texto="No. Matrícula mercantil" />
                    <CeldaTabla num="78" texto="Departamento" />
                    <CeldaTabla num="79" texto="Ciudad/Municipio" />
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={{ padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ padding: '2px 5px', fontSize: '0.5rem' }}>Vigencia:</div>
                    <CeldaTabla num="80" texto="Desde" />
                    <CeldaTabla num="81" texto="Hasta" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ flex: 1 }}>
          <Seccion style={{ marginTop: 0 }}>Composición del capital</Seccion>
          <table className="dian-table" style={{ marginTop: 0 }}>
            <tbody>
              {[[82, 'Nacional'], [83, 'Nacional público'], [84, 'Nacional privado'], [85, 'Extranjero'], [86, 'Extranjero público'], [87, 'Extranjero privado']].map(([n, t]) => (
                <tr key={n}><td>{n}. {t} %</td><td><Entrada nombre={`porc_${n}`} type="number" aria-label={`${t} %`} /></td></tr>
              ))}
            </tbody>
          </table>
          {capital.excede && <div role="alert" style={{ color: 'red', fontSize: '0.5rem', padding: 2 }}>La suma excede 100% ({capital.total}%)</div>}
          <div style={{ border: '1px solid #000', marginTop: 5 }}>
            <div style={{ textAlign: 'center', fontSize: '0.5rem', fontWeight: 'bold', borderBottom: '1px solid #000', padding: 2 }}>ENTIDAD DE VIGILANCIA Y CONTROL</div>
            <div style={{ padding: 5, fontSize: '0.5rem' }}>
              <Casilla num="88" style={{ position: 'static' }} /> Entidad de vigilancia y control
              <input type="text" aria-label="Entidad de vigilancia y control" style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.5rem', marginTop: 5, borderBottom: '1px dotted #000', background: 'transparent' }} />
            </div>
          </div>
        </div>
      </div>

      <Seccion>Estado y beneficio</Seccion>
      <table className="dian-table" style={{ marginTop: 0 }}>
        <tbody>
          <tr><th>Item</th><th>89. Estado actual</th><th>90. Fecha cambio de estado</th><th>91. NIT</th><th>92. DV</th></tr>
          {fila(5).map((i) => (
            <tr key={i}><td style={{ textAlign: 'center' }}>{i}</td>{[89, 90, 91, 92].map((c) => <td key={c}><input type="text" aria-label={`Casilla ${c}, ítem ${i}`} /></td>)}</tr>
          ))}
        </tbody>
      </table>

      <Seccion>Vinculación económica</Seccion>
      <Fila>
        <Celda num="93" etiqueta="Vinculación económica" />
        <Celda num="94" etiqueta="Nombre del grupo económico y/o empresarial" flex={3} />
        <Celda num="95" etiqueta="NIT Matriz o Controlante" />
        <Celda num="96" etiqueta="DV" ancho={30} />
      </Fila>
      <Fila><Celda num="97" etiqueta="Nombre o razón social de la matriz o controlante" /></Fila>

      <table className="dian-table" style={{ marginTop: 5 }}>
        <tbody>
          <tr>
            <th>Item</th><th>170. Número de id. tributaria exterior</th><th>171. País</th>
            <th>172. NIT sociedad o natural del exterior con EP</th><th>173. Nombre o razón social de la sociedad o natural del exterior con EP</th>
          </tr>
          {fila(4).map((i) => (
            <tr key={i}><td style={{ textAlign: 'center' }}>{i}</td>{[170, 171, 172, 173].map((c) => <td key={c}><input type="text" aria-label={`Casilla ${c}, ítem ${i}`} /></td>)}</tr>
          ))}
        </tbody>
      </table>
    </Hoja>
  );
}

// Las dos hojas se muestran por pestañas en pantalla y se imprimen juntas
function Form001() {
  const [hoja, setHoja] = useState(1);
  return (
    <>
      <div className="dian-hojas no-imprimir" role="tablist" aria-label="Hojas del RUT">
        {[[1, 'Hoja 1 (Identificación y clasificación)'], [2, 'Hoja 2 (Organización y capital)']].map(([n, t]) => (
          <button key={n} type="button" role="tab" aria-selected={hoja === n} className={`filtro-btn${hoja === n ? ' active' : ''}`} onClick={() => setHoja(n)}>{t}</button>
        ))}
      </div>
      <Hoja1 oculta={hoja !== 1} />
      <Hoja2 oculta={hoja !== 2} />
    </>
  );
}

export default {
  id: '001',
  sigla: 'RUT',
  Componente: Form001,
  inicial: () => ({}),
  obligatorios: [
    ['nit', 'NIT'],
    ['tipo_contribuyente', 'Tipo contribuyente'],
    ['tipo_doc', 'Tipo documento'],
    ['num_id', 'Número de identificación'],
    ['dir_principal', 'Dirección principal'],
    ['act_principal', 'Actividad principal'],
  ],
  // Caso de la Ruta de Aprendizaje: HidroColombia S.A.S. (datos ficticios)
  caso: {
    boton: 'Cargar caso de la Ruta de Aprendizaje',
    mensaje: 'Se cargó el RUT de HidroColombia, la empresa del caso: responsabilidad 10 (usuario aduanero) y usuario aduanero 23 (importador). El DV del NIT 900123456 es 8.',
    valores: () => ({
      nit: '900123456', tipo_contribuyente: 'Persona jurídica', tipo_doc: 'NIT', num_id: '900123456',
      razon_social: 'HidroColombia S.A.S. (empresa ficticia)', dir_principal: 'Zona Industrial de Mamonal, Cartagena',
      act_principal: '4659', resp_53: '05, 10, 42, 48, 52', adu_54: '23',
    }),
  },
  explicaciones: {
    2: 'Concepto del trámite: inscripción, actualización o cancelación del RUT (Resolución DIAN 8346 de 2004).',
    5: 'NIT que asigna la DIAN. En una inscripción nueva lo asigna el sistema.',
    6: 'Dígito de verificación del NIT, calculado con el algoritmo de módulo 11 de la DIAN.',
    24: 'Tipo de contribuyente: persona jurídica o persona natural.',
    25: 'Tipo de documento de identificación (por ejemplo, NIT o cédula de ciudadanía).',
    26: 'Número del documento de identificación.',
    35: 'Razón social tal como figura en el certificado de existencia y representación legal.',
    41: 'Dirección del domicilio principal.',
    46: 'Código CIIU (Rev. 4 A.C.) de la actividad económica principal.',
    53: 'Responsabilidades, calidades y atributos. Quien opera en comercio exterior debe tener la 10 – Usuario aduanero, además de las tributarias que le correspondan.',
    54: 'Calidad de usuario aduanero. Para importar se registra el código 23 (importador) y para exportar el 22 (exportador).',
  },
};
