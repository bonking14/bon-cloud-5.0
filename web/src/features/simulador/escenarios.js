// Escenarios de práctica precargados (la Ruta abre /simulador?escenario=caso_bombas)
export const ESCENARIOS = {
  caso_bombas: {
    titulo: 'Caso de la Ruta: bombas desde Shanghái',
    desc: 'Bombas de engranajes para aceite hidráulico, sin motor (500 unidades)',
    // Arancel de práctica del curso: el real de esta subpartida hoy es 0% (Decreto 272 de 2018)
    subpartida: '8413.60.90.00', valor: 60000, arancel: 5, iva: 19,
    carga: 'Contenedor 20ft', peso: 9000, pais: 'China', puerto: 'Shanghái',
    incoterm: 'FOB', regimen: 'Importación ordinaria', flete: 3500, seguro: 300, trm: 4100,
    nit: '900123456', agencia: false,
  },
  usa_electronica: {
    titulo: 'Servidores desde Miami (CIF)',
    desc: 'Servidores informáticos y racks de procesamiento de datos',
    subpartida: '8471.50.00.00', valor: 28000, arancel: 0, iva: 19,
    carga: 'Contenedor 20ft', peso: 3400, pais: 'Estados Unidos', puerto: 'Miami',
    incoterm: 'CIF', regimen: 'Importación ordinaria', flete: '', seguro: '', trm: '',
    nit: '800987654', agencia: true,
  },
  alemania_repuestos: {
    titulo: 'Autopartes desde Hamburgo (EXW)',
    desc: 'Partes de carrocería para vehículos (paneles, bisagras y soportes)',
    subpartida: '8708.29.90.00', valor: 15500, arancel: 10, iva: 19,
    carga: 'Carga suelta', peso: 850, pais: 'Alemania', puerto: 'Hamburgo',
    incoterm: 'EXW', regimen: 'Importación ordinaria', flete: '', seguro: '', trm: '',
    nit: '901456789', agencia: true,
  },
};
