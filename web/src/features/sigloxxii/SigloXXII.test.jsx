import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SigloXXII from './SigloXXII.jsx';
import { RUTA_MENU } from '../../lib/sigloxxii.js';
import { pedir } from '../../auth/api.js';

// Sesión simulada: por defecto, invitado
const sesion = { usuario: { invitado: true }, tokenApi: null };
vi.mock('../../auth/AuthContext.jsx', () => ({ useAuth: () => sesion }));
vi.mock('../../auth/api.js', () => ({ pedir: vi.fn(() => Promise.resolve({ ok: true })) }));

afterEach(() => { cleanup(); Object.assign(sesion, { usuario: { invitado: true }, tokenApi: null }); pedir.mockClear(); });
const abrir = () => render(<MemoryRouter><SigloXXII /></MemoryRouter>);
const entrar = (nombre = 'alumno01') => {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: nombre } });
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
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('alert').textContent).toMatch(/BOLIVAR/);
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    // encabezado: vacío no guarda y dice qué falta
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByRole('alert').textContent).toMatch(/NIT del importador: falta/);
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    expect(screen.getByLabelText('DV').value).toBe('8');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    // subpartida: sin autoliquidar no guarda
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByRole('alert').textContent).toMatch(/Falta la autoliquidación/);
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    expect(screen.getByTestId('sx-total').textContent).toBe('65.264.000');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByRole('status').textContent).toMatch(/Declaración guardada/);
    expect(screen.getByText(/total a pagar \$65.264.000/)).toBeTruthy();
  });

  it('como invitado no registra la práctica y lo dice', () => {
    abrir();
    entrar();
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByTestId('sx-registro').textContent).toMatch(/invitado/);
    expect(pedir).not.toHaveBeenCalled();
  });

  it('con cuenta: cada alumno entra con su propio usuario y la práctica queda registrada con sus errores', async () => {
    Object.assign(sesion, { usuario: { id: 42, nombre: 'Ana' }, tokenApi: 'jwt' });
    abrir();
    // el usuario de ejemplo ya no sirve: el suyo es A000042
    entrar('ALUMNO01');
    expect(screen.getByRole('alert').textContent).toMatch(/A000042/);
    entrar('a000042');
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' })); // encabezado vacío: segundo error
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(pedir).toHaveBeenCalledTimes(1);
    expect(pedir).toHaveBeenCalledWith('/practicas', { metodo: 'POST', token: 'jwt', cuerpo: { practica: 'sigloxxii-importacion', errores: 2, conSolucion: true } });
    expect((await screen.findByText(/quedó registrada/)).textContent).toMatch(/2 pantallas con errores/);
  });

  it('la consulta de códigos llena el campo, y al final la declaración pasa al formulario 500', () => {
    abrir();
    entrar();
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    // el alumno busca el código de Panamá para la bandera
    fireEvent.click(screen.getByRole('button', { name: 'Buscar código: Bandera (cód.)' }));
    fireEvent.change(screen.getByLabelText('Buscar en la tabla'), { target: { value: 'panam' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar' }));
    expect(screen.getByLabelText('Bandera (cód.)').value).toBe('PA');
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Generar el formulario 500 (PDF)' }));
    const precarga = JSON.parse(sessionStorage.getItem('boncloud-precarga-500'));
    expect(precarga.valores.subpartida).toBe('8413.60.90.00');
    expect(precarga.valores.v_fob).toBe('60000');
  });
});
