import { createContext, useContext } from 'react';

// Estado del formulario abierto: valores de los campos con nombre, campos con
// error, y las explicaciones de cada casilla para la burbuja de ayuda.
export const FormularioContext = createContext(null);

export function useCampos() {
  const ctx = useContext(FormularioContext);
  if (!ctx) throw new Error('Los campos del formulario deben ir dentro de <FormularioContext.Provider>');
  return ctx;
}
