import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCampos } from './contexto.js';

// Número de casilla. Si hay explicación, muestra una burbuja al pasar el
// cursor o al enfocarlo con el teclado.
export default function Casilla({ num, className = 'cell-num', style, children }) {
  const { explicaciones, sigla } = useCampos();
  const clave = String(num).replace(/\D/g, '');
  const texto = explicaciones[clave];
  const [pos, setPos] = useState(null);
  const contenido = children ?? num;

  if (!texto) return <span className={className} style={style}>{contenido}</span>;

  const mostrar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: Math.max(8, Math.min(r.left, window.innerWidth - 296)) });
  };
  const ocultar = () => setPos(null);

  return (
    <>
      <span className={`${className} casilla-ayuda`} style={style} tabIndex={0} role="button"
        aria-label={`Casilla ${clave}: ${texto}`}
        onMouseEnter={mostrar} onMouseLeave={ocultar} onFocus={mostrar} onBlur={ocultar}>
        {contenido}
      </span>
      {pos && createPortal(
        <div className="dian-tooltip" style={pos} role="tooltip">
          <h5>Casilla {clave} {sigla}</h5>
          {texto}
        </div>,
        document.body,
      )}
    </>
  );
}
