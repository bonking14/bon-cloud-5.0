import { useCampos } from './contexto.js';
import Casilla from './Casilla.jsx';

// Campo de texto. Con `nombre` queda en el estado del formulario (lo usan los
// cálculos, la validación y el caso de práctica); sin nombre es un campo libre.
// `formato` transforma lo que se escribe (por ejemplo, dejar solo dígitos).
export function Entrada({ nombre, formato, className = '', ...props }) {
  const { valores, poner, errores } = useCampos();
  if (!nombre) return <input type="text" className={className || undefined} {...props} />;
  const clase = [className, errores.has(nombre) && 'error'].filter(Boolean).join(' ') || undefined;
  return (
    <input type="text" {...props} className={clase} name={nombre}
      value={valores[nombre] ?? ''} onChange={(e) => poner(nombre, formato ? formato(e.target.value) : e.target.value)} />
  );
}

// Lista desplegable. `opciones`: ['FOB', ...] o [['C100', 'C100 Ordinaria'], ...]
export function Selector({ nombre, opciones, vacio = '-', className = '', ...props }) {
  const { valores, poner, errores } = useCampos();
  const items = opciones.map((o) => (Array.isArray(o) ? o : [o, o]));
  const lista = [<option key="" value="">{vacio}</option>, ...items.map(([v, t]) => <option key={v} value={v}>{t}</option>)];
  if (!nombre) return <select className={className || undefined} {...props}>{lista}</select>;
  const clase = [className, errores.has(nombre) && 'error'].filter(Boolean).join(' ') || undefined;
  return (
    <select {...props} className={clase} name={nombre} value={valores[nombre] ?? ''} onChange={(e) => poner(nombre, e.target.value)}>
      {lista}
    </select>
  );
}

// Valor calculado (solo lectura)
export const Calculado = ({ valor, ...props }) => <input type="text" readOnly tabIndex={-1} value={valor} {...props} />;

export const dos = (v) => (v ? v.toFixed(2) : '');
export const dosSiempre = (v) => (v || 0).toFixed(2);

// Celda con número de casilla, etiqueta y su campo. Por defecto el campo es una
// <Entrada>; con `opciones` es un <Selector>; con `valor` es un <Calculado>;
// con `children` se usa lo que venga.
export function Celda({ num, etiqueta, flex, ancho, className = '', style, nombre, opciones, valor, children, ...props }) {
  const estilo = { ...(ancho ? { width: ancho, flex: 'none' } : flex ? { flex } : { flex: 1 }), ...style };
  let campo = children;
  if (campo === undefined) {
    if (valor !== undefined) campo = <Calculado valor={valor} {...props} />;
    else if (opciones) campo = <Selector nombre={nombre} opciones={opciones} {...props} />;
    else campo = <Entrada nombre={nombre} {...props} />;
  }
  return (
    <div className={`cell ${className}`.trim()} style={estilo}>
      {num !== undefined && <Casilla num={num} />}
      {etiqueta && <span className="cell-label">{etiqueta}</span>}
      {campo}
    </div>
  );
}

export const Fila = ({ children, className = '', style }) => <div className={`row ${className}`.trim()} style={style}>{children}</div>;
export const Seccion = ({ children, style }) => <div className="section-title" style={style}>{children}</div>;

// Cabecera común: marca DIAN, título, casillas 1 (año) y 4 (número) y número grande del formulario
export function Encabezado({ numero, titulo }) {
  return (
    <div className="hdr-dian">
      <div className="dian-brand">
        <div className="dian-logo-box">DIAN<span>®</span></div>
        <div className="dian-sub">POR UNA COLOMBIA MÁS HONESTA</div>
      </div>
      <div className="hdr-center">
        <div className="hdr-title">{titulo}</div>
        <div className="hdr-campos">
          <div>
            <span className="cl"><Casilla num="1" className="cl-num">1.</Casilla> Año</span>
            <input type="text" className="hdr-input" style={{ width: 50 }} placeholder="AAAA" aria-label="Año" />
          </div>
          <div>
            <span className="cl"><Casilla num="4" className="cl-num">4.</Casilla> Número de formulario</span>
            <input type="text" className="hdr-input" placeholder="N° único" aria-label="Número de formulario" />
          </div>
        </div>
        <div className="nota-lea">Lea cuidadosamente las instrucciones</div>
      </div>
      <div className="big-num">{numero}</div>
    </div>
  );
}

// Hoja tamaño carta con la cabecera DIAN
export function Hoja({ numero, titulo, oculta = false, children }) {
  return (
    <div className={`dian-form${oculta ? ' hoja-oculta' : ''}`} style={oculta ? { display: 'none' } : undefined}>
      <Encabezado numero={numero} titulo={titulo} />
      {children}
    </div>
  );
}

// Recuadros de firma y sello. firmas: [{ texto, firma?, children? }]
export function Firmas({ firmas, alto }) {
  return (
    <div className="firmas" style={alto ? { minHeight: alto } : undefined}>
      {firmas.map((f, i) => (
        <div className="firma" key={i}>
          {f.texto}
          {f.firma && (
            <div className="firma-linea">
              <span>{f.firma}</span>
              {f.children}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
