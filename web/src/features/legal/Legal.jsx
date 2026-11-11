import { Link } from 'react-router-dom';
import { VERSION, privacidad, terminos } from './textos.js';
import css from '../cuenta/Cuenta.module.css';

// Páginas públicas de términos de uso y política de datos
export default function Legal({ documento }) {
  const doc = documento === 'privacidad' ? privacidad : terminos;
  return (
    <div className={css.suelta} style={{ alignItems: 'flex-start' }}>
      <article className={css.tarjeta} style={{ maxWidth: 760 }}>
        <h1>BonCloud</h1>
        <h2>{doc.titulo}</h2>
        <p className={css.pista}>Versión {VERSION}. Versión preliminar, pendiente de revisión jurídica.</p>
        {doc.secciones.map(([titulo, parrafos]) => (
          <section key={titulo}>
            <h3 style={{ fontSize: '0.9375rem', margin: '18px 0 6px' }}>{titulo}</h3>
            {parrafos.map((t) => <p key={t}>{t}</p>)}
          </section>
        ))}
        <p style={{ marginTop: 24 }}>
          <Link to={documento === 'privacidad' ? '/terminos' : '/privacidad'}>{documento === 'privacidad' ? 'Términos de uso' : 'Política de tratamiento de datos'}</Link>
          {' · '}<Link to="/">Ir a BonCloud</Link>
        </p>
      </article>
    </div>
  );
}
