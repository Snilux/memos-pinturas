const connection = require("../config/db");
const historyController = {};
const table = "auditoria_editar_productos";
const table1 = "auditoria_eliminar_productos";

historyController.showMenu = (req, res) => {
  const query = `SELECT * -- Selecciona todas las columnas del resultado combinado
    FROM (
    -- Tu consulta UNION ALL original, pero añadiendo la columna de ordenación
    SELECT 'Pinturas Arquitectónicas' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_arquitectonicas

    UNION ALL

    SELECT 'Pinturas en Aerosol' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_en_aerosol

    UNION ALL

    SELECT 'Adhesivos y Colorantes' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM adhesivos_y_colorantes

    UNION ALL

    SELECT 'Pinturas Industriales' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_industriales

    UNION ALL

    SELECT 'Pinturas Automotrices' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_automotrices

    UNION ALL

    SELECT 'Pinturas para Madera' AS Tipo, id_producto, nombre, color_nombre, color_hex, codigo_pintura, cantidad_caja, cantidad_litros, lote_id, precio_compra, precio_venta, cantidad, imagen, subcategoria, nombre_proveedor -- <<< Columna de fecha/ID
    FROM pinturas_para_madera) AS TodosLosProductos -- Un alias para el resultado de la subconsulta UNION
  ORDER BY
    id_producto DESC -- Ordena por la columna de fecha, los más recientes (DESCendente) primero
  LIMIT 12; -- Limita el resultado final a 12 filas`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }

    res.render("administration/history/historyMenu", {
      title: "Historial",
      products: results,
    });
  });
};

historyController.showAllEdited = (req, res) => {
  const query = `SELECT * FROM ${table}`;
  connection.query(query, async (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }
    // console.log(results);

    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla_modificada
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla_modificada: formattedTabla,
      };
    });

    res.render("administration/history/historyEdited", {
      title: "Productos editados",
      editedProducts: formattedResults,
    });
  });
};

historyController.showAllDeleted = (req, res) => {
  const query = `SELECT * FROM ${table1}`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }
    const formattedResults = results.map((product) => {
      const formattedTabla = product.tabla_modificada
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        ...product,
        tabla_modificada: formattedTabla,
      };
    });

    // console.log(formattedResults);

    res.render("administration/history/historyRemoved", {
      title: "Productos editados",
      editedProducts: formattedResults,
    });
  });
};

historyController.deleteEdited = (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM ${table} WHERE id_auditoria = ?`;

  connection.query(query, id, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }

    res.redirect("/admin/history/edited");
  });
};

historyController.deleteRemoved = (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM ${table1} WHERE id_auditoria = ?`;

  connection.query(query, id, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }
    res.redirect("/admin/history/removed");
  });
};

historyController.showSales = (req, res) => {
  const table = "ventas";
  const query = `SELECT * FROM ?? ORDER BY id_venta DESC`;

  connection.query(query, table, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history");
    }
    console.log(results);

    res.render("administration/history/historySales", {
      title: "Historial de ventas",
      sales: results,
    });
  });
};

const recoveryIDs = (id) => {
  return new Promise((resolve, reject) => {
    const table = "ventas";
    const queryIDs = `SELECT producto_id, complemento_id FROM ?? WHERE id_venta = ?  `;

    connection.query(queryIDs, [table, id], (err, results) => {
      if (err) {
        console.log(`Error en el servidor ${err}`);
        reject(err);
      } else {
        if (!results || results.length === 0) {
          resolve({ productIDs: [], complementIDs: [] });
        } else {
          const productIDs = results.map((result) => result.producto_id);
          const complementIDs = results.map((result) => result.complemento_id);
          resolve({ productIDs, complementIDs });
        }
      }
    });
  });
};

const recoveryProducts = (itemsData) => {
  console.log("Iniciando recoveryProducts con:", itemsData);
  const suffixToTableMap = {
    ARQ: { table: "pinturas_arquitectonicas", idColumn: "id_producto" },
    AER: { table: "pinturas_en_aerosol", idColumn: "id_producto" },
    ADH: { table: "adhesivos_y_colorantes", idColumn: "id_producto" },
    IND: { table: "pinturas_industriales", idColumn: "id_producto" },
    AUT: { table: "pinturas_automotrices", idColumn: "id_producto" },
    MAD: { table: "pinturas_para_madera", idColumn: "id_producto" },
    COM: { table: "complementos", idColumn: "id_complemento" },
  };
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(itemsData) || itemsData.length === 0) {
      console.log("recoveryProducts: No hay items para procesar.");
      return resolve([]);
    }

    const queryPromises = itemsData.map((item) => {
      const { id, suffix } = item;
      const tableInfo = suffixToTableMap[suffix];

      if (!tableInfo || id == null) {
        console.warn(
          `Sufijo '${suffix}' no reconocido o ID nulo para item:`,
          item
        );
        return Promise.resolve(null);
      }

      return new Promise((resolveQuery, rejectQuery) => {
        const query = `SELECT * FROM ?? WHERE ?? = ? LIMIT 1`;
        const params = [tableInfo.table, tableInfo.idColumn, id];
        connection.query(query, params, (err, results) => {
          if (err) {
            console.error(
              `Error al consultar ${tableInfo.table} con ID ${id}:`,
              err
            );
            rejectQuery(err);
          } else {
            if (results && results.length > 0) {
              results[0].itemType = tableInfo.table;
              results[0].originalSuffix = suffix;
              resolveQuery(results[0]);
            } else {
              console.warn(
                `Item con ID ${id} y sufijo ${suffix} no encontrado en tabla ${tableInfo.table}.`
              );
              resolveQuery(null);
            }
          }
        });
      });
    });
    try {
      const allResults = await Promise.all(queryPromises);

      const foundItems = allResults.filter((result) => result !== null);

      resolve(foundItems);
    } catch (error) {
      console.error(
        "Error durante la ejecución de Promise.all en recoveryProducts:",
        error
      );
      reject(error);
    }
  });
};

historyController.showProductsInSales = async (req, res) => {
  const { id } = req.params;
  try {
    const ids = await recoveryIDs(id);

    const productsArray = [];
    const complementsArray = [];

    if (
      ids &&
      Array.isArray(ids.productIDs) &&
      ids.productIDs.length > 0 &&
      ids.productIDs[0]
    ) {
      const productIdsString = ids.productIDs[0];
      const productItems = productIdsString.split(",");

      productItems.forEach((itemString) => {
        const trimmedItem = itemString.trim();
        if (trimmedItem) {
          const parts = trimmedItem.split("+");
          if (parts.length === 2) {
            const parsedId = parseInt(parts[0], 10);
            const suffix = parts[1];
            if (!isNaN(parsedId) && suffix) {
              productsArray.push({ id: parsedId, suffix: suffix });
            } else {
              console.warn(`Formato inválido en producto: '${trimmedItem}'`);
            }
          } else {
            console.warn(
              `Formato inválido en producto (sin '+'): '${trimmedItem}'`
            );
          }
        }
      });
    } else {
      console.log("No se encontraron IDs de productos para procesar.");
    }

    if (
      ids &&
      Array.isArray(ids.complementIDs) &&
      ids.complementIDs.length > 0 &&
      ids.complementIDs[0]
    ) {
      const complementIdsString = ids.complementIDs[0];
      const complementItems = complementIdsString.split(",");

      complementItems.forEach((itemString) => {
        const trimmedItem = itemString.trim();
        if (trimmedItem) {
          const parts = trimmedItem.split("+");
          if (parts.length === 2) {
            const parsedId = parseInt(parts[0], 10);
            const suffix = parts[1];
            if (!isNaN(parsedId) && suffix) {
              complementsArray.push({ id: parsedId, suffix: suffix });
            } else {
              console.warn(`Formato inválido en complemento: '${trimmedItem}'`);
            }
          } else {
            console.warn(
              `Formato inválido en complemento (sin '+'): '${trimmedItem}'`
            );
          }
        }
      });
    } else {
      console.log("No se encontraron IDs de complementos para procesar.");
    }

    // console.log("Array de Productos Procesado:", productsArray);
    // console.log("Array de Complementos Procesado:", complement sArray);
    const allItemsToRecover = [...productsArray, ...complementsArray];

    products = await recoveryProducts(allItemsToRecover);
    console.log("Detalles completos recuperados:", products);

    res.render("administration/history/historyProductsInSales", {
      title: "Detalles de venta",
      products: products,
      saleId: id,
    });
  } catch (error) {
    console.error("Error en historyController.showProductsInSales:", error);
    return res.redirect("/admin/history/sales");
  }
};

historyController.deleteSale = (req, res) => {
  const id = req.params.id;
  const table = "ventas";
  const query = `DELETE FROM ?? WHERE id_venta = ?`;

  connection.query(query, [table, id], (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history/sales");
    }

    res.redirect("/admin/history/sales");
  });
};

historyController.deleteEditedAll = (req, res) => {
  const table = "auditoria_editar_productos";
  const query = `TRUNCATE TABLE ??`;

  connection.query(query, table, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history/edited");
    }
    res.redirect("/admin/history/edited");
  });
};
historyController.deleteDeletedAll = (req, res) => {
  const table = "auditoria_eliminar_productos";
  const query = `TRUNCATE TABLE ??`;

  connection.query(query, table, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history/edited");
    }
    res.redirect("/admin/history/removed");
  });
};

historyController.deleteAllSales = (req, res) => {
  const table = "ventas";
  const query = `TRUNCATE TABLE ??`;

  connection.query(query, table, (err, results) => {
    if (err) {
      console.log(`Error en el servidor ${err}`);
      return res.redirect("/admin/history/sales");
    }
    res.redirect("/admin/history/sales");
  });
};

module.exports = historyController;
