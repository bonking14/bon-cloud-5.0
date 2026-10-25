// Simuladores de práctica: no tienen validez ante la DIAN. Las declaraciones
// reales se presentan con firma digital en los servicios informáticos de la DIAN.
// Cada formulario se descarga solo cuando se abre.
export const formularios = [
  { id: '001', nombre: 'Formulario 001 - Registro Único Tributario (RUT)', tipo: 'Requisito',
    desc: 'Inscripción del importador o exportador, con su calidad de usuario aduanero.', cargar: () => import('./hojas/Form001.jsx') },
  { id: '560', nombre: 'Formulario 560 - Declaración Andina del Valor (DAV)', tipo: 'Importación',
    desc: 'Soporta el valor en aduana. Obligatoria desde USD 5.000 FOB.', cargar: () => import('./hojas/Form560.jsx') },
  { id: '500', nombre: 'Formulario 500 - Declaración de Importación', tipo: 'Importación',
    desc: 'Identifica la mercancía, declara el valor en aduana y liquida arancel e IVA.', cargar: () => import('./hojas/Form500.jsx') },
  { id: 'DTA', nombre: 'Declaración de Tránsito Aduanero (DTA)', tipo: 'Tránsito',
    desc: 'Traslado bajo control aduanero entre aduanas, con tributos suspendidos.', cargar: () => import('./hojas/FormDTA.jsx') },
  { id: '600', nombre: 'Formulario 600 - Declaración de Exportación (DEX)', tipo: 'Exportación',
    desc: 'Ampara la salida de mercancías; va precedida de la solicitud de autorización de embarque.', cargar: () => import('./hojas/Form600.jsx') },
];
