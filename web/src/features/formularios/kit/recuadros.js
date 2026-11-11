// Campos de las hojas de continuación dibujadas con recuadros (formulario 600, hojas 3 a 8).
// En esas hojas cada dato tiene su propio recuadro vacío debajo del rótulo, o es una celda de
// una tabla. Aquí se localizan los recuadros vacíos del trazado y a cada uno se le pone como
// nombre accesible el rótulo que tiene encima (o el encabezado de su columna y su fila).
const NUMERADO = /^(\d{2,4})\./;

export function recuadrosVacios(trazado, { desdeY = 0, prefijo }) {
  const textos = trazado.textos.filter((t) => !t.c);
  const vistos = new Set();
  let cajas = [];
  const marcos = []; // todos los recuadros con borde, tengan texto o no
  trazado.capas.forEach(([x, y, w, h, , borde]) => {
    if (!borde || borde === '#ffffff' || w < 8 || h < 8 || y < desdeY) return;
    const clave = `${Math.round(x)}|${Math.round(y)}|${Math.round(w)}|${Math.round(h)}`;
    if (vistos.has(clave)) return;
    vistos.add(clave);
    marcos.push({ x, y, w, h });
    if (h > 20 && h < 30) return; // relleno a la derecha de una fila corta
    // con texto adentro es un rótulo o un marco, no un dato (la segunda línea de un rótulo
    // de dos renglones alcanza a asomarse por el borde superior: no cuenta)
    if (textos.some((t) => t.x >= x - 0.5 && t.x < x + w && t.y > y + 3.5 && t.y <= y + h + 0.5)) return;
    cajas.push({ x, y, w, h });
  });
  const contiene = (a, b) => a !== b && a.x - 0.6 <= b.x && a.y - 0.6 <= b.y && a.x + a.w + 0.6 >= b.x + b.w && a.y + a.h + 0.6 >= b.y + b.h;
  cajas = cajas.filter((a) => !cajas.some((b) => contiene(a, b)));
  const cruzaX = (a, b) => a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1;
  const ocupada = (z) => cajas.some((c) => cruzaX(c, z) && c.y < z.y + z.h - 1 && z.y < c.y + c.h - 1);

  // 1. Rótulos numerados sin recuadro propio para el dato: el dato va en el espacio que
  //    queda entre el rótulo y el siguiente recuadro hacia abajo
  marcos.forEach((m) => {
    if (m.h > 16) return;
    const rotulado = textos.some((t) => NUMERADO.test(t.t) && t.x >= m.x && t.x < m.x + 6 && t.y > m.y && t.y <= m.y + m.h);
    if (!rotulado) return;
    const y0 = m.y + m.h;
    const abajo = marcos.filter((o) => o !== m && cruzaX(o, m) && o.y >= y0 + 5).map((o) => o.y);
    if (!abajo.length) return;
    const zona = { x: m.x, y: y0, w: m.w, h: Math.min(...abajo) - y0 };
    // si el dato vecino sí tiene recuadro y se monta por la derecha, se recorta hasta él
    cajas.forEach((c) => { if (c.x > zona.x + 8 && c.x < zona.x + zona.w && c.y < zona.y + zona.h - 1 && zona.y < c.y + c.h - 1) zona.w = c.x - zona.x; });
    if (zona.h < 8 || zona.h > 16 || ocupada(zona)) return;
    cajas.push(zona);
  });

  // 2. Tablas: columnas sin recuadro propio (por ejemplo las fechas) quedan como huecos
  //    entre los recuadros de una misma fila
  const filas = new Map();
  marcos.filter((m) => m.h <= 14).forEach((m) => {
    const k = Math.round(m.y * 2);
    if (!filas.has(k)) filas.set(k, []);
    filas.get(k).push(m);
  });
  filas.forEach((fila) => {
    if (fila.length < 4) return;
    fila.sort((a, b) => a.x - b.x);
    for (let i = 0; i < fila.length - 1; i++) {
      const fin = fila[i].x + fila[i].w;
      const hueco = { x: fin, y: fila[i].y, w: fila[i + 1].x - fin, h: fila[i].h };
      if (hueco.w >= 20 && !ocupada(hueco) && !textos.some((t) => t.x >= hueco.x && t.x < hueco.x + hueco.w && t.y > hueco.y + 3.5 && t.y <= hueco.y + hueco.h)) cajas.push(hueco);
    }
  });
  cajas.sort((a, b) => a.y - b.y || a.x - b.x);

  const enColumna = (t, c) => t.x >= c.x - 1.5 && t.x < c.x + c.w - 1;
  const unir = (lista) => lista.sort((a, b) => Math.round(a.y) - Math.round(b.y) || a.x - b.x).map((t) => t.t).join(' ');
  const repetidos = new Map();
  const campos = [];
  cajas.forEach((c, i) => {
    let rotulo = unir(textos.filter((t) => enColumna(t, c) && t.y > c.y - 13.5 && t.y <= c.y + 3.5));
    let deTabla = false;
    if (!rotulo) {
      // celda de tabla: encabezado numerado más cercano hacia arriba en la misma columna
      const cabezas = textos.filter((t) => NUMERADO.test(t.t) && enColumna(t, c) && t.y < c.y);
      if (!cabezas.length) return;
      {
        const y0 = Math.max(...cabezas.map((t) => t.y));
        rotulo = unir(textos.filter((t) => enColumna(t, c) && t.y >= y0 - 0.6 && t.y <= y0 + 8 && t.y < c.y));
        deTabla = true;
      }
    }
    const casilla = (rotulo.match(NUMERADO) || [])[1];
    const limpio = rotulo.replace(/^\d{2,4}\.\s*/, '');
    if (!limpio) return;
    const clave = `${limpio}|${Math.round(c.x)}`;
    const vez = (repetidos.get(clave) || 0) + 1;
    repetidos.set(clave, vez);
    campos.push({
      casilla, nombre: `${prefijo}_${i}`, caja: [c.x + 0.8, c.y + 0.8, c.w - 1.6, c.h - 1.6],
      etiqueta: `${limpio}, ${deTabla ? 'fila' : 'registro'} ${vez}`, multilinea: c.h > 20,
    });
  });
  return campos;
}
