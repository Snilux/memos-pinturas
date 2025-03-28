document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar elementos del formulario
  const codigoInput = document.querySelector(
    'input[name="codigo_complemento"]'
  );
  const productoInput = document.querySelector('input[name="producto"]');
  const caracteristicasTextarea = document.querySelector(
    'textarea[name="caracteristicas"]'
  );
  const cantidadCajaSelect = document.querySelector(
    'select[name="cantidad_caja"]'
  );

  let complementsData = []; // Almacenar datos del JSON

  // Función para cargar los datos del JSON (sin poblar el select inicialmente)
  async function loadComplementsData() {
    try {
      // *** Ajusta la ruta si es necesario ***
      const response = await fetch("/data/complements.JSON");
      if (!response.ok) {
        throw new Error(
          `Error al cargar el archivo JSON: ${response.statusText}`
        );
      }
      complementsData = await response.json();
      // console.log("Datos de complementos cargados:", complementsData);
    } catch (error) {
      console.error(
        "No se pudieron cargar los datos de complements.JSON:",
        error
      );
      // Podrías deshabilitar el input de código o mostrar un error
      if (codigoInput) codigoInput.disabled = true;
      Swal.fire(
        "Error",
        "No se pudieron cargar datos esenciales. El formulario no funcionará correctamente.",
        "error"
      );
    }
  }

  // Cargar los datos cuando el DOM esté listo
  loadComplementsData();

  // --- Event Listener Modificado para el Input de Código ---
  codigoInput.addEventListener("input", (event) => {
    const currentCode = event.target.value.trim().toUpperCase();

    // Encontrar el complemento que coincide
    const foundComplement = complementsData.find(
      (comp) => comp.codigo.trim().toUpperCase() === currentCode
    );

    // Limpiar siempre las opciones anteriores del select
    cantidadCajaSelect.innerHTML = "";

    // Crear y añadir la opción placeholder por defecto
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Selecciona una opción";
    placeholderOption.disabled = true;
    placeholderOption.selected = true; // Por defecto está seleccionada
    cantidadCajaSelect.appendChild(placeholderOption);

    if (foundComplement) {
      // Rellenar otros campos
      productoInput.value = foundComplement.producto || "";
      caracteristicasTextarea.value = foundComplement.caracteristicas || "";

      // Obtener el valor específico de piezasCaja
      const piezas = foundComplement.piezasCaja;

      if (piezas) {
        // Verificar que el valor exista
        // Crear la opción específica para este complemento
        const specificOption = document.createElement("option");
        specificOption.value = piezas;
        specificOption.textContent = piezas;
        cantidadCajaSelect.appendChild(specificOption);

        // Seleccionar automáticamente esta nueva opción
        cantidadCajaSelect.value = piezas;
        // Asegurar que el placeholder ya no esté seleccionado
        placeholderOption.selected = false;

        // console.log(
        //   `Opción ${piezas} añadida y seleccionada para ${currentCode}`
        // );
      } else {
        // Si el complemento existe pero no tiene piezasCaja, dejar solo el placeholder
        cantidadCajaSelect.value = ""; // Asegurar que el placeholder está seleccionado
        placeholderOption.selected = true;
        console.log(
          `Complemento ${currentCode} encontrado, pero sin valor 'piezasCaja'.`
        );
      }
      // console.log("Autocompletado para:", currentCode, foundComplement);
    } else {
      // Si no se encuentra el complemento, limpiar otros campos
      productoInput.value = "";
      caracteristicasTextarea.value = "";
      // El select ya fue limpiado y solo tiene el placeholder seleccionado por defecto
      cantidadCajaSelect.value = "";
      placeholderOption.selected = true;

      console.log("No se encontró complemento para:", currentCode);
    }
  });
  // --- Fin del Event Listener Modificado ---

  // --- Código existente para manejo de SweetAlert ---
  if (errorMessage) {
    Swal.fire({ icon: "error", title: "Error", text: errorMessage });
  }
  if (successMessage) {
    Swal.fire({ icon: "success", title: "Éxito", text: successMessage });
  }

  // --- Código existente para manejo de carga de imagen ---
  const uploadArea = document.getElementById("uploadArea");
  // ... (resto del código de carga de imagen sin cambios, asegúrate que esté completo como en la respuesta anterior) ...
  const imageUpload = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");
  const uploadPlaceholder = uploadArea?.querySelector(".upload-placeholder");

  if (uploadArea && imageUpload && imagePreview && uploadPlaceholder) {
    uploadArea.addEventListener("click", () => imageUpload.click());
    uploadArea.addEventListener("dragover", (event) => {
      /* ... */
    });
    uploadArea.addEventListener("dragleave", () => {
      /* ... */
    });
    uploadArea.addEventListener("drop", (event) => {
      /* ... */
    });
    imageUpload.addEventListener("change", (event) => {
      /* ... */
    });
    function displayImage(file) {
      /* ... */
    }
    // Re-añadir listeners por completitud
    uploadArea.addEventListener("dragover", (event) => {
      event.preventDefault();
      uploadArea.classList.add("dragging");
    });
    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("dragging");
    });
    uploadArea.addEventListener("drop", (event) => {
      event.preventDefault();
      uploadArea.classList.remove("dragging");
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        imageUpload.files = files;
        displayImage(files[0]);
      }
    });
    imageUpload.addEventListener("change", (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        displayImage(files[0]);
      }
    });
    function displayImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        uploadPlaceholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  }
  // --- Fin del código de carga de imagen ---
}); // Fin de DOMC
