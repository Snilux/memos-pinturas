document.addEventListener("DOMContentLoaded", () => {
  
  if (successMessage && successMessage.trim() !== "" && successMessage !== "undefined") {
    Swal.fire({
      title: 'Éxito',
      text: successMessage,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      setTimeout(() => {
        window.location.href = `/login`;
      }, 1000);
    });
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  if (errorMessage && errorMessage.trim() !== "" && errorMessage !== "undefined") {
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      window.location.href = `/login/recoveryPass`;
    });
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  const formRecovery = document.getElementById("formularioRecuperacion");
  formRecovery.addEventListener("submit", (event) => {
    const email = document.getElementById("inputContraseña").value;
    console.log(email);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "El correo electrónico no tiene un formato válido o está vacío",
      });
      return;
    }
  });
});
