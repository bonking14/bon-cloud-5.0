// Formato de los valores calculados que se muestran en las casillas
export const pesos = (v) => (v ? Math.round(v).toLocaleString('es-CO') : '');
export const dolares = (v) => (v ? v.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '');
export const soloDigitos = (t) => t.replace(/\D/g, '');
