// Búsqueda sin tildes ni mayúsculas ("Aduana" encuentra "aduána")
export const normalizar = (t) => String(t ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const soloDigitos = (t) => String(t ?? '').replace(/[^0-9]/g, '');
export const contiene = (texto, q) => normalizar(texto).includes(q);
