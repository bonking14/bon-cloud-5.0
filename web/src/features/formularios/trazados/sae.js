// Trazado del formulario 602, Solicitud de Autorización de Embarque y/o Registros Previos (SAE).
// La DIAN no publica la hoja en blanco: la SAE se llena en línea en los servicios informáticos.
// Por eso el trazado se arma aquí, como el del RUT, con los números y nombres de las casillas
// de la hoja que genera el sistema. La distribución es aproximada.
import { lienzo } from './rut.js';

const X0 = 21;
const X1 = 591;
const LADO = 12; // franja de la izquierda con el nombre del bloque
const ALTO = 22;

function hoja(subtitulo) {
  const L = lienzo();
  const { t } = L;
  const cajas = {}; // casilla → [{ caja, cod }] una por cada vez que aparece en la hoja
  L.marco(X0, 25, X1 - X0, 35);
  t.lineas.push(['v', 135, 25, 60], ['v', 480, 25, 60]);
  L.texto(307.5, 40, 8.5, 'Solicitud de Autorización de Embarque', { b: 1, a: 'm' });
  L.texto(307.5, 51, 8.5, 'y/o Registros Previos', { b: 1, a: 'm' });
  if (subtitulo) L.texto(476, 57, 6, subtitulo, { b: 1, a: 'e' });

  // Fila de casillas: [número, rótulo, ancho relativo, { cod, reservado }]
  // `cod` agrega a la derecha el recuadro «Cód.» que acompaña al nombre.
  const fila = (y, casillas, { x = X0, x1 = X1, h = ALTO } = {}) => {
    const total = casillas.reduce((s, c) => s + (c[2] || 1), 0);
    let cx = x;
    casillas.forEach(([num, rotulo, peso = 1, extra = {}]) => {
      const w = ((x1 - x) * peso) / total;
      if (extra.reservado) t.fondos.push({ x: cx, y, w, h, c: 'claro' });
      L.marco(cx, y, w, h);
      L.texto(cx + 2, y + 6.5, 5.5, `${num}. ${rotulo}`);
      const registro = { caja: [cx + 1, y + 8.5, w - 2, h - 9.3] };
      if (extra.cod) {
        const wc = Math.min(30, w * 0.3);
        L.texto(cx + w - wc + 2, y + 6.5, 5.5, 'Cód.');
        t.lineas.push(['v', cx + w - wc, y + 8, y + h]);
        registro.caja = [cx + 1, y + 8.5, w - wc - 2, h - 9.3];
        registro.cod = [cx + w - wc + 1, y + 8.5, wc - 2, h - 9.3];
      }
      (cajas[num] = cajas[num] || []).push(registro);
      if (!t.celdas[num]) t.celdas[num] = { x: cx, y, w, h, r: rotulo };
      cx += w;
    });
    return y + h;
  };
  // Bloque con su nombre escrito de lado, a la izquierda
  const bloque = (y, nombre, filas) => {
    const y0 = y;
    filas.forEach((f) => { y = fila(y, Array.isArray(f) ? f : f.casillas, { x: X0 + LADO, h: f.h || ALTO }); });
    L.marco(X0, y0, LADO, y - y0);
    // El nombre se achica si el bloque es bajo, para que no se salga de su franja
    t.verticales.push({ x: X0 + 4, y0, y1: y, s: Math.min(5.5, (y - y0 - 3) / (nombre.length * 0.55)), t: nombre });
    return y;
  };
  // Encabezado de las hojas de continuación: número de formulario y exportador
  const continuacion = () => {
    L.marco(X0, 60, 295, 30);
    L.texto(X0 + 4, 69, 5.5, 'Espacio reservado para la DIAN');
    L.marco(316, 60, 275, 30);
    L.texto(320, 69, 6, '4. Número de formulario');
    t.celdas[4] = { x: 316, y: 60, w: 275, h: 30, r: 'Número de formulario' };
    const y = L.banda(90, 'Exportador', { h: 8, color: '#e6f3ea' });
    return fila(y, [[20, 'Tipo de documento', 0.9], [18, 'Número de identificación', 2], [6, 'DV', 0.4], [11, 'Razón social', 4.2]]);
  };
  return { L, t, cajas, fila, bloque, continuacion, fin: () => ({ ...t, cajas }) };
}

const SI_NO = { siNo: true };
const COD = { cod: true };
const DIAN = { reservado: true };
const persona = (a, b, c, d, e, f, g) => [[a, 'Tipo de documento', 0.9], [b, 'Número de identificación', 1.8], [c, 'DV', 0.4], [d, 'Primer apellido', 1.3], [e, 'Segundo apellido', 1.3], [f, 'Primer nombre', 1.3], [g, 'Otros nombres', 1.3]];

// ── Hoja 1: principal ──
function principal() {
  const H = hoja();
  const { L, t, fila, bloque } = H;
  L.marco(X0, 60, 295, 44);
  L.texto(X0 + 4, 70, 6, '1. Año');
  L.marco(52, 62.5, 40, 10.5);
  t.celdas[1] = { x: 52, y: 62.5, w: 40, h: 10.5, r: 'Año' };
  L.texto(150, 70, 6, '2. Concepto');
  L.marco(190, 62.5, 16, 10.5);
  t.celdas[2] = { x: 190, y: 62.5, w: 16, h: 10.5, r: 'Concepto' };
  L.texto(X0 + 4, 84, 5.5, 'Espacio reservado para la DIAN');
  L.marco(316, 60, 275, 44);
  L.texto(320, 70, 6, '4. Número de formulario');
  t.celdas[4] = { x: 316, y: 60, w: 275, h: 44, r: 'Número de formulario' };

  let y = bloque(104, 'Exportador', [
    persona(20, 18, 6, 7, 8, 9, 10),
    [[11, 'Razón social', 5], [24, 'Diplomático', 1]],
  ]);
  y = bloque(y, 'Declarante', [
    persona(25, 26, 27, 28, 29, 30, 31),
    [[32, 'Razón social']],
  ]);
  y = bloque(y, 'Destinatario', [
    [[33, 'Tipo de documento', 0.9], [34, 'Número de identificación', 1.8], [35, 'Primer apellido', 1.4], [36, 'Segundo apellido', 1.4], [37, 'Primer nombre', 1.4], [38, 'Otros nombres', 1.4]],
    [[39, 'Razón social']],
    [[40, 'Domicilio (Dirección)', 3.4], [41, 'País', 1.6, COD], [42, 'Ciudad', 1.6]],
  ]);
  y = fila(y, [[43, 'No. Formulario anterior'], [44, 'No. Referencia'], [45, 'No. Autorización global'], [46, 'No. de programa especial de MSVC o contrato de suministro de energía', 1.6]]);
  y = bloque(y, 'Datos del negocio', [
    [[47, 'Régimen aduanero', 1, COD], [48, 'Aduana despacho', 1, COD], [49, 'Región procedencia', 1, COD], [50, 'Tipo de embarque', 1, COD]],
    [[51, 'Tipo datos', 1.1, COD], [52, 'Naturaleza de la transacción', 1.5, COD], [53, 'Tipo de solicitud', 1.1, COD], [54, 'Cód. Incoterms', 0.6], [55, 'Lugar de entrega', 1]],
    [[56, 'Cód. moneda de transacción', 0.9], [57, 'Valor factura en moneda de transacción', 1.4], [58, 'Tasa de cambio', 1], [59, 'Forma pago', 1.3, COD], [60, 'Cantidad pagos anticipados', 1], [61, 'Fecha 1er. pago anticipado', 1]],
    [[62, 'Mercancía a la mano del viajero', 1.1, SI_NO], [63, 'Sistemas especiales', 0.9, SI_NO], [64, 'Exportación en tránsito', 0.9, SI_NO], [65, 'Modo de transporte', 1.5, COD], [66, 'Tipo de carga', 1.5, COD]],
  ]);
  y = bloque(y, 'Lugares', [
    [[67, 'Aduana de salida', 1, COD], [68, 'Lugar de embarque', 1.4, COD], [69, 'País destino final', 1.2, COD]],
    [[70, 'Lugar destino final', 1.2, COD], [71, 'Lugar destino final Colombia', 1.2, COD], [72, 'Depósito habilitado', 1.2, COD]],
  ]);
  y = bloque(y, 'Transportador', [
    persona(73, 74, 75, 76, 77, 78, 79),
    [[80, 'Razón social']],
  ]);
  y = bloque(y, 'Inspección', [
    { h: 26, casillas: [[81, 'Lugar', 1.2, COD], [82, 'No. aprobación solicitud inspección zona secundaria', 1.7], [83, 'Dirección ubicación mercancías', 2.2], [84, 'Solicita inspección física', 0.9, SI_NO]] },
  ]);
  y = bloque(y, 'Totales', [
    [[85, 'Valor total fletes USD'], [86, 'Valor total seguros USD'], [87, 'Valor total otros gastos USD'], [88, 'Valor total FOB USD'], [89, 'Valor total exportaciones USD']],
    [[90, 'Valor total agregado nacional USD', 1.3], [91, 'Valor a reintegrar USD', 1.3], [92, 'Total series', 0.8], [93, 'Total número de bultos', 1], [94, 'Total peso bruto kgs.', 1]],
  ]);
  y = fila(y, [[95, 'No. de aceptación', 1, DIAN], [96, 'Fecha', 1, DIAN], [97, 'No. de radicación', 1, DIAN], ['', '', 1.2]].slice(0, 3), { x1: 380 });
  L.marco(380, y - ALTO, X1 - 380, ALTO);
  // Firma
  L.marco(X0, y, X1 - X0, 92);
  L.texto(X0 + 4, y + 9, 6, 'Firma de quien suscribe el documento');
  y += 30;
  [[1001, 'Apellidos y nombres', 300], [1002, 'Tipo Doc.', 40], [1003, 'No. Identificación', 150], [1004, 'DV', 20], [1005, 'Cód. Representación', 40], [1006, 'Organización', 300]].forEach(([num, rotulo, w], i) => {
    // 1002, 1003 y 1004 van en el mismo renglón
    const fila2 = i >= 1 && i <= 3;
    const fy = i === 0 ? y : fila2 ? y + 12 : y + 12 * (i - 2);
    const fx = i === 2 ? X0 + 130 : i === 3 ? X0 + 380 : X0 + 4;
    const ancho = i === 2 ? 95 : i === 3 ? 34 : 82;
    L.texto(fx, fy + 8, 5.5, `${num}. ${rotulo}`);
    L.marco(fx + ancho, fy + 0.5, w, 10.5);
    t.celdas[num] = { x: fx + ancho, y: fy + 0.5, w, h: 10.5 };
    t.celdas[num].r = rotulo;
    H.cajas[num] = [{ caja: [fx + ancho + 0.8, fy + 1.3, w - 1.6, 8.9] }];
  });
  L.texto(410, y + 56, 5.5, '997. Fecha de aceptación');
  t.fondos.push({ x: 480, y: y + 48.5, w: 107, h: 10.5, c: 'claro' });
  L.marco(480, y + 48.5, 107, 10.5);
  t.celdas[997] = { x: 480, y: y + 48.5, w: 107, h: 10.5, r: 'Fecha de aceptación' };
  return H.fin();
}

// ── Hoja 2: documentos soporte y vistos buenos (siete registros) ──
export const REGISTROS_SOPORTE = 7;
function soportes() {
  const H = hoja('Hoja No. 2');
  let y = H.continuacion();
  y = H.L.banda(y, 'Documentos soporte y vistos buenos', { h: 9 });
  for (let i = 0; i < REGISTROS_SOPORTE; i++) {
    y = H.bloque(y, String(i + 1), [
      [[105, 'No. Serie', 0.6], [106, 'Tipo documento', 3, COD], [107, 'No. del documento', 2]],
      [[108, 'NIT emisor', 1.2], [109, 'Nombre emisor', 3], [110, 'Fecha expedición', 1], [111, 'Fecha vencimiento', 1]],
      [[112, 'Moneda', 1.4, COD], [113, 'Monto', 1.2], [114, 'Unidad comercial', 1.8, COD], [115, 'Cantidad unidad comercial', 1.2]],
    ]) + 4;
  }
  return H.fin();
}

// ── Hoja 3: datos de cada serie (dos series) y sistemas especiales ──
export const SERIES = 2;
export const FILAS_SISTEMAS = 10;
function series() {
  const H = hoja('Hoja No. 3');
  const { L, t } = H;
  let y = H.continuacion();
  for (let i = 0; i < SERIES; i++) {
    y = L.banda(y, 'Datos serie', { h: 8 });
    y = H.fila(y, [[177, 'Grupo', 0.5], [116, 'No. Serie', 0.6], [117, 'Subpartida', 1.4], [118, 'Cód. complement.', 0.9], [119, 'Cód. suplement.', 0.9], [120, 'Unidad física', 1.9, COD], [121, 'Cant. unidades físicas', 1.2], [122, 'Unidad comercial', 1.9, COD]]);
    y = H.fila(y, [[123, 'Cant. unidades comerciales', 1.3], [124, 'Clase embalaje', 2, COD], [125, 'No. Bultos', 0.8], [126, 'Peso bruto kgs.', 1.2], [127, 'Peso neto kgs.', 1.2], [128, 'Valor FOB USD', 1.4]]);
    y = H.fila(y, [[129, 'Marcas']]);
    y = H.fila(y, [[130, 'Descripción']], { h: 46 });
    y = H.fila(y, [[131, 'Unidad de medida de plazo', 1.6, COD], [132, 'Plazo', 0.9], [133, 'País de origen', 1.6, COD], [134, 'Cód. Reg. origen', 0.8], [135, 'Preferencia arancelaria', 2, COD]]);
    y = L.banda(y, 'Régimen precedente', { h: 7, color: '#e6f3ea' });
    y = H.fila(y, [[136, 'Aduana precedente', 2, COD], [137, 'No. Declaración precedente', 1.6], [138, 'Año aceptación', 0.9], [139, 'Cód. Reg. precedente', 1], [140, 'Cód. Modalidad precedente', 1.1], [141, 'No. Serie precedente', 1]]);
  }
  y = L.banda(y, 'Sistemas especiales', { h: 8 });
  const cols = [['Ítem', 22], ['142. No. Serie', 40], ['143. No. de Programa', 80], ['144. Reposición', 62], ['145. No. Cuadro insumo producto (CIP)', 82], ['146. No. Producto', 72], ['147. Cant. producto a exportar por CIP', 78], ['148. Valor agregado nacional (VAN)', 68], ['149. Valor insumo externo (VIE)', 66]];
  let x = X0;
  const xs = cols.map(([txt, w]) => {
    L.marco(x, y, w, 16);
    const partes = txt.length > 20 ? [txt.slice(0, txt.lastIndexOf(' ', 22)), txt.slice(txt.lastIndexOf(' ', 22) + 1)] : [txt];
    partes.forEach((p, k) => L.texto(x + w / 2, y + (partes.length === 1 ? 10 : 7 + k * 6), 5, p, { a: 'm', b: 1 }));
    x += w;
    return [x - w, w];
  });
  y += 16;
  for (let f = 0; f < FILAS_SISTEMAS; f++) {
    xs.forEach(([cx, w], c) => {
      L.marco(cx, y, w, 12);
      if (c === 0) { L.texto(cx + w / 2, y + 8.5, 5.5, String(f + 1), { a: 'm', b: 1 }); return; }
      const num = 141 + c;
      (H.cajas[num] = H.cajas[num] || []).push({ caja: [cx + 0.8, y + 0.8, w - 1.6, 10.4] });
      if (!t.celdas[num]) t.celdas[num] = { x: cx, y, w, h: 12, r: cols[c][0].replace(/^\d+\. /, '') };
    });
    y += 12;
  }
  return H.fin();
}

// ── Hoja 4: subpartidas declaradas (continuación de las descripciones) ──
export const REGISTROS_DESCRIPCION = 5;
function descripciones() {
  const H = hoja('Hoja No. 4');
  let y = H.continuacion();
  y = H.L.banda(y, 'Subpartidas declaradas', { h: 9 });
  for (let i = 0; i < REGISTROS_DESCRIPCION; i++) {
    y = H.fila(y, [[178, 'No. Grupo'], [179, 'No. Serie'], ['', '', 6]].slice(0, 2), { x1: 200 });
    H.L.marco(200, y - ALTO, X1 - 200, ALTO);
    y = H.fila(y, [[180, 'Descripción']], { h: 92 });
  }
  return H.fin();
}

export const saePrincipal = principal();
export const saeSoportes = soportes();
export const saeSeries = series();
export const saeDescripciones = descripciones();
// Casillas con SI / NO
export const CASILLAS_SI_NO = [62, 63, 64, 84];
