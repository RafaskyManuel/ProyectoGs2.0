/* =========================================================
   ProyectoGS - validaciones.js
   Validaciones reutilizables para proyectos Google Apps Script
   Compatible con funciones antiguas
   ========================================================= */

window.PGS_VALIDACIONES_CONFIG = window.PGS_VALIDACIONES_CONFIG || {
  telefonoLongitud: 8,
  precioMaximo: 99999,
  precioMaxDigitos: 5,
  dpiLongitud: 13
};

/**
 * Obtiene un elemento por id o devuelve el mismo elemento si ya fue enviado como objeto.
 */
function pgsGetElement(elemento) {
  if (!elemento) return null;
  return typeof elemento === 'string' ? document.getElementById(elemento) : elemento;
}

/**
 * Muestra u oculta un contenedor de error.
 */
function pgsMostrarError(error, mensaje) {
  const errorElement = pgsGetElement(error);
  if (!errorElement) return;

  errorElement.style.display = mensaje ? 'block' : 'none';
  errorElement.innerHTML = mensaje || '';
}

/**
 * Limpia caracteres no numéricos.
 */
function pgsSoloNumeros(valor) {
  return String(valor || '').replace(/\D/g, '');
}

/**
 * Limita la cantidad de caracteres de un input.
 */
function limitarCaracteres(input, maximo) {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  if (String(elemento.value).length > maximo) {
    elemento.value = String(elemento.value).slice(0, maximo);
  }

  return true;
}

/**
 * Valida campo requerido.
 */
function validarRequerido(input, error, mensaje = 'Este campo es obligatorio') {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  const valido = String(elemento.value || '').trim() !== '';
  pgsMostrarError(error, valido ? '' : mensaje);

  return valido;
}

/**
 * Valida longitud exacta.
 */
function validarLongitudExacta(input, error, longitud, nombreCampo = 'El campo') {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  const valor = String(elemento.value || '').trim();

  if (valor.length === longitud) {
    pgsMostrarError(error, '');
    return true;
  }

  pgsMostrarError(error, `${nombreCampo} debe tener exactamente ${longitud} caracteres`);
  return false;
}

/**
 * Valida número entero.
 */
function validarEntero(input, error, mensaje = 'Ingrese un número entero válido') {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  const valor = String(elemento.value || '').trim();
  const valido = /^\d+$/.test(valor);

  pgsMostrarError(error, valido ? '' : mensaje);
  return valido;
}

/**
 * Valida número decimal positivo.
 */
function validarDecimalPositivo(input, error, mensaje = 'Ingrese un número válido mayor o igual a cero') {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  const valor = String(elemento.value || '').trim();
  const numero = Number(valor);
  const valido = valor !== '' && !Number.isNaN(numero) && numero >= 0;

  pgsMostrarError(error, valido ? '' : mensaje);
  return valido;
}

/* =========================================================
   FUNCIONES COMPATIBLES CON TUS PROYECTOS ACTUALES
   ========================================================= */

/**
 * VALIDAR EL PRECIO QUE NO SUPERE UN LÍMITE.
 * Compatible con tu función anterior.
 */
function validarPrecio(input, maximo = window.PGS_VALIDACIONES_CONFIG.precioMaximo, maxDigitos = window.PGS_VALIDACIONES_CONFIG.precioMaxDigitos) {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  let valor = String(elemento.value || '');

  if (valor.length > maxDigitos) {
    valor = valor.slice(0, maxDigitos);
  }

  let numero = Number(valor);

  if (Number.isNaN(numero)) {
    elemento.value = '';
    return false;
  }

  if (numero > maximo) numero = maximo;
  if (numero < 0) numero = 0;

  elemento.value = numero;
  return true;
}

/**
 * VALIDAR ENTRADAS DE SELECT/DATALIST.
 * Compatible con tu función anterior.
 */
function validacionCmb(comboBox, listaComboBox) {
  const input = pgsGetElement(comboBox);
  const lista = pgsGetElement(listaComboBox);

  if (!input || !lista || !lista.options) return false;

  let valorValido = false;

  for (let i = 0; i < lista.options.length; i++) {
    if (input.value === lista.options[i].value) {
      valorValido = true;
      break;
    }
  }

  if (!valorValido) {
    input.value = '';
  }

  return valorValido;
}

/**
 * VALIDA LOS DÍGITOS DEL NÚMERO DE TELÉFONO.
 * Compatible con tu función anterior, pero ahora permite longitud configurable.
 */
function validarNumeroTelefono(input, error, longitud = window.PGS_VALIDACIONES_CONFIG.telefonoLongitud) {
  const telefonoInput = pgsGetElement(input);

  if (!telefonoInput) return false;

  let telefono = pgsSoloNumeros(telefonoInput.value);

  if (telefono.length > longitud) {
    telefono = telefono.slice(0, longitud);
  }

  telefonoInput.value = telefono;

  if (telefono.length === longitud && /^[0-9]+$/.test(telefono)) {
    pgsMostrarError(error, '');
    return true;
  }

  pgsMostrarError(error, `El número de teléfono debe tener exactamente ${longitud} dígitos`);
  return false;
}

/**
 * VALIDA SI EL CORREO ELECTRÓNICO ES VÁLIDO.
 * Compatible con tu función anterior.
 */
function validarCorreoUsuario(input, error) {
  const correoInput = pgsGetElement(input);

  if (!correoInput) return false;

  const correo = String(correoInput.value || '').trim();
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valido = correoRegex.test(correo);

  pgsMostrarError(error, valido ? '' : 'Ingrese un correo electrónico válido');
  return valido;
}

/**
 * Valida DPI de Guatemala.
 */
function validarDPI(input, error, longitud = window.PGS_VALIDACIONES_CONFIG.dpiLongitud) {
  const dpiInput = pgsGetElement(input);
  if (!dpiInput) return false;

  let dpi = pgsSoloNumeros(dpiInput.value);

  if (dpi.length > longitud) {
    dpi = dpi.slice(0, longitud);
  }

  dpiInput.value = dpi;

  if (dpi.length === longitud) {
    pgsMostrarError(error, '');
    return true;
  }

  pgsMostrarError(error, `El DPI debe tener exactamente ${longitud} dígitos`);
  return false;
}

/**
 * Valida que un select tenga valor.
 */
function validarSelect(input, error, mensaje = 'Debe seleccionar una opción') {
  return validarRequerido(input, error, mensaje);
}

/**
 * Valida que un valor numérico esté entre mínimo y máximo.
 */
function validarRangoNumerico(input, error, minimo = 0, maximo = 999999, mensaje = null) {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  const numero = Number(elemento.value);
  const valido = !Number.isNaN(numero) && numero >= minimo && numero <= maximo;

  pgsMostrarError(
    error,
    valido ? '' : (mensaje || `El valor debe estar entre ${minimo} y ${maximo}`)
  );

  return valido;
}

/**
 * Valida fechas básicas.
 */
function validarFecha(input, error, mensaje = 'Ingrese una fecha válida') {
  const elemento = pgsGetElement(input);
  if (!elemento) return false;

  const valor = elemento.value;
  const fecha = new Date(valor);
  const valido = valor && !Number.isNaN(fecha.getTime());

  pgsMostrarError(error, valido ? '' : mensaje);
  return valido;
}

/**
 * Valida que fecha final sea mayor o igual que fecha inicial.
 */
function validarRangoFechas(inputInicio, inputFin, error, mensaje = 'La fecha final debe ser mayor o igual a la fecha inicial') {
  const inicio = pgsGetElement(inputInicio);
  const fin = pgsGetElement(inputFin);

  if (!inicio || !fin) return false;

  const fechaInicio = new Date(inicio.value);
  const fechaFin = new Date(fin.value);

  const valido =
    inicio.value &&
    fin.value &&
    !Number.isNaN(fechaInicio.getTime()) &&
    !Number.isNaN(fechaFin.getTime()) &&
    fechaFin >= fechaInicio;

  pgsMostrarError(error, valido ? '' : mensaje);
  return valido;
}

/**
 * Configura globalmente validaciones sin editar cada función.
 * Ejemplo:
 * configurarValidaciones({ telefonoLongitud: 9 });
 */
function configurarValidaciones(config = {}) {
  window.PGS_VALIDACIONES_CONFIG = {
    ...window.PGS_VALIDACIONES_CONFIG,
    ...config
  };
}
