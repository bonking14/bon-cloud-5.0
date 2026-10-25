import { Link } from 'react-router-dom';

// Ficha completa de un término (la usan el Glosario y la Ruta de Aprendizaje)
export default function FichaGlosario({ termino, onRelacionado }) {
  return (
    <div className="glosario-detail">
      <span className="glosario-badge">{termino.categoria}</span>
      <h2 className="glosario-detalle-titulo">{termino.termino}</h2>
      <h4 className="glosario-detalle-sub">{termino.nombreCompleto}</h4>

      <section className="glosario-detalle-seccion">
        <h5>📖 Definición técnica</h5>
        <p>{termino.definicion}</p>
      </section>
      <section className="glosario-detalle-seccion glosario-detalle-ejemplo">
        <h5>💡 Ejemplo en la práctica</h5>
        <p>{termino.ejemplo}</p>
      </section>
      <section className="glosario-detalle-seccion">
        <h5>🔗 Términos relacionados</h5>
        <div>
          {termino.relacionado.map((rel) => (
            <button type="button" key={rel} className="relacionado-tag" onClick={() => onRelacionado(rel)}>{rel}</button>
          ))}
        </div>
      </section>
      <div className="glosario-detalle-acciones">
        <Link to={termino.moduloBonCloud} className="btn-modulo-link">🧮 Abrir en el módulo real</Link>
      </div>
    </div>
  );
}
