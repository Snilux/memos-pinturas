document.addEventListener("DOMContentLoaded", () => {
  // Script para mensajes flash
  if (typeof Swal !== "undefined") {
    if (successMessage) {
      Swal.fire({
        icon: "success",
        title: "Realizado",
        text: successMessage,
        timer: 2500,
        showConfirmButton: false,
      });
    }
    if (errorMessage) {
      Swal.fire({ icon: "error", title: "Error", text: errorMessage });
    }
  } else {
    if (successMessage) alert("Realizado: " + successMessage);
    if (errorMessage) alert("Error: " + errorMessage);
  }

  // --- LÓGICA PARA GENERAR PDF ---
  const printButton = document.getElementById("print-button");
  const elementToPrint = document.getElementById("etiquetaParaImprimir");

  if (printButton && elementToPrint) {
    printButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const codigoElement = elementToPrint.querySelector(
        "#detalle-codigo-pintura"
      );
      const codigoPintura = codigoElement
        ? codigoElement.textContent.trim()
        : "etiqueta_producto";

      console.log("Iniciando generación de PDF para:", codigoPintura);
      printButton.textContent = "Generando PDF...";
      printButton.disabled = true;
      printButton.style.cursor = "wait";

      // Esperar a que la imagen QR cargue
      const qrImage = elementToPrint.querySelector(".qr-code-container img");
      let imageLoadedPromise = Promise.resolve();
      if (qrImage && qrImage.src && !qrImage.complete) {
        /* ... espera imagen ... */
      } else if (qrImage && qrImage.complete) {
        console.log("Imagen QR ya estaba cargada.");
      } else {
        console.log("No se encontró imagen QR o no tiene src.");
      }

      try {
        await imageLoadedPromise; // Esperar imagen

        // *** PASO 1: Capturar el elemento con html2canvas ***
        console.log("Llamando a html2canvas directamente...");
        if (typeof html2canvas !== "function") {
          throw new Error(
            "La librería html2canvas no está cargada. Verifica la inclusión del script."
          );
        }
        const canvasOptions = { scale: 2, useCORS: true, logging: false }; // Desactivar logs si ya no se necesitan
        const canvas = await html2canvas(elementToPrint, canvasOptions);
        console.log("Canvas generado por html2canvas.");
        const imgData = canvas.toDataURL("image/jpeg", 0.95); // Convertir a DataURL JPEG

        // *** PASO 2: Generar el PDF usando jsPDF directamente ***
        console.log("Creando PDF con jsPDF...");
        if (
          typeof jspdf === "undefined" ||
          typeof jspdf.jsPDF === "undefined"
        ) {
          throw new Error(
            "La librería jsPDF no está cargada o no se encontró. Verifica la inclusión del script jspdf.umd.min.js."
          );
        }
        const { jsPDF } = window.jspdf; // Obtener el constructor de jsPDF

        // Definir tamaño y márgenes (A5)
        const pdfFormat = "a5";
        const pdfOrientation = "portrait";
        const margin = 10; // mm
        const pdf = new jsPDF(pdfOrientation, "mm", pdfFormat); // Crear instancia

        // Calcular dimensiones de la página y de la imagen para que quepa
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        // Calcular relación de aspecto de la imagen capturada
        const imgProps = pdf.getImageProperties(imgData);
        const imgRatio = imgProps.width / imgProps.height;

        // Calcular dimensiones de la imagen en el PDF manteniendo aspecto
        let imgWidth = usableWidth;
        let imgHeight = imgWidth / imgRatio;

        // Si la altura calculada es mayor que la usable, recalcular basado en la altura
        if (imgHeight > usableHeight) {
          imgHeight = usableHeight;
          imgWidth = imgHeight * imgRatio;
        }

        // Centrar imagen (opcional)
        const xPos = margin + (usableWidth - imgWidth) / 2;
        const yPos = margin + (usableHeight - imgHeight) / 2; // Centrar verticalmente también? O solo arriba?
        // const yPos = margin; // Para alinear arriba

        console.log(
          `Añadiendo imagen al PDF - w:${imgWidth.toFixed(
            1
          )}mm, h:${imgHeight.toFixed(1)}mm at x:${xPos.toFixed(
            1
          )}, y:${yPos.toFixed(1)}`
        );

        // Añadir la imagen (captura del canvas) al PDF
        pdf.addImage(imgData, "JPEG", xPos, yPos, imgWidth, imgHeight);

        // Guardar el PDF
        const filename = `etiqueta_${codigoPintura}.pdf`;
        pdf.save(filename);

        console.log("PDF guardado:", filename);
      } catch (err) {
        // Capturar errores
        console.error("Error durante la generación del PDF:", err);
        const errorMsg = `No se pudo generar el PDF: ${err.message || err}`;
        if (typeof Swal !== "undefined") Swal.fire("Error", errorMsg, "error");
        else alert(errorMsg);
      } finally {
        // Limpieza final: Restaurar botón
        printButton.textContent = "Imprimir Etiqueta";
        printButton.disabled = false;
        printButton.style.cursor = "pointer";
        console.log("Limpieza finalizada.");
      }
    }); // Fin addEventListener
  } else {
    console.error(
      "No se encontró el botón de impresión o el elemento a imprimir."
    );
  }
});
