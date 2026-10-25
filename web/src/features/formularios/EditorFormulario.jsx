import { useCallback, useEffect, useMemo, useState } from 'react';
import { faltantes } from '../../lib/formularios.js';
import { FormularioContext } from './kit/contexto.js';
import './kit/formularios-dian.css';

// Carga la definición del formulario (componente, valores iniciales, caso de
// práctica, campos obligatorios y explicaciones) y maneja su estado.
export default function EditorFormulario({ form, onVolver }) {
  const [definicion, setDefinicion] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vigente = true;
    setDefinicion(null);
    form.cargar()
      .then((m) => vigente && setDefinicion(m.default))
      .catch(() => vigente && setError(true));
    return () => { vigente = false; };
  }, [form]);

  if (error) return <p className="dian-mensaje error">No se pudo cargar el formulario. Revisa tu conexión y vuelve a intentarlo.</p>;
  if (!definicion) return <p className="cargando-pagina" role="status">Cargando formulario…</p>;
  return <Lienzo key={definicion.id} definicion={definicion} onVolver={onVolver} />;
}

function Lienzo({ definicion, onVolver }) {
  const [valores, setValores] = useState(definicion.inicial);
  const [errores, setErrores] = useState(() => new Set());
  const [mensaje, setMensaje] = useState(null); // { tipo: 'error' | 'info', texto }
  const [version, setVersion] = useState(0); // al reiniciar se vuelven a montar los campos libres

  const poner = useCallback((nombre, valor) => {
    setValores((v) => ({ ...v, [nombre]: valor }));
    setErrores((e) => {
      if (!e.has(nombre)) return e;
      const copia = new Set(e);
      copia.delete(nombre);
      return copia;
    });
  }, []);
  const ponerVarios = useCallback((cambios) => setValores((v) => ({ ...v, ...cambios })), []);

  const contexto = useMemo(() => ({
    valores, poner, ponerVarios, errores,
    explicaciones: definicion.explicaciones, sigla: definicion.sigla,
  }), [valores, poner, ponerVarios, errores, definicion]);

  const imprimir = () => {
    const faltan = faltantes(valores, definicion.obligatorios);
    setErrores(new Set(faltan.map(([nombre]) => nombre)));
    if (faltan.length) {
      setMensaje({ tipo: 'error', texto: `Faltan campos obligatorios:\n${faltan.map(([, d]) => `• ${d}`).join('\n')}` });
      return;
    }
    setMensaje(null);
    window.print();
  };

  const cargarCaso = () => {
    setValores({ ...definicion.inicial(), ...definicion.caso.valores() });
    setErrores(new Set());
    setMensaje({ tipo: 'info', texto: definicion.caso.mensaje });
  };

  const reiniciar = () => {
    setValores(definicion.inicial());
    setErrores(new Set());
    setMensaje(null);
    setVersion((n) => n + 1);
  };

  const Componente = definicion.Componente;
  return (
    <div>
      <div className="editor-header no-imprimir">
        <button type="button" className="btn-card" onClick={onVolver}>Volver al catálogo</button>
        <div className="editor-actions">
          <button type="button" className="btn-card" onClick={cargarCaso}>⚡ {definicion.caso.boton}</button>
          <button type="button" className="btn-card" onClick={reiniciar}>Reiniciar formulario</button>
          <button type="button" className="btn-card btn-calcular" onClick={imprimir}>Imprimir o guardar PDF</button>
        </div>
      </div>
      {mensaje && <p className={`dian-mensaje ${mensaje.tipo} no-imprimir`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>{mensaje.texto}</p>}
      <FormularioContext.Provider value={contexto}>
        <div className="dian-scroll" key={version}>
          <Componente />
        </div>
      </FormularioContext.Provider>
    </div>
  );
}
