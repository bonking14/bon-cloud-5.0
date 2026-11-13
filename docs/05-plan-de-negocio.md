# BonCloud · Plan de negocio

Borrador de trabajo, noviembre de 2026. Describe a quién se le vende BonCloud, qué se le
vende, cómo se cobra y qué falta para empezar.

**Cómo leer este documento.** Lo que describe el producto es un hecho: está construido y
funcionando. Lo que habla de precios, tamaño del mercado y ventas son **hipótesis**: nadie
las ha comprobado todavía, y la primera tarea del plan es comprobarlas. Están marcadas.

## 1. Resumen

BonCloud es una plataforma en línea para enseñar comercio exterior colombiano con casos
prácticos, simuladores de los formularios de la DIAN, examen y certificado verificable.

Se vende a **instituciones que enseñan comercio exterior**, por licencia anual según el
número de estudiantes. El profesor recibe un panel para seguir el avance y las notas de su
grupo; el estudiante practica con las mismas herramientas que usará en el trabajo.

El producto ya existe. Lo que falta para vender no es desarrollo: es validar el contenido
con un experto, formalizar la parte legal, poner la infraestructura en planes pagos y
conseguir los primeros clientes.

## 2. El problema

Quien estudia comercio exterior aprende la norma en clase, pero rara vez practica el trámite
real: llenar una declaración de importación, liquidar tributos, escoger una modalidad. Los
sistemas de la DIAN no se pueden usar para practicar, y los formularios en papel no
calculan ni explican nada.

Para el profesor, el problema es otro: no tiene cómo saber, sin calificar a mano, quién
practicó y quién entendió.

*Hipótesis por validar:* que las instituciones perciben esto como un problema por el que
pagarían. Se valida en las entrevistas de la sección 9.

## 3. La solución

| Necesidad | Qué ofrece BonCloud |
|---|---|
| Practicar el trámite | Formularios 001, 500, 560, 600 y 650 con la apariencia de los originales, ayuda por casilla y cálculo automático |
| Entender el proceso completo | 15 lecciones en tres módulos, cada uno con un caso de principio a fin |
| Calcular | Calculadoras de importación y exportación y un simulador logístico |
| Consultar | Incoterms, subpartidas, vistos buenos y glosario |
| Evaluar | Quizzes por lección y examen final calificado por el sistema |
| Acreditar | Certificado con código y QR que cualquiera puede comprobar |
| Hacer seguimiento | Panel del profesor con avance y notas, exportable a Excel |
| Administrar | Licencias por institución con cupos y vencimiento |

## 4. Clientes

**Cliente principal: instituciones de educación.**

- Universidades e instituciones técnicas y tecnológicas con programas de comercio exterior,
  negocios internacionales o logística.
- Centros de formación del SENA con programas afines.

Quien decide suele ser el coordinador o director de programa; quien usa es el profesor.

**Cliente secundario: empresas del sector.**

- Agencias de aduanas, agentes de carga y operadores logísticos que capacitan personal nuevo.

**No es el foco por ahora:** estudiantes individuales. Venderles exige pasarela de pago,
soporte uno a uno y publicidad, y pagan menos.

*Hipótesis por validar:* cuántas instituciones hay y cuántos estudiantes tienen. Este
documento no trae esa cifra porque no se ha investigado. Fuentes para hacerlo: el SNIES del
Ministerio de Educación (programas activos por nombre) y la oferta de formación del SENA.

## 5. Propuesta de valor

Para la institución, en una frase: *sus estudiantes practican el trámite aduanero real y
usted ve quién aprendió, sin instalar nada.*

Lo que diferencia a BonCloud:

1. **Es práctico.** No es un curso en video: se llenan formularios y se liquidan tributos.
2. **Es colombiano y específico.** Norma, formularios y casos del país y del Puerto de
   Cartagena.
3. **Le sirve al profesor.** Panel de seguimiento y notas listas para Excel.
4. **No requiere instalación** ni integración con los sistemas de la institución.

Debilidades que un cliente va a notar, y que conviene reconocer en la venta:

- El contenido aún no tiene la firma de un profesional de aduanas.
- Son 15 lecciones: complementa un curso, no lo reemplaza.
- No se integra con plataformas como Moodle.

## 6. Modelo de ingresos

**Licencia anual por institución, según cupos.** Un cupo es un estudiante distinto en los
grupos de los profesores de la institución. El sistema ya controla cupos y vencimiento.

Estructura propuesta (*los valores son hipótesis; hay que fijarlos tras las entrevistas*):

| Plan | Cupos | Para quién |
|---|---|---|
| Piloto | Hasta 30, un semestre, sin costo | Primeras instituciones, a cambio de retroalimentación y un testimonio |
| Aula | Hasta 50 | Un profesor o un curso |
| Programa | Hasta 200 | Un programa académico completo |
| Institución | Más de 200 | Varias sedes o programas; precio negociado |

Cómo fijar el precio: preguntar en las entrevistas cuánto pagan hoy por estudiante en otras
herramientas o licencias, y ubicarse por debajo de un libro de texto por estudiante al año.
El precio debe quedar expresado **por estudiante al año**, que es como compara un
coordinador.

Se factura por fuera de la plataforma (cuenta de cobro o factura) y el administrador activa
la licencia. No hace falta pasarela de pago para empezar.

Ingresos posibles más adelante, no ahora: capacitación a empresas, módulos a la medida,
examen con certificado para personas individuales.

## 7. Costos

**Para operar** (mensuales; los precios exactos deben consultarse con cada proveedor):

| Concepto | Hoy | Para vender |
|---|---|---|
| Servidor (Render) | Gratis | Plan pago, para que no se duerma |
| Base de datos (Neon) | Gratis | Plan pago, por las copias de seguridad |
| Dominio | No hay | Pago anual |
| Correos (Resend) | Gratis | Gratis mientras el volumen sea bajo |
| Alojamiento de la web (GitHub Pages) | Gratis | Gratis |

Son costos fijos bajos y casi no crecen con el número de estudiantes.

**Para empezar** (una sola vez):

- Honorarios del abogado: revisión de términos, política de datos y uso de los diseños de
  formularios.
- Honorarios del profesional de aduanas: revisión del contenido y banco de preguntas del
  examen.
- Constitución o formalización de quien factura, si aún no existe.

**Recurrentes no técnicos:**

- Actualización del contenido cuando cambie la norma. Es el costo más importante a largo
  plazo: una plataforma de norma aduanera desactualizada pierde su valor.
- Tiempo de ventas y de soporte a profesores.

**Punto de equilibrio.** Se calcula así, cuando se conozcan los valores:

```
licencias necesarias al año = (costos fijos del año + costos de actualización)
                              ÷ precio promedio de una licencia
```

Como los costos fijos de tecnología son bajos, el equilibrio depende sobre todo de cuánto
cueste mantener el contenido al día y de cuánto tiempo se dedique a vender.

## 8. Competencia y alternativas

El coordinador que evalúa BonCloud lo compara con lo que ya hace:

- **Clase tradicional con formularios impresos o en PDF.** Gratis, pero no calcula, no
  explica y no deja registro.
- **Cursos en línea generales de comercio exterior.** Enseñan teoría; no traen simuladores
  de los formularios colombianos ni panel para el profesor.
- **Capacitaciones de gremios y agencias.** Presenciales y más costosas por persona.
- **Software aduanero profesional.** Está hecho para operar, no para enseñar, y su licencia
  no está pensada para un salón.

*Pendiente:* identificar con nombre propio qué usan hoy las instituciones entrevistadas. Es
una de las preguntas de la sección 9.

## 9. Plan para conseguir los primeros clientes

**Paso 1 · Validar (primer mes).** Entrevistar entre cinco y diez coordinadores o profesores
de comercio exterior. No se vende: se pregunta.

- ¿Cómo practican hoy sus estudiantes los trámites aduaneros?
- ¿Qué herramientas usan y cuánto pagan por ellas?
- Mostrar BonCloud 15 minutos: ¿qué usaría?, ¿qué le falta?
- ¿Quién aprueba una compra así y con qué presupuesto?

Empezar por Cartagena y la costa, donde el puerto hace el tema más cercano.

**Paso 2 · Pilotos (un semestre).** Ofrecer a dos o tres instituciones el plan piloto sin
costo. A cambio: usarlo con un grupo real, una reunión de retroalimentación al final y
permiso para citarlas. Medir cuántos estudiantes terminan la ruta y qué dicen los profesores.

**Paso 3 · Primeras ventas.** Con los resultados del piloto, convertir a esas instituciones
en clientes de pago y usar su testimonio para las siguientes. Canales: contacto directo con
coordinadores, eventos y redes de programas de negocios internacionales, y demostraciones
en línea.

**Paso 4 · Crecer.** Solo después de tener clientes que renuevan: más módulos, integración
con Moodle, venta a empresas.

## 10. Qué falta antes de cobrar

| Pendiente | Quién | Por qué importa |
|---|---|---|
| Revisión del contenido por un profesional de aduanas | Experto externo | Es lo primero que preguntará una institución |
| Banco de preguntas propio para el examen | Experto externo | Hoy las respuestas se pueden encontrar; resta valor al certificado |
| Revisión de términos, datos y uso de formularios | Abogado | Riesgo legal al cobrar |
| Dominio propio y correos a cualquier destinatario | Dueño del proyecto | Hoy los estudiantes no reciben correos |
| Planes pagos de servidor y base de datos, con copias | Dueño del proyecto | Hoy no hay copias de seguridad de las notas |
| Figura para facturar | Dueño del proyecto | Las instituciones exigen factura |

El detalle técnico de cada punto está en `docs/produccion.md`.

## 11. Riesgos

| Riesgo | Qué tan grave | Cómo reducirlo |
|---|---|---|
| El contenido queda desactualizado al cambiar la norma | Alto | Acuerdo de revisión periódica con el experto; cada lección ya muestra sus normas y su fecha de revisión |
| Las instituciones no tienen presupuesto o compran muy lento | Alto | Pilotos gratuitos; precio por estudiante bajo; vender también a empresas |
| Reclamo por el uso de los diseños de formularios de la DIAN | Medio | Concepto del abogado; los simuladores ya llevan marca de «sin validez» |
| Pérdida de datos | Medio | Copias de seguridad antes del primer cliente de pago |
| Dependencia de una sola persona para operar y vender | Medio | La documentación de este directorio; sumar un socio comercial o académico |
| Un competidor con más recursos copia la idea | Bajo por ahora | Ventaja de llegar primero a las instituciones y de tener el contenido validado |

## 12. Metas del primer año

*Propuesta para ajustar tras las entrevistas.*

| Plazo | Meta |
|---|---|
| Mes 1 | 5 a 10 entrevistas hechas; experto y abogado contratados |
| Mes 3 | Contenido revisado y firmado; dominio y planes pagos activos |
| Mes 4 a 8 | 2 o 3 pilotos con grupos reales |
| Mes 9 | Primera licencia de pago |
| Mes 12 | Renovaciones de los pilotos y decisión informada: seguir, ajustar o detenerse |

La señal de que el negocio funciona no es el número de registros: es que una institución
**pague y renueve**.
