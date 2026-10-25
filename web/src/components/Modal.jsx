import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Ventana modal: cierra con Escape o clic afuera, bloquea el scroll del fondo
// y devuelve el foco al elemento que la abrió.
export default function Modal({ abierto, onCerrar, children, claseFondo = 'sp-modal-overlay', claseCaja = 'sp-modal', claseCerrar = 'sp-modal-close', etiqueta }) {
  const cajaRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement;
    const tecla = (e) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', tecla);
    cajaRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', tecla);
      previo?.focus?.();
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;
  return createPortal(
    <div className={`${claseFondo} modal-animado`} style={{ display: 'flex' }} onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className={claseCaja} ref={cajaRef} role="dialog" aria-modal="true" aria-label={etiqueta} tabIndex={-1}>
        <button type="button" className={claseCerrar} onClick={onCerrar} aria-label="Cerrar">✕</button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
