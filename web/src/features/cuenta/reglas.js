// Misma regla que valida el servidor (backend/src/controllers/authController.js)
export const REGLA_CLAVE = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
export const TEXTO_REGLA = 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo (!@#$%^&*).';
export const ROLES = ['estudiante', 'profesor', 'administrador'];
