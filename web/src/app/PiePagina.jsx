import { Link } from 'react-router-dom';

// Pie de página institucional de todas las pantallas internas
export default function PiePagina() {
  return (
    <footer className="pie-pagina no-imprimir">
      <p>
        <strong>BonCloud</strong> · Plataforma educativa de comercio exterior, con el Puerto de Cartagena como escenario.
        El contenido es de referencia: no reemplaza la norma vigente ni la asesoría de una agencia de aduanas.
      </p>
      <nav aria-label="Información legal">
        <Link to="/terminos">Términos de uso</Link>
        <Link to="/privacidad">Política de datos</Link>
        <Link to="/verificar">Verificar un certificado</Link>
      </nav>
    </footer>
  );
}
