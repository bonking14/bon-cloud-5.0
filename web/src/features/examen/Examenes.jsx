import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { descargarCertificado, urlVerificacion } from '../../lib/certificado.js';
import css from '../cuenta/Cuenta.module.css';

const reloj = (seg) => `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;

// Examen final de cada módulo. Las preguntas, el tiempo y la calificación los maneja el
// servidor: aquí solo se muestran las preguntas y se envían las respuestas.
export default function Examenes() {
  const { tokenApi, esInvitado } = useAuth();
  const [estado, setEstado] = useState(null);
  const [examen, setExamen] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [msg, setMsg] = useState({ texto: '' });
  const [resta, setResta] = useState(0);
  const enviando = useRef(false);

  const cargar = useCallback(() => {
    if (!tokenApi) return;
    pedir('/examenes', { token: tokenApi }).then(setEstado).catch((err) => setMsg({ texto: err.message, error: true }));
  }, [tokenApi]);
  useEffect(cargar, [cargar]);

  const enviar = useCallback(async () => {
    if (!examen || enviando.current) return;
    enviando.current = true;
    try {
      const r = await pedir(`/examenes/${examen.id}/responder`, { metodo: 'POST', token: tokenApi, cuerpo: { respuestas } });
      setResultado({ ...r, modulo: examen.modulo });
      setMsg({ texto: '' });
    } catch (err) {
      setMsg({ texto: err.message, error: true });
    } finally {
      setExamen(null);
      enviando.current = false;
      cargar();
    }
  }, [examen, respuestas, tokenApi, cargar]);

  // Cuenta regresiva; al llegar a cero se envía lo que haya
  useEffect(() => {
    if (!examen) return undefined;
    const tic = () => {
      const s = Math.max(0, Math.round((new Date(examen.expiraEn) - Date.now()) / 1000));
      setResta(s);
      if (s === 0) enviar();
    };
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [examen, enviar]);

  if (esInvitado || !tokenApi) {
    return (
      <div>
        <div className="dashboard-header" style={{ marginBottom: 20 }}><h1>Examen final</h1></div>
        <p className={css.aviso}>El examen y el certificado necesitan una cuenta, para guardar tus notas a tu nombre. Cierra la sesión de invitado y regístrate: es gratis.</p>
      </div>
    );
  }

  const iniciar = async (m) => {
    if (!m.enCurso && !window.confirm(`Vas a empezar el examen del módulo ${m.modulo}: ${m.preguntas} preguntas en ${m.minutos} minutos. Te quedan ${m.maxIntentos - m.intentosUsados} intentos y este cuenta como uno aunque lo abandones. ¿Empezar?`)) return;
    try {
      const d = await pedir('/examenes', { metodo: 'POST', token: tokenApi, cuerpo: { modulo: m.modulo } });
      setResultado(null);
      setRespuestas(d.examen.preguntas.map(() => null));
      setExamen(d.examen);
      setMsg({ texto: '' });
    } catch (err) { setMsg({ texto: err.message, error: true }); cargar(); }
  };

  // ── Presentando el examen ──
  if (examen) {
    const faltan = respuestas.filter((r) => r === null).length;
    const entregar = () => { if (!faltan || window.confirm(`Te faltan ${faltan} preguntas por responder. ¿Enviar así?`)) enviar(); };
    return (
      <div className={css.pagina}>
        <div className="dashboard-header" style={{ marginBottom: 12 }}>
          <h1>Examen del módulo {examen.modulo}</h1>
          <p>Responde y envía antes de que se acabe el tiempo. No recargues ni cierres la página.</p>
        </div>
        <p className={css.ayudaFija} role="timer" aria-live="off">Tiempo restante: <strong>{reloj(resta)}</strong> · Respondidas: {respuestas.length - faltan} de {respuestas.length}</p>
        {examen.preguntas.map((p, i) => (
          <fieldset key={i} className={css.panel}>
            <legend className={css.pregunta}>{i + 1}. {p.pregunta}</legend>
            {p.opciones.map((o, k) => (
              <label key={k} className={css.opcion}>
                <input type="radio" name={`p${i}`} checked={respuestas[i] === k} onChange={() => setRespuestas((r) => r.map((x, j) => (j === i ? k : x)))} />
                <span>{o}</span>
              </label>
            ))}
          </fieldset>
        ))}
        <button type="button" className="btn btn-primary" style={{ width: 'auto' }} onClick={entregar}>Enviar examen</button>
        <p className={`${css.estado} ${msg.error ? css.error : ''}`} role="status">{msg.texto}</p>
      </div>
    );
  }

  const cert = resultado?.certificado || estado?.certificado;
  const titulos = estado?.modulos.map((m) => m.titulo) || [];
  return (
    <div className={css.pagina}>
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <h1>Examen final</h1>
        <p>Un examen por módulo, con preguntas al azar y tiempo límite. Al aprobar los tres recibes un certificado con código de verificación.</p>
      </div>
      <p className={`${css.estado} ${msg.error ? css.error : ''}`} role="status">{msg.texto}</p>

      {resultado && (
        <section className={css.panel} aria-labelledby="t-resultado">
          <h2 id="t-resultado">{resultado.aprobado ? 'Aprobaste' : 'No aprobaste'} el examen del módulo {resultado.modulo}: {resultado.nota} sobre 100</h2>
          <p className={css.pista} style={{ margin: 0 }}>Acertaste {resultado.aciertos} de {resultado.total}. Se aprueba con 70.</p>
          <ol className={css.revision}>
            {resultado.revision.map((r, i) => (
              <li key={i}>
                <strong className={r.acierto ? css.si : css.error}>{r.acierto ? 'Correcta' : r.respondida ? 'Incorrecta' : 'Sin responder'}.</strong> {r.pregunta}
                {!r.acierto && <><br /><small>{r.explicacion}</small></>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {cert && (
        <section className={css.panel} aria-labelledby="t-cert">
          <h2 id="t-cert">Tu certificado</h2>
          <div className={css.fila}>
            <span>A nombre de: <strong>{cert.nombre}</strong></span>
            <span>Nota promedio: <strong>{cert.nota}</strong></span>
            <span>Código: <span className={css.codigo}>{cert.codigo}</span></span>
          </div>
          <div className={css.acciones} style={{ margin: '14px 0 0' }}>
            <button type="button" className="btn-card btn-calcular" onClick={() => descargarCertificado(cert, titulos)}>Descargar certificado (PDF)</button>
            <Link className="btn-card" to={`/verificar/${cert.codigo}`}>Ver página de verificación</Link>
          </div>
          <p className={css.pista} style={{ margin: '10px 0 0' }}>Quien reciba tu certificado puede comprobarlo en {urlVerificacion(cert.codigo)}</p>
        </section>
      )}

      {!estado ? <p className={css.pista}>Cargando…</p> : estado.modulos.map((m) => {
        const restantes = m.maxIntentos - m.intentosUsados;
        const puede = m.enCurso || (!m.aprobado && m.leccionesCompletas && restantes > 0);
        return (
          <section key={m.modulo} className={css.panel} aria-label={`Examen del módulo ${m.modulo}`}>
            <h2>Módulo {m.modulo}: {m.titulo}</h2>
            <div className={css.fila}>
              <span>{m.preguntas} preguntas · {m.minutos} minutos</span>
              <span>Intentos usados: <strong>{m.intentosUsados} de {m.maxIntentos}</strong></span>
              <span>Mejor nota: <strong>{m.mejorNota === null ? '—' : m.mejorNota}</strong></span>
              <span className={m.aprobado ? css.si : css.no}>{m.aprobado ? 'Aprobado' : 'Sin aprobar'}</span>
            </div>
            {!m.aprobado && !m.leccionesCompletas && <p className={css.pista} style={{ margin: '10px 0 0' }}>Te faltan {m.leccionesFaltantes} lecciones de este módulo en la <Link to="/curso">Ruta Guiada</Link> para poder presentarlo.</p>}
            {!m.aprobado && m.leccionesCompletas && restantes <= 0 && !m.enCurso && <p className={css.pista} style={{ margin: '10px 0 0' }}>Ya usaste todos los intentos. Habla con tu profesor o con el administrador.</p>}
            {puede && <button type="button" className="btn-card btn-calcular" style={{ marginTop: 12 }} onClick={() => iniciar(m)}>{m.enCurso ? 'Continuar examen en curso' : 'Presentar examen'}</button>}
          </section>
        );
      })}
    </div>
  );
}
