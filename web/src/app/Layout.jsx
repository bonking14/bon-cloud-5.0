import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { useFontSize, TAMANOS } from '../hooks/useFontSize.js';
import Icono, { ICONO_LUNA, ICONO_SOL, ICONO_MENU, ICONO_SALIR } from '../components/Icono.jsx';
import { modulos } from './modulos.js';
import css from './Layout.module.css';

const claseNav = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const { esClaro, alternar } = useTheme();
  const { actual, cambiar } = useFontSize();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // En móvil el menú se cierra al navegar
  useEffect(() => setMenuAbierto(false), [location.pathname]);

  const salir = () => {
    cerrarSesion();
    navigate('/', { replace: true });
  };

  return (
    <div className="app-shell">
      <button
        type="button"
        className={`${css.botonMenu} no-imprimir`}
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto((v) => !v)}
      >
        <Icono d={ICONO_MENU} />
      </button>
      {menuAbierto && <div className={css.velo} onClick={() => setMenuAbierto(false)} />}

      <aside className={`sidebar no-imprimir ${css.sidebar} ${menuAbierto ? css.abierto : ''}`}>
        <div className="sidebar-brand"><h2>BonCloud</h2></div>
        <nav aria-label="Módulos">
          <NavLink to="/inicio" className={claseNav}>Inicio</NavLink>
          {modulos.map((m) => (
            <div key={m.ruta}>
              <NavLink to={m.submodulos ? m.submodulos[0].ruta : m.ruta} className={() =>
                claseNav({ isActive: location.pathname.startsWith(m.ruta) })}>
                {m.titulo}
              </NavLink>
              {m.submodulos && location.pathname.startsWith(m.ruta) && (
                <div className="nav-submenu open">
                  {m.submodulos.map((s) => (
                    <NavLink key={s.ruta} to={s.ruta} className={({ isActive }) => `nav-subitem${isActive ? ' active' : ''}`}>
                      {s.titulo}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className={css.tamanos} role="group" aria-label="Tamaño de letra">
            {TAMANOS.map((t) => (
              <button key={t.valor} type="button" aria-label={t.nombre} aria-pressed={actual === t.valor}
                className={actual === t.valor ? css.tamanoActivo : ''} onClick={() => cambiar(t.valor)}>
                {t.etiqueta}
              </button>
            ))}
          </div>
          <button type="button" className="nav-item theme-switch" role="switch" aria-checked={!esClaro} onClick={alternar}>
            <span className={css.filaIcono}><Icono d={esClaro ? ICONO_LUNA : ICONO_SOL} tamano={16} />{esClaro ? 'Tema oscuro' : 'Tema claro'}</span>
          </button>
          <span className={css.usuario}>{usuario?.nombre}</span>
          <button type="button" id="btnLogout" onClick={salir}>
            <span className={css.filaIcono}><Icono d={ICONO_SALIR} tamano={16} />Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Suspense fallback={<div className="cargando-pagina" role="status">Cargando…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
