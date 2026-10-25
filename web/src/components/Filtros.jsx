// Botones de filtro de una sola opción activa
export default function Filtros({ opciones, activa, onChange, etiqueta, className = 'filtros-wrap' }) {
  return (
    <div className={className} role="group" aria-label={etiqueta}>
      {opciones.map((o) => {
        const valor = typeof o === 'string' ? o : o.valor;
        const texto = typeof o === 'string' ? o : o.texto;
        return (
          <button key={valor} type="button" className={`filtro-btn${activa === valor ? ' active' : ''}`}
            aria-pressed={activa === valor} onClick={() => onChange(valor)}>
            {texto}
          </button>
        );
      })}
    </div>
  );
}
