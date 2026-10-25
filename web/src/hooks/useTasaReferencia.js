import { useEffect, useState } from 'react';
import { cargarTrmOficial, TRM_RESPALDO } from '../lib/trm.js';

const pistaOk = (fecha) => `TRM oficial vigente desde ${fecha} (Superfinanciera). Para declarar se usa la del último día hábil de la semana anterior a la declaración.`;
const PISTA_ERROR = 'No se pudo cargar la TRM oficial: escribe la TRM de la fecha de tu declaración.';

// Llama a onTasa(valor, pista, esRespaldo) una vez, con la TRM oficial o con la de respaldo.
export function useTasaReferencia(onTasa, activo = true) {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    if (!activo || listo) return;
    let vigente = true;
    cargarTrmOficial()
      .then(({ valor, fecha }) => vigente && onTasa(valor.toFixed(2), pistaOk(fecha)))
      .catch(() => vigente && onTasa(TRM_RESPALDO.toFixed(2), PISTA_ERROR, true))
      .finally(() => vigente && setListo(true));
    return () => { vigente = false; };
  }, [activo, listo, onTasa]);
}
