import { APLICACIONES_ROP, CASO_ROP, FORMAS_PAGO_ROP, ROP, TITULOS_VALOR, numero } from '../../lib/sigloxxii.js';
import { CampoTexto } from './Partes.jsx';
import css from './SigloXXII.module.css';

// Práctica 2: Recibo Oficial de Pago de tributos aduaneros y sanciones cambiarias. Se usa para pagar
// saldos de declaraciones que no se pagaron completas, o para pagar con títulos valores.
export function RopIngresar({ v, poner, malos, onSalvar }) {
  const suma = ['arancel', 'iva', 'sanciones', 'otros', 'mora'].reduce((t, k) => t + (numero(v[k]) || 0), 0);
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>Recibo oficial de pago tributos aduaneros y sanciones cambiarias</h2>
        <span className={css.chip}>Ingresar</span>
      </div>
      <p className={css.suave}>El sistema trae los datos del declarante; llena los demás con los documentos del caso.</p>
      <fieldset className={css.seccion}>
        <legend>Quien declara y qué paga</legend>
        <div className={css.rejilla}>
          <div className={css.campo}><label htmlFor="sx-rop-nit">NIT</label><input id="sx-rop-nit" readOnly value="900123456-8" /></div>
          <div className={css.campo} style={{ gridColumn: 'span 2' }}><label htmlFor="sx-rop-razon">Razón social</label><input id="sx-rop-razon" readOnly value="HIDROCOLOMBIA S.A.S." /></div>
          <CampoTexto campo="aplicacion" rotulo="Aplicación" v={v} poner={poner} malos={malos} opciones={APLICACIONES_ROP} />
          <CampoTexto campo="declaracion" rotulo="No. de aceptación de la declaración" v={v} poner={poner} malos={malos} ancho={2} />
          <CampoTexto campo="declaracion_fecha" rotulo="Fecha de aceptación" v={v} poner={poner} malos={malos} ancho={2} placeholder="AAAA-MM-DD" />
          <CampoTexto campo="pagador" rotulo="Nombre de quien efectúa el pago" v={v} poner={poner} malos={malos} ancho={2} />
          <CampoTexto campo="pagador_doc" rotulo="Documento de quien paga" v={v} poner={poner} malos={malos} ancho={2} />
        </div>
      </fieldset>
      <fieldset className={css.seccion}>
        <legend>Valores a pagar ($)</legend>
        <div className={css.rejilla}>
          <CampoTexto campo="arancel" rotulo="Arancel" v={v} poner={poner} malos={malos} />
          <CampoTexto campo="iva" rotulo="IVA" v={v} poner={poner} malos={malos} />
          <CampoTexto campo="sanciones" rotulo="Sanciones" v={v} poner={poner} malos={malos} />
          <CampoTexto campo="otros" rotulo="Otros" v={v} poner={poner} malos={malos} />
          <CampoTexto campo="mora" rotulo="Intereses de mora" v={v} poner={poner} malos={malos} />
          <CampoTexto campo="total" rotulo="Total pagado" v={v} poner={poner} malos={malos} />
        </div>
        <p className={css.suave}>Suma de los conceptos: ${suma.toLocaleString('es-CO')}</p>
      </fieldset>
      <fieldset className={css.seccion}>
        <legend>Forma de pago</legend>
        <div className={css.rejilla}>
          <CampoTexto campo="forma" rotulo="Forma de pago" v={v} poner={poner} malos={malos} ancho={2} opciones={FORMAS_PAGO_ROP} />
          {v.forma === 'TV' && <CampoTexto campo="titulo" rotulo="Código del título" v={v} poner={poner} malos={malos} ancho={2} opciones={TITULOS_VALOR} />}
        </div>
      </fieldset>
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Guardar</button></div>
    </div>
  );
}

// Recibos radicados: se pueden modificar hasta preinformarlos; al preinformar, la DIAN da la aceptación
export function RopRecibos({ v, onModificar, onPreinformar }) {
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>Recibos oficiales de pago</h2>
        <span className={css.chip}>Pendientes de preinformar</span>
      </div>
      <div className={css.scroll}>
        <table className={css.secciones}>
          <thead><tr><th scope="col">Radicación</th><th scope="col">Declaración</th><th scope="col">Total $</th><th scope="col">Estado</th><th scope="col"><span className={css.oculto}>Acciones</span></th></tr></thead>
          <tbody>
            <tr>
              <td className={css.codigo}>{ROP.radicacion}</td>
              <td>{v.declaracion}</td>
              <td>{(numero(v.total) || 0).toLocaleString('es-CO')}</td>
              <td><span className={`${css.estadoSec} ${css.pendiente}`}>Radicado</span></td>
              <td>
                <button type="button" className={css.secundario} onClick={onModificar}>Modificar</button>{' '}
                <button type="button" className={css.primario} onClick={onPreinformar}>Preinformar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={css.suave}>Revisa el recibo antes de preinformarlo: después ya no se puede modificar ni borrar.</p>
    </div>
  );
}

