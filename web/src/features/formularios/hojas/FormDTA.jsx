import { digitoVerificacion } from '../../../lib/nit.js';
import { useCampos } from '../kit/contexto.js';
import { Celda, Fila, Seccion, Hoja, Firmas, Entrada } from '../kit/campos.jsx';

function FormDTA() {
  const { valores: v } = useCampos();

  return (
    <Hoja numero="DTA" titulo="Declaración de Tránsito Aduanero">
      <div className="aviso">Simulador educativo de BonCloud: la distribución y numeración de casillas es aproximada y no tiene validez ante la DIAN. Hoy el tránsito aduanero se solicita, autoriza, ejecuta y cierra en el servicio informático electrónico de tránsito de la DIAN (Resolución DIAN 000076 de 2020).</div>
      <Seccion>Declarante (agencia de aduanas o importador)</Seccion>
      <Fila>
        <Celda num="5" etiqueta="NIT" flex={2} nombre="dec_nit" inputMode="numeric" />
        <Celda num="6" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.dec_nit)} />
        <Celda num="7" etiqueta="Razón Social o Nombre del Declarante" flex={5} nombre="dec_razon" />
        <Celda num="8" etiqueta="Cód. Tipo Usuario" />
      </Fila>

      <Seccion>Empresa transportadora (inscrita ante la DIAN)</Seccion>
      <Fila>
        <Celda num="9" etiqueta="NIT Transportador" flex={2} nombre="trans_nit" inputMode="numeric" />
        <Celda num="10" etiqueta="DV" ancho={30} valor={digitoVerificacion(v.trans_nit)} />
        <Celda num="11" etiqueta="Razón Social Transportador" flex={5} />
        <Celda num="12" etiqueta="Placa del Vehículo" flex={2} nombre="trans_placa" />
      </Fila>
      <Fila>
        <Celda num="13" etiqueta="Nombre del Conductor" flex={2} />
        <Celda num="14" etiqueta="Cédula del Conductor" />
        <Celda num="15" etiqueta="N° Licencia de Tránsito" />
        <Celda num="16" etiqueta="N° Manifiesto de Carga" />
      </Fila>

      <Seccion>Información general de la ruta y aduanas</Seccion>
      <Fila>
        <Celda num="30" etiqueta="Cód. Aduana de Partida" nombre="aduana_partida" />
        <Celda num="31" etiqueta="Cód. Aduana de Destino" nombre="aduana_destino" />
        <Celda num="32" etiqueta="Cód. Aduana de Paso (Frontera)" />
        <Celda num="33" etiqueta="Modalidad (Tránsito/Cabotaje)" />
      </Fila>
      <Fila>
        <Celda num="34" etiqueta="Lugar de Entrega Autorizado" />
        <Celda num="35" etiqueta="Plazo Autorizado (Días)" type="number" />
        <Celda num="36" etiqueta="Ruta Autorizada" />
      </Fila>

      <Seccion>Mercancía y precintos</Seccion>
      <Fila>
        <Celda num="40" etiqueta="N° de Bultos / Contenedores" type="number" />
        <Celda num="41" etiqueta="Peso Bruto Total (Kgs)" type="number" step="0.01" />
        <Celda num="42" etiqueta="Valor Total (USD)" type="number" step="0.01" />
        <Celda num="43" etiqueta="Números de Precintos (Sellos)" flex={2} placeholder="Ej: A1234, B5678" />
      </Fila>
      <Fila>
        <Celda num="44" etiqueta="Descripción General de la Mercancía"><textarea aria-label="Descripción general de la mercancía" /></Celda>
      </Fila>

      <Seccion>Garantías y tributos suspendidos</Seccion>
      <Fila style={{ backgroundColor: '#fcfcfc' }}>
        <Celda num="50" etiqueta="N° Garantía Aceptada" />
        <Celda num="51" etiqueta="Aseguradora / Entidad" />
        <Celda num="52" etiqueta="Fecha Vencimiento" placeholder="AAAA-MM-DD" />
        <Celda num="53" etiqueta="Tributos Suspendidos (COP)" className="cell-destacada">
          <Entrada type="number" placeholder="0.00" style={{ fontWeight: 'bold' }} />
        </Celda>
      </Fila>

      <Seccion style={{ marginTop: 10 }}>Datos de aceptación / control aduanero (uso exclusivo DIAN)</Seccion>
      <Fila>
        <Celda num="60" etiqueta="Fecha y Hora Autorización (Partida)" style={{ height: 40 }}>{null}</Celda>
        <Celda num="61" etiqueta="Número de Aceptación DTA">{null}</Celda>
        <Celda num="62" etiqueta="Fecha y Hora Llegada (Destino)">{null}</Celda>
        <Celda num="63" etiqueta="Observaciones Aduana Destino">{null}</Celda>
      </Fila>

      <Firmas alto={130} firmas={[
        { texto: 'Declaro que la información contenida es exacta y veraz. Me comprometo a cumplir con la ruta y los plazos estipulados para la entrega de la mercancía amparada en este Tránsito Aduanero.', firma: 'Firma del Declarante Autorizado' },
        { texto: 'La empresa transportadora responde ante la autoridad aduanera por la finalización del tránsito dentro del plazo autorizado y por la correcta ejecución de la operación.', firma: 'Firma de la Empresa Transportadora' },
        { texto: 'Espacio exclusivo para firmas y sellos de funcionarios de la DIAN (Partida y Destino).' },
      ]} />
    </Hoja>
  );
}

export default {
  id: 'DTA',
  sigla: 'DTA',
  Componente: FormDTA,
  inicial: () => ({}),
  obligatorios: [
    ['dec_nit', 'NIT del declarante'],
    ['dec_razon', 'Razón social del declarante'],
    ['trans_nit', 'NIT del transportador'],
    ['trans_placa', 'Placa del vehículo'],
    ['aduana_partida', 'Aduana de partida'],
    ['aduana_destino', 'Aduana de destino'],
  ],
  caso: {
    boton: 'Llenar datos de ejemplo (DTA)',
    mensaje: 'Se cargaron datos de ejemplo de un tránsito aduanero de Cartagena a Bogotá.',
    valores: () => ({
      dec_nit: '900555123', dec_razon: 'Servicios de Logística Aduanera del Caribe S.A.S.',
      trans_nit: '800444987', trans_placa: 'TKO-892', aduana_partida: '48 - Cartagena', aduana_destino: '91 - Bogotá',
    }),
  },
  explicaciones: {
    5: 'NIT del declarante: la agencia de aduanas, o el importador cuando actúa directamente (art. 32 del Decreto 1165 de 2019). El declarante responde por la información declarada y por los tributos si la mercancía no llega a la aduana de destino.',
    6: 'Dígito de verificación del NIT, calculado con el algoritmo de módulo 11.',
    9: 'NIT de la empresa transportadora. El tránsito solo puede hacerse en vehículos de empresas inscritas y autorizadas por la DIAN (art. 434 del Decreto 1165 de 2019).',
    12: 'Placa del vehículo que hace el tránsito.',
    16: 'Número del manifiesto de carga con el que llegó la mercancía.',
    30: 'Código de la aduana de partida. La Dirección Seccional de Aduanas de Cartagena es 48 (Resolución DIAN 000065 de 2021).',
    31: 'Código de la aduana de destino, donde se declarará la importación. Para un tránsito terrestre a Bogotá es 91 (Dirección Seccional de Aduanas de Bogotá); el 03 es la del Aeropuerto El Dorado.',
    35: 'Plazo que autoriza la DIAN para llegar a la aduana de destino. Si se incumple, hay sanción y se puede hacer efectiva la garantía.',
    36: 'Ruta autorizada. El vehículo no puede desviarse de ella.',
    43: 'Números de los precintos (sellos) que la DIAN verifica al salir y al llegar.',
    50: 'Garantía (bancaria o de compañía de seguros) que respalda el pago de los tributos suspendidos durante el tránsito.',
    61: 'Número de aceptación de la DTA que asigna la DIAN.',
  },
};
