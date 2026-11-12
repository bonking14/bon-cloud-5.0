import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext.jsx';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';
import { ProgresoProvider } from '../hooks/ProgresoContext.jsx';
import { ToastProvider } from '../components/Toast.jsx';
import Layout from './Layout.jsx';
import Landing from '../features/landing/Landing.jsx';

// Cada módulo se descarga solo cuando se abre
const Dashboard = lazy(() => import('../features/dashboard/Dashboard.jsx'));
const Importacion = lazy(() => import('../features/importacion/Importacion.jsx'));
const Exportacion = lazy(() => import('../features/exportacion/Exportacion.jsx'));
const VistosBuenos = lazy(() => import('../features/vistos-buenos/VistosBuenos.jsx'));
const Incoterms = lazy(() => import('../features/incoterms/Incoterms.jsx'));
const Subpartidas = lazy(() => import('../features/subpartidas/Subpartidas.jsx'));
const Formularios = lazy(() => import('../features/formularios/Formularios.jsx'));
const Glosario = lazy(() => import('../features/glosario/Glosario.jsx'));
const Curso = lazy(() => import('../features/curso/Curso.jsx'));
const Simulador = lazy(() => import('../features/simulador/Simulador.jsx'));
const Perfil = lazy(() => import('../features/cuenta/Perfil.jsx'));
const Legal = lazy(() => import('../features/legal/Legal.jsx'));
const Examenes = lazy(() => import('../features/examen/Examenes.jsx'));
const Verificar = lazy(() => import('../features/examen/Verificar.jsx'));
const Grupos = lazy(() => import('../features/grupos/Grupos.jsx'));
const PanelGrupo = lazy(() => import('../features/grupos/PanelGrupo.jsx'));
const Instituciones = lazy(() => import('../features/cuenta/Instituciones.jsx'));
const AdminUsuarios = lazy(() => import('../features/cuenta/AdminUsuarios.jsx'));
const Restablecer = lazy(() => import('../features/cuenta/Restablecer.jsx'));
const VerificarCorreo = lazy(() => import('../features/cuenta/VerificarCorreo.jsx'));

// HashRouter: GitHub Pages no sabe reescribir rutas, así recargar /#/glosario no da 404
export default function App() {
  return (
    <AuthProvider>
      <ProgresoProvider>
        <ToastProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              {/* Páginas que abren los enlaces de los correos: no piden sesión */}
              <Route path="/restablecer" element={<Suspense fallback={null}><Restablecer /></Suspense>} />
              <Route path="/terminos" element={<Suspense fallback={null}><Legal documento="terminos" /></Suspense>} />
              <Route path="/privacidad" element={<Suspense fallback={null}><Legal documento="privacidad" /></Suspense>} />
              <Route path="/verificar" element={<Suspense fallback={null}><Verificar /></Suspense>} />
              <Route path="/verificar/:codigo" element={<Suspense fallback={null}><Verificar /></Suspense>} />
              <Route path="/verificar-correo" element={<Suspense fallback={null}><VerificarCorreo /></Suspense>} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/inicio" element={<Dashboard />} />
                <Route path="/curso" element={<Curso />} />
                <Route path="/importacion" element={<Navigate to="/importacion/ordinaria" replace />} />
                <Route path="/importacion/:modalidad" element={<Importacion />} />
                <Route path="/exportacion" element={<Navigate to="/exportacion/definitiva" replace />} />
                <Route path="/exportacion/:modalidad" element={<Exportacion />} />
                <Route path="/vistos-buenos" element={<VistosBuenos />} />
                <Route path="/incoterms" element={<Incoterms />} />
                <Route path="/subpartidas" element={<Subpartidas />} />
                <Route path="/formularios" element={<Formularios />} />
                <Route path="/formularios/:id" element={<Formularios />} />
                <Route path="/glosario" element={<Glosario />} />
                <Route path="/simulador" element={<Simulador />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/instituciones" element={<Instituciones />} />
                <Route path="/examen" element={<Examenes />} />
                <Route path="/grupos" element={<Grupos />} />
                <Route path="/grupos/:id" element={<PanelGrupo />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </ToastProvider>
      </ProgresoProvider>
    </AuthProvider>
  );
}
