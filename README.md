
```text
ProyectoGS/
├── css/
│   └── estiloPersonalizado.css
└── js/
    ├── validaciones.js
    ├── JsMensajes.js
    └── datatableConfig.js
```

## Orden recomendado de carga en tus HTML

```html
<!-- Bootstrap / iconos -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">

<!-- DataTables -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.bootstrap5.min.css">

<!-- Tu CSS global -->
<link rel="stylesheet" href="https://rafaskymanuel.github.io/ProyectoGs2.0/estiloPersonalizado.css">

<!-- Scripts base -->
<script src="https://code.jquery.com/jquery-3.7.0.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- DataTables -->
<script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>

<!-- DataTables Buttons para Excel/PDF/Imprimir -->
<script src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.bootstrap5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js"></script>

<!-- SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Tus JS globales -->
<script src="https://rafaskymanuel.github.io/ProyectoGs2.0/validaciones.js"></script>
<script src="https://rafaskymanuel.github.io/ProyectoGs2.0/JsMensajes.js"></script>
<script src="https://rafaskymanuel.github.io/ProyectoGs2.0/datatableConfig.js"></script>
```

## Ejemplo de DataTable

```javascript
tablaProductos = crearDataTableBasico('tablaProductos', [
  { data: 'codigo' },
  { data: 'nombre' },
  { data: 'categoria' },
  { data: 'marca' },
  { data: 'precio' },
  {
    data: null,
    className: 'text-center',
    render: function(data) {
      return renderBotonesAcciones({
        editar: `editarProducto(${JSON.stringify(data)})`,
        eliminar: `eliminarProducto('${data.id}')`
      });
    }
  }
], {
  exportar: true,
  titulo: 'Productos',
  nombreArchivo: 'productos'
});
```

## Ejemplo de loader para tabla

```html
<div id="loaderProductos">
  <script>
    document.write(htmlLoaderTabla('Cargando productos...', 'Por favor espere un momento'));
  </script>
</div>

<div id="contenedorTablaProductos" class="d-none">
  <table id="tablaProductos" class="table table-striped table-hover w-100"></table>
</div>
```

```javascript
cargarTablaDesdeServidor({
  tabla: tablaProductos,
  funcionServidor: 'obtenerProductos',
  loaderId: 'loaderProductos',
  contenedorId: 'contenedorTablaProductos'
});
```

## Mensajes

```javascript
msgProcesando('Guardando producto...', 'btnGuardar', 'Guardando...');
cerrarProcesando('btnGuardar');

msgExito('Producto guardado correctamente');
msgError('No se pudo guardar el producto');
msgAdvertencia('Debe seleccionar una sucursal');

confirmarEliminacion(function() {
  // eliminar registro
});
```

## Validaciones

```javascript
validarNumeroTelefono('telefono', 'telefonoError');       // 8 dígitos por defecto
validarNumeroTelefono('telefono', 'telefonoError', 9);    // 9 dígitos
validarCorreoUsuario('correo', 'correoError');
validarDPI('dpi', 'dpiError');
validarPrecio('precio');
```

## Configuración global opcional

```javascript
configurarValidaciones({
  telefonoLongitud: 8,
  precioMaximo: 99999
});

configurarMensajes({
  logoUrl: 'URL_DE_TU_LOGO',
  tiempoExito: 1800
});

configurarDataTables({
  pageLength: 10,
  exportTitle: 'Reporte'
});
```

## Compatibilidad

Se mantuvieron estos nombres para no romper tus proyectos actuales:

```javascript
mostrarAlerta()
mostrarSpinner()
ocultarSpinner()
msgValidandoCambios()
msgDpiVacio()
msgValidacionDpi()
msgDpiYaExiste()
validarPrecio()
validacionCmb()
validarNumeroTelefono()
validarCorreoUsuario()
```
