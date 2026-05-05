/* =========================================================
   ProyectoGS - JsMensajes.js
   Mensajes reutilizables con SweetAlert2
   Compatible con funciones antiguas
   Requiere SweetAlert2
   ========================================================= */

window.PGS_MENSAJES_CONFIG = window.PGS_MENSAJES_CONFIG || {
  logoUrl: 'https://drive.google.com/thumbnail?sz=100&id=1DdE8XWaXG7kaIwc8wrDPSGoag7qdP2xF',
  posicion: 'top-center',
  tiempoExito: 1800,
  tiempoAdvertencia: 2500,
  tiempoError: 3200,
  colorConfirmar: '#0d6efd',
  colorCancelar: '#6c757d',
  colorEliminar: '#dc3545'
};

function configurarMensajes(config = {}) {
  window.PGS_MENSAJES_CONFIG = {
    ...window.PGS_MENSAJES_CONFIG,
    ...config
  };
}

function pgsExisteSwal() {
  return typeof Swal !== 'undefined';
}

function pgsGetBoton(boton) {
  if (!boton) return null;
  return typeof boton === 'string' ? document.getElementById(boton) : boton;
}

/* =========================================================
   ALERTAS GENÉRICAS
   ========================================================= */

/**
 * MENSAJE GENÉRICO.
 * Compatible con tu función anterior.
 *
 * Ejemplos:
 * mostrarAlerta('success', '¡Éxito!', 'Registro guardado', true);
 * mostrarAlerta('error', 'Error', 'No se pudo guardar', 3000);
 */
function mostrarAlerta(icono, titulo, texto, tiempo = true) {
  if (!pgsExisteSwal()) {
    alert(`${titulo}\n${texto}`);
    return;
  }

  let timer;

  if (tiempo === true) {
    timer = window.PGS_MENSAJES_CONFIG.tiempoExito;
  } else if (typeof tiempo === 'number') {
    timer = tiempo;
  } else {
    timer = undefined;
  }

  Swal.fire({
    position: window.PGS_MENSAJES_CONFIG.posicion,
    icon: icono,
    title: titulo,
    text: texto,
    showConfirmButton: false,
    timer: timer
  });
}

function msgExito(texto = 'Operación realizada exitosamente', titulo = '¡Operación Exitosa!') {
  mostrarAlerta('success', titulo, texto, window.PGS_MENSAJES_CONFIG.tiempoExito);
}

function msgError(texto = 'No se pudo completar la operación', titulo = 'Error') {
  mostrarAlerta('error', titulo, texto, window.PGS_MENSAJES_CONFIG.tiempoError);
}

function msgAdvertencia(texto = 'Revise la información ingresada', titulo = 'Atención') {
  mostrarAlerta('warning', titulo, texto, window.PGS_MENSAJES_CONFIG.tiempoAdvertencia);
}

function msgInfo(texto = 'Información', titulo = 'Información') {
  mostrarAlerta('info', titulo, texto, 2500);
}

/* Alias compatibles con nombres usados en algunos proyectos */
function msgSatisfactorio(texto = 'Operación realizada exitosamente') {
  msgExito(texto);
}

function msgErrorServidor(error, textoBase = 'No se pudo completar la operación') {
  const detalle = error && error.message ? error.message : error;
  msgError(`${textoBase}${detalle ? ': ' + detalle : ''}`);
}

/* =========================================================
   SPINNERS / PROCESANDO
   ========================================================= */

/**
 * Spinner genérico.
 * Compatible con tu función anterior:
 * mostrarSpinner(boton, texto)
 */
function mostrarSpinner(boton, texto) {
  const btn = pgsGetBoton(boton);

  if (btn && texto !== undefined) {
    btn.disabled = true;
    btn.dataset.textoOriginal = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span>${texto}`;
  }

  if (!pgsExisteSwal()) return;

  Swal.fire({
    title: 'Procesando...',
    imageUrl: window.PGS_MENSAJES_CONFIG.logoUrl,
    imageWidth: 150,
    imageHeight: 60,
    imageAlt: 'Logo',
    html: `
      <div class="mt-2">
        <div class="spinner-border text-primary mb-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div>Por favor, espere un momento.</div>
      </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
  });
}

/**
 * Oculta spinner.
 * Compatible con tu función anterior:
 * ocultarSpinner(boton, texto)
 */
function ocultarSpinner(boton, texto) {
  const btn = pgsGetBoton(boton);

  if (btn) {
    btn.disabled = false;

    if (texto !== undefined) {
      btn.textContent = texto;
    } else {
      btn.innerHTML = btn.dataset.textoOriginal || btn.innerHTML;
    }
  }

  if (pgsExisteSwal()) Swal.close();
}

/**
 * Nombre recomendado nuevo para usar en proyectos.
 */
function msgProcesando(texto = 'Procesando información...', boton = null, textoBoton = 'Procesando...') {
  const btn = pgsGetBoton(boton);

  if (btn) {
    btn.disabled = true;
    btn.dataset.textoOriginal = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span>${textoBoton}`;
  }

  if (!pgsExisteSwal()) return;

  Swal.fire({
    title: 'Procesando...',
    imageUrl: window.PGS_MENSAJES_CONFIG.logoUrl,
    imageWidth: 150,
    imageHeight: 60,
    imageAlt: 'Logo',
    html: `
      <div class="mt-2">
        <div class="spinner-border text-primary mb-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div>${texto}</div>
      </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
  });
}

function cerrarProcesando(boton = null) {
  ocultarSpinner(boton);
}

/* =========================================================
   CONFIRMACIONES
   ========================================================= */

function confirmarAccion({
  titulo = '¿Está seguro?',
  texto = 'Esta acción no se puede deshacer.',
  icono = 'warning',
  textoConfirmar = 'Sí, continuar',
  textoCancelar = 'Cancelar',
  colorConfirmar = window.PGS_MENSAJES_CONFIG.colorConfirmar,
  colorCancelar = window.PGS_MENSAJES_CONFIG.colorCancelar
} = {}) {
  if (!pgsExisteSwal()) {
    return Promise.resolve(confirm(`${titulo}\n${texto}`));
  }

  return Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonColor: colorConfirmar,
    cancelButtonColor: colorCancelar,
    confirmButtonText: textoConfirmar,
    cancelButtonText: textoCancelar
  }).then(result => result.isConfirmed);
}

function confirmarEliminacion(callback, texto = 'Esta acción no se puede deshacer.') {
  confirmarAccion({
    titulo: '¿Seguro que desea eliminar?',
    texto: texto,
    icono: 'warning',
    textoConfirmar: 'Sí, eliminar',
    textoCancelar: 'Cancelar',
    colorConfirmar: window.PGS_MENSAJES_CONFIG.colorEliminar
  }).then(confirmado => {
    if (confirmado && typeof callback === 'function') {
      callback();
    }
  });
}

/* =========================================================
   MENSAJES ESPECÍFICOS COMPATIBLES CON TUS PROYECTOS
   ========================================================= */

function msgValidandoCambios() {
  if (!pgsExisteSwal()) return;

  let timerInterval;

  Swal.fire({
    title: 'Actualizando Registro!...',
    html: 'Por favor, espere ....',
    timer: 4000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {}, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  });
}

function msgDpiVacio() {
  msgError('Ingrese el DPI!', 'UPSSS!');
}

function msgValidacionDpi() {
  if (!pgsExisteSwal()) return;

  let timerInterval;

  Swal.fire({
    title: 'Validando DPI...!',
    html: 'Espere....',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {}, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  });
}

function msgDpiYaExiste() {
  msgError('El DPI registrando ya existe!', 'UPSSS!');
}

/* =========================================================
   HELPERS PARA GOOGLE.SCRIPT.RUN
   ========================================================= */

/**
 * Helper opcional para manejar éxito/error de google.script.run.
 * Ejemplo:
 * ejecutarConFeedback({
 *   textoProcesando: 'Guardando producto...',
 *   boton: 'btnGuardar',
 *   textoBoton: 'Guardando...',
 *   accion: (success, failure) => google.script.run.withSuccessHandler(success).withFailureHandler(failure).guardarProducto(datos),
 *   onSuccess: () => cargarProductos(),
 *   mensajeExito: 'Producto guardado correctamente'
 * });
 */
function ejecutarConFeedback({
  textoProcesando = 'Procesando información...',
  boton = null,
  textoBoton = 'Procesando...',
  accion,
  onSuccess = null,
  onError = null,
  mensajeExito = 'Operación realizada exitosamente',
  mensajeError = 'No se pudo completar la operación'
} = {}) {
  if (typeof accion !== 'function') {
    msgError('No se definió la acción a ejecutar');
    return;
  }

  msgProcesando(textoProcesando, boton, textoBoton);

  const success = function(respuesta) {
    cerrarProcesando(boton);
    if (typeof onSuccess === 'function') onSuccess(respuesta);
    msgExito(mensajeExito);
  };

  const failure = function(error) {
    cerrarProcesando(boton);
    if (typeof onError === 'function') onError(error);
    msgErrorServidor(error, mensajeError);
  };

  accion(success, failure);
}
