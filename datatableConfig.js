/* =========================================================
   ProyectoGS - datatableConfig.js
   Configuración reutilizable para DataTables
   Requiere:
   - jQuery
   - DataTables
   - DataTables Bootstrap 5
   Opcional para exportar:
   - DataTables Buttons
   - JSZip
   - pdfmake
   ========================================================= */

window.PGS_DATATABLE_CONFIG = window.PGS_DATATABLE_CONFIG || {
  languageUrl: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
  pageLength: 10,
  exportTitle: 'Reporte',
  exportFileName: 'reporte'
};

function configurarDataTables(config = {}) {
  window.PGS_DATATABLE_CONFIG = {
    ...window.PGS_DATATABLE_CONFIG,
    ...config
  };
}

function pgsDataTablesDisponible() {
  return typeof $ !== 'undefined' && $.fn && $.fn.DataTable;
}

function pgsButtonsDisponible() {
  return pgsDataTablesDisponible() && $.fn.dataTable && $.fn.dataTable.Buttons;
}

/**
 * Loader visual para tablas.
 * Usa IDs de contenedor/loader sin obligarte a cambiar los ids de tus tablas.
 */
function mostrarLoaderTabla(loaderId, contenedorId) {
  const loader = document.getElementById(loaderId);
  const contenedor = document.getElementById(contenedorId);

  if (loader) loader.classList.remove('d-none');
  if (contenedor) contenedor.classList.add('d-none');
}

function ocultarLoaderTabla(loaderId, contenedorId, tabla = null) {
  const loader = document.getElementById(loaderId);
  const contenedor = document.getElementById(contenedorId);

  if (loader) loader.classList.add('d-none');
  if (contenedor) contenedor.classList.remove('d-none');

  if (tabla && tabla.columns) {
    setTimeout(() => tabla.columns.adjust().draw(false), 50);
  }
}

/**
 * Crea HTML estándar para loader.
 */
function htmlLoaderTabla(texto = 'Cargando información...', subtexto = 'Por favor espere un momento') {
  return `
    <div class="pgs-loader">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="pgs-loader-title">${texto}</div>
      <small class="pgs-loader-subtitle">${subtexto}</small>
    </div>
  `;
}

/**
 * Render genérico para botones de acción.
 */
function renderBotonesAcciones({
  editar = null,
  eliminar = null,
  ver = null,
  imprimir = null,
  extra = ''
} = {}) {
  let html = '<div class="pgs-acciones">';

  if (ver) {
    html += `
      <button type="button" class="pgs-btn-accion pgs-btn-ver" onclick="${ver}" title="Ver">
        <i class="bi bi-eye"></i>
      </button>
    `;
  }

  if (editar) {
    html += `
      <button type="button" class="pgs-btn-accion pgs-btn-editar" onclick="${editar}" title="Editar">
        <i class="bi bi-pencil"></i>
      </button>
    `;
  }

  if (imprimir) {
    html += `
      <button type="button" class="pgs-btn-accion pgs-btn-imprimir" onclick="${imprimir}" title="Imprimir">
        <i class="bi bi-printer"></i>
      </button>
    `;
  }

  if (eliminar) {
    html += `
      <button type="button" class="pgs-btn-accion pgs-btn-eliminar" onclick="${eliminar}" title="Eliminar">
        <i class="bi bi-trash"></i>
      </button>
    `;
  }

  html += extra || '';
  html += '</div>';

  return html;
}

/**
 * Botones exportables estándar.
 */
function obtenerBotonesExportacion(opciones = {}) {
  const titulo = opciones.titulo || window.PGS_DATATABLE_CONFIG.exportTitle;
  const nombreArchivo = opciones.nombreArchivo || window.PGS_DATATABLE_CONFIG.exportFileName;
  const columnas = opciones.columnas || ':visible:not(:last-child)';

  return [
    {
      extend: 'excelHtml5',
      text: '<i class="bi bi-file-earmark-excel"></i> Excel',
      className: 'btn btn-success btn-sm',
      title: titulo,
      filename: nombreArchivo,
      exportOptions: {
        columns: columnas
      }
    },
    {
      extend: 'pdfHtml5',
      text: '<i class="bi bi-file-earmark-pdf"></i> PDF',
      className: 'btn btn-danger btn-sm',
      title: titulo,
      filename: nombreArchivo,
      orientation: opciones.orientation || 'landscape',
      pageSize: opciones.pageSize || 'A4',
      exportOptions: {
        columns: columnas
      },
      customize: function(doc) {
        doc.defaultStyle.fontSize = 9;
        doc.styles.tableHeader.fontSize = 10;
        doc.styles.tableHeader.bold = true;
        doc.content[1].table.widths =
          Array(doc.content[1].table.body[0].length + 1).join('*').split('');
      }
    },
    {
      extend: 'print',
      text: '<i class="bi bi-printer"></i> Imprimir',
      className: 'btn btn-secondary btn-sm',
      title: titulo,
      exportOptions: {
        columns: columnas
      }
    }
  ];
}

/**
 * Crea una DataTable estándar.
 *
 * Uso:
 * tabla = crearDataTableBasico('tablaProductos', columnas, {
 *   exportar: true,
 *   titulo: 'Productos',
 *   nombreArchivo: 'productos'
 * });
 */
function crearDataTableBasico(tablaId, columnas, opcionesExtra = {}) {
  if (!pgsDataTablesDisponible()) {
    console.error('DataTables no está disponible. Verifique los scripts CDN.');
    return null;
  }

  const exportar = opcionesExtra.exportar === true;
  const buttons =
    opcionesExtra.buttons !== undefined
      ? opcionesExtra.buttons
      : (exportar && pgsButtonsDisponible()
          ? obtenerBotonesExportacion({
              titulo: opcionesExtra.titulo,
              nombreArchivo: opcionesExtra.nombreArchivo,
              columnas: opcionesExtra.columnasExportar,
              orientation: opcionesExtra.orientation,
              pageSize: opcionesExtra.pageSize
            })
          : []);

  const dom =
    opcionesExtra.dom ||
    "<'row mb-3'<'col-md-6'l><'col-md-6 text-end'f>>" +
    (buttons.length ? "<'row mb-3'<'col-md-12 text-center'B>>" : "") +
    "<'row'<'col-md-12'tr>>" +
    "<'row mt-3'<'col-md-6'i><'col-md-6'p>>";

  const config = {
    columns: columnas,
    responsive: opcionesExtra.responsive !== undefined ? opcionesExtra.responsive : true,
    pageLength: opcionesExtra.pageLength || window.PGS_DATATABLE_CONFIG.pageLength,
    lengthMenu: opcionesExtra.lengthMenu || [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Todos']],
    ordering: opcionesExtra.ordering !== undefined ? opcionesExtra.ordering : true,
    searching: opcionesExtra.searching !== undefined ? opcionesExtra.searching : true,
    paging: opcionesExtra.paging !== undefined ? opcionesExtra.paging : true,
    info: opcionesExtra.info !== undefined ? opcionesExtra.info : true,
    autoWidth: false,
    destroy: opcionesExtra.destroy !== undefined ? opcionesExtra.destroy : true,
    dom: dom,
    buttons: buttons,
    language: opcionesExtra.language || {
      url: window.PGS_DATATABLE_CONFIG.languageUrl
    },
    order: opcionesExtra.order || []
  };

  const extensionesPermitidas = [
    'columnDefs',
    'createdRow',
    'drawCallback',
    'initComplete',
    'rowCallback',
    'footerCallback',
    'data'
  ];

  extensionesPermitidas.forEach(prop => {
    if (opcionesExtra[prop] !== undefined) {
      config[prop] = opcionesExtra[prop];
    }
  });

  return $('#' + tablaId).DataTable(config);
}

/**
 * Aplica filtro exacto a una columna de DataTables.
 */
function aplicarFiltroColumna(tabla, indiceColumna, valor) {
  if (!tabla) return;

  if (!valor) {
    tabla.column(indiceColumna).search('').draw();
    return;
  }

  const valorEscapado = $.fn.dataTable.util.escapeRegex(valor);
  tabla.column(indiceColumna).search('^' + valorEscapado + '$', true, false).draw();
}

/**
 * Limpia filtros rápidos y buscador general.
 */
function limpiarFiltrosTabla(tabla, idsFiltros = []) {
  idsFiltros.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.value = '';
  });

  if (tabla) {
    tabla.search('');
    tabla.columns().search('');
    tabla.draw();
  }
}

/**
 * Carga datos en una DataTable con loader.
 */
function cargarDatosTabla({
  tabla,
  datos = [],
  loaderId = null,
  contenedorId = null
} = {}) {
  if (!tabla) return;

  tabla.clear().rows.add(datos || []).draw();

  if (loaderId && contenedorId) {
    ocultarLoaderTabla(loaderId, contenedorId, tabla);
  }
}

/**
 * Refresca una tabla usando google.script.run.
 *
 * Ejemplo:
 * cargarTablaDesdeServidor({
 *   tabla: tablaProductos,
 *   funcionServidor: 'obtenerProductos',
 *   loaderId: 'loaderProductos',
 *   contenedorId: 'contenedorTablaProductos',
 *   onError: error => msgErrorServidor(error, 'No se pudieron cargar los productos')
 * });
 */
function cargarTablaDesdeServidor({
  tabla,
  funcionServidor,
  parametros = [],
  loaderId = null,
  contenedorId = null,
  onSuccess = null,
  onError = null
} = {}) {
  if (!tabla || !funcionServidor) return;

  if (loaderId && contenedorId) {
    mostrarLoaderTabla(loaderId, contenedorId);
  }

  let runner = google.script.run
    .withSuccessHandler(function(datos) {
      tabla.clear().rows.add(datos || []).draw();

      if (loaderId && contenedorId) {
        ocultarLoaderTabla(loaderId, contenedorId, tabla);
      }

      if (typeof onSuccess === 'function') {
        onSuccess(datos || []);
      }
    })
    .withFailureHandler(function(error) {
      if (loaderId && contenedorId) {
        ocultarLoaderTabla(loaderId, contenedorId, tabla);
      }

      if (typeof onError === 'function') {
        onError(error);
      } else if (typeof msgErrorServidor === 'function') {
        msgErrorServidor(error, 'No se pudieron cargar los datos');
      } else {
        console.error(error);
      }
    });

  runner[funcionServidor].apply(runner, parametros);
}
