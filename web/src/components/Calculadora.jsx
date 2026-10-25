import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CampoNumero from './CampoNumero.jsx';
import { toNumber } from '../lib/numeros.js';
import { useTasaReferencia } from '../hooks/useTasaReferencia.js';

// Calculadora de una modalidad aduanera. La configuración (campos, columnas,
// cálculo y filas del resultado) viene de cada módulo.
//   modalidad: { titulo, badge, subtitulo, info, columnas: [{ titulo, campos }], calcular(v) -> filas, validar?(v, crudos) -> error }
//   campos: { [id]: { etiqueta, ayuda, placeholder, permiteCero } }
export default function Calculadora({ modalidad, campos, textoBoton = 'Calcular', valoresRef }) {
  const [params] = useSearchParams();
  const idsCampos = modalidad.columnas.flatMap((c) => c.campos);
  const [valores, setValores] = useState(() => precargar(idsCampos, params));
  const [pistaTrm, setPistaTrm] = useState(params.get('trm') ? 'Valor del caso de práctica de la Ruta de Aprendizaje' : '');
  const [filas, setFilas] = useState(null);
  const [error, setError] = useState('');
  const resultadosRef = useRef(null);
  const precargado = idsCampos.some((id) => params.get(id) !== null);

  const ponerTasa = useCallback((tasa, pista) => {
    setValores((v) => (v.trm ? v : { ...v, trm: tasa }));
    setPistaTrm((p) => p || pista);
  }, []);
  useTasaReferencia(ponerTasa, idsCampos.includes('trm'));

  // Al cambiar de modalidad se limpia el resultado, pero se conservan los valores escritos
  useEffect(() => { setFilas(null); setError(''); }, [modalidad]);

  const numeros = Object.fromEntries(idsCampos.map((id) => [id, toNumber(valores[id])]));
  if (valoresRef) valoresRef.current = numeros; // el comparador lee los mismos valores

  const calcular = (e) => {
    e.preventDefault();
    const msg = numeros.fob === 0 ? 'Ingresa el valor FOB.'
      : numeros.trm === 0 ? 'Ingresa la TRM.'
      : modalidad.validar?.(numeros, valores) || '';
    setError(msg);
    if (msg) return;
    setFilas(modalidad.calcular(numeros));
    requestAnimationFrame(() => resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  return (
    <>
      <div className="dashboard-header">
        <div className="modal-header-info">
          <span className="modal-badge">{modalidad.badge}</span>
          <div>
            <h1>{modalidad.titulo}</h1>
            <p>{modalidad.subtitulo}</p>
          </div>
        </div>
      </div>

      <div className="modal-info-bar visible">
        <span dangerouslySetInnerHTML={{ __html: modalidad.info }} />
        {precargado && (
          <><br /><strong>Datos precargados desde la Ruta de Aprendizaje.</strong> Pulsa «{textoBoton}» para ver la liquidación del caso.</>
        )}
      </div>

      <div className="calc-grid">
        <form className="calc-form" onSubmit={calcular} noValidate>
          <div className="form-layout">
            {modalidad.columnas.map((col) => (
              <div className="form-col" key={col.titulo}>
                <h4 className="col-title">{col.titulo}</h4>
                <div className="col-content">
                  {col.campos.map((id) => (
                    <CampoNumero
                      key={id}
                      id={id}
                      {...campos[id]}
                      valor={valores[id] ?? ''}
                      pista={id === 'trm' ? pistaTrm : campos[id].pista}
                      onChange={(v) => setValores((prev) => ({ ...prev, [id]: v }))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {error && <p className="calc-error" role="alert">{error}</p>}
          <button type="submit" className="btn-calcular btn-cta">{textoBoton}</button>
        </form>

        {filas && (
          <div className="calc-resultados" ref={resultadosRef} aria-live="polite">
            <h3>📊 Desglose de costos</h3>
            {filas.map((f) => (
              <div key={f.label} className={`resultado-row ${f.clase || ''}`}>
                <span className="label">{f.label}</span>
                <span className="valor">{f.valor}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function precargar(ids, params) {
  const v = {};
  ids.forEach((id) => {
    const p = params.get(id);
    if (p !== null && !isNaN(Number(p))) v[id] = Number(p).toLocaleString('en-US', { maximumFractionDigits: 2 });
  });
  return v;
}
