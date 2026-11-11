import { useState } from 'react';
import { useCampos } from './contexto.js';

// Hoja de un formulario oficial de la DIAN. El trazado (líneas, sombreados, textos y
// celdas de cada casilla) se extrae del PDF oficial con scripts/extraer_formulario.py;
// aquí se dibuja en SVG y se ponen los campos encima, cada uno en su casilla.
//
// `campos` configura las casillas por número:
//   { nombre }            campo de texto guardado en el estado del formulario
//   { valor }             valor calculado, solo lectura
//   { opciones }          lista desplegable: ['FOB', ...] o [['C100', 'C100 Ordinaria'], ...]
//   { lista }             id de un <datalist> para autocompletar
//   { sugerencias }       códigos sugeridos: [['C100', 'Ordinaria'], ...]; se escribe el código
//   { caja: [x, y, w, h] } posición a mano, en puntos del PDF, si la automática no sirve
//   { partes: [...] }     varios campos dentro de la misma casilla (por ejemplo año, mes y día)
//   { omitir: true }      casilla sin campo (espacios reservados a la DIAN)
// `sombra`: color de los sombreados oscuros del original (en el 560 son claros)
// `soloConfiguradas`: no crea campos libres para las casillas que no estén en `campos`
// `oculta` / `imprimir`: hojas de un formulario de varias hojas (se ve una a la vez)
// Las casillas que no aparecen en `campos` quedan como campo libre.
const COLOR = { azul: '#005e93', gris: '#b9bcc2', blanco: '#fff' };
const TINTA = '#1d1d1b';
const LINEA = '#005e93';

// Dónde va el campo dentro de la celda: debajo del rótulo si hay espacio, o a su derecha
export function cajaDe(c) {
  if (!c.r && c.lx === undefined) return [c.x + 0.8, c.y + 0.8, c.w - 1.6, c.h - 1.6];
  const abajo = c.y + c.h;
  if (abajo - c.ly >= 8.5) {
    const x = c.ox ? c.ox + 1.5 : c.x + 1;
    const y = Math.max(c.ly + 1.4, abajo - 13);
    return [x, y, c.x + c.w - x - 1, abajo - y - 0.8];
  }
  const x = Math.min(c.lx + 2, c.x + c.w - 6);
  return [x, c.y + 0.8, c.x + c.w - x - 1, c.h - 1.6];
}

function Campo({ num, def, caja, rotulo, W, H, onAyuda }) {
  const { valores, poner, errores } = useCampos();
  const [x, y, w, h] = caja;
  const estilo = { left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${(w / W) * 100}%`, height: `${(h / H) * 100}%` };
  const etiqueta = def.etiqueta || rotulo || `Casilla ${num}`;
  const comunes = {
    style: estilo,
    'aria-label': etiqueta,
    title: num ? `Casilla ${num}: ${etiqueta}` : etiqueta,
    onFocus: () => onAyuda(num),
    'data-casilla': num || undefined,
  };
  const clases = ['ho-campo', def.derecha && 'ho-derecha', def.centro && 'ho-centro', def.grande && 'ho-grande'];

  if (def.valor !== undefined) {
    return <input type="text" readOnly tabIndex={-1} value={def.valor} className={[...clases, 'ho-calculado'].filter(Boolean).join(' ')} {...comunes} />;
  }
  const error = def.nombre && errores.has(def.nombre);
  const clase = [...clases, error && 'ho-error'].filter(Boolean).join(' ');
  const ligado = def.nombre
    ? { name: def.nombre, value: valores[def.nombre] ?? '', onChange: (e) => (def.alCambiar ? def.alCambiar(e.target.value) : poner(def.nombre, def.formato ? def.formato(e.target.value) : e.target.value)) }
    : {};
  if (def.opciones) {
    const items = def.opciones.map((o) => (Array.isArray(o) ? o : [o, o]));
    return (
      <select className={clase} {...comunes} {...ligado}>
        <option value="" />
        {items.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    );
  }
  if (def.multilinea) return <textarea className={clase} {...comunes} {...ligado} />;
  if (def.sugerencias) {
    const id = `sug-${def.nombre || num}`;
    return (
      <>
        <input type="text" className={clase} list={id} autoComplete="off" {...comunes} {...ligado} />
        <datalist id={id}>{def.sugerencias.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</datalist>
      </>
    );
  }
  return <input type="text" className={clase} list={def.lista} inputMode={def.inputMode} maxLength={def.max} placeholder={def.placeholder} autoComplete="off" {...comunes} {...ligado} />;
}

export default function HojaOficial({ trazado, numero, titulo, campos = {}, extras = [], pie, sombra = LINEA, soloConfiguradas = false, oculta = false, imprimir = true }) {
  const { explicaciones } = useCampos();
  const [ayuda, setAyuda] = useState(null);
  const { w: W, h: H, celdas } = trazado;

  const lista = [];
  Object.entries(celdas).forEach(([num, celda]) => {
    if (soloConfiguradas && !campos[num]) return;
    const def = campos[num] || {};
    if (def.omitir) return;
    const base = def.caja || cajaDe(celda);
    if (def.partes) {
      def.partes.forEach((p, i) => lista.push({ clave: `${num}-${i}`, num, def: p, caja: p.caja, rotulo: p.etiqueta || `${celda.r || `Casilla ${num}`} (${i + 1})` }));
      return;
    }
    if (base[2] < 3 || base[3] < 3) return;
    lista.push({ clave: num, num, def, caja: base, rotulo: celda.r });
  });
  extras.forEach((e, i) => lista.push({ clave: `x${i}`, num: e.casilla, def: e, caja: e.caja, rotulo: e.etiqueta }));

  const texto = ayuda && explicaciones[ayuda];
  return (
    <div className={['ho-envoltura', oculta && 'ho-oculta', !imprimir && 'no-imprimir'].filter(Boolean).join(' ')}>
      <p className="ho-ayuda no-imprimir" role="status">
        {texto
          ? <><strong>Casilla {ayuda}.</strong> {texto}</>
          : ayuda ? <><strong>Casilla {ayuda}.</strong> {celdas[ayuda]?.r || 'Sin explicación para esta casilla.'}</> : 'Haz clic en una casilla para ver qué se escribe en ella.'}
      </p>
      <div className="hoja-oficial" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="ho-trazado" aria-hidden="true" fontFamily="Arial, Helvetica, 'Liberation Sans', sans-serif">
          {(trazado.capas || []).map(([x, y, w, h, f, b], i) => <rect key={`c${i}`} x={x} y={y} width={w} height={h} fill={f || 'none'} stroke={b || 'none'} strokeWidth="0.5" />)}
          {trazado.fondos.filter((f) => f.w >= 4 && f.h >= 4).map((f, i) => <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} fill={f.k || (f.c === 'oscuro' ? sombra : '#e9eef5')} />)}
          <text className="ho-marca" x={W / 2} y={H / 2} transform={`rotate(-52 ${W / 2} ${H / 2})`} textAnchor="middle">SIMULADOR EDUCATIVO · SIN VALIDEZ</text>
          {trazado.lineas.map(([o, pos, a, b], i) => (o === 'h'
            ? <line key={i} x1={a} y1={pos} x2={b} y2={pos} stroke={trazado.linea || LINEA} strokeWidth="0.57" />
            : <line key={i} x1={pos} y1={a} x2={pos} y2={b} stroke={trazado.linea || LINEA} strokeWidth="0.57" />))}
          {trazado.textos.map((t, i) => (
            <text key={i} x={t.x} y={t.y} fontSize={t.s} fontWeight={t.b ? 700 : 400} fill={COLOR[t.c] || TINTA}
              textAnchor={t.a === 'm' ? 'middle' : undefined} textLength={t.t.length > 1 ? t.w : undefined} lengthAdjust="spacingAndGlyphs">{t.t}</text>
          ))}
          {trazado.verticales.map((t, i) => (
            <text key={i} transform={`translate(${t.x + 2} ${(t.y0 + t.y1) / 2}) rotate(-90)`} textAnchor="middle" fontSize={t.s} fontWeight="700" fill={COLOR[t.c] || TINTA}>{t.t}</text>
          ))}
          {/* Cabecera: marca y número del formulario */}
          <text x="28" y="50" fontSize="21" fontWeight="700" letterSpacing="3" fill="#2c2d45">DIAN</text>
          <rect x="484" y="26.5" width="105" height="32" rx="3" fill={trazado.numero || '#38648f'} />
          <text x="536.5" y="54" fontSize="33" fontWeight="700" fill="#fff" textAnchor="middle">{numero}</text>
          {/* En el 600 el título viene dibujado como trazo, no como texto */}
          {trazado.capas && <rect x="136" y="27" width="248" height="30" fill="#fff" />}
          {trazado.capas && <text x="260" y="45" fontSize="10" textAnchor="middle" fill={TINTA}>{titulo.split(',')[0]}</text>}
          <title>{titulo}</title>
        </svg>
        {lista.map(({ clave, ...resto }) => <Campo key={clave} {...resto} W={W} H={H} onAyuda={setAyuda} />)}
      </div>
      {pie}
    </div>
  );
}

// Pestañas para elegir la hoja visible de un formulario de varias hojas
export function SelectorHojas({ hojas, actual, onCambiar }) {
  return (
    <div className="ho-hojas no-imprimir" role="tablist" aria-label="Hojas del formulario">
      {hojas.map(([id, texto]) => (
        <button key={id} type="button" role="tab" aria-selected={id === actual} className={`btn-card${id === actual ? ' activo' : ''}`} onClick={() => onCambiar(id)}>{texto}</button>
      ))}
    </div>
  );
}
