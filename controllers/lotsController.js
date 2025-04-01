const connection = require("../config/db");
const lotsController = {};
const table = "lotes";
const qrcode = require("qrcode");

const queries = require("../controllers/queries/queriesLotsController");

const traceability = (id) => {
  return new Promise((resolve, reject) => {
    const ids = Array(8).fill(id);
    const query = queries.searchProductsTraceability;

    connection.query(query, ids, (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        reject(err);
      } else {
        if (
          results.length > 0 &&
          results[0].Proveedor &&
          results[0].Categorias
        ) {
          resolve(results[0]);
        } else {
          resolve(undefined);
        } // Devolvemos el primer resultado
      }
    });
  });
};

const providerId = (name) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id_proveedor FROM proveedores WHERE nombre_empresa = ?;`;
    connection.query(query, name, (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        reject(err);
      } else {
        // Verificar si results tiene al menos un elemento
        if (results.length > 0 && results[0].id_proveedor) {
          resolve(results[0].id_proveedor);
        } else {
          resolve(undefined);
        }
      }
    });
  });
};

const nameProvider = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT nombre_empresa FROM proveedores WHERE id_proveedor = ?`;
    connection.query(query, id, (err, results) => {
      if (err) {
        console.log(`Error en el servidor`);
        reject(err);
      } else {
        if (results.length > 0 && results[0].nombre_empresa) {
          resolve(results[0].nombre_empresa);
        } else {
          resolve(undefined);
        }
      }
    });
  });
};

const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

lotsController.AddLot = async (req, res) => {
  const { nombre_empresa, fecha_llegada, fecha_caducidad, descripcion } =
    req.body;
  let id_proveedor = await providerId(nombre_empresa);
  // console.log(id_proveedor);

  if (id_proveedor == undefined) {
    return res.render("administration/lots/addLot", {
      title: "Añadir lote",
      errorMessage: "No se encontro el proveedor",
    });
  }
  const query = `INSERT INTO ${table} (proveedor_id, fecha_llegada, fecha_caducidad, descripcion) VALUES (?, ?, ?, ?)`;
  connection.query(
    query,
    [id_proveedor, fecha_llegada, fecha_caducidad, descripcion],
    (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        return res.redirect("/admin/lot/add");
      }
      return res.render("administration/lots/addLot", {
        title: "Añadir lote",
        successMessage: "Lote agregado correctamente",
      });
    }
  );
};

lotsController.generateCode = async (req, res) => {
  const id_lote = req.params.id;
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);

  let values = await traceability(id_lote);
  console.log(values);

  if (values !== undefined) {
    let traceabilityCode = `${values.Proveedor}-${values.Categorias}-${year}${month}-${id_lote}`;

    const query = `UPDATE ${table} SET codigo_trazabilidad = ? WHERE id_lote = ?`;

    connection.query(query, [traceabilityCode, id_lote], (err, results) => {
      if (err) {
        console.log(`Error en el servidor`);
        return res.redirect("/admin/lots/add");
      }
      return res.redirect("/admin/lots");
    });
  } else {
    return res.render("administration/lots/addLot", {
      title: "Añadir lote",
      errorMessage: "No hay productos en el lote",
    });
  }
};

lotsController.showLots = (req, res) => {
  const query = `SELECT
    l.id_lote,
    l.codigo_trazabilidad,
    l.proveedor_id,
    p.nombre_empresa AS nombre_proveedor,
    l.fecha_llegada,
    l.fecha_caducidad,
    l.descripcion
FROM
    ${table} l
LEFT JOIN
    proveedores p ON l.proveedor_id = p.id_proveedor;`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/lots");
    }
    // console.log(results);
    return res.render("administration/lots/showAllLots", {
      title: "Lotes",
      lots: results,
    });
  });
};

lotsController.showProductsInLots = (req, res) => {
  const { id } = req.params;
  const query = queries.showProductsInLots;
  // console.log(id);
  const params = Array(7).fill(id);
  connection.query(query, params, (err, results) => {
    //console.log(results);
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/lots");
    }

    console.log(results);
    if (results.length === 0) {
      res.render("administration/lots/showProducts", {
        title: "Productos en lote",
        errorMessage: "No hay productos en este lote",
        lots: [],
      });
    }

    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla_origen
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla_origen: formattedTabla,
      };
    });
    // console.log(formattedResults);

    return res.render("administration/lots/showProducts", {
      title: "Productos en lote",
      lots: formattedResults,
    });
  });
};

lotsController.editLot = async (req, res) => {
  const lote_id = req.params.id;
  const proveedor_id = req.params.provider;

  let nombre_proveedor = await nameProvider(proveedor_id);
  // console.log(nombre_proveedor);

  const query = `SELECT * FROM ${table} WHERE id_lote = ?`;

  connection.query(query, lote_id, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/lots");
    }
    // console.log(results[0]);

    res.render("administration/lots/editLot", {
      title: "Editar lote",
      lot: {
        id_lote: results[0].id_lote,
        codigo_trazabilidad: results[0].codigo_trazabilidad,
        proveedor_id: results[0].proveedor_id,
        fecha_llegada: results[0].fecha_llegada
          ? formatDate(results[0].fecha_llegada)
          : "",
        fecha_caducidad: results[0].fecha_caducidad
          ? formatDate(results[0].fecha_caducidad)
          : "",
        descripcion: results[0].descripcion,
      },
      nameProvider: nombre_proveedor,
    });
  });
};

lotsController.saveLot = async (req, res) => {
  const id_lote = req.params.id;
  const { nombre_empresa, fecha_llegada, fecha_caducidad, descripcion } =
    req.body;

  const query = `UPDATE ${table} SET proveedor_id  = ?, fecha_llegada = ?, fecha_caducidad = ?, descripcion = ? WHERE id_lote = ? `;
  let proveedor_id = await providerId(nombre_empresa);

  if (proveedor_id == undefined) {
    return res.render("administration/lots/editLot", {
      title: "Editar lote",
      errorMessage: "Introduzca un proveedor valido",
      lot: {
        id_lote,
        fecha_llegada,
        fecha_caducidad,
        descripcion,
      },
      nameProvider: nombre_empresa,
    });
  }
  connection.query(
    query,
    [proveedor_id, fecha_llegada, fecha_caducidad, descripcion, id_lote],
    (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        return res.redirect("/admin/lots");
      }
      return res.render("administration/lots/editLot", {
        title: "Editar lote",
        successMessage: "Lote actualizado correctamente",
        lot: {
          id_lote: "",
          fecha_llegada: "",
          fecha_caducidad: "",
          descripcion: "",
        },
        nameProvider: "",
      });
    }
  );
};

lotsController.deleteLot = (req, res) => {
  const id_lote = req.params.id;
  const query = `DELETE FROM ${table} WHERE id_lote = ?`;

  connection.query(query, id_lote, (err, results) => {
    if (err) {
      console.log(`Erroe en el servidor ${err}`);
      return res.redirect("/admin/lots");
    }
    return res.redirect("/admin/lots");
  });
};

const generateQrCode = async (productDataObj) => {
  if (!productDataObj || typeof productDataObj !== "object") {
    console.error("generateQrCode recibió datos inválidos:", productDataObj);
    throw new Error("Datos inválidos proporcionados para generar QR.");
  }
  // console.log(productDataObj);

  const qrContent = {
    lotId: productDataObj.id_lote,
    codeTrazeability: productDataObj.codigo_trazabilidad,
    dateCa: productDataObj.fecha_caducidad,
    tipe: "lote",
  };
  // console.log("Datos para qr lotes");
  // console.log(qrContent);

  const qrString = JSON.stringify(qrContent);
  // console.log(`Contenido para qrCode ${qrString}`);

  if (qrString === "{}" || !qrContent.lotId) {
    console.warn(
      "El contenido del QR parece estar vacío o incompleto:",
      qrContent
    );
  }

  try {
    const qrDataUrl = await qrcode.toDataURL(qrString);
    console.log(qrDataUrl);

    return qrDataUrl;
  } catch (error) {
    console.error(`Error al generar qr ${error}`);
    throw new Error("No se pudo generar el código QR.");
  }
};

lotsController.verifyTag = (req, res) => {
  const id = req.params.id;

  const getProductDataQuery = `SELECT * FROM ?? WHERE id_lote = ?`;

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
      console.log(productData);

      const idProductoParaEtiqueta = productData.id_lote;
      // console.log(idProductoParaEtiqueta);

      const findEtiquetaQuery = `SELECT codigo_qr FROM etiquetas WHERE no_lote = ? LIMIT 1`;

      console.log(
        `Buscando etiqueta existente para no_lote ${idProductoParaEtiqueta}`
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
            // console.log(
            //   `Etiqueta encontrada para id_complemento ${idProductoParaEtiqueta}.`
            // );
            res.render("administration/lots/showTag", {
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
            res.render("administration/lots/generateTag", {
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

lotsController.generateTag = (req, res) => {
  const id = req.params.id;

  if (!table) {
    console.error(`Error: Categoría inválida "${category}"`);
    return res.redirect("/admin/products");
  }

  const query = `SELECT * FROM ?? WHERE id_lote = ?`;

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
    const no_lote = productData.id_lote;
    console.log(productData);

    try {
      const qrCodeDataUrl = await generateQrCode(productData);
      const insertEtiquetaQuery =
        "INSERT INTO etiquetas (no_lote, lote_id, codigo_qr,tabla, fecha_creacion) VALUES (?, ?, ?, ? , NOW())";
      connection.query(
        insertEtiquetaQuery,
        [no_lote, productData.lote_id, qrCodeDataUrl, table],
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

      return res.render("administration/lots/showTag", {
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

module.exports = lotsController;
