import { useState } from 'react';
import { formatearMientrasEscribe, toNumber } from '../lib/numeros.js';

// Campo numérico con separador de miles mientras se escribe y borde verde/rojo al salir.
export default function CampoNumero({ id, etiqueta, ayuda, pista, valor, onChange, placeholder, permiteCero = false }) {
  const [estado, setEstado] = useState(null); // null | 'ok' | 'error'

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {etiqueta}
        {ayuda && <span className="tooltip" title={ayuda} aria-label={ayuda}> ⓘ</span>}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(formatearMientrasEscribe(e.target.value))}
        onBlur={() => setEstado(toNumber(valor) > 0 || permiteCero ? 'ok' : 'error')}
        style={estado ? {
          borderColor: estado === 'ok' ? '#22c55e' : '#ef4444',
          boxShadow: `0 0 0 2px ${estado === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}`,
        } : undefined}
      />
      {pista && <span className="field-hint">{pista}</span>}
    </div>
  );
}
