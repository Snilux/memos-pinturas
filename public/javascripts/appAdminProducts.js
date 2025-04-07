let data = null;

function fetchDataAndSetup() {
  // *** CORRECCIÓN: Usar .json en minúsculas ***
  fetch("/data/products.JSON")
    .then((response) => {
      // Verificar si la respuesta HTTP fue exitosa (ej: 200 OK)
      if (!response.ok) {
        // Si no fue exitosa (ej: 404), lanzar un error para ir al .catch
        throw new Error(
          `Error HTTP ${response.status} al cargar ${response.url}`
        );
      }
      // Solo intentar parsear JSON si la respuesta fue exitosa
      return response.json();
    })
    .then((json) => {
      console.log("Datos de products.JSON cargados exitosamente.");
      data = json; // Guardar datos en la variable global
      // localStorage.setItem("productosData", JSON.stringify(data)); // Descomentar si usas localStorage
      setupEventListeners(); // Configurar listeners DESPUÉS de cargar datos
    })
    .catch((error) => {
      // Capturar errores de red (ej: 404) o de parseo JSON
      console.error("Error al cargar o procesar /data/products.JSON:", error);
      // Mostrar error al usuario indicando que el autocompletado no funcionará
      if (typeof Swal !== "undefined") {
        Swal.fire(
          "Error de Carga",
          "No se pudo cargar la información de productos. La función de autocompletar no estará disponible.",
          "error"
        );
      }
      // AÚN ASÍ configurar listeners básicos del formulario si es necesario
      // setupEventListeners(); // Decide si quieres configurar listeners aunque falle la carga
    });
}

// Iniciar la carga de datos (generalmente al inicio o en DOMContentLoaded)
fetchDataAndSetup();

// Función para configurar los listeners de eventos
function setupEventListeners() {
  console.log("Configurando listeners...");
  const codigoInput = document.getElementById("inputCodigo");
  const form =
    document.getElementById("formularioLogin") ||
    document.getElementById("formularioEditar"); // Asumiendo posibles IDs

  if (codigoInput) {
    codigoInput.addEventListener("input", function () {
      // Asegurarse que 'data' se haya cargado antes de usarlo
      if (!data) {
        console.warn(
          "Intentando autocompletar, pero los datos de products.json no están listos o fallaron al cargar."
        );
        return;
      }

      const codigoIngresado = this.value.trim();
      // Asegúrate que la propiedad en tu JSON se llame 'codigo'
      const producto = data.find((p) => p.codigo === codigoIngresado);

      // Referencias a los campos (mejor obtenerlas aquí por si acaso)
      const categoriaInput = document.getElementById("inputCategoria");
      const subCategoriaInput = document.getElementById("inputSubCategoria");
      const nombreProductoInput = document.getElementById(
        "inputNombreProducto"
      );
      const colorNombreInput = document.getElementById("colorInput");
      const colorHexInput = document.getElementById("nombreColor");
      const proveedorInput = document.getElementById("inputProveedor");
      const litrosSelect = document.getElementById("inputLitros");
      const compraInput = document.getElementById("inputCompra"); // Asumiendo este ID para precio compra

      if (producto) {
        // Autocompletar campos (con verificación de existencia del elemento)
        if (categoriaInput) categoriaInput.value = producto.categoria || "";
        if (subCategoriaInput)
          subCategoriaInput.value = producto.subcategoria || "";
        if (nombreProductoInput)
          nombreProductoInput.value = producto.nombreProducto || "";
        if (colorNombreInput) colorNombreInput.value = producto.color || "";
        if (colorHexInput) colorHexInput.value = producto.colorHex || "#000000";
        if (proveedorInput) proveedorInput.value = "Ipesa"; // O producto.proveedor

        // Llamar a la función para manejar los selects (si todavía existe)
        // Asegúrate que 'producto.litros', 'producto.piezasCaja', 'producto.preciosCompra' existan en tu JSON
        if (typeof setOrReplaceInput === "function") {
          if (litrosSelect)
            setOrReplaceInput(
              "inputLitros",
              producto.litros || [],
              producto.piezasCaja || []
            );
          if (compraInput)
            setOrReplaceInput("inputCompra", producto.preciosCompra || []); // ¿También es un select? Ajusta si es input normal
        }
      } else {
        // Limpiar campos si no se encuentra el código
        if (categoriaInput) categoriaInput.value = "";
        if (subCategoriaInput) subCategoriaInput.value = "";
        if (nombreProductoInput) nombreProductoInput.value = "";
        if (colorNombreInput) colorNombreInput.value = "";
        if (colorHexInput) colorHexInput.value = "#000000";
        if (proveedorInput) proveedorInput.value = "";

        if (typeof setOrReplaceInput === "function") {
          if (litrosSelect) setOrReplaceInput("inputLitros", [], []); // Limpiar litros
          // Limpiar compra si es necesario:
          // if (compraInput) setOrReplaceInput("inputCompra", []);
        }
      }
    }); // Fin listener inputCodigo
  } else {
    console.warn("Input #inputCodigo no encontrado.");
  }

  // Listener del formulario para validación (asegúrate que el ID sea correcto)
  if (form) {
    form.addEventListener("submit", function (event) {
      let errores = [];
      // --- Tus validaciones ---
      const precioVentaEl = document.getElementById("inputVenta");
      const cantidadEl = document.getElementById("inputCantidad");
      const loteEl = document.getElementById("inputLote");
      // const fotoEl = document.getElementById("inputFoto"); // Si tienes validación de foto

      const precioVenta = precioVentaEl ? precioVentaEl.value.trim() : "";
      const regexPrecio = /^\d+(\.\d{1,2})?$/;
      if (!regexPrecio.test(precioVenta)) {
        errores.push(
          "El precio de venta debe ser un número válido (ej: 100 o 100.50)."
        );
      }

      const cantidadDisponible = cantidadEl ? cantidadEl.value.trim() : "";
      const regexCantidad = /^\d+$/;
      if (!regexCantidad.test(cantidadDisponible)) {
        errores.push("La cantidad disponible debe ser un número entero.");
      }

      const lote = loteEl ? loteEl.value.trim() : "";
      if (!regexCantidad.test(lote)) {
        // Asumiendo que lote también debe ser entero
        errores.push("El número de lote debe ser un número entero.");
      }

      // Validación de imagen (si aplica)
      // const archivo = fotoEl ? fotoEl.files[0] : null;
      // if (archivo && !archivo.type.startsWith("image/")) {
      //     errores.push("El archivo debe ser una imagen.");
      // }
      // --- Fin Validaciones ---

      if (errores.length > 0) {
        event.preventDefault(); // Detener envío
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "error",
            title: "Error de Validación",
            html: errores.join("<br>"),
          });
        } else {
          alert("Error de validación:\n" + errores.join("\n"));
        }
      }
    }); // Fin listener submit
  } else {
    console.warn(
      "Formulario #formularioLogin o #formularioEditar no encontrado."
    );
  }
} // Fin de setupEventListeners

// --- Función setOrReplaceInput (si la sigues usando para selects dinámicos) ---
// Recuerda que esta función BORRA y RECREA las opciones del select
function setOrReplaceInput(id, valores, piezasCaja) {
  const select = document.getElementById(id);
  // Solo actualiza inputCajas si el select es inputLitros
  const inputCajas =
    id === "inputLitros"
      ? document.getElementById("inputCajasContainer")
      : null;

  if (!select) {
    console.warn(`Select con ID #${id} no encontrado en setOrReplaceInput.`);
    return;
  }
  if (id === "inputLitros" && !inputCajas) {
    console.warn(
      `Input #inputCajasContainer no encontrado para actualizar con #inputLitros.`
    );
  }

  // Guardar listener existente de 'change' si lo hay, para removerlo
  const existingListener = select.changeListener;
  if (existingListener) {
    select.removeEventListener("change", existingListener);
  }

  // Limpiar opciones actuales
  select.innerHTML = "";

  // Opción por defecto
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "Selecciona una opción";
  select.appendChild(defaultOption);

  // Si no hay valores válidos
  if (!valores || !Array.isArray(valores) || valores.length === 0) {
    select.disabled = true;
    if (inputCajas) inputCajas.value = ""; // Limpiar cajas si aplica
    return;
  }

  // Agregar nuevas opciones
  valores.forEach((valor, index) => {
    const option = document.createElement("option");
    option.value = valor;
    // Ajustar texto si es para litros u otra cosa
    if (id === "inputLitros") {
      option.textContent = `${valor} Litro${Number(valor) !== 1 ? "s" : ""}`;
      // Añadir data-piezas solo si es el select de litros y piezasCaja existe
      if (piezasCaja && piezasCaja[index] !== undefined) {
        option.dataset.piezas = piezasCaja[index];
      }
    } else {
      option.textContent = valor; // Texto genérico para otros selects
    }
    select.appendChild(option);
  });

  // Habilitar
  select.disabled = false;

  // Añadir listener 'change' solo si es el select de litros
  if (id === "inputLitros" && inputCajas) {
    select.changeListener = function () {
      // Guardar referencia al listener
      const selectedOption = this.options[this.selectedIndex];
      const piezasSeleccionadas = selectedOption
        ? selectedOption.dataset.piezas
        : "";
      inputCajas.value = piezasSeleccionadas || "";
    };
    select.addEventListener("change", select.changeListener);
    // Disparar evento change para actualizar piezas por caja inicialmente si hay valor
    if (select.value) {
      select.dispatchEvent(new Event("change"));
    }
  }
} // Fin de setOrReplaceInput
