import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useProgreso } from '../../hooks/ProgresoContext.jsx';
import { lecciones } from '../../data/lecciones.js';
import { cargarTrmOficial } from '../../lib/trm.js';
import { modulos } from '../../app/modulos.js';
import Icono from '../../components/Icono.jsx';
import css from './Dashboard.module.css';

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

function TarjetaRuta() {
  const { completadas, total, siguientePendiente } = useProgreso();
  const hechas = completadas.length;
  const siguiente = lecciones.find((l) => l.id === siguientePendiente());
  const [ancho, setAncho] = useState(0);
  // La barra crece desde 0 al cargar
  useEffect(() => {
    const id = requestAnimationFrame(() => setAncho(Math.round((hechas / total) * 100)));
    return () => cancelAnimationFrame(id);
  }, [hechas, total]);

  let texto = `Sigue un embarque de práctica de Shanghái a Cartagena en ${total} lecciones.`;
  let boton = 'Empezar';
  let destino = '/curso';
  if (hechas === total) {
    texto = `Terminaste las ${total} lecciones. Puedes repasarlas o descargar tu constancia.`;
    boton = 'Repasar';
  } else if (hechas > 0) {
    texto = `Sigue con la lección ${siguiente.orden}: ${siguiente.titulo}`;
    boton = 'Continuar';
    destino = `/curso?leccion=${siguiente.id}`;
  }

  return (
    <section className="ruta-card" aria-labelledby="ruta-card-titulo">
      <div className="ruta-card-texto">
        <h3 id="ruta-card-titulo">Ruta de Aprendizaje</h3>
        <p>{texto}</p>
      </div>
      <div className="ruta-card-progreso">
        <div className="ruta-card-barra" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={hechas} aria-label="Lecciones aprobadas">
          <div className="ruta-card-relleno" style={{ width: `${ancho}%` }} />
        </div>
        <span>{hechas} de {total} lecciones</span>
      </div>
      <Link className="btn-card ruta-card-boton" to={destino}>{boton}</Link>
    </section>
  );
}

export default function Dashboard() {
  const { usuario } = useAuth();
  return (
    <>
      <div className="dashboard-header">
        <h1>Bienvenido, {usuario?.nombre} 👋</h1>
        <p>Plataforma de aprendizaje en comercio exterior — Puerto de Cartagena</p>
      </div>

      <div className={css.widgets}>
        <Reloj />
        <EstadoPuerto />
      </div>

      <TarjetaRuta />

      <div className={css.apps}>
        {modulos.map((m, i) => (
          <Link key={m.ruta} to={m.ruta} className={css.app} style={{ '--retraso': `${i * 40}ms` }}>
            <span className={css.icono} style={{ background: m.color }}><Icono d={m.icono} tamano={22} /></span>
            <span className={css.titulo}>{m.titulo}</span>
            <span className={css.desc}>{m.descripcion}</span>
            <span className={css.accion}>{m.accion} →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
