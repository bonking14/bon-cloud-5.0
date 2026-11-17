import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Costeo from './Costeo.jsx';

afterEach(cleanup);

describe('costeo de la exportación', () => {
  it('con el caso del café cotiza FOB 162.000 y CIF 166.200, y en CIF el flete pasa al vendedor', () => {
    render(<Costeo />);
    fireEvent.click(screen.getByText(/Cargar caso del café/));
    expect(screen.getByText('= Precio de venta FOB').nextSibling.textContent).toBe('USD 162,000.00');
    const filaFlete = screen.getByLabelText('Flete internacional').closest('tr');
    expect(filaFlete.textContent).toContain('Comprador');
    fireEvent.click(screen.getAllByRole('button', { name: 'CIF' })[0]);
    expect(screen.getByText('= Precio de venta CIF').nextSibling.textContent).toBe('USD 166,200.00');
    expect(filaFlete.textContent).toContain('Vendedor');
    // la DEX sigue declarando FOB
    expect(screen.getByText(/Valor FOB a declarar/).nextSibling.textContent).toBe('USD 162,000.00');
    expect(screen.getByText('Comparación de los 11 Incoterms')).toBeTruthy();
  });

  it('al escribir un costo se recalcula el precio', () => {
    render(<Costeo />);
    fireEvent.change(screen.getByLabelText(/Valor de la mercancía en fábrica/), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Embalaje y empaque de exportación'), { target: { value: '50' } });
    expect(screen.getByText('= Precio de venta FOB').nextSibling.textContent).toBe('USD 1,050.00');
  });
});
