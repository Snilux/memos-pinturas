document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando script para PDF de Complemento...");

  // Verificar dependencias (si se cargan antes)
  if (typeof html2canvas !== "function") {
    console.error(
      "La librería html2canvas no está cargada. Asegúrate de incluirla ANTES de este script."
    );
    // Podrías mostrar un error al usuario
  }
  if (typeof jspdf === "undefined" || typeof jspdf.jsPDF === "undefined") {
    console.error(
      "La librería jsPDF no está cargada. Asegúrate de incluirla ANTES de este script."
    );
  }

  // --- LÓGICA PARA GENERAR PDF ---
  const printButton = document.getElementById("print-button");
  const elementToPrint = document.getElementById("etiquetaParaImprimir"); // ID del div principal

  if (printButton && elementToPrint) {
    printButton.addEventListener("click", async (event) => {
      event.preventDefault();

      // *** CAMBIO: Leer el código del complemento desde el nuevo ID ***
      const codigoElement = elementToPrint.querySelector(
        "#detalle-codigo-complemento"
      );
      const codigoComplemento = codigoElement
        ? codigoElement.textContent.trim()
        : "etiqueta_complemento"; // Default filename
      // *** ---------------------------------------------------- ***

      console.log(
        "Iniciando generación de PDF para Complemento:",
        codigoComplemento
      );
      printButton.textContent = "Generando PDF...";
      printButton.disabled = true;
      printButton.style.cursor = "wait";

      // Esperar a que la imagen QR cargue (si existe)
      const qrImage = elementToPrint.querySelector(".qr-code-container img");
      let imageLoadedPromise = Promise.resolve();
      if (qrImage && qrImage.src && !qrImage.complete) {
        console.log("Esperando carga de imagen QR...");
        imageLoadedPromise = new Promise((resolve, reject) => {
          qrImage.onload = () => {
            console.log("Imagen QR cargada.");
            resolve();
          };
          qrImage.onerror = (err) => {
            console.error("Error al cargar imagen QR.");
            reject(new Error("No se pudo cargar la imagen QR."));
          };
          setTimeout(
            () => reject(new Error("Timeout esperando imagen QR.")),
            5000
          );
        });
      } else if (qrImage && qrImage.complete) {
        console.log("Imagen QR ya estaba cargada.");
      } else {
        console.log("No se encontró imagen QR o no tiene src.");
      }

      try {
        await imageLoadedPromise; // Esperar imagen

        // Verificar si las librerías están disponibles antes de usarlas
        if (typeof html2canvas !== "function")
          throw new Error("html2canvas no está definido.");
        if (typeof jspdf === "undefined" || typeof jspdf.jsPDF === "undefined")
          throw new Error("jsPDF no está definido.");

        // PASO 1: Capturar el elemento con html2canvas
        console.log("Llamando a html2canvas...");
        const canvasOptions = { scale: 2, useCORS: true, logging: false };
        const canvas = await html2canvas(elementToPrint, canvasOptions);
        console.log("Canvas generado.");
        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // PASO 2: Generar el PDF usando jsPDF directamente
        console.log("Creando PDF con jsPDF...");
        const { jsPDF } = window.jspdf; // Obtener constructor

        // Opciones y creación del PDF
        const pdfFormat = "a5"; // Mantener A5 o ajustar
        const pdfOrientation = "portrait";
        const margin = 10; // mm
        const pdf = new jsPDF(pdfOrientation, "mm", pdfFormat);

        // Calcular dimensiones y posición de la imagen
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;
        const imgProps = pdf.getImageProperties(imgData);
        const imgRatio = imgProps.width / imgProps.height;
        let imgWidth = usableWidth;
        let imgHeight = imgWidth / imgRatio;
        if (imgHeight > usableHeight) {
          imgHeight = usableHeight;
          imgWidth = imgHeight * imgRatio;
        }
        const xPos = margin + (usableWidth - imgWidth) / 2;
        const yPos = margin; // Alinear arriba

        console.log(
          `Añadiendo imagen al PDF - w:${imgWidth.toFixed(
            1
          )}mm, h:${imgHeight.toFixed(1)}mm`
        );

        pdf.addImage(imgData, "JPEG", xPos, yPos, imgWidth, imgHeight);

        // Guardar el PDF
        const filename = `etiqueta_${codigoComplemento}.pdf`; // Nombre de archivo ajustado
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
      "No se encontró el botón #print-button o el div #etiquetaParaImprimir."
    );
  }
});
