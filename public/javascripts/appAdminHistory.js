function activarMenu() {
  document.getElementById("menuDesplegable").classList.toggle("active");
  document.querySelector(".menu").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".delete-product").forEach((button) => { 
    
    button.addEventListener("click", function (event) {
      event.preventDefault();

      let deleteUrl = this.getAttribute("data-url");
      console.log(deleteUrl);
      

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
