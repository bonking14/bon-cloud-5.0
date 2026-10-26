import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '../auth/AuthContext.jsx';
import { ProgresoProvider, useProgreso } from './ProgresoContext.jsx';

vi.mock('../auth/api.js', () => ({
  // La API responde sin progreso: aquí solo se prueba lo que queda en el navegador
  pedir: vi.fn(() => Promise.resolve({ progreso: { leccionesCompletadas: [] } })),
  tokenVencido: () => false,
}));

let ctx;
function Sonda() {
  ctx = { ...useAuth(), ...useProgreso() };
  return <span data-testid="completadas">{ctx.completadas.join(',')}</span>;
}

const montar = () => render(<AuthProvider><ProgresoProvider><Sonda /></ProgresoProvider></AuthProvider>);
const completadas = () => screen.getByTestId('completadas').textContent;

// Simula una sesión real ya abierta en el navegador
function sesionGuardada(usuario) {
  localStorage.setItem('token', 'jwt-de-prueba');
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

describe('progreso del curso por persona', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('el invitado empieza de cero y su progreso se borra al cerrar sesión', () => {
    montar();
    act(() => ctx.entrarComoInvitado());
    act(() => { ctx.completar(1); });
    expect(completadas()).toBe('1');

    act(() => ctx.cerrarSesion());
    act(() => ctx.entrarComoInvitado());
    expect(completadas()).toBe('');
  });

  it('dos cuentas en el mismo navegador no comparten progreso', () => {
    sesionGuardada({ id: 7, nombre: 'Ana' });
    const { unmount } = montar();
    act(() => { ctx.completar(1); });
    act(() => { ctx.completar(2); });
    expect(completadas()).toBe('1,2');
    act(() => ctx.cerrarSesion());
    unmount();

    sesionGuardada({ id: 8, nombre: 'Luis' });
    const segundo = montar();
    expect(completadas()).toBe('');
    segundo.unmount();

    // Ana vuelve y recupera lo suyo
    sesionGuardada({ id: 7, nombre: 'Ana' });
    montar();
    expect(completadas()).toBe('1,2');
  });

  it('el progreso guardado en la clave compartida anterior pasa a la sesión abierta', () => {
    localStorage.setItem('boncloud_progreso_curso_v2', JSON.stringify({ leccionesCompletadas: [1, 2, 3] }));
    sesionGuardada({ id: 7, nombre: 'Ana' });
    montar();
    expect(completadas()).toBe('1,2,3');
    expect(localStorage.getItem('boncloud_progreso_curso_v2')).toBeNull();
  });
});
