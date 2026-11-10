#!/usr/bin/env python3
"""Extrae el trazado de un formulario oficial de la DIAN (PDF) a JSON.

Uso: python3 scripts/extraer_formulario.py Formulario_500_2026.pdf 1 > src/features/formularios/trazados/500.json
     (para el 600, que está dibujado con rectángulos superpuestos, se agrega «capas» al final)

Los PDF se descargan de https://www.dian.gov.co/atencionciudadano/formulariosinstructivos/
(Formularios/<año>/Formulario_<número>_<año>.pdf). El JSON guarda las líneas, los
sombreados, los textos y las celdas de cada casilla; el simulador dibuja la hoja con
eso y pone encima los campos. Requiere pdfplumber (pip install pdfplumber).
"""
import json, re, sys
from collections import defaultdict
import pdfplumber

r1 = lambda v: round(float(v), 1)

def color(c):
    if c is None: return None
    if isinstance(c, (int, float)): c = (c, c, c)
    c = tuple(c)
    if len(c) == 1: c = c * 3
    if len(c) == 4:  # CMYK
        C, M, Y, K = c; c = ((1 - C) * (1 - K), (1 - M) * (1 - K), (1 - Y) * (1 - K))
    return tuple(round(float(x), 2) for x in c[:3])

def clase_color(c):
    """tinta | azul | gris | blanco"""
    if c is None: return 'tinta'
    r, g, b = c
    if min(c) > 0.93: return 'blanco'
    if abs(r - g) < 0.06 and abs(g - b) < 0.06: return 'gris' if r > 0.45 else 'tinta'
    if b > r + 0.15: return 'azul'
    return 'tinta'

def hexa(c):
    return None if c is None else '#%02x%02x%02x' % tuple(round(x * 255) for x in c)

def extraer(ruta, pagina, capas=False):
    p = pdfplumber.open(ruta).pages[pagina - 1]
    W, H = float(p.width), float(p.height)
    segs, fondos = [], []

    def seg(x0, y0, x1, y1):
        if abs(x0 - x1) < 0.6 and abs(y0 - y1) < 0.6: return
        if abs(y0 - y1) < 0.6: segs.append(('h', (y0 + y1) / 2, min(x0, x1), max(x0, x1)))
        elif abs(x0 - x1) < 0.6: segs.append(('v', (x0 + x1) / 2, min(y0, y1), max(y0, y1)))

    for l in p.lines:
        seg(l['x0'], l['top'], l['x1'], l['bottom'])
    for r in p.rects:
        x0, y0, x1, y1 = r['x0'], r['top'], r['x1'], r['bottom']
        w, h = x1 - x0, y1 - y0
        if r['fill']:
            cl = clase_color(color(r['non_stroking_color']))
            c = color(r['non_stroking_color'])
            if cl != 'blanco' and w > 1.5 and h > 1.5 and w * h < W * H * 0.5:
                # oscuro (bandas azules) o claro (zonas reservadas a la DIAN)
                fondos.append({'x': r1(x0), 'y': r1(y0), 'w': r1(w), 'h': r1(h), 'c': 'oscuro' if sum(c) < 1.6 else 'claro'})
            elif cl != 'blanco' and (w <= 1.5 or h <= 1.5):
                seg(x0, y0, x1, y1) if w <= 1.5 and h <= 1.5 else (seg(x0, (y0 + y1) / 2, x1, (y0 + y1) / 2) if h <= 1.5 else seg((x0 + x1) / 2, y0, (x0 + x1) / 2, y1))
        if r['stroke'] and clase_color(color(r['stroking_color'])) != 'blanco':
            if w < 1.5 or h < 1.5:
                seg(x0, y0, x1, y1) if (w < 0.6 or h < 0.6) else None
            else:
                seg(x0, y0, x1, y0); seg(x0, y1, x1, y1); seg(x0, y0, x0, y1); seg(x1, y0, x1, y1)

    # Une segmentos colineales que se tocan o se repiten
    grupos = defaultdict(list)
    for o, pos, a, b in segs:
        grupos[(o, round(pos * 2) / 2)].append((a, b))
    lineas = []
    for (o, pos), tramos in grupos.items():
        tramos.sort()
        a, b = tramos[0]
        for c, d in tramos[1:]:
            if c <= b + 0.8: b = max(b, d)
            else: lineas.append((o, pos, a, b)); a, b = c, d
        lineas.append((o, pos, a, b))
    lineas = [(o, r1(pos), r1(a), r1(b)) for o, pos, a, b in lineas if b - a >= 2]

    # Textos: palabra por palabra, para conservar la posición exacta del original
    textos = []
    palabras = p.extract_words(extra_attrs=['fontname', 'size', 'non_stroking_color', 'upright'], keep_blank_chars=False, x_tolerance=1.2, y_tolerance=2)
    for w in palabras:
        if w['size'] > 16 or not w['upright']: continue  # marca de agua y número del formulario
        cl = clase_color(color(w['non_stroking_color']))
        t = {'x': r1(w['x0']), 'y': r1(w['bottom'] - w['size'] * 0.22), 's': r1(w['size']), 'w': r1(w['x1'] - w['x0']), 't': w['text']}
        if 'Bold' in w['fontname']: t['b'] = 1
        if cl != 'tinta': t['c'] = cl
        textos.append(t)
    textos.sort(key=lambda t: (round(t['y']), t['x']))
    unidos = textos

    # Rótulos verticales (Importador, Declarante...): caracteres girados, por columna
    verticales = []
    cols = defaultdict(list)
    for c in p.chars:
        if c['upright'] or c['size'] > 16: continue
        cols[round((c['x0'] + c['x1']) / 2 / 3)].append(c)
    for _, cs in cols.items():
        cs.sort(key=lambda c: -c['bottom'])
        tramo = [cs[0]]
        def cerrar(tr):
            txt = ''.join(c['text'] for c in tr).strip()
            if len(txt) < 2: return
            alto = max(c['x1'] - c['x0'] for c in tr)
            verticales.append({'x': r1(sum((c['x0'] + c['x1']) / 2 for c in tr) / len(tr)), 'y0': r1(min(c['top'] for c in tr)), 'y1': r1(max(c['bottom'] for c in tr)),
                               's': r1(max(alto, 5)), 't': txt, **({'c': 'blanco'} if clase_color(color(tr[0]['non_stroking_color'])) == 'blanco' else {})})
        for c in cs[1:]:
            if tramo[-1]['top'] - c['bottom'] > 6: cerrar(tramo); tramo = [c]
            else: tramo.append(c)
        cerrar(tramo)

    # Celdas: para cada rótulo "NN. Texto", el recuadro que lo encierra
    hs = [(pos, a, b) for o, pos, a, b in lineas if o == 'h']
    vs = [(pos, a, b) for o, pos, a, b in lineas if o == 'v']
    celdas = {}
    tinta = [t for t in unidos if t.get('c') is None]
    for t in unidos:
        # "58." o "58.Tasa"; en las tablas de liquidación el número va solo ("94")
        con_punto = re.match(r'^(\d{1,4})\.(?!\d)', t['t'])
        m = con_punto or re.match(r'^(\d{2,4})$', t['t'])
        if not m or t.get('c') in ('gris', 'blanco'): continue
        num = m.group(1)
        if num in celdas: continue
        x, y = t['x'] + 1, t['y'] - t['s'] * 0.4
        arriba = max([pos for pos, a, b in hs if pos <= y + 0.5 and a - 1 <= x <= b + 1] or [0])
        abajo = min([pos for pos, a, b in hs if pos > y + 0.5 and a - 1 <= x <= b + 1] or [H])
        # los separadores verticales pueden ser medias líneas pegadas al borde inferior
        yb = abajo - 2.5
        cortes = sorted(pos for pos, a, b in vs if a - 1 <= yb <= b + 1)
        izq = max([c for c in cortes if c <= x] or [0])
        der = min([c for c in cortes if c > x] or [W])
        tabla = False
        if not con_punto and der - izq < 20:
            # celda del número en una tabla: el dato va en la celda de la derecha
            tabla = True
            izq, der = der, min([c for c in cortes if c > der + 1] or [W])
        dentro = [u for u in tinta if izq - 0.5 <= u['x'] < der - 0.5 and arriba < u['y'] <= abajo + 0.5]
        # Rótulo: el renglón del número y los que siguen pegados a él
        renglones = sorted({u['y'] for u in dentro if u['y'] >= t['y'] - 0.5})
        rotulo_y = [t['y']]
        for yy in renglones:
            if 0.5 < yy - rotulo_y[-1] <= t['s'] * 1.4: rotulo_y.append(yy)
        del_rotulo = [u for u in dentro if any(abs(u['y'] - yy) < 0.6 for yy in rotulo_y) and u['x'] >= t['x'] - 0.5]
        if tabla: del_rotulo = []
        otros = [u for u in dentro if u not in del_rotulo and u['y'] > rotulo_y[-1] + 0.6]
        c = {'x': r1(izq), 'y': r1(arriba), 'w': r1(der - izq), 'h': r1(abajo - arriba)}
        if del_rotulo:
            c['r'] = re.sub(r'^\d{1,4}\.\s*', '', ' '.join(u['t'] for u in sorted(del_rotulo, key=lambda u: (round(u['y']), u['x'])))).strip()
            c['lx'] = r1(max(u['x'] + u['w'] for u in del_rotulo)); c['ly'] = r1(rotulo_y[-1])
        if otros: c['ox'] = r1(max(u['x'] + u['w'] for u in otros))
        celdas[num] = c

    # Un sombreado con texto oscuro encima es claro en el original (zonas reservadas)
    for f in fondos:
        if f['c'] == 'oscuro' and any(f['x'] <= u['x'] <= f['x'] + f['w'] and f['y'] <= u['y'] <= f['y'] + f['h'] for u in tinta):
            f['c'] = 'claro'

    if capas:
        # Formularios dibujados con rectángulos superpuestos (el 600): se conservan en el
        # orden del PDF, con su relleno y su borde, para pintarlos igual que el original
        ops = []
        for r in p.rects:
            f = hexa(color(r['non_stroking_color'])) if r['fill'] else None
            b = hexa(color(r['stroking_color'])) if r['stroke'] else None
            if not f and not b: continue
            op = [r1(r['x0']), r1(r['top']), r1(r['x1'] - r['x0']), r1(r['bottom'] - r['top']), f or '', b or '']
            ops.append(op)
        return {'w': W, 'h': H, 'capas': ops, 'lineas': [], 'fondos': [], 'textos': unidos, 'verticales': verticales, 'celdas': celdas}

    return {'w': W, 'h': H, 'lineas': [[o, pos, a, b] for o, pos, a, b in sorted(lineas)], 'fondos': fondos,
            'textos': unidos, 'verticales': verticales, 'celdas': celdas}

if __name__ == '__main__':
    datos = extraer(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 1, capas='capas' in sys.argv[3:])
    json.dump(datos, sys.stdout, ensure_ascii=False, separators=(',', ':'))
