import { useState } from 'react';
import { calcularOrdinaria, calcularFranquicia, calcularTemporalCorto } from '../../lib/importacion.js';
import { formatUSD, formatCOP } from '../../lib/numeros.js';
import css from './Comparador.module.css';

// Valores de ejemplo para los campos que estén vacíos
const EJEMPLO = { fob: 15000, flete: 2500, seguro: 0, arancel: 10, trm: 4200, agencia: 1200000, bodegaje: 600000, transporte: 800000 };

export default function Comparador({ valoresRef }) {
  const [r, setR] = useState(null);

  const comparar = () => {
    const actuales = valoresRef.current || {};
    const v = Object.fromEntries(Object.entries(EJEMPLO).map(([k, def]) => [k, actuales[k] || (k in actuales ? 0 : def)]));
    setR({ ord: calcularOrdinaria(v), fran: calcularFranquicia(v), temp: calcularTemporalCorto(v) });
  };

  return (
    <section className={css.comparador}>
      <div className={css.encabezado}>
        <div>
          <h3>⚖️ Comparador de Modalidades de Importación</h3>
          <p>Analiza de un vistazo las diferencias en arancel, IVA y total a pagar entre los 3 regímenes principales.</p>
        </div>
        <button type="button" className="btn-calcular" onClick={comparar}>Comparar valores 🔄</button>
      </div>

      <div className="tabla-scroll">
        <table className={`tabla-incoterms ${css.tabla}`}>
          <thead>
            <tr>
              <th>Concepto</th>
              <th className={css.azul}>Ordinaria (C100)</th>
              <th className={css.verde}>Con Franquicia (C160)</th>
              <th className={css.ambar}>Temporal Corto (S100)</th>
            </tr>
          </thead>
          <tbody>
            {!r ? (
              <tr><td colSpan={4} className={css.vacio}>Ingresa los valores en la calculadora o haz clic en «Comparar valores».</td></tr>
            ) : (
              <>
                <tr><td>1. Valor CIF (USD)</td><td>{formatUSD(r.ord.cifUSD)}</td><td>{formatUSD(r.fran.cifUSD)}</td><td>{formatUSD(r.temp.cifUSD)}</td></tr>
                <tr><td>2. Base gravable (COP)</td><td>{formatCOP(r.ord.baseArancelariaCOP)}</td><td>{formatCOP(r.fran.baseArancelariaCOP)}</td><td>{formatCOP(r.temp.baseArancelariaCOP)}</td></tr>
                <tr><td>3. Arancel ad valorem</td><td className={css.rojo}>{formatCOP(r.ord.totalArancel)}</td><td className={css.verde}>EXENTO (0%)</td><td className={css.ambar}>SUSPENDIDO</td></tr>
                <tr><td>4. IVA (19%)</td><td className={css.rojo}>{formatCOP(r.ord.totalIVA)}</td><td className={css.verde}>EXENTO (0%)</td><td className={css.ambar}>SUSPENDIDO</td></tr>
                <tr><td>5. Póliza / garantía aduanera</td><td className={css.tenue}>N/A</td><td className={css.tenue}>N/A</td><td className={css.ambar}>{formatCOP(r.temp.poliza)}</td></tr>
                <tr className={css.total}><td>TOTAL A PAGAR (COP)</td><td className={css.azul}>{formatCOP(r.ord.totalPagar)}</td><td className={css.verde}>{formatCOP(r.fran.totalPagar)}</td><td className={css.ambar}>{formatCOP(r.temp.totalPagar)}</td></tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
