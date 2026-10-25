import { describe, it, expect } from 'vitest';
import { tokenVencido } from './api.js';

const jwt = (payload) => `x.${btoa(JSON.stringify(payload)).replace(/=+$/, '')}.y`;

describe('tokenVencido', () => {
  it('detecta un token vencido y uno vigente', () => {
    const ahora = Math.floor(Date.now() / 1000);
    expect(tokenVencido(jwt({ exp: ahora - 60 }))).toBe(true);
    expect(tokenVencido(jwt({ exp: ahora + 3600 }))).toBe(false);
  });

  it('trata como vencido un token mal formado', () => {
    expect(tokenVencido('boncloud-token')).toBe(true);
  });
});
