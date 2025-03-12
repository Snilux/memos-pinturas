document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formularioLogin");

  formulario.addEventListener("submit", (event) => {
    let usuario = document.getElementById("inputUsuario").value.trim();
    let correo = document.getElementById("inputCorreo").value.trim();
    let password = document.getElementById("inputPassword").value.trim();
    let rol = document.getElementById("inputRol").value;

    // Regex revisados y mejorados
    const regexUsuario = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{3,50}$/; // Solo letras, números y espacios, entre 3 y 50 caracteres
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^[a-zA-Z0-9@$!%*?&]{5,20}$/; // Entre 5 y 20 caracteres
    const regexRol = /^(administrador|operador)$/; // Solo acepta valores válidos esperados

    // Regex de seguridad para detectar inyecciones o tags HTML/JS
    const regexMalicioso = /[<>"/'`;(){}[\]]/g;

    if (
      regexMalicioso.test(usuario) ||
      regexMalicioso.test(correo) ||
      regexMalicioso.test(password)
    ) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "No se permiten caracteres especiales o scripts",
      });
      return;
    }

    // Validación de campos vacíos
    if (!usuario || !correo || !password || !rol) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "Todos los campos son obligatorios",
      });
      return;
    }

    // Validación del usuario
    if (!regexUsuario.test(usuario)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "El nombre solo puede contener letras, números y espacios (entre 3 y 50 caracteres)",
      });
      return;
    }

    // Validación del correo
    if (!regexCorreo.test(correo)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "Ingresa un correo electrónico válido",
      });
      return;
    }

    // Validación de la contraseña
    if (!regexPassword.test(password)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "La contraseña debe tener entre 5 y 20 caracteres y solo puede contener letras, números y símbolos permitidos",
      });
      return;
    }

    // Validación del rol
    if (!regexRol.test(rol)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "Selecciona un rol válido",
      });
      return;
    }
  });
});
