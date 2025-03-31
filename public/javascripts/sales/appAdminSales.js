function activarMenu() {
  document.getElementById("menuDesplegable").classList.toggle("active");
  document.querySelector(".menu").classList.toggle("active");
}
document.addEventListener("DOMContentLoaded", () => {
  //   console.log("DOM Cargado. Inicializando script del POS...");

  // Verificar si io y Swal existen (si se cargan antes)
  if (typeof io === "undefined") {
    console.error(
      "Socket.IO no está cargado. Asegúrate de incluir el script /socket.io/socket.io.js antes que este archivo."
    );
    alert("Error crítico: Falta la librería de comunicación.");
    return;
  }
  if (typeof Swal === "undefined") {
    console.error(
      "SweetAlert2 no está cargado. Asegúrate de incluir el script de SweetAlert2 antes que este archivo."
    );
    // Podrías continuar sin Swal, pero las alertas no funcionarán
  }

  // Conexión Socket.IO
  const socket = io();

  // Referencias a elementos DOM (buscados DESPUÉS de que el DOM cargó)
  const tableBody = document.querySelector("#sale-items tbody");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalPriceEl = document.getElementById("total-price");
  const totalItemsEl = document.getElementById("total-items");
  const finalizeButton = document.getElementById("sale"); // Asegúrate que el ID del botón sea 'sale'

  // Verificación crítica: Asegurarse que los elementos existan
  if (!tableBody) {
    console.error(
      "¡ERROR CRÍTICO! No se encontró el elemento '#sale-items tbody'. Verifica el ID y la estructura de tu tabla HTML."
    );
    if (typeof Swal !== "undefined")
      Swal.fire(
        "Error de Interfaz",
        "No se pudo inicializar la tabla de productos. Contacta al administrador.",
        "error"
      );
    return; // Detener la ejecución si la tabla no existe
  }
  if (!finalizeButton) {
    console.error(
      "¡ERROR CRÍTICO! No se encontró el botón con ID 'sale'. Verifica el ID de tu botón 'Cobrar / Finalizar Venta'."
    );
    if (typeof Swal !== "undefined")
      Swal.fire(
        "Error de Interfaz",
        "No se encontró el botón para finalizar la venta.",
        "error"
      );
    return; // Detener si el botón no existe
  }
  // Puedes añadir verificaciones similares para subtotalEl, taxEl, etc. si son críticos

  // Configuración
  const TAX_RATE = 0.16; // Ejemplo: IVA del 16% (0.16). Pon 0 si no aplica.

  // --- Función para buscar detalles del producto en el backend ---
  // Llama a la API que creaste en el servidor
  async function fetchProductDetails(codeOrEncodedObject) {
    // La API espera el objeto codificado, el listener del socket se encarga de codificarlo si es necesario
    const encodedData = encodeURIComponent(codeOrEncodedObject); // Codificar siempre por si acaso
    try {
      const response = await fetch(
        `/admin/sales/api/products/find-by-code/${encodedData}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(
            `Producto/Complemento con identificador ${decodeURIComponent(
              encodedData
            )} no encontrado en backend.`
          );
        } else {
          console.error(
            `Error del servidor al buscar ${decodeURIComponent(encodedData)}: ${
              response.status
            } ${response.statusText}`
          );
          if (typeof Swal !== "undefined")
            Swal.fire(
              "Error de Servidor",
              `Hubo un problema al buscar el item (${response.status}). Intenta de nuevo.`,
              "error"
            );
        }
        return null; // Indicar que no se encontró o hubo error
      }

      const product = await response.json(); // Espera respuesta consistente { type, code, name, price, lotId?, productId?, complementId?, category? }
      //   console.log(">>> Datos recibidos por fetchProductDetails:", product);

      // Validar y convertir precio recibido del backend
      if (product && typeof product.price === "string") {
        product.price = parseFloat(product.price);
      }
      // Validar la respuesta consistente del backend
      if (
        !product ||
        !product.type ||
        !product.code ||
        !product.name ||
        typeof product.price !== "number" ||
        isNaN(product.price)
      ) {
        console.error(
          `Datos inválidos o incompletos recibidos del backend (Validación fetch):`,
          product
        );
        if (typeof Swal !== "undefined")
          Swal.fire(
            "Error Datos Backend",
            `Se recibieron datos incompletos o incorrectos del producto.`,
            "error"
          );
        return null;
      }
      // Validar ID específico según el tipo
      if (product.type === "pintura" && !product.productId) {
        console.error(`Falta productId para pintura:`, product);
        if (typeof Swal !== "undefined")
          Swal.fire(
            "Error Datos Backend",
            `Falta ID para la pintura.`,
            "error"
          );
        return null;
      }
      if (product.type === "complemento" && !product.complementId) {
        console.error(`Falta complementId para complemento:`, product);
        if (typeof Swal !== "undefined")
          Swal.fire(
            "Error Datos Backend",
            `Falta ID para el complemento.`,
            "error"
          );
        return null;
      }

      //   console.log("Producto validado por fetchProductDetails:", product);
      return product; // Devuelve el objeto validado
    } catch (error) {
      console.error(
        `Error de red o parseo en fetch para ${decodeURIComponent(
          encodedData
        )}:`,
        error
      );
      if (typeof Swal !== "undefined")
        Swal.fire(
          "Error de Red",
          "No se pudo comunicar con el servidor para buscar el producto.",
          "error"
        );
      return null;
    }
  }

  // --- Función para añadir producto/complemento a la tabla HTML ---
  function addProductToTable(product, quantity = 1) {
    // console.log(">>> addProductToTable recibiendo:", product);

    // Validación de datos necesarios para la tabla
    if (
      !product ||
      typeof product.price !== "number" ||
      !product.name ||
      !product.code ||
      !product.type ||
      (product.type === "pintura" && !product.productId) ||
      (product.type === "complemento" && !product.complementId)
    ) {
      console.error(
        "Datos incompletos al intentar añadir a tabla (Validación add):",
        product
      );
      return false;
    }

    const itemCode = product.code; // Código principal (ej: codigo_pintura o codigo)
    const itemLotId = product.lotId; // Lote ID (puede ser null/undefined)
    const itemType = product.type;
    const price = product.price;
    const itemId =
      itemType === "pintura" ? product.productId : product.complementId; // ID principal

    // Identificador único para la fila (combinando tipo, ID y lote si existe)
    const rowIdentifier =
      `${itemType}-${itemId}` + (itemLotId ? `-${itemLotId}` : "");
    const existingRow = tableBody.querySelector(
      `tr[data-identifier="${rowIdentifier}"]`
    );

    if (existingRow) {
      // Incrementar cantidad si la fila ya existe
      const quantityCell = existingRow.querySelector(".item-quantity");
      const importeCell = existingRow.querySelector(".item-importe");
      if (quantityCell && importeCell) {
        const currentQuantity = parseInt(quantityCell.textContent, 10) || 0;
        const newQuantity = currentQuantity + quantity;
        quantityCell.textContent = newQuantity;
        importeCell.textContent = formatCurrency(price * newQuantity);
        console.log(
          `Cantidad actualizada para ${product.name} a ${newQuantity}`
        );
      } else {
        console.error(
          "No se encontraron celdas de cantidad/importe en fila existente:",
          existingRow
        );
        return false; // Error en la estructura de la fila
      }
    } else {
      // Crear nueva fila si no existe
      const row = document.createElement("tr");
      // Guardar todos los datos relevantes como atributos data-*
      row.setAttribute("data-identifier", rowIdentifier); // Identificador único de fila
      row.setAttribute("data-type", itemType);
      row.setAttribute("data-item-id", itemId); // ID principal (productId o complementId)
      row.setAttribute("data-code", itemCode); // Código de barras/producto
      if (itemLotId != null) row.setAttribute("data-lot-id", itemLotId); // Lote si existe y no es null
      if (product.category) row.setAttribute("data-category", product.category); // Categoría si existe (para pinturas)

      const importe = price * quantity;
      // Crear el HTML interno de la fila
      row.innerHTML = `
                <td class="item-quantity">${quantity}</td>
                <td>${product.name} (${
        itemType === "complemento" ? "Comp." : "Pint."
      })</td>
                <td class="item-price">${formatCurrency(price)}</td>
                <td class="item-importe">${formatCurrency(importe)}</td>
                <td><button class="remove-item" onclick="removeItem(this)">X</button></td>
            `;
      tableBody.appendChild(row); // Añadir la fila a la tabla
      //   console.log(`${product.name} (${itemType}) añadido a la tabla.`);
    }
    updateTotals(); // Actualizar totales generales
    return true; // Indicar éxito
  }

  // --- Función para eliminar una fila de la tabla ---
  // Se hace global para que el onclick funcione desde el HTML generado
  window.removeItem = function (button) {
    const row = button.closest("tr"); // Encuentra la fila padre (tr) del botón
    if (row) {
      row.remove(); // Elimina la fila del DOM
      updateTotals(); // Recalcula los totales
      console.log("Fila eliminada");
    }
  };

  // --- Función para actualizar los totales en el resumen ---
  function updateTotals() {
    if (!tableBody) {
      console.error("updateTotals llamado pero tableBody no está disponible.");
      return;
    }

    let currentSubtotal = 0;
    let totalItemsCount = 0;
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const quantityCell = row.querySelector(".item-quantity");
      const importeCell = row.querySelector(".item-importe");

      // Leer importe y cantidad de las celdas
      const importeText = importeCell?.textContent || "0"; // Usar optional chaining y valor por defecto
      const importe = parseFloat(importeText.replace(/[^0-9.-]+/g, "")) || 0; // Extraer número

      const quantityText = quantityCell?.textContent || "1";
      const quantity = parseInt(quantityText, 10) || 1; // Usar 1 si falla

      currentSubtotal += importe;
      totalItemsCount += quantity;
    });

    const currentTax = currentSubtotal * TAX_RATE; // Calcular impuesto
    const currentTotal = currentSubtotal + currentTax; // Calcular total

    // Actualizar los elementos en el HTML con los valores formateados
    if (subtotalEl) subtotalEl.textContent = formatCurrency(currentSubtotal);
    if (taxEl) taxEl.textContent = formatCurrency(currentTax);
    if (totalPriceEl) totalPriceEl.textContent = formatCurrency(currentTotal);
    if (totalItemsEl) totalItemsEl.textContent = totalItemsCount;
  }

  // --- Función para formatear números como moneda MXN ---
  function formatCurrency(amount) {
    const numberAmount = Number(amount);
    if (isNaN(numberAmount)) {
      return "$0.00"; // Valor por defecto en caso de error
    }
    // Intl.NumberFormat es la forma moderna y preferida
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN", // Moneda Mexicana
    }).format(numberAmount);
  }

  // --- Listener Principal para Recibir Datos del Socket ---
  // Escucha el evento 'updatePosWithScannedData' que definimos en el servidor Node.js
  socket.on("updatePosWithScannedData", async (data) => {
    // console.log("Evento 'updatePosWithScannedData' recibido:", data);

    // Validar que 'data' sea un array o un objeto/string procesable
    let itemsToProcess = [];
    if (Array.isArray(data)) {
      itemsToProcess = data;
    } else if (data && (typeof data === "string" || typeof data === "object")) {
      itemsToProcess = [data];
    } else {
      console.warn("Formato de datos no reconocido recibido del socket:", data);
      if (typeof Swal !== "undefined")
        Swal.fire(
          "Datos Inválidos",
          "Se recibieron datos con formato no esperado desde el escáner.",
          "warning"
        );
      return;
    }
    if (itemsToProcess.length === 0) {
      return;
    }

    // Mostrar feedback al usuario mientras se procesa
    if (typeof Swal !== "undefined")
      Swal.fire({
        title: "Procesando Códigos...",
        text: `Buscando ${itemsToProcess.length} item(s)...`,
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

    let productsAddedCount = 0;
    let productsNotFoundCodes = [];

    // Procesar cada código u objeto recibido
    for (const itemData of itemsToProcess) {
      let dataForApi = null;
      let displayCode = ""; // Código para mensajes de error

      // Determinar qué enviar a la API (string simple o JSON string del objeto)
      if (typeof itemData === "string" && itemData.trim() !== "") {
        dataForApi = itemData.trim();
        displayCode = dataForApi;
      } else if (
        typeof itemData === "object" &&
        itemData !== null &&
        itemData.code
      ) {
        // Si llega el objeto COMPLEJO del móvil, lo enviamos codificado
        try {
          dataForApi = JSON.stringify(itemData); // Convertir objeto a JSON string
          displayCode = itemData.code;
        } catch (e) {
          console.error("Error al convertir objeto a JSON:", itemData, e);
          continue; // Saltar este item si falla la conversión
        }
      } else {
        console.warn("Elemento inválido en datos recibidos:", itemData);
        continue; // Saltar este item inválido
      }

      if (dataForApi) {
        const product = await fetchProductDetails(dataForApi); // Llama a API (envía string u objeto JSON codificado)
        if (product) {
          // Intenta añadir a la tabla, devuelve true si tuvo éxito
          if (addProductToTable(product)) {
            productsAddedCount++;
          }
        } else {
          // Si fetchProductDetails devolvió null (no encontrado o error)
          productsNotFoundCodes.push(displayCode || "desconocido");
        }
      }
    }

    if (typeof Swal !== "undefined") Swal.close(); // Cerrar el Swal de "cargando"

    // Mostrar resumen final al usuario
    let summaryTitle = "";
    let summaryText = "";
    let summaryIcon = "info";

    if (productsAddedCount > 0 && productsNotFoundCodes.length === 0) {
      summaryTitle = "¡Éxito!";
      summaryText = `${productsAddedCount} item(s) añadidos/actualizados correctamente.`;
      summaryIcon = "success";
    } else if (productsAddedCount > 0 && productsNotFoundCodes.length > 0) {
      summaryTitle = "Parcialmente Completado";
      summaryText = `${productsAddedCount} item(s) añadidos/actualizados. No se encontraron códigos: ${productsNotFoundCodes.join(
        ", "
      )}.`;
      summaryIcon = "warning";
    } else if (productsAddedCount === 0 && productsNotFoundCodes.length > 0) {
      summaryTitle = "Items No Encontrados";
      summaryText = `No se encontró ningún item para los códigos: ${productsNotFoundCodes.join(
        ", "
      )}.`;
      summaryIcon = "error";
    } else if (productsAddedCount === 0 && productsNotFoundCodes.length === 0) {
      summaryTitle = "Sin Cambios";
      summaryText = "No se procesaron códigos válidos o no se añadieron items.";
      summaryIcon = "info";
    } else {
      summaryTitle = "Proceso Terminado";
      summaryText = "Se terminó de procesar la solicitud.";
      summaryIcon = "info";
    }

    if (typeof Swal !== "undefined")
      Swal.fire(summaryTitle, summaryText, summaryIcon);
  }); // Fin de socket.on("updatePosWithScannedData")

  // --- Función para Finalizar Venta ---
  // Recopila datos de la tabla y los envía al backend via POST
  async function finalizeSale() {
    console.log("Iniciando finalización de venta...");
    const rows = tableBody.querySelectorAll("tr");

    if (rows.length === 0) {
      if (typeof Swal !== "undefined")
        Swal.fire(
          "Venta Vacía",
          "No hay productos en la lista para vender.",
          "warning"
        );
      return;
    }

    const saleItems = [];
    let errorInData = false;

    // Recorrer cada fila de la tabla
    rows.forEach((row) => {
      console.log("Leyendo fila para finalizar:", row.dataset);

      // Leer datos desde los atributos data-* usando .dataset
      const itemType = row.dataset.type;
      const itemId = row.dataset.itemId; // ID principal (productId o complementId)
      const category = row.dataset.category; // Puede ser undefined para complementos
      const lotIdStr = row.dataset.lotId; // Puede ser undefined
      const code = row.dataset.code;

      // Leer cantidad y precios de las celdas
      const quantityCell = row.querySelector(".item-quantity");
      const priceCell = row.querySelector(".item-price");
      const importeCell = row.querySelector(".item-importe");
      const quantity = parseInt(quantityCell?.textContent || "0", 10);
      const unitPrice =
        parseFloat((priceCell?.textContent || "0").replace(/[^0-9.-]+/g, "")) ||
        0;
      const totalItemPrice =
        parseFloat(
          (importeCell?.textContent || "0").replace(/[^0-9.-]+/g, "")
        ) || 0;

      // Validar datos esenciales leídos de esta fila
      if (
        !itemType ||
        !itemId ||
        !code ||
        !quantity ||
        quantity <= 0 ||
        unitPrice <= 0
      ) {
        console.error(
          "Error: Datos inválidos/faltantes en fila:",
          row.dataset,
          `Q:${quantity}`,
          `P:${unitPrice}`
        );
        errorInData = true;
      }

      const parsedItemId = parseInt(itemId, 10);
      const parsedLotId = lotIdStr ? parseInt(lotIdStr, 10) : null; // Parsea lotId solo si existe

      // Construir objeto para el backend, diferenciando ID y añadiendo tipo
      let itemPayload = {
        type: itemType, // Enviar el tipo ('pintura' o 'complemento')
        code: code,
        lotId: isNaN(parsedLotId) ? null : parsedLotId, // Enviar null si no aplica o no es número
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: totalItemPrice,
      };
      // Añadir el ID específico según el tipo
      if (itemType === "pintura") {
        itemPayload.productId = isNaN(parsedItemId) ? null : parsedItemId;
        itemPayload.category = category; // Enviar categoría para pinturas
      } else if (itemType === "complemento") {
        itemPayload.complementId = isNaN(parsedItemId) ? null : parsedItemId;
        // No enviamos category para complementos (a menos que tu backend lo espere)
      }

      saleItems.push(itemPayload);
    });

    if (errorInData) {
      if (typeof Swal !== "undefined")
        Swal.fire(
          "Error en Datos",
          "Se encontraron datos inválidos en uno o más productos de la lista. Revisa la tabla.",
          "error"
        );
      return; // Detener si hay errores
    }

    // Obtener total general de la venta
    const saleTotal =
      parseFloat(
        (totalPriceEl?.textContent || "0").replace(/[^0-9.-]+/g, "")
      ) || 0;

    // Construir el objeto de datos completo para enviar al backend
    const saleData = {
      items: saleItems,
      totalAmount: saleTotal,
      // customerId: ..., // Añadir si tienes selección de cliente
    };

    console.log("Enviando datos de venta al backend:", saleData);

    try {
      // Mostrar un loader mientras se envía
      if (typeof Swal !== "undefined")
        Swal.fire({
          title: "Procesando Venta...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

      // Enviar datos al backend via POST a la ruta de finalización
      // *** ¡ACCIÓN REQUERIDA! Asegúrate que esta ruta POST exista en tu backend ***
      const response = await fetch("/admin/sales/api/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Incluir headers de autenticación si son necesarios
        },
        body: JSON.stringify(saleData), // Enviar los datos como JSON
      });

      if (typeof Swal !== "undefined") Swal.close(); // Cerrar el loader

      if (!response.ok) {
        // Intentar leer el mensaje de error del backend
        const errorData = await response
          .json()
          .catch(() => ({ message: `Error del servidor: ${response.status}` }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      // Venta exitosa
      const result = await response.json(); // Esperar respuesta del backend (ej: { success: true, saleId: 123 })
      console.log("Respuesta del backend:", result);
      if (typeof Swal !== "undefined")
        Swal.fire(
          "¡Venta Realizada!",
          `La venta se registró con éxito (ID: ${result.saleId || "N/A"}).`,
          "success"
        );

      // Limpiar la tabla después de una venta exitosa
      tableBody.innerHTML = ""; // Vaciar el tbody
      updateTotals(); // Resetear los totales a cero
    } catch (error) {
      if (typeof Swal !== "undefined") Swal.close(); // Asegurarse de cerrar el loader en caso de error
      console.error("Error al finalizar la venta:", error);
      if (typeof Swal !== "undefined")
        Swal.fire(
          "Error",
          `No se pudo finalizar la venta: ${error.message}`,
          "error"
        );
    }
  }
  // --- FIN DE finalizeSale ---

  // --- Asignar la función al evento click del botón ---
  finalizeButton.addEventListener("click", finalizeSale);

  // Calcular totales iniciales al cargar la página
  console.log("Calculando totales iniciales...");
  updateTotals();
}); // Fin de document.addEventListener('DOMContentLoaded', ...)
