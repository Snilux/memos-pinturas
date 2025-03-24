let data = JSON.parse(localStorage.getItem("productosData")) || null;

if (!data) {
  fetch("/data/products.json")
    .then((response) => response.json())
    .then((json) => {
      data = json;
      localStorage.setItem("productosData", JSON.stringify(data));
      setupEventListeners();
    })
    .catch((error) => console.error("Error al cargar datos:", error));
} else {
  setupEventListeners();
}

function setupEventListeners() {
  document.getElementById("inputCodigo").addEventListener("input", function () {
    const codigoIngresado = this.value.trim();
    const producto = data.find((p) => p.codigo === codigoIngresado); // Usar data.find() aquí

    if (producto) {
      document.getElementById("inputCategoria").value = producto.categoria;
      document.getElementById("inputSubCategoria").value = producto.subcategoria;
      document.getElementById("inputNombreProducto").value = producto.nombreProducto;
      document.getElementById("colorInput").value = producto.color || "";
      
      const colorInput = document.getElementById("nombreColor");
      colorInput.value = producto.colorHex || "#000000";
    
      document.getElementById("inputProveedor").value = "Ipesa";
    
      setOrReplaceInput("inputLitros", producto.litros, producto.piezasCaja);
      setOrReplaceInput("inputCompra", producto.preciosCompra);
    } else {
      document.getElementById("inputCategoria").value = "";
      document.getElementById("inputSubCategoria").value = "";
      document.getElementById("inputNombreProducto").value = "";
      document.getElementById("colorInput").value = "";
    
      const colorInput = document.getElementById("nombreColor");
      colorInput.value = "#000000"; // Valor por defecto para evitar errores
      colorInput.style.backgroundColor = "transparent";
    
      document.getElementById("inputProveedor").value = "";
    
      setOrReplaceInput("inputLitros", []);
    }
  });

  document
    .getElementById("formularioLogin")
    .addEventListener("submit", function (event) {
      let errores = [];

      const precioVenta = document.getElementById("inputVenta").value.trim();
      const regexPrecio = /^\d+(\.\d{1,2})?$/;

      if (!regexPrecio.test(precioVenta)) {
        errores.push("El precio de venta debe ser un número válido");
      }

      const cantidadDisponible = document
        .getElementById("inputCantidad")
        .value.trim();
      const regexCantidad = /^\d+$/;

      if (!regexCantidad.test(cantidadDisponible)) {
        errores.push("La cantidad disponible debe ser un número entero.");
      }

      const lote = document.getElementById("inputLote").value.trim();

      if (!regexCantidad.test(lote)) {
        errores.push("El lote debe ser entero");
      }

      document
        .getElementById("inputFoto")
        .addEventListener("change", function () {
          const archivo = this.files[0];
          if (archivo && !archivo.type.startsWith("image/")) {
            errores.push("El archivo debe ser una imagen.");
          }
        });

      if (errores.length > 0) {
        event.preventDefault();
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          html: errores.join("<br>"),
        });
      }
    });
}

function setOrReplaceInput(id, valores, piezasCaja) {
  const select = document.getElementById(id);
  const inputCajas = document.getElementById("inputCajasContainer");

  if (!select || !inputCajas) return;

  // Limpiar opciones actuales del select
  select.innerHTML = "";

  // Agregar la opción por defecto
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "Selecciona una opción";
  select.appendChild(defaultOption);

  // Si no hay valores, deshabilitar el select y limpiar el input
  if (!valores || valores.length === 0) {
    select.disabled = true;
    inputCajas.value = "";
    return;
  }

  // Agregar nuevas opciones basadas en los valores
  valores.forEach((valor, index) => {
    const option = document.createElement("option");
    option.value = valor;
    option.textContent = `${valor} Litro${valor > 1 ? 's' : ''}`;
    option.dataset.piezas = piezasCaja[index]; // Guarda las piezas en un data attribute
    select.appendChild(option);
  });

  // Habilitar el select
  select.disabled = false;

  // Evento para actualizar el input de piezas por caja
  select.addEventListener("change", function () {
    const piezasSeleccionadas = this.options[this.selectedIndex].dataset.piezas;
    inputCajas.value = piezasSeleccionadas || "";
  });
}


