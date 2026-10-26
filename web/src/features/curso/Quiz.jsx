import { useMemo, useRef, useState } from 'react';

export const UMBRAL_APROBACION = 0.7;

function barajar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Evaluación de una lección: las opciones se barajan en cada intento,
// cada pregunta se responde una vez y muestra su explicación.
// siguiente: lección que sigue en el mismo módulo; si es null, la lección cierra el módulo.
export default function Quiz({ leccion, siguiente, onAprobar, onSiguiente, onConstancia }) {
  const [intento, setIntento] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const seccionRef = useRef(null);
  const preguntas = leccion.quiz;
  const minimo = Math.ceil(preguntas.length * UMBRAL_APROBACION);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ordenes = useMemo(() => preguntas.map((q) => barajar(q.opciones.map((_, i) => i))), [preguntas, intento]);

  const respondidas = Object.keys(respuestas).length;
  const terminado = respondidas === preguntas.length;
  const aciertos = preguntas.filter((q, i) => respuestas[i] === q.correcta).length;
  const aprobado = terminado && aciertos >= minimo;

  const responder = (qIndex, opIndex) => {
    if (respuestas[qIndex] !== undefined) return;
    const nuevas = { ...respuestas, [qIndex]: opIndex };
    setRespuestas(nuevas);
    if (Object.keys(nuevas).length === preguntas.length) {
      const bien = preguntas.filter((q, i) => nuevas[i] === q.correcta).length;
      if (bien >= minimo) onAprobar(leccion);
    }
  };

  const reintentar = () => {
    setRespuestas({});
    setIntento((n) => n + 1);
    seccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  return (
    <section className="leccion-block block-quiz" ref={seccionRef}>
      <h3>Evaluación de la lección</h3>
      <p className="quiz-instruccion">{preguntas.length} preguntas. Necesitas {minimo} respuestas correctas para aprobar y desbloquear el siguiente paso.</p>

      <div className="quiz-container">
        {preguntas.map((q, qIndex) => {
          const elegida = respuestas[qIndex];
          const respondida = elegida !== undefined;
          const acierto = elegida === q.correcta;
          return (
            <fieldset className="quiz-pregunta-card" key={`${intento}-${qIndex}`}>
              <legend className="pregunta-titulo">{qIndex + 1}. {q.pregunta}</legend>
              <div className="quiz-opciones-list">
                {ordenes[qIndex].map((opIndex, pos) => {
                  let clase = 'quiz-opcion-btn';
                  if (respondida) {
                    clase += ' disabled';
                    if (opIndex === q.correcta) clase += ' opcion-correcta';
                    else if (opIndex === elegida) clase += ' opcion-incorrecta';
                  }
                  return (
                    <button type="button" key={opIndex} className={clase} disabled={respondida} onClick={() => responder(qIndex, opIndex)}>
                      <span className="opcion-letra" aria-hidden="true">{String.fromCharCode(65 + pos)}</span>
                      <span className="opcion-texto">{q.opciones[opIndex]}</span>
                    </button>
                  );
                })}
              </div>
              <div className={`quiz-explicacion-box${respondida ? ` visible ${acierto ? 'exp-correcta' : 'exp-incorrecta'}` : ''}`} aria-live="polite">
                {respondida && (
                  <>
                    <div className="exp-header">{acierto ? 'Correcto' : 'Incorrecto'}</div>
                    <p className="exp-texto">{q.explicacion}</p>
                  </>
                )}
              </div>
            </fieldset>
          );
        })}

        <div className={`quiz-resultado-panel${terminado ? ` visible ${aprobado ? 'resultado-aprobado' : 'resultado-reprobado'}` : ''}`} role="status" aria-live="polite">
          {terminado && aprobado && (
            <>
              <div className="resultado-header">
                <div>
                  <h4>Aprobaste esta lección</h4>
                  <p>Respondiste bien {aciertos} de {preguntas.length} (necesitabas {minimo}).</p>
                </div>
              </div>
              <div className="resultado-acciones">
                {siguiente ? (
                  <button type="button" className="btn btn-primary" onClick={() => onSiguiente(siguiente.id)}>Ir a la lección {siguiente.orden}</button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={onConstancia}>Terminaste el módulo: ver mi constancia</button>
                )}
              </div>
            </>
          )}
          {terminado && !aprobado && (
            <>
              <div className="resultado-header">
                <div>
                  <h4>Todavía no apruebas</h4>
                  <p>Respondiste bien {aciertos} de {preguntas.length} y necesitas {minimo}. Repasa el contenido y vuelve a intentarlo: las opciones cambian de orden.</p>
                </div>
              </div>
              <div className="resultado-acciones">
                <button type="button" className="btn btn-secondary" onClick={reintentar}>Reintentar evaluación</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
