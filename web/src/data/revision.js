// Estado de revisión del contenido de la Ruta. Se muestra al pie de cada lección.
//
// - contrastado: fecha (AAAA-MM-DD) en que el contenido del módulo se comparó con el texto
//   de las normas en fuentes oficiales, y contra cuáles.
// - experto: se llena cuando un profesional de aduanas revise y firme el contenido:
//   { nombre: '...', credencial: '...', fecha: 'AAAA-MM-DD' }. Mientras sea null, la lección
//   avisa que esa revisión está pendiente. La lista para el revisor está en
//   docs/revision-contenido.md (se genera con: node scripts/lista-revision.mjs).
export const revision = {
  experto: null,
  modulos: {
    1: { contrastado: null },
    2: { contrastado: null },
    3: { contrastado: '2026-11-10', fuentes: 'Compilación jurídica de la DIAN (Decreto 1165 de 2019, Resolución 46 de 2019, Ley 1004 de 2005 y Decreto 2147 de 2016)' },
  },
};
