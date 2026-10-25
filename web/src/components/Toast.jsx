import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});

// Avisos cortos en la esquina (aprobaste una lección, progreso reiniciado...)
export function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  const avisar = useCallback((mensaje, tipo = 'info') => {
    const id = Date.now() + Math.random();
    setAvisos((a) => [...a, { id, mensaje, tipo }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={avisar}>
      {children}
      {avisos.map((a, i) => (
        <div key={a.id} className={`boncloud-toast toast-${a.tipo} show`} role="status" style={{ transform: `translateY(${-i * 64}px)` }}>
          {a.mensaje}
        </div>
      ))}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
