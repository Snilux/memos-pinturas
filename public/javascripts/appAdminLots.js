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
      if (errorMessage === "No hay productos en el lote") {
        window.location.href = `/admin/lots`;
      }
      if (errorMessage === "Introduzca un proveedor valido") {
        return;
      }
      window.location.href = `/admin/lots`;
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
      if (successMessage === "Lote agregado correctamente") {
        setTimeout(() => {
          window.location.href = `/admin/lots`;
        }, 1000);
      }
      if (successMessage === "Lote actualizado correctamente") {
        setTimeout(() => {
          window.location.href = `/admin/lots`;
        }, 500);
      }
    });
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  document.querySelectorAll(".delete-product").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();

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
          Swal.fire({
            title: "Éxito",
            text: "Lote eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then(() => {
            window.location.href = deleteUrl; // Redirige si confirma
          });
        }
      });
    });
  });
});
