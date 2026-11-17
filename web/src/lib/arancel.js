// Las 21 secciones del Arancel de Aduanas (Sistema Armonizado) y los capítulos de cada una.
// El capítulo son los dos primeros dígitos de la subpartida.
export const SECCIONES_ARANCEL = [
  ['I', 'Animales vivos y productos del reino animal', 1, 5],
  ['II', 'Productos del reino vegetal', 6, 14],
  ['III', 'Grasas y aceites animales, vegetales o de origen microbiano', 15, 15],
  ['IV', 'Productos de las industrias alimentarias; bebidas y tabaco', 16, 24],
  ['V', 'Productos minerales', 25, 27],
  ['VI', 'Productos de las industrias químicas o de las industrias conexas', 28, 38],
  ['VII', 'Plástico y caucho, y sus manufacturas', 39, 40],
  ['VIII', 'Pieles, cueros, peletería y sus manufacturas', 41, 43],
  ['IX', 'Madera, carbón vegetal, corcho y sus manufacturas', 44, 46],
  ['X', 'Pasta de madera, papel y cartón, y sus aplicaciones', 47, 49],
  ['XI', 'Materias textiles y sus manufacturas', 50, 63],
  ['XII', 'Calzado, sombreros, paraguas y artículos similares', 64, 67],
  ['XIII', 'Manufacturas de piedra, yeso y cemento; productos cerámicos; vidrio', 68, 70],
  ['XIV', 'Perlas, piedras preciosas y metales preciosos', 71, 71],
  ['XV', 'Metales comunes y sus manufacturas', 72, 83],
  ['XVI', 'Máquinas y aparatos, material eléctrico y sus partes', 84, 85],
  ['XVII', 'Material de transporte', 86, 89],
  ['XVIII', 'Instrumentos de óptica, medida y medicoquirúrgicos; relojería; instrumentos musicales', 90, 92],
  ['XIX', 'Armas, municiones, y sus partes y accesorios', 93, 93],
  ['XX', 'Mercancías y productos diversos', 94, 96],
  // El capítulo 98 (disposiciones de tratamiento especial) es propio del arancel colombiano
  ['XXI', 'Objetos de arte o colección y antigüedades; disposiciones de tratamiento especial', 97, 98],
].map(([numero, titulo, desde, hasta], i) => ({ numero, titulo, desde, hasta, orden: i }));

export const capituloDe = (codigo) => parseInt(String(codigo).replace(/\D/g, '').slice(0, 2), 10);

// Sección del arancel a la que pertenece una subpartida, o null si el código no es válido
export function seccionDe(codigo) {
  const cap = capituloDe(codigo);
  return SECCIONES_ARANCEL.find((s) => cap >= s.desde && cap <= s.hasta) || null;
}

export const capitulos = (s) => (s.desde === s.hasta ? `capítulo ${s.desde}` : `capítulos ${s.desde} ${s.hasta - s.desde === 1 ? "y" : "a"} ${s.hasta}`);
