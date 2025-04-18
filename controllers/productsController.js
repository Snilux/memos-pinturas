const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const connection = require("../config/db");
const queries = require("./queries/queriesProductsController");
const qrcode = require("qrcode");
const productsController = {};

const categoriaMap = {
  "Pinturas Automotrices": "pinturas_automotrices",
  "Pinturas Arquitectónicas": "pinturas_arquitectonicas",
  "Pinturas en Aerosol": "pinturas_en_aerosol",
  "Pinturas Industriales": "pinturas_industriales",
  "Adhesivos y Colorantes": "adhesivos_y_colorantes",
  "Pinturas para Madera": "pinturas_para_madera",
};

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

productsController.ShowAllProducts = (req, res) => {
  // console.log(req.originalUrl);
  const showAllProductsQuery = queries.showAllProductsQuery;
  connection.query(showAllProductsQuery, (err, results) => {
    // console.log(results);

    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    } else {
      res.render("administration/products/showProducts", {
        title: `Productos`,
        data: req.session.user,
        products: results,
        type: "",
      });
    }
  });
};

const verifyLotExists = async (lote_id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) AS count FROM lotes WHERE id_lote = ?`;
    connection.query(query, [lote_id], (err, results) => {
      if (err) {
        console.error("Error al verificar el lote:", err);
        return reject(err);
      }
      if (results[0].count > 0) {
        resolve(true); // El lote existe
      } else {
        resolve(false); // El lote no existe
      }
    });
  });
};

productsController.add = async (req, res) => {
  console.log(req.body);

  let imagePath = null;
  if (req.file) {
    imagePath = req.file.filename;
    console.log("Ruta de la imagen:", imagePath);
  } else {
    imagePath = req.body.currentImagePath;
    console.log("Ruta de la imagen actual:", imagePath);
  }
  const {
    tabla_categoria,
    nombre,
    color_nombre,
    color_hex,
    codigo_pintura,
    cantidad_caja,
    cantidad_litros,
    lote_id,
    precio_compra,
    precio_venta,
    cantidad,
    subcategoria,
    nombre_proveedor,
  } = req.body;

  const tabla = categoriaMap[tabla_categoria];

  let loteExists = await verifyLotExists(lote_id);

  if (!loteExists) {
    console.log("El lote no existe en la base de datos.");
    return res.render("administration/products/addProduct", {
      title: "Añadir producto",
      data: req.session.user,
      errorMessage: "El lote no existe",
    });
  }

  if (tabla) {
    const query = `INSERT INTO ${tabla} (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, subcategoria, nombre_proveedor, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [
        nombre,
        color_nombre,
        color_hex,
        codigo_pintura,
        cantidad_caja,
        cantidad_litros,
        lote_id,
        precio_compra,
        precio_venta,
        cantidad,
        subcategoria,
        nombre_proveedor,
        imagePath,
      ],
      (err, results) => {
        if (err) {
          console.error(`Error en la consulta ${err}`);
          return res.status(500).send("Error del servidor");
        } else {
          return res.render("administration/products/addProduct", {
            title: "Añadir productos",
            data: req.session.user,
            successMessage: "El producto se agrego correctamente",
          });
        }
      }
    );
  } else {
    return res.render("administration/products/addProduct", {
      title: "Añadir productos",
      data: req.session.user,
      errorMessage: "Categoria invalida",
    });
  }
};

productsController.addDuplicateProduct = async (req, res) => {
  console.log("Request Body:", req.body);
  if (req.file) {
    console.log("Request File:", req.file);
  }

  const uploadsDir = path.join(__dirname, "../public/uploads/images");


  let imageName; 

  if (req.file) {

    console.log("Procesando nueva imagen subida...");

    const extension = path.extname(req.file.originalname);
    imageName = `${uuidv4()}${extension}`; 

    const oldPath = req.file.path; 
    const newPath = path.join(uploadsDir, imageName);

    try {
      fs.renameSync(oldPath, newPath);
      console.log("Imagen subida y renombrada a:", imageName);
    } catch (err) {
      console.error("Error al renombrar la imagen subida:", err);
      return res.render("administration/products/duplicateProduct", {
        product: {
          tabla_categoria,
          nombre,
          color_nombre,
          color_hex,
          codigo_pintura,
          cantidad_caja,
          cantidad_litros,
          lote_id,
          precio_compra,
          precio_venta,
          cantidad,
          subcategoria,
          nombre_proveedor,
          currentImagePath: req.body.currentImagePath, 
        },
        category: tabla_categoria,
        title: "Duplicar producto",
        errorMessage: `Error al procesar la imagen subida`,
        liters: cantidad_litros,
        data: req.session.user, 
      });
    }
  } else {

    console.log("Procesando copia de imagen existente...");
    const originalImage = req.body.currentImagePath; 

    if (!originalImage) {
      console.error(
        "Error: No se proporcionó currentImagePath en el body cuando no hay req.file"
      );
      return res
        .status(400)
        .send("Falta la ruta de la imagen original para duplicar.");
    }

    const originalExtension = path.extname(originalImage);
    imageName = `${uuidv4()}${originalExtension}`; 

    const originalPath = path.join(uploadsDir, originalImage);
    const newPath = path.join(uploadsDir, imageName);

    try {

      if (fs.existsSync(originalPath)) {
        fs.copyFileSync(originalPath, newPath);
        console.log("Imagen existente duplicada como:", imageName);
      } else {
        console.error(
          "Error: La imagen original a copiar no existe en:",
          originalPath
        );
        // imageName = 'default-product.png'; 

        return res
          .status(400)
          .send("La imagen original especificada no existe.");
      }
    } catch (err) {
      console.error("Error al copiar la imagen existente:", err);
      return res.status(500).send("Error al duplicar la imagen");
    }
  }

  const {
    tabla_categoria,
    nombre,
    color_nombre,
    color_hex,
    codigo_pintura,
    cantidad_caja,
    cantidad_litros,
    lote_id,
    precio_compra,
    precio_venta,
    cantidad,
    subcategoria,
    nombre_proveedor,
  } = req.body;

  const tabla = categoriaMap[tabla_categoria];
  let loteExists = false; 
  try {
    loteExists = await verifyLotExists(lote_id); 
  } catch (err) {
    console.error("Error verificando el lote:", err);
    return res.status(500).send("Error interno al verificar el lote");
  }

  if (!loteExists) {
    console.log("El lote no existe en la base de datos.");
    const imagePathToDelete = path.join(uploadsDir, imageName);
    if (fs.existsSync(imagePathToDelete)) {
      try {
        fs.unlinkSync(imagePathToDelete);
        console.log(
          "Imagen temporal/duplicada eliminada debido a lote inexistente:",
          imageName
        );
      } catch (unlinkErr) {
        console.error(
          "Error al eliminar la imagen temporal/duplicada:",
          unlinkErr
        );
      }
    }
    return res.render("administration/products/duplicateProduct", {
      product: {
        tabla_categoria,
        nombre,
        color_nombre,
        color_hex,
        codigo_pintura,
        cantidad_caja,
        cantidad_litros,
        lote_id,
        precio_compra,
        precio_venta,
        cantidad,
        subcategoria,
        nombre_proveedor,
        currentImagePath: req.body.currentImagePath, 
      },
      category: tabla_categoria,
      title: "Duplicar producto",
      errorMessage: `El lote con ID '${lote_id}' no existe. No se pudo duplicar el producto.`,
      liters: cantidad_litros,
      data: req.session.user,
    });
  }

  if (tabla) {
    const query = `INSERT INTO ${tabla} (nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, subcategoria, nombre_proveedor, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [
        nombre,
        color_nombre,
        color_hex,
        codigo_pintura,
        cantidad_caja,
        cantidad_litros,
        lote_id,
        precio_compra,
        precio_venta,
        cantidad,
        subcategoria,
        nombre_proveedor,
        imageName, 
      ],
      (err, results) => {
        if (err) {
          console.error(`Error en la consulta INSERT: ${err}`);
          const imagePathToDelete = path.join(uploadsDir, imageName);
          if (fs.existsSync(imagePathToDelete)) {
            try {
              fs.unlinkSync(imagePathToDelete);
              console.log(
                "Imagen duplicada/subida eliminada debido a error en DB:",
                imageName
              );
            } catch (unlinkErr) {
              console.error(
                "Error al eliminar la imagen tras fallo de DB:",
                unlinkErr
              );
            }
          }
          return res
            .status(500)
            .send("Error del servidor al guardar el producto");
        } else {
          console.log(
            "Producto duplicado insertado correctamente con ID:",
            results.insertId
          );
          return res.render("administration/products/addProduct", {
            title: "Añadir productos", 
            data: req.session.user,
            successMessage: "El producto se duplicó correctamente",
          });
        }
      }
    );
  } else {
    console.error("Categoría inválida recibida:", tabla_categoria);
    const imagePathToDelete = path.join(uploadsDir, imageName);
    if (fs.existsSync(imagePathToDelete)) {
      try {
        fs.unlinkSync(imagePathToDelete);
        console.log(
          "Imagen temporal/duplicada eliminada debido a categoría inválida:",
          imageName
        );
      } catch (unlinkErr) {
        console.error(
          "Error al eliminar la imagen temporal/duplicada:",
          unlinkErr
        );
      }
    }
    return res.render("administration/products/addProduct", {
      title: "Añadir productos", 
      data: req.session.user,
      errorMessage: "Categoría inválida proporcionada.",

    });
  }
};

const generateQrCode = async (productDataObj) => {
  if (!productDataObj || typeof productDataObj !== "object") {
    console.error("generateQrCode recibió datos inválidos:", productDataObj);
    throw new Error("Datos inválidos proporcionados para generar QR.");
  }
  console.log(productDataObj);

  const qrContent = {
    productId: productDataObj.id_producto,
    category: productDataObj.tableName,
    lotId: productDataObj.lote_id,
    price: productDataObj.precio_venta,
    code: productDataObj.codigo_pintura,
  };

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

productsController.verifyTag = (req, res) => {
  const { id, category } = req.params;
  const table = categoriaMap[category];

  if (!table) {
    console.error(`Error: Categoría inválida "${category}"`);
    return res
      .status(400)
      .render("error", { message: `Categoría inválida: ${category}` });
  }
  const getProductDataQuery = `SELECT * FROM ?? WHERE id_producto = ?`;

  // console.log(`Verificando etiqueta para ${table} con id_producto ${id}`);

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
      const idProductoParaEtiqueta = productData.id_producto;

      const findEtiquetaQuery = `SELECT codigo_qr FROM etiquetas WHERE producto_id = ? AND tabla = ? LIMIT 1`;

      console.log(
        `Buscando etiqueta existente para producto_id ${idProductoParaEtiqueta}`
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
              `Etiqueta encontrada para producto_id ${idProductoParaEtiqueta}.`
            );
            res.render("administration/products/showTag", {
              title: `Etiqueta Existente - ${productData.nombre || "Producto"}`,
              tagValues: productData,
              qrCodeDataUrl: existingQrCode,
              data: req.session.user,
            });
          } else {
            console.log(
              `No se encontró etiqueta para producto_id ${idProductoParaEtiqueta}.`
            );
            console.log(productData);
            res.render("administration/products/generateTag", {
              title: `Generar Etiqueta - ${productData.nombre || "Producto"}`,
              tagValues: productData,
              category: category,
              data: req.session.user,
            });
          }
        }
      );
    }
  );
};

productsController.generateTag = (req, res) => {
  const { id, category } = req.params;
  const table = categoriaMap[category];

  if (!table) {
    console.error(`Error: Categoría inválida "${category}"`);
    return res.redirect("/admin/products");
  }

  const query = `SELECT * FROM ?? WHERE id_producto = ?`;

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

    const resultsWithTable = results.map((row) => ({
      ...row,
      tableName: table,
    }));
    const productData = resultsWithTable[0];

    try {
      const qrCodeDataUrl = await generateQrCode(productData);
      const insertEtiquetaQuery =
        "INSERT INTO etiquetas (producto_id, lote_id, codigo_qr,tabla, fecha_creacion) VALUES (?, ?, ?, ? , NOW())";
      connection.query(
        insertEtiquetaQuery,
        [productData.id_producto, productData.lote_id, qrCodeDataUrl, table],
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

      return res.render("administration/products/showTag", {
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

productsController.edit = (req, res) => {
  let { id, categoria, path } = req.params;
  console.log(categoria);

  if (categoria == "Adhesivos Y Colorantes") {
    categoria = "Adhesivos y Colorantes";
  }

  const tabla =
    categoriaMap[
      Object.keys(categoriaMap).find(
        (key) => normalizarTexto(key) === normalizarTexto(categoria)
      )
    ];

  const query = `SELECT * FROM ${tabla} WHERE id_producto = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }
    console.log(results);

    res.render("administration/products/editProduct", {
      product: results[0],
      path: path,
      category: categoria,
      title: "Editar producto",
      liters: results[0].cantidad_litros,
      data: req.session.user,
    });
  });
};

productsController.save = async (req, res) => {
  const id_producto = req.params.id;
  const url = req.params.path;
  // console.log("Path del post" + path);

  // console.log(req.params);
  // console.log(req.body);

  const {
    codigo_pintura,
    precio_compra,
    precio_venta,
    cantidad,
    currentImagePath,
    lote_id,
    tabla_categoria,
    subcategoria,
    nombre,
    color_nombre,
    color_hex,
    cantidad_caja,
    nombre_proveedor,
    cantidad_litros,
  } = req.body;

  const tabla =
    categoriaMap[
      Object.keys(categoriaMap).find(
        (key) => normalizarTexto(key) === normalizarTexto(tabla_categoria)
      )
    ];
  console.log(currentImagePath);

  let loteExists = await verifyLotExists(lote_id);

  if (!loteExists) {
    console.log("El lote no existe en la base de datos.");
    return res.render("administration/products/editProduct", {
      title: "Añadir producto",
      errorMessage: "El lote no existe",
      product: {
        id_producto,
        codigo_pintura,
        precio_compra,
        precio_venta,
        cantidad,
        imagen: currentImagePath,
        lote_id,
        tabla_categoria,
        subcategoria,
        nombre,
        color_nombre,
        color_hex,
        cantidad_caja,
        nombre_proveedor,
        cantidad_litros,
      },
      path: url,
      liters: cantidad_litros,
    });
  }

  let imagePath = currentImagePath;

  try {
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

    const query = `
      UPDATE ${tabla} 
      SET 
        nombre = ?,
        color_nombre = ?,
        color_hex = ?,
        codigo_pintura = ?,
        cantidad_caja = ?,
        cantidad_litros = ?,
        lote_id = ?,
        precio_compra = ?,
        precio_venta = ?,
        cantidad = ?,
        imagen = ?,
        subcategoria = ?,
        nombre_proveedor = ?
      WHERE id_producto = ?
    `;

    // Envolver la consulta en una promesa
    await new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          nombre,
          color_nombre,
          color_hex,
          codigo_pintura,
          cantidad_caja,
          cantidad_litros,
          lote_id,
          precio_compra,
          precio_venta,
          cantidad,
          imagePath,
          subcategoria,
          nombre_proveedor,
          id_producto,
        ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);

            if (url === "products") {
              res.render("administration/products/editProduct", {
                product: results,
                category: tabla,
                title: "Editar producto",
                data: req.session.user,
                path: url,
                successMessage: "Producto editado con éxito",
                liters: "",
              });
            } else {
              res.render("administration/products/editProduct", {
                product: results,
                category: tabla,
                title: "Editar producto",
                data: req.session.user,
                path: url,
                successMessage: "Producto en lote editado con éxito",
                liters: "",
              });
            }
          }
        }
      );
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .send("Error interno del servidor al actualizar el producto.");
  }
};

productsController.delete = async (req, res) => {
  const id_producto = req.params.id;
  const categoria = req.params.categoria;

  // const tabla = categoriaMap[categoria];

  const tabla =
    categoriaMap[
      Object.keys(categoriaMap).find(
        (key) => normalizarTexto(key) === normalizarTexto(categoria)
      )
    ];

  // console.log(tabla, id_producto);

  try {
    const [rows] = await connection
      .promise()
      .query(`SELECT imagen FROM  ${tabla} WHERE id_producto = ?`, [
        id_producto,
      ]);

    if (rows.length > 0) {
      const { imagen } = rows[0];

      await connection
        .promise()
        .query(`DELETE FROM ${tabla} WHERE id_producto = ?`, [id_producto]);

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

      res.redirect("/admin/products");
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).send("Error interno del servidor al eliminar el producto.");
  }
};

productsController.duplicate = (req, res) => {
  console.log(req.params);
  const { id, categoria } = req.params;

  const tabla = categoriaMap[categoria];
  const query = `SELECT * FROM ${tabla} WHERE id_producto = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(`Error en la consulta ${err}`);
      return res.status(500).send("Error del servidor");
    }

    res.render("administration/products/duplicateProduct", {
      product: results[0],
      category: categoria,
      title: "Duplicar producto",
      liters: results[0].cantidad_litros,
      data: req.session.user,
    });
  });
};

productsController.ShowAutomobiles = (req, res) => {
  const query = `SELECT * FROM pinturas_automotrices`;
  connection.query(query, (err, results) => {
    // console.log("Resultados para automoviles");

    // console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas automotrices",
      data: req.session.user,
      type: "Pinturas Automotrices",
    });
  });
};

productsController.ShowAerosol = (req, res) => {
  const query = `SELECT * FROM pinturas_en_aerosol`;
  connection.query(query, (err, results) => {
    // console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas arosoles",
      data: req.session.user,
      type: "Pinturas en Aerosol",
    });
  });
};

productsController.ShowArchitectural = (req, res) => {
  const query = `SELECT * FROM pinturas_arquitectonicas`;
  connection.query(query, (err, results) => {
    // console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas arquitectónicas",
      data: req.session.user,
      type: "Pinturas Arquitectónicas",
    });
  });
};

productsController.ShowIndustrials = (req, res) => {
  const query = `SELECT * FROM pinturas_industriales`;
  connection.query(query, (err, results) => {
    // console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas industriales",
      data: req.session.user,
      type: "Pinturas Industriales",
    });
  });
};

productsController.ShowAdhesives = (req, res) => {
  const query = `SELECT * FROM adhesivos_y_colorantes`;
  connection.query(query, (err, results) => {
    // console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Adhesivos y colorantes",
      data: req.session.user,
      type: "Adhesivos y Colorantes",
    });
  });
};

productsController.ShowWood = (req, res) => {
  const query = `SELECT * FROM pinturas_para_madera`;
  connection.query(query, (err, results) => {
    // console.log(results);

    if (err) {
      console.log(`Error en la consulta ${err}`);
      return;
    }
    return res.render("administration/products/showProducts", {
      products: results,
      title: "Pinturas para Madera",
      data: req.session.user,
      type: "Pinturas para Madera",
    });
  });
};

productsController.searchProducts = (req, res) => {
  const { value } = req.query;
  const query = queries.searchAllProducts;
  // console.log(value);

  if (!value) {
    res.redirect("/products");
  }
  const searchTermWildcard = `%${value}%`;
  const queryParams = Array(42).fill(searchTermWildcard);

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/products");
    }
    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla: formattedTabla,
      };
    });
    console.log(formattedResults);

    res.render("administration/products/showProducts", {
      title: `Productos`,
      data: req.session.user,
      products: formattedResults,
      type: "",
    });
  });
};

module.exports = productsController;
