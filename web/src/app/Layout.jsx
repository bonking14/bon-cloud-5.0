import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { useFontSize, TAMANOS } from '../hooks/useFontSize.js';
import Icono, { ICONO_LUNA, ICONO_SOL, ICONO_MENU, ICONO_SALIR } from '../components/Icono.jsx';
import { GRUPOS, ICONO_EXAMEN, ICONO_GRUPOS, ICONO_INICIO, modulos } from './modulos.js';
import PiePagina from './PiePagina.jsx';
import css from './Layout.module.css';

const claseNav = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;

export default function Layout() {
  const { usuario, rol, esInvitado, cerrarSesion } = useAuth();
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
          {GRUPOS.map(([grupo, nombre]) => (
            <div key={grupo} className={css.grupo}>
              <h3 className={css.tituloGrupo}>{nombre}</h3>
              {grupo === 'aprender' && <NavLink to="/inicio" className={claseNav}><span className={css.filaIcono}><Icono d={ICONO_INICIO} tamano={16} />Inicio</span></NavLink>}
              {modulos.filter((m) => m.grupo === grupo).map((m) => (
                <div key={m.ruta}>
                  <NavLink to={m.submodulos ? m.submodulos[0].ruta : m.ruta} className={() =>
                    claseNav({ isActive: location.pathname.startsWith(m.ruta) })}>
                    <span className={css.filaIcono}><Icono d={m.icono} tamano={16} />{m.titulo}</span>
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
              {grupo === 'aprender' && <NavLink to="/examen" className={claseNav}><span className={css.filaIcono}><Icono d={ICONO_EXAMEN} tamano={16} />Examen final</span></NavLink>}
            </div>
          ))}
          {(rol === 'profesor' || rol === 'administrador') && (
            <div className={css.grupo}>
              <h3 className={css.tituloGrupo}>Docencia</h3>
              <NavLink to="/grupos" className={claseNav}><span className={css.filaIcono}><Icono d={ICONO_GRUPOS} tamano={16} />Grupos</span></NavLink>
              {rol === 'administrador' && <NavLink to="/admin/usuarios" className={claseNav}>Usuarios</NavLink>}
              {rol === 'administrador' && <NavLink to="/admin/instituciones" className={claseNav}>Licencias</NavLink>}
            </div>
          )}
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
          {esInvitado
            ? <span className={css.usuario}>{usuario?.nombre}</span>
            : <NavLink to="/perfil" className={claseNav} title="Mi perfil">{usuario?.nombre}</NavLink>}
          <button type="button" id="btnLogout" onClick={salir}>
            <span className={css.filaIcono}><Icono d={ICONO_SALIR} tamano={16} />Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Suspense fallback={<div className="cargando-pagina" role="status">Cargando…</div>}>
          <Outlet />
        </Suspense>
        <PiePagina />
      </main>
    </div>
  );
}
