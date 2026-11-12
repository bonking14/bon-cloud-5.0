# Lista de revisión del contenido de BonCloud

Para el profesional de aduanas que revisa la Ruta de Aprendizaje. Por cada lección: confirme
que las normas citadas siguen vigentes, que cada afirmación es correcta y que la respuesta
marcada en cada pregunta es la única correcta. Anote las correcciones al lado.

Al terminar, su nombre, su credencial y la fecha se registran en `web/src/data/revision.js`,
y aparecen al pie de cada lección. Este archivo se genera solo: no lo edite a mano.

## Módulo 1. Importación

Caso: 500 bombas de engranajes, de Shanghái al Puerto de Cartagena.

### Lección 1. ¿Qué es el comercio internacional y quiénes intervienen?

**Normas citadas**

- [ ] Decreto 410 de 1971
- [ ] Decreto 1165 de 2019
- [ ] Decreto 2685 de 1999
- [ ] Estatuto Tributario
- [ ] Resolución DIAN 46 de 2019

**Contenido**

El comercio internacional es el intercambio de bienes y servicios entre países. En Colombia, la entrada y salida de mercancías se rige por el Decreto 1165 de 2019 (régimen de aduanas) y sus modificaciones, reglamentado por la Resolución 000046 de 2019. La autoridad aduanera es la DIAN.
 Quién hace qué en una importación
- Importador: persona natural o jurídica que trae la mercancía al país. Debe estar inscrito en el RUT (formulario 001) con la calidad de usuario aduanero de importador.
- Exportador o proveedor: vende y despacha la mercancía desde el país de origen.
- Naviera (transportador): opera el buque y emite el conocimiento de embarque (B/L), que prueba el contrato de transporte.
- Agente de carga internacional: contrata y coordina el transporte, consolida carga y puede emitir su propio documento de transporte (B/L hijo o house).
- Agencia de aduanas: empresa autorizada por la DIAN que, mediante un mandato aduanero, presenta las declaraciones a nombre del importador. No es obligatoria: el importador puede actuar directamente ante la DIAN, por cualquier cuantía (art. 33 del Decreto 1165 de 2019), y en ese caso responde como declarante.
- Sociedad portuaria: concesionaria que administra el terminal. En Cartagena, por ejemplo, la Sociedad Portuaria Regional de Cartagena (SPRC) y Contecar, del Grupo Puerto de Cartagena.
- Autoridades: la DIAN controla la entrada de mercancías y recauda los tributos; el MinCIT define la política de comercio exterior y administra la VUCE; según el producto intervienen además el INVIMA, el ICA, la SIC y otras entidades.

**Caso de práctica**

HidroColombia S.A.S., una empresa colombiana, quiere importar 500 bombas de engranajes para sistemas oleohidráulicos, sin motor, del fabricante Zhejiang Hydraulic Co. (Shanghái). Primer paso: confirmar que su RUT tenga registrada la calidad de usuario aduanero de importador y decidir si contratará una agencia de aduanas o actuará directamente ante la DIAN.

**Preguntas**

1. ¿Qué norma contiene el régimen de aduanas vigente en Colombia?
   - Respuesta marcada como correcta: **El Decreto 1165 de 2019, con sus modificaciones**
   - Explicación: El Decreto 1165 de 2019 reemplazó al Decreto 2685 de 1999 y es el régimen de aduanas vigente. El Código de Comercio regula los contratos y el Estatuto Tributario los impuestos, pero ninguno de los dos regula el procedimiento aduanero.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Quién opera el buque y emite el conocimiento de embarque (B/L)?
   - Respuesta marcada como correcta: **La naviera**
   - Explicación: La naviera es el transportador marítimo: opera el buque y emite el B/L. El agente de carga puede emitir un B/L hijo cuando consolida carga, pero no opera el buque.
   - [ ] Correcta  [ ] Corregir: 

3. HidroColombia no quiere contratar agencia de aduanas. ¿Qué permite la norma?
   - Respuesta marcada como correcta: **Puede actuar directamente ante la DIAN por cualquier cuantía, y responde como declarante**
   - Explicación: El artículo 33 del Decreto 1165 de 2019 permite al importador actuar directamente, por cualquier cuantía. Al hacerlo asume las obligaciones del declarante, como conservar los documentos soporte.
   - [ ] Correcta  [ ] Corregir: 

4. ¿Qué entidad administra la VUCE, donde se tramitan los permisos de otras entidades?
   - Respuesta marcada como correcta: **El Ministerio de Comercio, Industria y Turismo**
   - Explicación: La VUCE (Ventanilla Única de Comercio Exterior) la administra el MinCIT. La DIAN usa sus propios servicios informáticos para las declaraciones.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 2. Incoterms 2020 y cómo elegir uno

**Normas citadas**

- [ ] Incoterms® 2020

**Contenido**

Los Incoterms® 2020 de la Cámara de Comercio Internacional (ICC) son 11 reglas que reparten costos, riesgos y trámites entre vendedor y comprador. Siete sirven para cualquier modo de transporte (EXW, FCA, CPT, CIP, DAP, DPU y DDP) y cuatro son solo para transporte marítimo o fluvial (FAS, FOB, CFR y CIF).
- FOB (Free On Board): el vendedor hace el despacho de exportación y entrega la mercancía a bordo del buque que designa el comprador. El comprador contrata y paga el flete. El riesgo pasa al comprador cuando la mercancía queda a bordo. El seguro no es obligatorio para ninguno de los dos; normalmente lo toma el comprador porque el riesgo del viaje ya es suyo.
- CIF (Cost, Insurance and Freight): el vendedor paga el flete y un seguro hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía queda a bordo en origen. El seguro exigido es de cobertura mínima (Cláusulas C del Instituto) por el 110% del valor.
- EXW (Ex Works): el vendedor solo pone la mercancía a disposición en su fábrica. El comprador asume todo, incluido el despacho de exportación en el país de origen, algo difícil para un importador colombiano en China.
- FCA (Free Carrier): el vendedor entrega la mercancía despachada para exportación al transportador, por ejemplo en la terminal de contenedores. Para carga en contenedor la ICC recomienda FCA en lugar de FOB, porque el contenedor se entrega en la terminal antes de subir al buque.

**Caso de práctica**

HidroColombia negocia las 500 bombas a USD 120 cada una en términos FOB Shanghái: valor FOB total de USD 60.000. HidroColombia contrata el flete con su agente de carga y toma un seguro de transporte, porque el riesgo pasa a su cargo cuando el contenedor queda a bordo del buque en Shanghái. Como es carga en contenedor, FCA terminal de Shanghái sería la opción que recomienda la ICC; en este curso seguimos con FOB porque es el término más usado en compras a China.

**Preguntas**

1. En una compra FOB Shanghái, ¿quién contrata y paga el flete marítimo hasta Cartagena?
   - Respuesta marcada como correcta: **El comprador en Colombia**
   - Explicación: En FOB el vendedor entrega a bordo en el puerto de embarque; desde ahí, el flete principal lo contrata y paga el comprador.
   - [ ] Correcta  [ ] Corregir: 

2. Según Incoterms 2020, ¿en qué momento pasa el riesgo al comprador en FOB?
   - Respuesta marcada como correcta: **Cuando la mercancía queda a bordo del buque en el puerto de embarque**
   - Explicación: Desde Incoterms 2010 el riesgo en FOB pasa cuando la mercancía está a bordo. El criterio de 'cruzar la borda' pertenece a versiones anteriores. La entrega en la terminal de contenedores corresponde a FCA.
   - [ ] Correcta  [ ] Corregir: 

3. En CIF, ¿qué seguro debe contratar el vendedor como mínimo?
   - Respuesta marcada como correcta: **Cobertura mínima (Cláusulas C del Instituto) por el 110% del valor**
   - Explicación: En CIF el vendedor debe contratar al menos una cobertura mínima (Cláusulas C) por el 110% del valor. La cobertura amplia (Cláusulas A) es la exigida en CIP.
   - [ ] Correcta  [ ] Corregir: 

4. ¿Qué regla recomienda la ICC para carga en contenedor que se entrega en una terminal?
   - Respuesta marcada como correcta: **FCA**
   - Explicación: FOB, FAS, CFR y CIF suponen entrega a bordo o al costado del buque. Cuando el contenedor se entrega en la terminal antes de embarcarse, la regla adecuada es FCA.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 3. Clasificación arancelaria y subpartidas

**Normas citadas**

- [ ] Decreto 272 de 2018
- [ ] Decreto 1881 de 2021

**Contenido**

Clasificar es asignarle a la mercancía su subpartida en el Arancel de Aduanas. De ella dependen el arancel, el IVA, los requisitos de otras entidades y las estadísticas.
 Estructura del código (10 dígitos)
- 6 dígitos del Sistema Armonizado de la Organización Mundial de Aduanas: capítulo (2), partida (4) y subpartida (6).
- 2 dígitos de la NANDINA, la nomenclatura común de la Comunidad Andina, que tiene 8 dígitos.
- 2 dígitos nacionales que agrega Colombia. Si no hay desdoblamiento nacional, son 00.
 Cómo se clasifica
 Se aplican las Reglas Generales Interpretativas (RGI) en orden. La RGI 1 dice que los títulos de secciones y capítulos solo orientan: la clasificación la determinan los textos de las partidas y las notas. La RGI 6 aplica la misma lógica para escoger entre subpartidas. Si hay duda, se puede pedir a la DIAN una resolución de clasificación anticipada.
 Las bombas del caso
- Capítulo 84: máquinas y aparatos mecánicos.
- Partida 84.13: bombas para líquidos, incluso con dispositivo medidor incorporado; elevadores de líquidos.
- Subpartida 8413.60: las demás bombas volumétricas rotativas, como las de engranajes, paletas o tornillo.
- No confundir: las bombas de pistones (volumétricas alternativas) van en 8413.50, las centrífugas en 8413.70 y los motores hidráulicos en la partida 84.12.
 La subpartida nacional es 8413.60.90.00. El Arancel de Aduanas (Decreto 1881 de 2021) le fija un gravamen general del 5%, pero esta subpartida está en la lista del Decreto 272 de 2018, que deja en 0% las materias primas y bienes de capital que no se producen en Colombia. Por eso hoy su arancel real es 0%. En el curso usamos un arancel de práctica del 5% para que puedas ejercitar la liquidación completa. Antes de una operación real confirma siempre el gravamen vigente: además del arancel general, revisa los decretos que lo modifican.

**Caso de práctica**

La ficha técnica confirma que son bombas de engranajes externos (volumétricas rotativas), sin motor, para aceite hidráulico. Con la RGI 1 y la RGI 6: capítulo 84, partida 84.13, subpartida 8413.60. La subpartida nacional es 8413.60.90.00. Colombia no tiene acuerdo comercial vigente con China, así que no hay preferencia por origen: se aplica el arancel de nación más favorecida, que para esta subpartida hoy es 0% por el Decreto 272 de 2018. Para practicar la liquidación usaremos un arancel del 5%.

**Preguntas**

1. ¿Cómo se componen los 10 dígitos de una subpartida en el Arancel de Aduanas de Colombia?
   - Respuesta marcada como correcta: **6 del Sistema Armonizado, 2 de la NANDINA y 2 nacionales**
   - Explicación: El Sistema Armonizado llega a 6 dígitos, la NANDINA a 8 y Colombia agrega 2 dígitos nacionales para completar 10.
   - [ ] Correcta  [ ] Corregir: 

2. Si las bombas del caso fueran de pistones en lugar de engranajes, ¿qué subpartida del Sistema Armonizado correspondería?
   - Respuesta marcada como correcta: **8413.50, bombas volumétricas alternativas**
   - Explicación: Las bombas de pistones son volumétricas alternativas (8413.50); las de engranajes, paletas o tornillo son rotativas (8413.60). La partida 84.12 es de motores, no de bombas.
   - [ ] Correcta  [ ] Corregir: 

3. ¿Qué Regla General Interpretativa se aplica primero?
   - Respuesta marcada como correcta: **La RGI 1: mandan los textos de las partidas y las notas de sección y capítulo**
   - Explicación: Las RGI se aplican en orden y la primera es la RGI 1. Los títulos de secciones y capítulos solo tienen valor indicativo.
   - [ ] Correcta  [ ] Corregir: 

4. Las bombas vienen de China y Colombia no tiene acuerdo comercial con ese país. ¿Qué arancel se aplica?
   - Respuesta marcada como correcta: **El arancel general de la subpartida en el Arancel de Aduanas**
   - Explicación: Sin acuerdo comercial no hay preferencia: se paga el arancel general de la subpartida, con las modificaciones que haya hecho el Gobierno por decreto (para las bombas, el Decreto 272 de 2018 lo deja hoy en 0%). Ser miembro de la OMC no significa arancel cero, y el certificado de origen chino no da preferencia sin un acuerdo.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 4. Vistos buenos y requisitos previos

**Normas citadas**

- [ ] Decreto 925 de 2013

**Contenido**

Algunas mercancías necesitan vistos buenos, permisos o certificaciones de otras entidades además de la DIAN. Se tramitan en la VUCE (Ventanilla Única de Comercio Exterior) y deben estar aprobados antes de presentar la declaración de importación; algunas entidades los exigen desde antes del embarque. Por eso se revisan justo después de clasificar.
 Con el Decreto 925 de 2013, la mayoría de mercancías son de libre importación. El registro de importación se exige cuando la subpartida tiene requisitos o vistos buenos, y la licencia previa en casos restringidos.
 Entidades que aparecen con más frecuencia
- INVIMA: alimentos, medicamentos, cosméticos y dispositivos médicos.
- ICA: animales, plantas, semillas e insumos agropecuarios.
- SIC: verifica que los productos sujetos a reglamentos técnicos (por ejemplo, el RETIE para productos eléctricos) tengan su certificado de conformidad, expedido por un organismo acreditado.
- Ministerio de Justicia: sustancias químicas controladas.
- Fondo Nacional de Estupefacientes: medicamentos y materias primas de control especial.
- Indumil y Ministerio de Defensa: armas, municiones y explosivos.

**Caso de práctica**

Antes de confirmar la orden de compra, HidroColombia consulta la subpartida en la VUCE. En este caso de práctica, las bombas de engranajes sin motor son de libre importación: no requieren vistos buenos ni registro de importación. Si hubieran sido electrobombas, el motor eléctrico podría tener que demostrar conformidad con el RETIE, y la SIC lo verificaría antes de declarar. En una operación real, el resultado depende de la subpartida y de la norma vigente ese día.

**Preguntas**

1. ¿Dónde se tramitan los vistos buenos y registros de importación de otras entidades?
   - Respuesta marcada como correcta: **En la VUCE**
   - Explicación: La VUCE centraliza los trámites ante las entidades de control. La DIAN usa sus servicios informáticos para las declaraciones, no para los vistos buenos.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Cuándo deben estar aprobados los vistos buenos que exija la mercancía?
   - Respuesta marcada como correcta: **Antes de presentar la declaración de importación; algunas entidades los piden desde antes del embarque**
   - Explicación: Sin los vistos buenos aprobados la mercancía no puede declararse correctamente. Por eso se revisan justo después de clasificar, antes de comprar y embarcar.
   - [ ] Correcta  [ ] Corregir: 

3. Si importaras electrobombas, ¿quién verificaría el certificado de conformidad del reglamento técnico?
   - Respuesta marcada como correcta: **La SIC, a través de la VUCE**
   - Explicación: La SIC verifica el cumplimiento de reglamentos técnicos como el RETIE. El certificado lo expide un organismo de certificación acreditado.
   - [ ] Correcta  [ ] Corregir: 

4. Con el Decreto 925 de 2013, ¿cuál es la situación de la mayoría de mercancías?
   - Respuesta marcada como correcta: **Son de libre importación, salvo que la subpartida tenga requisitos**
   - Explicación: La regla general es la libre importación. El registro y la licencia se exigen solo cuando la subpartida o la operación lo requieren.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 5. Valor en aduana: FOB, flete, seguro y CIF

**Normas citadas**

- [ ] Decisión 571 de la CAN
- [ ] Decreto 1165 de 2019
- [ ] Resolución DIAN 46 de 2019

**Contenido**

Los tributos se liquidan sobre el valor en aduana, que se determina con las normas de valoración de la OMC y la Comunidad Andina (Decisión 571 y su reglamento). El método principal es el valor de transacción: el precio realmente pagado o por pagar, con los ajustes que exija la norma. En Colombia se incluyen el transporte y el seguro hasta el puerto de importación, por eso en la práctica el valor en aduana es un valor CIF.
 Valor en aduana (USD) = FOB + flete internacional + seguro (+ otros ajustes, si los hay)
- Seguro: se declara el costo real de la póliza contratada. Si la mercancía no se aseguró, igual se suma la prima que se cobra habitualmente, sustentada con la cotización de una aseguradora (art. 340 de la Resolución 46 de 2019). La DIAN no acepta valores estimados sin soporte.
- Si compras en CIF: el precio ya incluye flete y seguro; no se vuelven a sumar.
- Conversión a pesos: se usa la TRM vigente el último día hábil de la semana anterior a la presentación y aceptación de la declaración (art. 15 del Decreto 1165 de 2019). No es la del día de presentación ni la del día de llegada del buque.

**Caso de práctica**

Datos del embarque (valores de práctica):<br>• Valor FOB: USD 60.000 (500 bombas × USD 120)<br>• Flete Shanghái–Cartagena, contenedor de 20 pies: USD 3.500 (cotización de ejemplo)<br>• Seguro de transporte: USD 300 (prima de ejemplo)<br>• <strong>Valor en aduana: USD 63.800</strong><br>• TRM del último día hábil de la semana anterior (ejemplo): $4.100<br>• <strong>Valor en aduana en pesos: $261.580.000</strong>

**Preguntas**

1. ¿Cómo se calcula el valor en aduana en el caso de las bombas compradas FOB?
   - Respuesta marcada como correcta: **FOB + flete internacional + seguro**
   - Explicación: El valor en aduana incluye el precio de la mercancía más el transporte y el seguro hasta el puerto de importación. El IVA se calcula después, sobre esa base.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Qué TRM se usa para convertir el valor en aduana a pesos?
   - Respuesta marcada como correcta: **La vigente el último día hábil de la semana anterior a la presentación y aceptación de la declaración**
   - Explicación: La DIAN aplica la TRM del último día hábil de la semana anterior a la presentación y aceptación de la declaración. Usar la del mismo día es el error más frecuente.
   - [ ] Correcta  [ ] Corregir: 

3. FOB USD 60.000, flete USD 3.500 y seguro USD 300. ¿Cuál es el valor en aduana?
   - Respuesta marcada como correcta: **USD 63.800**
   - Explicación: 60.000 + 3.500 + 300 = USD 63.800.
   - [ ] Correcta  [ ] Corregir: 

4. Si hubieras comprado CIF Cartagena por USD 63.800, ¿qué sumas para llegar al valor en aduana?
   - Respuesta marcada como correcta: **Nada por flete ni seguro: el precio CIF ya los incluye**
   - Explicación: El precio CIF ya trae el flete y el seguro. Sumarlos de nuevo inflaría la base y los tributos. Solo se agregarían otros ajustes de valoración, si existieran.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 6. Tributos aduaneros: arancel e IVA

**Normas citadas**

- [ ] Estatuto Tributario

**Contenido**

Al importar para consumo en Colombia se pagan los tributos aduaneros. En la mayoría de los casos son dos:
- Arancel: Arancel = valor en aduana (pesos) × tarifa de la subpartida. En el caso usamos la tarifa de práctica del 5%.
- IVA: su base es el valor en aduana más el arancel (art. 459 del Estatuto Tributario). La tarifa general es del 19%.
 Base IVA = valor en aduana + arancel
 IVA = base IVA × 19%
 Cada tributo se aproxima al múltiplo de mil más cercano. Se pagan en bancos autorizados antes del levante. Según el producto pueden aparecer otros recargos, como derechos antidumping o salvaguardias. Según la DIAN, esos recargos no hacen parte de la base del IVA, porque no son derechos de aduana (Concepto 626 de 2020).

**Caso de práctica**

Liquidación del embarque (TRM de ejemplo $4.100, arancel de práctica 5%):<br>1. Valor en aduana: USD 63.800 × $4.100 = <strong>$261.580.000</strong><br>2. Arancel (5%): $261.580.000 × 5% = <strong>$13.079.000</strong><br>3. Base del IVA: $261.580.000 + $13.079.000 = $274.659.000<br>4. IVA (19%): $274.659.000 × 19% = $52.185.210 → se aproxima a <strong>$52.185.000</strong><br>5. <strong>Total de tributos: $65.264.000</strong>

**Preguntas**

1. ¿Sobre qué base se liquida el arancel?
   - Respuesta marcada como correcta: **Sobre el valor en aduana convertido a pesos**
   - Explicación: El arancel se aplica al valor en aduana (CIF) en pesos. El IVA se calcula después.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Cuál es la base del IVA de importación?
   - Respuesta marcada como correcta: **El valor en aduana más el arancel**
   - Explicación: El artículo 459 del Estatuto Tributario toma como base del IVA la misma base de los derechos de aduana (el valor en aduana) más esos derechos, es decir, el arancel. Los gastos del puerto no hacen parte, y según la DIAN tampoco los recargos antidumping o de salvaguardia (Concepto 626 de 2020).
   - [ ] Correcta  [ ] Corregir: 

3. La base del IVA es $274.659.000 y el 19% da $52.185.210. ¿Qué valor se declara?
   - Respuesta marcada como correcta: **$52.185.000**
   - Explicación: Cada tributo se aproxima al múltiplo de mil más cercano: 52.185.210 queda en 52.185.000.
   - [ ] Correcta  [ ] Corregir: 

4. Arancel $13.079.000 e IVA $52.185.000. ¿Cuál es el total de tributos?
   - Respuesta marcada como correcta: **$65.264.000**
   - Explicación: 13.079.000 + 52.185.000 = $65.264.000.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 7. Declaración y formularios DIAN

**Normas citadas**

- (ninguna)

**Contenido**

Las bombas se importan en la modalidad de importación ordinaria: quedan en libre disposición en Colombia después de pagar los tributos y obtener el levante.
 Documentos soporte
 Factura comercial, documento de transporte (B/L), lista de empaque, póliza o certificado de seguro, mandato aduanero si actúa una agencia, y los vistos buenos o certificados de origen cuando apliquen. El declarante debe conservarlos durante 5 años.
 Formularios
- Formulario 560 (Declaración Andina del Valor): detalla los elementos de la transacción (precio, fletes, seguros, comisiones, vinculación entre las partes). Es obligatoria cuando el valor FOB es igual o superior a USD 5.000.
- Formulario 500 (declaración de importación): identifica al importador y al declarante, la subpartida, la descripción, el valor en aduana y los tributos liquidados.
 Las declaraciones se presentan de forma electrónica, con firma digital, en los servicios informáticos de la DIAN. Los formularios de BonCloud son simuladores para practicar y no tienen validez ante la DIAN.

**Caso de práctica**

El valor FOB de las bombas es USD 60.000, por encima de USD 5.000, así que se presenta la Declaración Andina del Valor (formulario 560). Luego se elabora y firma la declaración de importación (formulario 500) con $65.264.000 de tributos liquidados, y se archivan los documentos soporte.

**Preguntas**

1. ¿Qué formulario se usa para declarar la importación y liquidar los tributos?
   - Respuesta marcada como correcta: **El formulario 500 (declaración de importación)**
   - Explicación: El formulario 500 es la declaración de importación. El 560 soporta el valor, pero no liquida los tributos.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Cuándo es obligatoria la Declaración Andina del Valor?
   - Respuesta marcada como correcta: **Cuando el valor FOB es igual o superior a USD 5.000**
   - Explicación: La DAV se exige desde USD 5.000 FOB. La vinculación entre las partes es una de las preguntas del formulario, no la condición para presentarlo.
   - [ ] Correcta  [ ] Corregir: 

3. ¿Cuánto tiempo debe conservar el declarante los documentos soporte?
   - Respuesta marcada como correcta: **5 años desde la presentación y aceptación de la declaración**
   - Explicación: El declarante debe conservar los documentos soporte durante 5 años, porque la DIAN puede pedirlos en un control posterior.
   - [ ] Correcta  [ ] Corregir: 

4. ¿Qué documento prueba el contrato de transporte marítimo?
   - Respuesta marcada como correcta: **El conocimiento de embarque (B/L)**
   - Explicación: El B/L lo emite la naviera (o el agente de carga, en el caso de un B/L hijo) y prueba el contrato de transporte.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 8. Nacionalización, levante y retiro en el Puerto de Cartagena

**Normas citadas**

- [ ] Decreto 659 de 2024

**Contenido**

De la llegada a la bodega
- Antes del arribo: el transportador transmite a la DIAN el manifiesto de carga y los documentos de transporte.
- Arribo y descargue: el buque llega al terminal (por ejemplo, Contecar o la SPRC) y se reportan las diferencias entre lo manifestado y lo descargado.
- Almacenamiento: la carga queda en un depósito habilitado bajo control aduanero. Como regla general puede permanecer 1 mes, prorrogable 1 mes más; si no se declara a tiempo, queda en abandono legal.
- Declaración y pago: se presenta la declaración y se pagan los tributos en bancos autorizados.
- Gestión de riesgo de la DIAN:
- Levante automático: se autoriza sin inspección.
- Inspección documental: un funcionario revisa los documentos soporte.
- Inspección física: se revisa la mercancía; puede ser no intrusiva, con escáner.
- Levante: la DIAN autoriza disponer de la mercancía.
- Pago al terminal y retiro: se pagan los servicios a la carga (uso de instalaciones, almacenamiento, manejo del contenedor) y el camión sale del puerto.
- Devolución del contenedor: después de descargarlo en la bodega, se devuelve vacío a la naviera dentro de los días libres; si se pasan, hay cobros por demora.
 Reforma en camino: el Decreto 659 de 2024 prevé volver obligatoria la declaración anticipada. Esas disposiciones empiezan a regir cuando la DIAN certifique sus sistemas informáticos; verifica su estado antes de aplicarlas.

**Caso de práctica**

El buque llega al terminal de Contecar y el contenedor pasa al depósito. Se presenta la declaración, se pagan $65.264.000 de tributos y la DIAN otorga levante automático. HidroColombia paga los servicios del terminal (valor de ejemplo: $450.000), el camión lleva el contenedor a la bodega y, una vez descargado, lo devuelve vacío al patio de la naviera dentro de los días libres.

**Preguntas**

1. ¿Qué significa que la DIAN otorgue levante automático?
   - Respuesta marcada como correcta: **Que autoriza disponer de la mercancía sin inspección**
   - Explicación: El levante automático lo otorga el sistema de gestión de riesgo sin inspección. Si hay inspección documental o física, el levante llega después de ella.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Qué pasa si la mercancía no se declara dentro del término de almacenamiento?
   - Respuesta marcada como correcta: **Queda en abandono legal**
   - Explicación: Vencido el término de almacenamiento (y su prórroga, si se pidió) sin declarar, la mercancía queda en abandono legal.
   - [ ] Correcta  [ ] Corregir: 

3. El contenedor ya se descargó en la bodega de HidroColombia. ¿Qué falta?
   - Respuesta marcada como correcta: **Devolver el contenedor vacío a la naviera dentro de los días libres**
   - Explicación: El contenedor es de la naviera. Si no se devuelve dentro de los días libres, genera cobros por demora.
   - [ ] Correcta  [ ] Corregir: 

4. Si la DIAN ordena inspección física, ¿qué verifica?
   - Respuesta marcada como correcta: **Que la mercancía coincida con lo declarado: naturaleza, cantidad, estado y subpartida**
   - Explicación: La inspección física compara la mercancía con lo declarado. Revisar solo los documentos es la inspección documental.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

## Módulo 2. Exportación y origen

Caso: café tostado colombiano, del Puerto de Cartagena a Hamburgo.

### Lección 9. Exportar desde Colombia: requisitos, modalidades y beneficios

**Normas citadas**

- [ ] Circular DCIP-83
- [ ] Decreto 1165 de 2019
- [ ] Estatuto Tributario
- [ ] Resolución DIAN 46 de 2019

**Contenido**

Exportar es sacar mercancías del territorio aduanero nacional hacia otro país o hacia una zona franca. Lo regula el mismo Decreto 1165 de 2019 (arts. 340 y siguientes) y el declarante es el exportador o la agencia de aduanas que lo represente.
 Requisitos del exportador
- RUT con la responsabilidad 10 (usuario aduanero) y el código 22, exportador, en la casilla 54.
- Firma digital (certificado digital de la DIAN) para firmar la declaración de exportación; quien no lo tiene la firma con asistencia de un funcionario (art. 400 de la Resolución 46 de 2019).
- Vistos buenos cuando el producto o el país de destino los exigen: por ejemplo, certificados sanitarios o fitosanitarios. El comprador en el exterior suele indicar cuáles pide su aduana.
- Para el café hay reglas propias: solo se exporta café que cumpla los requisitos de calidad del Comité Nacional de Cafeteros, que vigila la Federación Nacional de Cafeteros (art. 418), y antes de exportar se paga la contribución cafetera (art. 414).
 Modalidades (art. 343)
 Exportación definitiva; temporal para perfeccionamiento pasivo (por ejemplo, una reparación en el exterior); temporal para reimportación en el mismo estado (ferias o exposiciones); reexportación; reembarque; tráfico postal y envíos urgentes; muestras sin valor comercial; exportaciones temporales de viajeros; menaje; y programas especiales de exportación.
 Tributos y beneficios
- La exportación de bienes no paga arancel en Colombia.
- Los bienes que se exportan son exentos de IVA con derecho a devolución (art. 481 del Estatuto Tributario): el exportador no cobra IVA y puede pedir que le devuelvan el IVA que pagó en sus compras.
- Las divisas de la venta deben canalizarse por el mercado cambiario (bancos o cuentas de compensación) dentro de los seis meses siguientes a su recibo, con la declaración de cambio (Circular DCIP-83 del Banco de la República).

**Caso de práctica**

Café del Caribe Exportadores S.A.S. (empresa ficticia), en Cartagena, le vendió a un distribuidor de Hamburgo 18.000 kg de café tostado en grano (subpartida 0901.21.10.00) a USD 9 por kilo, en términos FOB Cartagena: un valor FOB de USD 162.000 (valores de práctica). Antes de embarcar revisa que su RUT tenga el código 22, que el café cumpla los requisitos de calidad y que la contribución cafetera esté pagada. La factura sale sin IVA, porque la exportación es exenta.

**Preguntas**

1. ¿Qué código debe tener el RUT de una empresa en la casilla 54 para exportar?
   - Respuesta marcada como correcta: **El 22, exportador**
   - Explicación: La casilla 54 registra la calidad de usuario aduanero: 22 es exportador y 23 importador. Además debe tener la responsabilidad 10, usuario aduanero.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Cómo trata el IVA la venta de bienes que se exportan?
   - Respuesta marcada como correcta: **Es exenta, con derecho a que le devuelvan al exportador el IVA que pagó en sus compras**
   - Explicación: El artículo 481 del Estatuto Tributario hace exentos a los bienes que se exportan, con derecho a devolución. Por eso el exportador no cobra IVA y puede recuperar el que pagó.
   - [ ] Correcta  [ ] Corregir: 

3. Una empresa envía una máquina a Alemania para que la reparen y vuelva. ¿Qué modalidad usa?
   - Respuesta marcada como correcta: **Exportación temporal para perfeccionamiento pasivo**
   - Explicación: Cuando la mercancía sale para un proceso de elaboración, transformación o reparación en el exterior y luego regresa, la modalidad es exportación temporal para perfeccionamiento pasivo.
   - [ ] Correcta  [ ] Corregir: 

4. ¿Qué debe hacer el exportador con los dólares que le paga el comprador del exterior?
   - Respuesta marcada como correcta: **Canalizarlos por el mercado cambiario, con la declaración de cambio, dentro de los seis meses siguientes a su recibo**
   - Explicación: La exportación de bienes es una operación de canalización obligatoria: las divisas se canalizan por un intermediario del mercado cambiario o por una cuenta de compensación, con la declaración de cambio (Circular DCIP-83).
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 10. Origen de las mercancías y acuerdos comerciales (TLC)

**Normas citadas**

- [ ] Decreto 1165 de 2019

**Contenido**

Un acuerdo comercial da preferencias arancelarias: un arancel menor, muchas veces del 0%, para las mercancías originarias de los países que lo firmaron. Sin acuerdo, o si la mercancía no prueba su origen, se paga el arancel general de nación más favorecida.
 Colombia tiene acuerdos vigentes, entre otros, con la Comunidad Andina, Mercosur, México, Chile, Estados Unidos, Canadá, la Unión Europea, la AELC (EFTA), Corea, la Alianza del Pacífico, Costa Rica, Israel y el Reino Unido. No tiene acuerdo con China ni con Japón. La lista oficial está en tlc.gov.co.
 Reglas de origen
 Cada acuerdo define cuándo una mercancía es originaria. Los criterios más comunes son:
- Totalmente obtenida: cultivada, cosechada, extraída o criada en el país (por ejemplo, café cultivado y cosechado en Colombia).
- Cambio de clasificación arancelaria: los insumos importados cambian de capítulo, partida o subpartida al transformarse.
- Valor de contenido regional: un porcentaje mínimo del valor se agrega en los países del acuerdo.
- Requisitos específicos por producto: reglas propias para ciertas subpartidas.
 Las operaciones mínimas, como empacar, etiquetar o mezclar, no confieren origen, y la mercancía debe cumplir las condiciones de expedición directa del acuerdo.
 Prueba de origen
- La expide el productor, el exportador o la autoridad competente, según el acuerdo (art. 312 del Decreto 1165 de 2019). En Colombia la autoridad competente es la DIAN, y antes de expedir la prueba se presenta la declaración juramentada de origen.
- Algunos acuerdos usan certificados que expide la autoridad; otros permiten la certificación del exportador, del productor o del importador. Con la Unión Europea se usa el certificado EUR.1 o la declaración de origen de un exportador autorizado.
- Al importar, la prueba de origen es un documento soporte: debe obtenerse antes de presentar la declaración de importación (arts. 177 y 313). Si después no se cumplen las normas de origen, el importador debe pagar los tributos (art. 309).
- Quien la expide y quien pide la preferencia deben conservar los documentos que prueban el origen (art. 317), y la DIAN puede verificar el origen (art. 318).

**Caso de práctica**

La Unión Europea cobra un arancel general del 7,5% al café tostado. Sobre un valor de USD 162.000 serían unos USD 12.150 (allá se calcula sobre su propio valor en aduana, que incluye el flete). Con el Acuerdo Comercial Colombia–UE, el café tostado colombiano entra con arancel del 0% si prueba su origen. La regla del acuerdo exige que el café se haya cultivado y cosechado en los países del acuerdo: Café del Caribe tuesta café colombiano, así que califica. Presenta ante la DIAN la declaración juramentada de origen y solicita la prueba de origen para que su cliente en Hamburgo pida la preferencia. Si tostara café importado de Vietnam, no sería originario.

**Preguntas**

1. ¿Qué necesita una mercancía para recibir el arancel preferencial de un acuerdo comercial?
   - Respuesta marcada como correcta: **Cumplir las reglas de origen del acuerdo y presentar la prueba de origen**
   - Explicación: La preferencia es solo para mercancías originarias. Embarcar en un país del acuerdo no basta: si el producto es de otro país, no califica (art. 309 del Decreto 1165 de 2019).
   - [ ] Correcta  [ ] Corregir: 

2. Una empresa importa tela de un país sin acuerdo y en Colombia la convierte en camisas que exporta a un país con TLC. ¿Qué criterio de origen podría cumplir?
   - Respuesta marcada como correcta: **Cambio de clasificación arancelaria, si el acuerdo lo permite para esa camisa**
   - Explicación: Al confeccionar la camisa, el insumo cambia de clasificación. Si la regla específica del acuerdo acepta ese cambio, la camisa puede ser originaria aunque la tela sea importada.
   - [ ] Correcta  [ ] Corregir: 

3. En Colombia, ¿qué se presenta ante la DIAN antes de que expida una prueba de origen?
   - Respuesta marcada como correcta: **La declaración juramentada de origen**
   - Explicación: El artículo 312 del Decreto 1165 de 2019 exige como soporte la declaración juramentada de origen vigente para que la autoridad o un exportador autorizado expidan la prueba de origen.
   - [ ] Correcta  [ ] Corregir: 

4. Un importador colombiano quiere la preferencia del TLC con Estados Unidos. ¿Cuándo debe tener la prueba de origen?
   - Respuesta marcada como correcta: **Antes de presentar y aceptar la declaración de importación**
   - Explicación: La prueba de origen es un documento soporte de la declaración y debe obtenerse antes de presentarla y aceptarla (arts. 177 y 313 del Decreto 1165 de 2019).
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 11. El trámite de exportación: del embarque a la declaración (DEX)

**Normas citadas**

- [ ] Decreto 1165 de 2019
- [ ] Resolución DIAN 46 de 2019

**Contenido**

Los pasos (arts. 347 a 363 del Decreto 1165 de 2019)
- Solicitud de autorización de embarque (SAE): el exportador o su agencia la presenta en los servicios informáticos de la DIAN, ante la seccional donde está la mercancía. Puede ser un embarque único o una autorización global con embarques fraccionados, con datos definitivos o provisionales.
- Vigencia de un mes: dentro de ese mes la mercancía debe trasladarse e ingresar a la zona primaria (el puerto) y embarcarse. Si vence, hay que presentar una nueva SAE (art. 352).
- Ingreso a zona primaria y gestión de riesgo: la DIAN autoriza el embarque directamente o después de una inspección documental, física o no intrusiva.
- Embarque: se carga la mercancía en el medio de transporte, con la autorización de la aduana.
- Certificación del embarque: el transportador transmite a la DIAN el manifiesto de carga con lo embarcado (art. 362).
- Declaración de exportación (DEX, formulario 600): certificado el embarque, el declarante firma y presenta la declaración que generan los servicios informáticos de la DIAN, en la que se declara el valor FOB (art. 363 y art. 400 de la Resolución 46 de 2019).
 Después de embarcar
- El declarante conserva los documentos soporte (la factura u otro documento de la operación, los vistos buenos y el mandato) durante 5 años desde la aceptación de la SAE (art. 349).
- Canaliza las divisas por el mercado cambiario y, con la DEX, puede tramitar la devolución del IVA de sus compras.

**Caso de práctica**

Café del Caribe presenta la SAE en la Dirección Seccional de Aduanas de Cartagena (48) y tiene un mes para embarcar. El contenedor con el café ingresa al terminal, la DIAN autoriza el embarque sin inspección y la carga sube al buque con destino a Hamburgo. La naviera transmite el manifiesto de carga, con lo que el embarque queda certificado, y Café del Caribe firma y presenta la DEX por USD 162.000 FOB. Luego canaliza los dólares que le gira el comprador y archiva los soportes durante 5 años.

**Preguntas**

1. ¿Con qué trámite empieza una exportación?
   - Respuesta marcada como correcta: **Con la solicitud de autorización de embarque**
   - Explicación: El artículo 347 del Decreto 1165 de 2019 dice que el trámite se inicia con la presentación y aceptación de la solicitud de autorización de embarque. La DEX se presenta al final.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Cuánto tiempo tiene el exportador para ingresar la mercancía a puerto y embarcarla después de aceptada la SAE?
   - Respuesta marcada como correcta: **Un mes**
   - Explicación: La solicitud de autorización de embarque tiene una vigencia de un mes desde su aceptación; si vence, debe tramitarse una nueva (art. 352).
   - [ ] Correcta  [ ] Corregir: 

3. ¿Quién certifica el embarque ante la DIAN?
   - Respuesta marcada como correcta: **El transportador, al transmitir el manifiesto de carga**
   - Explicación: El transportador transmite la información del manifiesto de carga según los embarques autorizados, y con ello el embarque queda certificado (art. 362).
   - [ ] Correcta  [ ] Corregir: 

4. ¿Qué valor se declara en la declaración de exportación?
   - Respuesta marcada como correcta: **El valor FOB**
   - Explicación: En la exportación se declara el valor FOB. Si la venta se pactó en CIF u otro término que incluya flete y seguro, esos conceptos se informan aparte.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

## Módulo 3. Regímenes especiales

Caso: una máquina llenadora de demostración, de Génova a una zona franca y a una feria en Bogotá.

### Lección 12. Modalidades de importación: no todo es importación ordinaria

**Normas citadas**

- [ ] Decreto 1165 de 2019

**Contenido**

En el módulo 1 hiciste una importación ordinaria: la mercancía entra para quedarse de manera indefinida, paga los tributos y queda en libre disposición (art. 173 del Decreto 1165 de 2019). Pero no toda mercancía entra para quedarse, ni toda paga tributos. El artículo 172 enumera doce modalidades de importación, y el decreto regula aparte el régimen de exportación y el de tránsito.
 Las modalidades (art. 172)
- Ordinaria (art. 173): para permanecer de manera indefinida, en libre disposición, con el pago de los tributos aduaneros.
- Con franquicia (art. 193): un tratado, un convenio o una ley exonera total o parcialmente los tributos. La mercancía queda en disposición restringida: para venderla o cambiarle el destino hay que modificar antes la declaración y pagar los tributos exonerados (art. 195).
- Reimportación en el mismo estado (art. 198): vuelve sin pagar tributos la mercancía que se exportó y no se modificó en el exterior. Por regla general, la declaración se presenta dentro del año siguiente a la exportación.
- En cumplimiento de garantía (art. 199): entra sin tributos la mercancía que se reparó en el exterior, o la que reemplaza a una averiada o defectuosa, por la garantía del fabricante o proveedor.
- Temporal para reexportación en el mismo estado (art. 200): entra con los tributos suspendidos y debe volver a salir en un plazo, sin modificaciones.
- Temporal para perfeccionamiento activo y transformación y/o ensamble: para reparar, procesar o ensamblar mercancías.
- Otras: reimportación por perfeccionamiento pasivo, tráfico postal y envíos urgentes, entregas urgentes, viajeros y muestras sin valor comercial.
 Libre disposición o disposición restringida
 Según la modalidad, la mercancía queda en libre o en restringida disposición. En disposición restringida no se puede vender ni destinar a otro fin sin cumplir antes las condiciones de la modalidad. Salvo en la de viajeros, a todas las modalidades se les aplican las reglas de la importación ordinaria, con las excepciones propias de cada una (art. 172).
 Tres preguntas para elegir
- ¿La mercancía se queda en el país o vuelve a salir? Si vuelve a salir sin cambios, una importación temporal evita pagar tributos por algo que no se va a quedar.
- ¿Alguna norma la exonera? Si un tratado, un convenio o una ley concede la exención, procede la franquicia.
- ¿Ya estuvo en Colombia? Si se exportó y regresa igual, o regresa reparada por garantía, hay modalidades que no pagan tributos.

**Caso de práctica**

Andina Pack S.A.S. (empresa ficticia) distribuye en Colombia las máquinas del fabricante italiano Linea Pack S.r.l. (ficticio) y es usuario comercial de una zona franca de la Sabana de Bogotá. Quiere traer una máquina llenadora de botellas de demostración, de USD 80.000 FOB Génova, para mostrarla a sus clientes; todavía no sabe si se venderá en Colombia o en otro país. Con una importación ordinaria pagaría de entrada $86.951.000 de arancel e IVA (valores de práctica: flete USD 4.500, seguro USD 500, arancel de práctica del 5% y TRM de $4.100). Decide no nacionalizarla todavía: la traerá consignada a su nombre a la zona franca y, cuando haya una feria, la sacará con una importación temporal.

**Preguntas**

1. ¿Cuál de estas NO es una modalidad de importación del artículo 172 del Decreto 1165 de 2019?
   - Respuesta marcada como correcta: **Tránsito aduanero**
   - Explicación: El tránsito aduanero no es una modalidad de importación: pertenece al régimen de tránsito (art. 432). Las otras tres están en la lista del artículo 172.
   - [ ] Correcta  [ ] Corregir: 

2. Una empresa colombiana exportó temporalmente una máquina para exhibirla en una feria en Panamá y ahora regresa sin cambios. ¿Qué modalidad usa?
   - Respuesta marcada como correcta: **Reimportación en el mismo estado**
   - Explicación: La mercancía que se exportó y no se modificó en el exterior vuelve sin pagar tributos por la reimportación en el mismo estado (art. 198), si se prueba que es la misma que salió.
   - [ ] Correcta  [ ] Corregir: 

3. ¿Qué significa que una mercancía quede en disposición restringida?
   - Respuesta marcada como correcta: **Que no se puede vender ni cambiar de destino sin cumplir antes las condiciones de la modalidad**
   - Explicación: La disposición restringida limita lo que el importador puede hacer con la mercancía. Por ejemplo, en la franquicia hay que modificar la declaración y pagar los tributos exonerados antes de venderla (art. 195).
   - [ ] Correcta  [ ] Corregir: 

4. Andina Pack no sabe si la llenadora se quedará en Colombia. ¿Por qué no le conviene la importación ordinaria?
   - Respuesta marcada como correcta: **Porque pagaría de entrada el arancel y el IVA de una mercancía que quizá vuelva a salir**
   - Explicación: La importación ordinaria es para mercancía que permanece de manera indefinida y exige pagar los tributos (art. 173). Si la máquina puede volver a salir, hay modalidades que no obligan a pagarlos de entrada.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 13. Tránsito aduanero: del puerto a otra aduana bajo control

**Normas citadas**

- [ ] Decreto 1165 de 2019

**Contenido**

El tránsito aduanero permite transportar por tierra, bajo control aduanero, mercancías de una aduana a otra dentro del país (art. 432 del Decreto 1165 de 2019). La mercancía viaja sin haberse declarado en importación: por eso va precintada y el declarante garantiza los tributos.
 Cuándo se puede pedir (art. 433)
 No es para cualquier carga. Solo se autoriza cuando la mercancía:
- viene consignada o se endosa a un usuario de zona franca, al titular de un depósito privado, o a la Nación y otras entidades públicas;
- se va a someter a transformación y/o ensamble o a una importación temporal para perfeccionamiento activo;
- o viene consignada a un Operador Económico Autorizado (OEA) o a un usuario aduanero con trámite simplificado, casos en los que procede para cualquier modalidad de importación.
 Los pasos
- Solicitud: una vez descargada la mercancía y sin ingresarla a depósito (art. 438), el declarante presenta la declaración de tránsito aduanero (DTA) ante la aduana de partida, en los servicios informáticos de la DIAN (art. 439), soportada en el documento de transporte y en la factura comercial o proforma (art. 440).
- Transportador: el tránsito solo se hace en vehículos de empresas inscritas y autorizadas por la DIAN (art. 434).
- Garantías (art. 436): el declarante respalda los tributos y las sanciones. Una agencia de aduanas lo hace con su garantía global; quien no tiene garantía global constituye una específica por el 40% del valor FOB. El transportador respalda con su garantía global la finalización del tránsito.
- Precintos: la aduana autoriza el tránsito si la unidad de carga viene sellada y precintada. En la aduana de partida no hay inspección, salvo malas condiciones exteriores, diferencias de peso o señales de que se violaron los precintos (art. 443).
- Plazo y ruta: la aduana fija la duración según la distancia (art. 444). El vehículo usa la ruta más directa y los precintos deben llegar intactos (art. 445).
- Finalización (art. 448): el tránsito termina con la entrega de la carga al depósito o al usuario operador de la zona franca, que confronta cantidad, peso y estado de los bultos con la DTA. Si hay inconsistencias, elabora un acta e informa a la aduana.
 Quién responde (art. 435)
 El declarante responde por la información de la DTA y por los tributos de la mercancía que no llegue a la aduana de destino; si es una agencia de aduanas, responde por los tributos en cualquier evento. La empresa transportadora responde por finalizar el tránsito dentro del plazo autorizado.
 Cuando el traslado bajo control aduanero se hace por agua o por aire entre dos puertos o aeropuertos del país, la modalidad se llama cabotaje (art. 454).

**Caso de práctica**

El contenedor con la llenadora llega al Puerto de Cartagena. En el B/L viene consignado a Andina Pack, usuario de zona franca, así que el tránsito procede (art. 433). Su agencia de aduanas presenta la DTA ante la aduana de Cartagena, que es la aduana de partida, sin ingresar la carga a depósito. La aduana verifica que los precintos del contenedor estén intactos, autoriza el tránsito y fija el plazo. Un camión de una transportadora inscrita ante la DIAN lleva el contenedor por la ruta más directa hasta la zona franca, en la jurisdicción de la aduana de Bogotá. Allí el usuario operador revisa precintos, peso y bultos contra la DTA y registra la llegada: el tránsito termina.

**Preguntas**

1. ¿Qué permite la modalidad de tránsito aduanero?
   - Respuesta marcada como correcta: **Transportar por tierra mercancía bajo control aduanero de una aduana a otra dentro del país**
   - Explicación: El artículo 432 del Decreto 1165 de 2019 define el tránsito aduanero como el transporte terrestre de mercancías, bajo control aduanero, de una aduana a otra situadas en el territorio aduanero nacional.
   - [ ] Correcta  [ ] Corregir: 

2. Según el artículo 433, ¿cuál de estas cargas puede ir en tránsito aduanero?
   - Respuesta marcada como correcta: **Un contenedor consignado a un usuario de zona franca**
   - Explicación: El tránsito solo se autoriza en los casos del artículo 433; uno de ellos es la mercancía consignada o endosada a un usuario de zona franca. No basta con que el importador prefiera otra ciudad.
   - [ ] Correcta  [ ] Corregir: 

3. Un declarante sin garantía global pide un tránsito aduanero. ¿Por cuánto debe constituir la garantía específica?
   - Respuesta marcada como correcta: **Por el 40% del valor FOB de la mercancía**
   - Explicación: El artículo 436 exige al declarante una garantía específica equivalente al 40% del valor FOB de la mercancía cuando no cuenta con una garantía global, como la de las agencias de aduanas. La del transportador cubre otra cosa: la finalización del tránsito.
   - [ ] Correcta  [ ] Corregir: 

4. ¿Con qué termina normalmente una operación de tránsito aduanero?
   - Respuesta marcada como correcta: **Con la entrega de la carga al depósito o al usuario operador de la zona franca de destino**
   - Explicación: El artículo 448 dice que la modalidad finaliza con la entrega de la carga al depósito o al usuario operador de la zona franca, que la confronta con la DTA y registra la información en los servicios informáticos.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 14. Zonas francas: dentro del país, fuera del territorio aduanero

**Normas citadas**

- [ ] Decreto 1165 de 2019
- [ ] Decreto 2147 de 2016
- [ ] Ley 1004 de 2005

**Contenido**

Una zona franca es un área geográfica delimitada dentro del territorio nacional donde se desarrollan actividades industriales de bienes y de servicios, o actividades comerciales, con reglas especiales en materia tributaria, aduanera y de comercio exterior. Las mercancías que ingresan a ella se consideran fuera del territorio aduanero nacional para efectos de los impuestos a las importaciones y a las exportaciones (art. 1 de la Ley 1004 de 2005).
 Clases de zonas francas (art. 3 del Decreto 2147 de 2016)
- Permanente: en ella se instalan múltiples usuarios industriales o comerciales.
- Permanente especial: se instala un único usuario industrial.
- Transitoria: el área donde se celebran ferias, exposiciones, congresos y seminarios de importancia para la economía o el comercio internacional.
 Usuarios (art. 3 de la Ley 1004 de 2005)
- Usuario operador: dirige, administra y supervisa la zona franca y califica a sus usuarios. Autoriza todo ingreso y salida de bienes (art. 475 del Decreto 1165 de 2019).
- Usuario industrial de bienes: produce, transforma o ensambla bienes.
- Usuario industrial de servicios: presta servicios como logística, reparación, tecnología o salud.
- Usuario comercial: hace mercadeo, comercialización, almacenamiento o conservación de bienes.
 Las cuatro operaciones (Decreto 1165 de 2019)
- Del exterior a la zona franca: no se considera una importación. Solo se requiere que los bienes vengan consignados en el documento de transporte a un usuario de la zona, o que el documento se endose a su favor (art. 477).
- De la zona franca al exterior: es una exportación, con autorización del usuario operador (art. 478).
- Del resto del país a la zona franca: es una exportación definitiva cuando se trata de materias primas, partes, insumos y bienes terminados nacionales o en libre disposición, a favor del usuario operador o de un usuario industrial. El envío a un usuario comercial no se considera exportación (art. 479).
- De la zona franca al resto del país: es una importación y sigue las reglas de las importaciones (art. 482). La mercancía extranjera almacenada se valora en el estado en que se encuentre y paga el arancel de su subpartida; a la que se fabricó en la zona franca se le descuenta del valor en aduana el valor agregado nacional (art. 483).

**Caso de práctica**

La llenadora queda almacenada en la bodega de Andina Pack en la zona franca. Como vino del exterior consignada a un usuario, su ingreso no fue una importación: no se presentó declaración de importación ni se pagaron arancel ni IVA. Allí puede permanecer mientras aparece un comprador. Si la compra un cliente de otro país, saldrá de la zona franca como una exportación, sin haber pagado tributos en Colombia. Si la compra una planta de Medellín, su salida al resto del país será una importación: en ese momento se declaran y se pagan el arancel y el IVA sobre su valor en aduana.

**Preguntas**

1. Para efectos de los impuestos a las importaciones y a las exportaciones, ¿cómo se consideran las mercancías que ingresan a una zona franca?
   - Respuesta marcada como correcta: **Fuera del territorio aduanero nacional**
   - Explicación: El artículo 1 de la Ley 1004 de 2005 dice que las mercancías ingresadas a la zona franca se consideran fuera del territorio aduanero nacional para efectos de los impuestos a las importaciones y a las exportaciones.
   - [ ] Correcta  [ ] Corregir: 

2. ¿Quién autoriza el ingreso y la salida de bienes de una zona franca?
   - Respuesta marcada como correcta: **El usuario operador**
   - Explicación: El usuario operador debe autorizar todo ingreso y salida de bienes de la zona franca, sin perjuicio de los demás requisitos aduaneros (art. 475 del Decreto 1165 de 2019).
   - [ ] Correcta  [ ] Corregir: 

3. Una fábrica de Cali vende insumos nacionales a un usuario industrial de bienes de una zona franca. ¿Qué es esa operación para la fábrica?
   - Respuesta marcada como correcta: **Una exportación definitiva**
   - Explicación: La introducción a zona franca de materias primas, partes, insumos y bienes terminados nacionales, a favor del usuario operador o de un usuario industrial, se considera exportación definitiva (art. 479). Si el destinatario fuera un usuario comercial, no lo sería.
   - [ ] Correcta  [ ] Corregir: 

4. Una mercancía extranjera almacenada en zona franca se vende a una empresa de Medellín. ¿Qué pasa cuando sale hacia el resto del país?
   - Respuesta marcada como correcta: **Es una importación: se declara y paga los tributos que correspondan**
   - Explicación: La introducción al resto del territorio aduanero nacional de bienes procedentes de zona franca es una importación y se somete a las normas de las importaciones (art. 482 del Decreto 1165 de 2019).
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

### Lección 15. Importación temporal: usar la mercancía sin nacionalizarla

**Normas citadas**

- [ ] Decreto 1165 de 2019
- [ ] Resolución DIAN 46 de 2019

**Contenido**

La importación temporal para reexportación en el mismo estado permite traer mercancía con los tributos aduaneros suspendidos, para reexportarla en un plazo señalado y sin modificaciones, salvo la depreciación normal por el uso. Mientras tanto queda en disposición restringida (art. 200 del Decreto 1165 de 2019). No sirve para mercancías fungibles ni para las que no puedan identificarse plenamente.
 Dos clases (art. 201)
- De corto plazo: para una finalidad específica de corta permanencia, como exhibir mercancía en ferias y exposiciones (la lista está en el art. 232 de la Resolución 46 de 2019). El plazo máximo es de seis meses desde el levante, prorrogables por tres más. Los tributos se liquidan en la declaración, pero no se pagan (art. 202).
- De largo plazo: para bienes de capital, con sus piezas y accesorios. El plazo máximo es de cinco años. Los tributos se liquidan en dólares y se pagan en cuotas semestrales iguales, por semestres vencidos (art. 203).
 Garantía (art. 205)
 La aduana exige una garantía a favor de la Nación que respalda la finalización de la modalidad, con los tributos, los intereses y la sanción a que haya lugar: por regla general es del 150% de los tributos, y en el corto plazo, del 100% de los tributos que se habrían causado en una importación ordinaria. No se exige para mercancías destinadas a eventos científicos, culturales, deportivos o recreativos.
 Cómo termina (art. 214)
- Con la reexportación, que se tramita como una exportación: solicitud de autorización de embarque y declaración (arts. 380 y 381). Los bienes de capital también pueden reexportarse a una zona franca, a nombre de un usuario industrial o comercial (art. 480).
- Con la importación ordinaria o con franquicia: antes de que venza el plazo se modifica la declaración, se pagan los tributos y se obtiene el levante (art. 208).
- Con la modificación de oficio a importación ordinaria que hace la DIAN por incumplimiento, con la destrucción de la mercancía por fuerza mayor o caso fortuito demostrados, o con su legalización.
 Si se vence el plazo (art. 208)
 En el corto plazo, si la mercancía no se reexporta ni se modifica la declaración a tiempo, se aprehende y la garantía se hace efectiva por los tributos y la sanción, a menos que el importador la legalice voluntariamente pagando los tributos y la sanción.

**Caso de práctica**

Andina Pack exhibirá la llenadora durante tres meses en una feria industrial en Bogotá, donde no puede venderse mientras dure el evento. Sacarla de la zona franca al resto del país es una importación, así que presenta una declaración de importación temporal de corto plazo por tres meses. En ella liquida el arancel de práctica del 5% ($17.425.000) y el IVA del 19% ($69.526.000) sobre un valor en aduana de USD 85.000 a una TRM de $4.100, pero no los paga: quedan suspendidos $86.951.000 y constituye una garantía por ese mismo valor. Al terminar la feria, antes de que venza el plazo, reexporta la máquina a la zona franca a nombre de Andina Pack, porque es un bien de capital (art. 480): la modalidad termina sin pagar tributos. Si hubiera decidido dejarla en el país, habría tenido que modificar la declaración a importación ordinaria y pagar los tributos antes del vencimiento.

**Preguntas**

1. ¿Qué pasa con los tributos aduaneros en una importación temporal de corto plazo?
   - Respuesta marcada como correcta: **Se liquidan en la declaración, pero no se pagan: quedan suspendidos y respaldados con una garantía**
   - Explicación: En la declaración de importación temporal de corto plazo se liquidan los tributos para constituir la garantía, pero no se pagan (art. 202 del Decreto 1165 de 2019).
   - [ ] Correcta  [ ] Corregir: 

2. ¿Cuál es el plazo máximo de una importación temporal de corto plazo?
   - Respuesta marcada como correcta: **Seis meses desde el levante, prorrogables por tres meses más**
   - Explicación: El artículo 201 fija para el corto plazo un máximo de seis meses contados desde el levante, prorrogables por tres meses más. Los cinco años son el máximo del largo plazo.
   - [ ] Correcta  [ ] Corregir: 

3. Una constructora trae una grúa, que es un bien de capital, en importación temporal de largo plazo por tres años. ¿Cómo paga los tributos?
   - Respuesta marcada como correcta: **En cuotas semestrales iguales, por semestres vencidos**
   - Explicación: En el largo plazo los tributos se liquidan en dólares y se distribuyen en cuotas semestrales iguales durante el término de permanencia, que se pagan por semestres vencidos (art. 203).
   - [ ] Correcta  [ ] Corregir: 

4. Faltan pocos días para que venza el plazo y Andina Pack decide dejar la máquina en Colombia. ¿Qué debe hacer?
   - Respuesta marcada como correcta: **Modificar la declaración a importación ordinaria, pagar los tributos y obtener el levante antes del vencimiento**
   - Explicación: El artículo 208 exige que, antes de que venza el plazo, el importador modifique la declaración de importación temporal a ordinaria y obtenga el levante, o reexporte la mercancía. Si no lo hace, en el corto plazo la mercancía se aprehende y la garantía se hace efectiva.
   - [ ] Correcta  [ ] Corregir: 

- [ ] Lección revisada

