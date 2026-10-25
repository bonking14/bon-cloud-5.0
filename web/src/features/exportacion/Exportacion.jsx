import { Navigate, useParams } from 'react-router-dom';
import Calculadora from '../../components/Calculadora.jsx';
import { campos, modalidades } from './modalidades.js';

export default function Exportacion() {
  const { modalidad } = useParams();
  const m = modalidades[modalidad];
  if (!m) return <Navigate to="/exportacion/definitiva" replace />;
  return <Calculadora modalidad={m} campos={campos} />;
}
