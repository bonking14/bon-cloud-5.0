// Trazado del formulario 001 (RUT). La DIAN no publica el RUT en blanco: se genera en línea en
// MUISCA. Por eso este trazado no se extrae de un PDF, como los demás, sino que se arma aquí:
// las secciones, los números y los nombres de las casillas son los del Instructivo de calidad
// del RUT (IN-CAC-0237, versión 3, 2026) y la distribución sigue la de la hoja que genera MUISCA.
const X0 = 21;
const X1 = 591;
const VERDE = '#1e8c45';
const BANDA = '#cfe8d6';
const SUB = '#e6f3ea';

function lienzo() {
  const t = { w: 612, h: 792, linea: VERDE, numero: VERDE, lineas: [], fondos: [], textos: [], verticales: [], celdas: {} };
  const marco = (x, y, w, h) => {
    t.lineas.push(['h', y, x, x + w], ['h', y + h, x, x + w], ['v', x, y, y + h], ['v', x + w, y, y + h]);
  };
  const texto = (x, y, s, txt, extra = {}) => t.textos.push({ x, y, s, t: txt, ...extra });
  const api = {
    t, marco, texto,
    // Franja con el título de una sección
    banda(y, txt, { x = X0, x1 = X1, h = 10, color = BANDA } = {}) {
      t.fondos.push({ x, y, w: x1 - x, h, k: color });
      marco(x, y, x1 - x, h);
      texto((x + x1) / 2, y + h - 2.8, 6.5, txt, { b: 1, a: 'm' });
      return y + h;
    },
    // Casilla con su rótulo arriba y el dato debajo
    celda(num, rotulo, x, y, w, h = 24, { reservado = false } = {}) {
      if (reservado) t.fondos.push({ x, y, w, h, c: 'claro' });
      marco(x, y, w, h);
      texto(x + 2, y + 7, 6, `${num}. ${rotulo}`);
      t.celdas[num] = { x, y, w, h, r: rotulo, lx: x + w - 2, ly: y + 7 };
    },
    // Fila de casillas: [[num, rótulo, ancho relativo], ...]
    fila(y, casillas, { x = X0, x1 = X1, h = 24 } = {}) {
      const total = casillas.reduce((s, c) => s + (c[2] || 1), 0);
      let cx = x;
      casillas.forEach(([num, rotulo, peso = 1, extra]) => {
        const w = ((x1 - x) * peso) / total;
        api.celda(num, rotulo, cx, y, w, h, extra);
        cx += w;
      });
      return y + h;
    },
    // Rejilla de recuadros numerados (códigos de las casillas 53, 54, 57, 58...)
    rejilla(num, y, cantidad, porFila, { x = X0, x1 = X1, h = 24, desde = 1 } = {}) {
      const w = (x1 - x) / porFila;
      const cajas = [];
      for (let i = 0; i < cantidad; i++) {
        const cx = x + (i % porFila) * w;
        const cy = y + Math.floor(i / porFila) * h;
        marco(cx, cy, w, h);
        texto(cx + 1.5, cy + 6, 5, String(desde + i), { c: 'azul' });
        cajas.push([cx + 0.8, cy + 7.5, w - 1.6, h - 8.3]);
      }
      return { cajas, fin: y + Math.ceil(cantidad / porFila) * h };
    },
    cabecera(subtitulo) {
      marco(X0, 25, X1 - X0, 35);
      t.lineas.push(['v', 135, 25, 60], ['v', 480, 25, 60]);
      texto(307.5, 41, 8.5, 'Formulario del Registro Único Tributario', { b: 1, a: 'm' });
      texto(307.5, 52, 7, subtitulo, { b: 1, a: 'm' });
    },
  };
  return api;
}

// ── Hoja principal ──
function hojaPrincipal() {
  const L = lienzo();
  const { t } = L;
  L.cabecera('Hoja Principal');
  // Concepto y número de formulario
  L.marco(X0, 60, 295, 70);
  L.texto(X0 + 4, 70, 6, '2. Concepto');
  L.marco(60, 62.5, 22, 10.5);
  t.lineas.push(['v', 71, 62.5, 73]);
  L.texto(X0 + 4, 84, 5.5, 'Espacio reservado para la DIAN');
  t.celdas[2] = { x: 60, y: 62.5, w: 22, h: 10.5, r: 'Concepto' };
  L.marco(316, 60, 275, 70);
  L.texto(320, 70, 6, '4. Número de formulario');
  t.celdas[4] = { x: 316, y: 60, w: 275, h: 70, r: 'Número de formulario' };

  let y = L.fila(130, [[5, 'Número de Identificación Tributaria (NIT)', 2.6], [6, 'DV', 0.4], [12, 'Dirección seccional', 3], [14, 'Buzón electrónico', 4]]);
  y = L.banda(y, 'IDENTIFICACIÓN');
  y = L.fila(y, [[24, 'Tipo de contribuyente', 3], [25, 'Tipo de documento', 2.4], [26, 'Número de Identificación', 2.6], [27, 'Fecha expedición', 2]]);
  y = L.banda(y, 'Lugar de expedición', { h: 8, color: SUB });
  y = L.fila(y, [[28, 'País'], [29, 'Departamento'], [30, 'Ciudad/Municipio']]);
  y = L.fila(y, [[31, 'Primer apellido'], [32, 'Segundo apellido'], [33, 'Primer nombre'], [34, 'Otros nombres']]);
  y = L.fila(y, [[35, 'Razón social']]);
  y = L.fila(y, [[36, 'Nombre comercial', 3], [37, 'Sigla', 1]]);
  y = L.banda(y, 'UBICACIÓN');
  y = L.fila(y, [[38, 'País'], [39, 'Departamento'], [40, 'Ciudad/Municipio']]);
  y = L.fila(y, [[41, 'Dirección principal']]);
  y = L.fila(y, [[42, 'Correo electrónico', 3], [43, 'Código postal', 1], [44, 'Teléfono 1', 1.2], [45, 'Teléfono 2', 1.2]]);
  y = L.banda(y, 'CLASIFICACIÓN');
  // Actividad económica y ocupación
  L.banda(y, 'Actividad económica', { x1: 441, h: 8, color: SUB });
  L.banda(y, 'Ocupación', { x: 441, h: 8, color: SUB });
  y += 8;
  const grupos = [['Actividad principal', X0, 161], ['Actividad secundaria', 161, 301], ['Otras actividades', 301, 441], ['', 441, X1]];
  grupos.forEach(([txt, a, b]) => { L.marco(a, y, b - a, 8); if (txt) L.texto((a + b) / 2, y + 6, 5.5, txt, { a: 'm' }); });
  y += 8;
  L.fila(y, [[46, 'Código', 1], [47, 'Fecha inicio actividad', 1.5]], { x1: 161 });
  L.fila(y, [[48, 'Código', 1], [49, 'Fecha inicio actividad', 1.5]], { x: 161, x1: 301 });
  L.marco(301, y, 140, 24);
  L.texto(303, y + 7, 6, '50. Código');
  const otras = L.rejilla(50, y + 8, 2, 2, { x: 301, x1: 441, h: 16 });
  t.celdas[50] = { x: 301, y, w: 140, h: 24, r: 'Otras actividades: código' };
  y = L.fila(y, [[51, 'Código', 1], [52, 'Número establecimientos', 1.6]], { x: 441 });
  // Responsabilidades
  y = L.banda(y, 'Responsabilidades, Calidades y Atributos', { h: 8, color: SUB });
  L.texto(X0 + 2, y + 6.5, 6, '53. Código');
  L.marco(X0, y, X1 - X0, 9);
  t.celdas[53] = { x: X0, y, w: X1 - X0, h: 57, r: 'Responsabilidades, calidades y atributos: código' };
  const resp = L.rejilla(53, y + 9, 26, 13);
  y = resp.fin;
  // Obligados aduaneros y exportadores
  L.banda(y, 'Obligados aduaneros', { x1: 331, h: 8, color: SUB });
  L.banda(y, 'Exportadores', { x: 331, h: 8, color: SUB });
  y += 8;
  L.texto(X0 + 2, y + 6.5, 6, '54. Código');
  L.marco(X0, y, 310, 9);
  t.celdas[54] = { x: X0, y, w: 310, h: 57, r: 'Obligados aduaneros: código' };
  const adu = L.rejilla(54, y + 9, 20, 10, { x1: 331 });
  L.fila(y, [[55, 'Forma'], [56, 'Tipo']], { x: 331, x1: 441, h: 28.5 });
  L.marco(441, y, 150, 28.5);
  L.texto(443, y + 7, 6, '57. Modo');
  L.texto(516, y + 7, 5.5, 'Servicio', { a: 'm' });
  const modo = L.rejilla(57, y + 9, 3, 3, { x: 441, h: 19.5 });
  t.celdas[57] = { x: 441, y, w: 150, h: 28.5, r: 'Servicio: modo' };
  L.marco(331, y + 28.5, 260, 28.5);
  L.texto(333, y + 35.5, 6, '58. CPC');
  const cpc = L.rejilla(58, y + 37.5, 3, 3, { x: 331, h: 19.5 });
  t.celdas[58] = { x: 331, y: y + 28.5, w: 260, h: 28.5, r: 'Servicio: CPC' };
  y = adu.fin;
  // Uso exclusivo de la DIAN
  y = L.banda(y, 'Para uso exclusivo de la DIAN');
  y = L.fila(y, [[59, 'Anexos   SI        NO', 1.2, { reservado: true }], [60, 'No. de Folios', 1, { reservado: true }], [61, 'Fecha', 1.4, { reservado: true }]]);
  // Firma
  L.marco(X0, y, 310, 78);
  L.texto(X0 + 4, y + 9, 6, 'Firma del solicitante:');
  L.marco(331, y, 260, 78);
  L.texto(335, y + 9, 5.5, 'Sin perjuicio de las verificaciones que la DIAN realice.');
  L.texto(335, y + 17, 5.5, 'Firma autorizada:');
  L.celda(984, 'Nombre', 331, y + 30, 260, 24, { reservado: true });
  L.celda(985, 'Cargo', 331, y + 54, 260, 24, { reservado: true });
  return { ...t, rejillas: { 50: otras.cajas, 53: resp.cajas, 54: adu.cajas, 57: modo.cajas, 58: cpc.cajas } };
}

// ── Hoja 2 ──
function hoja2() {
  const L = lienzo();
  const { t } = L;
  L.cabecera('Hoja 2');
  L.marco(X0, 60, 295, 34);
  L.texto(X0 + 4, 70, 5.5, 'Espacio reservado para la DIAN');
  L.marco(316, 60, 275, 34);
  L.texto(320, 70, 6, '4. Número de formulario');
  t.celdas[4] = { x: 316, y: 60, w: 275, h: 34, r: 'Número de formulario' };
  let y = L.fila(94, [[5, 'Número de Identificación Tributaria (NIT)', 2.6], [6, 'DV', 0.4], [12, 'Dirección seccional', 3], [14, 'Buzón electrónico', 4]]);
  y = L.banda(y, 'CARACTERÍSTICAS Y FORMAS DE LAS ORGANIZACIONES');
  y = L.fila(y, [[62, 'Naturaleza'], [63, 'Formas asociativas'], [64, 'Entidades o institutos de derecho público', 1.4]]);
  y = L.fila(y, [[65, 'Fondos'], [66, 'Cooperativas'], [67, 'Sociedades y organismos extranjeros', 1.4]]);
  y = L.fila(y, [[68, 'Sin personería jurídica'], [69, 'Otras organizaciones no clasificadas'], [70, 'Beneficio', 1.4]]);
  y = L.banda(y, 'Constitución, Registro y Última Reforma');
  // Tabla: documento | 1. Constitución | 2. Reforma
  const cols = [X0, 191, 391, X1];
  ['Documento', '1. Constitución', '2. Reforma'].forEach((txt, i) => { L.marco(cols[i], y, cols[i + 1] - cols[i], 9); L.texto((cols[i] + cols[i + 1]) / 2, y + 6.5, 6, txt, { b: 1, a: 'm' }); });
  y += 9;
  const tabla = {};
  [[71, 'Clase'], [72, 'Número'], [73, 'Fecha'], [74, 'Número de notaría'], [75, 'Entidad de registro'], [76, 'Fecha de registro'], [77, 'No. Matrícula mercantil'], [78, 'Departamento'], [79, 'Ciudad/Municipio']].forEach(([num, rotulo]) => {
    L.marco(cols[0], y, cols[1] - cols[0], 14);
    L.texto(cols[0] + 3, y + 9.5, 6, `${num}. ${rotulo}`);
    L.marco(cols[1], y, cols[2] - cols[1], 14);
    L.marco(cols[2], y, cols[3] - cols[2], 14);
    tabla[num] = [[cols[1] + 0.8, y + 0.8, cols[2] - cols[1] - 1.6, 12.4], [cols[2] + 0.8, y + 0.8, cols[3] - cols[2] - 1.6, 12.4]];
    t.celdas[num] = { x: cols[0], y, w: X1 - X0, h: 14, r: rotulo };
    y += 14;
  });
  y = L.fila(y, [[80, 'Vigencia: desde'], [81, 'Vigencia: hasta']]);
  y = L.banda(y, 'Composición del Capital');
  y = L.fila(y, [[82, 'Nacional %'], [83, 'Nacional público %'], [84, 'Nacional privado %'], [85, 'Extranjero %'], [86, 'Extranjero público %'], [87, 'Extranjero privado %']]);
  y = L.banda(y, 'Entidad de vigilancia y control');
  y = L.fila(y, [[88, 'Entidad de vigilancia y control']]);
  y = L.banda(y, 'Estado y Beneficio');
  const ec = [X0, 51, 231, 361, 551, X1];
  ['Ítem', '89. Estado actual', '90. Fecha cambio de estado', '91. Número de Identificación Tributaria (NIT)', '92. DV'].forEach((txt, i) => { L.marco(ec[i], y, ec[i + 1] - ec[i], 10); L.texto((ec[i] + ec[i + 1]) / 2, y + 7, 6, txt, { a: 'm' }); });
  y += 10;
  const estado = { 89: [], 90: [], 91: [], 92: [] };
  for (let i = 0; i < 5; i++) {
    for (let c = 0; c < 5; c++) L.marco(ec[c], y, ec[c + 1] - ec[c], 13);
    L.texto((ec[0] + ec[1]) / 2, y + 9, 6, String(i + 1), { a: 'm' });
    [89, 90, 91, 92].forEach((num, c) => estado[num].push([ec[c + 1] + 0.8, y + 0.8, ec[c + 2] - ec[c + 1] - 1.6, 11.4]));
    y += 13;
  }
  [[89, 'Estado actual'], [90, 'Fecha cambio de estado'], [91, 'NIT'], [92, 'DV']].forEach(([num, r]) => { t.celdas[num] = { x: X0, y: y - 65, w: X1 - X0, h: 65, r }; });
  y = L.banda(y, 'Vinculación económica');
  y = L.fila(y, [[93, 'Vinculación económica', 1], [94, 'Nombre del grupo económico y/o empresarial', 2.6]]);
  y = L.fila(y, [[95, 'Número de identificación tributaria (NIT) de la matriz o controlante', 2.6], [96, 'DV', 0.4], [97, 'Nombre o razón social de la matriz o controlante', 4]]);
  y = L.fila(y, [[170, 'Número de identificación tributaria otorgado en el exterior', 2], [171, 'País', 1]]);
  L.fila(y, [[172, 'Número de identificación tributaria sociedad o natural del exterior con EP', 2], [173, 'Nombre o razón social de la sociedad o persona natural del exterior con EP', 2.4]]);
  return { ...t, rejillas: { ...tabla, ...estado } };
}

// ── Hojas 3 a 6: bloques que se repiten (un representante, un socio, un establecimiento...) ──
// Cada bloque es una lista de filas; cada fila, una lista de [casilla, rótulo, ancho relativo].
// Como la misma casilla aparece en varios bloques, sus cajas se devuelven en `rejillas`
// (una por bloque) y el formulario les pone un campo a cada una.
function hojaDeBloques(subtitulo, seccion, bloques) {
  const L = lienzo();
  const { t } = L;
  L.cabecera(subtitulo);
  L.marco(X0, 60, 295, 34);
  L.texto(X0 + 4, 70, 5.5, 'Espacio reservado para la DIAN');
  L.marco(316, 60, 275, 34);
  L.texto(320, 70, 6, '4. Número de formulario');
  t.celdas[4] = { x: 316, y: 60, w: 275, h: 34, r: 'Número de formulario' };
  let y = L.fila(94, [[5, 'Número de Identificación Tributaria (NIT)', 2.6], [6, 'DV', 0.4], [12, 'Dirección seccional', 3], [14, 'Buzón electrónico', 4]]);
  y = L.banda(y, seccion);
  const rejillas = {};
  bloques.forEach(({ titulo, filas }, b) => {
    // Franja angosta a la izquierda con el número (o el nombre) del bloque
    const alto = filas.length * 24;
    L.marco(X0, y, 16, alto);
    t.verticales.push({ x: X0 + 6, y0: y, y1: y + alto, s: 6, t: titulo || String(b + 1) });
    filas.forEach((casillas) => {
      const total = casillas.reduce((s2, c) => s2 + (c[2] || 1), 0);
      let x = X0 + 16;
      casillas.forEach(([num, rotulo, peso = 1]) => {
        const w = ((X1 - X0 - 16) * peso) / total;
        L.marco(x, y, w, 24);
        L.texto(x + 2, y + 7, 6, `${num}. ${rotulo}`);
        (rejillas[num] = rejillas[num] || []).push([x + 1, y + 9.5, w - 2, 13.5]);
        if (!t.celdas[num]) t.celdas[num] = { x, y, w, h: 24, r: rotulo };
        x += w;
      });
      y += 24;
    });
    y += 5;
  });
  return { ...t, rejillas };
}

const repetir = (n, filas) => Array.from({ length: n }, () => ({ filas }));
const persona = (base, tarjeta) => [
  [[base, 'Tipo de documento', 1.2], [base + 1, 'Número de identificación', 2], [base + 2, 'DV', 0.4], [base + 3, tarjeta, 1.6]],
  [[base + 4, 'Primer apellido'], [base + 5, 'Segundo apellido'], [base + 6, 'Primer nombre'], [base + 7, 'Otros nombres']],
  [[base + 8, 'Número de Identificación Tributaria (NIT)', 2], [base + 9, 'DV', 0.4], [base + 10, 'Sociedad o firma designada', 3], [base + 11, 'Fecha de nombramiento', 1.4]],
];

export const rutHoja3 = hojaDeBloques('Hoja 3', 'REPRESENTACIÓN', repetir(5, [
  [[98, 'Representación', 2], [99, 'Fecha inicio ejercicio representación legal', 1.4]],
  [[100, 'Tipo de documento', 1.2], [101, 'Número de identificación', 2], [102, 'DV', 0.4], [103, 'Número tarjeta profesional', 1.6]],
  [[104, 'Primer apellido'], [105, 'Segundo apellido'], [106, 'Primer nombre'], [107, 'Otros nombres']],
  [[108, 'Número de Identificación Tributaria (NIT)', 2], [109, 'DV', 0.4], [110, 'Razón social representante legal', 4]],
]));

export const rutHoja4 = hojaDeBloques('Hoja 4', 'SOCIOS Y/O MIEMBROS DE JUNTAS DIRECTIVAS, CONSORCIOS, UNIONES TEMPORALES', repetir(5, [
  [[111, 'Tipo de documento', 1.2], [112, 'Número de identificación', 2], [113, 'DV', 0.4], [114, 'Nacionalidad', 1.6]],
  [[115, 'Primer apellido'], [116, 'Segundo apellido'], [117, 'Primer nombre'], [118, 'Otros nombres']],
  [[119, 'Razón social', 3], [120, 'Valor capital del socio', 1.6], [121, '% Participación', 1], [122, 'Fecha de ingreso', 1.2], [123, 'Fecha de retiro', 1.2]],
]));

export const rutHoja5 = hojaDeBloques('Hoja 5', 'REVISOR FISCAL Y CONTADOR', [
  { titulo: 'Revisor fiscal principal', filas: persona(124, 'Número de tarjeta profesional') },
  { titulo: 'Revisor fiscal suplente', filas: persona(136, 'Número de tarjeta profesional') },
  { titulo: 'Contador', filas: persona(148, 'Número de tarjeta profesional') },
]);

export const rutHoja6 = hojaDeBloques('Hoja 6', 'ESTABLECIMIENTOS, AGENCIAS, SUCURSALES, OFICINAS, SEDES O NEGOCIOS ENTRE OTROS', repetir(6, [
  [[160, 'Tipo de establecimiento', 1.4], [161, 'Actividad económica', 1.2], [162, 'Nombre del establecimiento', 3]],
  [[163, 'Departamento'], [164, 'Ciudad/Municipio'], [165, 'Dirección', 2.4]],
  [[166, 'Número de matrícula mercantil', 1.4], [167, 'Fecha de la matrícula mercantil', 1.3], [168, 'Teléfono', 1], [169, 'Fecha de cierre', 1]],
]));

export const rutPrincipal = hojaPrincipal();
export const rutHoja2 = hoja2();
