// Textos legales de BonCloud. Son una versión preliminar redactada para el proyecto: deben
// ser revisados por un abogado antes de vender el servicio. Al cambiarlos hay que subir
// VERSION, porque queda guardada con la aceptación de cada usuario.
export const VERSION = '2026-11';
// Correo de contacto para ejercer derechos sobre los datos (VITE_CONTACTO_EMAIL al compilar)
export const CONTACTO = import.meta.env.VITE_CONTACTO_EMAIL || '';
const contacto = CONTACTO ? `escribiendo a ${CONTACTO}` : 'por medio de su profesor o de la institución que le dio acceso';

export const terminos = {
  titulo: 'Términos de uso',
  secciones: [
    ['1. Qué es BonCloud', [
      'BonCloud es una plataforma educativa de comercio exterior. Ofrece una ruta de aprendizaje con lecciones y evaluaciones, calculadoras, material de consulta y simuladores de formularios aduaneros.',
    ]],
    ['2. Alcance educativo', [
      'El contenido es educativo. No constituye asesoría legal, tributaria, aduanera ni cambiaria, y no reemplaza la normativa vigente ni el criterio de una agencia de aduanas o de un profesional.',
      'Los valores de práctica (aranceles, fletes, tasas de cambio) son ejemplos. Antes de una operación real, consulte las fuentes oficiales.',
      'Los simuladores reproducen formularios de la DIAN con fines de enseñanza. No tienen validez ante la DIAN ni ante ninguna otra autoridad, y no deben presentarse como documentos oficiales. BonCloud no está afiliado a la DIAN ni cuenta con su aval.',
    ]],
    ['3. Cuentas', [
      'Para guardar su progreso, presentar exámenes y obtener certificados necesita una cuenta. Usted responde por la veracidad de los datos que registra y por mantener en reserva su contraseña.',
      'Podemos suspender una cuenta que se use para hacer trampa en las evaluaciones, para acceder a datos de otras personas o para afectar el servicio.',
    ]],
    ['4. Evaluaciones y certificados', [
      'Los certificados acreditan que el titular aprobó los exámenes de la plataforma. No son títulos académicos ni certificaciones oficiales de ninguna entidad pública.',
      'Cualquier persona puede comprobar un certificado con su código en la página de verificación, donde se muestran el nombre del titular, la nota y la fecha.',
    ]],
    ['5. Grupos e instituciones', [
      'Si usted se une a un grupo con el código de un profesor, ese profesor podrá ver su nombre, su correo, las lecciones que apruebe y sus notas. Puede salir del grupo cuando quiera desde su perfil.',
    ]],
    ['6. Propiedad intelectual', [
      'Los textos, casos de práctica, ilustraciones y el software de BonCloud pertenecen a sus autores. Puede usarlos para su aprendizaje personal o para sus clases; no puede revenderlos ni redistribuirlos sin autorización.',
    ]],
    ['7. Disponibilidad y responsabilidad', [
      'Procuramos que el servicio funcione y que el contenido esté al día, pero no garantizamos que esté libre de errores ni disponible sin interrupciones. En la medida que la ley lo permita, BonCloud no responde por decisiones tomadas con base en el contenido educativo.',
    ]],
    ['8. Cambios', [
      'Podemos actualizar estos términos. Si el cambio es importante, se lo informaremos en la plataforma. La versión vigente es la publicada en esta página.',
    ]],
    ['9. Ley aplicable', [
      'Estos términos se rigen por las leyes de la República de Colombia.',
    ]],
  ],
};

export const privacidad = {
  titulo: 'Política de tratamiento de datos personales',
  secciones: [
    ['1. Responsable', [
      `BonCloud, proyecto educativo con sede en Cartagena, Colombia, es responsable del tratamiento de sus datos. Puede contactarnos ${contacto}.`,
      'Esta política se rige por la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015).',
    ]],
    ['2. Qué datos tratamos', [
      'Datos de la cuenta: nombre, correo electrónico y contraseña (guardada cifrada de forma irreversible; nadie puede leerla).',
      'Datos de aprendizaje: lecciones aprobadas, notas e intentos de los quizzes y de los exámenes, certificados y grupos a los que pertenece.',
      'Datos técnicos: fecha de registro y de último ingreso, e intentos fallidos de inicio de sesión, para proteger la cuenta.',
      'No pedimos datos sensibles ni datos de pago. Quien entra como invitado no entrega datos: su avance se guarda solo en su navegador y se borra al salir.',
    ]],
    ['3. Para qué los usamos', [
      'Para darle acceso, guardar su progreso, calificar sus evaluaciones y emitir y verificar sus certificados.',
      'Para que el profesor de un grupo al que usted se unió haga seguimiento de su avance.',
      'Para enviarle correos del servicio: confirmar su correo y restablecer su contraseña. No enviamos publicidad.',
    ]],
    ['4. Con quién se comparten', [
      'Con el profesor de cada grupo al que usted se una, y solo mientras pertenezca a él.',
      'Con quien tenga el código de su certificado, que ve su nombre, la nota y la fecha.',
      'Con los proveedores que alojan el servicio y envían los correos (hoy Render, GitHub Pages y Resend), que actúan como encargados y pueden almacenar los datos fuera de Colombia.',
      'No vendemos ni cedemos sus datos a terceros para fines comerciales.',
    ]],
    ['5. Sus derechos', [
      'Usted puede conocer, actualizar y rectificar sus datos, pedir prueba de la autorización, saber qué uso se les ha dado, revocar la autorización y pedir que se supriman, y presentar quejas ante la Superintendencia de Industria y Comercio.',
      'Desde «Mi perfil» puede hacerlo directamente: cambiar su nombre y su contraseña, descargar una copia de todos sus datos y eliminar su cuenta. Al eliminarla se borran su progreso, sus notas, sus exámenes y su certificado.',
      `Para cualquier otra consulta o reclamo puede contactarnos ${contacto}. Responderemos en los plazos de la ley: diez días hábiles las consultas y quince días hábiles los reclamos.`,
    ]],
    ['6. Menores de edad', [
      'La plataforma está dirigida a estudiantes de educación superior y a adultos. Si un menor de edad la usa, debe hacerlo con autorización de sus padres o de su representante.',
    ]],
    ['7. Conservación y seguridad', [
      'Conservamos sus datos mientras su cuenta exista. Protegemos el acceso con contraseñas cifradas, conexiones seguras y bloqueo de cuentas tras varios intentos fallidos.',
    ]],
    ['8. Vigencia', [
      'Esta política rige desde su publicación. Los cambios importantes se informarán en la plataforma.',
    ]],
  ],
};
