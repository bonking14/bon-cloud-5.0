import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SigloXXII from './SigloXXII.jsx';
import { RUTA_MENU } from '../../lib/sigloxxii.js';

afterEach(cleanup);
const abrir = () => render(<MemoryRouter><SigloXXII /></MemoryRouter>);
const entrar = () => {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'alumno01' } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'practica' } });
  fireEvent.click(screen.getByText('Entrar'));
};

describe('SIGLO XXII', () => {
  it('no deja entrar con una contraseña equivocada', () => {
    abrir();
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'ALUMNO01' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'otra' } });
    fireEvent.click(screen.getByText('Entrar'));
    expect(screen.getByRole('alert').textContent).toMatch(/incorrectos/);
  });

  it('el menú avisa cuando se elige una opción que no es de la práctica', () => {
    abrir();
    entrar();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Importaciones' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Declarante SIA ó ALTEX' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Recibo Oficial Pago' }));
    expect(screen.getByRole('alert').textContent).toMatch(/sigue por «Declaraciones»/);
  });

  it('recorrido completo: menú, parámetros, encabezado, subpartida y autoliquidación de $65.264.000', () => {
    abrir();
    entrar();
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    // parámetros previos
    fireEvent.click(screen.getByText('SIGUIENTE'));
    fireEvent.click(screen.getByText('INGRESAR'));
    expect(screen.getByRole('alert').textContent).toMatch(/BOLIVAR/);
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByText('INGRESAR'));
    // encabezado: vacío no guarda y dice qué falta
    fireEvent.click(screen.getByText('SALVAR'));
    expect(screen.getByRole('alert').textContent).toMatch(/NIT del importador: falta/);
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    expect(screen.getByLabelText('DV').value).toBe('8');
    fireEvent.click(screen.getByText('SALVAR'));
    // subpartida: sin autoliquidar no guarda
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByText('SALVAR'));
    expect(screen.getByRole('alert').textContent).toMatch(/Falta la autoliquidación/);
    fireEvent.click(screen.getByText('AUTOLIQUIDACIÓN'));
    expect(screen.getByTestId('sx-total').textContent).toBe('65.264.000');
    fireEvent.click(screen.getByText('SALVAR'));
    expect(screen.getByRole('status').textContent).toMatch(/Declaración guardada/);
    expect(screen.getByText(/total a pagar \$65.264.000/)).toBeTruthy();
  });
});
