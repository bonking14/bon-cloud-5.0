import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { pedir } from '../../auth/api.js';
import css from '../cuenta/Cuenta.module.css';

// Página pública: comprueba un certificado por su código (es a donde lleva el QR)
export default function Verificar() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [texto, setTexto] = useState(codigo || '');
  const [estado, setEstado] = useState(codigo ? { cargando: true } : {});

  useEffect(() => {
    if (!codigo) { setEstado({}); return undefined; }
    let vigente = true;
    setEstado({ cargando: true });
    pedir(`/certificados/${encodeURIComponent(codigo)}`)
      .then((d) => vigente && setEstado({ cert: d }))
      .catch((err) => vigente && setEstado({ error: err.estado === 404 ? 'No existe un certificado con ese código. Revisa que esté bien escrito.' : err.message }));
    return () => { vigente = false; };
  }, [codigo]);

  const buscar = (e) => {
    e.preventDefault();
    if (texto.trim()) navigate(`/verificar/${encodeURIComponent(texto.trim())}`);
  };

  const c = estado.cert;
  return (
    <div className={css.suelta}>
      <div className={css.tarjeta}>
        <h1>BonCloud</h1>
        <h2>Verificación de certificados</h2>
        <form className={css.enLinea} onSubmit={buscar}>
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="BC-XXXXX-XXXXX" aria-label="Código del certificado" autoComplete="off" />
          <button type="submit" className="btn-card">Verificar</button>
        </form>
        <div role="status">
          {estado.cargando && <p>Consultando… Si el servidor estaba inactivo puede tardar hasta un minuto.</p>}
          {estado.error && <p className={css.error}>{estado.error}</p>}
          {c && (
            <>
              <p className={css.si}>✔ Certificado válido</p>
              <p>BonCloud certifica que <strong>{c.nombre}</strong> aprobó los exámenes finales de la Ruta de Aprendizaje de Comercio Internacional ({c.modulos.join(', ')}) con una nota promedio de <strong>{c.nota} sobre 100</strong>.</p>
              <p>Emitido el {new Date(c.emitidoEn).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })} · Código <span className={css.codigo}>{c.codigo}</span></p>
              <p className={css.pista}>Es el certificado de un curso educativo. No es un título ni una certificación oficial de la DIAN, del SENA ni de otra entidad.</p>
            </>
          )}
        </div>
        <p><Link to="/">Ir a BonCloud</Link></p>
      </div>
    </div>
  );
}
