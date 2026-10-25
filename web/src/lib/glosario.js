import { glosario } from '../data/glosario.js';
import { normalizar } from './texto.js';

export const buscarTermino = (nombre) => glosario.find((g) => normalizar(g.termino) === normalizar(nombre)) || null;
