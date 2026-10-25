import { lazy } from 'react';
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

// HashRouter: GitHub Pages no sabe reescribir rutas, así recargar /#/glosario no da 404
export default function App() {
  return (
    <AuthProvider>
      <ProgresoProvider>
        <ToastProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
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
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </ToastProvider>
      </ProgresoProvider>
    </AuthProvider>
  );
}
