// /javascripts/validationsProducts.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formularioLogin'); // Get the form by its ID

    if (form) {
        form.addEventListener('submit', function (event) {
            // Prevent the default form submission first
            event.preventDefault();

            // --- Get form elements ---
            const codigoPintura = document.getElementById('inputCodigo');
            const litros = document.getElementById('inputLitros');
            const categoria = document.getElementById('inputCategoria');
            const subCategoria = document.getElementById('inputSubCategoria');
            const nombreProducto = document.getElementById('inputNombreProducto');
            const imagen = document.getElementById('imageUpload');
            const colorNombre = document.getElementById('colorInput');
            const colorHex = document.getElementById('nombreColor');
            const precioCompra = document.getElementById('inputCompra');
            const precioVenta = document.getElementById('inputVenta');
            const cantidad = document.getElementById('inputCantidad');
            const piezasCaja = document.getElementById('inputCajasContainer');
            const loteId = document.getElementById('inputLote');
            const proveedor = document.getElementById('inputProveedor');

            // --- Helper function for showing errors ---
            const showError = (message) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: message,
                    confirmButtonColor: '#d33', // Optional: style the button
                });
            };

            // --- Validation Checks ---

            // 1. Código de Pintura (Required)
            if (!codigoPintura || codigoPintura.value.trim() === '') {
                showError('El campo "Código de Pintura" es obligatorio.');
                codigoPintura?.focus(); // Optional: focus the field
                return; // Stop validation
            }

            // 2. Litros (Required, must select an option)
            if (!litros || litros.value === '') {
                showError('Debe seleccionar una opción en el campo "Litros".');
                litros?.focus();
                return;
            }

            // 3. Imagen (Required)
            if (!imagen || imagen.files.length === 0) {
                showError('Debe seleccionar una imagen para el producto.');
                // Focusing file input might not be intuitive, so skip focus here
                return;
            }

            // 4. Precio de Compra (Required, must be a non-negative number)
            if (!precioCompra || precioCompra.value.trim() === '') {
                showError('El campo "Precio de Compra" es obligatorio.');
                precioCompra?.focus();
                return;
            }
            if (isNaN(parseFloat(precioCompra.value)) || parseFloat(precioCompra.value) < 0) {
                showError('El "Precio de Compra" debe ser un número válido y no puede ser negativo.');
                precioCompra?.focus();
                return;
            }

            // 5. Precio de Venta (Required, must be a non-negative number)
            if (!precioVenta || precioVenta.value.trim() === '') {
                showError('El campo "Precio de Venta" es obligatorio.');
                precioVenta?.focus();
                return;
            }
            if (isNaN(parseFloat(precioVenta.value)) || parseFloat(precioVenta.value) < 0) {
                showError('El "Precio de Venta" debe ser un número válido y no puede ser negativo.');
                precioVenta?.focus();
                return;
            }

            // 6. Precio Venta >= Precio Compra (Logical Check)
            if (parseFloat(precioVenta.value) < parseFloat(precioCompra.value)) {
                showError('El "Precio de Venta" no puede ser menor que el "Precio de Compra".');
                precioVenta?.focus();
                return;
            }

            // 7. Cantidad Disponible (Required, must be a non-negative integer)
            if (!cantidad || cantidad.value.trim() === '') {
                showError('El campo "Cantidad Disponible" es obligatorio.');
                cantidad?.focus();
                return;
            }
            // Check if it's a number and an integer >= 0
            const cantidadValue = Number(cantidad.value);
            if (isNaN(cantidadValue) || !Number.isInteger(cantidadValue) || cantidadValue < 0) {
                showError('La "Cantidad Disponible" debe ser un número entero no negativo.');
                cantidad?.focus();
                return;
            }

            // 8. Número de Lote (Required, must be a non-negative number/integer)
            if (!loteId || loteId.value.trim() === '') {
                showError('El campo "Número de Lote" es obligatorio.');
                loteId?.focus();
                return;
            }
             // Check if it's a number >= 0 (allowing decimals if needed, adjust if only integer)
            const loteValue = Number(loteId.value);
            if (isNaN(loteValue) || loteValue < 0) {
                showError('El "Número de Lote" debe ser un número no negativo.');
                loteId?.focus();
                return;
            }

            // --- Validation for Readonly Fields (Ensure they were populated) ---
            // These depend on the logic in appFormularioAdd.js correctly populating them based on Codigo Pintura/Litros
            // This is a final check before submission.

            if (!categoria || categoria.value.trim() === '') {
                showError('La "Categoría" no se cargó correctamente. Verifique el Código de Pintura.');
                codigoPintura?.focus();
                return;
            }
            if (!subCategoria || subCategoria.value.trim() === '') {
                showError('La "Subcategoría" no se cargó correctamente. Verifique el Código de Pintura.');
                 codigoPintura?.focus();
                return;
            }
            if (!nombreProducto || nombreProducto.value.trim() === '') {
                showError('El "Nombre del Producto" no se cargó correctamente. Verifique el Código de Pintura.');
                 codigoPintura?.focus();
                return;
            }
             if (!colorNombre || colorNombre.value.trim() === '') {
                showError('El "Nombre del Color" no se cargó correctamente. Verifique el Código de Pintura.');
                 codigoPintura?.focus();
                return;
            }
             if (!colorHex || colorHex.value.trim() === '' || colorHex.value === '#000000') { // Default color value might be black
                 // Adjust this check if #000000 is a valid potential color from your data
                showError('El "Color" (hexadecimal) no se cargó correctamente. Verifique el Código de Pintura.');
                 codigoPintura?.focus();
                return;
            }
             if (!piezasCaja || piezasCaja.value.trim() === '') {
                showError('Las "Piezas por Caja" no se cargaron correctamente. Verifique los Litros seleccionados.');
                litros?.focus();
                return;
            }
             if (!proveedor || proveedor.value.trim() === '') {
                showError('El "Proveedor" no se cargó correctamente. Verifique el Código de Pintura.');
                 codigoPintura?.focus();
                return;
            }


            // --- If all checks pass ---
            // Show a confirmation or directly submit
            /* Optional: Confirmation before submit
            Swal.fire({
                title: '¿Todo listo?',
                text: "El producto se guardará con la información ingresada.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // If confirmed, submit the form programmatically
                    form.submit();
                }
            });
            */

           // Or just submit directly if confirmation isn't needed
           console.log("Validación exitosa. Enviando formulario..."); // For debugging
           form.submit(); // Submit the form programmatically

        });
    } else {
        console.error("Error: Formulario con ID 'formularioLogin' no encontrado.");
    }
});