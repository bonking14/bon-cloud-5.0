import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SigloXXII from './SigloXXII.jsx';
import { CASO, RUTA_MENU, datosCorreccion, generarCaso, liquidar } from '../../lib/sigloxxii.js';
import { pedir } from '../../auth/api.js';

// Sesión simulada: por defecto, invitado
const sesion = { usuario: { invitado: true }, tokenApi: null };
vi.mock('../../auth/AuthContext.jsx', () => ({ useAuth: () => sesion }));
vi.mock('../../auth/api.js', () => ({ pedir: vi.fn(() => Promise.resolve({ ok: true })) }));

afterEach(() => { cleanup(); Object.assign(sesion, { usuario: { invitado: true }, tokenApi: null }); pedir.mockClear(); });
const abrir = () => render(<MemoryRouter><SigloXXII /></MemoryRouter>);
const entrar = (nombre = 'alumno01') => {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: nombre } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'practica' } });
  fireEvent.click(screen.getByText('Entrar'));
};
const solucion = () => fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
const guardar = () => fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
// Después del ítem: descripción, totales y documentos soporte con la solución, y luego informar
const completarPartes = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar descripción' })); solucion(); guardar();
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar totales' })); solucion(); guardar();
  fireEvent.click(screen.getByRole('button', { name: 'Radicar' })); solucion(); guardar();
  fireEvent.click(screen.getByRole('button', { name: 'Informar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  pagarYPedirLevante();
};
// Banco y levante con la solución
function pagarYPedirLevante() {
  solucion(); fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
  solucion(); fireEvent.click(screen.getByRole('button', { name: 'Solicitar levante' }));
}

describe('SIGLO XXII', () => {
  it('no deja entrar con una contraseña equivocada', () => {
    abrir();
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'ALUMNO01' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'otra' } });
    fireEvent.click(screen.getByText('Entrar'));
    expect(screen.getByRole('alert').textContent).toMatch(/incorrectos/);
  });

  it('el menú avisa cuando se elige una opción que no es de la práctica', () => {
    abrir();
    entrar();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Importaciones' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Declarante SIA ó ALTEX' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Recibo Oficial Pago' }));
    expect(screen.getByRole('alert').textContent).toMatch(/sigue por «Declaraciones»/);
  });

  it('recorrido completo: menú, parámetros, encabezado, subpartida y autoliquidación de $65.264.000', () => {
    abrir();
    entrar();
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    // parámetros previos
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('alert').textContent).toMatch(/BOLIVAR/);
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    // encabezado: vacío no guarda y dice qué falta
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByRole('alert').textContent).toMatch(/Tiene \d+ inconsistencias/);
    expect(screen.getByRole('region', { name: 'Lista de inconsistencias a corregir' }).textContent).toMatch(/NIT del importador: falta/);
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    expect(screen.getByLabelText('DV').value).toBe('8');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    // el sistema radica el encabezado y deja seguir con el ítem; sin ítem no se puede informar
    expect(screen.getByText(/almacenados con éxito/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Informar' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar ítem' }));
    // subpartida: sin autoliquidar no guarda
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByRole('alert').textContent).toMatch(/Falta la autoliquidación/);
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    expect(screen.getByTestId('sx-total').textContent).toBe('65.264.000');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    completarPartes();
    expect(screen.getByRole('status').textContent).toMatch(/Declaración guardada/);
    expect(screen.getByText(/total a pagar \$65.264.000/)).toBeTruthy();
  });

  it('como invitado no registra la práctica y lo dice', () => {
    abrir();
    entrar();
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar ítem' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    completarPartes();
    expect(screen.getByTestId('sx-registro').textContent).toMatch(/invitado/);
    expect(pedir).not.toHaveBeenCalled();
  });

  it('con cuenta: cada alumno entra con su propio usuario y la práctica queda registrada con sus errores', async () => {
    Object.assign(sesion, { usuario: { id: 42, nombre: 'Ana' }, tokenApi: 'jwt' });
    abrir();
    // el usuario de ejemplo ya no sirve: el suyo es A000042
    entrar('ALUMNO01');
    expect(screen.getByRole('alert').textContent).toMatch(/A000042/);
    entrar('a000042');
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    // su caso es el 42: otro importador, en otro departamento
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: generarCaso(42).importador.departamento } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' })); // encabezado vacío: segundo error
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar ítem' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    completarPartes();
    expect(pedir).toHaveBeenCalledTimes(1);
    expect(pedir).toHaveBeenCalledWith('/practicas', { metodo: 'POST', token: 'jwt', cuerpo: { practica: 'sigloxxii-importacion', errores: 2, conSolucion: true } });
    expect((await screen.findByText(/quedó registrada/)).textContent).toMatch(/2 pantallas con errores/);
  });

  it('la consulta de códigos llena el campo, y al final la declaración pasa al formulario 500', () => {
    abrir();
    entrar();
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    // el alumno busca el código de Panamá para la bandera
    fireEvent.click(screen.getByRole('button', { name: 'Buscar código: Bandera (cód.)' }));
    fireEvent.change(screen.getByLabelText('Buscar en la tabla'), { target: { value: 'panam' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar' }));
    expect(screen.getByLabelText('Bandera (cód.)').value).toBe('PA');
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar ítem' }));
    fireEvent.click(screen.getByText('Ver la solución de esta pantalla'));
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    completarPartes();
    fireEvent.click(screen.getByRole('button', { name: 'Generar el formulario 500 (PDF)' }));
    const precarga = JSON.parse(sessionStorage.getItem('boncloud-precarga-500'));
    expect(precarga.valores.subpartida).toBe('8413.60.90.00');
    expect(precarga.valores.v_fob).toBe('60000');
  });
  it('descripción, totales y documentos soporte se validan contra el caso antes de informar', () => {
    abrir();
    entrar();
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: '13' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    solucion(); guardar();
    // sin ítem no se puede describir la mercancía
    expect(screen.getByRole('button', { name: 'Ingresar descripción' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar ítem' }));
    solucion(); fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' })); guardar();
    expect(screen.getByRole('button', { name: 'Informar' }).disabled).toBe(true);

    // descripción incompleta: dice qué falta
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar descripción' }));
    fireEvent.change(screen.getByLabelText('Descripción de la mercancía'), { target: { value: 'Bombas de engranajes para aceite hidráulico, sin motor. 500 unidades.' } });
    guardar();
    const lista = () => screen.getByRole('region', { name: 'Lista de inconsistencias a corregir' }).textContent;
    expect(lista()).toMatch(/falta la marca/);
    expect(lista()).toMatch(/falta los seriales/);
    fireEvent.change(screen.getByLabelText('Descripción de la mercancía'), { target: { value: 'Bombas de engranajes para aceite hidráulico, sin motor, marca Hydroz, referencia GP-25, seriales ZH25-0001 a ZH25-0500. 500 unidades.' } });
    guardar();
    expect(screen.getByRole('status').textContent).toMatch(/almacenados con éxito/);

    // totales: el pago debe cuadrar con la instrucción de pago
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar totales' }));
    const { arancel, iva } = liquidar(CASO.subpartida);
    fireEvent.change(screen.getByLabelText('69. Total arancel pagado'), { target: { value: arancel.toLocaleString('es-CO') } });
    fireEvent.change(screen.getByLabelText('70. Total IVA pagado'), { target: { value: String(iva) } });
    fireEvent.change(screen.getByLabelText('71. Sanciones'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('72. Total otros pagado'), { target: { value: '0' } });
    expect(screen.getByTestId('sx-total-pagado').textContent).toBe('65.264.000');
    fireEvent.change(screen.getByLabelText('75. Cheque: valor'), { target: { value: '65.264.000' } });
    fireEvent.change(screen.getByLabelText('75. Número del cheque'), { target: { value: '004571' } });
    fireEvent.change(screen.getByLabelText('75. Código del banco'), { target: { value: '007' } });
    guardar();
    expect(lista()).toMatch(/Código del banco: no coincide/);
    fireEvent.click(screen.getByRole('button', { name: 'Buscar código: 75. Código del banco' }));
    fireEvent.change(screen.getByLabelText('Buscar en la tabla'), { target: { value: 'bogot' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar' }));
    guardar();
    expect(screen.getByRole('status').textContent).toMatch(/almacenados con éxito/);

    // documentos soporte: no presentado no deja seguir; el mandato no se requiere
    fireEvent.click(screen.getByRole('button', { name: 'Radicar' }));
    solucion();
    fireEvent.change(screen.getByLabelText('Estado: Mandato aduanero'), { target: { value: 'NO' } });
    fireEvent.change(screen.getByLabelText('Fecha: Factura comercial'), { target: { value: '05/02/2026' } });
    guardar();
    expect(lista()).toMatch(/Mandato aduanero: si un documento se exige y no se tiene/);
    expect(lista()).not.toMatch(/Factura comercial/);
    fireEvent.change(screen.getByLabelText('Estado: Mandato aduanero'), { target: { value: 'NR' } });
    guardar();

    fireEvent.click(screen.getByRole('button', { name: 'Informar' }));
    expect(screen.getByText(/Cheque No. 004571/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    // banco: el valor debe ser el total pagado; luego el levante con el autoadhesivo
    expect(screen.getByText(/Número de aceptación generado/).textContent).toMatch(/482026000004571/);
    fireEvent.change(screen.getByLabelText('Número de aceptación de la declaración'), { target: { value: '482026000004571' } });
    fireEvent.change(screen.getByLabelText('Banco (cód.)'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Valor pagado $'), { target: { value: '60.000.000' } });
    fireEvent.change(screen.getByLabelText('Número del cheque'), { target: { value: '004571' } });
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(lista()).toMatch(/Valor pagado: no coincide/);
    fireEvent.change(screen.getByLabelText('Valor pagado $'), { target: { value: '65.264.000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(screen.getByLabelText('Comprobante del banco').textContent).toMatch(/90010004571236/);
    fireEvent.change(screen.getByLabelText('Número de aceptación'), { target: { value: '482026000004571' } });
    fireEvent.change(screen.getByLabelText('Fecha de aceptación'), { target: { value: '12/03/2026' } });
    fireEvent.change(screen.getByLabelText('Número de autoadhesivo'), { target: { value: '90010004571236' } });
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar levante' }));
    expect(lista()).toMatch(/Fecha del autoadhesivo: falta/);
    fireEvent.change(screen.getByLabelText('Fecha del autoadhesivo'), { target: { value: '2026-03-12' } });
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar levante' }));
    expect(screen.getByTestId('sx-aceptacion').textContent).toBe('482026000004571');
    expect(screen.getByTestId('sx-levante').textContent).toBe('482026000009871');
  });

  it('práctica 2: recibo oficial de pago del saldo pendiente, radicado y preinformado', () => {
    Object.assign(sesion, { usuario: { id: 42, nombre: 'Ana' }, tokenApi: 'jwt' });
    abrir();
    fireEvent.click(screen.getByRole('button', { name: '2. Recibo oficial de pago' }));
    entrar('A000042');
    // por «Declaraciones» no se llega al recibo
    ['Importaciones', 'Declarante SIA ó ALTEX'].forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Declaraciones' }));
    expect(screen.getByRole('alert').textContent).toMatch(/sigue por «Recibo Oficial Pago»/);
    ['Recibo Oficial Pago', 'Ingresar'].forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    const poner = (rotulo, valor) => fireEvent.change(screen.getByLabelText(rotulo), { target: { value: valor } });
    poner('Aplicación', 'TA');
    poner('No. de aceptación de la declaración', '482026000003310');
    poner('Fecha de aceptación', '20/02/2026');
    poner('Nombre de quien efectúa el pago', 'Ana María Pérez Gómez');
    poner('Documento de quien paga', '1.000.000.001');
    // error típico: volver a pagar el arancel que ya se pagó
    poner('Arancel', '1.230.000'); poner('IVA', '4.902.000'); poner('Intereses de mora', '61.000'); poner('Total pagado', '6.193.000');
    poner('Forma de pago', 'EF');
    guardar();
    const lista = screen.getByRole('region', { name: 'Lista de inconsistencias a corregir' }).textContent;
    expect(lista).toMatch(/Arancel: no coincide/);
    poner('Arancel', '0'); poner('Total pagado', '4.963.000');
    guardar();
    expect(screen.getByRole('status').textContent).toMatch(/48900123/);
    fireEvent.click(screen.getByRole('button', { name: 'Preinformar' }));
    expect(screen.getByTestId('sx-aceptacion-rop').textContent).toBe('489026000000731');
    expect(pedir).toHaveBeenCalledWith('/practicas', { metodo: 'POST', token: 'jwt', cuerpo: { practica: 'sigloxxii-rop', errores: 2, conSolucion: false } });
  });

  // Hace todo con la solución hasta pedir el levante, con el caso de la cuenta
  function hastaLevante(id) {
    Object.assign(sesion, { usuario: { id, nombre: 'Ana' }, tokenApi: 'jwt' });
    abrir();
    entrar(`A${String(id).padStart(6, '0')}`);
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: generarCaso(id).importador.departamento } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    solucion(); guardar();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar ítem' }));
    solucion(); fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' })); guardar();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar descripción' })); solucion(); guardar();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar totales' })); solucion(); guardar();
    fireEvent.click(screen.getByRole('button', { name: 'Radicar' })); solucion(); guardar();
    fireEvent.click(screen.getByRole('button', { name: 'Informar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    solucion(); fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    solucion(); fireEvent.click(screen.getByRole('button', { name: 'Solicitar levante' }));
  }
  const semillaCon = (inspeccion) => { for (let id = 1; ; id += 1) if (generarCaso(id).inspeccion === inspeccion) return id; };

  it('cada cuenta tiene su propio caso y abre el RUT de su importador', () => {
    const a = generarCaso(7);
    const b = generarCaso(8);
    expect([a.encabezado.factura, a.subpartida.cantidad]).not.toEqual([b.encabezado.factura, b.subpartida.cantidad]);
    Object.assign(sesion, { usuario: { id: 7, nombre: 'Ana' }, tokenApi: 'jwt' });
    abrir();
    expect(screen.getByTestId('sx-caso').textContent).toMatch(/Caso No. 7 \(es solo tuyo\)/);
    expect(screen.getByText(a.resumen)).toBeTruthy();
    // el RUT que se abre es el de su importador
    expect(screen.getByRole('link', { name: /Abrir el RUT/ }).getAttribute('href')).toBe('#/formularios/001?caso=1&semilla=7');
  });

  it('inspección documental: solo se le presentan al funcionario los documentos soporte', () => {
    hastaLevante(semillaCon('documental'));
    expect(screen.getByRole('status').textContent).toMatch(/seleccionó la declaración para inspección documental/);
    fireEvent.click(screen.getByLabelText('Factura comercial'));
    fireEvent.click(screen.getByLabelText('Mandato aduanero'));
    fireEvent.click(screen.getByRole('button', { name: 'Terminar la inspección' }));
    const lista = screen.getByRole('region', { name: 'Lista de inconsistencias a corregir' }).textContent;
    expect(lista).toMatch(/Lista de empaque: falta presentarlo/);
    expect(lista).toMatch(/Mandato aduanero: no es documento soporte/);
    solucion();
    fireEvent.click(screen.getByRole('button', { name: 'Terminar la inspección' }));
    expect(screen.getByText(/lo autorizó el funcionario después de la inspección documental/)).toBeTruthy();
  });

  it('inspección física: se revisa el acta dato por dato', () => {
    hastaLevante(semillaCon('fisica'));
    solucion();
    fireEvent.change(screen.getByLabelText('¿Coincide? Peso bruto'), { target: { value: 'NO' } });
    fireEvent.click(screen.getByRole('button', { name: 'Terminar la inspección' }));
    expect(screen.getByRole('region', { name: 'Lista de inconsistencias a corregir' }).textContent).toMatch(/Acta, Peso bruto: revisa otra vez/);
    fireEvent.change(screen.getByLabelText('¿Coincide? Peso bruto'), { target: { value: 'SI' } });
    fireEvent.click(screen.getByRole('button', { name: 'Terminar la inspección' }));
    expect(screen.getByTestId('sx-levante').textContent).toBe('482026000009871');
    expect(screen.getByText(/después de la inspección física/)).toBeTruthy();
  });

  it('práctica 3: corrección del flete, con pagos anteriores y sanción', () => {
    Object.assign(sesion, { usuario: { id: 42, nombre: 'Ana' }, tokenApi: 'jwt' });
    const c = generarCaso(42);
    const d = datosCorreccion(c);
    abrir();
    fireEvent.click(screen.getByRole('button', { name: '3. Declaración de corrección' }));
    entrar('A000042');
    RUTA_MENU.forEach((o) => fireEvent.click(screen.getByRole('menuitem', { name: o })));
    // el tipo es Corrección
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByRole('alert').textContent).toMatch(/el tipo es «Corrección»/);
    fireEvent.change(screen.getByLabelText('Tipo de declaración'), { target: { value: 'Corrección' } });
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    fireEvent.change(screen.getByLabelText('Departamento importador'), { target: { value: c.importador.departamento } });
    fireEvent.change(screen.getByLabelText('Tipo de documento respaldo de la importación'), { target: { value: 'DECLARACIÓN ANTERIOR' } });
    fireEvent.change(screen.getByLabelText('No. de aceptación de la declaración anterior'), { target: { value: '482026000004571' } });
    fireEvent.change(screen.getByLabelText('Fecha de aceptación de la declaración anterior'), { target: { value: '12/03/2026' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    // el sistema trae el ítem anterior: sin corregir el flete no guarda
    expect(screen.getByLabelText('Fletes').value).toBe(c.subpartida.fletes);
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' })); guardar();
    expect(screen.getByRole('region', { name: 'Lista de inconsistencias a corregir' }).textContent).toMatch(/Valor fletes USD: no coincide/);
    fireEvent.change(screen.getByLabelText('Fletes'), { target: { value: String(c.correccion.fleteReal) } });
    fireEvent.click(screen.getByRole('button', { name: 'Autoliquidar' })); guardar();
    // totales: pagar otra vez todo es un error; se paga la diferencia
    fireEvent.change(screen.getByLabelText('69. Total arancel pagado'), { target: { value: String(d.nueva.arancel) } });
    guardar();
    expect(screen.getByRole('region', { name: 'Lista de inconsistencias a corregir' }).textContent).toMatch(/se paga lo nuevo liquidado menos lo que ya se pagó/);
    solucion(); guardar();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(screen.getByTestId('sx-aceptacion-correccion').textContent).toBe('482026000005102');
    expect(pedir).toHaveBeenCalledWith('/practicas', { metodo: 'POST', token: 'jwt', cuerpo: { practica: 'sigloxxii-correccion', errores: 3, conSolucion: true } });
  });
});
