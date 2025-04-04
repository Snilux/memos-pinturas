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
      if (errorMessage == "El email ya existe") {
        window.location.href = `/users/add`;
      } else if(errorMessage == "No hay productos en este lote"){
        window.location.href = `/admin/lots`;
      } else if (errorMessage == "Categoria invalida") {
        window.location.href = `/admin/products`;
      }
      else{
        window.location.href = `/admin`;
      }

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
      if (successMessage == "Producto editado con éxito") {
        setTimeout(() => {
          window.location.href = `/admin/products`;
        }, 1000);
      } else if (successMessage == "Producto en lote editado con éxito") {
        setTimeout(() => {
          window.location.href = `/admin/lots`;
        }, 1000);
      } else if (successMessage == "Complemento agregado correctamente") {
        setTimeout(() => {
          window.location.href = `/admin/complements`;
        }, 1000);
      } else if (successMessage == "Complemento actualizado correctamente") {
        setTimeout(() => {
          window.location.href = `/admin/complements`;
        }, 1000);
      } else if (successMessage == "Usuario agregado correctamente") {
        setTimeout(() => {
          window.location.href = `/users/add`;
        }, 1000);
      }
      
      
      else {
        setTimeout(() => {
          window.location.href = `/admin/products`;
        }, 1000);
      }
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

  let code = document.getElementById("inputCodigo").value;
  let input = document.getElementById("inputCodigo");
  input.value = code;
  let event = new Event("input", {
    bubbles: true,
  });
  input.dispatchEvent(event);
});

document.addEventListener("DOMContentLoaded", () => {
  let codeC = document.getElementById("inputCodigoC").value;
  console.log(codeC);
  setTimeout(() => {
    let inputC = document.getElementById("inputCodigoC");
    inputC.value = codeC;
    let eventC = new Event("input", {
      bubbles: true,
    });
    inputC.dispatchEvent(eventC);
  }, 1000);
});
