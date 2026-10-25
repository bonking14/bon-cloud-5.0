// Ícono SVG de un solo trazo (sin librerías externas)
export default function Icono({ d, tamano = 20, className }) {
  return (
    <svg viewBox="0 0 24 24" width={tamano} height={tamano} className={className} aria-hidden="true">
      <path fill="currentColor" d={d} />
    </svg>
  );
}

export const ICONO_LUNA = 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
export const ICONO_SOL = 'M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM11 1h2v3h-2zm0 19h2v3h-2zM1 11h3v2H1zm19 0h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4zM4.2 18.4l2.1-2.1 1.4 1.4-2.1 2.1zM16.3 6.3l2.1-2.1 1.4 1.4-2.1 2.1z';
export const ICONO_MENU = 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z';
export const ICONO_SALIR = 'M10 17l1.4-1.4-2.6-2.6H20v-2H8.8l2.6-2.6L10 7l-5 5 5 5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z';
