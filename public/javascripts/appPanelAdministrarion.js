function activarMenu() {
  document.getElementById("menuDesplegable").classList.toggle("active");
  document.querySelector(".menu").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
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
    }).then(() => {
      window.location.href = `/admin`;
    });
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  if (
    successMessage &&
    successMessage.trim() !== "" &&
    successMessage !== "undefined"
  ) {
    Swal.fire({
      title: "Éxito",
      text: successMessage,
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      setTimeout(() => {
        window.location.href = `/admin/products`;
      }, 1000);
    });
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  document.querySelectorAll(".delete-product").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Evita la navegación automática

      let deleteUrl = this.getAttribute("data-url");

      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = deleteUrl; // Redirige si confirma
        }
      });
    });
  });

  
});
