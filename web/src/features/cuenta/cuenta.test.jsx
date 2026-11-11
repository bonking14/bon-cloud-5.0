import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../auth/AuthContext.jsx';
import Restablecer from './Restablecer.jsx';
import VerificarCorreo from './VerificarCorreo.jsx';
import Perfil from './Perfil.jsx';
import AdminUsuarios from './AdminUsuarios.jsx';
import { pedir } from '../../auth/api.js';

vi.mock('../../auth/api.js', () => ({ pedir: vi.fn(), tokenVencido: () => false }));

const sesion = (usuario) => {
  localStorage.setItem('token', 'jwt-de-prueba');
  localStorage.setItem('usuario', JSON.stringify(usuario));
};
const montar = (ruta, elemento, path) => render(
  <AuthProvider>
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path={path} element={elemento} />
        <Route path="/inicio" element={<p>PÁGINA DE INICIO</p>} />
        <Route path="/" element={<p>INGRESO</p>} />
      </Routes>
    </MemoryRouter>
  </AuthProvider>,
);

beforeEach(() => { localStorage.clear(); pedir.mockReset(); pedir.mockResolvedValue({}); });
afterEach(cleanup);

describe('restablecer contraseña', () => {
  it('sin código en el enlace no muestra el formulario', () => {
    montar('/restablecer', <Restablecer />, '/restablecer');
    expect(screen.getByRole('alert').textContent).toMatch(/le falta el código/);
    expect(screen.queryByLabelText('Contraseña nueva')).toBeNull();
  });

  it('valida la regla y que coincidan antes de llamar al servidor, y luego envía el código', async () => {
    pedir.mockResolvedValue({ mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
    montar('/restablecer?token=abc123', <Restablecer />, '/restablecer');
    const guardar = () => fireEvent.click(screen.getByText('Guardar contraseña'));
    fireEvent.change(screen.getByLabelText('Contraseña nueva'), { target: { value: 'debil' } });
    guardar();
    expect(screen.getByRole('status').textContent).toMatch(/no cumple la regla/);
    fireEvent.change(screen.getByLabelText('Contraseña nueva'), { target: { value: 'Segura123!' } });
    fireEvent.change(screen.getByLabelText('Repite la contraseña'), { target: { value: 'Segura124!' } });
    guardar();
    expect(screen.getByRole('status').textContent).toMatch(/no coinciden/);
    expect(pedir).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Repite la contraseña'), { target: { value: 'Segura123!' } });
    guardar();
    await screen.findByText(/Ya puedes iniciar sesión/);
    expect(pedir).toHaveBeenCalledWith('/auth/reset-password', { metodo: 'POST', cuerpo: { token: 'abc123', password: 'Segura123!' } });
  });
});

describe('verificar correo', () => {
  it('envía el código una sola vez y muestra el error del servidor si venció', async () => {
    pedir.mockRejectedValue(new Error('El enlace no es válido o ya venció.'));
    montar('/verificar-correo?token=xyz', <VerificarCorreo />, '/verificar-correo');
    await screen.findByText(/ya venció/);
    expect(pedir.mock.calls.filter(([ruta]) => ruta === '/auth/verify-email')).toHaveLength(1);
  });
});

describe('perfil y administración', () => {
  it('el perfil avisa del correo sin confirmar y permite reenviar el enlace', async () => {
    sesion({ id: 7, nombre: 'Ana', email: 'ana@example.com', rol: 'estudiante', emailVerificado: false });
    pedir.mockImplementation(async (ruta) => (ruta === '/auth/resend-verification' ? { mensaje: 'Te enviamos un nuevo enlace de confirmación.' } : {}));
    montar('/perfil', <Perfil />, '/perfil');
    fireEvent.click(screen.getByText('Reenviar enlace'));
    await screen.findByText(/nuevo enlace de confirmación/);
    expect(screen.getByText('estudiante')).toBeTruthy();
  });

  it('al cargar se refresca el rol desde el servidor', async () => {
    sesion({ id: 7, nombre: 'Ana', email: 'ana@example.com', rol: 'estudiante', emailVerificado: true });
    pedir.mockImplementation(async (ruta) => (ruta === '/cuenta' ? { usuario: { id: 7, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor', emailVerificado: true } } : {}));
    montar('/perfil', <Perfil />, '/perfil');
    await screen.findByText('profesor');
    expect(JSON.parse(localStorage.getItem('usuario')).rol).toBe('profesor');
  });

  it('el invitado no tiene perfil', () => {
    localStorage.setItem('token', 'invitado');
    localStorage.setItem('usuario', JSON.stringify({ nombre: 'Invitado', invitado: true }));
    montar('/perfil', <Perfil />, '/perfil');
    expect(screen.getByText('PÁGINA DE INICIO')).toBeTruthy();
  });

  it('quien no es administrador no ve la lista de usuarios ni la pide al servidor', async () => {
    sesion({ id: 7, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor', emailVerificado: true });
    montar('/admin/usuarios', <AdminUsuarios />, '/admin/usuarios');
    expect(screen.getByText('PÁGINA DE INICIO')).toBeTruthy();
    await waitFor(() => expect(pedir.mock.calls.some(([ruta]) => ruta.startsWith('/admin'))).toBe(false));
  });

  it('el administrador lista usuarios y no puede cambiar su propio rol', async () => {
    sesion({ id: 1, nombre: 'Jefe', email: 'jefe@example.com', rol: 'administrador', emailVerificado: true });
    pedir.mockImplementation(async (ruta) => (ruta.startsWith('/admin/usuarios') ? {
      total: 2, pagina: 1, porPagina: 25,
      usuarios: [
        { id: 1, nombre: 'Jefe', email: 'jefe@example.com', rol: 'administrador', emailVerificado: true },
        { id: 7, nombre: 'Ana', email: 'ana@example.com', rol: 'estudiante', emailVerificado: false },
      ],
    } : {}));
    montar('/admin/usuarios', <AdminUsuarios />, '/admin/usuarios');
    expect((await screen.findByLabelText('Rol de Ana')).value).toBe('estudiante');
    expect(screen.queryByLabelText('Rol de Jefe')).toBeNull();
    expect(screen.getByText('administrador (tú)')).toBeTruthy();
  });
});
