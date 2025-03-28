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

module.exports = historyController;
