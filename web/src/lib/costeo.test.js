import { describe, it, expect } from 'vitest';
import { CONCEPTOS, INCOTERMS, costear, compararIncoterms, pagaVendedor } from './costeo.js';
import { incoterms } from '../data/incoterms.js';

// Caso del café: USD 162.000 FOB Cartagena
const caso = {
  exw: 155500, embalaje: 1200, marcado: 100, cargue_fabrica: 200, transporte_origen: 600, documentos: 300,
  aduana_origen: 450, puerto_origen: 2400, cargue_buque: 1250, flete: 3800, seguro: 400,
  descargue_destino: 600, puerto_destino: 700, transporte_destino: 900, aduana_destino: 13000,
};

describe('costeo de la exportación', () => {
  it('el precio FOB del caso es USD 162.000 y coincide con el valor FOB de la DEX', () => {
    const r = costear(caso, 'FOB');
    expect(r.precio).toBe(162000);
    expect(r.fob).toBe(162000);
  });

  it('en CIF el vendedor suma flete y seguro, pero la DEX sigue declarando FOB', () => {
    const r = costear(caso, 'CIF');
    expect(r.precio).toBe(166200);
    expect(r.fob).toBe(162000);
  });

  it('en EXW el vendedor solo pone embalaje y marcado; en DDP lo asume todo', () => {
    expect(costear(caso, 'EXW').precio).toBe(155500 + 1200 + 100);
    const ddp = costear(caso, 'DDP');
    expect(ddp.costosComprador).toBe(0);
    expect(ddp.precio).toBe(ddp.costoTotal);
  });

  it('EXW es el precio más bajo, DDP el más alto, y el costo total no cambia', () => {
    const lista = compararIncoterms(caso);
    const precios = lista.map((r) => r.precio);
    expect(Math.min(...precios)).toBe(lista[0].precio);
    expect(Math.max(...precios)).toBe(lista[10].precio);
    expect(new Set(lista.map((r) => r.costoTotal)).size).toBe(1);
  });

  it('coincide con la tabla de responsabilidades de la página de Incoterms', () => {
    const equivalencias = { flete: 'Flete internacional', seguro: 'Seguro', transporte_destino: 'Transporte destino', aduana_origen: 'Aduana exportación' };
    incoterms.forEach((inc) => {
      Object.entries(equivalencias).forEach(([id, columna]) => {
        const c = CONCEPTOS.find((x) => x.id === id);
        expect([inc.code, id, pagaVendedor(c, inc.code)]).toEqual([inc.code, id, inc.responsabilidades[columna] === 'Vendedor']);
      });
    });
    expect(INCOTERMS).toEqual(incoterms.map((i) => i.code));
  });
});
