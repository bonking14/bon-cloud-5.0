#!/usr/bin/env python3
"""Convierte el Arancel de Aduanas (Decreto 1881 de 2021, compilación jurídica de la DIAN) a JSON.

Uso: python3 scripts/arancel.py decreto_1881_2021.htm > public/arancel.json
     La página está en https://normograma.dian.gov.co/dian/compilacion/docs/decreto_1881_2021.htm

Salida: { fuente, secciones: [{ n, t, capitulos: [{ n, t, items: [[código, nivel, descripción, gravamen]] }] }] }
  código: "01.01" (partida), "0101.29" (subpartida), "0101.29.10.00" (subpartida nacional) o "" (título sin código)
  nivel: número de guiones de la descripción (0 para la partida)
  gravamen: tarifa del arancel en %, solo en las subpartidas de 10 dígitos
"""
import html, json, re, sys

ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']

def texto(ruta):
    s = open(ruta, encoding='latin-1').read()
    s = re.sub(r'<(br|/p|/div|/tr|/li|/h\d)[^>]*>', '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html.unescape(s).replace('\xa0', ' ')
    # «< NV2 >» marca las notas de vigencia de la compilación: no hace parte del texto
    s = re.sub(r'<\s*NV\d*\s*>', ' ', s)
    return [re.sub(r'\s+', ' ', l).strip() for l in s.split('\n')]

PARTIDA = re.compile(r'^(\d{2}\.\d{2})\s+(.+)$')
CODIGO = re.compile(r'^(\d{4}\.\d{2}(?:\.\d{2}\.\d{2}|\.\d{2})?)\s+((?:-\s*)*)(.+?)(?:\s+(\d{1,3}(?:[.,]\d+)?)\s*%?)?$')
TITULO = re.compile(r'^((?:-\s*)+)(.+:)$')

def convertir(lineas):
    secciones, cap, sec = [], None, None
    esperando = None
    pendiente = None  # subpartida de 10 dígitos cuya tarifa quedó en un renglón aparte (tras una nota)
    for l in lineas:
        if not l: continue
        if pendiente is not None and re.match(r'^\d{1,3}(?:[.,]\d+)?\s*%?$', l):
            pendiente[3] = float(l.rstrip('% ').replace(',', '.')); pendiente = None; continue
        m = re.match(r'^SECCI[ÓO]N\s+([IVX]+)\.?$', l)
        if m and m.group(1) in ROMANOS:
            sec = {'n': m.group(1), 't': '', 'capitulos': []}; secciones.append(sec); esperando = sec; cap = None; continue
        m = re.match(r'^CAP[ÍI]TULO\s+(\d{1,2})\.?$', l)
        if m and sec:
            cap = {'n': int(m.group(1)), 't': '', 'items': []}; sec['capitulos'].append(cap); esperando = cap; continue
        if esperando is not None:
            esperando['t'] = l.rstrip('.').strip(); esperando = None; continue
        if not cap: continue
        m = PARTIDA.match(l)
        if m and m.group(1)[:2] == f"{cap['n']:02d}":
            cap['items'].append([m.group(1), 0, m.group(2).strip(), None]); continue
        m = CODIGO.match(l)
        if m and m.group(1)[:2] == f"{cap['n']:02d}":
            codigo, guiones, desc, grv = m.groups()
            nivel = guiones.count('-')
            completo = len(codigo) == 13
            cap['items'].append([codigo, nivel, desc.strip(), float(grv.replace(',', '.')) if (grv and completo) else None])
            pendiente = cap['items'][-1] if (completo and not grv) else None
            continue
        m = TITULO.match(l)
        if m and cap['items']:
            cap['items'].append(['', m.group(1).count('-'), m.group(2).strip(), None])
    return secciones

# Decretos posteriores que cambian el gravamen de capítulos completos y que la compilación del
# Decreto 1881 no incorpora en su texto: capítulo → (gravamen, nota que se muestra en la página)
MODIFICACIONES = {
    61: (40.0, 'Arancel del 40% para todo el capítulo por el Decreto 2598 de 2022, vigente desde el 7 de enero de 2023 (el Decreto 1881 de 2021 fijaba el 15%).'),
    62: (40.0, 'Arancel del 40% para todo el capítulo por el Decreto 2598 de 2022, vigente desde el 7 de enero de 2023 (el Decreto 1881 de 2021 fijaba el 15%).'),
}

def aplicar_modificaciones(secciones):
    for sec in secciones:
        for cap in sec['capitulos']:
            if cap['n'] not in MODIFICACIONES: continue
            gravamen, nota = MODIFICACIONES[cap['n']]
            cap['nota'] = nota
            for item in cap['items']:
                if len(item[0]) == 13: item[3] = gravamen
    return secciones

if __name__ == '__main__':
    secciones = aplicar_modificaciones(convertir(texto(sys.argv[1])))
    json.dump({'fuente': 'Decreto 1881 de 2021, Arancel de Aduanas (compilación jurídica de la DIAN)', 'secciones': secciones},
              sys.stdout, ensure_ascii=False, separators=(',', ':'))
