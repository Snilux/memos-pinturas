function activarMenu() {
  document.getElementById("menuDesplegable").classList.toggle("active");
  document.querySelector(".menu").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  // console.log("DOM Cargado. Inicializando script del POS...");

  const socket = io();

  const tableBody = document.querySelector("#sale-items tbody");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalPriceEl = document.getElementById("total-price");
  const totalItemsEl = document.getElementById("total-items");
  const finalizeButton = document.getElementById("sale");

  if (!tableBody) {
    console.error(
      "¡ERROR CRÍTICO! No se encontró el elemento '#sale-items tbody'. Verifica el ID y la estructura de tu tabla HTML."
    );
    Swal.fire(
      "Error de Interfaz",
      "No se pudo inicializar la tabla de productos. Contacta al administrador.",
      "error"
    );
    return;
  }
  async function fetchProductDetails(code) {
    try {
      const encodedCode = encodeURIComponent(code);
      const response = await fetch(
        `/admin/sales/api/products/find-by-code/${encodedCode}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Producto con código ${code} no encontrado en backend.`);
        } else {
          console.error(
            `Error del servidor al buscar ${code}: ${response.status} ${response.statusText}`
          );
          Swal.fire(
            "Error de Servidor",
            `Hubo un problema al buscar el producto (${response.status}). Intenta de nuevo.`,
            "error"
          );
        }
        return null;
      }

      const product = await response.json(); // Espera { code, name, price }

      //   console.log(">>> Datos recibidos por fetchProductDetails:", product);

      if (product && typeof product.price === "string") {
        product.price = parseFloat(product.price);
      }

      if (
        !product ||
        !product.idProduct ||
        !product.category ||
        !product.code ||
        !product.name ||
        typeof product.price !== "number" ||
        isNaN(product.price)
      ) {
        console.error(
          `Datos inválidos o incompletos recibidos del backend para ${code} (Validación ajustada):`,
          product
        );
        Swal.fire(
          "Error Datos Backend",
          `Se recibieron datos incompletos o incorrectos para el producto ${code}.`,
          "error"
        );
        return null;
      }

      return product;
    } catch (error) {
      console.error(`Error de red o parseo en fetch para ${code}:`, error);
      Swal.fire(
        "Error de Red",
        "No se pudo comunicar con el servidor para buscar el producto.",
        "error"
      );
      return null;
    }
  }

  function addProductToTable(product, quantity = 1) {
    console.log(product);

    if (
      !product ||
      typeof product.price !== "number" ||
      !product.name ||
      !product.code
    ) {
      console.error(
        "Datos incompletos al intentar añadir a la tabla:",
        product
      );
      return false;
    }

    const productCode = product.code;
    const price = product.price;

    const existingRow = tableBody.querySelector(
      `tr[data-code="${productCode}"]`
    );

    if (existingRow) {
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
          "No se encontraron celdas de cantidad/importe en fila:",
          existingRow
        );
        return false;
      }
    } else {
      const row = document.createElement("tr");

      row.setAttribute("data-code", productCode); // Guarda el código de barras/pintura
      row.setAttribute("data-product-id", product.idProduct); // Guarda el ID del producto
      row.setAttribute("data-category", product.category); // Guarda la categoría

      const importe = price * quantity;

      row.innerHTML = `
            <td class="item-quantity">${quantity}</td>
            <td>${product.name}</td>
            <td class="item-price">${formatCurrency(price)}</td>
            <td class="item-importe">${formatCurrency(importe)}</td>
            <td><button class="remove-item" onclick="removeItem(this)">X</button></td>
        `;

      tableBody.appendChild(row);
    }

    updateTotals();
    return true;
  }
  window.removeItem = function (button) {
    const row = button.closest("tr");
    if (row) {
      row.remove();
      updateTotals();
      console.log("Fila eliminada");
    }
  };

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

      const importeText = importeCell?.textContent || "0";
      const importe = parseFloat(importeText.replace(/[^0-9.-]+/g, "")) || 0;

      const quantityText = quantityCell?.textContent || "1";
      const quantity = parseInt(quantityText, 10) || 1;

      currentSubtotal += importe;
      totalItemsCount += quantity;
    });

    const currentTax = 0;
    const currentTotal = currentSubtotal + currentTax;

    if (subtotalEl) subtotalEl.textContent = formatCurrency(currentSubtotal);
    if (taxEl) taxEl.textContent = formatCurrency(currentTax);
    if (totalPriceEl) totalPriceEl.textContent = formatCurrency(currentTotal);
    if (totalItemsEl) totalItemsEl.textContent = totalItemsCount;
  }

  function formatCurrency(amount) {
    const numberAmount = Number(amount);
    if (isNaN(numberAmount)) {
      return "$0.00";
    }
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(numberAmount);
  }

  socket.on("updatePosWithScannedData", async (data) => {
    // console.log("Evento 'updatePosWithScannedData' recibido en navegador:", data);

    let codesToProcess = [];
    if (Array.isArray(data)) {
      codesToProcess = data;
    } else if (typeof data === "string" && data.trim() !== "") {
      codesToProcess = [data];
    } else {
      console.warn("Formato de datos no reconocido recibido del socket:", data);
      Swal.fire(
        "Datos Inválidos",
        "Se recibieron datos con formato no esperado desde el escáner.",
        "warning"
      );
      return;
    }

    if (codesToProcess.length === 0) {
      console.log("No se recibieron códigos válidos para procesar.");
      return;
    }

    Swal.fire({
      title: "Procesando Códigos...",
      text: `Buscando ${codesToProcess.length} producto(s)...`,
      allowOutsideClick: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    let productsAddedCount = 0;
    let productsNotFoundCodes = [];

    for (const codeOrObject of codesToProcess) {
      let productCodeToFetch = null;
      if (typeof codeOrObject === "string" && codeOrObject.trim() !== "") {
        productCodeToFetch = codeOrObject.trim();
      } else if (
        typeof codeOrObject === "object" &&
        codeOrObject !== null &&
        codeOrObject.code
      ) {
        productCodeToFetch = codeOrObject.code;
      } else {
        console.warn("Elemento inválido en datos recibidos:", codeOrObject);
        continue;
      }

      if (productCodeToFetch) {
        const product = await fetchProductDetails(productCodeToFetch);
        if (product) {
          if (addProductToTable(product)) {
            productsAddedCount++;
          }
        } else {
          productsNotFoundCodes.push(productCodeToFetch);
        }
      }
    }

    Swal.close(); // Cerrar el Swal de "cargando"

    let summaryTitle = "";
    let summaryText = "";
    let summaryIcon = "info";

    if (productsAddedCount > 0 && productsNotFoundCodes.length === 0) {
      summaryTitle = "¡Éxito!";
      summaryText = `${productsAddedCount} producto(s) añadidos/actualizados correctamente.`;
      summaryIcon = "success";
    } else if (productsAddedCount > 0 && productsNotFoundCodes.length > 0) {
      summaryTitle = "Parcialmente Completado";
      summaryText = `${productsAddedCount} producto(s) añadidos/actualizados. No se encontraron códigos: ${productsNotFoundCodes.join(
        ", "
      )}.`;
      summaryIcon = "warning";
    } else if (productsAddedCount === 0 && productsNotFoundCodes.length > 0) {
      summaryTitle = "Productos No Encontrados";
      summaryText = `No se encontró ningún producto para los códigos: ${productsNotFoundCodes.join(
        ", "
      )}.`;
      summaryIcon = "error";
    } else if (productsAddedCount === 0 && productsNotFoundCodes.length === 0) {
      summaryTitle = "Sin Cambios";
      summaryText =
        "No se procesaron códigos válidos o no se añadieron productos.";
      summaryIcon = "info";
    } else {
      // Caso inesperado
      summaryTitle = "Proceso Terminado";
      summaryText = "Se terminó de procesar la solicitud.";
      summaryIcon = "info";
    }

    Swal.fire(summaryTitle, summaryText, summaryIcon);
  });

  async function finalizeSale() {
    console.log("Iniciando finalización de venta...");
    const rows = tableBody.querySelectorAll("tr");

    if (rows.length === 0) {
      Swal.fire(
        "Venta Vacía",
        "No hay productos en la lista para vender.",
        "warning"
      );
      return;
    }

    const saleItems = [];
    let errorInData = false;

    rows.forEach((row) => {
      const quantityCell = row.querySelector(".item-quantity");
      const priceCell = row.querySelector(".item-price"); // Precio unitario
      const importeCell = row.querySelector(".item-importe"); // Importe total fila

      // Extraer datos guardados en atributos data-*
      const productId = row.dataset.productId; // dataset accede a data-*
      const category = row.dataset.category;
      const code = row.dataset.code; // codigo_pintura

      const quantity = parseInt(quantityCell?.textContent || "0", 10);
      const unitPriceText = priceCell?.textContent || "0";
      const unitPrice =
        parseFloat(unitPriceText.replace(/[^0-9.-]+/g, "")) || 0;
      const totalItemPriceText = importeCell?.textContent || "0";
      const totalItemPrice =
        parseFloat(totalItemPriceText.replace(/[^0-9.-]+/g, "")) || 0;

      // Validar datos extraídos
      if (
        !productId ||
        !category ||
        !code ||
        quantity <= 0 ||
        unitPrice <= 0
      ) {
        console.error(
          "Error: Datos inválidos o faltantes en la fila:",
          row.dataset,
          `Q:${quantity}`,
          `P:${unitPrice}`
        );
        errorInData = true; // Marcar que hubo un error
      }

      saleItems.push({
        productId: parseInt(productId, 10), // Convertir IDs a número si es necesario
        category: category,
        code: code,
        quantity: quantity,
        unitPrice: unitPrice, // Precio al momento de la venta
        totalPrice: totalItemPrice, // Importe calculado al momento de la venta
      });
    });

    if (errorInData) {
      Swal.fire(
        "Error en Datos",
        "Se encontraron datos inválidos en uno o más productos de la lista. Revisa la tabla.",
        "error"
      );
      return; // Detener si hay errores
    }

    // Obtener datos generales de la venta (ej. total, cliente)
    const saleTotal =
      parseFloat(
        (totalPriceEl?.textContent || "0").replace(/[^0-9.-]+/g, "")
      ) || 0;
    // const customerId = document.getElementById('customer-id')?.value || null; // Si tienes un campo para ID de cliente

    // Construir el objeto de datos a enviar
    const saleData = {
      items: saleItems,
      totalAmount: saleTotal,
      // customerId: customerId, // Añadir ID del cliente si aplica
      // Otros datos: fecha, método de pago (si lo preguntas antes), etc.
    };

    console.log("Enviando datos de venta al backend:", saleData);

    try {
      // Mostrar un loader mientras se envía
      Swal.fire({
        title: "Procesando Venta...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // *** ¡ACCIÓN REQUERIDA! Crea esta ruta POST en tu backend ***
      const response = await fetch("/admin/sales/api/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Incluir headers de autenticación si son necesarios (ej. JWT)
          // 'Authorization': `Bearer ${your_jwt_token}`
        },
        body: JSON.stringify(saleData), // Enviar los datos como JSON
      });

      Swal.close(); // Cerrar el loader

      if (!response.ok) {
        // Intentar leer el mensaje de error del backend si lo hay
        const errorData = await response
          .json()
          .catch(() => ({ message: `Error del servidor: ${response.status}` }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      // Venta exitosa
      const result = await response.json(); // Esperar respuesta del backend (ej: { success: true, saleId: 123 })
      console.log("Respuesta del backend:", result);
      Swal.fire(
        "¡Venta Realizada!",
        `La venta se registró con éxito (ID: ${result.saleId || "N/A"}).`,
        "success"
      );

      // Limpiar la tabla después de una venta exitosa
      tableBody.innerHTML = ""; // Vaciar el tbody
      updateTotals(); // Resetear los totales a cero
    } catch (error) {
      Swal.close(); // Asegurarse de cerrar el loader en caso de error
      console.error("Error al finalizar la venta:", error);
      Swal.fire(
        "Error",
        `No se pudo finalizar la venta: ${error.message}`,
        "error"
      );
    }
  }
  finalizeButton.addEventListener("click", finalizeSale);

  // console.log("Calculando totales iniciales...");
  updateTotals();
});
