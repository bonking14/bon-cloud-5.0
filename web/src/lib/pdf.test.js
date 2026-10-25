import { describe, it, expect, vi } from 'vitest';
import { descargarConstancia } from './constancia.js';
import { descargarInforme } from '../features/simulador/informePdf.js';
import { simularOperacion } from './simulador.js';

// jsPDF define save() en cada instancia: se reemplaza para no escribir archivos
const guardar = vi.fn();
vi.mock('jspdf', async (original) => {
  const m = await original();
  class JsPDFSinGuardar extends m.jsPDF {
    constructor(...args) {
      super(...args);
      this.save = guardar;
    }
  }
  return { ...m, jsPDF: JsPDFSinGuardar };
});

describe('PDF', () => {
  it('genera la constancia y el informe del simulador sin errores', async () => {
    await descargarConstancia('Ana Pérez', 8);
    await descargarInforme(simularOperacion({
      descripcion_mercancia: 'Bombas', subpartida: '8413.60.90.00', valor_usd: 60000, arancel: 5, iva: 19,
      tipo_carga: 'Contenedor 20ft', peso_kg: 9000, pais_origen: 'China', puerto_embarque: 'Shanghái',
      incoterm: 'FOB', regimen: 'Importación ordinaria', flete_usd: 3500, seguro_usd: 300, trm: 4100,
      usa_agencia: false, licencia_previa: false, primera_importacion: false,
    }));
    expect(guardar).toHaveBeenCalledTimes(2);
    expect(guardar.mock.calls[0][0]).toBe('Constancia_BonCloud_Ana_Pérez.pdf');
    expect(guardar.mock.calls[1][0]).toMatch(/^simulacion-boncloud-\d{8}\.pdf$/);
  });
});
