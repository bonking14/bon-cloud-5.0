import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Quiz from './Quiz.jsx';

afterEach(cleanup);

const leccion = {
  id: 1,
  quiz: [
    { pregunta: 'P1', opciones: ['bien1', 'mal1'], correcta: 0, explicacion: 'E1' },
    { pregunta: 'P2', opciones: ['mal2', 'bien2'], correcta: 1, explicacion: 'E2' },
    { pregunta: 'P3', opciones: ['bien3', 'mal3'], correcta: 0, explicacion: 'E3' },
  ],
};

const responder = (texto) => fireEvent.click(screen.getByText(texto).closest('button'));

describe('Quiz', () => {
  it('aprueba con el 70% y avisa una sola vez', () => {
    const onAprobar = vi.fn();
    render(<Quiz leccion={leccion} siguiente={{ id: 2, orden: 2 }} onAprobar={onAprobar} onSiguiente={() => {}} onConstancia={() => {}} />);
    expect(screen.getByText(/Necesitas 3 respuestas/)).toBeTruthy(); // ceil(3 × 0,7)
    responder('bien1');
    responder('bien2');
    responder('bien3');
    expect(onAprobar).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Aprobaste esta lección')).toBeTruthy();
    expect(screen.getByText('Ir a la lección 2')).toBeTruthy();
  });

  it('no aprueba con un error y permite reintentar', () => {
    const onAprobar = vi.fn();
    render(<Quiz leccion={leccion} siguiente={{ id: 2, orden: 2 }} onAprobar={onAprobar} onSiguiente={() => {}} onConstancia={() => {}} />);
    responder('bien1');
    responder('mal2');
    responder('bien3');
    expect(onAprobar).not.toHaveBeenCalled();
    expect(screen.getByText('Todavía no apruebas')).toBeTruthy();
    window.HTMLElement.prototype.scrollIntoView = () => {};
    fireEvent.click(screen.getByText('Reintentar evaluación'));
    expect(screen.queryByText('Todavía no apruebas')).toBeNull();
  });

  it('cada pregunta se responde una sola vez', () => {
    render(<Quiz leccion={leccion} siguiente={null} onAprobar={() => {}} onSiguiente={() => {}} onConstancia={() => {}} />);
    responder('mal1');
    expect(screen.getByText('bien1').closest('button').disabled).toBe(true);
    expect(screen.getByText('Incorrecto')).toBeTruthy();
  });
});
