const fs = require("fs");
const path = require("path");
const connection = require("../config/db");
const qrcode = require("qrcode");

const complementsController = {};
const table = "complementos";

complementsController.showAllComplements = (req, res) => {
  const query = `SELECT * FROM ??`;

  connection.query(query, table, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin");
    }
    //console.log(results);

    res.render("administration/complements/showComplements", {
      title: "Complementos",
      complements: results,
    });
  });
};

complementsController.addComplement = (req, res) => {
  let imagePath = null;
  console.log(req.body);

  if (req.file) {
    imagePath = req.file.filename;
    console.log("Ruta de la imagen:", imagePath);
  } else {
    imagePath = req.body.currentImagePath;
    console.log("No se subió la imagen nueva");
  }
  //   console.log(imagePath);
  //   console.log(req.body);
  const {
    producto,
    caracteristicas,
    cantidad_caja,
    precio_caja,
    precio_unitario,
    precio_unitario_venta,
    lote_id,
    cantidad,
    codigo_complemento,
  } = req.body;

  const query = `INSERT INTO ?? (producto,
    caracteristicas,
    cantidad_caja,
    precio_caja,
    precio_unitario,
    precio_unitario_venta,
    lote_id,
    cantidad, imagen, codigo_complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [
      table,
      producto,
      caracteristicas,
      cantidad_caja,
      precio_caja,
      precio_unitario,
      precio_unitario_venta,
      lote_id,
      cantidad,
      imagePath,
      codigo_complemento,
    ],
    (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        return res.redirect("/admin/complements");
      }
      return res.render("administration/complements/addComplement", {
        title: "Añadir complemento",
        successMessage: "Complemento agregado correctamente",
      });
    }
  );
};

complementsController.editComplement = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM ?? WHERE id_complemento = ?`;

  connection.query(query, [table, id], (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/complements");
    }
    console.log(results);

    return res.render("administration/complements/editComplement", {
      title: "Editar complemento",
      complement: results[0],
    });
  });
};

complementsController.updateComplement = (req, res) => {
  const id_complemento = req.params.id;

  const {
    producto,
    caracteristicas,
    cantidad_caja,
    precio_caja,
    precio_unitario,
    precio_unitario_venta,
    lote_id,
    cantidad,
    codigo_complemento,
    currentImagePath,
  } = req.body;

  let imagePath = currentImagePath;

  if (req.file) {
    imagePath = req.file.filename;

    if (currentImagePath && currentImagePath !== imagePath) {
      const absoluteOldImagePath = path.join(
        __dirname,
        "..",
        "public/uploads/images/",
        currentImagePath
      );
      fs.unlink(absoluteOldImagePath, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen anterior:", err);
        }
      });
    }
  }

  const query = `UPDATE ?? SET producto = ?, caracteristicas = ?, cantidad_caja = ?, precio_caja = ?, precio_unitario = ?, precio_unitario_venta = ?, lote_id = ?, cantidad = ?, imagen = ?, codigo_complemento = ? WHERE id_complemento = ?`;

  connection.query(
    query,
    [
      table,
      producto,
      caracteristicas,
      cantidad_caja,
      precio_caja,
      precio_unitario,
      precio_unitario_venta,
      lote_id,
      cantidad,
      imagePath,
      codigo_complemento,
      id_complemento,
    ],
    (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        return res.redirect("/admin/complements");
      }
      return res.render("administration/complements/editComplement", {
        title: "Editar complemento",
        complement: results,
        successMessage: "Complemento actualizado correctamente",
      });
    }
  );
};

complementsController.deleteComplement = async (req, res) => {
  const id_complemento = req.params.id;

  try {
    const [rows] = await connection
      .promise()
      .query(`SELECT imagen FROM  ${table} WHERE id_complemento = ?`, [
        id_complemento,
      ]);

    if (rows.length > 0) {
      const { imagen } = rows[0];

      await connection
        .promise()
        .query(`DELETE FROM ${table} WHERE id_complemento = ?`, [
          id_complemento,
        ]);

      if (imagen) {
        const absoluteImagePath = path.join(
          __dirname,
          "..",
          "public/uploads/images/",
          imagen
        );
        fs.unlink(absoluteImagePath, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
          }
        });
      }

      res.redirect("/admin/complements");
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).send("Error interno del servidor al eliminar el producto.");
  }
};

complementsController.duplicateComplement = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM ?? WHERE id_complemento = ?`;

  connection.query(query, [table, id], (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/complements");
    }
    // console.log(results);

    return res.render("administration/complements/duplicateComplement", {
      title: "Duplicar complemento",
      complement: results[0],
    });
  });
};

const generateQrCode = async (productDataObj) => {
  if (!productDataObj || typeof productDataObj !== "object") {
    console.error("generateQrCode recibió datos inválidos:", productDataObj);
    throw new Error("Datos inválidos proporcionados para generar QR.");
  }
  // console.log(productDataObj);

  const qrContent = {
    complementId: productDataObj.id_complemento,
    lotId: productDataObj.lote_id,
    price: productDataObj.precio_unitario_venta,
    code: productDataObj.codigo_complemento,
    tipe: "complementos",
    Quantity: productDataObj.cantidad,
  };
  console.log("Datos para qr complementos" + qrContent);

  const qrString = JSON.stringify(qrContent);
  // console.log(`Contenido para qrCode ${qrString}`);

  if (qrString === "{}" || !qrContent.productId) {
    console.warn(
      "El contenido del QR parece estar vacío o incompleto:",
      qrContent
    );
  }

  try {
    const qrDataUrl = await qrcode.toDataURL(qrString);
    return qrDataUrl;
  } catch (error) {
    console.error(`Error al generar qr ${error}`);
    throw new Error("No se pudo generar el código QR.");
  }
};

complementsController.verifyTag = (req, res) => {
  const id = req.params.id;

  const getProductDataQuery = `SELECT * FROM ?? WHERE id_complemento = ?`;

  connection.query(
    getProductDataQuery,
    [table, id],
    (errProduct, productResults) => {
      if (errProduct) {
        console.error(
          `Error al obtener datos del producto (${table}): ${errProduct}`
        );
        return res.status(500).render("error", {
          message: "Error al buscar los datos del producto",
          error: errProduct,
        });
      }

      if (!productResults || productResults.length === 0) {
        console.log(`Producto con ID ${id} no encontrado en ${table}.`);

        return res.status(404).render("error", {
          message: `Producto con ID ${id} no encontrado en la categoría ${category}.`,
        });
      }

      const productData = productResults[0];
      // console.log(productData);

      const idProductoParaEtiqueta = productData.id_complemento;
      // console.log(idProductoParaEtiqueta);

      const findEtiquetaQuery = `SELECT codigo_qr FROM etiquetas WHERE complemento_id = ? LIMIT 1`;

      console.log(
        `Buscando etiqueta existente para id_complemento ${idProductoParaEtiqueta}`
      );

      connection.query(
        findEtiquetaQuery,
        [idProductoParaEtiqueta, table],
        (errEtiqueta, etiquetaResults) => {
          if (errEtiqueta) {
            console.error(`Error al buscar etiqueta existente: ${errEtiqueta}`);
            return res.status(500).render("error", {
              message: "Error al verificar la etiqueta",
              error: errEtiqueta,
            });
          }

          if (etiquetaResults && etiquetaResults.length > 0) {
            const existingQrCode = etiquetaResults[0].codigo_qr;
            console.log(
              `Etiqueta encontrada para id_complemento ${idProductoParaEtiqueta}.`
            );
            res.render("administration/complements/showTag", {
              title: `Etiqueta Existente - ${productData.nombre || "Producto"}`,
              tagValues: productData,
              qrCodeDataUrl: existingQrCode,
              data: req.session.user,
            });
          } else {
            console.log(
              `No se encontró etiqueta para id_complemento ${idProductoParaEtiqueta}.`
            );
            console.log(productData);
            res.render("administration/complements/generateTag", {
              title: `Generar Etiqueta - ${productData.nombre || "Producto"}`,
              tagValues: productData,
              data: req.session.user,
            });
          }
        }
      );
    }
  );
};

complementsController.generateTag = (req, res) => {
  const id = req.params.id;

  if (!table) {
    console.error(`Error: Categoría inválida "${category}"`);
    return res.redirect("/admin/products");
  }

  const query = `SELECT * FROM ?? WHERE id_complemento = ?`;

  connection.query(query, [table, id], async (err, results) => {
    if (err) {
      console.error(`Error en el servidor ${err}`);
      return res.status(500).render("error", {
        message: "Error al buscar el producto",
        error: err,
      });
    }

    if (!results || results.length === 0) {
      console.log(`Producto con ID ${id} no encontrado en la tabla ${table}`);
      return res.status(404).render("error", {
        message: `Producto con ID ${id} no encontrado en la categoría ${category}`,
      });
    }

    const productData = results[0];

    console.log(productData);

    try {
      const qrCodeDataUrl = await generateQrCode(productData);
      const insertEtiquetaQuery =
        "INSERT INTO etiquetas (complemento_id, lote_id, codigo_qr,tabla, fecha_creacion) VALUES (?, ?, ?, ? , NOW())";
      connection.query(
        insertEtiquetaQuery,
        [productData.id_complemento, productData.lote_id, qrCodeDataUrl, table],
        (saveErr, saveResult) => {
          if (saveErr) {
            console.error("Error guardando la etiqueta en la BD:", saveErr);
          } else {
            console.log(
              "Etiqueta guardada en la BD con ID:",
              saveResult.insertId
            );
          }
        }
      );

      return res.render("administration/complements/showTag", {
        title: `Etiquetas`,
        tagValues: productData,
        qrCodeDataUrl: qrCodeDataUrl,
        data: req.session.user,
      });
    } catch (error) {
      console.error(
        `Error durante la generación/procesamiento del QR: ${error}`
      );
      return res.status(500).render("error", {
        message: "Error al generar la etiqueta QR",
        error: error,
      });
    }
  });
};

complementsController.searchComplements = (req, res) => {
  const { value } = req.query;
  // Asegúrate de que 'table' esté definido correctamente en tu scope // Asumiendo que la tabla se llama 'complementos'

  // --- Consulta SQL Mejorada (con CAST para MariaDB) ---
  // Añadimos CAST(... AS CHAR) para los campos no textuales, como discutimos antes.
  // Ahora hay 6 condiciones LIKE y 6 placeholders '?'
  const query = `
    SELECT 'Complementos' AS tabla,
           id_complemento,
           producto,
           caracteristicas,
           cantidad_caja,
           precio_caja,
           precio_unitario,
           precio_unitario_venta,
           lote_id ,
           cantidad,
           imagen,
           codigo_complemento
    FROM ${table}
    WHERE producto LIKE ?
       OR codigo_complemento LIKE ?
       OR CAST(id_complemento AS CHAR) LIKE ?  
       OR CAST(cantidad AS CHAR) LIKE ?        
       OR CAST(lote_id AS CHAR) LIKE ?         
       OR caracteristicas LIKE ?;
  `;

  const searchValue = `%${value}%`;
  const queryParams = Array(6).fill(searchValue);

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/complements");
    }

    res.render("administration/complements/showComplements", {
      title: "Complementos",
      complements: results,
      searchValue: value,
    });
  });
};

module.exports = complementsController;
