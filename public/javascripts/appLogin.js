document.addEventListener("DOMContentLoaded", () => {
  const imagenInicio = document.querySelector("#imagenInicio");
  const sectionLogin = document.querySelector("#sectionFormulario");

  sectionLogin.style.display = "none";
  sectionLogin.style.opacity = "0";

  imagenInicio.style.transition = "opacity 1s ease";
  sectionLogin.style.transition = "opacity 1s ease";

  setTimeout(() => {
    imagenInicio.style.opacity = "0";

    setTimeout(() => {
      imagenInicio.style.display = "none";
      sectionLogin.style.display = "block";
      setTimeout(() => {
        sectionLogin.style.opacity = "1";
      }, 50);
    }, 500);
  }, 500);

  
  if (
    errorMessage &&
    errorMessage.trim() !== "" &&
    errorMessage !== "undefined"
  ) {
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  const formularioLogin = document.querySelector("#formularioLogin");
  formularioLogin.addEventListener("submit", (event) => {
    const user = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value.trim();

    const userRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const passwordRegex = /^[a-zA-Z0-9@#$%^&+=!]{5,20}$/;

    if (user === "" || password === "") {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "Ambos campos son obligatorios",
      });
      return;
    }

    if (!userRegex.test(user)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "El usuario debe tener entre 4 y 20 caracteres y solo puede contener letras, números, guiones y guion bajo.",
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "La contraseña debe tener entre 5 y 20 caracteres y solo puede contener letras, números y algunos caracteres especiales (@#$%^&+=!).",
      });
      return;
    }
  });
});
