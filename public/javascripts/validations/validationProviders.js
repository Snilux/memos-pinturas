// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the form and input elements
  const form = document.getElementById("formularioLogin");
  const inputEmpresa = document.getElementById("inputEmpresa");
  const inputTelefono = document.getElementById("inputTelefono");
  const inputCorreo = document.getElementById("inputCorreo");

  // Define the forbidden characters using a regular expression
  const forbiddenCharsRegex = /[<>|]/; // Checks for <, >, or |

  // Add an event listener to the form's submit event
  form.addEventListener("submit", function (event) {
    // Prevent the default form submission immediately
    event.preventDefault();

    // --- Validation Logic ---
    let errors = []; // Array to store error messages

    // Trim input values to remove leading/trailing whitespace
    const nombreEmpresaValue = inputEmpresa.value.trim();
    const telefonoValue = inputTelefono.value.trim();
    const correoValue = inputCorreo.value.trim();

    // 1. Validate Company Name
    if (nombreEmpresaValue.length < 3) {
      errors.push("El nombre de la empresa debe tener al menos 3 caracteres.");
    }
    if (forbiddenCharsRegex.test(nombreEmpresaValue)) {
      errors.push(
        "El nombre de la empresa no puede contener los caracteres <, >, |."
      );
    }

    // 2. Validate Phone Number
    if (telefonoValue.length !== 10) {
      errors.push("El teléfono debe tener exactamente 10 caracteres.");
    }
    // Optional: Check if phone contains only digits (recommended)
    if (!/^\d+$/.test(telefonoValue) && telefonoValue.length > 0) {
      errors.push("El teléfono solo debe contener números.");
    }
    if (forbiddenCharsRegex.test(telefonoValue)) {
      errors.push("El teléfono no puede contener los caracteres <, >, |.");
    }

    // 3. Validate Email (Basic check for forbidden chars, browser handles format)
    if (forbiddenCharsRegex.test(correoValue)) {
      errors.push(
        "El correo electrónico no puede contener los caracteres <, >, |."
      );
    }
    // You might add a more robust email regex check here if needed,
    // but type="email" and required already provide good basic validation.

    // --- Decision ---
    if (errors.length > 0) {
      // If there are errors, display them using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error de Validación",
        // Join errors into a single HTML string with line breaks
        html: errors.join("<br>"),
        confirmButtonColor: "#d33", // Example error color
        confirmButtonText: "Entendido",
      });
    } else {
      // If there are no errors, submit the form programmatically
      // 'this' refers to the form element in this context
      this.submit();
    }
  });

  // --- SweetAlert for Server Messages (Keep your existing logic) ---
  // Ensure this part is also inside the DOMContentLoaded listener
  // or placed after it if it depends on elements loaded earlier.
  // Assuming errorMessage and successMessage are correctly passed from the server
  // as shown in your <script> block in the HTML.

  // Check if the variables exist and have content before showing alerts
  if (
    typeof errorMessage !== "undefined" &&
    errorMessage &&
    errorMessage.trim() !== ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonColor: "#d33",
    });
  }

  if (
    typeof successMessage !== "undefined" &&
    successMessage &&
    successMessage.trim() !== ""
  ) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: successMessage,
      confirmButtonColor: "#3085d6", // Example success color
    });
  }
}); // End of DOMContentLoaded listener
