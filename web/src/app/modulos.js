// Única fuente de verdad de los módulos: alimenta el sidebar y las tarjetas del inicio.
// Antes el menú estaba copiado a mano en 10 páginas.
export const modulos = [
  {
    ruta: '/curso', titulo: 'Ruta Guiada', accion: 'Empezar',
    descripcion: 'Aprende comercio exterior paso a paso con un embarque de práctica.',
    color: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    icono: 'M12 3L1 9l11 6l9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z',
  },
  {
    ruta: '/importacion', titulo: 'Importación', accion: 'Calcular',
    descripcion: 'Calcula FOB, CIF, aranceles e IVA para tus importaciones.',
    color: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    icono: 'M4 15V8H3V6h4V4h4v2h2v2h8v3h-1l-2 4H4zm1 2c1 0 2-.5 3-1.5 1 1 2 1.5 3 1.5s2-.5 3-1.5c1 1 2 1.5 3 1.5s2-.5 3-1.5c1 1 2 1.5 3 1.5v2c-1 0-2-.5-3-1.5-1 1-2 1.5-3 1.5s-2-.5-3-1.5c-1 1-2 1.5-3 1.5s-2-.5-3-1.5c-1 1-2 1.5-3 1.5H4v-2z',
    submodulos: [
      { ruta: '/importacion/ordinaria', titulo: 'Ordinaria' },
      { ruta: '/importacion/franquicia', titulo: 'Franquicia' },
      { ruta: '/importacion/temporal-corto', titulo: 'Temporal' },
    ],
  },
  {
    ruta: '/exportacion', titulo: 'Exportación', accion: 'Calcular',
    descripcion: 'Valor FOB, documentos y modalidades de exportación.',
    color: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    icono: 'M17 9H7V7h10v2zm0 4H7v-2h10v2zm-2 4H7v-2h8v2zm7-12v14c0 1.66-1.34 3-3 3H5c-1.66 0-3-1.34-3-3V5c0-1.66 1.34-3 3-3h14c1.66 0 3 1.34 3 3zm-2 0H5v14h14V5z',
    submodulos: [
      { ruta: '/exportacion/definitiva', titulo: 'Definitiva' },
      { ruta: '/exportacion/temporal', titulo: 'Temporal' },
      { ruta: '/exportacion/menaje', titulo: 'Menaje' },
    ],
  },
  {
    ruta: '/vistos-buenos', titulo: 'Vistos Buenos', accion: 'Consultar',
    descripcion: 'Requisitos, permisos y licencias por tipo de producto.',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icono: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  },
  {
    ruta: '/incoterms', titulo: 'Incoterms', accion: 'Ver guía',
    descripcion: 'Las 11 reglas Incoterms® 2020 y quién asume cada costo y riesgo.',
    color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    icono: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z',
  },
  {
    ruta: '/subpartidas', titulo: 'Subpartidas', accion: 'Buscar',
    descripcion: 'Busca subpartidas, aranceles de referencia y requisitos.',
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    icono: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  },
  {
    ruta: '/formularios', titulo: 'Formularios', accion: 'Diligenciar',
    descripcion: 'Practica los formularios DIAN con cálculo automático.',
    color: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    icono: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  },
  {
    ruta: '/glosario', titulo: 'Glosario', accion: 'Consultar',
    descripcion: 'Términos clave, normativa DIAN, Incoterms y acrónimos.',
    color: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
    icono: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  },
  {
    ruta: '/simulador', titulo: 'Simulador Logístico', accion: 'Simular',
    descripcion: 'Estima costos, tiempos y riesgos de una importación.',
    color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    icono: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2z',
  },
];
