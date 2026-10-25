import { calcularOrdinaria, calcularFranquicia, calcularTemporalCorto } from '../../lib/importacion.js';
import { formatUSD, formatCOP } from '../../lib/numeros.js';

export const campos = {
  fob: { etiqueta: 'Valor FOB (USD)', placeholder: 'Ej: 125,000' },
  flete: { etiqueta: 'Flete internacional (USD)', ayuda: 'Costo del transporte desde el país de origen al de destino', placeholder: 'Ej: 7,500' },
  seguro: { etiqueta: 'Seguro (USD)', ayuda: 'Escribe la prima real de la póliza. Si no aseguraste, la norma exige sumar la prima habitual con la cotización de una aseguradora (art. 340 de la Resolución 46 de 2019); si lo dejas vacío, aquí se usa un supuesto de práctica del 0,5% del FOB', placeholder: '0', permiteCero: true },
  arancel: { etiqueta: 'Arancel (%)', ayuda: 'Porcentaje aplicable según la subpartida arancelaria', placeholder: 'Según la subpartida (ej: 5)', permiteCero: true },
  trm: { etiqueta: 'TRM (COP por USD)', ayuda: 'Para declarar se usa la TRM vigente el último día hábil de la semana anterior a la presentación de la declaración', placeholder: 'Cargando...' },
  agencia: { etiqueta: 'Agencia aduanera (COP)', ayuda: 'Honorarios de la agencia de aduanas, si la contratas', placeholder: 'Ej: 500,000', permiteCero: true },
  bodegaje: { etiqueta: 'Bodegaje (COP)', placeholder: 'Ej: 200,000', permiteCero: true },
  transporte: { etiqueta: 'Transporte interno (COP)', placeholder: 'Ej: 300,000', permiteCero: true },
};

const BASE = 'Valores Base';
const LOCAL = 'Tasas y Gastos Locales';
const exigeArancel = (_v, crudos) => (String(crudos.arancel ?? '').trim() === '' ? 'Escribe el arancel de la subpartida (puede ser 0).' : '');
// Si no se escribe la prima se usa un supuesto de práctica: en una declaración real se
// soporta con la póliza o con la cotización de la prima habitual (art. 340 Res. 46 de 2019)
const seguroLabel = (r, largo) => (r.seguroSupuesto ? (largo ? '+ Seguro (supuesto de práctica: 0,5% del FOB; en una declaración real se usa la póliza o una cotización)' : '+ Seguro (supuesto de práctica: 0,5% del FOB)') : '+ Seguro');

export const modalidades = {
  ordinaria: {
    titulo: 'Importación Ordinaria',
    badge: 'C100',
    subtitulo: 'Mercancías para consumo definitivo en Colombia',
    info: 'Importación ordinaria: mercancías para consumo definitivo en Colombia. El arancel se liquida sobre el valor en aduana (CIF) y el IVA del 19% sobre el valor en aduana más el arancel. Cada tributo se aproxima al múltiplo de mil.',
    columnas: [{ titulo: BASE, campos: ['fob', 'flete', 'seguro'] }, { titulo: LOCAL, campos: ['arancel', 'trm', 'agencia', 'bodegaje', 'transporte'] }],
    validar: exigeArancel,
    calcular: (v) => {
      const r = calcularOrdinaria(v);
      return [
        { label: '1. Valor FOB', valor: formatUSD(r.fob) },
        { label: '2. + Flete', valor: formatUSD(r.flete) },
        { label: '3. ' + seguroLabel(r, true), valor: formatUSD(r.seguro) },
        { label: '4. = Valor en aduana (CIF) USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
        { label: `5. Valor en aduana en pesos (× TRM ${r.trm.toLocaleString('es-CO')})`, valor: formatCOP(r.baseArancelariaCOP) },
        { label: `6. + Arancel (${r.arancelPorcentaje}%, aproximado a miles)`, valor: formatCOP(r.totalArancel) },
        { label: '7. = Base del IVA', valor: formatCOP(r.baseIVA), clase: 'destacado' },
        { label: '8. + IVA (19%, aproximado a miles)', valor: formatCOP(r.totalIVA) },
        { label: '9. = Total Impuestos', valor: formatCOP(r.totalImpuestos), clase: 'destacado' },
        { label: '10. + Gastos nacionalización', valor: formatCOP(r.gastosNacionalizacion) },
        { label: 'TOTAL A PAGAR', valor: formatCOP(r.totalPagar), clase: 'total' },
      ];
    },
  },
  franquicia: {
    titulo: 'Importación con Franquicia',
    badge: 'C160',
    subtitulo: 'Exención de tributos concedida por una norma o tratado',
    info: 'Importación con franquicia: modalidad para mercancías que, por una ley o un tratado, están exentas total o parcialmente de tributos. Este cálculo supone una franquicia total (arancel e IVA en cero). El código depende de la norma que la concede: por ejemplo C160 para franquicia total por tratados o convenios, o C150 si solo exonera el arancel (Anexo 1 de la Resolución DIAN 46 de 2019). Antes de usarla verifica qué norma la concede, su alcance y sus condiciones.',
    columnas: [{ titulo: BASE, campos: ['fob', 'flete', 'seguro'] }, { titulo: LOCAL, campos: ['trm', 'agencia', 'bodegaje', 'transporte'] }],
    calcular: (v) => {
      const r = calcularFranquicia(v);
      return [
        { label: 'Valor FOB', valor: formatUSD(r.fob) },
        { label: '+ Flete', valor: formatUSD(r.flete) },
        { label: seguroLabel(r), valor: formatUSD(r.seguro) },
        { label: '= Valor en aduana (CIF) USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
        { label: 'Valor en aduana en pesos', valor: formatCOP(r.baseArancelariaCOP) },
        { label: 'Arancel', valor: '$ 0 — exonerado por la franquicia', clase: 'exento' },
        { label: 'IVA', valor: '$ 0 — exonerado por la franquicia', clase: 'exento' },
        { label: '+ Gastos nacionalización', valor: formatCOP(r.gastos) },
        { label: 'TOTAL A PAGAR (gastos)', valor: formatCOP(r.totalPagar), clase: 'total' },
      ];
    },
  },
  'temporal-corto': {
    titulo: 'Importación Temporal Corto Plazo',
    badge: 'S100',
    subtitulo: 'Reexportación en el mismo estado — tributos suspendidos con garantía',
    info: 'Importación temporal de corto plazo: para ferias, exposiciones, eventos o equipos que vuelven a salir sin transformarse. Los tributos no se pagan sino que se suspenden y se respaldan con una garantía ante la DIAN. El costo de la póliza lo fija la aseguradora: aquí se usa un supuesto del 1,5% de los tributos garantizados. Si la mercancía no se reexporta a tiempo, se deben pagar los tributos.',
    columnas: [{ titulo: BASE, campos: ['fob', 'flete', 'seguro'] }, { titulo: LOCAL, campos: ['arancel', 'trm', 'agencia', 'bodegaje', 'transporte'] }],
    validar: exigeArancel,
    calcular: (v) => {
      const r = calcularTemporalCorto(v);
      return [
        { label: 'Valor FOB', valor: formatUSD(r.fob) },
        { label: '+ Flete', valor: formatUSD(r.flete) },
        { label: seguroLabel(r), valor: formatUSD(r.seguro) },
        { label: '= Valor en aduana (CIF) USD', valor: formatUSD(r.cifUSD), clase: 'destacado' },
        { label: 'Valor en aduana en pesos', valor: formatCOP(r.baseArancelariaCOP) },
        { label: `Tributos suspendidos (arancel ${r.arancelPorcentaje}% + IVA 19%)`, valor: formatCOP(r.tributosSuspendidos), clase: 'suspendido' },
        { label: 'Prima de la garantía (supuesto: 1,5%)', valor: formatCOP(r.poliza) },
        { label: '+ Gastos', valor: formatCOP(r.gastos) },
        { label: 'TOTAL A PAGAR (prima + gastos)', valor: formatCOP(r.totalPagar), clase: 'total' },
      ];
    },
  },
};
