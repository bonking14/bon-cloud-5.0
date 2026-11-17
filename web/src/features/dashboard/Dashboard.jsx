import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useProgreso } from '../../hooks/ProgresoContext.jsx';
import { lecciones, modulos as modulosRuta } from '../../data/lecciones.js';
import { cargarTrmOficial } from '../../lib/trm.js';
import { modulos } from '../../app/modulos.js';
import Icono from '../../components/Icono.jsx';
import css from './Dashboard.module.css';

// Inicio: el reloj de Cartagena y los datos del puerto, la siguiente lección, el avance por
// módulo y las herramientas agrupadas.
const ZONA = 'America/Bogota';

function useReloj() {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return ahora;
}

function Reloj() {
  const ahora = useReloj();
  const hora = ahora.toLocaleTimeString('es-CO', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const fecha = ahora.toLocaleDateString('es-CO', { timeZone: ZONA, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <section className={css.widget}>
      <span className={css.etiqueta}>Cartagena, Colombia</span>
      <span className={css.hora}>{hora}</span>
      <span className={css.fecha}>{fecha.charAt(0).toUpperCase() + fecha.slice(1)}</span>
    </section>
  );
}

function EstadoPuerto() {
  const [trm, setTrm] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    cargarTrmOficial().then(setTrm).catch(() => setError(true));
  }, []);
  return (
    <section className={css.widget}>
      <span className={css.etiqueta}>Puerto de Cartagena <em className={css.insignia}>Datos de referencia</em></span>
      <div className={css.stats}>
        <div><strong>{trm ? `$${trm.valor.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : error ? 'Sin conexión' : '—'}</strong><span>{trm ? `TRM oficial · ${trm.fecha}` : 'TRM oficial'}</span></div>
        <div><strong>48</strong><span>Código aduana DIAN</span></div>
        <div><strong>SPRC · Contecar</strong><span>Terminales</span></div>
      </div>
    </section>
  );
}

function SiguienteLeccion() {
  const { completadas, total, siguientePendiente } = useProgreso();
  const hechas = completadas.length;
  const siguiente = lecciones.find((l) => l.id === siguientePendiente());
  const modulo = modulosRuta.find((m) => m.id === siguiente.modulo);
  const terminado = hechas === total;
  return (
    <section className={`${css.panel} ${css.siguiente}`} aria-labelledby="siguiente-titulo">
      <span className={css.eyebrow}>{terminado ? 'Ruta terminada' : hechas ? 'Siguiente lección' : 'Para empezar'}</span>
      <h2 id="siguiente-titulo">
        {terminado ? `Aprobó las ${total} lecciones de la ruta` : `Lección ${siguiente.orden} · ${siguiente.titulo}`}
      </h2>
      {!terminado && (
        <p className={css.meta}>
          <span>Módulo {modulo.id} · {modulo.titulo}</span>
          <span>{siguiente.duracionMin} minutos</span>
          <span>Nivel {siguiente.nivel.toLowerCase()}</span>
        </p>
      )}
      <p className={css.texto}>{terminado ? 'Puede repasar cualquier lección o presentar el examen final de cada módulo.' : modulo.caso.replace(/^Caso: /, 'Caso de práctica: ')}.</p>
      <div className={css.acciones}>
        <Link className="btn btn-primary" style={{ width: 'auto' }} to={terminado ? '/examen' : `/curso?leccion=${siguiente.id}`}>
          {terminado ? 'Ir al examen final' : hechas ? 'Continuar la ruta' : 'Empezar la ruta'}
        </Link>
        <span className={css.cuenta}>{hechas} de {total} lecciones aprobadas</span>
      </div>
    </section>
  );
}

function TablaModulos() {
  const { completadas, siguientePendiente } = useProgreso();
  return (
    <section className={css.panel} aria-labelledby="modulos-titulo">
      <div className={css.cabeceraPanel}>
        <h2 id="modulos-titulo">Módulos de la ruta</h2>
        <small>Cada módulo termina con un examen de 10 preguntas</small>
      </div>
      <div className={css.desplazable}>
        <table className={css.tabla}>
          <thead><tr><th scope="col">Módulo</th><th scope="col">Caso de práctica</th><th scope="col">Avance</th><th scope="col">Estado</th><th scope="col"><span className={css.oculto}>Acción</span></th></tr></thead>
          <tbody>
            {modulosRuta.map((m) => {
              const ids = lecciones.filter((l) => l.modulo === m.id).map((l) => l.id);
              const hechas = ids.filter((id) => completadas.includes(id)).length;
              const estado = hechas === ids.length ? ['Terminado', css.eOk] : hechas ? ['En curso', css.eCurso] : ['Pendiente', css.ePend];
              return (
                <tr key={m.id}>
                  <td><b>{m.id}. {m.titulo}</b><small>{m.subtitulo}</small></td>
                  <td>{m.caso.replace(/^Caso: (.)/, (_, letra) => letra.toUpperCase())}</td>
                  <td className={css.avance}>
                    <span className={css.barra} role="progressbar" aria-valuemin={0} aria-valuemax={ids.length} aria-valuenow={hechas} aria-label={`Avance del módulo ${m.id}`}>
                      <i style={{ width: `${(hechas / ids.length) * 100}%` }} />
                    </span>
                    <span className={css.cifra}>{hechas} / {ids.length}</span>
                  </td>
                  <td><span className={`${css.estado} ${estado[1]}`}>{estado[0]}</span></td>
                  <td><Link to={`/curso?leccion=${siguientePendiente(m.id)}`}>{hechas === ids.length ? 'Repasar' : hechas ? 'Continuar' : 'Abrir'}</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Herramientas({ grupo, titulo, nota }) {
  return (
    <section className={css.panel} aria-labelledby={`herr-${grupo}`}>
      <div className={css.cabeceraPanel}>
        <h2 id={`herr-${grupo}`}>{titulo}</h2>
        <small>{nota}</small>
      </div>
      <ul className={css.herramientas}>
        {modulos.filter((m) => m.grupo === grupo).map((m) => (
          <li key={m.ruta}>
            <Link to={m.ruta} className={css.herramienta}>
              <span className={css.icono}><Icono d={m.icono} tamano={20} /></span>
              <span className={css.textoHerr}><b>{m.titulo}</b><small>{m.descripcion}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Dashboard() {
  const { usuario } = useAuth();
  return (
    <>
      <div className="dashboard-header">
        <h1>Bienvenido, {usuario?.nombre} 👋</h1>
        <p>Plataforma educativa de comercio exterior, con el Puerto de Cartagena como escenario</p>
      </div>

      <div className={css.widgets}>
        <Reloj />
        <EstadoPuerto />
      </div>

      <SiguienteLeccion />

      <TablaModulos />

      <div className={css.columnas}>
        <Herramientas grupo="practicar" titulo="Practicar" nota="Simuladores sin validez ante la DIAN" />
        <Herramientas grupo="consultar" titulo="Consultar" nota="Material de referencia" />
      </div>
    </>
  );
}
