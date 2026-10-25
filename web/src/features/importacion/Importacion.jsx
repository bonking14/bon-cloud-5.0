import { useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Calculadora from '../../components/Calculadora.jsx';
import Comparador from './Comparador.jsx';
import { campos, modalidades } from './modalidades.js';

export default function Importacion() {
  const { modalidad } = useParams();
  const valoresRef = useRef({});
  const m = modalidades[modalidad];
  if (!m) return <Navigate to="/importacion/ordinaria" replace />;

  return (
    <>
      <Calculadora modalidad={m} campos={campos} textoBoton="Calcular declaración" valoresRef={valoresRef} />
      <Comparador valoresRef={valoresRef} />
    </>
  );
}
