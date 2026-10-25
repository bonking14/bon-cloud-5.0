// TRM oficial que certifica la Superintendencia Financiera, publicada en datos.gov.co.
// (Antes se usaba Frankfurter, que no tiene pesos colombianos: la tasa nunca cargaba.)
export const TRM_RESPALDO = 4000;
const URL_TRM = 'https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1';

let enCurso = null;

// Devuelve { valor, fecha } con la TRM vigente hoy. Se pide una sola vez por sesión.
export function cargarTrmOficial() {
  if (!enCurso) {
    enCurso = fetch(URL_TRM)
      .then((r) => r.json())
      .then((data) => {
        const fila = Array.isArray(data) ? data[0] : null;
        const valor = fila && parseFloat(fila.valor);
        if (!valor) throw new Error('Respuesta sin TRM');
        return { valor, fecha: fila.vigenciadesde.slice(0, 10) };
      })
      .catch((err) => {
        enCurso = null; // se puede reintentar más tarde
        throw err;
      });
  }
  return enCurso;
}
