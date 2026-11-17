import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import {
  ADMINISTRACION, CASO, CODIGOS_EMPRESA, CREDENCIALES, DEPARTAMENTOS, FORMAS_PAGO, PRACTICA, RUTA_MENU, TASA_SEMANA, TIPOS_IMPORTACION,
  dvImportador, liquidar, opcionesMenu, usuarioDePractica, validarEncabezado, validarSubpartida,
} from '../../lib/sigloxxii.js';
import css from './SigloXXII.module.css';

// SIGLO XXII: el estudiante hace, paso a paso, el trámite de una declaración de importación
// como en el sistema informático aduanero: ingresa con usuario y contraseña, recorre el menú,
// llena el encabezado y la subpartida, autoliquida y guarda. El recorrido y los campos son los
// del sistema real; la apariencia es moderna. Es un simulador: no se conecta con la DIAN y
// todos los datos son ficticios.
const PASOS = [
  ['login', 'Ingreso'],
  ['menu', 'Menú'],
  ['previos', 'Parámetros previos'],
  ['encabezado', 'Encabezado'],
  ['subpartida', 'Subpartida'],
  ['fin', 'Guardada'],
];
const AYUDA = {
  login: 'En el sistema real, el usuario lo asigna la DIAN a cada agencia de aduanas o usuario aduanero.',
  menu: `Para abrir una declaración nueva sigue esta ruta: ${RUTA_MENU.join(' → ')}.`,
  previos: 'Antes del encabezado el sistema pregunta el tipo de declaración (Inicial), el departamento del importador y el documento que respalda la importación (el documento de transporte).',
  encabezado: 'Revisa el inventario del documento de transporte y llena el encabezado con los documentos del caso. Los códigos van como aparecen en los documentos. Al guardar, el sistema te dirá qué falta o qué no coincide.',
  subpartida: 'Llena los datos de la mercancía y los valores. Escribe los porcentajes de arancel e IVA y pulsa «Autoliquidar» para que el sistema calcule los tributos. Después, «Guardar».',
  fin: 'Terminaste el recorrido. En el sistema real seguirían los documentos soporte, la aceptación, el pago y el levante.',
};
const pesos = (n) => Math.round(n || 0).toLocaleString('es-CO');
const HOY = new Date();
// Del mensaje de validación («Rótulo: falta. Pista») queda lo que va debajo del campo
const sinRotulo = (m) => m.replace(/^[^:]+:\s*/, '').replace(/^./, (c) => c.toUpperCase());

function Campo({ nombre, rotulo, v, poner, malos, ancho = 1, soloLectura, valor, opciones, placeholder }) {
  const id = `sx-${nombre}`;
  const error = malos?.get(nombre);
  return (
    <div className={`${css.campo}${error ? ` ${css.mal}` : ''}`} style={{ gridColumn: `span ${ancho}` }}>
      <label htmlFor={id}>{rotulo}</label>
      {opciones ? (
        <select id={id} value={v[nombre] ?? ''} aria-invalid={Boolean(error)} onChange={(e) => poner(nombre, e.target.value)}>
          <option value="">Selecciona…</option>
          {opciones.map(([c, t]) => <option key={c} value={c}>{t}</option>)}
        </select>
      ) : (
        <input id={id} type="text" autoComplete="off" placeholder={placeholder} readOnly={soloLectura} aria-invalid={Boolean(error)}
          value={soloLectura ? valor ?? '' : v[nombre] ?? ''} onChange={soloLectura ? undefined : (e) => poner(nombre, e.target.value)} />
      )}
      {error && <small className={css.errorCampo}>{error}</small>}
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <fieldset className={css.seccion}>
      <legend>{titulo}</legend>
      <div className={css.rejilla}>{children}</div>
    </fieldset>
  );
}

export default function SigloXXII() {
  const { usuario, tokenApi } = useAuth();
  // Cada cuenta tiene su propio usuario del simulador; el invitado usa el de ejemplo
  const miUsuario = usuarioDePractica(usuario);
  // Lo que se le reporta al profesor: pantallas devueltas con errores y si usó la solución
  const [errores, setErrores] = useState(0);
  const [conSolucion, setConSolucion] = useState(false);
  const [registro, setRegistro] = useState(null); // null | 'guardando' | 'ok' | 'fallo'
  const enviado = useRef(false);
  const [paso, setPaso] = useState('login');
  const [ruta, setRuta] = useState([]);
  const [mensaje, setMensaje] = useState(null); // { texto, errores?, tipo }
  const [acceso, setAcceso] = useState({ usuario: '', clave: '' });
  const [previos, setPrevios] = useState({ etapa: 1, tipo: 'Inicial', departamento: '', respaldo: 'DOCUMENTO DE TRANSPORTE' });
  const [enc, setEnc] = useState({ administracion: ADMINISTRACION.codigo });
  const [sub, setSub] = useState({ cuotas: '0', otros: '0', ajuste: '0' });
  const [liq, setLiq] = useState(null);
  const [malos, setMalos] = useState(new Map());
  const avisoRef = useRef(null);
  // Un error lleva la vista al aviso, que puede quedar arriba del formulario largo
  useEffect(() => { if (mensaje?.tipo === 'error') avisoRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' }); }, [mensaje]);

  const ir = (p) => { setPaso(p); setMensaje(null); setMalos(new Map()); };
  const ponerEnc = (k, val) => setEnc((x) => ({ ...x, [k]: val }));
  const ponerSub = (k, val) => { setSub((x) => ({ ...x, [k]: val })); setLiq(null); };
  const fallo = (m) => { setErrores((n) => n + 1); setMensaje(m); };
  const reiniciar = () => {
    setErrores(0); setConSolucion(false); setRegistro(null); enviado.current = false;
    setRuta([]); setAcceso({ usuario: '', clave: '' }); setPrevios({ etapa: 1, tipo: 'Inicial', departamento: '', respaldo: 'DOCUMENTO DE TRANSPORTE' });
    setEnc({ administracion: ADMINISTRACION.codigo }); setSub({ cuotas: '0', otros: '0', ajuste: '0' }); setLiq(null); ir('login');
  };

  const entrar = (e) => {
    e.preventDefault();
    if (acceso.usuario.trim().toUpperCase() !== miUsuario || acceso.clave !== CREDENCIALES.clave) {
      fallo({ tipo: 'error', texto: `Usuario o contraseña incorrectos. Tu usuario de práctica es ${miUsuario} y la contraseña es ${CREDENCIALES.clave}.` });
      return;
    }
    ir('menu');
  };

  const elegir = (opcion) => {
    const esperado = RUTA_MENU[ruta.length];
    if (opcion !== esperado) {
      fallo({ tipo: 'error', texto: `«${opcion}» no hace parte de esta práctica. Para ingresar una declaración sigue por «${esperado}».` });
      return;
    }
    const nueva = [...ruta, opcion];
    setRuta(nueva);
    setMensaje(null);
    if (nueva.length === RUTA_MENU.length) ir('previos');
  };

  const marcar = (faltas) => setMalos(new Map(faltas.map((x) => [x.campo, sinRotulo(x.mensaje)])));
  const salvarEncabezado = () => {
    const faltas = validarEncabezado(enc);
    marcar(faltas);
    if (faltas.length) { fallo({ tipo: 'error', texto: `Tiene ${faltas.length} ${faltas.length === 1 ? 'inconsistencia' : 'inconsistencias'}: el encabezado no se puede guardar todavía.`, errores: faltas.map((x) => x.mensaje) }); return; }
    ir('subpartida');
    setMensaje({ texto: 'Encabezado guardado. Ahora ingresa la subpartida de la declaración.' });
  };

  const autoliquidar = () => { setLiq(liquidar(sub)); setMensaje(null); };
  const salvarSubpartida = () => {
    const faltas = validarSubpartida(sub);
    marcar(faltas);
    if (faltas.length) { fallo({ tipo: 'error', texto: `Tiene ${faltas.length} ${faltas.length === 1 ? 'inconsistencia' : 'inconsistencias'}: la subpartida no se puede guardar todavía.`, errores: faltas.map((x) => x.mensaje) }); return; }
    if (!liq) { fallo({ tipo: 'error', texto: 'Falta la autoliquidación: pulsa «Autoliquidar» para calcular los tributos antes de guardar.' }); return; }
    ir('fin');
  };

  const verSolucion = () => {
    if (paso === 'encabezado') setEnc({ ...CASO.encabezado }); else { setSub({ ...CASO.subpartida }); setLiq(null); }
    setConSolucion(true);
    setMalos(new Map());
    setMensaje({ texto: 'Se llenó la pantalla con los datos del caso. Revísalos contra los documentos y continúa.' });
  };

  // Al llegar al final, la práctica se registra una sola vez a nombre de la cuenta
  useEffect(() => {
    if (paso !== 'fin' || !tokenApi || enviado.current) return;
    enviado.current = true;
    setRegistro('guardando');
    pedir('/practicas', { metodo: 'POST', token: tokenApi, cuerpo: { practica: PRACTICA, errores, conSolucion } })
      .then(() => setRegistro('ok'))
      .catch(() => setRegistro('fallo'));
  }, [paso, tokenApi, errores, conSolucion]);

  const indice = PASOS.findIndex(([id]) => id === paso);
  const r = liq || {};
  const gastos = (parseFloat(sub.fletes) || 0) + (parseFloat(sub.seguros) || 0) + (parseFloat(sub.otros) || 0);
  const conSesion = paso !== 'login';

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

      <ol className={css.pasos} aria-label="Pasos de la práctica">
        {PASOS.map(([id, texto], i) => (
          <li key={id} className={paso === 'fin' ? css.hecho : i === indice ? css.actual : i < indice ? css.hecho : undefined} aria-current={i === indice ? 'step' : undefined}>
            <span className={css.numPaso}>{i < indice || paso === 'fin' ? '✓' : i + 1}</span>{texto}
          </li>
        ))}
      </ol>

      <div className={css.envoltura}>
        <section className={css.app} aria-label="Pantalla del sistema">
          <header className={css.barra}>
            <div className={css.marca}><span className={css.logo} aria-hidden="true">XXII</span>SIGLO XXII <small>· Importaciones</small></div>
            {conSesion && (
              <div className={css.sesion}>
                <span className={css.chip}>Adm. {ADMINISTRACION.codigo} · {ADMINISTRACION.nombre}</span>
                <span className={css.chip}>TRM semana ${TASA_SEMANA.toLocaleString('es-CO')}</span>
                <span className={css.usuario} aria-label="Usuario">{miUsuario}</span>
              </div>
            )}
          </header>
          {conSesion && ruta.length > 0 && (
            <nav className={css.migas} aria-label="Ruta del menú">
              {ruta.map((o, i) => <span key={o}>{i > 0 && <span aria-hidden="true"> › </span>}{o}</span>)}
            </nav>
          )}
          <div className={css.aviso}>Simulador educativo de BonCloud. No es un sistema de la DIAN ni se conecta con ella; todos los datos son ficticios.</div>

          <div className={css.cuerpo}>
            {mensaje && (
              <div ref={avisoRef} className={`${css.mensaje}${mensaje.tipo === 'error' ? ` ${css.error}` : ''}`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
                <strong>{mensaje.texto}</strong>
                {mensaje.errores && (
                  <details>
                    <summary>Ver la lista · cada campo marcado en rojo dice qué revisar</summary>
                    <ul>{mensaje.errores.map((x) => <li key={x}>{x}</li>)}</ul>
                  </details>
                )}
              </div>
            )}

            {paso === 'login' && (
              <form className={css.login} onSubmit={entrar}>
                <div className={css.loginLogo} aria-hidden="true">XXII</div>
                <h2>Iniciar sesión</h2>
                <p className={css.suave}>Para entrar a la aplicación, usted deberá estar registrado y autorizado.</p>
                <div className={css.campo}>
                  <label htmlFor="sx-usuario">Nombre</label>
                  <input id="sx-usuario" autoComplete="off" placeholder="Tu usuario" value={acceso.usuario} onChange={(e) => setAcceso({ ...acceso, usuario: e.target.value })} />
                </div>
                <div className={css.campo}>
                  <label htmlFor="sx-clave">Contraseña</label>
                  <input id="sx-clave" type="password" autoComplete="off" placeholder="••••••••" value={acceso.clave} onChange={(e) => setAcceso({ ...acceso, clave: e.target.value })} />
                </div>
                <button type="submit" className={css.primario}>Entrar</button>
                <p className={css.suave}>Administración {ADMINISTRACION.codigo} · {ADMINISTRACION.nombre}</p>
              </form>
            )}

            {paso === 'menu' && (
              <>
                <div className={css.bienvenida}>
                  <div>
                    <h2>Bienvenido, {miUsuario}</h2>
                    <p className={css.suave}>Módulo de importaciones · Hora de entrada {HOY.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <h3 className={css.subtitulo}>{ruta.length ? ruta[ruta.length - 1] : 'Módulos'}</h3>
                <div className={css.menu} role="menu" aria-label="Menú">
                  {opcionesMenu(ruta).filter((o) => o !== 'SIGLOXXII').map((o) => (
                    <button key={o} type="button" role="menuitem" aria-label={o} className={css.opcion} onClick={() => elegir(o)}>
                      <span className={css.opcionIcono} aria-hidden="true">{o.charAt(0)}</span>
                      <span>{o}</span>
                      <span className={css.flecha} aria-hidden="true">›</span>
                    </button>
                  ))}
                </div>
                {ruta.length > 0 && <button type="button" className={css.secundario} onClick={() => { setRuta(ruta.slice(0, -1)); setMensaje(null); }}>← Volver</button>}
              </>
            )}

            {paso === 'previos' && (
              <div className={css.tarjeta}>
                <h2>Declaración de importación</h2>
                <p className={css.suave}>Parámetros previos a la captura del encabezado de la declaración</p>
                <div className={css.rejilla}>
                  <div className={css.campo} style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="sx-tipo">Tipo de declaración</label>
                    <select id="sx-tipo" value={previos.tipo} disabled={previos.etapa === 2} onChange={(e) => setPrevios({ ...previos, tipo: e.target.value })}>
                      {['Inicial', 'Corrección', 'Modificación', 'Legalización'].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  {previos.etapa === 2 && (
                    <>
                      <div className={css.campo} style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="sx-depto">Departamento importador</label>
                        <select id="sx-depto" value={previos.departamento} onChange={(e) => setPrevios({ ...previos, departamento: e.target.value })}>
                          <option value="">Selecciona…</option>
                          {DEPARTAMENTOS.map(([c, n]) => <option key={c} value={c}>{n} · Cód. {c}</option>)}
                        </select>
                      </div>
                      <div className={css.campo} style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="sx-respaldo">Tipo de documento respaldo de la importación</label>
                        <select id="sx-respaldo" value={previos.respaldo} onChange={(e) => setPrevios({ ...previos, respaldo: e.target.value })}>
                          {['DOCUMENTO DE TRANSPORTE', 'DECLARACIÓN ANTERIOR', 'PLANILLA DE ENVÍO'].map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div className={css.acciones}>
                  {previos.etapa === 1 ? (
                    <button type="button" className={css.primario} onClick={() => {
                      if (previos.tipo !== 'Inicial') { fallo({ tipo: 'error', texto: 'En el caso se presenta por primera vez la declaración: el tipo es «Inicial».' }); return; }
                      setMensaje(null); setPrevios({ ...previos, etapa: 2 });
                    }}>Siguiente</button>
                  ) : (
                    <button type="button" className={css.primario} onClick={() => {
                      if (previos.departamento !== CASO.encabezado.imp_departamento) { fallo({ tipo: 'error', texto: 'El importador del caso está en Cartagena: su departamento es BOLIVAR (13).' }); return; }
                      if (previos.respaldo !== 'DOCUMENTO DE TRANSPORTE') { fallo({ tipo: 'error', texto: 'La mercancía llegó con un B/L: el respaldo es el documento de transporte.' }); return; }
                      setEnc((x) => ({ ...x, imp_departamento: previos.departamento }));
                      ir('encabezado');
                    }}>Continuar</button>
                  )}
                </div>
              </div>
            )}

            {paso === 'encabezado' && (
              <>
                <Inventario />
                <Encabezado v={enc} poner={ponerEnc} malos={malos} onSalvar={salvarEncabezado} />
              </>
            )}

            {paso === 'subpartida' && (
              <div className={css.tarjeta}>
                <div className={css.cabecera}>
                  <h2>Subpartida de la declaración</h2>
                  <span className={css.chip}>Inicial · TRM {TASA_SEMANA.toLocaleString('es-CO')}</span>
                </div>
                <Seccion titulo="Mercancía">
                  <Campo nombre="modalidad" rotulo="Modalidad" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="cuotas" rotulo="No. cuotas o meses" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="subpartida" rotulo="Subpartida arancelaria" v={sub} poner={ponerSub} malos={malos} ancho={2} />
                  <Campo nombre="pais_origen" rotulo="País origen" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="acuerdo" rotulo="Acuerdo" soloLectura valor="No aplica" v={sub} />
                  <Campo nombre="pais_compra" rotulo="País de compra" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="unidad_comercial" rotulo="Unidad comercial" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="forma_pago" rotulo="Forma de pago importación" v={sub} poner={ponerSub} malos={malos} ancho={2} opciones={FORMAS_PAGO.map(([c, t]) => [c, `${c} · ${t}`])} />
                  <Campo nombre="tipo_importacion" rotulo="Tipo de importación" v={sub} poner={ponerSub} malos={malos} ancho={2} opciones={TIPOS_IMPORTACION.map(([c, t]) => [c, `${c} · ${t}`])} />
                </Seccion>
                <Seccion titulo="Bultos y pesos">
                  <Campo nombre="peso_bruto" rotulo="Peso bruto kg" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="peso_neto" rotulo="Peso neto kg" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="embalaje" rotulo="Embalaje" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="bultos" rotulo="Bultos" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="subpartidas" rotulo="Subpartidas" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="cantidad" rotulo="Cantidad" v={sub} poner={ponerSub} malos={malos} />
                </Seccion>
                <Seccion titulo="Valores en dólares">
                  <Campo nombre="fob" rotulo="Valor FOB" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="fletes" rotulo="Fletes" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="seguros" rotulo="Seguros" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="otros" rotulo="Otros gastos" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="sumatoria" rotulo="Fletes, seguros y otros" soloLectura valor={gastos ? gastos.toLocaleString('es-CO') : '0'} v={sub} />
                  <Campo nombre="ajuste" rotulo="Ajuste valor" v={sub} poner={ponerSub} malos={malos} />
                  <Campo nombre="valor_aduana" rotulo="Valor en aduana" soloLectura valor={liq ? r.aduanaUSD.toLocaleString('es-CO') : ''} placeholder="Se calcula al autoliquidar" v={sub} ancho={2} />
                </Seccion>

                <fieldset className={css.seccion}>
                  <legend>Autoliquidación</legend>
                  <div className={css.tasas}>
                    <Campo nombre="arancel" rotulo="Arancel %" v={sub} poner={ponerSub} malos={malos} />
                    <Campo nombre="iva" rotulo="IVA %" v={sub} poner={ponerSub} malos={malos} />
                    <button type="button" className={css.secundario} onClick={autoliquidar}>Autoliquidar</button>
                  </div>
                  <div className={css.scroll}>
                    <table className={css.liq}>
                      <thead><tr><th scope="col">Concepto</th><th scope="col">%</th><th scope="col">Base $</th><th scope="col">Subtotal $</th></tr></thead>
                      <tbody>
                        <tr><td>Arancel</td><td>{sub.arancel || '—'}</td><td>{liq ? pesos(r.baseArancel) : '—'}</td><td>{liq ? pesos(r.arancel) : '—'}</td></tr>
                        <tr><td>IVA</td><td>{sub.iva || '—'}</td><td>{liq ? pesos(r.baseIVA) : '—'}</td><td>{liq ? pesos(r.iva) : '—'}</td></tr>
                        {['Salvaguardia', 'Derechos compensatorios', 'Antidumping', 'Rescate', 'Sanción'].map((c) => <tr key={c} className={css.cero}><td>{c}</td><td>0</td><td>0</td><td>0</td></tr>)}
                      </tbody>
                      <tfoot><tr><td colSpan={3}>Total</td><td data-testid="sx-total">{liq ? pesos(r.total) : '—'}</td></tr></tfoot>
                    </table>
                  </div>
                </fieldset>
                <div className={css.acciones}><button type="button" className={css.primario} onClick={salvarSubpartida}>Guardar</button></div>
              </div>
            )}

            {paso === 'fin' && (
              <div className={css.tarjeta}>
                <div className={css.exito} role="status"><span aria-hidden="true">✓</span> Declaración guardada</div>
                <p className={css.suave}>Número de radicación de práctica: 48-{HOY.getFullYear()}-000457 (ficticio)</p>
                <div className={css.cifras}>
                  <div><span>Valor en aduana</span><strong>USD {r.aduanaUSD?.toLocaleString('es-CO')}</strong></div>
                  <div><span>Arancel</span><strong>${pesos(r.arancel)}</strong></div>
                  <div><span>IVA</span><strong>${pesos(r.iva)}</strong></div>
                  <div className={css.destacada}><span>Total a pagar</span><strong>${pesos(r.total)}</strong></div>
                </div>
                <p>Resumen: {sub.cantidad} unidades de la subpartida {sub.subpartida}, modalidad {String(sub.modalidad).toUpperCase()}; total a pagar ${pesos(r.total)}.</p>
                <p className={css.suave} aria-live="polite" data-testid="sx-registro">
                  {!tokenApi && 'Entraste como invitado: esta práctica no queda registrada. Con una cuenta, tu profesor puede ver que la terminaste.'}
                  {tokenApi && registro === 'guardando' && 'Registrando tu práctica…'}
                  {tokenApi && registro === 'ok' && `Tu práctica quedó registrada${conSolucion ? ' (usaste la solución en alguna pantalla)' : ''}: el sistema te devolvió ${errores} ${errores === 1 ? 'pantalla' : 'pantallas'} con errores. Tu profesor puede verla en el panel de su grupo.`}
                  {tokenApi && registro === 'fallo' && 'No se pudo registrar la práctica en el servidor. Revisa la conexión y vuelve a hacerla.'}
                </p>
                <p className={css.suave}>En el sistema real, después de guardar se registran los documentos soporte, la DIAN acepta la declaración, se paga en el banco y se obtiene el levante. Esos pasos todavía no hacen parte de esta práctica.</p>
                <div className={css.acciones}>
                  <button type="button" className={css.primario} onClick={reiniciar}>Hacer la práctica otra vez</button>
                  <Link className={css.secundario} to="/formularios/500">Ver esta declaración en el formulario 500</Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className={css.guia} aria-label="Guía de la práctica">
          <h3>Guía de la práctica</h3>
          <p className={css.ayuda}>
            {paso === 'login' && <>Tu usuario de práctica es <strong>{miUsuario}</strong> y la contraseña es <strong>{CREDENCIALES.clave}</strong>. {tokenApi ? 'Es solo tuyo: al terminar, la práctica queda registrada a tu nombre. ' : 'Como invitado usas el usuario de ejemplo y la práctica no queda registrada. '}</>}
            {AYUDA[paso]}
          </p>
          {(paso === 'encabezado' || paso === 'subpartida') && (
            <button type="button" className="btn-card" style={{ marginBottom: 12 }} onClick={verSolucion}>Ver la solución de esta pantalla</button>
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

// Consulta de inventario por documento de transporte: con qué peso y bultos cuenta la carga en el depósito
function Inventario() {
  const i = CASO.inventario;
  return (
    <details className={css.inventario} open>
      <summary>Consulta de inventario del documento de transporte {i.documento}</summary>
      <dl className={css.datosInv}>
        <div><dt>Manifiesto</dt><dd>{i.manifiesto}</dd></div>
        <div><dt>Transportador</dt><dd>{i.transportador}</dd></div>
        <div><dt>Depósito</dt><dd>{i.deposito}</dd></div>
        <div><dt>Consignatario</dt><dd>{i.consignatario}</dd></div>
        <div><dt>Fecha del manifiesto</dt><dd>{i.fechaManifiesto}</dd></div>
        <div><dt>Vencen los términos</dt><dd>{i.vencimiento} · Prórroga: {i.prorroga}</dd></div>
        <div><dt>Ubicación</dt><dd>{i.ubicacion}</dd></div>
        <div><dt>Peso disponible</dt><dd>{i.peso.toLocaleString('es-CO')} kg</dd></div>
        <div><dt>Cantidad disponible</dt><dd>{i.cantidad} bulto{i.cantidad === 1 ? '' : 's'}</dd></div>
      </dl>
      <p className={css.suave}>La declaración no puede amparar más peso ni más bultos de los que tiene disponibles el documento de transporte.</p>
    </details>
  );
}

function Encabezado({ v, poner, malos, onSalvar }) {
  const c = (nombre, rotulo, extra = {}) => <Campo nombre={nombre} rotulo={rotulo} v={v} poner={poner} malos={malos} {...extra} />;
  return (
    <div className={css.tarjeta}>
      <div className={css.cabecera}>
        <h2>Encabezado de la declaración</h2>
        <span className={css.chip}>Tipo de declaración: Inicial</span>
      </div>
      <Seccion titulo="Administración y lugar de ingreso">
        {c('administracion', 'Administración (cód.)')}
        {c('lugar_ingreso', 'Lugar de ingreso (cód.)')}
        {c('deposito', 'Depósito', { ancho: 2 })}
      </Seccion>
      <Seccion titulo="Manifiesto de carga y documento de transporte">
        {c('manifiesto', 'Manifiesto: número')}
        {c('manifiesto_fecha', 'Manifiesto: fecha', { placeholder: 'AAAA-MM-DD' })}
        {c('doc_transporte', 'Documento de transporte: número')}
        {c('doc_transporte_fecha', 'Documento de transporte: fecha', { placeholder: 'AAAA-MM-DD' })}
      </Seccion>
      <Seccion titulo="Declarante">
        <Campo nombre="declarante" rotulo="Declarante autorizado" soloLectura valor="HidroColombia S.A.S. (actúa directamente)" v={v} ancho={2} />
        {c('signatario_doc', 'Documento del signatario')}
        {c('signatario_nombre', 'Apellidos y nombres del signatario')}
      </Seccion>
      <Seccion titulo="Importador">
        {c('imp_nit', 'NIT importador')}
        <Campo nombre="imp_dv" rotulo="DV" soloLectura valor={dvImportador(v.imp_nit)} v={v} />
        {c('imp_nombre', 'Nombre', { ancho: 2 })}
        {c('imp_direccion', 'Dirección', { ancho: 3 })}
        {c('imp_telefono', 'Teléfono')}
        {c('imp_ciudad', 'Ciudad (cód.)')}
        {c('imp_departamento', 'Departamento', { opciones: DEPARTAMENTOS.map(([cod, n]) => [cod, `${n} · Cód. ${cod}`]), ancho: 2 })}
        {c('imp_codigo', 'Código', { opciones: CODIGOS_EMPRESA.map((t) => [t, t]) })}
      </Seccion>
      <Seccion titulo="Exportador o proveedor en el exterior">
        {c('exp_nombre', 'Exportador o proveedor', { ancho: 2 })}
        {c('exp_ciudad', 'Ciudad')}
        {c('exp_pais', 'País exportador (cód.)')}
        {c('exp_direccion', 'Dirección', { ancho: 2 })}
        {c('factura', 'No. de factura')}
        {c('factura_fecha', 'Fecha de factura', { placeholder: 'AAAA-MM-DD' })}
      </Seccion>
      <Seccion titulo="Transporte">
        {c('pais_procedencia', 'País procedencia (cód.)')}
        {c('modo_transporte', 'Modo de transporte (cód.)')}
        {c('bandera', 'Bandera (cód.)')}
        {c('depto_destino', 'Depto. destino (cód.)')}
        {c('transportadora', 'Empresa transportadora (cód.)', { ancho: 2 })}
        <Campo nombre="tasa" rotulo="Tasa de cambio" soloLectura valor={TASA_SEMANA.toLocaleString('es-CO')} v={v} ancho={2} />
      </Seccion>
      <div className={css.acciones}><button type="button" className={css.primario} onClick={onSalvar}>Guardar</button></div>
    </div>
  );
}
