import { calcularExportacion } from '../../lib/exportacion.js';
import { formatUSD, formatCOP } from '../../lib/numeros.js';

export const campos = {
  fob: { etiqueta: 'Valor FOB (USD)', placeholder: 'Ej: 50,000' },
  flete: { etiqueta: 'Flete internacional (USD)', pista: 'Solo si la venta lo incluye (CFR, CIF, CPT, CIP)', placeholder: '0', permiteCero: true },
  seguro: { etiqueta: 'Seguro internacional (USD)', pista: 'Solo si la venta lo incluye (CIF, CIP)', placeholder: '0', permiteCero: true },
  trm: { etiqueta: 'TRM (COP por USD)', placeholder: 'Ej: 4,000' },
  meses: { etiqueta: 'Plazo previsto en el exterior (meses)', placeholder: 'Ej: 6' },
};

function filasValor(r) {
  const filas = [{ label: 'Valor FOB declarado en la DEX', valor: formatUSD(r.fob), clase: 'destacado' }];
  if (r.incluyeFleteSeguro) {
    filas.push({ label: '+ Flete internacional (incluido en la venta)', valor: formatUSD(r.flete) });
    filas.push({ label: '+ Seguro internacional (incluido en la venta)', valor: formatUSD(r.seguro) });
    filas.push({ label: '= Valor total facturado según el Incoterm', valor: formatUSD(r.valorVenta) });
  }
  filas.push({ label: `Valor FOB en pesos (× TRM ${r.trm.toLocaleString('es-CO')})`, valor: formatCOP(r.fobCOP) });
  return filas;
}

const DATOS = 'Datos de la operación';

export const modalidades = {
  definitiva: {
    titulo: 'Exportación Definitiva',
    badge: 'DEX 600',
    subtitulo: 'Salida de mercancías nacionales o nacionalizadas para uso o consumo definitivo en el exterior',
    info: '<strong>Cómo funciona:</strong> se presenta la solicitud de autorización de embarque, se embarca la mercancía y luego se presenta la declaración de exportación (DEX, formulario 600). Se declara el valor FOB. No se paga arancel y la venta está exenta de IVA, con derecho a devolución del IVA pagado en los insumos.',
    columnas: [{ titulo: DATOS, campos: ['fob', 'flete', 'seguro', 'trm'] }],
    calcular: (v) => [
      ...filasValor(calcularExportacion(v)),
      { label: 'Tributos aduaneros de exportación', valor: '$ 0 — no paga arancel; IVA exento', clase: 'exento' },
      { label: 'Documentos', valor: 'Solicitud de autorización de embarque, DEX (600), factura, documento de transporte, certificado de origen si el comprador pide preferencia, vistos buenos si aplica', clase: 'documento' },
    ],
  },
  temporal: {
    titulo: 'Exportación Temporal',
    badge: 'DEX 600',
    subtitulo: 'Para reimportación en el mismo estado: ferias, exposiciones, reparación en el exterior',
    info: '<strong>Cómo funciona:</strong> la mercancía sale por un plazo determinado y debe regresar sin haber sufrido transformación. Al reimportarla dentro del plazo no paga tributos. Si no regresa a tiempo, la operación debe terminarse como exportación definitiva.',
    columnas: [{ titulo: DATOS, campos: ['fob', 'flete', 'seguro', 'trm', 'meses'] }],
    calcular: (v) => {
      const r = calcularExportacion(v);
      return [
        ...filasValor(r),
        { label: 'Plazo previsto de permanencia en el exterior', valor: r.meses ? `${r.meses} mes${r.meses === 1 ? '' : 'es'}` : 'Sin indicar' },
        { label: 'Tributos al salir y al reimportar en el mismo estado', valor: '$ 0', clase: 'exento' },
        { label: 'Documentos', valor: 'DEX temporal, factura proforma, documento de transporte, lista de empaque con seriales para identificar la mercancía al regreso', clase: 'documento' },
      ];
    },
  },
  menaje: {
    titulo: 'Exportación de Menaje',
    badge: 'DEX 600',
    subtitulo: 'Bienes del hogar de residentes que se trasladan a vivir al exterior',
    info: '<strong>Cómo funciona:</strong> los muebles y enseres usados del hogar salen con una declaración de exportación de menaje. No pagan tributos. Conviene llevar un inventario detallado con valores, porque es la base de la declaración.',
    columnas: [{ titulo: DATOS, campos: ['fob', 'flete', 'seguro', 'trm'] }],
    calcular: (v) => [
      ...filasValor(calcularExportacion(v)),
      { label: 'Tributos', valor: '$ 0 — exportación de menaje', clase: 'exento' },
      { label: 'Documentos', valor: 'DEX de menaje, inventario valorizado, documento de identidad, documento de transporte', clase: 'documento' },
    ],
  },
};
