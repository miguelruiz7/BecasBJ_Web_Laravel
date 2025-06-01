
/**
 * Carga una página o contenido dinámicamente en un contenedor específico del DOM.
 *
 * Construye la URL de la página, opcionalmente añadiendo parámetros. Determina el ID del contenedor
 * donde se cargará el contenido, usando 'contenedorPrincipal' por defecto o un nombre
 * compuesto basado en el parámetro `contenedor`. Luego, realiza una petición AJAX
 * para obtener el contenido y lo inserta en el contenedor.
 *
 * @param {string} nombrePagina El nombre base de la página o la ruta a cargar (ej. 'usuarios', 'productos/lista').
 * @param {string|number|null} [parametros=null] Parámetros opcionales que se añadirán a la URL codificados.
 * @param {string|null} [contenedor=null] El nombre base del contenedor HTML donde se insertará el contenido.
 * Si es `null`, se usa 'contenedorPrincipal'. El ID final del contenedor
 * será 'contenedor' + `contenedor` en minúsculas.
 * @returns {void} Esta función no retorna ningún valor explícito; su efecto es en el DOM.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
 */
function cargarPagina(nombrePagina, parametros = null, contenedor = null) {
  let url = nombrePagina;
  if (parametros) {
    url += `/${encodeURIComponent(parametros)}`;
  }
  const nombrePaginaBase = url.split('/')[0];
  /* const contenedorFinal = contenedor
    ? `contenedor${nombrePaginaBase.charAt(0).toUpperCase() + nombrePaginaBase.slice(1).toLowerCase()}`
    : 'contenedorPrincipal'; */
  /*   const contenedorFinal = contenedor
      ? `contenedor${contenedor.charAt(0).toUpperCase() + contenedor.slice(1).toLowerCase()}`
      : 'contenedorPrincipal'; */

  const contenedorFinal = contenedor
    ? `contenedor${contenedor.toLowerCase()}`
    : 'contenedorPrincipal';
  console.log(contenedorFinal);
  const datos = {
    _token: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
  };
  hacerPeticion(url, datos, contenedorFinal);
}

/**
 * Separa una URL en sus componentes de módulo y página.
 *
 * Esta función toma una cadena de URL, elimina las barras diagonales iniciales o finales,
 * y luego la divide en partes usando la barra diagonal como delimitador.
 * Retorna un objeto con las propiedades `modulo` y `pagina` que representan
 * el primer y segundo segmento de la URL, respectivamente.
 *
 * @param {string} url La cadena de URL a separar.
 * @returns {{modulo: string, pagina: string}} Un objeto que contiene el módulo y la página extraídos de la URL.
 * @example
 * // Ejemplo de uso:
 * separarUrl('/sistemas/usuarios');
 * // Retorna: { modulo: 'sistemas', pagina: 'usuarios' }
 *
 * separarUrl('ajustes');
 * // Retorna: { modulo: 'ajustes', pagina: '' }
 *
 * separarUrl('/gestion/');
 * // Retorna: { modulo: 'gestion', pagina: '' }
 */

function separarUrl(url) {
  const partes = url.replace(/^\/|\/$/g, '').split('/');
  return {
    modulo: partes[0] || '',
    pagina: partes[1] || '',
  };
}

/**
 * Realiza una petición AJAX POST para cargar contenido HTML en un contenedor específico del DOM.
 *
 * Construye la URL final de la petición basándose en una URL de base (`base-url` meta tag o el origen de la ventana).
 * Envía una petición POST y, si es exitosa, inserta el HTML recibido en el contenedor especificado.
 * También actualiza la meta etiqueta 'pagina' y el título de la página HTML. En caso de error,
 * muestra un mensaje utilizando la función `muestraMensajes`.
 *
 * @param {string} url_ La URL relativa o absoluta a la que se realizará la petición.
 * @param {object} datos Un objeto que contiene los datos a enviar con la petición (incluyendo el token CSRF).
 * @param {string} contenedor El ID del elemento HTML donde se insertará el contenido recibido.
 * @returns {void} Esta función no retorna ningún valor explícito; sus efectos son en el DOM y la interfaz de usuario.
  * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
 */
function hacerPeticion(url_, datos, contenedor) {
  const baseUrl = $('meta[name="base-url"]').attr('content') || window.location.origin;
  const urlFinal = url_.startsWith(baseUrl) ? url_ : `${baseUrl}/${url_}`;
  $.ajax({
    url: urlFinal,
    method: 'POST',
    dataType: 'html',
    data: datos,
    success: (data) => {
      $(`#${contenedor}`).html(data);

      $('meta[name="pagina"]').attr('content', url_);
      const titulo = $('#tituloPagina').text();
      document.title = `${titulo} | ThinkIT`;
    },
    error: (error) => {
      muestraMensajes(erroresPagina(error.status), 'error');
    },
  });
}




/**
 * Envía datos de un formulario a una ruta de clase en el servidor y maneja la respuesta.
 *
 * Esta función deshabilita el botón de envío para evitar envíos duplicados.
 * Identifica el formulario a enviar (por su ID o el primer formulario en la página),
 * recolecta sus datos con `FormData`, y construye la URL de destino.
 *
 * Realiza una petición AJAX de tipo POST. Si la petición es exitosa:
 * - Revierte el estado del formulario (`revertirFormulario()`).
 * - Ejecuta un proceso (`eval(response.proceso)`) si viene especificado en la respuesta.
 * - Gestiona el cierre y apertura de modales si están presentes (`#formulariomodal_`, `#formulariomodal`).
 * - Recarga la página principal o un contenedor específico si `pagina` está definida en los metadatos.
 * - Muestra un mensaje de éxito (`muestraMensajes()`).
 * Si hay errores de validación, los maneja llamando a `manejarErroresFormulario()`.
 * En caso de cualquier otro error de la petición, habilita el botón de envío y muestra un mensaje de error.
 *
 * @param {string|null} [clase=null] El ID del formulario a enviar. Si es `null`, se usa el primer formulario encontrado.
 * @param {Array<string>} [camposExc=[]] Un arreglo de nombres de campos que deben ser excluidos del procesamiento de errores (no se utiliza directamente en esta función, pero podría ser un remanente o para uso futuro).
 * @returns {void} Esta función no retorna un valor; sus efectos son en la interfaz de usuario y la comunicación con el servidor.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com> 
*/
function cargarClases(clase = null, camposExc = []) {
  $('#btnEnviar').prop('disabled', true);

  const formulario = clase ? $(`#${clase}`) : $('form');
  const formularioCheck = formulario.attr('id');
  const pagina = $('meta[name="pagina"]').attr('content');
  const baseUrl = $('meta[name="base-url"]').attr('content') || window.location.origin;

  if (formulario.length) {
    const formData = new FormData(formulario[0]);
    const urlFinal = `${baseUrl.replace(/\/$/, '')}/func/${formularioCheck}`;

    $.ajax({
      url: urlFinal,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: (response) => {
        if (response.success) {
          revertirFormulario();
          limpiarCampos(formularioCheck);

          if (response.vista) {
            
            $('#detallesBecario').html(response.vista);
            $('#btnEnviar').prop('disabled', false);

          } else {
            console.warn('No se recibió una vista válida:', response);
          }

          muestraMensajes(response.mensaje);
        } else {
          muestraMensajes(response.mensaje);
          manejarErroresFormulario(formularioCheck, response.errores, response.correctos);
        }
      },
      error: (error) => {
        $('#btnEnviar').prop('disabled', false);
        muestraMensajes(erroresPagina(error.status));
      },
    });
  } else {
    $('#btnEnviar').prop('disabled', false);
    alert('No se encontró el formulario.');
  }
}




/**
 * Envía datos de un formulario para procesar un archivo (subida o descarga) y maneja la respuesta.
 *
 * Esta función deshabilita el botón de envío para evitar envíos duplicados.
 * Identifica el formulario a enviar (por su ID o el primer formulario encontrado),
 * recolecta sus datos con `FormData`, y construye la URL de destino.
 *
 * Realiza una petición `fetch` de tipo POST. Maneja diferentes tipos de respuesta:
 * - **Si la respuesta es JSON**:
 * - Si `success` es `false`, muestra un mensaje de error y maneja los errores del formulario (`manejarErroresFormulario()`).
 * - Si `success` es `true`, muestra un mensaje de éxito.
 * - **Si la respuesta no es JSON (se asume que es un archivo para descarga)**:
 * - Verifica si la respuesta HTTP fue exitosa.
 * - Extrae el nombre del archivo del encabezado `Content-Disposition`.
 * - Crea un `Blob` del cuerpo de la respuesta y genera una URL de objeto.
 * - Crea un enlace temporal (`<a>`), simula un clic para iniciar la descarga, y luego limpia el enlace y la URL del objeto.
 * - Muestra un mensaje de éxito por la descarga del archivo.
 *
 * En caso de cualquier error durante la petición o el procesamiento de la respuesta,
 * muestra un mensaje de error. Finalmente, habilita el botón de envío.
 *
 * @param {string|null} [clase=null] El ID del formulario a enviar. Si es `null`, se usa el primer formulario encontrado.
 * @returns {void} Esta función no retorna un valor; sus efectos son en la interfaz de usuario y la descarga de archivos.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com> 
*/
function cargarClasesArchivo(clase = null) {
  $('#btnEnviar').prop('disabled', true);

  const formulario = clase ? $(`#${clase}`) : $('form');
  const formularioCheck = formulario.attr('id');
  const baseUrl = $('meta[name="base-url"]').attr('content') || window.location.origin;
  const urlFinal = `${baseUrl.replace(/\/$/, '')}/func/${formularioCheck}`;

  if (formulario.length) {
    const formData = new FormData(formulario[0]);

    fetch(urlFinal, {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        const contentType = response.headers.get('Content-Type') || '';


        if (contentType.includes('application/json')) {
          const json = await response.json();

          if (json.success === false) {
            muestraMensajes(json.mensaje || 'Verifica el error.');
            manejarErroresFormulario(formularioCheck, json.errores || {}, json.correctos || []);
            throw new Error('Validación fallida');
          }

          muestraMensajes(json.mensaje || 'Operación completada.');
          return;
        }


        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }


        const disposition = response.headers.get('Content-Disposition');
        let filename = 'archivo_descargado';

        if (disposition && disposition.includes('filename=')) {
          filename = disposition.split('filename=')[1].replace(/["']/g, '');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        muestraMensajes('Archivo descargado correctamente.');
      })
      .catch((error) => {
        muestraMensajes(`${json.mensaje}`);
      })
      .finally(() => {
        $('#btnEnviar').prop('disabled', false);
      });
  } else {
    $('#btnEnviar').prop('disabled', false);
    alert('No se encontró el formulario.');
  }
}

/**
 * Maneja y muestra los errores de validación de un formulario, resaltando los campos incorrectos
 * y eliminando el resaltado de los campos correctos.
 *
 * Esta función:
 * 1. Habilita el botón de envío (`#btnEnviar`).
 * 2. Limpia cualquier estado de error previo de los campos del formulario.
 * 3. Itera sobre el objeto `errores` para cada campo con problemas de validación:
 * - Formatea la clave del campo para que coincida con los selectores de nombre HTML (ej. `campo[0][subcampo]`).
 * - Marca el campo (`<input>`, `<select>`, `<textarea>`) con la clase `is-invalid` (y remueve `is-valid`).
 * - Inserta los mensajes de error en un elemento con el ID `e_` seguido de la clave formateada del campo.
 * - Suma el número total de errores.
 * 4. Itera sobre el objeto `camposCorrectos` para cada campo que pasó la validación:
 * - Formatea la clave del campo de manera similar a los errores.
 * - Marca el campo con la clase `is-valid` (y remueve `is-invalid`).
 * - Borra cualquier mensaje de error previo asociado a ese campo.
 * - Suma el número total de campos correctos.
 *
 * Esta función es crucial para proporcionar retroalimentación visual al usuario sobre qué campos
 * necesitan corrección en un formulario.
 *
 * @param {string} formularioCheck El ID del formulario que se está validando.
 * @param {object} [errores={}] Un objeto donde las claves son los nombres de los campos con errores y los valores son arreglos de mensajes de error.
 * @param {object} [camposCorrectos={}] Un objeto (o array, dependiendo de la implementación) de los nombres de los campos que pasaron la validación.
 * @returns {void} No retorna ningún valor; modifica directamente el DOM.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com> 
*/
function manejarErroresFormulario(formularioCheck, errores = {}, camposCorrectos = {}) {
  $('#btnEnviar').prop('disabled', false);
  limpiarCampos(formularioCheck);

  let totalErrores = 0;
  let totalAcertados = 0;

  console.log(`Campos con errores: ${JSON.stringify(errores, null, 2)}`);

  Object.entries(errores).forEach(([key, erroresCampo]) => {
    let keyFormateadoFormulario = key
      .replace(/\.(\d+)\./g, '[$1][')
      .replace(/\.(\w+)$/g, '[$1]')
      .replace(/\[(\d+)\](\w+)/g, '[$1][$2]')
      .replace(/([^\[\]]+)\[([^\]]+)$/, '$1[$2]');

    if (keyFormateadoFormulario.match(/\[[^\]]*$/)) {
      keyFormateadoFormulario += ']';
    }

    if (key.endsWith('[]')) {
      keyFormateadoFormulario += '[]';
    }


    let campoEscapado = keyFormateadoFormulario.replace(/([[\]])/g, '\\$1');


    let idEscapado = keyFormateadoFormulario.replace(/([[\].#])/g, '\\$1');
    let $campo = $(`[name="${campoEscapado}"], #${idEscapado}`);

    $campo.removeClass('is-valid').addClass('is-invalid');

    const keyFormateado = key
      .replace(/\.(\d+)\./g, '_$1_')
      .replace(/\[(\d+)\]/g, '_$1_')
      .replace(/\[\]/g, '');

    totalErrores += erroresCampo.length;

    // Mostrar mensajes de error
    $(`#e_${keyFormateado}`).html(erroresCampo.join(', '));
  });

  console.log(`Campos correctos: ${JSON.stringify(camposCorrectos, null, 2)}`);

  Object.entries(camposCorrectos).forEach(([key, campo]) => {

    let partes = campo.split('.');
    let keyFormateadoFormularioValido = partes[0] + partes.slice(1).map(p => `[${p}]`).join('');

    console.log(`El campo sin escapar para clasificar el formulario como valido: ${keyFormateadoFormularioValido}`);

    let $campo = $(`[name="${keyFormateadoFormularioValido}"], #${keyFormateadoFormularioValido}`);
    $campo.removeClass('is-invalid').addClass('is-valid');

    const keyFormateado = key
      .replace(/\.(\d+)\./g, '_$1_')
      .replace(/\[(\d+)\]/g, '_$1_')
      .replace(/\[\]/g, '');

    $(`#e_${keyFormateado}`).html('');

    totalAcertados++;
  });


  console.log(`Errores: ${totalErrores} | Correctos: ${totalAcertados}`);
}



/**
 * Limpia los indicadores de validación (clases CSS) y los mensajes de error de los campos dentro de un formulario específico.
 *
 * Esta función busca un formulario por su ID. Si lo encuentra, itera sobre todos sus
 * elementos de entrada (`<input>`, `<select>`, `<textarea>`). Para cada campo:
 * - Construye un ID formateado para el elemento donde se muestran los errores (`#e_nombreCampo`).
 * - Borra cualquier contenido HTML dentro de ese elemento (eliminando así el mensaje de error).
 * - Remueve las clases CSS `is-valid` e `is-invalid` del campo, restaurando su apariencia original.
 *
 * Esta función es útil para resetear el estado visual de un formulario después de un envío
 * exitoso o antes de una nueva validación.
 *
 * @param {string} formulario El ID del formulario cuyos campos se desean limpiar.
 * @returns {void} No retorna ningún valor; su efecto es la modificación del DOM.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com>
*/
function limpiarCampos(formulario) {
  const $form = $(`#${formulario}`);
  if ($form.length === 0) {
    console.warn(`Formulario con ID "${formulario}" no encontrado.`);
    return;
  }

  $form.find('input, select, textarea').each(function () {
    let campoEscapado = this.name
      .replace(/\./g, '_')
      .replace(/\[([^\]]*)\]/g, '_$1');

    campoEscapado = campoEscapado.replace(/_$/, '');

    $(`#e_${campoEscapado}`).html('');

    /*   console.log(`El campo escapadado para resetear el formulario es: #e_${campoEscapado}`);
   */
    $(this).removeClass('is-valid is-invalid');
  });
}

/**
 * Muestra un mensaje de notificación (toast) en la interfaz de usuario.
 *
 * Esta función toma un mensaje de alerta y lo inserta en el elemento HTML con ID `mensaje`.
 * Luego, activa y muestra un componente toast (probablemente de Bootstrap) y lo configura
 * para que aparezca gradualmente, permanezca visible por 3 segundos y luego se desvanezca.
 *
 * @param {string} alerta El mensaje HTML o de texto que se mostrará en la notificación.
 * @returns {void} No retorna ningún valor; su efecto es la visualización de una notificación.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com> 
*/
function muestraMensajes(alerta) {
  $('#mensaje').html(alerta);
  $('.toast').toast('show');
  $('#notificaciones').fadeIn(300).delay(3000).fadeOut(300);
}

/**
 * Revierte el estado de los contenedores de formularios a un estado inicial con un spinner de carga.
 *
 * Esta función está diseñada para limpiar el contenido de los contenedores `#contenedorFormularios1`
 * y `#contenedorFormularios2` y reemplazarlos con un indicador visual de carga (un spinner).
 * Esto es útil después de un envío de formulario exitoso o al inicio de una operación
 * que va a recargar contenido en esos contenedores, proporcionando una mejor experiencia de usuario.
 *
 * @returns {void} No retorna ningún valor; su efecto es la modificación del DOM.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com> 
*/
function revertirFormulario() {
  const spinner = `
    <div class="container text-center">
      <div class="spinner-border text-center" role="status"></div>
    </div>`;
  $('#contenedorFormularios1').html(spinner);
  $('#contenedorFormularios2').html(spinner);
}

/**
 * Traduce un código de error HTTP a un mensaje descriptivo en español.
 *
 * Esta función toma un código numérico HTTP y retorna una cadena de texto
 * que explica el significado común de ese error. Si el código no está mapeado,
 * devuelve un mensaje genérico de 'Error desconocido'.
 *
 * @param {number} codigo El código de error HTTP (ej., 404, 500).
 * @returns {string} El mensaje descriptivo del error.
 * @author Miguel Ruiz Zamora <miguelruizzamora7@gmail.com> 
*/
function erroresPagina(codigo) {
  const errores = {
    0: 'Sin conexión a red, o el servidor se encuentra fuera de servicio',
    404: 'Página no encontrada',
    403: 'Acceso prohibido',
    405: 'Método no permitido',
    419: 'La sesión ha expirado',
    422: 'Contenido no procesable. Verifique extensión o tamaño permitido',
    500: 'Error interno del servidor',
    503: 'Servicio no disponible temporalmente',
  };
  return errores[codigo] || 'Error desconocido';
}


    function recargarCaptcha() {
        hcaptcha.reset();
    }
