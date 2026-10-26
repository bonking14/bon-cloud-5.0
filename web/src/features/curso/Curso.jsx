import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { lecciones, modulos } from '../../data/lecciones.js';
import { useProgreso } from '../../hooks/ProgresoContext.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import Modal from '../../components/Modal.jsx';
import FichaGlosario from '../../components/FichaGlosario.jsx';
import { buscarTermino } from '../../lib/glosario.js';
import { descargarConstancia } from '../../lib/constancia.js';
import MapaRuta from './MapaRuta.jsx';
import Quiz from './Quiz.jsx';

const TOTAL = lecciones.length;
// Lección que sigue dentro del mismo módulo (null si es la última del módulo)
const siguienteEnModulo = (lec) => lecciones.find((l) => l.modulo === lec.modulo && l.orden > lec.orden) || null;

export default function Curso() {
  const progreso = useProgreso();
  const { usuario } = useAuth();
  const avisar = useToast();
  const [params] = useSearchParams();
  const [actualId, setActualId] = useState(() => {
    const id = parseInt(params.get('leccion'), 10);
    return id >= 1 && id <= TOTAL && progreso.estaDesbloqueada(id) ? id : progreso.siguientePendiente();
  });
  const [termino, setTermino] = useState(null);
  const detalleRef = useRef(null);
  const tituloRef = useRef(null);
  const desplazar = useRef(false);

  const hechas = progreso.completadas.length;
  const leccionActual = lecciones.find((l) => l.id === actualId);
  const modulo = modulos.find((m) => m.id === leccionActual.modulo);
  const delModulo = lecciones.filter((l) => l.modulo === modulo.id);
  const cambiarModulo = (id) => abrir(progreso.siguientePendiente(id), { scroll: false });
  const porcentaje = Math.round((hechas / TOTAL) * 100);
  const nombre = usuario?.nombre && !usuario.invitado ? usuario.nombre : 'Estudiante BonCloud';

  const abrir = (id, { scroll = true } = {}) => {
    if (!progreso.estaDesbloqueada(id)) {
      avisar('Esta lección se desbloquea al aprobar la anterior.', 'warning');
      return;
    }
    desplazar.current = scroll;
    setActualId(id);
  };

  useEffect(() => {
    if (!desplazar.current) return;
    desplazar.current = false;
    detalleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    tituloRef.current?.focus({ preventScroll: true });
  }, [actualId]);

  const reiniciar = () => {
    if (!window.confirm('¿Reiniciar tu progreso en la Ruta de Aprendizaje? Se borrarán las lecciones aprobadas.')) return;
    progreso.reiniciar();
    setActualId(1);
    avisar('Progreso reiniciado.', 'info');
  };

  const constancia = () => descargarConstancia(nombre, TOTAL);
  // Al cerrar un módulo: constancia si ya está todo, o paso al módulo que falta
  const cerrarModulo = () => {
    const pendiente = lecciones.find((l) => !progreso.completadas.includes(l.id));
    if (!pendiente) { constancia(); return; }
    const m = modulos.find((x) => x.id === pendiente.modulo);
    avisar(`Para la constancia te falta el módulo ${m.id}: ${m.titulo}.`, 'info');
    cambiarModulo(m.id);
  };

  const alAprobar = (leccion) => {
    if (!progreso.completar(leccion.id)) avisar('No se pudo guardar tu progreso en este navegador.', 'warning');
    else avisar(`Lección ${leccion.orden} aprobada`, 'success');
  };

  return (
    <>
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <h1 className="curso-titulo-pagina">Ruta de Aprendizaje de Comercio Internacional</h1>
        <p>Aprende paso a paso con dos casos reales de práctica: una importación desde Shanghái y una exportación de café a la Unión Europea.</p>
      </div>

      <section className="curso-progress-header-panel" aria-labelledby="titulo-progreso">
        <div className="curso-progress-top-info">
          <div className="curso-progress-title">
            <h3 id="titulo-progreso">Tu progreso</h3>
            <p>Aprueba las {TOTAL} lecciones de los dos módulos para descargar tu constancia de práctica.</p>
          </div>
          <div className="curso-progress-actions">
            {hechas > 0 && <button type="button" className="curso-btn-secundario" onClick={reiniciar}>Reiniciar progreso</button>}
            {hechas === TOTAL && <button type="button" className="curso-btn-constancia" onClick={constancia}>Descargar constancia (PDF)</button>}
          </div>
        </div>
        <div className="curso-progress-bar-wrapper">
          <div className="curso-progress-bar-labels">
            <span>{hechas} de {TOTAL} lecciones completadas</span>
            <span>{porcentaje}%</span>
          </div>
          <div className="curso-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={hechas} aria-label="Lecciones completadas">
            <div className="curso-progress-fill" style={{ width: `${porcentaje}%` }} />
          </div>
        </div>
      </section>

      <div className="curso-modulos" role="tablist" aria-label="Módulos de la Ruta">
        {modulos.map((m) => {
          const ids = lecciones.filter((l) => l.modulo === m.id).map((l) => l.id);
          const listas = ids.filter((id) => progreso.estaCompletada(id)).length;
          return (
            <button key={m.id} type="button" role="tab" aria-selected={m.id === modulo.id}
              className={`curso-modulo-tab${m.id === modulo.id ? ' activo' : ''}`} onClick={() => cambiarModulo(m.id)}>
              <span className="curso-modulo-num">Módulo {m.id}</span>
              <span className="curso-modulo-titulo">{m.titulo}</span>
              <span className="curso-modulo-sub">{m.subtitulo} · {listas} de {ids.length}</span>
            </button>
          );
        })}
      </div>

      <section className="mapa-ruta-wrapper" aria-labelledby="titulo-mapa">
        <h3 id="titulo-mapa" className="mapa-titulo">Ruta del embarque</h3>
        <p className="mapa-sub">{modulo.caso}. El embarque avanza cada vez que apruebas una etapa. Toca una etapa desbloqueada para ir a sus lecciones.</p>
        <MapaRuta key={modulo.id} modulo={modulo.id} actualId={actualId} onAbrir={abrir} />
      </section>

      <div className="curso-grid-layout">
        <nav className="lecciones-sidebar-list" aria-label="Lecciones del curso">
          {delModulo.map((lec) => <TarjetaLeccion key={lec.id} lec={lec} activa={lec.id === actualId} onAbrir={abrir} />)}
        </nav>
        <div ref={detalleRef}>
          <DetalleLeccion
            key={actualId}
            leccion={leccionActual}
            caso={modulo.caso}
            tituloRef={tituloRef}
            onAprobar={alAprobar}
            onSiguiente={(id) => abrir(id)}
            onConstancia={cerrarModulo}
            onTermino={(t) => {
              const ficha = buscarTermino(t);
              if (ficha) setTermino(ficha);
              else avisar(`"${t}" todavía no está en el glosario.`, 'info');
            }}
          />
        </div>
      </div>

      <Modal abierto={Boolean(termino)} onCerrar={() => setTermino(null)} etiqueta={termino?.termino}
        claseFondo="glosario-modal-overlay" claseCaja="glosario-modal" claseCerrar="glosario-modal-close">
        {termino && <FichaGlosario termino={termino} onRelacionado={(rel) => setTermino(buscarTermino(rel) || termino)} />}
      </Modal>
    </>
  );
}

function TarjetaLeccion({ lec, activa, onAbrir }) {
  const { estaCompletada, estaDesbloqueada } = useProgreso();
  const completada = estaCompletada(lec.id);
  const desbloqueada = estaDesbloqueada(lec.id);
  const [estado, icono, texto] = completada ? ['completada', '✓', 'Completada']
    : desbloqueada ? ['disponible', '📖', 'Disponible'] : ['bloqueada', '🔒', 'Bloqueada'];

  return (
    <button type="button" className={`leccion-card card-state-${estado} ${activa ? 'card-activa' : ''}`}
      aria-disabled={!desbloqueada} aria-current={activa ? 'step' : undefined} onClick={() => onAbrir(lec.id)}>
      <span className="leccion-card-header">
        <span className="leccion-numero">Lección {lec.orden} de {TOTAL}</span>
        <span className={`leccion-nivel-badge nivel-${lec.nivel.toLowerCase()}`}>{lec.nivel}</span>
      </span>
      <span className="leccion-card-titulo">{lec.titulo}</span>
      <span className="leccion-card-meta">
        <span>{lec.duracionMin} min</span>
        <span className={`leccion-estado-badge estado-${estado}`}><span aria-hidden="true">{icono}</span> {texto}</span>
      </span>
    </button>
  );
}

function DetalleLeccion({ leccion, caso, tituloRef, onAprobar, onSiguiente, onConstancia, onTermino }) {
  const { estaCompletada } = useProgreso();
  const navigate = useNavigate();
  const contenido = useMemo(() => ({ __html: leccion.contenido }), [leccion]);

  // Los términos del glosario vienen dentro del HTML de la lección como
  // <span class="term-glosario" data-glosario="CIF">: se abren con clic o con teclado.
  const contenidoRef = useRef(null);
  useEffect(() => {
    contenidoRef.current?.querySelectorAll('.term-glosario[data-glosario]').forEach((el) => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
    });
  }, [leccion]);
  const abrirTermino = (e) => {
    const el = e.target.closest('.term-glosario[data-glosario]');
    if (!el || (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    onTermino(el.getAttribute('data-glosario'));
  };

  const practicar = () => {
    const { moduloUrl, parametros } = leccion.practica;
    const q = parametros && Object.keys(parametros).length ? `?${new URLSearchParams(parametros)}` : '';
    navigate(moduloUrl + q);
  };

  return (
    <article className="leccion-detalle-wrapper fade-in-content" aria-labelledby="titulo-leccion">
      <header className="leccion-header-panel">
        <div className="leccion-header-meta">
          <span className="leccion-badge-paso">Paso {leccion.orden} de {TOTAL}</span>
          <span className={`leccion-badge-nivel nivel-${leccion.nivel.toLowerCase()}`}>{leccion.nivel}</span>
          <span className="leccion-badge-tiempo">{leccion.duracionMin} min de lectura</span>
          {estaCompletada(leccion.id) && <span className="leccion-badge-aprobado">Lección aprobada</span>}
        </div>
        <h2 className="leccion-main-titulo" id="titulo-leccion" tabIndex={-1} ref={tituloRef}>{leccion.titulo}</h2>
      </header>

      <section className="leccion-block block-objetivos">
        <h3>Qué vas a aprender</h3>
        <ul>{leccion.objetivos.map((o) => <li key={o}>{o}</li>)}</ul>
      </section>

      <section className="leccion-block block-caso">
        <div className="caso-header">
          <span className="caso-icono" aria-hidden="true">🚢</span>
          <div>
            <h4>Qué pasa con tu embarque en esta etapa</h4>
            <p className="caso-sub">{caso}</p>
          </div>
        </div>
        <div className="caso-body"><p>{leccion.etapaCaso}</p></div>
      </section>

      <section className="leccion-block block-contenido">
        <h3>Contenido y normativa</h3>
        {/* El HTML de las lecciones es contenido propio del proyecto (data/lecciones.js) */}
        <div className="contenido-html" ref={contenidoRef} dangerouslySetInnerHTML={contenido} onClick={abrirTermino} onKeyDown={abrirTermino} />
      </section>

      {leccion.practica && (
        <section className="leccion-block block-practica">
          <div className="practica-inner">
            <div>
              <h4>Practica con la herramienta</h4>
              <p>{leccion.practica.texto}</p>
            </div>
            <button type="button" className="btn btn-primary btn-practica-modulo" onClick={practicar}>Abrir el módulo</button>
          </div>
        </section>
      )}

      <Quiz leccion={leccion} siguiente={siguienteEnModulo(leccion)} onAprobar={onAprobar} onSiguiente={onSiguiente} onConstancia={onConstancia} />
    </article>
  );
}
