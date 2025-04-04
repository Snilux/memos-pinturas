// /javascripts/validations/validationsEditProducts.js

document.addEventListener("DOMContentLoaded", function () {
  // --- Get the correct form for editing ---
  const form = document.getElementById("formularioEditar");

  if (form) {
    form.addEventListener("submit", function (event) {
      // Prevent the default form submission first
      event.preventDefault();

      // --- Get form elements (same IDs as add form) ---
      const codigoPintura = document.getElementById("inputCodigo");
      const litros = document.getElementById("inputLitros");
      const categoria = document.getElementById("inputCategoria");
      const subCategoria = document.getElementById("inputSubCategoria");
      const nombreProducto = document.getElementById("inputNombreProducto");
      // Image input is optional on edit if one already exists
      // const imagen = document.getElementById('imageUpload');
      const colorNombre = document.getElementById("colorInput");
      const colorHex = document.getElementById("nombreColor");
      const precioCompra = document.getElementById("inputCompra");
      const precioVenta = document.getElementById("inputVenta");
      const cantidad = document.getElementById("inputCantidad");
      const piezasCaja = document.getElementById("inputCajasContainer");
      const loteId = document.getElementById("inputLote");
      const proveedor = document.getElementById("inputProveedor");

      // --- Helper function for showing errors ---
      const showError = (message) => {
        Swal.fire({
          icon: "error",
          title: "Error de Validación",
          text: message,
          confirmButtonColor: "#d33",
        });
      };

      // --- Validation Checks ---

      // 1. Código de Pintura (Required - check again in case it was cleared)
      if (!codigoPintura || codigoPintura.value.trim() === "") {
        showError('El campo "Código de Pintura" no puede estar vacío.');
        codigoPintura?.focus();
        return; // Stop validation
      }

      // 2. Litros (Required, should have a value)
      // The HTML structure makes it hard to change, but validate anyway
      if (!litros || litros.value === "") {
        showError('Debe haber una cantidad de "Litros" seleccionada.');
        litros?.focus();
        return;
      }

      // 3. Imagen (Not strictly required on edit if one exists)
      // No validation needed here unless you add functionality to *remove* the image without replacing.

      // 4. Precio de Compra (Required, non-negative number)
      if (!precioCompra || precioCompra.value.trim() === "") {
        showError('El campo "Precio de Compra" es obligatorio.');
        precioCompra?.focus();
        return;
      }
      if (
        isNaN(parseFloat(precioCompra.value)) ||
        parseFloat(precioCompra.value) < 0
      ) {
        showError(
          'El "Precio de Compra" debe ser un número válido y no puede ser negativo.'
        );
        precioCompra?.focus();
        return;
      }

      // 5. Precio de Venta (Required, non-negative number)
      if (!precioVenta || precioVenta.value.trim() === "") {
        showError('El campo "Precio de Venta" es obligatorio.');
        precioVenta?.focus();
        return;
      }
      if (
        isNaN(parseFloat(precioVenta.value)) ||
        parseFloat(precioVenta.value) < 0
      ) {
        showError(
          'El "Precio de Venta" debe ser un número válido y no puede ser negativo.'
        );
        precioVenta?.focus();
        return;
      }

      // 6. Precio Venta >= Precio Compra
      if (parseFloat(precioVenta.value) < parseFloat(precioCompra.value)) {
        showError(
          'El "Precio de Venta" no puede ser menor que el "Precio de Compra".'
        );
        precioVenta?.focus();
        return;
      }

      // 7. Cantidad Disponible (Required, non-negative integer)
      if (!cantidad || cantidad.value.trim() === "") {
        showError('El campo "Cantidad Disponible" es obligatorio.');
        cantidad?.focus();
        return;
      }
      const cantidadValue = Number(cantidad.value);
      if (
        isNaN(cantidadValue) ||
        !Number.isInteger(cantidadValue) ||
        cantidadValue < 0
      ) {
        showError(
          'La "Cantidad Disponible" debe ser un número entero no negativo.'
        );
        cantidad?.focus();
        return;
      }

      // 8. Número de Lote (Required, non-negative number/integer)
      if (!loteId || loteId.value.trim() === "") {
        showError('El campo "Número de Lote" es obligatorio.');
        loteId?.focus();
        return;
      }
      const loteValue = Number(loteId.value);
      if (isNaN(loteValue) || loteValue < 0) {
        showError('El "Número de Lote" debe ser un número no negativo.');
        loteId?.focus();
        return;
      }

      // --- CRUCIAL: Re-Validate Readonly Fields ---
      // Check if they are empty *now*, in case changing Codigo Pintura failed to populate them.
      // This directly addresses the problem mentioned.

      if (!categoria || categoria.value.trim() === "") {
        showError(
          'La "Categoría" está vacía. Verifique que el "Código de Pintura" sea válido y la información se haya autocompletado correctamente.'
        );
        codigoPintura?.focus();
        return;
      }
      if (!subCategoria || subCategoria.value.trim() === "") {
        showError(
          'La "Subcategoría" está vacía. Verifique que el "Código de Pintura" sea válido y la información se haya autocompletado.'
        );
        codigoPintura?.focus();
        return;
      }
      if (!nombreProducto || nombreProducto.value.trim() === "") {
        showError(
          'El "Nombre del Producto" está vacío. Verifique que el "Código de Pintura" sea válido y la información se haya autocompletado.'
        );
        codigoPintura?.focus();
        return;
      }
      if (!colorNombre || colorNombre.value.trim() === "") {
        showError(
          'El "Nombre del Color" está vacío. Verifique que el "Código de Pintura" sea válido y la información se haya autocompletado.'
        );
        codigoPintura?.focus();
        return;
      }
      if (!colorHex || colorHex.value.trim() === "") {
        // Don't check against #000000 here as it might be a valid saved color
        showError(
          'El "Color" (hexadecimal) está vacío o no se cargó correctamente. Verifique el "Código de Pintura".'
        );
        codigoPintura?.focus();
        return;
      }
      if (!piezasCaja || piezasCaja.value.trim() === "") {
        // This might depend on 'Litros' if that logic exists
        showError(
          'Las "Piezas por Caja" están vacías. Verifique los "Litros" y/o el "Código de Pintura".'
        );
        // Focus might depend on which field drives this value
        litros?.focus();
        return;
      }
      if (!proveedor || proveedor.value.trim() === "") {
        showError(
          'El "Proveedor" está vacío. Verifique que el "Código de Pintura" sea válido y la información se haya autocompletado.'
        );
        codigoPintura?.focus();
        return;
      }

      // --- If all checks pass ---
      console.log("Validación de edición exitosa. Enviando formulario..."); // For debugging
      form.submit(); // Submit the form programmatically
    });
  } else {
    console.error("Error: Formulario con ID 'formularioEditar' no encontrado.");
  }
});
