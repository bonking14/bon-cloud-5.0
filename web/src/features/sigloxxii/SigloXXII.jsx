import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ADMINISTRACION, CASO, CODIGOS_EMPRESA, CREDENCIALES, DEPARTAMENTOS, FORMAS_PAGO, RUTA_MENU, TASA_SEMANA, TIPOS_IMPORTACION,
  dvImportador, liquidar, opcionesMenu, validarEncabezado, validarSubpartida,
} from '../../lib/sigloxxii.js';
import css from './SigloXXII.module.css';

// SIGLO XXII: el estudiante hace, paso a paso, el trámite de una declaración de importación
// como en el sistema informático aduanero: ingresa con usuario y contraseña, recorre el menú,
// llena el encabezado y la subpartida, autoliquida y guarda. Es un simulador: no se conecta
// con la DIAN y todos los datos son ficticios.
const PASOS = [
  ['login', 'Ingresar con usuario y contraseña'],
  ['menu', 'Recorrer el menú hasta «Ingresar»'],
  ['previos', 'Parámetros previos'],
  ['encabezado', 'Encabezado de la declaración'],
  ['subpartida', 'Subpartida y autoliquidación'],
  ['fin', 'Declaración guardada'],
];
const AYUDA = {
  login: `Entra con el usuario de práctica ${CREDENCIALES.usuario} y la contraseña ${CREDENCIALES.clave}. En el sistema real, el usuario lo asigna la DIAN a cada agencia de aduanas o usuario aduanero.`,
  menu: `Para abrir una declaración nueva sigue esta ruta en la barra azul: ${RUTA_MENU.join(' → ')}.`,
  previos: 'Antes del encabezado el sistema pregunta el tipo de declaración (Inicial), el departamento del importador y el documento que respalda la importación (el documento de transporte).',
  encabezado: 'Llena el encabezado con los documentos del caso que están abajo. Los códigos van como aparecen en los documentos. Al terminar, pulsa SALVAR: el sistema te dirá qué falta o qué no coincide.',
  subpartida: 'Llena los datos de la mercancía y los valores. Escribe los porcentajes de arancel e IVA y pulsa AUTOLIQUIDACIÓN para que el sistema calcule los tributos. Después, SALVAR.',
  fin: 'Terminaste el recorrido. En el sistema real seguirían los documentos soporte, la aceptación, el pago y el levante.',
};
const pesos = (n) => Math.round(n || 0).toLocaleString('es-CO');
const HOY = new Date();

function Campo({ nombre, rotulo, v, poner, malos, ancho, soloLectura, valor, opciones, placeholder }) {
  const id = `sx-${nombre}`;
  return (
    <label className={`${css.campo}${malos?.has(nombre) ? ` ${css.mal}` : ''}`} style={ancho ? { width: ancho } : undefined} htmlFor={id}>
      <span>{rotulo}</span>
      {opciones ? (
        <select id={id} value={v[nombre] ?? ''} onChange={(e) => poner(nombre, e.target.value)}>
          <option value="" />
          {opciones.map(([c, t]) => <option key={c} value={c}>{t}</option>)}
        </select>
      ) : (
        <input id={id} type="text" autoComplete="off" placeholder={placeholder} readOnly={soloLectura}
          value={soloLectura ? valor ?? '' : v[nombre] ?? ''} onChange={soloLectura ? undefined : (e) => poner(nombre, e.target.value)} />
      )}
    </label>
  );
}

export default function SigloXXII() {
  const [paso, setPaso] = useState('login');
  const [ruta, setRuta] = useState([]);
  const [mensaje, setMensaje] = useState(null); // { texto, errores?, tipo }
  const [acceso, setAcceso] = useState({ usuario: '', clave: '' });
  const [previos, setPrevios] = useState({ etapa: 1, tipo: 'Inicial', departamento: '', respaldo: 'DOCUMENTO DE TRANSPORTE' });
  const [enc, setEnc] = useState({ administracion: ADMINISTRACION.codigo });
  const [sub, setSub] = useState({ cuotas: '0', otros: '0', ajuste: '0' });
  const [liq, setLiq] = useState(null);
  const [malos, setMalos] = useState(new Set());

  const ir = (p) => { setPaso(p); setMensaje(null); setMalos(new Set()); };
  const ponerEnc = (k, val) => setEnc((x) => ({ ...x, [k]: val }));
  const ponerSub = (k, val) => { setSub((x) => ({ ...x, [k]: val })); setLiq(null); };
  const reiniciar = () => {
    setRuta([]); setAcceso({ usuario: '', clave: '' }); setPrevios({ etapa: 1, tipo: 'Inicial', departamento: '', respaldo: 'DOCUMENTO DE TRANSPORTE' });
    setEnc({ administracion: ADMINISTRACION.codigo }); setSub({ cuotas: '0', otros: '0', ajuste: '0' }); setLiq(null); ir('login');
  };

  const entrar = (e) => {
    e.preventDefault();
    if (acceso.usuario.trim().toUpperCase() !== CREDENCIALES.usuario || acceso.clave !== CREDENCIALES.clave) {
      setMensaje({ tipo: 'error', texto: `Usuario o contraseña incorrectos. Usa el usuario de práctica ${CREDENCIALES.usuario} y la contraseña ${CREDENCIALES.clave}.` });
      return;
    }
    ir('menu');
  };

  const elegir = (opcion) => {
    const esperado = RUTA_MENU[ruta.length];
    if (opcion !== esperado) {
      setMensaje({ tipo: 'error', texto: `«${opcion}» no hace parte de esta práctica. Para ingresar una declaración sigue por «${esperado}».` });
      return;
    }
    const nueva = [...ruta, opcion];
    setRuta(nueva);
    setMensaje(null);
    if (nueva.length === RUTA_MENU.length) ir('previos');
  };

  const salvarEncabezado = () => {
    const errores = validarEncabezado(enc);
    setMalos(new Set(errores.map((x) => x.campo)));
    if (errores.length) { setMensaje({ tipo: 'error', texto: 'El encabezado no se puede guardar todavía:', errores: errores.map((x) => x.mensaje) }); return; }
    ir('subpartida');
    setMensaje({ texto: 'Encabezado guardado. Ahora ingresa la subpartida de la declaración.' });
  };

  const autoliquidar = () => { setLiq(liquidar(sub)); setMensaje(null); };
  const salvarSubpartida = () => {
    const errores = validarSubpartida(sub);
    setMalos(new Set(errores.map((x) => x.campo)));
    if (errores.length) { setMensaje({ tipo: 'error', texto: 'La subpartida no se puede guardar todavía:', errores: errores.map((x) => x.mensaje) }); return; }
    if (!liq) { setMensaje({ tipo: 'error', texto: 'Falta la autoliquidación: pulsa AUTOLIQUIDACIÓN para calcular los tributos antes de guardar.' }); return; }
    ir('fin');
  };

  const indice = PASOS.findIndex(([id]) => id === paso);
  const r = liq || {};
  const gastos = (parseFloat(sub.fletes) || 0) + (parseFloat(sub.seguros) || 0) + (parseFloat(sub.otros) || 0);

  return (
    <>
      <div className="dashboard-header">
        <div className="modal-header-info">
          <span className="modal-badge">Simulador</span>
          <div>
            <h1>SIGLO XXII</h1>
            <p>Practica, paso a paso, cómo se ingresa una declaración de importación en el sistema informático aduanero</p>
          </div>
        </div>
      </div>

      <div className={css.envoltura}>
        <div className={css.pantalla}>
          <div className={css.aviso}>Simulador educativo de BonCloud. No es un sistema de la DIAN ni se conecta con ella; todos los datos son ficticios.</div>
          <div className={css.barra} aria-label="Ruta del menú">
            {paso !== 'login' && [...ruta].reverse().map((o) => <span key={o} className={css.miga}>{o}</span>)}
            {paso !== 'login' && <span>SIGLOXXII</span>}
          </div>
          <div className={`${css.barra} ${css.barra2}`} role="menubar" aria-label="Menú">
            {paso === 'menu' && opcionesMenu(ruta).filter((o) => o !== 'SIGLOXXII').map((o) => (
              <button key={o} type="button" role="menuitem" className={css.opcion} onClick={() => elegir(o)}>{o}</button>
            ))}
          </div>

          <div className={css.cuerpo}>
            <div className={css.centro}>
              {mensaje && (
                <div className={`${css.mensaje}${mensaje.tipo === 'error' ? ` ${css.error}` : ''}`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
                  {mensaje.texto}
                  {mensaje.errores && <ul>{mensaje.errores.map((x) => <li key={x}>{x}</li>)}</ul>}
                </div>
              )}

              {paso === 'login' && (
                <form className={css.login} onSubmit={entrar}>
                  <div>
                    <strong>Usuarios Siglo XXII</strong>
                    <p>Para entrar a la aplicación, usted deberá estar registrado y autorizado. En esta práctica se usa un usuario de ejemplo.</p>
                    <div className={css.marca}>SIGLO XXII</div>
                    <div>ADMINISTRACIÓN</div>
                    <div className={css.admin}>{ADMINISTRACION.codigo} - {ADMINISTRACION.nombre}</div>
                  </div>
                  <div className={css.entrada}>
                    <strong>Entrada</strong>
                    <label htmlFor="sx-usuario">Nombre</label>
                    <input id="sx-usuario" autoComplete="off" value={acceso.usuario} onChange={(e) => setAcceso({ ...acceso, usuario: e.target.value })} />
                    <label htmlFor="sx-clave">Contraseña</label>
                    <input id="sx-clave" type="password" autoComplete="off" value={acceso.clave} onChange={(e) => setAcceso({ ...acceso, clave: e.target.value })} />
                    <button type="submit" className={css.boton}>Entrar</button>
                  </div>
                </form>
              )}

              {paso === 'menu' && (
                <div className={css.bienvenida}>
                  <div>
                    Bienvenido <strong>{CREDENCIALES.usuario}</strong><br />
                    Módulo de [IMPORTACIONES]<br />
                    Administración {ADMINISTRACION.codigo} - {ADMINISTRACION.nombre}<br />
                    Hora de entrada {HOY.toLocaleString('es-CO')}
                  </div>
                  <Calendario />
                </div>
              )}

              {paso === 'previos' && (
                <>
                  <p style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 700 }}>Parámetros previos a la captura del encabezado de la declaración</p>
                  <table className={css.tabla}>
                    <tbody>
                      <tr><td className={css.titulo} colSpan={2}>DECLARACIÓN DE IMPORTACIÓN</td></tr>
                      <tr>
                        <td colSpan={2}>
                          <label className={css.campo} htmlFor="sx-tipo"><span>Tipo de declaración</span>
                            <select id="sx-tipo" value={previos.tipo} disabled={previos.etapa === 2} onChange={(e) => setPrevios({ ...previos, tipo: e.target.value })}>
                              {['Inicial', 'Corrección', 'Modificación', 'Legalización'].map((t) => <option key={t}>{t}</option>)}
                            </select>
                          </label>
                        </td>
                      </tr>
                      {previos.etapa === 2 && (
                        <tr>
                          <td>
                            <label className={css.campo} htmlFor="sx-depto"><span>Departamento importador</span>
                              <select id="sx-depto" value={previos.departamento} onChange={(e) => setPrevios({ ...previos, departamento: e.target.value })}>
                                <option value="" />
                                {DEPARTAMENTOS.map(([c, n]) => <option key={c} value={c}>{n}. Cód: {c}</option>)}
                              </select>
                            </label>
                          </td>
                          <td>
                            <label className={css.campo} htmlFor="sx-respaldo"><span>Tipo de documento respaldo de la importación</span>
                              <select id="sx-respaldo" value={previos.respaldo} onChange={(e) => setPrevios({ ...previos, respaldo: e.target.value })}>
                                {['DOCUMENTO DE TRANSPORTE', 'DECLARACIÓN ANTERIOR', 'PLANILLA DE ENVÍO'].map((t) => <option key={t}>{t}</option>)}
                              </select>
                            </label>
                          </td>
                        </tr>
                      )}
                      <tr><td colSpan={2} className={css.pie}>
                        {previos.etapa === 1 ? (
                          <button type="button" className={css.boton} onClick={() => {
                            if (previos.tipo !== 'Inicial') { setMensaje({ tipo: 'error', texto: 'En el caso se presenta por primera vez la declaración: el tipo es «Inicial».' }); return; }
                            setMensaje(null); setPrevios({ ...previos, etapa: 2 });
                          }}>SIGUIENTE</button>
                        ) : (
                          <button type="button" className={css.boton} onClick={() => {
                            if (previos.departamento !== CASO.encabezado.imp_departamento) { setMensaje({ tipo: 'error', texto: 'El importador del caso está en Cartagena: su departamento es BOLIVAR (13).' }); return; }
                            if (previos.respaldo !== 'DOCUMENTO DE TRANSPORTE') { setMensaje({ tipo: 'error', texto: 'La mercancía llegó con un B/L: el respaldo es el documento de transporte.' }); return; }
                            setEnc((x) => ({ ...x, imp_departamento: previos.departamento }));
                            ir('encabezado');
                          }}>INGRESAR</button>
                        )}
                      </td></tr>
                    </tbody>
                  </table>
                </>
              )}

              {paso === 'encabezado' && <Encabezado v={enc} poner={ponerEnc} malos={malos} onSalvar={salvarEncabezado} />}

              {paso === 'subpartida' && (
                <div className={css.scroll}>
                  <table className={css.tabla}>
                    <tbody>
                      <tr><td className={css.titulo} colSpan={4}>SUBPARTIDA DECLARACIÓN DE IMPORTACIÓN<br /><small>Tipo de declaración: Inicial · Tasa de cambio: {TASA_SEMANA.toLocaleString('es-CO')}</small></td></tr>
                      <tr>
                        <td><Campo nombre="modalidad" rotulo="Modalidad" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="cuotas" rotulo="No. cuotas o meses" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td colSpan={2}><Campo nombre="subpartida" rotulo="Subpartida arancelaria" v={sub} poner={ponerSub} malos={malos} /></td>
                      </tr>
                      <tr>
                        <td><Campo nombre="pais_origen" rotulo="País origen" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="acuerdo" rotulo="Acuerdo" soloLectura valor="NO APLICA" v={sub} /></td>
                        <td><Campo nombre="forma_pago" rotulo="Forma de pago importación" v={sub} poner={ponerSub} malos={malos} opciones={FORMAS_PAGO.map(([c, t]) => [c, `${c}-${t}`])} /></td>
                        <td><Campo nombre="tipo_importacion" rotulo="Tipo de importación" v={sub} poner={ponerSub} malos={malos} opciones={TIPOS_IMPORTACION.map(([c, t]) => [c, `${c}-${t}`])} /></td>
                      </tr>
                      <tr>
                        <td><Campo nombre="pais_compra" rotulo="País de compra" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="peso_bruto" rotulo="Peso bruto kgs" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="peso_neto" rotulo="Peso neto kgs" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="embalaje" rotulo="Embalaje" v={sub} poner={ponerSub} malos={malos} /></td>
                      </tr>
                      <tr>
                        <td><Campo nombre="bultos" rotulo="Bultos" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="subpartidas" rotulo="Subpartidas" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="unidad_comercial" rotulo="Unidad comercial" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="cantidad" rotulo="Cantidad" v={sub} poner={ponerSub} malos={malos} /></td>
                      </tr>
                      <tr>
                        <td><Campo nombre="fob" rotulo="Valor FOB US$" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="fletes" rotulo="Valor fletes US$" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="seguros" rotulo="Valor seguros US$" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="otros" rotulo="Valor otros gastos US$" v={sub} poner={ponerSub} malos={malos} /></td>
                      </tr>
                      <tr>
                        <td colSpan={2}><Campo nombre="sumatoria" rotulo="Sumatoria fletes, seguros y otros gastos US$" soloLectura valor={gastos ? gastos.toLocaleString('es-CO') : '0'} v={sub} /></td>
                        <td><Campo nombre="ajuste" rotulo="Ajuste valor US$" v={sub} poner={ponerSub} malos={malos} /></td>
                        <td><Campo nombre="valor_aduana" rotulo="Valor aduana US$" soloLectura valor={liq ? r.aduanaUSD.toLocaleString('es-CO') : ''} v={sub} /></td>
                      </tr>
                      <tr><td colSpan={4} className={css.pie} style={{ textAlign: 'center' }}><button type="button" className={css.boton} onClick={autoliquidar}>AUTOLIQUIDACIÓN</button></td></tr>
                      <tr><td colSpan={4} style={{ padding: 0 }}>
                        <table className={`${css.tabla} ${css.liq}`} style={{ border: 'none' }}>
                          <tbody>
                            <tr className={css.cab}><td>Concepto</td><td>%</td><td>Base $</td><td>Subtotal $</td></tr>
                            <tr>
                              <td>Arancel</td>
                              <td><input aria-label="Porcentaje de arancel" value={sub.arancel ?? ''} onChange={(e) => ponerSub('arancel', e.target.value)} /></td>
                              <td>{liq ? pesos(r.baseArancel) : ''}</td><td>{liq ? pesos(r.arancel) : ''}</td>
                            </tr>
                            <tr>
                              <td>IVA</td>
                              <td><input aria-label="Porcentaje de IVA" value={sub.iva ?? ''} onChange={(e) => ponerSub('iva', e.target.value)} /></td>
                              <td>{liq ? pesos(r.baseIVA) : ''}</td><td>{liq ? pesos(r.iva) : ''}</td>
                            </tr>
                            {['Salvaguardia', 'Derechos compensatorios', 'Antidumping', 'Rescate', 'Sanción'].map((c) => <tr key={c}><td>{c}</td><td>0</td><td>0</td><td>0</td></tr>)}
                            <tr><td><strong>Total</strong></td><td /><td /><td data-testid="sx-total"><strong>{liq ? pesos(r.total) : ''}</strong></td></tr>
                          </tbody>
                        </table>
                      </td></tr>
                      <tr><td colSpan={4} className={css.pie}><button type="button" className={css.boton} onClick={salvarSubpartida}>SALVAR</button></td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {paso === 'fin' && (
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, lineHeight: 1.6 }}>
                  <p className={css.mensaje} role="status"><strong>Declaración guardada.</strong> Número de radicación de práctica: 48-{HOY.getFullYear()}-000457 (ficticio).</p>
                  <p>Resumen: {sub.cantidad} unidades de la subpartida {sub.subpartida}, modalidad {String(sub.modalidad).toUpperCase()}. Valor en aduana USD {r.aduanaUSD?.toLocaleString('es-CO')}; arancel ${pesos(r.arancel)}; IVA ${pesos(r.iva)}; <strong>total a pagar ${pesos(r.total)}</strong>.</p>
                  <p>En el sistema real, después de guardar se registran los documentos soporte, la DIAN acepta la declaración, se paga en el banco y se obtiene el levante. Esos pasos todavía no hacen parte de esta práctica.</p>
                  <div className={css.acciones}>
                    <button type="button" className={css.boton} onClick={reiniciar}>Hacer la práctica otra vez</button>
                    <Link className={css.boton} to="/formularios/500" style={{ textDecoration: 'none' }}>Ver esta declaración en el formulario 500</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className={css.guia} aria-label="Guía de la práctica">
          <h3>Guía de la práctica</h3>
          <ol className={css.pasos}>
            {PASOS.map(([id, texto], i) => <li key={id} className={i === indice ? css.actual : i < indice ? css.hecho : undefined}>{i + 1}. {texto}</li>)}
          </ol>
          <p className={css.ayuda}>{AYUDA[paso]}</p>
          {(paso === 'encabezado' || paso === 'subpartida') && (
            <div className={css.acciones} style={{ marginBottom: 10 }}>
              <button type="button" className="btn-card" onClick={() => {
                if (paso === 'encabezado') setEnc({ ...CASO.encabezado }); else { setSub({ ...CASO.subpartida }); setLiq(null); }
                setMalos(new Set()); setMensaje({ texto: 'Se llenó la pantalla con los datos del caso. Revísalos contra los documentos y continúa.' });
              }}>Ver la solución de esta pantalla</button>
            </div>
          )}
          <h3>Documentos del caso</h3>
          <p className={css.ayuda}>HidroColombia importa 500 bombas de engranajes de Shanghái a Cartagena (caso del módulo 1 de la Ruta).</p>
          {CASO.documentos.map((d) => (
            <details key={d.titulo} className={css.doc}>
              <summary>{d.titulo}</summary>
              <dl>{d.datos.map(([k, val]) => [<dt key={`${k}t`}>{k}</dt>, <dd key={`${k}d`}>{val}</dd>])}</dl>
            </details>
          ))}
        </aside>
      </div>
    </>
  );
}

function Calendario() {
  const anio = HOY.getFullYear();
  const mes = HOY.getMonth();
  const primero = new Date(anio, mes, 1).getDay();
  const dias = new Date(anio, mes + 1, 0).getDate();
  const celdas = [...Array(primero).fill(null), ...Array.from({ length: dias }, (_, i) => i + 1)];
  while (celdas.length % 7) celdas.push(null);
  const semanas = Array.from({ length: celdas.length / 7 }, (_, i) => celdas.slice(i * 7, i * 7 + 7));
  return (
    <div>
      <table className={css.calendario}>
        <caption>{HOY.toLocaleString('es-CO', { month: 'long' }).replace(/^./, (c) => c.toUpperCase())} {anio}</caption>
        <thead><tr>{['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => <th key={i} scope="col">{d}</th>)}</tr></thead>
        <tbody>{semanas.map((s, i) => <tr key={i}>{s.map((d, j) => <td key={j} className={d === HOY.getDate() ? css.hoy : undefined}>{d ?? ''}</td>)}</tr>)}</tbody>
      </table>
      <small>Tasa para la semana <strong>${TASA_SEMANA.toLocaleString('es-CO')}</strong></small>
    </div>
  );
}

function Encabezado({ v, poner, malos, onSalvar }) {
  const c = (nombre, rotulo, extra = {}) => <Campo nombre={nombre} rotulo={rotulo} v={v} poner={poner} malos={malos} {...extra} />;
  return (
    <div className={css.scroll}>
      <table className={css.tabla}>
        <tbody>
          <tr><td className={css.titulo} colSpan={4}>Declaración de Importación<br /><small>Tipo de declaración: Inicial</small></td></tr>
          <tr><td className={css.seccion} colSpan={4}>Administración y lugar de ingreso</td></tr>
          <tr>
            <td colSpan={2}>{c('administracion', 'Administración (cód.)')}</td>
            <td>{c('lugar_ingreso', 'Lugar de ingreso de las mercancías (cód.)')}</td>
            <td>{c('deposito', 'Depósito')}</td>
          </tr>
          <tr><td className={css.seccion} colSpan={4}>Manifiesto de carga y documento de transporte</td></tr>
          <tr>
            <td>{c('manifiesto', 'Manifiesto de carga: número')}</td>
            <td>{c('manifiesto_fecha', 'Año-mes-día', { placeholder: 'AAAA-MM-DD' })}</td>
            <td>{c('doc_transporte', 'Documento de transporte: número')}</td>
            <td>{c('doc_transporte_fecha', 'Año-mes-día', { placeholder: 'AAAA-MM-DD' })}</td>
          </tr>
          <tr><td className={css.seccion} colSpan={4}>Declarante</td></tr>
          <tr>
            <td colSpan={2}><Campo nombre="declarante" rotulo="Nombre del declarante autorizado" soloLectura valor="HIDROCOLOMBIA S.A.S. (actúa directamente)" v={v} /></td>
            <td>{c('signatario_doc', 'No. documento de identificación signatario')}</td>
            <td>{c('signatario_nombre', 'Apellidos y nombres signatario')}</td>
          </tr>
          <tr><td className={css.seccion} colSpan={4}>Importador</td></tr>
          <tr>
            <td>{c('imp_nit', 'NIT importador')}</td>
            <td><Campo nombre="imp_dv" rotulo="DV" soloLectura valor={dvImportador(v.imp_nit)} v={v} /></td>
            <td colSpan={2}>{c('imp_nombre', 'Nombre')}</td>
          </tr>
          <tr>
            <td colSpan={3}>{c('imp_direccion', 'Dirección importador')}</td>
            <td>{c('imp_telefono', 'Teléfono')}</td>
          </tr>
          <tr>
            <td>{c('imp_ciudad', 'Ciudad (cód.)')}</td>
            <td colSpan={2}>{c('imp_departamento', 'Departamento', { opciones: DEPARTAMENTOS.map(([cod, n]) => [cod, `${n}. Cód: ${cod}`]) })}</td>
            <td>{c('imp_codigo', 'Código', { opciones: CODIGOS_EMPRESA.map((t) => [t, t]) })}</td>
          </tr>
          <tr><td className={css.seccion} colSpan={4}>Exportador o proveedor en el exterior</td></tr>
          <tr>
            <td colSpan={2}>{c('exp_nombre', 'Exportador o proveedor en el exterior')}</td>
            <td>{c('exp_ciudad', 'Ciudad')}</td>
            <td>{c('exp_pais', 'País exportador (cód.)')}</td>
          </tr>
          <tr>
            <td colSpan={2}>{c('exp_direccion', 'Dirección exportador o proveedor')}</td>
            <td>{c('factura', 'No. de factura')}</td>
            <td>{c('factura_fecha', 'Año-mes-día', { placeholder: 'AAAA-MM-DD' })}</td>
          </tr>
          <tr><td className={css.seccion} colSpan={4}>Transporte</td></tr>
          <tr>
            <td>{c('pais_procedencia', 'País procedencia (cód.)')}</td>
            <td>{c('modo_transporte', 'Modo transporte (cód.)')}</td>
            <td>{c('bandera', 'Bandera (cód.)')}</td>
            <td>{c('depto_destino', 'Depto. destino (cód.)')}</td>
          </tr>
          <tr>
            <td colSpan={2}>{c('transportadora', 'Empresa transportadora (código)')}</td>
            <td colSpan={2}><Campo nombre="tasa" rotulo="Tasa de cambio" soloLectura valor={TASA_SEMANA.toLocaleString('es-CO')} v={v} /></td>
          </tr>
          <tr><td colSpan={4} className={css.pie}><button type="button" className={css.boton} onClick={onSalvar}>SALVAR</button></td></tr>
        </tbody>
      </table>
    </div>
  );
}
