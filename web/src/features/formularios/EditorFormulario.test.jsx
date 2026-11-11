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
    expect(screen.getByLabelText('Valor aduana USD').value).toBe('63.800,00');
    expect(screen.getByLabelText('Arancel: total liquidado').value).toBe('13.079.000');
    expect(screen.getByLabelText('Pago total').value).toBe('65.264.000');
    expect(screen.getByText(/debes presentar la Declaración Andina del Valor/)).toBeTruthy();
    expect(screen.queryByText(/Vistos buenos requeridos/)).toBeNull(); // las bombas no los exigen
  });

  it('500: una subpartida del catálogo propone arancel e IVA y avisa los vistos buenos', async () => {
    abrir('500');
    const sp = await screen.findByLabelText('Subpartida arancelaria', {}, ESPERA);
    fireEvent.change(sp, { target: { value: '8517130000' } });
    expect(sp.value).toBe('8517.13.00.00');
    expect(screen.getByLabelText('Descripción de las mercancías').value).not.toBe('');
    expect(screen.getByLabelText('IVA: tarifa %').value).toBe('19');
    expect(screen.getByText(/Vistos buenos requeridos/)).toBeTruthy();
  });

  it('500: las casillas reservadas a la DIAN no tienen campo y cada casilla explica qué lleva', async () => {
    abrir('500');
    const tasa = await screen.findByLabelText('Tasa de cambio', {}, ESPERA);
    expect(document.querySelector('[data-casilla="132"]')).toBeNull();
    expect(document.querySelector('[data-casilla="997"]')).toBeNull();
    fireEvent.focus(tasa);
    expect(screen.getByRole('status').textContent).toMatch(/Casilla 58\..*último día hábil de la semana anterior/);
  });

  it('500: el DV del NIT se calcula al escribir', async () => {
    abrir('500');
    const nit = await screen.findByLabelText('NIT del importador', {}, ESPERA);
    fireEvent.change(nit, { target: { value: '800197268' } });
    expect(screen.getByLabelText('DV del importador').value).toBe('4');
  });

  it('imprimir sin los obligatorios muestra qué falta y no abre la impresión', async () => {
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {});
    abrir('600');
    fireEvent.click(await screen.findByText('Imprimir o guardar PDF', {}, ESPERA));
    expect(screen.getByRole('alert').textContent).toMatch(/NIT del exportador/);
    expect(imprimir).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText(/Cargar caso de la Ruta/));
    fireEvent.click(screen.getByText('Imprimir o guardar PDF'));
    expect(imprimir).toHaveBeenCalledTimes(1);
  });

  it('600: el caso suma USD 162.000 y la hoja 2 repite los datos del exportador', async () => {
    abrir('600');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getByLabelText('Valor total exportaciones USD').value).toBe('162.000,00');
    expect(screen.getByLabelText('NIT del exportador (hoja 2)').value).toBe('890900123');
    expect(screen.getByLabelText('Subpartida').value).toBe('0901.21.10.00');
  });

  it('600: tiene las ocho hojas del original y las de continuación repiten al exportador', async () => {
    abrir('600');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getAllByRole('tab')).toHaveLength(8);
    for (let n = 3; n <= 8; n++) expect(screen.getByLabelText(`NIT del exportador (hoja ${n})`).value).toBe('890900123');
    // cada registro de las hojas de continuación tiene su campo, con el rótulo del original
    fireEvent.change(screen.getByLabelText('No. Manifiesto de carga, registro 1'), { target: { value: 'MC-001' } });
    expect(screen.getByLabelText('No. Manifiesto de carga, registro 1').value).toBe('MC-001');
    expect(screen.getByLabelText('Número de identificación, registro 7')).toBeTruthy(); // hoja 3: siete transportadores
    expect(screen.getByLabelText('Fecha expedición, registro 11')).toBeTruthy(); // hoja 4: once documentos
    expect(screen.getByLabelText('No. Programa, fila 30')).toBeTruthy(); // hoja 5: treinta ítems
    expect(screen.getAllByLabelText('Fecha DEX, fila 43')).toHaveLength(2); // hoja 7: 86 embarques en dos columnas
    expect(screen.getAllByLabelText('Descripción, registro 1').some((el) => el.tagName === 'TEXTAREA')).toBe(true); // hoja 8
  });

  it('560: la hoja 2 continúa los ítems del 4 al 25', async () => {
    abrir('560');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getByLabelText('NIT del importador (hoja 2)').value).toBe('900123456');
    expect(screen.getByLabelText('Nombre comercial, ítem 4')).toBeTruthy();
    expect(screen.getByLabelText('Precio FOB unitario USD, ítem 25')).toBeTruthy();
    expect(screen.queryByLabelText('Nombre comercial, ítem 26')).toBeNull();
  });

  it('560: el caso da valor en aduana USD 63.800 (casilla 135)', async () => {
    abrir('560');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getByLabelText('Valor de transacción declarado').value).toBe('63.800,00');
  });

  it('650: carga el tránsito del módulo 3 y no deja llenar las casillas de uso oficial', async () => {
    abrir('650');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getByDisplayValue('TKO-892 / R-45871')).toBeTruthy();
    expect(screen.getByLabelText('DV del destinatario').value).toBe('7');
    expect(document.querySelector('[data-casilla="64"]')).toBeNull();
    expect(document.querySelector('[data-casilla="69"]')).toBeNull();
  });

  it('001: carga el RUT del caso, con sus responsabilidades en la rejilla de la casilla 53', async () => {
    abrir('001');
    fireEvent.click(await screen.findByText(/Cargar caso de la Ruta/, {}, ESPERA));
    expect(screen.getByLabelText('DV').value).toBe('8'); // DV de 900123456
    expect(screen.getByLabelText('Responsabilidad, calidad o atributo 2').value).toBe('10');
    expect(screen.getByLabelText('Obligado aduanero: código 1').value).toBe('23');
    expect(screen.getByLabelText('Responsabilidad, calidad o atributo 26')).toBeTruthy();
    expect(document.querySelector('[data-casilla="59"]')).toBeNull(); // uso exclusivo de la DIAN
    expect(screen.getByLabelText('NIT (hoja 2)').value).toBe('900123456');
  });

  it('001: avisa si el capital nacional más el extranjero pasa del 100%', async () => {
    abrir('001');
    const nacional = await screen.findByLabelText('Nacional %', {}, ESPERA);
    fireEvent.change(nacional, { target: { value: '70' } });
    fireEvent.change(screen.getByLabelText('Extranjero %'), { target: { value: '40' } });
    expect(screen.getByRole('alert').textContent).toMatch(/suma 110%/);
  });
});
