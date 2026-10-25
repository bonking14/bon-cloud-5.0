import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { incoterms, columnas } from '../../data/incoterms.js';
import Filtros from '../../components/Filtros.jsx';
import Modal from '../../components/Modal.jsx';
import { drawScene } from './escenaIncoterm.js';
import css from './Incoterms.module.css';

const FILTROS = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'maritimo', texto: 'Solo marítimo' },
  { valor: 'multimodal', texto: 'Multimodal' },
  { valor: 'vendedor', texto: 'Más carga al vendedor' },
  { valor: 'comprador', texto: 'Más carga al comprador' },
];

const claseResp = (v) => (v === 'Vendedor' ? 'resp-vendedor' : 'resp-comprador');

export default function Incoterms() {
  const [params] = useSearchParams();
  const [filtro, setFiltro] = useState('todos');
  // La Ruta de Aprendizaje abre esta página con ?term=FOB
  const [abierto, setAbierto] = useState(() => incoterms.find((i) => i.code === (params.get('term') || '').toUpperCase()) || null);
  const filtrados = filtro === 'todos' ? incoterms : incoterms.filter((i) => i.tipo.includes(filtro));

  return (
    <>
      <div className="dashboard-header">
        <h1>🌍 Guía de Incoterms 2020</h1>
        <p>Términos internacionales de comercio — quién paga qué en cada etapa</p>
      </div>

      <Filtros opciones={FILTROS} activa={filtro} onChange={setFiltro} etiqueta="Filtrar Incoterms" className="filtros" />

      <div className="incoterms-grid">
        {filtrados.map((inc) => (
          <button type="button" key={inc.code} className={`incoterm-card ${css.tarjeta}`} onClick={() => setAbierto(inc)}>
            <div className="incoterm-card-header">
              <div className="incoterm-code">{inc.code}</div>
              <div className="incoterm-name"><strong>{inc.nombre}</strong>{inc.lugar}</div>
              <div className={css.chevron}>▶ Ver animación</div>
            </div>
            <p className="incoterm-desc">{inc.desc}</p>
            <div className="incoterm-tags">{inc.tipo.map((t) => <span key={t} className={`tag tag-${t}`}>{t}</span>)}</div>
            <div className="responsabilidad">
              {Object.entries(inc.responsabilidades).map(([k, v]) => (
                <div key={k} className="resp-row"><span>{k}</span><span className={claseResp(v)}>{v}</span></div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="tabla-section">
        <h2>📊 Tabla comparativa</h2>
        <div className="tabla-scroll">
          <table className="tabla-incoterms">
            <thead>
              <tr><th>Incoterm</th>{columnas.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {incoterms.map((inc) => (
                <tr key={inc.code}>
                  <td><strong className={css.codigo}>{inc.code}</strong></td>
                  {columnas.map((col) => {
                    const v = inc.responsabilidades[col];
                    return <td key={col} className={v === 'Vendedor' ? 'celda-v' : v === 'Comprador' ? 'celda-c' : 'celda-n'}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal abierto={Boolean(abierto)} onCerrar={() => setAbierto(null)} etiqueta={abierto?.nombre}
        claseFondo={css.fondo} claseCaja={css.modal} claseCerrar={css.cerrar}>
        {abierto && <DetalleIncoterm inc={abierto} />}
      </Modal>
    </>
  );
}

function DetalleIncoterm({ inc }) {
  const canvasRef = useRef(null);
  const estado = useRef({ t: 0, pausado: false, velocidad: 1 });
  const [pausado, setPausado] = useState(false);
  const [etapa, setEtapa] = useState('Iniciando...');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    estado.current.t = 0;
    let raf = 0;
    let ultimaEtapa = '';
    const ajustar = () => { canvas.width = canvas.offsetWidth || 800; canvas.height = 260; };
    ajustar();
    window.addEventListener('resize', ajustar);

    const cuadro = () => {
      const e = estado.current;
      const texto = drawScene(ctx, canvas.width, canvas.height, e.t, inc);
      if (texto !== ultimaEtapa) { ultimaEtapa = texto; setEtapa(texto); }
      if (!e.pausado) {
        e.t += 0.0018 * e.velocidad;
        if (e.t > 1.08) e.t = 0; // vuelve a empezar
      }
      raf = requestAnimationFrame(cuadro);
    };
    cuadro();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', ajustar); };
  }, [inc]);

  const alternarPausa = () => { estado.current.pausado = !estado.current.pausado; setPausado(estado.current.pausado); };
  const reiniciar = () => { estado.current.t = 0; estado.current.pausado = false; setPausado(false); };

  return (
    <>
      <div className={css.cabecera}>
        <div className={css.insignia}>{inc.code}</div>
        <div className={css.titulos}><strong>{inc.nombre}</strong><span>{inc.lugar}</span></div>
      </div>
      <p className={css.desc}>{inc.desc}</p>
      <canvas ref={canvasRef} className={css.canvas} height={260} aria-label={`Animación del recorrido ${inc.code}`} />
      <div className={css.controles}>
        <button type="button" className={css.botonAnim} onClick={alternarPausa}>{pausado ? '▶ Reanudar' : '⏸ Pausar'}</button>
        <button type="button" className={css.botonAnim} onClick={reiniciar}>↺ Reiniciar</button>
        <label className={css.velocidad}>
          Velocidad
          <input type="range" min="0.3" max="3" step="0.1" defaultValue="1" onChange={(e) => { estado.current.velocidad = parseFloat(e.target.value); }} />
        </label>
      </div>
      <div className={css.etapa} aria-live="polite"><span className={css.punto} />{etapa}</div>
      <div className={css.resp}>
        {Object.entries(inc.responsabilidades).map(([k, v]) => (
          <div key={k} className={css.respFila}><span>{k}</span><span className={v === 'Vendedor' ? css.rv : css.rc}>{v}</span></div>
        ))}
      </div>
      <div className={css.nota}>{inc.notaCO}</div>
    </>
  );
}
