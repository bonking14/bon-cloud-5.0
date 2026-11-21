# BonCloud · Cómo funciona la página

Guía de uso para quien entra a BonCloud, según lo que puede hacer cada tipo de persona. No
requiere conocimientos técnicos.

Dirección: https://bonking14.github.io/bon-cloud-5.0/

## 1. Qué es

BonCloud es una plataforma para aprender comercio exterior colombiano, con el Puerto de
Cartagena como escenario. Tiene tres partes:

1. **Una ruta de aprendizaje** con lecciones, quizzes, examen final y certificado.
2. **Herramientas de práctica**: calculadoras, formularios de la DIAN y un simulador.
3. **Material de consulta**: Incoterms, subpartidas, vistos buenos y glosario.

Todo el contenido es educativo y así lo advierte la página: no reemplaza a una agencia de
aduanas ni a la norma vigente.

## 2. Formas de entrar

| Forma | Qué puede hacer | Qué no |
|---|---|---|
| **Invitado** | Usar todo el contenido y las herramientas | No guarda nada al salir; no tiene examen, certificado ni grupos |
| **Con cuenta** | Lo anterior, y además guarda su progreso, presenta exámenes, obtiene certificado y se une a grupos | — |

Para crear la cuenta se piden nombre, correo y contraseña, y aceptar los términos de uso y
la política de datos. Luego llega un correo para confirmar la dirección; sin confirmarla se
puede entrar igual.

Si se olvida la contraseña, «¿Olvidaste tu contraseña?» envía un enlace que vence en una
hora. Tras cinco contraseñas incorrectas la cuenta se bloquea 15 minutos.

## 3. Lo que ve el estudiante

### Inicio

Tiene forma de reporte: la siguiente lección por hacer, los indicadores del día (tasa de
cambio oficial, hora de Cartagena y código de la aduana), una tabla con el avance de cada
módulo de la ruta y las herramientas agrupadas en «Practicar» y «Consultar».

El menú lateral está agrupado en Aprender, Practicar y Consultar (y Docencia para profesores y
administradores). Todas las páginas internas terminan con un pie de página con el aviso de
que el contenido es de referencia y los enlaces a términos, política de datos y verificación
de certificados.

### Ruta Guiada

Son 15 lecciones en tres módulos. Cada módulo sigue un caso de práctica de principio a fin:

| Módulo | Caso | Lecciones |
|---|---|---|
| 1. Importación | 500 bombas de engranajes, de Shanghái a Cartagena | 8 |
| 2. Exportación y origen | Café tostado, de Cartagena a Hamburgo | 3 |
| 3. Regímenes especiales | Una máquina que pasa por tránsito aduanero, zona franca e importación temporal | 4 |

Cada lección tiene: lo que se va a aprender, qué pasa con el embarque en esa etapa, el
contenido con la normativa, las normas que cita, un enlace para practicar con una
herramienta y un quiz de cuatro preguntas. Se aprueba con tres aciertos y eso desbloquea la
lección siguiente. El quiz se puede repetir.

Un mapa muestra el recorrido del embarque y avanza con cada lección aprobada. Las palabras
subrayadas abren su definición en el glosario.

### Examen final

Hay un examen por módulo: 10 preguntas al azar, 30 minutos y 3 intentos. Se aprueba con 70
sobre 100. Solo se puede presentar después de aprobar las lecciones del módulo. Al terminar
se ve cuáles preguntas se fallaron y por qué.

Con los tres exámenes aprobados sale un **certificado en PDF** con un código y un código QR.
Cualquier persona puede comprobarlo en la página de verificación, que muestra el nombre, la
nota y la fecha, sin necesidad de cuenta.

### Herramientas

- **Importación:** calcula valor en aduana, arancel e IVA en tres modalidades (ordinaria,
  con franquicia y temporal de corto plazo) y las compara.
- **Exportación:** valor FOB y modalidades (definitiva, temporal, menaje), y **costeo por
  Incoterm**: qué costos de la cadena logística asume el vendedor en cada una de las 11 reglas,
  a qué precio debe cotizar y qué valor FOB va en la DEX.
- **Formularios:** los formularios 001 (RUT), 500 (importación), 560 (valor), 602
  (solicitud de autorización de embarque), 600 (exportación), 650 (tránsito, formato anterior)
  y 651 (DUTA, el documento de tránsito actual), con la apariencia de los originales. Cada casilla explica
  qué se escribe en ella, los totales se calculan solos y se pueden imprimir o guardar en
  PDF. Llevan una marca que dice que son simuladores sin validez. En celular se llenan como
  una lista de casillas.
- **Simulador logístico:** estima costos, tiempos y riesgos de una importación y genera un
  informe.
- **SIGLO XXII:** práctica paso a paso de cómo se ingresa una declaración de importación en
  el sistema informático aduanero, con el mismo recorrido y los mismos campos del sistema real
  pero con una apariencia moderna. Incluye la consulta de inventario del documento de
  transporte: ingreso con un usuario de práctica, menú en cascada,
  parámetros previos, encabezado, ítem con autoliquidación, descripción, totales, documentos
  soporte e informar. El sistema valida cada pantalla
  contra los documentos del caso y dice qué falta o qué no coincide. Es un simulador: no se
  conecta con la DIAN. Aún no incluye el pago en el banco ni la solicitud de levante. Cada
  cuenta tiene su propio usuario de práctica (por ejemplo `A000042`); al terminar, la práctica
  queda registrada a su nombre. El invitado usa un usuario de ejemplo y no se le registra.
  Los documentos del caso traen nombres (Cartagena, Panamá, marítimo) y no códigos: el
  estudiante busca cada código con «Buscar código» junto al campo o en las tablas de códigos
  (administraciones, lugares de ingreso, depósitos, países, departamentos, ciudades, modos de
  transporte, transportadores, agencias de aduanas, embalajes, unidades, modalidades y bancos). Los
  errores salen como en el sistema, en una «Lista de inconsistencias a corregir» numerada, y
  dicen dónde buscar sin dar la respuesta. Al guardar el encabezado, el sistema asigna un número
  de radicación y muestra las partes de la declaración, que se completan en orden, como indica el
  manual del declarante de SIGLO XXI de la DIAN:
  - **Ítem:** subpartida, valores y autoliquidación.
  - **Descripción** (casilla 43): el sistema exige la descripción mínima: qué es, tipo, uso, si
    trae motor, marca, referencia, seriales y cantidad.
  - **Totales** (casillas 67 a 76): el sistema trae lo liquidado y el estudiante llena lo que se
    paga con la declaración, las sanciones y la forma de pago (efectivo o cheque, con el código
    del banco de la tabla de bancos), según la instrucción de pago del caso.
  - **Doc. soporte / Radicar:** para cada posible documento (factura, documento de transporte,
    lista de empaque, declaración andina del valor, mandato, certificado de origen, registro o
    licencia) se marca «Sí presentado», «No presentado» o «No requerido», con número y fecha.
  - **Informar:** con todo guardado, el estudiante revisa la declaración, pulsa «Confirmar» y
    el sistema da el número de aceptación.

  Al final, «Generar el formulario 500 (PDF)» abre el formulario 500 con la declaración (incluida
  la descripción que escribió el estudiante) para imprimirlo o guardarlo en PDF. Desde la guía
  se abre el RUT del importador (formulario 001) en otra pestaña, para trabajar con los
  documentos al lado.

### Material de consulta

Incoterms 2020 con animación de quién asume cada costo; el **Arancel de Aduanas completo**
(Decreto 1881 de 2021: 21 secciones, 98 capítulos y cerca de 8.000 subpartidas con su gravamen),
con buscador por código o palabras; fichas de práctica de subpartidas con IVA y vistos buenos,
ordenadas por sección; vistos buenos por entidad y un glosario.

### Mi perfil

Se abre haciendo clic en el nombre, abajo en el menú. Ahí se puede:

- Cambiar el nombre y la contraseña.
- **Unirse a un grupo** con el código que da el profesor, o salir de él.
- Descargar una copia de todos los datos propios.
- Eliminar la cuenta.

### Ajustes de lectura

En el menú hay tres tamaños de letra y la opción de tema oscuro. La página abre en tema claro;
si la persona elige el oscuro, se recuerda en su navegador.

## 4. Lo que ve el profesor

Además de todo lo anterior, tiene el menú **Grupos**.

1. Crea un grupo y recibe un **código de seis caracteres**.
2. Comparte el código. Cada estudiante lo escribe en «Mi perfil» → «Mis grupos».
3. En el panel del grupo ve a cada estudiante con sus lecciones aprobadas, su promedio, sus
   intentos, si terminó la práctica de SIGLO XXII y su última actividad. Al abrir un estudiante
   ve el detalle lección por lección y, de la práctica, cuántas pantallas le devolvió el
   sistema con errores y si usó el botón de la solución.
4. Puede **descargar todo a Excel**, retirar a un estudiante, cerrar el grupo (el código
   deja de servir) o eliminarlo.

El profesor solo ve a los estudiantes de sus propios grupos. Si su institución tiene
licencia, ve cuántos cupos lleva usados y cuándo vence.

Un profesor no se registra como tal: se registra como cualquiera y el administrador le
asigna el rol.

## 5. Lo que ve el administrador

Tiene además dos menús:

- **Usuarios:** busca cuentas, les asigna el rol de profesor o administrador y asigna cada
  profesor a su institución.
- **Licencias:** crea instituciones con un número de cupos y una fecha de vencimiento, las
  suspende o las reactiva.

También ve los grupos de todos los profesores.

## 6. Cómo funcionan las licencias

Una institución tiene **cupos**: el número de estudiantes distintos que pueden estar en los
grupos de sus profesores. Cuando un estudiante intenta unirse a un grupo:

- Si la licencia está vencida o suspendida, no entra.
- Si no quedan cupos, no entra, salvo que ya ocupe uno en otro grupo de la misma institución.
- Si el profesor no tiene institución asignada, no hay límite.

## 7. Qué datos se guardan

Nombre, correo, contraseña cifrada, lecciones aprobadas, notas de quizzes y exámenes,
prácticas terminadas en los simuladores, certificado y grupos. No se piden datos de pago ni datos sensibles. El detalle está en la
política de datos, enlazada desde la página de ingreso.

## 8. Cosas que conviene saber

- **El primer ingreso del día puede tardar hasta un minuto**, porque el servidor se duerme
  cuando nadie lo usa.
- **Los correos** de confirmación y de recuperación hoy solo llegan a la dirección del
  administrador, hasta que se configure un dominio propio.
- **Las notas de quizzes anteriores a noviembre de 2026** no existen: esas lecciones
  aparecen como aprobadas, sin nota.
- **El contenido** todavía no ha sido revisado por un profesional de aduanas, y así lo
  indica cada lección.
