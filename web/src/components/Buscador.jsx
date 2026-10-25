// Caja de búsqueda con botón para limpiar (mismo estilo en todos los módulos)
export default function Buscador({ valor, onChange, placeholder, icono = '🔍', etiqueta = 'Buscar' }) {
  return (
    <div className="buscador-box">
      <span className="buscador-icon" aria-hidden="true">{icono}</span>
      <input type="search" value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={etiqueta} autoComplete="off" />
      {valor && <button type="button" onClick={() => onChange('')} aria-label="Limpiar búsqueda">✕</button>}
    </div>
  );
}
