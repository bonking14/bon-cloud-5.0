import { normalizar, soloDigitos } from './texto.js';

// Arancel de Aduanas completo (data/arancel.json, generado con scripts/arancel.py desde el
// Decreto 1881 de 2021). Cada capítulo trae sus renglones en orden: [código, nivel, descripción, gravamen].

// Para cada subpartida de 10 dígitos arma su ruta: la partida y los títulos de los niveles de
// arriba, que son los que le dan sentido a descripciones como «Los demás».
export function indexar(datos) {
  const filas = [];
  datos.secciones.forEach((sec) => sec.capitulos.forEach((cap) => {
    const pila = [];
    let partida = null;
    cap.items.forEach(([codigo, nivel, desc, grv]) => {
      if (nivel === 0 && codigo.length === 5) { partida = { codigo, desc }; pila.length = 0; return; }
      while (pila.length && pila[pila.length - 1].nivel >= nivel) pila.pop();
      if (codigo.length === 13) {
        const ruta = pila.map((p) => p.desc.replace(/:$/, ''));
        filas.push({ codigo, desc, grv, nivel, ruta, partida, capitulo: cap.n, seccion: sec.n, nota: cap.nota, buscar: normalizar(`${partida?.desc ?? ''} ${ruta.join(' ')} ${desc}`) });
      } else {
        pila.push({ nivel, desc });
      }
    });
  }));
  return filas;
}

// Busca por código (desde 2 dígitos, con o sin puntos) o por palabras (todas deben aparecer)
export function buscarEnArancel(filas, consulta, limite = 60) {
  const q = normalizar(consulta.trim());
  if (!q) return { total: 0, resultados: [] };
  const digitos = soloDigitos(q);
  const porCodigo = digitos.length >= 2 && /^[\d.\s]+$/.test(q);
  const palabras = q.split(/\s+/).filter((p) => p.length > 1);
  const hallados = filas.filter((f) => (porCodigo ? soloDigitos(f.codigo).startsWith(digitos) : palabras.every((p) => f.buscar.includes(p))));
  return { total: hallados.length, resultados: hallados.slice(0, limite) };
}
