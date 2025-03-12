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
      document.getElementById("inputSubCategoria").value =
        producto.subcategoria;
      document.getElementById("inputNombreProducto").value =
        producto.nombreProducto;
      document.getElementById("colorInput").value = producto.color || "";
      document.getElementById("nombreColor").style.backgroundColor =
        producto.colorHex || "transparent";
      document.getElementById("nombreColor").value = producto.colorHex || "#00";
      document.getElementById("inputProveedor").value = "Ipesa";

      setOrReplaceInput("inputLitros", producto.litros, producto.piezasCaja);
      setOrReplaceInput("inputCompra", producto.preciosCompra);
    } else {
      document.getElementById("inputCategoria").value = "";
      document.getElementById("inputSubCategoria").value = "";
      document.getElementById("inputNombreProducto").value = "";
      document.getElementById("colorInput").value = "";
      document.getElementById("nombreColor").style.backgroundColor =
        "transparent";
      document.getElementById("nombreColor").value = "#00";
      document.getElementById("inputProveedor").value = "";

      setOrReplaceInput("inputLitros", []);
      setOrReplaceInput("inputCompra", []);
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
  const container = document.getElementById(id + "Container");
  let input = document.getElementById(id);

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  if (!valores || valores.length === 0) {
    if (input && input.tagName === "SELECT") {
      const newInput = document.createElement("input");
      newInput.type = "number";
      newInput.classList.add("input__formulario");
      newInput.id = id;
      input.replaceWith(newInput);
    }
    if (input) input.value = "";
    return;
  }

  if (valores.length === 1) {
    if (input && input.tagName === "SELECT") {
      const newInput = document.createElement("input");
      newInput.type = "number";
      newInput.classList.add("input__formulario");
      newInput.id = id;
      newInput.value = valores[0];
      input.replaceWith(newInput);
    } else if (input) {
      input.value = valores[0];
    }
  } else {
    if (!input || input.tagName !== "SELECT") {
      const label = document.createElement("label");
      label.textContent =
        id
          .replace("input", "")
          .replace(/([A-Z])/g, " $1")
          .trim() + ":";
      container.appendChild(label);

      const select = document.createElement("select");
      select.classList.add("input__formulario");
      select.id = id;
      select.name = id.replace("input", "").toLowerCase();

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Selecciona una opción";
      select.appendChild(defaultOption);

      valores.forEach((valor, index) => {
        const option = document.createElement("option");
        option.value = valor;
        option.textContent = valor;
        option.dataset.piezas = piezasCaja[index]; // Guarda las piezas en un data attribute
        select.appendChild(option);
      });

      select.addEventListener("change", function () {
        const piezasSeleccionadas =
          this.options[this.selectedIndex].dataset.piezas;
        document.getElementById("inputCajasContainer").value =
          piezasSeleccionadas;
      });

      if (input) {
        input.replaceWith(select);
      } else {
        container.appendChild(select);
      }
    } else {
      input.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Selecciona una opción";
      input.appendChild(defaultOption);

      valores.forEach((valor, index) => {
        const option = document.createElement("option");
        option.value = valor;
        option.textContent = valor;
        option.dataset.piezas = piezasCaja[index];
        input.appendChild(option);
      });

      input.addEventListener("change", function () {
        const piezasSeleccionadas =
          this.options[this.selectedIndex].dataset.piezas;
        document.getElementById("inputCajasContainer").value =
          piezasSeleccionadas;
      });
    }
  }
}
