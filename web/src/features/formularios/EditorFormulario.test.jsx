import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import EditorFormulario from './EditorFormulario.jsx';
import { formularios } from './catalogo.js';

afterEach(cleanup);
// Cada formulario se carga con import(): con toda la suite corriendo puede tardar más de 1 s
const ESPERA = { timeout: 8000 };
const abrir = (id) => render(<EditorFormulario form={formularios.find((f) => f.id === id)} onVolver={() => {}} />);

describe('formularios DIAN en React', () => {
  it('500: el caso de la Ruta liquida $65.264.000 y avisa que pide DAV', async () => {
    abrir('500');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getByLabelText('Total a pagar').value).toBe('65264000.00');
    expect(screen.getByText(/debes presentar la Declaración Andina del Valor/)).toBeTruthy();
    expect(screen.queryByText(/Vistos buenos requeridos/)).toBeNull(); // las bombas no los exigen
  });

  it('500: el autocompletado llena la subpartida, el arancel y avisa los vistos buenos', async () => {
    abrir('500');
    const sp = await screen.findByLabelText('Subpartida del ítem 1', {}, ESPERA);
    fireEvent.change(sp, { target: { value: '8517' } });
    fireEvent.mouseDown(screen.getByRole('option', { name: /8517\.13/ }));
    expect(sp.value).toBe('8517.13.00.00');
    expect(screen.getByLabelText('Descripción del ítem 1').value).not.toBe('');
    expect(screen.getByText(/Vistos buenos requeridos/)).toBeTruthy();
  });

  it('500: el DV del NIT se calcula al escribir', async () => {
    abrir('500');
    const nit = (await screen.findAllByRole('textbox', {}, ESPERA)).find((el) => el.name === 'imp_nit');
    fireEvent.change(nit, { target: { value: '800197268' } });
    expect(screen.getAllByDisplayValue('4').length).toBeGreaterThan(0);
  });

  it('imprimir sin los obligatorios muestra qué falta y no abre la impresión', async () => {
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {});
    abrir('600');
    fireEvent.click(await screen.findByText('Imprimir o guardar PDF', {}, ESPERA));
    expect(screen.getByRole('alert').textContent).toMatch(/NIT del exportador/);
    expect(imprimir).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText(/Llenar datos de ejemplo/));
    fireEvent.click(screen.getByText('Imprimir o guardar PDF'));
    expect(imprimir).toHaveBeenCalledTimes(1);
  });

  it('560: el caso da valor en aduana USD 63.800 (casilla 135)', async () => {
    abrir('560');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getByLabelText('Valor de transacción declarado').value).toBe('63800.00');
  });

  it('001 y DTA cargan sus datos de ejemplo', async () => {
    abrir('001');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getAllByDisplayValue('8').length).toBeGreaterThan(0); // DV de 900123456
    cleanup();
    abrir('DTA');
    fireEvent.click(await screen.findByText(/Llenar datos de ejemplo/, {}, ESPERA));
    expect(screen.getByDisplayValue('TKO-892')).toBeTruthy();
  });
});
