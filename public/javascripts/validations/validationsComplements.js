document.addEventListener("DOMContentLoaded", function () {
  // Get the form element using its ID
  // Asegúrate que el ID 'formularioLogin' es el correcto para este formulario específico.
  const form = document.getElementById("formularioLogin");

  // If the form doesn't exist on the page, log an error and stop the script
  if (!form) {
    console.error(
      '¡Error Crítico! No se encontró el formulario con ID "formularioLogin". La validación no funcionará.'
    );
    return;
  }

  // --- Get References to Form Elements ---
  // It's generally better to use specific IDs for each input if possible.
  // Using querySelector with name attributes as a fallback.
  const codigoInput = form.querySelector('input[name="codigo_complemento"]');
  const cantidadInput = form.querySelector("#inputCantidad"); // Uses existing ID
  const productoInput = form.querySelector('input[name="producto"]'); // Readonly field
  // const caracteristicasInput = form.querySelector('textarea[name="caracteristicas"]'); // Readonly field
  const imagenInput = form.querySelector("#imageUpload"); // Uses existing ID
  const piezasCajaSelect = form.querySelector("#inputLitros"); // Uses existing ID (consider renaming this ID in HTML for clarity, e.g., 'piezasCajaSelect')
  const precioCajaInput = form.querySelector('input[name="precio_caja"]');
  const precioUnitarioInput = form.querySelector("#precioUnitario"); // Uses existing ID
  const precioVentaInput = form.querySelector("#precioUnitarioVenta"); // Uses existing ID
  const loteIdInput = form.querySelector('input[name="lote_id"]');
  // const proveedorInput = form.querySelector('input[name="proveedor"]'); // Readonly field, missing name/id in provided HTML

  // --- Configuration ---
  // Define forbidden characters using a Regular Expression: < > | \ `
  const forbiddenCharsRegex = /[<|>\\`]/;
  const forbiddenCharsString = "< > | \\ `"; // For user messages

  // --- Event Listener for Form Submission ---
  form.addEventListener("submit", function (event) {
    // Prevent the form from submitting immediately
    event.preventDefault();
    let errors = []; // Initialize an array to hold validation error messages

    // --- Helper Function for Numeric Input Validation ---
    // Validates required status, numeric format, minimum value (0), and optionally forbidden characters.
    const validateNumericInput = (
      inputElement,
      fieldName,
      allowDecimal = true,
      checkForForbidden = true
    ) => {
      // If the element wasn't found in the DOM, skip validation for it
      if (!inputElement) {
        console.warn(`Elemento para "${fieldName}" no encontrado.`);
        return NaN; // Return NaN if element is missing
      }

      const value = inputElement.value.trim();
      // Regex for positive numbers: optional decimal point OR integers only
      const numericRegex = allowDecimal ? /^\d+(\.\d+)?$/ : /^\d+$/;

      // Check if the field is required and empty
      if (inputElement.required && value === "") {
        errors.push(`El campo "${fieldName}" es obligatorio.`);
        return NaN; // Return NaN as it's invalid
      }

      // If the field has a value, perform further checks
      if (value !== "") {
        // Check if the value is a valid non-negative number
        if (!numericRegex.test(value) || parseFloat(value) < 0) {
          errors.push(
            `"${fieldName}" debe ser un número válido y no negativo.`
          );
          return NaN; // Return NaN as it's invalid
        }
        // Check for forbidden characters if required
        if (checkForForbidden && forbiddenCharsRegex.test(value)) {
          errors.push(
            `"${fieldName}" contiene caracteres no permitidos (${forbiddenCharsString}).`
          );
          return NaN; // Return NaN as it's invalid
        }
        // If all checks pass, return the parsed number
        return parseFloat(value);
      }
      // If not required and empty, return NaN (or null/undefined depending on desired handling)
      return NaN;
    };

    // --- Helper Function for Text Input Validation ---
    // Validates required status, minimum length, and optionally forbidden characters.
    const validateTextInput = (
      inputElement,
      fieldName,
      minLength = 1,
      checkForForbidden = true
    ) => {
      // If the element wasn't found in the DOM, skip validation for it
      if (!inputElement) {
        console.warn(`Elemento para "${fieldName}" no encontrado.`);
        return;
      }

      const value = inputElement.value.trim();

      // Check if the field is required and empty
      if (inputElement.required && value === "") {
        errors.push(`El campo "${fieldName}" es obligatorio.`);
        return; // Stop validation for this field
      }

      // If the field has a value, perform further checks
      if (value !== "") {
        // Check minimum length
        if (value.length < minLength) {
          errors.push(
            `"${fieldName}" debe tener al menos ${minLength} caracter(es).`
          );
        }
        // Check for forbidden characters if required
        if (checkForForbidden && forbiddenCharsRegex.test(value)) {
          errors.push(
            `"${fieldName}" contiene caracteres no permitidos (${forbiddenCharsString}).`
          );
        }
      }
    };

    // --- Perform Validations for Each Field ---

    // 1. Código del Producto (Text, Required, No forbidden chars)
    validateTextInput(codigoInput, "Código del Producto", 1, true); // Min length 1

    // 2. Cantidad Disponible (Numeric, Integer, Required, Non-negative)
    validateNumericInput(cantidadInput, "Cantidad Disponible", false, false); // false = no decimals, false = don't check forbidden chars here

    // 3. Nombre del producto (Readonly - Optional check)
    // If this field is expected to be filled by another script, you might check if it's empty:
    // if (productoInput && productoInput.required && productoInput.value.trim() === '') {
    //    errors.push('El nombre del producto parece no haberse cargado correctamente.');
    // }

    // 4. Imagen (File Upload, Required)
    if (
      imagenInput &&
      imagenInput.required &&
      (!imagenInput.files || imagenInput.files.length === 0)
    ) {
      // Check if files property exists and has length > 0
      errors.push("Debes seleccionar una imagen para el producto.");
    }

    // 5. Piezas por Caja (Select, Required)
    if (
      piezasCajaSelect &&
      piezasCajaSelect.required &&
      piezasCajaSelect.value === ""
    ) {
      // Check if the value is empty (which means the default disabled option is selected)
      errors.push('Debes seleccionar una opción para "Piezas por Caja".');
    }

    // 6. Precio por caja (Numeric, Required, Non-negative, No forbidden chars)
    validateNumericInput(precioCajaInput, "Precio por caja", true, true); // true = allow decimals, true = check forbidden

    // 7. Precio Compra Unitario (Numeric, Required, Non-negative, No forbidden chars)
    // Store the result for comparison later
    const precioCompraNum = validateNumericInput(
      precioUnitarioInput,
      "Precio Compra Unitario",
      true,
      true
    );

    // 8. Precio Venta Unitario (Numeric, Required, Non-negative, No forbidden chars)
    // Store the result for comparison later
    const precioVentaNum = validateNumericInput(
      precioVentaInput,
      "Precio Venta Unitario",
      true,
      true
    );

    // 9. Número de Lote (Numeric, Integer, Required, Non-negative)
    validateNumericInput(loteIdInput, "Número de Lote", false, false); // false = no decimals, false = don't check forbidden chars

    // 10. Cross-Field Validation: Precio Venta > Precio Compra
    // This check only makes sense if both price inputs contained valid, non-negative numbers.
    // isNaN(value) returns true if the value is Not-a-Number.
    if (!isNaN(precioCompraNum) && !isNaN(precioVentaNum)) {
      if (precioVentaNum <= precioCompraNum) {
        // Using '<=' ensures the selling price must be strictly greater
        errors.push(
          'El "Precio Venta Unitario" debe ser mayor que el "Precio Compra Unitario".'
        );
      }
    }

    // --- Display Validation Results ---
    if (errors.length > 0) {
      // If there are any errors, display them using SweetAlert2
      Swal.fire({
        icon: "error", // Show error icon
        title: "Errores de Validación", // Alert title
        // Join all error messages with HTML line breaks for readability
        html: errors.join("<br>"),
        confirmButtonColor: "#d33", // Red color for confirm button
        confirmButtonText: "Entendido", // Text for confirm button
      });
    } else {
      // If the errors array is empty, all validations passed. Submit the form.
      console.log("Validación exitosa. Enviando formulario...");
      form.submit(); // Programmatically submit the form
    }
  }); // End of submit event listener

  // --- Optional: SweetAlert for Server-Side Messages ---
  // Include your existing logic here if you pass messages back from the server
  // Ensure 'errorMessage' and 'successMessage' are defined in the global scope or passed correctly.
  /*
  if (typeof errorMessage !== 'undefined' && errorMessage && errorMessage.trim() !== '') {
      Swal.fire({
          icon: 'error',
          title: 'Error del Servidor',
          text: errorMessage,
          confirmButtonColor: '#d33'
      });
  }

  if (typeof successMessage !== 'undefined' && successMessage && successMessage.trim() !== '') {
      Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: successMessage,
          confirmButtonColor: '#3085d6'
      });
  }
  */
}); // End of DOMContentLoaded listener
